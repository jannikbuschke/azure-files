module AzFiles.Features.GetTaggedImages

open System
open System.Text.Json.Serialization
open AzureFiles
open Glow.Core.Actions
open MediatR
open Polly
open Marten
open System.Linq

[<Action(Route = "api/get-tags", AllowAnonymous = true)>]
type GetTags =
  { None: EmptyRecord }
  interface IRequest<string list>

[<Action(Route = "api/get-images", AllowAnonymous = true)>]
type GetImages =
  { IncludingTags: string list
    Date: string option }
  interface IRequest<FileViewmodel list>

module GetImages =
  let memoryCache =
    new Microsoft.Extensions.Caching.Memory.MemoryCache(Microsoft.Extensions.Caching.Memory.MemoryCacheOptions())

  let private memoryCacheProvider =
    Polly.Caching.Memory.MemoryCacheProvider(memoryCache)
  // Create a Polly cache policy using that Polly.Caching.Memory.MemoryCacheProvider instance.
  let cachePolicy = Policy.CacheAsync(memoryCacheProvider, TimeSpan.FromSeconds(10))

  let resetTaggedFiles () = memoryCache.Remove("get-taged-files")

  let getTagedFiles (ctx: IWebRequestContext) (request: GetImages) (cacheContext: Context) =
    task {
      let! entities =
        ctx
          .DocumentSession
          .Query<FileProjection>()
          .ToListAsync()

      let tagFilter file =
        request.IncludingTags.IsEmpty
        || file.Tags
           |> List.exists (fun tag -> request.IncludingTags |> List.contains tag)

      let date =
        request.Date
        |> Option.map (fun v -> NodaTime.LocalDate.FromDateTime(DateTime.Parse(v)))

      let dateFilter file =
        let dateTimeOriginal =
          file.DateTimeOriginal
          |> Option.map NodaTime.asLocalDate

        match date, file.DateTimeOriginal with
        | Some dateFilter, Some dateTimeOriginal ->
          let localDate = dateTimeOriginal |> NodaTime.asLocalDate
          dateFilter.Equals(localDate)
        | _ -> true

      let entities = entities |> Seq.toList


      let result0 =
        entities
        |> Seq.filter (fun v -> v.Inbox = false)
        |> Seq.map FileViewmodel.FromFileProjection

      // let resultXXX =
      //   entities
      //   |> Seq.filter (fun v -> v.Inbox = false)
      //   |> Seq.map FileViewmodel.FromFileProjection
      //   |> Seq.map (fun v -> v.DateTimeAsLocalDate())
      //   |> Seq.choose id
      //   |> Seq.toList


      let result =
        entities
        |> Seq.filter (fun v -> v.Inbox = false)
        |> Seq.map FileViewmodel.FromFileProjection
        // |> Seq.filter (fun v ->
        //   v.DateTimeAsLocalDate() = Some(NodaTime.LocalDate.FromDateTime(DateTime.Parse("2023-12-13"))))
        |> Seq.filter tagFilter
        // |> Seq.filter dateFilter
        |> Seq.sortByDescending (fun v -> v.FileDateOrCreatedAt)
        |> Seq.toList

      return result
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
          let! result = cachePolicy.ExecuteAndCaptureAsync((getTagedFiles ctx request), Context("get-taged-files"))

          return result.Result // |> List.take 100

        // let! entity = ctx.DocumentSession.GetFiles()
        //
        // let entity = entity |> Seq.sortBy (fun v -> v.CreatedAt)
        //
        // match request.IncludingTags with
        // | [] -> return entity |> Seq.toList
        // | _ ->
        //   return
        //     entity
        //     |> Seq.filter (fun v ->
        //       request.IncludingTags
        //       |> List.forall (fun t -> v.Tags |> List.contains t))
        //     |> Seq.toList
        }