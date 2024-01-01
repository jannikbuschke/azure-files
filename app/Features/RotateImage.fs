namespace AzFiles.Features

open System.IO
open AzFiles
open Glow.Core.Actions
open MediatR

open FsToolkit.ErrorHandling

[<Action(Route = "api/rotate", AllowAnonymous = true)>]
type Rotate =
    { Id: FileId
      Property: Property }
    interface IRequest<ApiResult<unit>>

module Rotate =

    type Handler(ctx: IWebRequestContext) =
        interface IRequestHandler<Rotate, ApiResult<unit>> with
            member this.Handle(request, token) =
                taskResult {
                    let! file = ctx.DocumentSession.LoadFile request.Id

                    let! container = ctx.GetSrcContainerAsync()

                    let client =
                        container.GetBlobClient(file.Id.ToString())

                    let stream = new MemoryStream()
                    let! response = client.DownloadToAsync stream
                    let! contentResponse = client.DownloadContentAsync()

                    let! rotatedImage =
                        if file.Filename.EndsWith ".jpeg"
                           || file.Filename.EndsWith ".jpg" then
                            contentResponse.Value.Content.ToStream()
                            |> AzFiles.ImageProcessing.rotateImage
                            |> Task.map Some
                        else
                            task { return None }

                    // what to do here?
                    rotatedImage
                    |> Option.iter (fun img -> System.IO.File.WriteAllBytes("rotated.jpg", img.ToArray()))

                    ctx.DocumentSession.Events.AppendFileStream(
                        file.Key(),
                        FileEvent.PropertyChanged(PropertyChanged.PropertyAdded request.Property)
                    )

                    do! ctx.DocumentSession.SaveChangesAsync()
                }
