module AzFiles.InboxService

open System
open System.Text.Json.Serialization
open System.Threading
open Azure.Storage.Blobs.Models
open AzureFiles
open FSharp.Control
open MediatR
open Microsoft.Extensions.DependencyInjection
open Microsoft.Extensions.Hosting
open Microsoft.Extensions.Logging
open System.Linq
open Marten
open Glow.Core.Actions

type LobbyExit =
  | Delete
  | MoveToSrc

type NewLobbyItemDetected =
  { FileId: FileId
    DuplicateCheckResult: DuplicateCheckResult }

type LobbyItemRemoved = { Target: LobbyExit }

type LobbyEvent =
  | NewLobbyItemDetected of NewLobbyItemDetected
  | LobbyItemRemoved of LobbyItemRemoved

[<CLIMutable>]
type LobbyItem =
  { Id: Guid
    FileId: FileId
    RawFileId: Guid
    DuplicateCheckResult: DuplicateCheckResult
    Processed: bool
    Target: LobbyExit option }

  member this.Apply(e: LobbyEvent, meta: Marten.Events.IEvent) =
    match e with
    | NewLobbyItemDetected { FileId = fileId
                             DuplicateCheckResult = duplicateCheckResult } ->
      { Id = meta.StreamId
        RawFileId = fileId.value ()
        FileId = fileId
        DuplicateCheckResult = duplicateCheckResult
        Target = None
        Processed = false }
    | LobbyItemRemoved { Target = target } ->
      { this with
          Processed = true
          Target = Some target }

[<Action(Route = "api/auto-inbox/get-items", Policy = Policies.AuthenticatedUser)>]
type GetLobbyItems =
  { FilterActive: bool }
  interface IRequest<LobbyItem list>

type GetLobbyItemsHandler(ctx: IWebRequestContext) =
  interface IRequestHandler<GetLobbyItems, LobbyItem list> with
    member this.Handle(request, c) =
      task {
        let! items =
          ctx
            .DocumentSession
            .Query<LobbyItem>()
            .Where(fun x -> x.Processed <> request.FilterActive)
            .ToListAsync()

        return items |> Seq.toList
      }

module EventStore =
  let appendFileInitEvent (session: IDocumentSession) (FileId id, e: FileInitEvent) =
    session.Events.Append(id, [ e :> obj ]) |> ignore

  let appendFileEvent (session: IDocumentSession) (FileId id, e: FileEvent) =
    session.Events.Append(id, [ e :> obj ]) |> ignore

  let appendLobbyEvent (session: IDocumentSession) (id: Guid, e: LobbyEvent) =
    session.Events.Append(id, [ e :> obj ]) |> ignore

