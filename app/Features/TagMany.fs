﻿module AzFiles.Features.SetTags

open AzFiles
open Glow.Core.Actions
open MediatR

open FsToolkit.ErrorHandling

[<Action(Route = "api/file/set-tags")>]
type SetTags =
  { FileId: System.Guid
    Tags: string list }
  interface IRequest<ApiResult<unit>>

type SetTagsHandler(ctx: IWebRequestContext) =

  interface IRequestHandler<SetTags, ApiResult<unit>> with
    member this.Handle(request, _) =
      taskResult {
        request.Tags
        |> Seq.toList
        |> List.map (fun v -> (request.FileId |> FileId.create, FileEvent.TagAdded { Name = v }))
        |> List.iter ctx.DocumentSession.Events.AppendFileStream

        do! ctx.DocumentSession.SaveChangesAsync()

        return ()
      }
