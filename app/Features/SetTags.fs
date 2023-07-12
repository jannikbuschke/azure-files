module AzFiles.Features.TagMany

open AzureFiles
open Glow.Core.Actions
open MediatR

open FsToolkit.ErrorHandling

[<Action(Route = "api/file/tag-many")>]
type TagMany =
  { Filter: Filter
    Tags: string list }
  interface IRequest<ApiResult<unit>>

module TagMany =
  type Handler(ctx: IWebRequestContext) =

    interface IRequestHandler<TagMany, ApiResult<unit>> with
      member this.Handle(request, _) =
        taskResult {

          let! files = ctx.DocumentSession.GetFiles request.Filter

          files
          |> Seq.collect (fun file ->
            request.Tags
            |> Seq.map (fun tag -> (file.Key(), FileEvent.TagAdded { Name = tag })))
          |> Seq.iter ctx.DocumentSession.Events.AppendFileStream

          do! ctx.DocumentSession.SaveChangesAsync()

          return ()
        }