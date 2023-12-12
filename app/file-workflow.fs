namespace AzFiles

open AzFiles
open System.IO
open Azure.Storage.Sas
open Microsoft.AspNetCore.Http
open FsToolkit.ErrorHandling

module Workflow =

  let readExifDataFromCacheOrBlob (ctx: IWebRequestContext) (fileId: FileId) =
    let getStreamAsync = WebRequestContext.getSrcBlobContentStreamAsync ctx fileId
    Exif.readExifData (ctx.GetLogger<obj>(), fileId, getStreamAsync)

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
      let! imgVariantsClient = ctx.GetVariantsContainer()

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
    
  let createPublicUrl (ctx: IWebRequestContext) (fileId: FileId) =
    taskResult {
      let! file = ctx.DocumentSession.LoadFile fileId
      let blobServiceClient = ctx.GetBlobServiceClient()// new BlobServiceClient(connectionString);
      let! containerClient = ctx.GetSrcContainer()
      let blobClient = containerClient.GetBlobClient(file.Id.ToString());
      let uri = blobClient.GenerateSasUri(BlobSasBuilder(BlobSasPermissions.Read, System.DateTimeOffset.UtcNow.AddDays(5)))
      printfn "public uri %s" (uri.ToString())

      (fileId,
       FileEvent.PublicUrlCreated
         { Url = uri.ToString()
           Variant = Variant.Root })
      |> ctx.DocumentSession.Events.AppendFileStream

      printfn "Sas Uri created = %s" (result.ToString())

      return ()
    }
