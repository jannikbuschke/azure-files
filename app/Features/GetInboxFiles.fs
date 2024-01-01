module AzFiles.Features.GetInboxFiles

open System
open System.Text.Json.Serialization
open AzFiles
open Glow.Core.Actions
open MediatR
open Marten
open FsToolkit.ErrorHandling
open Polly

type Page<'T> = { Values: 'T list; Count: int }

type EmptyRecord =
  { Skip: Skippable<unit> }

  static member instance = { Skip = Skippable<unit>.Skip }

type Order =
  | Desc
  | Asc

[<Action(Route = "api/get-inbox-files", AllowAnonymous = true)>]
type GetInboxFiles =
  { Cached: bool
    Count: int
    Order: Order }
  interface IRequest<Page<FileViewmodel>>

type Take =
  | All
  | Count of int

module GetInboxFiles =
  let memoryCache =
    new Microsoft.Extensions.Caching.Memory.MemoryCache(Microsoft.Extensions.Caching.Memory.MemoryCacheOptions())

  let private memoryCacheProvider =
    Polly.Caching.Memory.MemoryCacheProvider(memoryCache)

  let cachePolicy = Policy.CacheAsync(memoryCacheProvider, TimeSpan.FromMinutes(30))

  let resetInboxFilesCache () = memoryCache.Remove("get-inbox-files")

  let getInboxFiles (ctx: IWebRequestContext, order: Order) cacheContext =
    task {

      let! entities =
        ctx
          .DocumentSession
          .Query<FileProjection>()
          .ToListAsync()

      let sortBy =
        match order with
        | Desc -> Seq.sortBy
        | Asc -> Seq.sortByDescending

      return
        entities
        |> Seq.filter (fun v -> v.Inbox = true)
        |> sortBy (fun v -> v.FileDateOrCreatedAt)
        |> Seq.toList
    }

type InboxFileResult =
  { Previous: FileId option
    File: FileViewmodel
    Next: FileId option
    NextUrl: string option }

[<Action(Route = "api/get-inbox-file", AllowAnonymous = true)>]
type GetInboxFile =
  { Id: FileId }

  interface IRequest<ApiResult<InboxFileResult>>

type GetBlobContainersHandler(ctx: IWebRequestContext) =

  interface IRequestHandler<GetInboxFiles, Page<FileViewmodel>> with
    member this.Handle(request, c) =
      task {
        if not request.Cached then
          GetInboxFiles.resetInboxFilesCache ()

        let! result =
          GetInboxFiles.cachePolicy.ExecuteAndCaptureAsync(
            (GetInboxFiles.getInboxFiles (ctx, request.Order)),
            Context("get-inbox-files")
          )

        let mem = GetInboxFiles.memoryCache

        let result = result.Result

        return
          { Values =
              result
              |> List.map FileViewmodel.FromFileProjection
              // |> List.skip 200
              |> List.truncate request.Count
            Count = result |> List.length }
      }

  interface IRequestHandler<GetInboxFile, ApiResult<InboxFileResult>> with
    member this.Handle(request, _) =
      taskResult {
        // let! result =
        //   GetInboxFiles.cachePolicy.ExecuteAndCaptureAsync(
        //     (GetInboxFiles.getInboxFiles ctx),
        //     Context("get-inbox-files")
        //   )

        let! file = ctx.DocumentSession.LoadFile request.Id

        let! result =
          GetInboxFiles.cachePolicy.ExecuteAndCaptureAsync(
            (GetInboxFiles.getInboxFiles (ctx, Order.Desc)),
            Context("get-inbox-files")
          )

        let result = result.Result

        let index =
          result
          |> List.findIndex (fun v -> v.Key() = request.Id)

        // let item = result.[index]

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
            File = file |> FileViewmodel.FromFileProjection }
      }