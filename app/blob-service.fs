namespace AzureFiles

open System
open System.IO
open System.Text.Json.Serialization
open Azure.Identity
open Azure.Storage.Blobs
open Marten
open Microsoft.Extensions.Configuration
open Microsoft.Extensions.Logging
open System.Threading.Tasks
open System.Linq
open Microsoft.Extensions.DependencyInjection
open Marten.Linq.MatchesSql
open FsToolkit.ErrorHandling

type Workspace = { Name: string; Container: string }

module BlobService =

  // let addDomainEventIfSome (e: FileSavedToStorage option) (session: IDocumentSession) (logger: ILogger) =
  //   task {
  //     match e with
  //     | Some ev ->
  //       logger.LogInformation("session start stream {@event}", ev)
  //       let events: obj [] = [| ev |]
  //
  //       session.Events.StartStream(ev.Id, events)
  //       |> ignore
  //
  //       logger.LogInformation("save changes async")
  //
  //       return ()
  //     | _ ->
  //       logger.LogInformation("no file added => do nothing")
  //       return ()
  //   }

  // returns Ok if there is no file yet with same filename and md5 hash
  let validateFileIsNotAlreadyUploaded (session: IDocumentSession) (file: FormFileScanned) =
    taskResult {
      let filename = file.Filename
      let (Checksum rawChecksum) = file.LocalChecksum

      let! result =
        session
          .Query<FileAggregate>()
          .Where(fun v ->
            v.MatchesSql("data ->> 'Md5Hash' = ?", rawChecksum)
            && v.Filename = filename
            // && v.LocalMd5Hash = file.LocalChecksum
            )
          .ToListAsync()

      let first = result |> Seq.tryHead

      return!
        match first with
        | Some first -> Result.Error(ErrorResult.FileIsDuplicate(first.Key(), filename))
        | None -> Result.Ok()
    // let! x =  first |> Result.requireSome (ErrorResult.FileIsDuplicate(result.First().Key(), filename))
    // do!
    //   result
    //   |> Result.requireEmpty (ErrorResult.FileIsDuplicate(result.First().Key(), filename))
    }

  let checkFileAlreadyHandledBasedOnLocalMd5hash
    (client: BlobServiceClient)
    (provider: IServiceProvider)
    (file: FileScanned)
    : Async<DuplicateCheckResult> =
    async {
      use scope = provider.CreateScope()

      if box file = null then
        failwith "file is null"

      let session = scope.ServiceProvider.GetService<IDocumentSession>()

      let (Checksum rawChecksum) = file.LocalChecksum
      let filename = file.Filename // System.IO.Path.GetFileName(file.LocalFilePath)

      let! result =
        session
          .Query<FileAggregate>()
          .Where(fun v ->
            v.MatchesSql("data ->> 'Md5Hash' = ?", rawChecksum)
            && v.Filename = filename
            // && v.LocalMd5Hash = file.LocalChecksum
            )
          .ToListAsync()
        |> Async.AwaitTask

      let logger = scope.ServiceProvider.GetService<ILogger<FileScanned>>()
      logger.LogInformation(rawChecksum)
      logger.LogInformation("duplicate check result {result}", result.Count)

      return
        match result |> Seq.toList with
        | [] -> DuplicateCheckResult.IsNew
        | head :: tail -> DuplicateCheckResult.IsDuplicate(head.Key())
    // return result.Count > 0
    }

  let uploadFileAndAppendEvent
    (ctx: WebRequestContext)
    (localFile: FormFileScanned)
    (stream: Stream)
    : Task<Result<FileSavedToStorage, ErrorResult>> =
    taskResult {
      let! container = ctx.GetSrcContainer()

      let fileId = FileId.value localFile.Id
      let targetFilename = fileId.ToString()
      let blobClient = container.GetBlobClient(targetFilename)
      // todo: add file creation date
      let metadata =
        dict [
               // "original_filename", localFile.Filename
               // "id", fileId.ToString()
                ]
      // use stream = localFile.FormFile.OpenReadStream()
      let! result = blobClient.UploadAsync(stream, null, metadata)
      let hash = result.Value.ContentHash
      let etag = result.Value.ETag.ToString()

      let e: FileSavedToStorage =
        { Filename = localFile.Filename
          Md5Hash = hash
          LocalMd5Hash = localFile.LocalChecksum
          Url = blobClient.Uri.ToString()
          BlobUrl = Include(blobClient.Uri.ToString())
          BlobName = Include blobClient.Name
          BlobContainerName = Include blobClient.BlobContainerName
          BlobAccountName = Include blobClient.AccountName
          BlobSequenceNumber = Include result.Value.BlobSequenceNumber
          ETag = Include etag }

      ctx.DocumentSession.Events.StartFileStream(localFile.Id, FileInitEvent.FileSavedToStorage e)
      |> ignore

      return e
    }

  let uploadOriginalFile
    (client: BlobContainerClient)
    (localFile: FileScanned)
    : Task<Result<FileSavedToStorage, string>> =
    taskResult {
      let filename = localFile.Filename
      // Path.GetFileName(localFile.LocalFilePath)

      let fileId = FileId.value localFile.Id
      let targetFilename = fileId.ToString()

      let blobClient = client.GetBlobClient(targetFilename)

      // todo: add file creation date
      let metadata =
        dict [ "original_filename", filename
               "id", fileId.ToString() ]

      let! filepath =
        localFile.LocalFilePath
        |> Result.requireSome "local file path is null"

      use content =
        File.Open(filepath, FileMode.Open, FileAccess.Read, FileShare.ReadWrite)

      let! result =
        blobClient.UploadAsync(content, null, metadata)
        |> Async.AwaitTask

      let hash = result.Value.ContentHash

      let tags = metadata
      let! setTagResult = blobClient.SetTagsAsync(tags) |> Async.AwaitTask

      let e: FileSavedToStorage =
        { Filename = filename
          Md5Hash = hash
          LocalMd5Hash = localFile.LocalChecksum
          Url = $"{blobClient.Uri}"
          BlobUrl = Include $"{blobClient.Uri}"
          BlobName = Include blobClient.Name
          BlobContainerName = Include blobClient.BlobContainerName
          BlobAccountName = Include blobClient.AccountName
          BlobSequenceNumber = Include result.Value.BlobSequenceNumber
          ETag = (Include(result.Value.ETag.ToString())) }

      return e
    }

  let getBlobServiceClient (connectionString: string) =
    // let section = configuration.GetSection("AzureBlob")
    //
    // let connectionString = section.GetValue<string>("ConnectionString")

    let rawUri = null // section.GetValue<string>("Uri")

    let uri =
      match rawUri with
      | null -> None
      | value -> Some(System.Uri(value))

    let result =
      match (connectionString, uri) with
      | (null, Some uri) -> BlobServiceClient(uri, ManagedIdentityCredential())
      | _ -> BlobServiceClient(connectionString)

    result

  let getBlobContainerClientByName (connectionString: string) (containerName: string) =
    task {
      let blobServiceClient = getBlobServiceClient connectionString

      let blobContainerClient = blobServiceClient.GetBlobContainerClient(containerName)

      let! _ = blobContainerClient.CreateIfNotExistsAsync()
      return blobContainerClient
    }

  let getBlobContainerClient (connectionString: string) (containerName: string) =
    async {
      let blobServiceClient = getBlobServiceClient connectionString

      let blobContainerClient = blobServiceClient.GetBlobContainerClient(containerName)

      task {
        let! container = blobContainerClient.CreateIfNotExistsAsync()
        ()
      }
      |> ignore

      return blobContainerClient
    }

  let getBlobContainerSourceFiles (connectionString: string) =
    getBlobContainerClient connectionString "src"

  let NonStringTask () : Task<string option> = Task.FromResult(None)

  let NoneFileAddedAsync () : Async<FileSavedToStorage option> = async { return None }

  let deleteAllBlobsInContainer (container: BlobContainerClient) =
    task {
      let asyncPageable = container.GetBlobsAsync(Models.BlobTraits.Metadata)

      let! y = asyncPageable.AsAsyncEnumerable().ToListAsync()

      y
      |> Seq.iter (fun v ->
        let response = container.DeleteBlob(v.Name)
        ())
    //      let! blobs = container.GetBlobsAsync(?traits=,?states=defaultArg(),?prefix=defaultArg(),?cancellationToken=defaultArg())
    }