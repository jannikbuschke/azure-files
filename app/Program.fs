namespace AzureFiles

open System.Threading
open System.Threading.Channels
open System.Threading.Tasks
open Glow.Azure
open Microsoft.AspNetCore.Authentication.Cookies
open Microsoft.AspNetCore.Http
open Marten
open System
open System.Reflection
open Microsoft.AspNetCore.Builder
open Microsoft.AspNetCore.Hosting
open Microsoft.Extensions.Configuration
open Microsoft.Extensions.DependencyInjection
open Microsoft.Extensions.Hosting
open Microsoft.Extensions.Logging
open Serilog
open Glow.Core
open Glow.Tests
open Glow.Azdo.Authentication
open Glow.TypeScript
open Glow.Azure.AzureKeyVault
open Microsoft.AspNetCore.Mvc
open Glow.Hosting

#nowarn "20"

module Program =
  open Glow

  let exitCode = 0

  [<EntryPoint>]
  let main args =
    Log.Logger <-
      LoggerConfiguration()
        .WriteTo.Console()
        .WriteTo.File("logs/log.txt")
        .CreateLogger()

    let builder = WebApplication.CreateBuilder(args)

    // TODO add KeyVault

    builder.Logging.ClearProviders()
    builder.Logging.AddSerilog()

    let services = builder.Services

    services.AddControllers()

    let assemblies =
      [| Assembly.GetEntryAssembly()
         typedefof<GlowModuleAzure>.Assembly |]

    services.AddGlowApplicationServices(null, null, assemblies)
    services.AddAzureKeyvaultClientProvider()

    services.AddTypescriptGeneration [| TsGenerationOptions(Assemblies = assemblies, Path = "./web/src/ts-models/", GenerateApi = true) |]

    // replace with glow authentication
    let authScheme =
      CookieAuthenticationDefaults.AuthenticationScheme


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

    services.AddTestAuthentication()
    services.AddResponseCaching()

    let connectionString =
      builder.Configuration.Item("ConnectionString")

    let options = StoreOptions()
    options.Connection connectionString
    //    options.AutoCreateSchemaObjects <- true // if is development
    services
      .AddMarten(options)
      .UseLightweightSessions()

    builder.AddKeyVaultAsConfigurationProviderIfNameConfigured()

    builder.Services.AddGlowAadIntegration(builder.Environment, builder.Configuration)


    let channelOptions = UnboundedChannelOptions()
    //    channelOptions.SingleReader <- true
    services.AddSingleton<Channel<string>>(Channel.CreateUnbounded<string>())
    services.AddSingleton<ChannelReader<string>>(fun svc -> svc.GetRequiredService<Channel<string>>().Reader)
    services.AddSingleton<ChannelWriter<string>>(fun svc -> svc.GetRequiredService<Channel<string>>().Writer)

    services.AddSingleton<Channel<UnitOfWork>>(Channel.CreateUnbounded<UnitOfWork>())

    services.AddSingleton<ChannelReader<UnitOfWork>>
      (fun svc ->
        svc
          .GetRequiredService<Channel<UnitOfWork>>()
          .Reader)

    services.AddSingleton<ChannelWriter<UnitOfWork>>
      (fun svc ->
        svc
          .GetRequiredService<Channel<UnitOfWork>>()
          .Writer)

    //    services.AddSingleton(BackgroundTaskQueue(100))
    services.AddHostedService<ScanFiles.Service>()
    services.AddHostedService<QueuedHostedService>()

    services.AddAuthorization(fun options -> options.AddPolicy("Authenticated", (fun v -> v.RequireAuthenticatedUser() |> ignore)))

    let app = builder.Build()

    let env =
      app.Services.GetService<IWebHostEnvironment>()

    let configuration =
      app.Services.GetService<IConfiguration>()

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

    app.Run()

    exitCode
