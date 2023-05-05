module AzFiles.Features.GetTaggedImages

open AzureFiles
open Glow.Core.Actions
open MediatR

[<Action(Route = "api/get-tags", AllowAnonymous = true)>]
type GetTags =
  { None: EmptyRecord }
  interface IRequest<string list>

[<Action(Route = "api/get-images", AllowAnonymous = true)>]
type GetImages =
  { IncludingTags: string list }
  interface IRequest<FileAggregate list>

type GetTagsHandler(ctx: WebRequestContext) =
  interface IRequestHandler<GetTags, string list> with
    member this.Handle(request, token) =
      task {
        let! entity = ctx.DocumentSession.GetFiles()

        return
          entity
          |> Seq.collect (fun v -> v.Tags)
          |> Seq.distinct
          |> Seq.toList
      }

  interface IRequestHandler<GetImages, FileAggregate list> with
    member this.Handle(request, token) =
      task {
        let! entity = ctx.DocumentSession.GetFiles()

        let entity = entity |> Seq.sortBy (fun v -> v.CreatedAt)

        match request.IncludingTags with
        | [] -> return entity |> Seq.toList
        | _ ->
          return
            entity
            |> Seq.filter (fun v ->
              request.IncludingTags
              |> List.forall (fun t -> v.Tags |> List.contains t))
            |> Seq.toList
      }