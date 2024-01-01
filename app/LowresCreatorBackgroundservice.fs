module AzFiles.LowresVariantCreator

open System
open System.Threading
open AzFiles
open FSharp.Control
open Microsoft.Extensions.DependencyInjection
open Microsoft.Extensions.Hosting
open Microsoft.Extensions.Logging
open Marten

let addExifDataIfNotExisting ctx (logger: ILogger) files =
  async {
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
  }

type VariantCreatorBackgroundService(factory: IServiceScopeFactory) =
  inherit BackgroundService()

  override this.ExecuteAsync(cancellationToken: CancellationToken) =
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

        do! addExifDataIfNotExisting ctx logger files

        let createVariants predicate width name concurrent =
          let files = files |> Seq.filter predicate
          printfn "files without '%s' version %A" name (files |> Seq.length)

          files
          |> Seq.map FileViewmodel.FromFileProjection
          |> Seq.choose (fun v ->
            match v.FileInfo.Type with
            | FileType.Image -> Some v
            | _ -> None)
          |> Seq.truncate concurrent
          |> Seq.map (fun v -> v.Id)
          |> Seq.map (fun v ->
            Workflow.createVariant ctx width name v
            |> Async.AwaitTask)
          |> fun v -> Async.Parallel(v, concurrent)

        let! filesWithoutLowResVersion = createVariants (fun v -> v.LowresVersions |> List.isEmpty) 500 "thumbnail" 5

        let withoutHdVariant =
          (fun (v: FileProjection) ->
            not (v.Tags |> List.isEmpty)
            && not (v.Tags |> List.contains SpecialTag.MarkForCleanup)
            && not (
              v.LowresVersions
              |> List.exists (fun x -> x.Name = "hd")
            ))

        let! filesWithoutHdVersion = createVariants withoutHdVariant 1200 "hd" 30

        filesWithoutHdVersion
        |> Seq.iter (fun v ->
          match v with
          | Ok o -> logger.LogInformation(sprintf "Ok")
          | Error e -> logger.LogInformation(sprintf "Error %s" e.Message))

        filesWithoutLowResVersion
        |> Seq.iter (fun v ->
          match v with
          | Ok o -> ()
          | Error e -> logger.LogInformation(sprintf "Error %s" e.Message))

        do!
          ctx.DocumentSession.SaveChangesAsync()
          |> Async.AwaitTask

        do! Async.Sleep(TimeSpan.FromSeconds(55.0))
    }
    |> Async.StartAsTask
    |> Task.ignore