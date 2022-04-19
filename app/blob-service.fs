namespace AzureFiles

open Azure.Identity
open Azure.Storage.Blobs
open Microsoft.Extensions.Configuration
open Domain
open System.Linq

module BlobService =
  open System.Threading.Tasks

  let checkFileAlreadyUploaded (client: BlobServiceClient) (filename: string) (content: System.IO.Stream) =
    task {
      let searchQuery = $"\"original_filename\" = '{filename}'"
      let result = client.FindBlobsByTagsAsync(searchQuery)
      let! r0 = result.AsAsyncEnumerable().ToListAsync()
      // check for content/mdf5
      return r0.Count > 0
    }

  let addFile (client: BlobContainerClient) (filename: string) (content: System.IO.Stream) =
    task {
      let fileId = System.Guid.NewGuid()
      let blobClient = client.GetBlobClient(fileId.ToString())

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

    let connectionString =
      section.GetValue<string>("ConnectionString")

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
    task {
      let blobServiceClient = getBlobServiceClient configuration

      let blobContainerClient =
        blobServiceClient.GetBlobContainerClient("inbox")

      let! container = blobContainerClient.CreateIfNotExistsAsync()
      return blobContainerClient
    }

  let NoneAsync():Task<string option>=
    Task.FromResult(None)

  let addFileIfNotYetExists (configuration: IConfiguration) (filename: string) (content: System.IO.Stream) =
    task{
      let blobServiceClient = getBlobServiceClient configuration
      let! blobInboxContainerClient = getBlobContainerClient configuration
      let! fileAlreadyUploaded = checkFileAlreadyUploaded blobServiceClient filename content

      let bar = async {      
        match 1 with
        | 1 ->
            let! num = async.Return 12345 
            return 1
        | _ -> 
            return 2 }    

      let fileAdded = task { 
        match fileAlreadyUploaded with
        | true -> 
               Task.FromResult(None)
        | false -> 
               let! result = addFile blobInboxContainerClient filename content
               Some result    
      }

      // let fileAdded: FileAdded option = 
      //   if fileAlreadyUploaded
      //   then NoneAsync
      //   else addFile blobInboxContainerClient filename content

      do match fileAdded with
        | Some x -> Serilog.Log.Logger.Information("SOME")
        | None -> Serilog.Log.Logger.Information("NONE")

      return fileAdded
    }