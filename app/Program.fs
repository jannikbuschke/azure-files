namespace AzureFiles

open System.Net
open System.Threading.Channels
open System.Threading.Tasks
open AzFiles.Config
open AzFiles.InboxService
open Glow
open Glow.Core.MartenSubscriptions
open Glow.Core.Profiles
open Marten.Events.Daemon.Resiliency
open Marten.Events.Projections
open Marten.Services
open Microsoft.AspNetCore.Authentication.Cookies
open Microsoft.AspNetCore.Http
open Marten
open System
open System.Reflection
open Microsoft.AspNetCore.Builder
open Microsoft.AspNetCore.Hosting
open Microsoft.AspNetCore.SignalR
open Microsoft.Extensions.Configuration
open Microsoft.Extensions.DependencyInjection
open Microsoft.Extensions.Hosting
open Microsoft.Extensions.Logging
open Serilog
open Glow.Core
open Glow.Tests
open Weasel.Core
open Glow.Core.Notifications
open FsToolkit.ErrorHandling
open Glow.Azure.AzureKeyVault

#nowarn "20"

module Program =

  type NotificationHub() =
    inherit Hub()

  let buildApp (args: string array) =
    let builder = WebApplication.CreateBuilder(args)

    // builder.Host.AddSerilog()

    // TODO add KeyVault

    builder.Logging.ClearProviders()
    builder.Logging.AddSerilog()

    let services = builder.Services

    services.AddControllers()

    let assemblies =
      [| Assembly.GetEntryAssembly()
         typedefof<GetProfileHandler>.Assembly
         typedefof<Glow.Core.MartenAndPgsql.GetEventsHandler2>
           .Assembly |]
    //
    services.AddGlowApplicationServices(null, null, JsonSerializationStrategy.SystemTextJson, assemblies)
    services.AddAzureKeyvaultClientProvider()

    services.AddGlowNotifications<NotificationHub>()

    Glow.Core.TsGen.Generate2.renderTsTypesFromAssemblies assemblies "./web/src/client/"

    // Glow.Core.TsGen.Generate2.renderTsTypesFromAssemblies
    //   [|
    //      // typedefof<GlowModuleAzure>.Assembly
    //      typedefof<Glow.Core.MartenAndPgsql.GetDocuments>
    //        .Assembly |]
    //   "..//glow//glow.mantine-web//src/client/"

    let authScheme = CookieAuthenticationDefaults.AuthenticationScheme

    let cookieAuth (o: CookieAuthenticationOptions) =
      do
        o.Cookie.HttpOnly <- true
        o.Cookie.SecurePolicy <- CookieSecurePolicy.SameAsRequest
        o.SlidingExpiration <- true
        o.ExpireTimeSpan <- TimeSpan.FromDays 7.0

    services
      .AddAuthentication(authScheme)
      .AddCookie(cookieAuth)
    // .AddAzdoClientServices(fun options ->
    //   options.Pat <- builder.Configuration.Item("azdo:Pat")
    //   options.OrganizationBaseUrl <- builder.Configuration.Item("azdo:OrganizationBaseUrl"))
    |> ignore

    services.AddHostedService<LobbyBackgroundService>()

    let connectionStrings =
      builder
        .Configuration
        .GetSection("ConnectionStrings")
        .GetSection(builder.Environment.EnvironmentName)
        .Get<ConnectionStrings>()

    services.AddSingleton(connectionStrings)

    services.AddTransient<IWebRequestContext> (fun v ->
      let httpContext =
        v
          .GetRequiredService<IHttpContextAccessor>()
          .HttpContext

      let session = v.GetRequiredService<IDocumentSession>()
      let configuration = v.GetRequiredService<IConfiguration>()

      let getSrcContainer =
        fun () -> BlobService.getBlobContainerClientByName connectionStrings.AzureBlob "src"

      let getInboxContainer =
        fun () -> BlobService.getBlobContainerClientByName connectionStrings.AzureBlob "inbox"

      let getVariantsContainer =
        fun () -> BlobService.getBlobContainerClientByName connectionStrings.AzureBlob "img-variants"

      { new IWebRequestContext with
          member this.GetLogger<'T>() = v.GetRequiredService<ILogger<'T>>()
          member this.HttpContext = httpContext
          member this.UserId = None
          member this.DocumentSession = session
          member this.GetSrcContainer = getSrcContainer
          member this.GetInboxContainer = getInboxContainer
          member this.GetVariantsContainer = getVariantsContainer
          member this.Configuration = configuration }
    // UserId: string option
    // DocumentSession: IDocumentSession
    // GetRootContainer: GetContainer
    // GetInboxContainer: GetContainer
    )

    services.AddTestAuthentication()
    services.AddResponseCaching()

    let marten =
      services
        .AddMarten(
          FuncConvert.FromFunc (fun (sp: IServiceProvider) ->
            let options = StoreOptions()
            options.Connection(connectionStrings.Db)

            options
              .Projections
              .SelfAggregate<LobbyItem>(Events.Projections.ProjectionLifecycle.Async)
              .DocumentAlias("lobby")

            options
              .Projections
              .SelfAggregate<FileProjection>(Events.Projections.ProjectionLifecycle.Inline)
              .DocumentAlias("file")

            let logger = sp.GetService<ILogger<MartenSubscription>>()

            options.Events.AddEventType(typeof<LobbyEvent>)

            // options.Projections.Add(
            //   MartenSubscription([| UserEventPublisher(sp) |], logger),
            //   ProjectionLifecycle.Async,
            //   "customConsumer"
            // )

            let serializer = SystemTextJsonSerializer()

            serializer.Customize(fun v -> JsonSerializationSettings.ConfigureStjSerializerDefaultsForWeb(v))
            options.Serializer(serializer)

            options.AutoCreateSchemaObjects <- AutoCreate.CreateOrUpdate // if is development
            options)
        )
        .AddAsyncDaemon(DaemonMode.HotCold)
        .UseLightweightSessions()

    // builder.AddKeyVaultAsConfigurationProviderIfNameConfigured()

    // builder.Services.AddGlowAadIntegration(builder.Environment, builder.Configuration)

    services.AddAuthorization (fun options ->
      options.AddPolicy("Authenticated", (fun v -> v.RequireAuthenticatedUser() |> ignore))
      options.AddPolicy("admin", (fun v -> v.RequireAuthenticatedUser() |> ignore)))

    let workspaces: Workspace list =
      builder
        .Configuration
        .GetSection("Workspaces")
        .GetChildren()
      |> Seq.map (fun v ->
        let ws: Workspace =
          { Name = v.GetValue<string>("Name")
            Container = v.GetValue<string>("Container") }

        ws)
      |> Seq.toList

    let workspace =
      workspaces
      |> List.find (fun v -> v.Name = builder.Environment.EnvironmentName)

    services.AddSingleton(workspaces)
    services.AddSingleton(workspace)

    builder

  let exitCode = 0

  [<EntryPoint>]
  let main args =

    Log.Logger <-
      LoggerConfiguration()
        .WriteTo.Console()
        .WriteTo.File("logs/log.txt")
        .CreateLogger()

    Log.Logger.Information("Starting application")

    let app = buildApp(args).Build()

    let env = app.Services.GetService<IWebHostEnvironment>()

    Log.Logger.Information(sprintf "Environment  = %s" env.EnvironmentName)
    Log.Logger.Information(sprintf "Application  = %s" env.ApplicationName)
    Log.Logger.Information(sprintf "Content root = %s" env.ContentRootPath)
    Log.Logger.Information(sprintf "Web root     = %s" env.WebRootPath)

    let configuration = app.Services.GetService<IConfiguration>()

    Log.Logger.Information "Reconfigure logger"

    Log.Logger <-
      LoggerConfiguration()
        .ReadFrom.Configuration(configuration)
        // .WriteTo.Console()
