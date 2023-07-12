namespace AzFiles.Features

open AzureFiles
open Glow.Core.Actions
open MediatR
open FsToolkit.ErrorHandling

[<Action(Route = "api/remove-tagged-images-from-inbox", AllowAnonymous = true)>]
type RemoveTaggedImagesFromInbox() =
  interface IRequest<ApiResult<unit>>

module RemoveTaggedImagesFromInbox =
  type Handler(ctx: IWebRequestContext) =

    interface IRequestHandler<RemoveTaggedImagesFromInbox, ApiResult<unit>> with
      member this.Handle(_, _) =
        taskResult {
          let! taggedImages =
            ctx.DocumentSession.QueryAsync<FileProjection>("where data -> 'RemovedFromInboxAt' <> 'null'")

          let! entities = ctx.DocumentSession.QueryAsync<FileProjection>("where data -> 'RemovedFromInboxAt' = 'null'")
          GetInboxFiles.GetInboxFiles.resetInboxFilesCache ()

          taggedImages
          |> Seq.filter (fun v ->
            v.Tags
            |> List.contains (SpecialTag.MarkForCleanup))
          |> Seq.map (fun v -> (v.Key(), FileEvent.Deleted EmptyRecord.Instance))
          |> Seq.iter ctx.DocumentSession.Events.AppendFileStream

          entities
          |> Seq.filter (fun v -> v.Tags |> List.length > 0)
          |> Seq.map (fun v ->
            if
              v.Tags
              |> List.contains (SpecialTag.MarkForCleanup)
            then
              (v.Key(), FileEvent.Deleted EmptyRecord.Instance)
            else
              (v.Key(), FileEvent.RemovedFromInbox EmptyRecord.Instance))
          |> Seq.iter ctx.DocumentSession.Events.AppendFileStream

          do! ctx.DocumentSession.SaveChangesAsync()
          return ()
        }