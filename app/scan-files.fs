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
        // let watcher =  new FileSystemWatcher(@"C:\home\jannik\temp")

        watcher.SynchronizingObject <- null
        //        watcher.NotifyFilter <-  NotifyFilters.FileName ||| NotifyFilters.Size
        // watcher.NotifyFilter <- NotifyFilters.Attributes
        //   ||| NotifyFilters.CreationTime
        //   ||| NotifyFilters.DirectoryName
        //   ||| NotifyFilters.FileName
        //   ||| NotifyFilters.LastAccess
        //   ||| NotifyFilters.LastWrite
        //   ||| NotifyFilters.Security
        //   ||| NotifyFilters.Size;

        // watcher.Filter <- "*.*";

        let handleFileEvent eventType =
          fun (e: FileSystemEventArgs) ->
            logger.LogInformation(sprintf "File %s: %s" eventType e.FullPath)

            writer2.TryWrite
              (fun services cancellationToken ->
                task {
                  let mediator = services.GetService<IMediator>()
                  let files = ResizeArray [ e.FullPath ]
                  let! result = mediator.Send(UploadSystemFiles(FilePaths = files))
                  let result = ResizeArray(result |> Seq.choose id |> Seq.map (fun v-> v.Id,v.Filename ))

                  logger.LogInformation "rename files"
                  let! result = mediator.Send(RenameSystemFiles(Files = result, FolderName = "handled"))
                  return ()
                }
                |> ValueTask)

            |> ignore

            ()

        watcher.Changed.Add(handleFileEvent "changed")
        //        watcher.Created.Add(handleFileEvent "created")
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

        Task.CompletedTask

      override this.StopAsync(token) =
        logger.LogInformation("Stop backgroundservice async")
        Task.CompletedTask