//                .WriteTo.File("logs/log.txt")
        .CreateLogger()

    Log.Logger.Information "Logger reconfigured"

    app.UseResponseCaching()


    // formery app.UseGlow(env, configuration, (fun options -> options.SpaDevServerUri <- "http://localhost:3000"))
    app.AddGlowErrorHandler(env, configuration)

    app.UseRouting()

    app.UseAuthentication()
    app.UseAuthorization()

    app.UseEndpoints(fun routes -> routes.MapControllers() |> ignore)

    app.Map(
      "/api",
      fun (app: IApplicationBuilder) ->
        app.Run (fun ctx ->
          task {
            ctx.Response.StatusCode <- int HttpStatusCode.NotFound
            do! ctx.Response.WriteAsync("Not found")
          })
    )

    app.UseStaticFiles()
    app.UseSpaStaticFiles()

    app.UseSpa (fun spa ->
      spa.Options.SourcePath <- "web"

      // if (env.IsDevelopment()) then
      spa.UseProxyToSpaDevelopmentServer("http://localhost:3000"))

    app.MapPost(
      "/upload",
      Func<HttpContext, Task<unit>> (fun (requestContext: HttpContext) ->
        async {
          let ctx = requestContext.RequestServices.GetRequiredService<IWebRequestContext>()

          let serviceProvider =
            requestContext.RequestServices.GetRequiredService<IServiceProvider>()

          let logger = ctx.GetLogger<obj>()
          logger.LogInformation("handle upload form files {@formfiles}", ctx.HttpContext.Request.Form.Files)

          // let validateAndUpload = x ctx serviceProvider

          let! init =
            ctx.HttpContext.Request.Form.Files
            |> Seq.map Workflow.initiallyHandleFormFile
            |> Seq.map (AzFiles.FileUploads.validateAndUpload ctx serviceProvider)
            |> fun x -> x, 5
            |> Async.Parallel

          return ()
        }
        |> Async.StartAsTask)
    )

    app.MapHub<NotificationHub>("/notifications")

    let martenStore = app.Services.GetService<IDocumentStore>()

    task {
      // if env.IsDevelopment() && true then
      // do! martenStore.Advanced.Clean.CompletelyRemoveAllAsync()
      // do! martenStore.Storage.ApplyAllConfiguredChangesToDatabaseAsync()

      // let! daemon = martenStore.BuildProjectionDaemonAsync()
      // let token = CancellationToken()
      // do! daemon.RebuildProjection<FileAggregate>(token)
      app.Run()

      return exitCode
    }
    |> Async.AwaitTask
    |> Async.RunSynchronously