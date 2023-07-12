namespace AzureFiles

open System
open System.IO
open System.Text.Json.Serialization
open Azure.Identity
open Azure.Storage.Blobs
open Marten
open Microsoft.Extensions.Logging
open System.Threading.Tasks
open System.Linq
open Microsoft.Extensions.DependencyInjection
open Marten.Linq.MatchesSql
open FsToolkit.ErrorHandling
open SixLabors.ImageSharp

type Workspace = { Name: string; Container: string }

module BlobService =

  let validateFileAndChecksumIsNotAlreadyUploaded
    (session: IDocumentSession)
    (filename: string)
    (rawChecksum: Checksum)
    =
    asyncResult {

      if box rawChecksum = null then
        failwith "rawChecksum is null"

      if box filename = null then
        failwith "filename is null"

      let! result =
        session
          .Query<FileProjection>()
          .Where(fun v ->
            v.MatchesSql("data ->> 'Md5Hash' = ?", rawChecksum.value ())
            && v.Filename = filename)
          .ToListAsync()

      let first = result |> Seq.tryHead

      return!
        match first with
        | Some first ->
          Result.Error(
            { FileIsDuplicate.FileId = first.Key()
              Filename = filename }
          )
        | None -> Result.Ok()
    }

  let validateFileIsNotAlreadyUploaded (session: IDocumentSession) (file: FormFileScanned) =
    validateFileAndChecksumIsNotAlreadyUploaded session file.Filename file.LocalChecksum

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
          .Query<FileHandledProjection>()
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

  let asyncUploadFile
    (ctx: IWebRequestContext)
    (localFile: FormFileScanned)
    (stream: Stream)
    (image: Image)
    : Async<Result<unit, ErrorResult>> =
    asyncResult {
      let logger = ctx.GetLogger<obj>()
      // let! container = ctx.GetSrcContainer()
      let! container = ctx.GetInboxContainer()

      let fileId = FileId.value localFile.Id
      let targetFilename = fileId.ToString()
      let blobClient = container.GetBlobClient(targetFilename)

      let metadata =
        Metadata.createMetadata localFile.LocalChecksum localFile.Filename localFile.Id image

      let! _ =
        blobClient.UploadAsync(stream, null, metadata)
        |> Async.AwaitTask

      return ()
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
