module AzFiles.Features.TagMany

open AzFiles
open AzFiles.Features.GetTaggedImages
open Glow.Core.Actions
open MediatR

open FsToolkit.ErrorHandling

[<Action(Route = "api/file/tag-many")>]
type TagMany =
  { Filter: ImageFilter
    Tags: string list }
  interface IRequest<ApiResult<unit>>

module TagMany =
  type Handler(ctx: IWebRequestContext) =

    interface IRequestHandler<TagMany, ApiResult<unit>> with
      member this.Handle(request, _) =
        taskResult {
          let! result =
            AzFiles.Features.GetTaggedImages.GetImages.getCachedTaggedFiles
              ctx
              { Filter = request.Filter
                ChronologicalSortDirection = Asc
                Pagination = NoPagination }

          result.Result
          |> Seq.iter (fun file ->
            request.Tags
            |> Seq.iter (fun tag ->
              if not (file.Tags |> List.contains tag) then
                ctx.DocumentSession.Events.AppendFileStream(file.Id, FileEvent.TagAdded { Name = tag })))

          do! ctx.DocumentSession.SaveChangesAsync()

          return ()
        }