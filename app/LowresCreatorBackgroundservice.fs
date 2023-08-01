module AzFiles.LowresVariantCreator

open System
open System.Text.Json.Serialization
open System.Threading
open Azure.Storage.Blobs.Models
open AzFiles
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
        let logger = ctx.GetLogger<VariantCreatorBackgroundService>()
        logger.LogInformation "running variant creator background service"

        let! files =
          ctx
            .DocumentSession
            .Query<FileProjection>()
            .ToListAsync()
          |> Async.AwaitTask

        let! imagesWithoutExifData =
          files
          |> Seq.map FileViewmodel.FromFileProjection
          |> Seq.filter (fun v ->
            v.ExifData.isSkip
            && match v.FileInfo.Type with
               | FileType.Image -> true
               | _ -> false)
          |> Seq.truncate 10
          |> Seq.map (fun v ->
            async {
              let! exifData =
                Workflow.readExifDataFromCacheOrBlob ctx v.Id
                |> Async.AwaitTask

              return v, exifData
            })
          |> fun v -> Async.Parallel(v, 10)

        imagesWithoutExifData
        |> Seq.iter (fun (file, exifResult) ->
          logger.LogInformation("files with no exif data {@f}", file.Id)

          match exifResult.Result with
          | Some exifData ->
            logger.LogInformation("append exif data")
            ctx.DocumentSession.Events.AppendFileStream(file.Id, FileEvent.ExifDataUpdated { Data = exifData })
          | None ->
            logger.LogInformation("no exif data found, set to empty list")
            ctx.DocumentSession.Events.AppendFileStream(file.Id, FileEvent.ExifDataUpdated { Data = [] })

            ())
        // v
        // match v with
        // | (file, Ok exifData) ->
        //   file.ExifData <- exifData
        //   ctx.DocumentSession.Update(file)
        // | (file, Error e) ->
        //   printf "Error %s\n" e.Message
        //   ctx.DocumentSession.Delete(file)
        // )

        // let! data = Workflow.readExifDataFromCacheOrBlob ctx fileId |> Async.AwaitTask

        let! filesWithoutLowresVersion =
          files
          // |> Seq.filter (fun v ->
          //   not (v.Tags |> List.isEmpty)
          //   && not (v.Tags = [ SpecialTag.MarkForCleanup ]))
          // |> Seq.filter(fun v -> v.Inbox)
          |> Seq.filter (fun v -> v.LowresVersions |> List.isEmpty)
          |> Seq.map (FileViewmodel.FromFileProjection)
          |> Seq.choose (fun v ->
            match v.FileInfo.Type with
            | FileType.Image -> Some v
            | _ -> None)
          |> Seq.truncate 5
          |> Seq.map (fun v -> v.Id)
          |> Seq.map (fun v ->
            Workflow.createVariant ctx 500 "thumbnail" v
            |> Async.AwaitTask)
          |> fun v -> Async.Parallel(v, 5)

        filesWithoutLowresVersion
        |> Seq.iter (fun v ->
          match v with
          | Ok o -> logger.LogInformation("ok")
          | Error e -> logger.LogInformation(sprintf "Error %s" e.Message))

        do!
          ctx.DocumentSession.SaveChangesAsync()
          |> Async.AwaitTask
        // Wait for 30 seconds before checking for new messages
        do! Async.Sleep(TimeSpan.FromSeconds(5.0))
    }
    |> Async.StartAsTask
    |> Task.ignore