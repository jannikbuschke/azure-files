namespace AzureFiles

open AzFiles
open AzFiles.Config
open AzFiles.Exif
open AzureFiles
open Marten
open System.IO
open Microsoft.AspNetCore.Http
open Microsoft.Extensions.DependencyInjection
open FSharp.Control
open System
open FsToolkit.ErrorHandling

module Workflow =

  let readExifDataFromCacheOrBlob (ctx: IWebRequestContext) (fileId: FileId) =
      let getStreamAsync = WebRequestContext.getBlobContentStreamAsync ctx fileId
      Exif.readExifData (ctx.GetLogger<obj>(),fileId, getStreamAsync)

  // let initiallyHandleFilePath (path: string) : FileScanned =
  //   { Id = FileId.create <| System.Guid.NewGuid()
  //     Filename = Path.GetFileName path
  //     LocalFilePath = Some path
  //     LocalChecksum = WorkflowUtils.getMd5Hash path }
  //
  let initiallyHandleFormFile (file: IFormFile) : FormFileScanned =

    use stream = file.OpenReadStream()
    let checksum = WorkflowUtils.getMd5HashFromStream stream

    { FormFileScanned.Id = FileId.create <| System.Guid.NewGuid()
      Filename = file.FileName
      FormFile = file
      LocalChecksum = checksum }

  let createVariant (ctx: IWebRequestContext) (width: int32) (variantName: string) (fileId: FileId) =
    taskResult {
      let! fileStream = (WebRequestContext.getBlobContentStreamAsync ctx fileId) ()
      // use stream = localFile.FormFile.OpenReadStream()
      // let! info = SixLabors.ImageSharp.Image.IdentifyAsync fileStream
      // fileStream.Position <- 0
      //
      // let! x =
      //   info
      //   |> Result.requireNotNull ({ ApiError.Message = "Could not identify image" })
      //
      // fileStream.Position <- 0
      let! dimension, variantData = AzFiles.ImageProcessing.resizeImage fileStream width
      // let id = FileId.value localFile.Id
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

//
// type CheckDuplicateBasedOnLocalChecksumHandler = FileScanned -> Async<DuplicateCheckResult>
//
// type Upload = FileScanned -> Async<FileSavedToStorage>
//
// let createVariantAndAppendEvent
//   (ctx: IWebRequestContext)
//   (width: int32)
//   (variantName: string)
//   (localFile: FormFileScanned)
//   =
//   taskResult {
//     use stream = localFile.FormFile.OpenReadStream()
//     let! dimension, variantData = AzFiles.ImageProcessing.resizeImage stream width
//     let id = FileId.value localFile.Id
//     let filename = $"{id.ToString()}-{variantName}"
//     let! imgVariantsClient = ctx.GetVariantsContainer()
//     let uploadVariant (stream: MemoryStream) (filename: string) =
//       let client = imgVariantsClient.GetBlobClient(filename)
//       client.UploadAsync(stream, null, null)
//
//     let uri = imgVariantsClient.Uri
//
//     let e: LowresVersionCreated =
//       { Url = $"{uri}/{filename}"
//         Dimension = dimension
//         VariantName = variantName }
//
//     ctx.DocumentSession.Events.AppendFileStream(localFile.Id, FileEvent.LowresVersionCreated e)
//   }
//
// let createVariantAndSaveEvent
//   (services: IServiceProvider)
//   (width: int32)
//   (variantName: string)
//   (localFile: FileScanned)
//   : Async<Result<LowresVersionCreated, ErrorResult>> =
//   async {
//     let! dimension, variantData = AzFiles.ImageProcessing.resizeWithImageSharp localFile.LocalFilePath.Value width
//
//     let id = FileId.value localFile.Id
//
//     let filename = $"{id.ToString()}-{variantName}"
//
//     let connectionStrings = services.GetService<ConnectionStrings>()
//
//     let session = services.GetService<IDocumentSession>()
//
//     let! imgVariantsClient = BlobService.getBlobContainerClient connectionStrings.AzureBlob "img-variants"
//
//     let uploadVariant (stream: MemoryStream) (filename: string) =
//       let client = imgVariantsClient.GetBlobClient(filename)
//
//       client.UploadAsync(stream, null, null)
//
//     let! result =
//       uploadVariant variantData filename
//       |> Async.AwaitTask
//       |> Async.Catch
//
//     let uri = imgVariantsClient.Uri
//
//     let! matchResult =
//       match result with
//       | Choice1Of2 success ->
//         let e: LowresVersionCreated =
//           { Url = $"{uri}/{filename}"
//             Dimension = dimension
//             VariantName = variantName }
//
//         session.Events.AppendFileStream(localFile.Id, FileEvent.LowresVersionCreated e)
//
//         async {
//           do! session.SaveChangesAsync() |> Async.AwaitTask
//           return Result.Ok e
//         }
//       | Choice2Of2 error -> async { return Result.Error(ErrorResult.NetworkError error.Message) }
//
//     return matchResult
//   }
