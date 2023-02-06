namespace AzureFiles

open System.Threading.Channels
open AzureFiles
open Microsoft.Extensions.Logging
open System.Threading.Tasks
open Microsoft.Extensions.Hosting
open System.IO
open Microsoft.AspNetCore.Hosting
open Microsoft.Extensions.DependencyInjection
open FSharp.Control
open System
open Glow.Hosting

module ScanFiles =

  let scanAndHandleWwwDirectory (services: IServiceProvider) =
    async {

      let configuration =
        services.GetService<Microsoft.Extensions.Configuration.IConfiguration>()

      let loggerFactory =
        services.GetService<ILoggerFactory>()

      let logger =
        loggerFactory.CreateLogger("initial.handle.files")

      let env =
        services.GetService<IWebHostEnvironment>()

      let path =
        Path.Combine(env.ContentRootPath, "www\\")

      logger.LogInformation("")
      logger.LogInformation("***********************")
      logger.LogInformation("**** start scan  ******")
      logger.LogInformation("***********************")
      logger.LogInformation($"Scanning path '{path}'")
      logger.LogInformation("")


      let! x =
        System.IO.Directory.EnumerateFiles(path)
        |> AsyncSeq.ofSeq
        |> AsyncSeq.iterAsync (fun v ->
          async {
            use scope = services.CreateScope()
            logger.LogInformation(v)
            let! result = (Workflow.runWorkflowForFilePath scope.ServiceProvider) v
            return result
          })
        |> Async.Catch

      match x with
      | Choice1Of2 unit ->
        logger.LogInformation("SCAN SUCCESS")
      | Choice2Of2 ``exception`` ->
        logger.LogError(``exception``, "SCAN ERROR")

      logger.LogInformation("scan result {@result}", x)

      logger.LogInformation("")
      logger.LogInformation("**************************")
      logger.LogInformation("**** scan completed ******")
      logger.LogInformation("**************************")
      logger.LogInformation("")

      return ()
    }

  type Service
    (
      logger: ILogger<Service>,
      env: IWebHostEnvironment,
      serviceProvider: IServiceProvider,
      writer: ChannelWriter<string>,
      writer2: ChannelWriter<UnitOfWork>
    ) =
    inherit BackgroundService()
    with

      override this.ExecuteAsync(token) =
        logger.LogInformation("Execute backroundservice async")

        task {
          while token.IsCancellationRequested = false do
            use scope = serviceProvider.CreateScope()
            logger.LogInformation("invoke scan")

            let! result =
              scanAndHandleWwwDirectory scope.ServiceProvider
              |> Async.StartAsTask

            logger.LogInformation("scan done")

            do! Task.Delay(150000) |> Async.AwaitTask

          return ()
        }
        |> ignore

        Task.CompletedTask

      override this.StopAsync(token) =
        logger.LogInformation("Stop backgroundservice async")
        Task.CompletedTask
