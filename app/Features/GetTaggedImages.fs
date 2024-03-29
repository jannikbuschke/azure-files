﻿module AzFiles.Features.GetTaggedImages

open System
open AzFiles
open Glow.Core.Actions
open MediatR
open Polly
open Marten

[<Action(Route = "api/get-tags", AllowAnonymous = true)>]
type GetTags =
  { None: EmptyRecord }
  interface IRequest<string list>

type ImageFilter =
  | All
  | Tagged of string list
  | DateRange of NodaTime.Instant * NodaTime.Instant
  | And of ImageFilter * ImageFilter
  | Or of ImageFilter * ImageFilter

type ChronologicalSortDirection =
  | Asc
  | Desc

type Page = { PageNumber: int; PageSize: int }

type Pagination =
  | NoPagination
  | Page of Page

[<Action(Route = "api/get-images", AllowAnonymous = true)>]
type GetImages =
  { ChronologicalSortDirection: ChronologicalSortDirection
    Pagination: Pagination
    // IncludingTags: string list
    // Date: string option
    Filter: ImageFilter }
  interface IRequest<FileViewmodel list>

module GetImages =
  let memoryCache =
    new Microsoft.Extensions.Caching.Memory.MemoryCache(Microsoft.Extensions.Caching.Memory.MemoryCacheOptions())

  let private memoryCacheProvider =
    Polly.Caching.Memory.MemoryCacheProvider(memoryCache)

  let cachePolicy = Policy.CacheAsync(memoryCacheProvider, TimeSpan.FromMinutes(10))

  let resetTaggedFiles () = memoryCache.Remove("get-taged-files")

  let getFiles (ctx: IWebRequestContext) (request: GetImages) (cacheContext: Context) =
    task {
      printfn "querying database...."

      let! entities =
        ctx
          .DocumentSession
          .Query<FileProjection>()
          .ToListAsync()

      let rec applyFilter (seq: FileProjection seq) (filter: ImageFilter) =
        seq
        |> Seq.filter (fun v ->
          match filter with
          | ImageFilter.All -> true
          | ImageFilter.Tagged tags ->
            v.Tags
            |> List.exists (fun tag -> tags |> List.contains tag)
          | ImageFilter.DateRange (start, until) ->
            printfn ("Using date range filter")
            printf "Comparing created at %A to with start=%A and end=%A" v.FileDateOrCreatedAt start until
            // v.FileDateOrCreatedAt
            v.FileDateOrCreatedAt >= start
            && v.FileDateOrCreatedAt <= until
          | ImageFilter.And (left, right) ->
            let result0 = applyFilter seq left
            let result1 = applyFilter seq right

            result0 |> Seq.contains v
            && result1 |> Seq.contains v
          | ImageFilter.Or (left, right) ->
            let result0 = applyFilter seq left
            let result1 = applyFilter seq right

            result0 |> Seq.contains v
            || result1 |> Seq.contains v)

      return
        applyFilter entities request.Filter
        |> Seq.filter (fun v -> v.Inbox = false)
        |> Seq.map FileViewmodel.FromFileProjection
        |> (match request.ChronologicalSortDirection with
            | Desc -> Seq.sortByDescending (fun v -> v.FileDateOrCreatedAt)
            | Asc -> Seq.sortBy (fun v -> v.FileDateOrCreatedAt))
        |> Seq.toList

    // return result
    }

  let getTags (ctx: IWebRequestContext) cacheContext =
    task {
      let! entity = ctx.DocumentSession.GetFiles()

      return
        entity
        |> Seq.collect (fun v -> v.Tags)
        |> Seq.distinct
        |> Seq.toList
    }


  let getCachedTaggedFiles (ctx: IWebRequestContext) (request: GetImages) =
    cachePolicy.ExecuteAndCaptureAsync((getFiles ctx request), Context("get-tagged-files"))

  let rec getFilterKey (filter: ImageFilter) =
    match filter with
    | ImageFilter.All -> "all"
    | ImageFilter.Tagged tags -> "tagged-" + (tags |> String.concat "or")
    | ImageFilter.DateRange (start, until) ->
      "date-range-"
      + (start.ToString())
      + "-"
      + (until.ToString())
    | ImageFilter.And (left, right) ->
      let leftKey = getFilterKey left
      let rightKey = getFilterKey right

      "(" + leftKey + "-and-" + rightKey + ")"
    | ImageFilter.Or (left, right) ->
      let leftKey = getFilterKey left
      let rightKey = getFilterKey right

      "(" + leftKey + "-pr-" + rightKey + ")"

  let getFilesByFilter (ctx: IWebRequestContext) (request: GetImages) =
    let filterKey = getFilterKey request.Filter
    printfn "get files by filter key %s" filterKey

    cachePolicy.ExecuteAndCaptureAsync((getFiles ctx request), Context("filter-" + filterKey))

  type Handler(ctx: IWebRequestContext) =
    interface IRequestHandler<GetTags, string list> with
      member this.Handle(request, token) =
        task {
          let! result = cachePolicy.ExecuteAndCaptureAsync((getTags ctx), Context("get-tags"))
          return result.Result
        }

    interface IRequestHandler<GetImages, FileViewmodel list> with
      member this.Handle(request, token) =
        task {
          let! result = getCachedTaggedFiles ctx request

          return result.Result
        }