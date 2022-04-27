namespace AzureFiles

open Azure.Identity
open Azure.Storage.Blobs
open Marten
open Microsoft.Extensions.Configuration
open Domain
open System.Linq
open Microsoft.Extensions.Logging
open System.Threading.Tasks

module BlobService =

  let addDomainEventIfSome (e: FileAdded option) (session: IDocumentSession) =
    task{
      match e with
      | Some ev ->
        let events: obj [] = [| ev |]

        session.Events.StartStream(ev.Id, events)
        |> ignore

        do! session.SaveChangesAsync()
        ()
      | _ -> ()
    }

  let checkFileAlreadyUploaded (client: BlobServiceClient) (filename: string) (content: System.IO.Stream) =
    async {
      let searchQuery = $"\"original_filename\" = '{filename}'"
      let result = client.FindBlobsByTagsAsync(searchQuery)
      let! r0 = result.AsAsyncEnumerable().ToListAsync().AsTask() |> Async.AwaitTask
      // check for content/mdf5
      return r0.Count > 0
    }

  let addFile (client: BlobContainerClient) (filename: string) (content: System.IO.Stream) =
    task {
      let fileId = System.Guid.NewGuid()
      let blobClient = client.GetBlobClient(fileId.ToString())

      // todo: add file creation date
      let metadata =
        dict [ "original_filename", filename
               "id", fileId.ToString() ]

      let! result = blobClient.UploadAsync(content, null, metadata)
      let hash = result.Value.ContentHash

      let tags = metadata
      let! setTagResult = blobClient.SetTagsAsync(tags)

      let e: FileAdded =
        { Id = fileId
          Filename = filename
          Md5Hash = hash }

      return e
    }


  let getBlobServiceClient (configuration: IConfiguration) =
    let section = configuration.GetSection("AzureBlob")

    let connectionString = section.GetValue<string>("ConnectionString")

    let rawUri = section.GetValue<string>("Uri")

    let uri =
      match rawUri with
      | null -> None
      | value -> Some(System.Uri(value))

    let result =
      match (connectionString, uri) with
      | (null, Some uri) -> BlobServiceClient(uri, ManagedIdentityCredential())
      | _ -> BlobServiceClient(connectionString)

    result

  let getBlobContainerClient (configuration: IConfiguration) =
    async {
      let blobServiceClient = getBlobServiceClient configuration

      let blobContainerClient = blobServiceClient.GetBlobContainerClient("inbox")
      task{
        let! container = blobContainerClient.CreateIfNotExistsAsync()
        ()
      } |>ignore
      return blobContainerClient
    }

  let NoneAsync () : Task<string option> = Task.FromResult(None)

  let NoneFileAsync () : Task<FileAdded option> = Task.FromResult(None)

  let SomeFileAsync
    (blobInboxContainerClient: BlobContainerClient)
    (filename: string)
    (content: System.IO.Stream)
    : Task<FileAdded option> =
    task {
      let! result = addFile blobInboxContainerClient filename content
      return Some result
    }

  let addFileIfNotYetExists (configuration: IConfiguration) (filename: string) (content: System.IO.Stream) (logger:ILogger)=
    task {
      let blobServiceClient = getBlobServiceClient configuration
      let! blobInboxContainerClient = getBlobContainerClient configuration
      let! fileAlreadyUploaded = checkFileAlreadyUploaded blobServiceClient filename content

      let addBlob (alreadyUploaded: bool) =
        task {
          match alreadyUploaded with
          | true -> return! NoneFileAsync()
          | false -> return! SomeFileAsync blobInboxContainerClient filename content
        }

      let! fileAdded = addBlob fileAlreadyUploaded

      if fileAdded.IsNone then logger.LogInformation("Skipped (file already exists)") else logger.LogInformation("File uploaded")

      return fileAdded
    }