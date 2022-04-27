namespace AzureFiles

open System
open Azure.Identity
open Azure.Storage.Blobs
open AzureFiles.Domain
open AzureFiles.Projections
open Glow.Glue.AspNetCore
open Microsoft.AspNetCore.Http
open Microsoft.Extensions.Configuration
open Microsoft.AspNetCore.Mvc
open Microsoft.Extensions.Logging
open BlobService
open Glow.Core.Actions
open MediatR
open System.Linq
open System.Collections.Generic
open Marten
open System.IO
open Azure.Storage.Blobs.Models

type AzureFilesBlobProperties =
  { Properties: Azure.Storage.Blobs.Models.BlobProperties
    Tags: GetBlobTagResult }

[<Action(Route = "api/blob/get-file", AllowAnonymous = true)>]
type GetBlobFile() =
  interface IRequest<AzureFilesBlobProperties>
  member val ItemId = Unchecked.defaultof<string> with get, set
  member val ContainerId = Unchecked.defaultof<string> with get, set

[<Action(Route = "api/blob/delete-file", AllowAnonymous = true)>]
type DeleteBlobFile() =
  interface IRequest<Unit>
  member val ItemId = Unchecked.defaultof<string> with get, set
  member val ContainerId = Unchecked.defaultof<string> with get, set

[<Action(Route = "api/files/get-indexed-files", AllowAnonymous = true)>]
type GetIndexedFiles() =
  interface IRequest<IReadOnlyList<Projections.File>>

[<Action(Route = "api/files/get-indexed-file", AllowAnonymous = true)>]
type GetIndexedFile() =
  interface IRequest<Projections.File>
  member val Id = Unchecked.defaultof<System.Guid> with get, set

[<Action(Route = "api/file/set-tags")>]
type SetTags() =
  interface IRequest<Unit>
  member val FileId = Unchecked.defaultof<System.Guid> with get, set
  member val Tags = Unchecked.defaultof<ResizeArray<Tag>> with get, set

[<Action(Route = "api/blob/get-files", AllowAnonymous = true)>]
type GetFiles() =
  interface IRequest<List<Models.BlobItem>>
  member val Name = Unchecked.defaultof<string> with get, set

[<Action(Route = "api/upload-form-files", AllowAnonymous = true)>]
type UploadFormFiles() =
  interface IRequest<MediatR.Unit>

[<Action(Route = "api/upload-system-files", AllowAnonymous = true)>]
type UploadSystemFiles() =
  interface IRequest<FileAdded option []>
  member val FilePaths = Unchecked.defaultof<ResizeArray<string>> with get, set

[<Action(Route = "api/rename-system-files", AllowAnonymous = true)>]
type RenameSystemFiles() =
  interface IRequest<(Guid*string) option array>
  member val Files = Unchecked.defaultof<ResizeArray<Guid * string>> with get, set
  member val FolderName = Unchecked.defaultof<string> with get, set


[<Action(Route = "api/blob/get-containers", AllowAnonymous = true)>]
type GetBlobContainers() =
  interface IRequest<List<Models.BlobContainerItem>>

