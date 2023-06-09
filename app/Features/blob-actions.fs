namespace AzureFiles

open AzFiles.Config
open Azure.Storage.Blobs
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

type InboxFileResult =
  { Previous: FileId option
    File: FileProjection
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
  interface IRequest<List<FileProjection>>
  member val TagFilter = Unchecked.defaultof<string> with get, set
  member val ShowUntagged = false with get, set

[<Action(Route = "api/files/get-indexed-file", AllowAnonymous = true)>]
type GetIndexedFile() =
  interface IRequest<FileProjection>
  member val Id = Unchecked.defaultof<System.Guid> with get, set

[<Action(Route = "api/blob/get-files", AllowAnonymous = true)>]
type GetFiles() =
  interface IRequest<ResizeArray<Models.BlobItem>>
  member val Name = Unchecked.defaultof<string> with get, set

[<Action(Route = "api/file/get-next-untagged", AllowAnonymous = true)>]
type GetNextUntaggedBlob() =
  interface IRequest<FileProjection>

[<Action(Route = "api/file/get-all-untagged", AllowAnonymous = true)>]
type GetAllUntagged() =
  interface IRequest<ResizeArray<FileProjection>>

[<Action(Route = "api/upload-form-files", AllowAnonymous = true)>]
type UploadFormFiles() =
  interface IRequest<Result<FileSavedToStorage, string> list>

[<Action(Route = "api/test-action", AllowAnonymous = true)>]
type TestAction() =
  interface IRequest<Result<FileSavedToStorage, ErrorResult> list>

[<Action(Route = "api/blob/get-containers", AllowAnonymous = true)>]
type GetBlobContainers() =
  interface IRequest<List<Models.BlobContainerItem>>

type GetBlobContainersHandler
  (
    logger: ILogger<GetBlobContainers>,
    session: IDocumentSession,
    connectionStrings: ConnectionStrings
  ) =

  interface IRequestHandler<GetAllUntagged, ResizeArray<FileProjection>> with
    member this.Handle(request, token) =
      task {
        let! entities = session.Query<FileProjection>().ToListAsync()

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

  interface IRequestHandler<GetIndexedFiles, List<FileProjection>> with
    member this.Handle(request, token) =
      task {
        let! result = session.Query<FileProjection>().ToListAsync()

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

  interface IRequestHandler<GetIndexedFile, FileProjection> with
    member this.Handle(request, token) =
      task {
        let! result = session.LoadAsync<FileProjection>(request.Id)
        return result
      }

  interface IRequestHandler<GetNextUntaggedBlob, FileProjection> with
    member this.Handle(request, token) =
      task {
        let! result = session.Query<FileProjection>().ToListAsync()

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