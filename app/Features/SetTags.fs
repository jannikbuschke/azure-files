module AzFiles.Features.SetTags

open AzureFiles
open Glow.Core.Actions
open MediatR

open FsToolkit.ErrorHandling

[<Action(Route = "api/file/set-tags")>]
type SetTags =
  { FileId: System.Guid
    Tags: string list }
  interface IRequest<ServiceResult<unit>>

type SetTagsHandler(ctx: WebRequestContext) =

  interface IRequestHandler<SetTags, ServiceResult<unit>> with
    member this.Handle(request, _) =
      taskResult {
        let tags = request.Tags |> Seq.toList

        tags
        |> List.iter (fun t ->
          ctx.DocumentSession.Events.AppendFileStream(request.FileId |> FileId.create, FileEvent.TagAdded { Name = t }))

        do! ctx.DocumentSession.SaveChangesAsync()

        return ()
      }