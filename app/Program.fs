namespace AzFiles

open System.Threading
open System.Threading.Tasks
open AzFiles.Config
open AzFiles.DbMigrate
open AzFiles.InboxService
open AzFiles.LowresVariantCreator
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
open System
open Giraffe

#nowarn "20"

type D = delegate of unit -> string

module Program =

  let initializeMarten (connectionString: string) (serializer: SystemTextJsonSerializer) =
    FuncConvert.FromFunc (fun (sp: IServiceProvider) ->
      let options = StoreOptions()
      options.Connection(connectionString)

      options
        .Projections
        .Snapshot<LobbyItem>(SnapshotLifecycle.Async)
        .DocumentAlias("lobby")
      // options
      //   .Projections
      //   .SelfAggregate<LobbyItem>(Events.Projections.ProjectionLifecycle.Async)
      //   .DocumentAlias("lobby")

      options
        .Projections
        .Snapshot<FileHandledProjection>(SnapshotLifecycle.Inline)
        .DocumentAlias("file_handled")

      options
        .Projections
        .Snapshot<FileProjection>(SnapshotLifecycle.Inline)
        .DocumentAlias("file")

      if sp <> null then
        let logger = sp.GetService<ILogger<MartenSubscription>>()
        // options.Projections.Add(
        //   MartenSubscription([| UserEventPublisher(sp) |], logger),
        //   ProjectionLifecycle.Async,
        //   "customConsumer"
        // )
        ()

      options.Events.AddEventType(typeof<LobbyEvent>)

      options.Serializer(serializer)

      options.AutoCreateSchemaObjects <- AutoCreate.CreateOrUpdate // if is development
      options)

  type NotificationHub() =
    inherit Hub()

  let migrate (connectionStrings: ConnectionStrings) (appBuilder: WebApplicationBuilder) =
    task {

      let persistenceSerializer = SystemTextJsonSerializer()

      persistenceSerializer.Customize (fun v ->
        v.WriteIndented <- false

        v.Converters.Add(
          System.Text.Json.Serialization.JsonFSharpConverter(
            Glow.JsonSerializationSettings.JsonDefaultSerializationUnionEncoding,
            allowNullFields = false
          )
        ))

      let applyPersistenceJsonSerializerSettings () =
        task {
          let webSerializer = SystemTextJsonSerializer()

          webSerializer.Customize(fun v -> Glow.JsonSerializationSettings.ConfigureStjSerializerDefaultsForWeb(v))

          use documentStore =
            new Marten.DocumentStore((initializeMarten (connectionStrings.Db) webSerializer) (null))

          use session = documentStore.LightweightSession()

          let! events = session.Events.QueryAllRawEvents().ToListAsync()

          let result =
            events
            |> Seq.map (fun e ->
              let transaction: Transaction =
                "UPDATE public.mt_events SET data = @data WHERE id = @id",
                [ [ ("@data", Sql.jsonb (e.Data |> persistenceSerializer.ToCleanJson))
                    ("@id", (Sql.uuid (e.Id))) ] ]

              {| Command = transaction |})
            |> Seq.toList
            |> List.map (fun v -> v.Command)

          return result
        }

      let! result =
        (AzFiles.DbMigrate.conditionallyApplyMigration
          connectionStrings.Db
          "2023-07-04-00-16_ApplyPersistenceJsonSerializerToAllEvents"
          applyPersistenceJsonSerializerSettings)

      printfn "RESULT %A" result

      use documentStore =
        new Marten.DocumentStore((initializeMarten (connectionStrings.Db) persistenceSerializer) (null))

      let! daemon = documentStore.BuildProjectionDaemonAsync()
      do! daemon.StartDaemon()

      let projections =
        (documentStore :> IDocumentStore)
          .Options.Events.Projections()
        // |> Seq.filter (fun v -> v.Lifecycle = ProjectionLifecycle.Inline)
        |> Seq.map (fun v -> v.ProjectionName)
        |> Seq.toList

      // logger.LogInformation("Projections {@projections}", projections)

      for projection in projections do
        do! daemon.RebuildProjection(projection, CancellationToken())

      return ()
    }

  let addServices (connectionStrings: ConnectionStrings) (builder: WebApplicationBuilder) =
    builder.Logging.ClearProviders()
    builder.Logging.AddSerilog()

    let services = builder.Services

    services.AddGiraffe()

    services.AddCors (fun c ->

      c.AddPolicy(
        "AllowAll",
        fun p ->
          p
            .AllowAnyHeader()
            .AllowAnyMethod()
            .SetIsOriginAllowed(fun v -> true)
            .AllowCredentials()
          |> ignore
      ))

    let assemblies =
      [| Assembly.GetEntryAssembly()
         typedefof<GetProfileHandler>.Assembly
         typedefof<Glow.Core.MartenAndPgsql.GetEventsHandler2>
           .Assembly |]

    services.AddGlowApplicationServices((fun options -> ()), null, JsonSerializationStrategy.SystemTextJson, assemblies)

    services.AddAzureKeyvaultClientProvider()

    services.AddGlowNotifications<NotificationHub>()

    printfn "getting apis"

    let apis: TsGen.ApiEndpoint list =
      Glow.Core.TsGen.GetTypes.getRequests assemblies
      |> Seq.map (fun v ->
        { TsGen.ApiEndpoint.Request = v.Input
          TsGen.ApiEndpoint.Response = v.Output
          TsGen.ApiEndpoint.Method = TsGen.HttpVerb.POST
          TsGen.ApiEndpoint.Route = v.ActionAttribute.Route })
      |> Seq.toList

    let types =
      apis
      |> List.collect (fun x -> [ x.Request; x.Response ])

    printfn "configuring ts build"

    let gen =
      TsGen.Config.withDefaults ()
      |> TsGen.Config.withJsonUnionEncoding TsGen.Gen.defaultJsonUnionEncoding
      |> TsGen.Config.forTypes types
      |> TsGen.Config.withEndpoints apis
      |> TsGen.Config.build

    [
      // "./client/svelte-without-kit/src/client/"
      "./svelte-client/src/client-new/" ]
    |> Seq.map IO.Path.GetFullPath
    |> Seq.iter gen.renderTypesToDirectory

    gen.renderApiToFile "./svelte-client/src/client-new/api.ts"

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
    |> ignore

    // services.AddHostedService<LobbyBackgroundService>()
    // services.AddHostedService<VariantCreatorBackgroundService>()

    services.AddSingleton(connectionStrings)

    services.AddTransient<IWebRequestContext> (fun v ->
      let httpContext =
        v
          .GetRequiredService<IHttpContextAccessor>()
          .HttpContext

      let session = v.GetRequiredService<IDocumentSession>()
      let configuration = v.GetRequiredService<IConfiguration>()

      let getBlobServiceClient () =
        BlobService.getBlobServiceClient connectionStrings.AzureBlob

      // TODO remove task
      let getSrcContainerAsync () =
        task { return BlobService.getBlobContainerClientByName connectionStrings.AzureBlob "src" }

      let getSrcContainer () =
        BlobService.getBlobContainerClientByName connectionStrings.AzureBlob "src"
      // TODO remove task
      let getInboxContainerAsync () =
        task { return BlobService.getBlobContainerClientByName connectionStrings.AzureBlob "inbox" }

      let getInboxContainer () =
        BlobService.getBlobContainerClientByName connectionStrings.AzureBlob "inbox"
      // TODO remove task
      let getVariantsContainerAsync () =
        task { return BlobService.getBlobContainerClientByName connectionStrings.AzureBlob "img-variants" }

      let getVariantsContainer () =
        BlobService.getBlobContainerClientByName connectionStrings.AzureBlob "img-variants"

      { new IWebRequestContext with
          member this.GetLogger<'T>() = v.GetRequiredService<ILogger<'T>>()
          member this.HttpContext = httpContext
          member this.UserId = None
          member this.DocumentSession = session
          member this.GetBlobServiceClient = getBlobServiceClient
          member this.GetSrcContainerAsync = getSrcContainerAsync
          member this.GetSrcContainer = getSrcContainer
          member this.GetInboxContainerAsync = getInboxContainerAsync
          member this.GetInboxContainer = getInboxContainer
          member this.GetVariantsContainerAsync = getVariantsContainerAsync
          member this.GetVariantsContainer = getVariantsContainer
          member this.Configuration = configuration })
    //services.AddHostedService<LobbyBackgroundService>()
    //services.AddHostedService<VariantCreatorBackgroundService>()

    services.AddTestAuthentication()
    services.AddResponseCaching()

    let serializer = SystemTextJsonSerializer()
    serializer.Customize(fun v -> Glow.JsonSerializationSettings.ConfigureStjSerializerDefaultsForWeb(v))

    let persistenceSerializer = SystemTextJsonSerializer()

    persistenceSerializer.Customize (fun v ->
      v.WriteIndented <- false

      v.Converters.Add(
        System.Text.Json.Serialization.JsonFSharpConverter(
          Glow.JsonSerializationSettings.JsonDefaultSerializationUnionEncoding,
          allowNullFields = false
        )
      ))

    let marten =
      services
        .AddMarten(initializeMarten (connectionStrings.Db) persistenceSerializer)
        .AddAsyncDaemon(DaemonMode.HotCold)
        .UseLightweightSessions()

    builder.Services.AddGlowAadIntegration(builder.Environment, builder.Configuration)

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

  let connectionStrings (environmentName: string) (configuration: IConfiguration) =
    configuration
      .GetSection("ConnectionStrings")
      .GetSection(environmentName)
      .Get<ConnectionStrings>()

  let buildAppAsync (args: string array) =
    printfn "Args = %A" args
    let builder = WebApplication.CreateBuilder(args)

    let connectionStrings =
      connectionStrings builder.Environment.EnvironmentName builder.Configuration
    // builder
    //   .Configuration
    //   .GetSection("ConnectionStrings")
    //   .GetSection(builder.Environment.EnvironmentName)
    //   .Get<ConnectionStrings>()

    task {
      if args |> Seq.contains "--migrate-only" then
        do! migrate connectionStrings builder
        return None
      else
        return Some(addServices connectionStrings builder)
    }

  let exitCode = 0

  [<EntryPoint>]
  let main args =
    Log.Logger <-
      LoggerConfiguration()
        .WriteTo.Console()
        .WriteTo.File("logs/log.txt")
        .CreateLogger()

    Log.Logger.Information("Starting application")

    let app =
      buildAppAsync args
      |> Async.AwaitTask
      |> Async.RunSynchronously

    match app with
    | None -> 0
    | Some app ->
      let app = app.Build()

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
          .CreateLogger()

      Log.Logger.Information "Logger reconfigured"

      app.AddGlowErrorHandler(env, configuration)

      app.UseRouting()

      app.UseAuthentication()
      app.UseAuthorization()

      app.UseCors("AllowAll")

      configureGiraffeApp app
      app.UseEndpoints(fun routes -> routes.MapControllers() |> ignore)

      // app.Map(
      //   "/api",
      //   fun (app: IApplicationBuilder) ->
      //     app.Run (fun ctx ->
      //       task {
      //         ctx.Response.StatusCode <- int HttpStatusCode.NotFound
      //         do! ctx.Response.WriteAsync("Not found")
      //       })
      // )
      //
      app.UseStaticFiles()
      app.UseSpaStaticFiles()

      app.Map(
        "/svelte",
        fun (app: IApplicationBuilder) ->
          app.UseSpa (fun spa ->
            spa.Options.SourcePath <- "svelte-client"

            if (env.IsDevelopment()) then
              spa.UseProxyToSpaDevelopmentServer("http://localhost:5173/svelte"))
      )

      // app.UseSpa (fun spa ->
      //   spa.Options.SourcePath <- "web"
      //
      //   if env.IsDevelopment() then
      //     spa.UseProxyToSpaDevelopmentServer("http://localhost:3000"))

      app.MapGet(
        "/photos/{id}",
        Func<HttpContext, Task<IResult>> (fun (http: HttpContext) ->
          taskResult {
            let ctx = http.RequestServices.GetRequiredService<IWebRequestContext>()
            let id = http.Request.RouteValues.["id"] :?> string

            printfn "Get photo %A" id

            let! file =
              id
              |> Guid.Parse
              |> FileId.create
              |> ctx.DocumentSession.LoadFile

            return
              $"""<div style='display:flex;align-items:center;justify-items:center'><img style='max-width:95vw;max-height:95vh' src='{file.Url}' /></div>"""

          }
          |> Task.map (fun v ->
            match v with
            | Result.Ok ok -> Results.Content(ok, "text/html")
            | Result.Error err -> Results.BadRequest(err))

        )
      )

      app.MapGet(
        "/photos",
        (Func<HttpContext, Task<IResult>> (fun (http: HttpContext) ->
          task {
            let ctx = http.RequestServices.GetRequiredService<IWebRequestContext>()

            let! files =
              match http.Request.Query.TryGetValue "date" with
              | true, value -> ctx.DocumentSession.GetFilesOfDate(value)
              | false, _ ->
                match http.Request.Query.TryGetValue "dates" with
                | true, value ->
                  // TODO: return between to dates, for the weekly or monthly view
                  ctx.DocumentSession.GetFiles()
                | false, _ -> ctx.DocumentSession.GetFiles()

            let files =
              files
              // |> List.
              |> List.map (fun v ->
                let url =
                  v.LowresVersions
                  |> List.tryHead
                  |> Option.map (fun v -> v.Url)
                  |> Option.defaultValue v.Url

                $"<div style='margin:8px'><img src={url} /></div>")
              |> String.concat ""

            let imgStyle =
              """
    margin: 8px;
    object-fit: contain;
    max-width: 80vw;
    width: 80vw;
    max-height: 80vh;
"""

            let bodyStyle =
              """
body { overflow-y: scroll; }
body::-webkit-scrollbar { width: 0; height: 0; }
"""

            let content =
              $"""
<html><head><style> {bodyStyle}
img {{ {imgStyle} }}</style></head>
<body>
  <div style='display:flex;flex-direction:column; align-items:center'>{files}</div>
</body>
</html>"""

            return Results.Content(content, "text/html")

          }))
      )

      app.MapPost(
        "/upload",
        Func<HttpContext, Task<Result<unit, ApiError> list>> (fun (requestContext: HttpContext) ->
          async {
            let ctx = requestContext.RequestServices.GetRequiredService<IWebRequestContext>()

            let serviceProvider =
              requestContext.RequestServices.GetRequiredService<IServiceProvider>()

            let logger = ctx.GetLogger<obj>()

            logger.LogInformation("handle upload form files {@formfiles}", ctx.HttpContext.Request.Form.Files)

            // let validateAndUpload = x ctx serviceProvider

            let! result =
              try
                task {
                  let! init =
                    ctx.HttpContext.Request.Form.Files
                    |> Seq.map Workflow.initiallyHandleFormFile
                    |> Seq.map (AzFiles.FileUploads.validateAndUpload ctx serviceProvider)
                    |> fun x -> x, 5
                    |> Async.Parallel

                  return
                    init
                    |> Seq.map (fun v ->
                      v
                      |> Result.mapError (fun error ->
                        { ApiError.Message = ""
                          Info = Some(ErrorResult error) }))
                    |> Seq.toList
                }
                |> Async.AwaitTask
              with
              | e ->
                [ Error(
                    { ApiError.Message = e.Message
                      Info = None }
                  ) ]
                |> Task.FromResult
                |> Async.AwaitTask
            // sprintf "Error %s" e.Message
            // None

            return result
          }
          |> Async.StartAsTask)
      )

      app.MapHub<NotificationHub>("/notifications")

      let martenStore = app.Services.GetService<IDocumentStore>()

      let connectionStrings =
        connectionStrings app.Environment.EnvironmentName app.Configuration

      task {
        do! BlobService.ensureBlobContainerClientExists connectionStrings.AzureBlob "src"
        do! BlobService.ensureBlobContainerClientExists connectionStrings.AzureBlob "inbox"
        do! BlobService.ensureBlobContainerClientExists connectionStrings.AzureBlob "img-variants"

        if env.IsDevelopment() && false then
          do! martenStore.Advanced.Clean.CompletelyRemoveAllAsync()
          do! martenStore.Storage.ApplyAllConfiguredChangesToDatabaseAsync()

        // let! daemon = martenStore.BuildProjectionDaemonAsync()
        // let token = CancellationToken()
        // do! daemon.RebuildProjection<FileAggregate>(token)
        app.Run()

        return exitCode
      }
      |> Async.AwaitTask
      |> Async.RunSynchronously