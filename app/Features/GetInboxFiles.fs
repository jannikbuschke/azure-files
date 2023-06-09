module AzFiles.Features.GetInboxFiles

open System
open System.Text.Json.Serialization
open AzureFiles
open Glow.Core.Actions
open MediatR
open System.Linq
open Marten
open FsToolkit.ErrorHandling
open Polly

type FileListViewmodel =
  { Id: FileId
    Filename: string
    Url: string
    FileDateOrCreatedAt: NodaTime.Instant
    Inbox: bool
    Tags: string list }

  static member FromFileProjection(projection: FileProjection) =
    { Id = projection.Key()
      Filename = projection.Filename
      Url = projection.Url
      FileDateOrCreatedAt = projection.FileDateOrCreatedAt
      Tags = projection.Tags
      Inbox = projection.Inbox }

type EmptyRecord =
  { Skip: Skippable<unit> }

  static member instance = { Skip = Skippable<unit>.Skip }

[<Action(Route = "api/get-inbox-files", AllowAnonymous = true)>]
type GetInboxFiles() =
  interface IRequest<FileListViewmodel list>

type InboxFileResult =
  { Previous: FileId option
    File: FileViewmodel
    Next: FileId option
    NextUrl: string option }

[<Action(Route = "api/get-inbox-file", AllowAnonymous = true)>]
type GetInboxFile =
  { Id: FileId }

  interface IRequest<InboxFileResult>

module GetInboxFile =
  let private memoryCache =
    new Microsoft.Extensions.Caching.Memory.MemoryCache(Microsoft.Extensions.Caching.Memory.MemoryCacheOptions())

  let private memoryCacheProvider =
    Polly.Caching.Memory.MemoryCacheProvider(memoryCache)
  // Create a Polly cache policy using that Polly.Caching.Memory.MemoryCacheProvider instance.
  let cachePolicy = Policy.CacheAsync(memoryCacheProvider, TimeSpan.FromMinutes(3))

type GetBlobContainersHandler(ctx: IWebRequestContext) =

  interface IRequestHandler<GetInboxFiles, FileListViewmodel list> with
    member this.Handle(_, _) =
      task {
        let! entities =
          ctx
            .DocumentSession
            .Query<FileProjection>()
            .ToListAsync()

        return
          entities
          |> Seq.filter (fun v -> v.Inbox = true)
          |> Seq.sortBy (fun v -> v.FileDateOrCreatedAt)
          |> Seq.map FileListViewmodel.FromFileProjection
          |> Seq.toList
      }

  interface IRequestHandler<GetInboxFile, InboxFileResult> with
    member this.Handle(request, _) =
      task {
        let getInboxFiles cacheContext =
          task {
            let! entities =
              ctx
                .DocumentSession
                .Query<FileProjection>()
                .ToListAsync()

            let result =
              entities
                .Where(fun v -> v.Inbox = true)
                .OrderBy(fun v -> v.FileDateOrCreatedAt)
              |> Seq.toList

            return result
          }

        let! result = GetInboxFile.cachePolicy.ExecuteAndCaptureAsync(getInboxFiles, Context("get-inbox-files"))

        let result = result.Result

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
            NextUrl = next |> Option.map (fun v -> v.Url)
            Previous = prev |> Option.map (fun v -> v.Key())
            File = item |> FileViewmodel.FromFileProjection }
      }