namespace AzureFiles

open System
open System.Threading.Tasks
open AzFiles.Config
open Azure.Storage.Blobs
open Microsoft.AspNetCore.Mvc
open Microsoft.Extensions.Configuration
open Microsoft.Extensions.Logging
open BlobService
open Glow.Core.Actions
open MediatR
open System.Linq
open System.Collections.Generic
open Marten
open System.IO
open Azure.Storage.Blobs.Models
open FsToolkit.ErrorHandling
open Microsoft.Extensions.DependencyInjection

type InboxFileResult =
  { Previous: FileId option
    File: FileAggregate
    Next: FileId option }

type AzureFilesBlobProperties =
  { Properties: Azure.Storage.Blobs.Models.BlobProperties
    Tags: GetBlobTagResult }

[<Action(Route = "api/blob/get-file", AllowAnonymous = true)>]
type GetBlobFile() =
  interface IRequest<AzureFilesBlobProperties>
  member val ItemId = Unchecked.defaultof<string> with get, set
  member val ContainerId = Unchecked.defaultof<string> with get, set

[<Action(Route = "api/blob/delete-all-in-container", AllowAnonymous = true)>]
type DeleteAllBlobs() =
  interface IRequest<Unit>
  member val ContainerName = Unchecked.defaultof<string> with get, set

[<Action(Route = "api/blob/delete-file", AllowAnonymous = true)>]
type DeleteBlobFile() =
  interface IRequest<Unit>
  member val ItemId = Unchecked.defaultof<string> with get, set
  member val ContainerId = Unchecked.defaultof<string> with get, set

type GetIndexedFilesFilter =
  | EmptyTags
  | FilterByTag of string

[<Action(Route = "api/files/get-indexed-files", AllowAnonymous = true)>]
type GetIndexedFiles() =
  interface IRequest<List<FileAggregate>>
  member val TagFilter = Unchecked.defaultof<string> with get, set
  member val ShowUntagged = false with get, set

[<Action(Route = "api/files/get-indexed-file", AllowAnonymous = true)>]
type GetIndexedFile() =
  interface IRequest<FileAggregate>
  member val Id = Unchecked.defaultof<System.Guid> with get, set

[<Action(Route = "api/blob/get-files", AllowAnonymous = true)>]
type GetFiles() =
  interface IRequest<ResizeArray<Models.BlobItem>>
  member val Name = Unchecked.defaultof<string> with get, set

[<Action(Route = "api/file/get-next-untagged", AllowAnonymous = true)>]
type GetNextUntaggedBlob() =
  interface IRequest<FileAggregate>

[<Action(Route = "api/file/get-all-untagged", AllowAnonymous = true)>]
type GetAllUntagged() =
  interface IRequest<ResizeArray<FileAggregate>>

[<Action(Route = "api/upload-form-files", AllowAnonymous = true)>]
type UploadFormFiles() =
  interface IRequest<Result<FileSavedToStorage, string> list>

[<Action(Route = "api/test-action", AllowAnonymous = true)>]
type TestAction() =
  interface IRequest<Result<FileSavedToStorage, ErrorResult> list>

[<Action(Route = "api/upload-system-files", AllowAnonymous = true)>]
type UploadSystemFiles() =
  interface IRequest<FileSavedToStorage option []>
  member val FilePaths = Unchecked.defaultof<ResizeArray<string>> with get, set

[<Action(Route = "api/rename-system-files", AllowAnonymous = true)>]
type RenameSystemFiles() =
  interface IRequest<string array>
  member val Files = Unchecked.defaultof<ResizeArray<string>> with get, set
  member val FolderName = Unchecked.defaultof<string> with get, set

[<Action(Route = "api/blob/get-containers", AllowAnonymous = true)>]
type GetBlobContainers() =
  interface IRequest<List<Models.BlobContainerItem>>

