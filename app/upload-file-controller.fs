namespace AzureFiles

open Azure.Identity
open Azure.Storage.Blobs
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

[<Action(Route = "api/blob/get-files", AllowAnonymous = true)>]
type GetFiles() =
  interface IRequest<List<Models.BlobItem>>
  member val Name = Unchecked.defaultof<string> with get, set

[<Action(Route = "api/upload-form-files", AllowAnonymous = true)>]
type UploadFormFiles() =
  interface IRequest<MediatR.Unit>

[<Action(Route = "api/upload-system-files", AllowAnonymous = true)>]
type UploadSystemFiles() =
  interface IRequest<MediatR.Unit>
  member val FilePaths = Unchecked.defaultof<ResizeArray<string>> with get,set

[<Action(Route = "api/blob/get-containers", AllowAnonymous = true)>]
type GetBlobContainers() =
  interface IRequest<List<Models.BlobContainerItem>>

type GetBlobContainersHandler(configuration: IConfiguration, logger: ILogger<GetBlobContainers>, httpContextAccessor: IHttpContextAccessor, session: IDocumentSession) =

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

        let! blobContainerClient = getBlobContainerClient configuration

        for file in files do
          let stream = file.OpenReadStream()
          let! e = addFile blobContainerClient file.FileName stream
          // let fileId = System.Guid.NewGuid()
          // let metadata =
          //   dict [ "original_filename", file.FileName ]
          // let blobClient = blobContainerClient.GetBlobClient(fileId.ToString())
          // let! result = blobClient.UploadAsync(file.OpenReadStream(), null, metadata)
          // let hash = result.Value.ContentHash
          let events: obj[] = [|e|]
          let result = session.Events.StartStream (e.Id, events)
          ()

        return Unit.Value
      }

  interface IRequestHandler<GetFiles, List<Models.BlobItem>> with
    member this.Handle(request, token) =
      task {
        let client = getBlobServiceClient configuration

        let client2 =
          client.GetBlobContainerClient(request.Name)

        let asyncPageable = client2.GetBlobsAsync(Models.BlobTraits.Metadata)

        let! y = asyncPageable.AsAsyncEnumerable().ToListAsync()

        return y
      }


[<Route("api/upload-files-form")>]
type UploadFileController(configuration: IConfiguration, logger: ILogger<UploadFileController>, mediator: IMediator) =
  inherit ControllerBase()

  [<HttpGet>]
  member self.Hello() = "Hello world"

  [<HttpPost>]
  member self.HandleUploadFile() =
    task {
      //      let files = self.Request.Form.Files
      let client = getBlobServiceClient configuration
      let! result = mediator.Send(UploadFormFiles())
      return self.Ok()
    }