type LobbyBackgroundService(logger: ILogger<LobbyBackgroundService>, factory: IServiceScopeFactory) =
  inherit BackgroundService()

  let removeFromLobby (blobItem: BlobItem) =
    async {
      use scope = factory.CreateScope()
      let ctx = scope.ServiceProvider.GetRequiredService<IWebRequestContext>()
      let! inboxContainer = ctx.GetInboxContainer() |> Async.AwaitTask
      let! srcContainer = ctx.GetSrcContainer() |> Async.AwaitTask
      let metadata = blobItem.Metadata

      let fileId = metadata |> Metadata.getId
      let originalFilename = metadata |> Metadata.getOriginalFilename
      let checksum = metadata |> Metadata.getLocalChecksum

      let! x =
        ctx
          .DocumentSession
          .Query<LobbyItem>()
          .Where(fun x -> x.RawFileId = fileId.value ())
          .ToListAsync()
        |> Task.map Seq.toList
        |> Async.AwaitTask

      match x with
      | _ :: _ ->
        // 0. if file already is in progress (maybe failed last time)
        logger.LogWarning("file {fileid} already in progress", fileId.value ())
        return ()
      | [] ->

        let! validation =
          BlobService.validateFileAndChecksumIsNotAlreadyUploaded ctx.DocumentSession originalFilename checksum
        // 1.
        // check if file is duplicate
        // let moveTarget =
        //   match validation with
        //   | Ok _ -> LobbyExit.MoveToSrc
        //   | Error _ -> LobbyExit.Delete

        let moveTarget, duplicateCheckResult =
          match validation with
          | Ok okResult -> LobbyExit.MoveToSrc, DuplicateCheckResult.IsNew
          | Error err -> LobbyExit.Delete, DuplicateCheckResult.IsDuplicate(err.FileId)

        let id = Guid.NewGuid()

        (id,
         LobbyEvent.NewLobbyItemDetected
           { FileId = fileId
             DuplicateCheckResult = duplicateCheckResult })
        |> EventStore.appendLobbyEvent ctx.DocumentSession

        do!
          ctx.DocumentSession.SaveChangesAsync()
          |> Async.AwaitTask

        match moveTarget with
        | Delete ->
          let! deleteResult =
            inboxContainer.DeleteBlobAsync(blobItem.Name)
            |> Async.AwaitTask

          if deleteResult.IsError then
            // if already deleted, its fine
            failwith "Could not delete inbox blob item"
          else
            (id, LobbyEvent.LobbyItemRemoved { Target = LobbyExit.Delete })
            |> EventStore.appendLobbyEvent ctx.DocumentSession

            do!
              ctx.DocumentSession.SaveChangesAsync()
              |> Async.AwaitTask

            ()
        | MoveToSrc ->
          let blobClient = inboxContainer.GetBlobClient(blobItem.Name)
          let targetBlobClient = srcContainer.GetBlobClient(fileId.value().ToString())

          // BlobCopyFromUriOptions()
          // inboxContainer.Sas
          let! copyResult =
            targetBlobClient.SyncCopyFromUriAsync(blobClient.Uri)
            |> Async.AwaitTask

          let! properties =
            targetBlobClient.GetPropertiesAsync()
            |> Async.AwaitTask

          let dateTime =
            properties.Value.Metadata
            |> Metadata.tryGetDateTime

          if
            not (copyResult.GetRawResponse().IsError)
            && copyResult.Value.CopyStatus = CopyStatus.Success
          then
            (fileId,
             FileInitEvent.FileSavedToStorage
               { Filename = originalFilename
                 Md5Hash = properties.Value.ContentHash
                 LocalMd5Hash = checksum
                 Url = targetBlobClient.Uri.OriginalString
                 BlobUrl = Include(targetBlobClient.Uri.ToString())
                 BlobName = Include targetBlobClient.Name
                 BlobContainerName = Include targetBlobClient.BlobContainerName
                 BlobAccountName = Include targetBlobClient.AccountName
                 BlobSequenceNumber = Skip
                 ETag = Include(properties.Value.ETag.ToString())
                 ImageInfo =
                   Some
                     { DateCreated = dateTime
                       Location = None } })
            |> EventStore.appendFileInitEvent ctx.DocumentSession

            let getStreamAsync = WebRequestContext.getBlobContentStreamAsync ctx fileId

            let! data =
              Exif.readExifData (fileId, getStreamAsync)
              |> Async.AwaitTask

            data.Result
            |> Option.iter (fun data ->
              (fileId, FileEvent.ExifDataUpdated { Data = data })
              |> EventStore.appendFileEvent ctx.DocumentSession)

            do!
              ctx.DocumentSession.SaveChangesAsync()
              |> Async.AwaitTask

            let! deleteResult = blobClient.DeleteAsync() |> Async.AwaitTask

            if not deleteResult.IsError then

              (id, LobbyEvent.LobbyItemRemoved { Target = LobbyExit.MoveToSrc })
              |> EventStore.appendLobbyEvent ctx.DocumentSession

              do!
                ctx.DocumentSession.SaveChangesAsync()
                |> Async.AwaitTask
            else
              failwith "Could copy inbox blob item to src folder but could not delete inbox blob item"
          else
            failwith "Could not copy inbox blob item to src folder"

          ()

        return ()
        ()
    }

  override this.ExecuteAsync(cancellationToken: CancellationToken) =
    // use timer = new PeriodicTimer(TimeSpan.FromSeconds(5))
    // let! _ = timer.WaitForNextTickAsync(cancellationToken)
    async {

      while not cancellationToken.IsCancellationRequested do
        use scope = factory.CreateScope()
        let logger = scope.ServiceProvider.GetService<ILogger<LobbyBackgroundService>>()
        logger.LogDebug("Running inbox service")
        let ctx = scope.ServiceProvider.GetRequiredService<IWebRequestContext>()
        let! inboxContainer = ctx.GetInboxContainer() |> Async.AwaitTask

        let! x =
          inboxContainer.GetBlobsAsync(BlobTraits.Metadata, cancellationToken = cancellationToken)
          |> TaskSeq.toListAsync
          |> Async.AwaitTask

        //
        let! result =
          x
          |> Seq.map removeFromLobby
          |> fun x -> (x, 5)
          |> Async.Parallel

        let blobs = inboxContainer.GetBlobsAsync(cancellationToken = cancellationToken)

        // Wait for 30 seconds before checking for new messages
        do! Async.Sleep(TimeSpan.FromSeconds(5.0))
    }
    |> Async.StartAsTask
    |> Task.ignore