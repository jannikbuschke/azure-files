namespace AzureFiles

open AzureFiles
open Marten
open System.IO
open Microsoft.AspNetCore.Http
open Microsoft.Extensions.DependencyInjection
open FSharp.Control
open System
open Microsoft.Extensions.Logging
open FsToolkit.ErrorHandling

module Workflow =

  let initiallyHandleFilePath (path: string) : FileScanned =
    { Id = FileId.create <| System.Guid.NewGuid()
      Filename = Path.GetFileName path
      LocalFilePath = Some path
      LocalChecksum = WorkflowUtils.getMd5Hash path }

  let initiallyHandleFormFile (file: IFormFile) : FormFileScanned =
    use stream = file.OpenReadStream()
    let checksum = WorkflowUtils.getMd5HashFromStream stream

    { FormFileScanned.Id = FileId.create <| System.Guid.NewGuid()
      Filename = file.FileName
      FormFile = file
      LocalChecksum = checksum }

  // let initializeStream (session: IDocumentSession) (e: FileSavedToStorage) =
  //   let id = FileId(System.Guid.NewGuid())
  //
  //   session.Events.StartFileStream(id, FileInitEvent.FileSavedToStorage e)
  //   |> ignore

  let mapAsync f a =
    async {
      let! v = a
      return (f v)
    }

  type CheckDuplicateBasedOnLocalChecksumHandler = FileScanned -> Async<DuplicateCheckResult>

  let initiallyHandleFile
    (localDuplicateChecker: CheckDuplicateBasedOnLocalChecksumHandler)
    (path: string)
    : Async<Result<FileScanned, ErrorResult>> =
    async {
      let localFileScanned = initiallyHandleFilePath path

      let! localDuplicateCheckResult = localDuplicateChecker localFileScanned

      return
        match localDuplicateCheckResult with
        | IsDuplicate id -> Result.Error(FileIsDuplicate(id, localFileScanned.Filename))
        | IsNew -> Result.Ok localFileScanned
    }

  type Upload = FileScanned -> Async<FileSavedToStorage>

  let uploadOriginalFileAndSaveEvent (services: IServiceProvider) (localFile: FileScanned) =
    let configuration =
      services.GetService<Microsoft.Extensions.Configuration.IConfiguration>()

    let session = services.GetService<IDocumentSession>()

    async {
      let! blobInboxContainerClient = BlobService.getBlobContainerSourceFiles configuration

      let! uploaded =
        BlobService.uploadOriginalFile blobInboxContainerClient localFile
        |> Async.AwaitTask
      //
      // session.Events.StartFileStream(localFile.Id, FileInitEvent.FileSavedToStorage uploaded)
      // |> ignore

      let! x = session.SaveChangesAsync() |> Async.AwaitTask
      return uploaded
    }

  let createVariantAndAppendEvent
    (ctx: WebRequestContext)
    (width: int32)
    (variantName: string)
    (localFile: FormFileScanned)
    =
    taskResult {
      use stream = localFile.FormFile.OpenReadStream()
      let! dimension, variantData = AzFiles.ImageProcessing.resizeImage stream width
      let id = FileId.value localFile.Id
      let filename = $"{id.ToString()}-{variantName}"
      let! imgVariantsClient = ctx.GetVariantsContainer()
      // let! imgVariantsClient = BlobService.getBlobContainerClient configuration "img-variants"
      let uploadVariant (stream: MemoryStream) (filename: string) =
        let client = imgVariantsClient.GetBlobClient(filename)
        client.UploadAsync(stream, null, null)

      let! result = uploadVariant variantData filename

      let uri = imgVariantsClient.Uri

      let e: LowresVersionCreated =
        { Url = $"{uri}/{filename}"
          Dimension = dimension
          VariantName = variantName }

      ctx.DocumentSession.Events.AppendFileStream(localFile.Id, FileEvent.LowresVersionCreated e)
      |> ignore


    }

  let createVariantAndSaveEvent
    (services: IServiceProvider)
    (width: int32)
    (variantName: string)
    (localFile: FileScanned)
    : Async<Result<LowresVersionCreated, ErrorResult>> =
    async {
      let! dimension, variantData = AzFiles.ImageProcessing.resizeWithImageSharp localFile.LocalFilePath.Value width

      let id = FileId.value localFile.Id

      let filename = $"{id.ToString()}-{variantName}"

      let configuration =
        services.GetService<Microsoft.Extensions.Configuration.IConfiguration>()

      let session = services.GetService<IDocumentSession>()

      let! imgVariantsClient = BlobService.getBlobContainerClient configuration "img-variants"

      let uploadVariant (stream: MemoryStream) (filename: string) =
        let client = imgVariantsClient.GetBlobClient(filename)

        client.UploadAsync(stream, null, null)

      let! result =
        uploadVariant variantData filename
        |> Async.AwaitTask
        |> Async.Catch

      let uri = imgVariantsClient.Uri

      let! matchResult =
        match result with
        | Choice1Of2 success ->
          let e: LowresVersionCreated =
            { Url = $"{uri}/{filename}"
              Dimension = dimension
              VariantName = variantName }

          session.Events.AppendFileStream(localFile.Id, FileEvent.LowresVersionCreated e)
          |> ignore

          async {
            do! session.SaveChangesAsync() |> Async.AwaitTask
            return Result.Ok e
          }
        | Choice2Of2 error -> async { return Result.Error(ErrorResult.NetworkError error.Message) }

      return matchResult
    }

  let mapAsyncResult f =
    fun x ->
      async {
        match x with
        | Result.Ok ok ->
          let! result = f ok
          return Result.Ok result
        | Result.Error error -> return Result.Error error
      }

  // let uploadFormfile (services:IServiceProvider)(file:IFormFile)=
  //   taskResult{
  //   let session =
  //     services.GetService<IDocumentSession>()
  //   let loggerFactory = services.GetService<ILoggerFactory>()
  //   let logger = loggerFactory.CreateLogger("File Workflow")
  //   logger.LogInformation($"Run workflow for form file '{file.FileName}'")
  //   let configuration = services.GetService<Microsoft.Extensions.Configuration.IConfiguration>()
  //
  //   let blobServiceClient =
  //     BlobService.getBlobServiceClient configuration
  //   let checkDuplicateBasedOnLocalChecksum =
  //       BlobService.checkFileAlreadyHandledBasedOnLocalMd5hash blobServiceClient services
  //
  //   let! initialCheckResult =
  //     path
  //     |> initiallyHandleFile checkDuplicateBasedOnLocalChecksum
  //
  //   let! uploadResult = mapAsyncResult (uploadOriginalFileAndSaveEvent services) initialCheckResult
  //   // let uploadOriginalFile = Result.bind( uploadOriginalFileAndSaveEvent services )
  //
  //   let! lowres1 = mapAsyncResult(createVariantAndSaveEvent services 200 "thumbnail")  initialCheckResult
  //   let! lowres3 = mapAsyncResult(createVariantAndSaveEvent services 1920 "fullhd") initialCheckResult
  //   return ()
  //   }

  let runWorkflowForFilePath (services: IServiceProvider) (path) =
    let session = services.GetService<IDocumentSession>()
    let loggerFactory = services.GetService<ILoggerFactory>()
    let logger = loggerFactory.CreateLogger("File Workflow")
    logger.LogInformation($"Run workflow for path '{path}'")

    let configuration =
      services.GetService<Microsoft.Extensions.Configuration.IConfiguration>()

    let blobServiceClient = BlobService.getBlobServiceClient configuration

    async {
      let! blobInboxContainerClient = BlobService.getBlobContainerSourceFiles configuration

      let checkDuplicateBasedOnLocalChecksum =
        BlobService.checkFileAlreadyHandledBasedOnLocalMd5hash blobServiceClient services

      // let init = initiallyHandleFilePath path

      let! initialCheckResult =
        path
        |> initiallyHandleFile checkDuplicateBasedOnLocalChecksum

      let! uploadResult = mapAsyncResult (uploadOriginalFileAndSaveEvent services) initialCheckResult
      // let uploadOriginalFile = Result.bind( uploadOriginalFileAndSaveEvent services )

      let! lowres1 = mapAsyncResult (createVariantAndSaveEvent services 200 "thumbnail") initialCheckResult
      let! lowres3 = mapAsyncResult (createVariantAndSaveEvent services 1920 "fullhd") initialCheckResult
      return ()
    }