type GetBlobContainersHandler
  (
    configuration: IConfiguration,
    logger: ILogger<GetBlobContainers>,
    httpContextAccessor: IHttpContextAccessor,
    session: IDocumentSession
  ) =

  interface IRequestHandler<GetBlobContainers, List<Models.BlobContainerItem>> with
    member this.Handle(request, token) =
      task {
        let client = getBlobServiceClient configuration
        let containers = client.GetBlobContainers()
        logger.LogInformation($"container count = {containers.Count}")
        let result = client.GetBlobContainersAsync()
        let! r0 = result.AsAsyncEnumerable().ToListAsync()
        return r0
      }

  interface IRequestHandler<UploadFormFiles, MediatR.Unit> with
    member this.Handle(request, token) =
      task {
        let httpContext = httpContextAccessor.HttpContext
        let files = httpContext.Request.Form.Files

        for file in files do
          let stream = file.OpenReadStream()
          let! e = addFileIfNotYetExists configuration file.FileName stream logger
          do! addDomainEventIfSome e session

        return Unit.Value
      }

  interface IRequestHandler<GetFiles, List<Models.BlobItem>> with
    member this.Handle(request, token) =
      task {
        let client = getBlobServiceClient configuration

        let client2 =
          client.GetBlobContainerClient(request.Name)

        let asyncPageable =
          client2.GetBlobsAsync(Models.BlobTraits.Metadata)

        let! y = asyncPageable.AsAsyncEnumerable().ToListAsync()

        return y
      }

  interface IRequestHandler<UploadSystemFiles, FileAdded option []> with
    member this.Handle(request, token) =

      let handle (pathName: string) =
        async {
          logger.LogInformation "wait 200 ms"
          let fileName = Path.GetFileName(pathName)
          do! Async.Sleep(TimeSpan.FromMilliseconds 200)

          logger.LogInformation "open stream"

          use stream =
            File.Open(pathName, FileMode.Open, FileAccess.Read, FileShare.ReadWrite)

          logger.LogInformation "add file if not yet exists"

          let! e =
            addFileIfNotYetExists configuration fileName stream logger
            |> Async.AwaitTask

          logger.LogInformation "add domain event if some"

          do! addDomainEventIfSome e session |> Async.AwaitTask
          logger.LogInformation "wait for 200 ms"

          do! Async.Sleep(TimeSpan.FromMilliseconds 200)

          logger.LogInformation "wait done"
          logger.LogInformation "upload file done"

          return e
        }

      let handleIfExists pathName =
        match System.IO.File.Exists(pathName) with
        | true -> handle pathName
        | _ -> async { return Option<FileAdded>.None }

      async {
        return!
          request.FilePaths
          |> Seq.map handleIfExists
          |> Async.Sequential
      }
      |> Async.StartAsTask


  interface IRequestHandler<RenameSystemFiles,(Guid*string) option array> with
    member this.Handle(request, token) =

      logger.LogInformation($"Rename {request.Files.Count} files")

      let handle (id:System.Guid, pathName:string) = async {
        logger.LogInformation(sprintf "rename %s" pathName)
        let extension = Path.GetExtension(pathName)
        let filename = Path.GetFileName(pathName)
        let srcDir = FileInfo(pathName).Directory.FullName
        let targetDir = Path.Combine(srcDir, request.FolderName)
        let targetFilename = Path.Combine(targetDir, $"{id.ToString()}.{extension}")
        File.Move(pathName, targetFilename)
        return Some (id, targetFilename)
      }

      let handleIfExists (id, pathName) =
        if System.IO.File.Exists(pathName) then
          handle (id, pathName)
        else
          async { return Option<System.Guid*string>.None }

      async {
        return!
          request.Files
          |> Seq.map handleIfExists
          |> Async.Sequential
      }
      |> Async.StartAsTask
      // map over files
//      task {
//        try
//          for pathName in request.FilePaths do
//            do! System.Threading.Tasks.Task.Delay(500)
//
//            let filename = Path.GetFileName(pathName)
//            let srcDir = FileInfo(pathName).Directory.FullName
//            let targetDir = Path.Combine(srcDir, request.FolderName)
//            let targetFilename = Path.Combine(targetDir, filename)
//            File.Move(pathName, targetFilename)
//            do! System.Threading.Tasks.Task.Delay(500)
//            ()
//
//        with
//        | :? System.Exception as e -> logger.LogInformation("DIDNT WORK " + e.Message)
//
//        return MediatR.Unit.Value
//      }

  interface IRequestHandler<GetIndexedFiles, IReadOnlyList<Projections.File>> with
    member this.Handle(request, token) =
      task {
        let! result = session.Query<Projections.File>().ToListAsync()
        return result
      }

  interface IRequestHandler<GetIndexedFile, Projections.File> with
    member this.Handle(request, token) =
      task {
        let! result = session.LoadAsync<Projections.File>(request.Id)
        return result
      }

  interface IRequestHandler<DeleteBlobFile, MediatR.Unit> with
    member this.Handle(request, token) =
      task {
        let client = getBlobServiceClient configuration

        let client2 =
          client.GetBlobContainerClient(request.ContainerId)

        let client3 = client2.GetBlobClient(request.ItemId)
        let! response = client3.DeleteAsync()
        return Unit.Value
      }

  interface IRequestHandler<GetBlobFile, AzureFilesBlobProperties> with
    member this.Handle(request, token) =
      task {
        let client = getBlobServiceClient configuration

        let client2 =
          client.GetBlobContainerClient(request.ContainerId)

        let client3 = client2.GetBlobClient(request.ItemId)
        let props = client3.GetProperties().Value
        let tags = client3.GetTags().Value

        return { Properties = props; Tags = tags }
      }

  interface IRequestHandler<SetTags, Unit> with
    member this.Handle(request, token) =
      task {
        let tags = request.Tags |> Seq.toList
        let e: TagsSet = { Tags = tags }
        let events: obj [] = [| e |]

        session.Events.Append(request.FileId, events)
        |> ignore

        do! session.SaveChangesAsync()
        return Unit.Value

      }
