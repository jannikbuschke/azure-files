namespace AzFiles.Features

open AzureFiles
open Glow.Core.Actions
open MediatR
open System.Linq
open Marten
open FsToolkit.ErrorHandling

[<Action(Route = "api/remove-tagged-images-from-inbox", AllowAnonymous = true)>]
type RemoveTaggedImagesFromInbox() =
  interface IRequest<ServiceResult<unit>>

type Handler(ctx: IWebRequestContext) =

  interface IRequestHandler<RemoveTaggedImagesFromInbox, ServiceResult<unit>> with
    member this.Handle(_, _) =
      taskResult {
        let! entities = ctx.DocumentSession.QueryAsync<FileProjection>("where data -> 'RemovedFromInboxAt' = 'null'")

        entities
        |> Seq.filter (fun v -> v.Tags |> List.length > 0)
        |> Seq.map (fun v -> (v.Key(), FileEvent.RemovedFromInbox EmptyRecord.Instance))
        |> Seq.iter ctx.DocumentSession.Events.AppendFileStream

        do! ctx.DocumentSession.SaveChangesAsync()
        return ()
      }