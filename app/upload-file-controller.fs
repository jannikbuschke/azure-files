namespace AzureFiles

open System
open Azure.Storage.Blobs
open AzureFiles.Domain
open Microsoft.AspNetCore.Http
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
open AzFiles.ImageProcessing
open SixLabors.ImageSharp
open SixLabors.ImageSharp.Processing

//type Tag =
//  | StageForBlog
//  | Publish
//  | Keep
//  | Remove

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
  member val FilterByTag = Unchecked.defaultof<string> with get, set

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
  interface IRequest<string array>
  member val Files = Unchecked.defaultof<ResizeArray<string>> with get, set
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
        logger.LogInformation($"container count = {containers.Count()}")
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
          do! addDomainEventIfSome e session logger

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
          logger.LogInformation("handle for upload " + pathName)

          logger.LogInformation "wait 200 ms"
          let fileName = Path.GetFileName(pathName)
          do! Async.Sleep(TimeSpan.FromMilliseconds 100)

          logger.LogInformation "open stream"

          use stream =
            File.Open(pathName, FileMode.Open, FileAccess.Read, FileShare.ReadWrite)

          logger.LogInformation "add file if not yet exists"

          let! e =
            addFileIfNotYetExists configuration fileName stream logger

          logger.LogInformation "add domain event if some"

          let! result =
            addDomainEventIfSome e session logger
            |> Async.AwaitTask

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
        let! result =
          request.FilePaths
          |> Seq.map handleIfExists
          |> Async.Sequential

        try
          let! result1 = session.SaveChangesAsync() |> Async.AwaitTask
          return result
        with
        | error ->
          logger.LogInformation("error " + error.Message)
          return result
      }
      |> Async.StartAsTask


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

          let targetFilename =
            Path.Combine(targetDir, $"{id.ToString()}.{extension}")

          File.Move(pathName, targetFilename)
          return targetFilename
        }

      let handleIfExists (pathName) =

        if System.IO.File.Exists(pathName) then
          logger.LogInformation("rename (file does exist)")
          handle (pathName)
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

  interface IRequestHandler<GetIndexedFiles, IReadOnlyList<Projections.File>> with
    member this.Handle(request, token) =
      task {
        let! result = session.Query<Projections.File>().ToListAsync()

        return
          if String.IsNullOrEmpty(request.FilterByTag) then
            result
          else
            result
              .Where(fun v -> v.Tags.Any(fun x -> x.Name = request.FilterByTag))
              .ToList()
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

        let! blobContainerClient = getBlobContainerSourceFiles configuration

        let client =
          blobContainerClient.GetBlobClient(request.FileId.ToString())

        let dim = { Width = 150; Height = 150 }
        let stream = client.OpenRead()

        let resize (path: string) =
          let image =
            Image.Load("C:\\Users\\jannik\\Pictures\\background.jpg")

          image.Mutate
            (fun x ->
              x
                .Resize(image.Width / 4, image.Height / 4)
                .Grayscale()
              |> ignore)

          image.Save("bar.jpg")

        resize ("")

        let stream =
          File.Open("C:\\Users\\jannik\\Pictures\\background.jpg", FileMode.OpenOrCreate)

        return Unit.Value
      }
