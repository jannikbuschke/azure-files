namespace Glow.Hosting

open System.IO
open System.Threading.Tasks
open System
open System.Threading
open System.Threading.Channels
open Microsoft.AspNetCore.Mvc
open Microsoft.Extensions.Hosting
open Microsoft.Extensions.Logging

type UnitOfWork = Func<CancellationToken, ValueTask>


type FileUploadTask = { FilePath: string }

//type IBackgroundTaskQueue =
//
//  abstract QueueBackgroundWorkItemAsync: workItem: FileUploadTask -> ValueTask
//  abstract QueueBackgroundWorkItem: workItem: FileUploadTask -> unit
//
//  abstract DequeueAsync: cancellationToken: CancellationToken -> ValueTask<FileUploadTask>


type BackgroundTaskQueue(capacity: int) =

  let options = BoundedChannelOptions(capacity)

  do
    options.FullMode <- BoundedChannelFullMode.Wait
    options.SingleReader <- true
    Serilog.Log.Logger.Information("Created Background Task queue")

  member this._queue = Channel.CreateBounded<string>(options)

  //  interface IBackgroundTaskQueue with

  member this.QueueBackgroundWorkItem(workItem) =
    Serilog.Log.Logger.Information("write queue item sync")
    let result = this._queue.Writer.TryWrite(workItem)
    Serilog.Log.Logger.Information(sprintf "write done %b" result)
    ()

  member this.QueueBackgroundWorkItemAsync(workItem) =
    task {
      Serilog.Log.Logger.Information("write queue item async")

      let! result = this._queue.Writer.WriteAsync(workItem)
      Serilog.Log.Logger.Information(sprintf "write async done")

      return result
    }
    |> ValueTask

  member this.DequeueAsync(token) =
    task {
      Serilog.Log.Logger.Information("read async...")

      let! workItem = this._queue.Reader.ReadAsync()
      Serilog.Log.Logger.Information("Got a work item, returning it...")

      return workItem
    }
    |> ValueTask<string>

type IsAlreadyUploaded = string -> Stream -> ValueTask<bool>


type QueuedHostedService(logger: ILogger<QueuedHostedService>, reader: ChannelReader<string>, reader2: ChannelReader<UnitOfWork>) =
  inherit BackgroundService()

  override this.ExecuteAsync(token) =
    logger.LogInformation($"Queued Hosted Service is running.{Environment.NewLine}")

    task {
      while (token.IsCancellationRequested = false) do
        //        logger.LogInformation("wait for item to be dequed")

        let! unitOfWork = reader2.ReadAsync(token)
        let! workResult = unitOfWork.Invoke(token)
        //
//        let! workItem = reader.ReadAsync(token)
//        logger.LogInformation("Got a dequed item, starting work")
//
//        logger.LogInformation("{@a}", workItem)
        // service, upload task
//        let! result = workItem.Invoke(token)
        logger.LogInformation("Work is done")
        return ()
    }
    |> ignore

    Task.CompletedTask

  override this.StopAsync(token) =
    logger.LogInformation("Queued hosted service is stopoing")
    Task.CompletedTask


type TestController(logger: ILogger<TestController>, writer: ChannelWriter<string>, reader: ChannelReader<string>) =
  inherit Microsoft.AspNetCore.Mvc.ControllerBase()

  [<HttpGet("api/test-get")>]
  member this.Get(token: CancellationToken) =
    task {
      logger.LogInformation("getting, wait for dequeud item")
      let! result = reader.ReadAsync()
      //      let! result = queue.DequeueAsync(token)
      return result
    }

  [<HttpGet("api/test-post")>]
  member this.Post(token: CancellationToken) =
    let result = writer.TryWrite("hello world")
    sprintf "done %b" result
//    queue.QueueBackgroundWorkItem("Hello")
//    logger.LogInformation("added a work item")
//
//    "done"
