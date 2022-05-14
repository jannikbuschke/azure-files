namespace AzureFiles

open System.Threading
open System.Threading.Channels
open Microsoft.Extensions.Logging
open System.Threading.Tasks
open Microsoft.Extensions.Hosting
open System.IO
open Microsoft.AspNetCore.Hosting
open Microsoft.Extensions.DependencyInjection
// open Glow.Core.Utils
open System
open MediatR
open Glow.Hosting

module ScanFiles =

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

        // let path = env.ContentRootPath
        let path =
          Path.Combine(env.ContentRootPath, "www\\")

        let watcher = new FileSystemWatcher(path)

        watcher.SynchronizingObject <- null

        logger.LogInformation("Initial scan")
        let dir = System.IO.Directory.EnumerateFiles(path)

        let files =
          ResizeArray(
            dir
            |> Seq.filter (fun v -> System.IO.File.Exists(v))
          )

        logger.LogInformation("found files: {@files}", files.Count)
        logger.LogInformation("found files: {@files}", files)

        task {
          for file in files do
            use scope = serviceProvider.CreateScope()

            let mediator =
              scope.ServiceProvider.GetService<IMediator>()

            let! result = mediator.Send(UploadSystemFiles(FilePaths = ResizeArray([| file |])))

            let result =
              ResizeArray(
                result
                |> Seq.choose id
                |> Seq.map (fun v -> v.Id, v.Filename)
              )

            logger.LogInformation "rename files"
            let! result = mediator.Send(RenameSystemFiles(Files = ResizeArray([| file |]), FolderName = "handled"))
            return ()
        }
        |> ignore

        let handleFileEvent eventType =
          fun (e: FileSystemEventArgs) ->
            logger.LogInformation(sprintf "File %s: %s" eventType e.FullPath)

            writer2.TryWrite
              (fun services cancellationToken ->
                task {
                  let mediator = services.GetService<IMediator>()
                  let files = ResizeArray [ e.FullPath ]
                  let! result = mediator.Send(UploadSystemFiles(FilePaths = files))

                  let result =
                    ResizeArray(
                      result
                      |> Seq.choose id
                      |> Seq.map (fun v -> v.Filename)
                    )

                  logger.LogInformation "rename files"
                  let! result = mediator.Send(RenameSystemFiles(Files = result, FolderName = "handled"))
                  return ()
                }
                |> ValueTask)

            |> ignore

            ()

        watcher.Changed.Add(handleFileEvent "changed")
        watcher.Renamed.Add(handleFileEvent "renamed")

        watcher.IncludeSubdirectories <- true
        watcher.EnableRaisingEvents <- true
        logger.LogInformation(sprintf "watcher is enabled %b" watcher.EnableRaisingEvents)

        let x =
          (sprintf "watching for changes in %s" path)

        logger.LogInformation(x)

        let taskResult =
          task {
            while token.IsCancellationRequested = false do
              logger.LogInformation(sprintf "Watching files, waiting for cancellation (threadid = %s" Thread.CurrentThread.Name)

              try
                let! result = Task.Delay(100000, token)
                return result
              with
              | :? TaskCanceledException as e ->
                logger.LogInformation("Cancelling wait")
                ()

              return ()
          }

        logger.LogInformation("scan files done")

        Task.CompletedTask

      override this.StopAsync(token) =
        logger.LogInformation("Stop backgroundservice async")
        Task.CompletedTask
