module AzFiles.Features.GetInboxFiles

open System.Text.Json.Serialization
open AzureFiles
open Glow.Core.Actions
open MediatR
open System.Linq
open Marten
open FsToolkit.ErrorHandling

//type Tag =
//  | StageForBlog
//  | Publish
//  | Keep
//  | Remove

type EmptyRecord =
  { Skip: Skippable<unit> }

  static member instance = { Skip = Skippable<unit>.Skip }

[<Action(Route = "api/get-inbox-files", AllowAnonymous = true)>]
type GetInboxFiles() =
  interface IRequest<FileAggregate list>

type InboxFileResult =
  { Previous: FileId option
    File: FileAggregate
    Next: FileId option }

[<Action(Route = "api/get-inbox-file", AllowAnonymous = true)>]
type GetInboxFile =
  { Id: FileId }

  interface IRequest<InboxFileResult>

// type GetIndexedFilesFilter =
//   | EmptyTags
//   | FilterByTag of string

type GetBlobContainersHandler(ctx: WebRequestContext) =

  interface IRequestHandler<GetInboxFiles, FileAggregate list> with
    member this.Handle(_, _) =
      task {
        let! entities =
          ctx
            .DocumentSession
            .Query<FileAggregate>()
            .ToListAsync()

        let result =
          entities
            .Where(fun v -> v.Inbox = true)
            .OrderByDescending(fun v -> v.CreatedAt)

        return result |> Seq.toList
      }

  interface IRequestHandler<GetInboxFile, InboxFileResult> with
    member this.Handle(request, _) =
      task {
        let! entities =
          ctx
            .DocumentSession
            .Query<FileAggregate>()
            .ToListAsync()

        let result =
          entities
            .Where(fun v -> v.Inbox = true)
            .OrderByDescending(fun v -> v.CreatedAt)
          |> Seq.toList

        let index =
          result
          |> List.findIndex (fun v -> v.Key() = request.Id)

        let item = result.[index]

        let prev =
          if index > 0 then
            Some(result.[index - 1])
          else
            None

        let next =
          if index < result.Length - 1 then
            Some(result.[index + 1])
          else
            None

        return
          { Next = next |> Option.map (fun v -> v.Key())
            Previous = prev |> Option.map (fun v -> v.Key())
            File = item }
      }