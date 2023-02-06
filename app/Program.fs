namespace AzureFiles

open System.Text.Json.Serialization
open System.Threading
open System.Threading.Channels
open Glow
open Glow.Azure
open Glow.Core.MartenSubscriptions
open Glow.core.fs.MartenAndPgsql.EventPublisher
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
open Glow.Azdo.Authentication
open Glow.Azure.AzureKeyVault
open Glow.Hosting
open Weasel.Core
open Glow.Core.Notifications

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
         typedefof<GlowModuleAzure>.Assembly
         typedefof<Glow.Core.MartenAndPgsql.GetDocuments>
           .Assembly |]

    services.AddGlowApplicationServices(null, null, JsonSerializationStrategy.SystemTextJson, assemblies)
    services.AddAzureKeyvaultClientProvider()

    services.AddGlowNotifications<NotificationHub>()

    Glow.Core.TsGen.Generate2.renderTsTypesFromAssemblies assemblies "./web/src/client/"

    Glow.Core.TsGen.Generate2.renderTsTypesFromAssemblies
      [| typedefof<GlowModuleAzure>.Assembly
         typedefof<Glow.Core.MartenAndPgsql.GetDocuments>
           .Assembly |]
      "..//glow//glow.mantine-web//src/client/"
    // services.AddTypescriptGeneration [| TsGenerationOptions(
    //                                       Assemblies = assemblies,
    //                                       Path = "./web/src/ts-models/",
    //                                       GenerateApi = true,
    //                                       ApiOptions = ApiOptions(ApiFileFirstLines = ResizeArray())
    //                                     ) |]

    // replace with glow authentication
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
      .AddAzdoClientServices(fun options ->
        options.Pat <- builder.Configuration.Item("azdo:Pat")
        options.OrganizationBaseUrl <- builder.Configuration.Item("azdo:OrganizationBaseUrl"))
    |> ignore


    services.AddTransient<WebRequestContext> (fun v ->
      let httpContext =
        v
          .GetRequiredService<IHttpContextAccessor>()
          .HttpContext

      let session = v.GetRequiredService<IDocumentSession>()
      let configuration = v.GetRequiredService<IConfiguration>()

      let getSrcContainer =
        fun () -> BlobService.getBlobContainerClientByName configuration "src"

      let getInboxContainer =
        fun () -> BlobService.getBlobContainerClientByName configuration "inbox"

      let getVariantsContainer =
        fun () -> BlobService.getBlobContainerClientByName configuration "img-variants"

      { HttpContext = httpContext
        UserId = None
        DocumentSession = session
        GetSrcContainer = getSrcContainer
        GetInboxContainer = getInboxContainer
        GetVariantsContainer = getVariantsContainer
        Configuration = configuration
      // UserId: string option
      // DocumentSession: IDocumentSession
      // GetRootContainer: GetContainer
      // GetInboxContainer: GetContainer
      })

    services.AddTestAuthentication()
    services.AddResponseCaching()

    let connectionString = builder.Configuration.Item("ConnectionString")


    let marten =
      services
        .AddMarten(
          FuncConvert.FromFunc (fun (sp: IServiceProvider) ->
            let options = StoreOptions()
            options.Connection(connectionString)

            options
              .Projections
              .SelfAggregate<FileAggregate>(Events.Projections.ProjectionLifecycle.Inline)
              .DocumentAlias("file")

            let logger = sp.GetService<ILogger<MartenSubscription>>()

            options.Projections.Add(MartenSubscription([| UserEventPublisher(sp) |], logger), ProjectionLifecycle.Async, "customConsumer")
            let serializer = SystemTextJsonSerializer()

            serializer.Customize(fun v -> JsonSerializationSettings.ConfigureStjSerializerDefaultsForWeb(v))
            options.Serializer(serializer)

            options.AutoCreateSchemaObjects <- AutoCreate.CreateOrUpdate // if is development
            options)
        )
        .AddAsyncDaemon(DaemonMode.HotCold)
        .UseLightweightSessions()

    builder.AddKeyVaultAsConfigurationProviderIfNameConfigured()

    builder.Services.AddGlowAadIntegration(builder.Environment, builder.Configuration)

    let channelOptions = UnboundedChannelOptions()
    //    channelOptions.SingleReader <- true
    services.AddSingleton<Channel<string>>(Channel.CreateUnbounded<string>())
    services.AddSingleton<ChannelReader<string>>(fun svc -> svc.GetRequiredService<Channel<string>>().Reader)
    services.AddSingleton<ChannelWriter<string>>(fun svc -> svc.GetRequiredService<Channel<string>>().Writer)

    services.AddSingleton<Channel<UnitOfWork>>(Channel.CreateUnbounded<UnitOfWork>())

    services.AddSingleton<ChannelReader<UnitOfWork>> (fun svc ->
      svc
        .GetRequiredService<Channel<UnitOfWork>>()
        .Reader)

    services.AddSingleton<ChannelWriter<UnitOfWork>> (fun svc ->
      svc
        .GetRequiredService<Channel<UnitOfWork>>()
        .Writer)

    //    services.AddSingleton(BackgroundTaskQueue(100))
    services.AddHostedService<ScanFiles.Service>()
    services.AddHostedService<QueuedHostedService>()

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
      workspaces |> List.find (fun v -> v.Name = builder.Environment.EnvironmentName)

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

    let app = buildApp(args).Build()

    let env = app.Services.GetService<IWebHostEnvironment>()

    let configuration = app.Services.GetService<IConfiguration>()

    Log.Logger.Information "Reconfigure logger"

    Log.Logger <-
      LoggerConfiguration()
        .ReadFrom.Configuration(configuration)
        // .WriteTo.Console()
//                .WriteTo.File("logs/log.txt")
        .CreateLogger()

    Log.Logger.Information "logger reconfigured"

    app.UseResponseCaching()

    app.UseGlow(env, configuration, (fun options -> options.SpaDevServerUri <- "http://localhost:3000"))
    app.MapHub<NotificationHub>("/notifications")

    let martenStore = app.Services.GetService<IDocumentStore>()

    task {
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
