module AzFiles.LowresVariantCreator

open System
open System.Text.Json.Serialization
open System.Threading
open Azure.Storage.Blobs.Models
open AzureFiles
open FSharp.Control
open Microsoft.Extensions.DependencyInjection
open Microsoft.Extensions.Hosting
open Microsoft.Extensions.Logging
open Marten

type VariantCreatorBackgroundService(logger: ILogger<VariantCreatorBackgroundService>, factory: IServiceScopeFactory) =
  inherit BackgroundService()

  override this.ExecuteAsync(cancellationToken: CancellationToken) =
    // use timer = new PeriodicTimer(TimeSpan.FromSeconds(5))
    // let! _ = timer.WaitForNextTickAsync(cancellationToken)
    async {

      while not cancellationToken.IsCancellationRequested do
        use scope = factory.CreateScope()
        let ctx = scope.ServiceProvider.GetRequiredService<IWebRequestContext>()

        let! files =
          ctx
            .DocumentSession
            .Query<FileProjection>()
            .ToListAsync()
          |> Async.AwaitTask

        let filesWithoutLowresVersion =
          files
          |> Seq.filter (fun v -> v.LowresVersions.isSkip)
          |> Seq.take 5
          |> Seq.map (fun v -> v.Key())
          |> Seq.map (Workflow.createVariant ctx 800 "800")
          |> Async.Parallel



        // Wait for 30 seconds before checking for new messages
        do! Async.Sleep(TimeSpan.FromSeconds(10.0))
    }
    |> Async.StartAsTask
    |> Task.ignore