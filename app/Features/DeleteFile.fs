module AzFiles.Features.DeleteFile

open AzureFiles
open Glow.Core.Actions
open MediatR
open FsToolkit.ErrorHandling

[<Action(Route = "api/file/delete-file", AllowAnonymous = true)>]
type DeleteFile =
  { FileId: FileId }
  interface IRequest<ApiResult<unit>>

type DeleteFileHandler(ctx: IWebRequestContext) =
  interface IRequestHandler<DeleteFile, ApiResult<unit>> with
    member this.Handle(request, _) =
      taskResult {
        let! entity = ctx.DocumentSession.LoadFile request.FileId
        ctx.DocumentSession.Events.AppendFileStream(entity.Key(), FileEvent.Deleted EmptyRecord.Instance)
        do! ctx.DocumentSession.SaveChangesAsync()
        return ()
      }
