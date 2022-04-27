namespace Glow.Hosting

open System.IO
open System.Threading.Tasks
open System
open System.Threading
open System.Threading.Channels
open Microsoft.AspNetCore.Mvc
open Microsoft.Extensions.Hosting
open Microsoft.Extensions.Logging
open Microsoft.Extensions.DependencyInjection

type UnitOfWork = Func<IServiceProvider, CancellationToken, ValueTask>

type FileUploadTask = { FilePath: string }

type BackgroundTaskQueue(capacity: int) =

  let options = BoundedChannelOptions(capacity)

  do
    options.FullMode <- BoundedChannelFullMode.Wait
    options.SingleReader <- true
    Serilog.Log.Logger.Information("Created Background Task queue")

  member this._queue = Channel.CreateBounded<string>(options)

  //  interface IBackgroundTaskQueue with

  member this.QueueBackgroundWorkItem(workItem) =
    let result = this._queue.Writer.TryWrite(workItem)
    ()

  member this.QueueBackgroundWorkItemAsync(workItem) =
    task {
      let! result = this._queue.Writer.WriteAsync(workItem)

      return result
    }
    |> ValueTask

  member this.DequeueAsync(token) =
    task {
      let! workItem = this._queue.Reader.ReadAsync()

      return workItem
    }
    |> ValueTask<string>

type IsAlreadyUploaded = string -> Stream -> ValueTask<bool>

type QueuedHostedService(logger: ILogger<QueuedHostedService>, reader: ChannelReader<string>, reader2: ChannelReader<UnitOfWork>, services: IServiceProvider) =
  inherit BackgroundService()

  override this.ExecuteAsync(token) =
    logger.LogInformation($"Queued Hosted Service is running.{Environment.NewLine}")
    let mutable i = 0
    task {
      while (token.IsCancellationRequested = false) do
        let! unitOfWork = reader2.ReadAsync(token)
        use scope = services.CreateScope()
        logger.LogInformation(sprintf "executing work %i on thread %s" i Thread.CurrentThread.Name)
        let! workResult = unitOfWork.Invoke(scope.ServiceProvider, token)
        logger.LogInformation(sprintf "executed work %i on thread %s" i Thread.CurrentThread.Name)
        i <- i + 1

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
      // let! result = queue.DequeueAsync(token)
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