type GetBlobContainersHandler
  (
    ctx: WebRequestContext,
    configuration: IConfiguration,
    logger: ILogger<GetBlobContainers>,
    session: IDocumentSession,
    connectionStrings: ConnectionStrings
  ) =

  interface IRequestHandler<GetAllUntagged, ResizeArray<FileAggregate>> with
    member this.Handle(request, token) =
      task {
        let! entities = session.Query<FileAggregate>().ToListAsync()

        let result = entities.Where(fun v -> v.Tags.Length = 0)

        return ResizeArray(result)
      }

  interface IRequestHandler<GetBlobContainers, List<Models.BlobContainerItem>> with
    member this.Handle(request, token) =
      task {
        let client = getBlobServiceClient connectionStrings.AzureBlob
        let containers = client.GetBlobContainers()
        logger.LogInformation($"container count = {containers.Count()}")
        let result = client.GetBlobContainersAsync()
        let! r0 = result.AsAsyncEnumerable().ToListAsync()
        return r0
      // return ResizeArray()
      }

  interface IRequestHandler<GetFiles, List<Models.BlobItem>> with
    member this.Handle(request, token) =
      task {
        let client = getBlobServiceClient connectionStrings.AzureBlob

        let client2 = client.GetBlobContainerClient(request.Name)

        let asyncPageable = client2.GetBlobsAsync(Models.BlobTraits.Metadata)

        let! y = asyncPageable.AsAsyncEnumerable().ToListAsync()

        return y
      // return ResizeArray()
      }

  interface IRequestHandler<RenameSystemFiles, string array> with
    member this.Handle(request, token) =

      logger.LogInformation($"Rename {request.Files.Count} files")

      let handle (pathName: string) =
        async {
          logger.LogInformation(sprintf "rename %s" pathName)
          let id = System.Guid.NewGuid()
          let extension = Path.GetExtension(pathName)
          let filename = Path.GetFileName(pathName)
          let srcDir = FileInfo(pathName).Directory.FullName
          let targetDir = Path.Combine(srcDir, request.FolderName)

          let targetFilename = Path.Combine(targetDir, $"{id.ToString()}.{extension}")

          File.Move(pathName, targetFilename)
          return targetFilename
        }

      let handleIfExists pathName =

        if System.IO.File.Exists(pathName) then
          logger.LogInformation("rename (file does exist)")
          handle pathName
        else
          async {
            logger.LogInformation("do nothing (file does not exist)")
            return ""
          }

      async {
        return!
          request.Files
          |> Seq.map handleIfExists
          |> Async.Sequential
      }
      |> Async.StartAsTask

  interface IRequestHandler<GetIndexedFiles, List<FileAggregate>> with
    member this.Handle(request, token) =
      task {
        let! result = session.Query<FileAggregate>().ToListAsync()

        return
          if request.ShowUntagged then
            result.Where(fun v -> v.Tags.Length = 0).ToList()
          else
            result
              .Where(fun v ->
                request.TagFilter = null
                || v.Tags.Any(fun x -> x = request.TagFilter))
              .ToList()
      }

  interface IRequestHandler<GetIndexedFile, FileAggregate> with
    member this.Handle(request, token) =
      task {
        let! result = session.LoadAsync<FileAggregate>(request.Id)
        return result
      }

  interface IRequestHandler<GetNextUntaggedBlob, FileAggregate> with
    member this.Handle(request, token) =
      task {
        let! result = session.Query<FileAggregate>().ToListAsync()

        return
          result
            .Where(fun v -> v.Tags.Length = 0)
            .FirstOrDefault()
      }

  interface IRequestHandler<DeleteBlobFile, MediatR.Unit> with
    member this.Handle(request, token) =
      task {
        let client = getBlobServiceClient connectionStrings.AzureBlob

        let client2 = client.GetBlobContainerClient(request.ContainerId)

        let client3 = client2.GetBlobClient(request.ItemId)
        let! response = client3.DeleteAsync()
        return Unit.Value
      }

  interface IRequestHandler<GetBlobFile, AzureFilesBlobProperties> with
    member this.Handle(request, token) =
      task {
        let client = getBlobServiceClient connectionStrings.AzureBlob

        let client2 = client.GetBlobContainerClient(request.ContainerId)

        let client3 = client2.GetBlobClient(request.ItemId)
        let props = client3.GetProperties().Value
        let tags = client3.GetTags().Value

        return { Properties = props; Tags = tags }
      }

  interface IRequestHandler<DeleteAllBlobs, Unit> with
    member this.Handle(request, token) =
      task {
        let! container = getBlobContainerClient connectionStrings.AzureBlob request.ContainerName

        do!
          deleteAllBlobsInContainer container
          |> Async.AwaitTask

        return Unit.Value
      }

type TestController(logger: ILogger<TestController>, ctx: WebRequestContext, serviceProvider: IServiceProvider) =
  inherit ControllerBase()

  // this is currently used
  [<HttpPost("api/files/upload-files-2")>]
  member this.UploadFiles() =
    task {
      logger.LogInformation("handle upload form files {@formfiles}", ctx.HttpContext.Request.Form.Files)
      // let httpContext = httpContextAccessor.HttpContext
      // logger.LogInformation(sprintf "count %d" httpContext.Request.Form.Files.Count)

      let init =
        ctx.HttpContext.Request.Form.Files
        |> Seq.map Workflow.initiallyHandleFormFile
        |> Seq.toList

      logger.LogInformation("init {@init}", init)

      let tasks =
        init
        |> List.map (fun file ->
          taskResult {
            use stream = new MemoryStream()
            file.FormFile.OpenReadStream().CopyTo(stream)
            stream.Position <- 0

            // maybe its fine
            // whats next up?
            // validate if production database should be on localhost
            // maybe, production db on localhost, image storage on azure
            // next up: cleanup
            // then: implement nice homepage

            use scope = serviceProvider.CreateScope()
            let ctx = scope.ServiceProvider.GetRequiredService<WebRequestContext>()
            do! validateFileIsNotAlreadyUploaded ctx.DocumentSession file
            let! result = uploadFileAndAppendEvent ctx file stream

            // do! Workflow.createVariantAndAppendEvent ctx 200 "thumbnail" file
            // do! Workflow.createVariantAndAppendEvent ctx 1920 "fullhd" file

            do! ctx.DocumentSession.SaveChangesAsync()

            return result
          })

      let! results = Task.WhenAll(tasks)
      logger.LogInformation("result {@result}", result)

      // let files = httpContext.Request.Form.Files
      return results |> Seq.toList
    }