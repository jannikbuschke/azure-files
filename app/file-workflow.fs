namespace AzFiles

open AzFiles
open System.IO
open Azure.Storage.Sas
open Microsoft.AspNetCore.Http
open FsToolkit.ErrorHandling

module Workflow =

  let readExifDataFromCacheOrBlob (ctx: IWebRequestContext) (fileId: FileId) =
    task{
      let getStreamAsync = WebRequestContext.getSrcBlobContentStreamAsync ctx fileId
      let! result = Exif.readExifData (ctx.GetLogger<obj>(), fileId, getStreamAsync)
      return result
    }

  let initiallyHandleFormFile (file: IFormFile) : FormFileScanned =

    use stream = file.OpenReadStream()
    let checksum = WorkflowUtils.getMd5HashFromStream stream

    { FormFileScanned.Id = FileId.create <| System.Guid.NewGuid()
      Filename = file.FileName
      FormFile = file
      LocalChecksum = checksum }

  let createVariant (ctx: IWebRequestContext) (width: int32) (variantName: string) (fileId: FileId) =
    taskResult {
      let! fileStream = (WebRequestContext.getSrcBlobContentStreamAsync ctx fileId) ()
      let! dimension, variantData = AzFiles.ImageProcessing.resizeImage fileStream width
      let filename = $"{fileId.value().ToString()}-{variantName}"
      let imgVariantsClient = ctx.GetVariantsContainer()

      let uploadVariant (stream: MemoryStream) (filename: string) =
        let client = imgVariantsClient.GetBlobClient(filename)
        client.UploadAsync(stream, null, null)

      let! result = uploadVariant variantData filename
      let uri = imgVariantsClient.Uri

      (fileId,
       FileEvent.LowresVersionCreated
         { LowresVersionCreated.Url = $"{uri}/{filename}"
           Dimension = dimension
           VariantName = variantName })
      |> ctx.DocumentSession.Events.AppendFileStream

      return ()
    }

  let createSasUri0
    (container: Azure.Storage.Blobs.BlobContainerClient)
    (fileId: string)
    (permission: BlobSasPermissions)
    (until: System.DateTimeOffset)
    =
      let blobClient = container.GetBlobClient(fileId)
      let uri = blobClient.GenerateSasUri(BlobSasBuilder(permission, until))
      printfn "Uri %s" (uri.ToString())
      uri

  let createSasUri
    (ctx: IWebRequestContext)
    (fileId: FileId)
    (permission: BlobSasPermissions)
    (until: System.DateTimeOffset)
    =
    task {
      let containerClient = ctx.GetSrcContainer()
      let blobClient = containerClient.GetBlobClient(fileId.value().ToString())
      let uri = blobClient.GenerateSasUri(BlobSasBuilder(permission, until))
      printfn "Uri %s" (uri.ToString())
      return uri
    }

  let createPublicUrl (ctx: IWebRequestContext) (fileId: FileId) =
    taskResult {
      // let! file = ctx.DocumentSession.LoadFile fileId
      // let blobServiceClient = ctx.GetBlobServiceClient()// new BlobServiceClient(connectionString);

      let! uri = createSasUri ctx fileId BlobSasPermissions.Read (System.DateTimeOffset.UtcNow.AddDays(5))
      printfn "public uri %s" (uri.ToString())

      (fileId,
       FileEvent.PublicUrlCreated
         { Url = uri.ToString()
           Variant = Variant.Root })
      |> ctx.DocumentSession.Events.AppendFileStream

      printfn "Sas Uri created = %s" (result.ToString())

      return ()
    }
