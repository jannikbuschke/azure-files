module AzFiles.GenerateBlogData

open System
open System.Text.Json
open System.Text.Json.Serialization
open AzFiles
open Marten
open MediatR
open System.Linq
open Glow.Core.Actions
open Microsoft.Extensions.Logging
open FsToolkit.ErrorHandling
open AzFiles.Galleries
open AzFiles.Features.Gallery

[<Action(Route = "api/my/create-static-gallery", AllowAnonymous = true)>]
type GenerateStaticGallery =
  { GalleryId: GalleryId }

  interface IRequest<ApiResult<unit>>

type BlogType =
  | Stage
  | Production

[<Action(Route = "api/my/write-blog-data", AllowAnonymous = true)>]
type GenerateBlogData() =
  interface IRequest
  member val TagName = Unchecked.defaultof<string> with get, set

type BlogPhoto = { Id: Guid; OriginalUrl: string }

let tryGetHighestResolutionVariant (v: ImageVariant list) =
  v
  |> List.sortByDescending (fun v -> v.Dimension |> Dimension.pixels)
  |> List.tryHead

let getHighestLowresResolutionOrOriginal v =
  v.File.LowresVersions
  |> tryGetHighestResolutionVariant
  |> Option.map (fun v -> v.Url)
  |> Option.defaultValue v.File.Url

let getHighestLowresResolutionOrOriginal2 (v: FileProjection) =
  v.LowresVersions
  |> tryGetHighestResolutionVariant
  |> Option.map (fun v -> v.Url)
  |> Option.defaultValue v.Url

let rec ensureAllImagesHaveHighresVariant (ctx: IWebRequestContext) (galleryId: GalleryId) =
  async {
    let! gallery = ctx.DocumentSession.LoadAsync<Gallery>(galleryId.value ()) |> Async.AwaitTask

    let! items =
      gallery.Items
      |> List.filter (fun v -> not (v.Hidden |> Skippable.defaultValue false))
      |> List.map (fun v -> v.File.Id.value ())
      |> List.toSeq
      |> ctx.DocumentSession.LoadManyAsync<FileProjection>
      |> Async.AwaitTask

    let! result =
      items
      |> Seq.choose (fun v ->
        // this is somehow not working
        let variant = v.LowresVersions |> tryGetHighestResolutionVariant

        match variant with
        | Some variant ->
          let width =
            Exif.tryGetWidth (v.ExifData |> Skippable.defaultValue [])
            |> Option.defaultValue 0

          let height =
            Exif.tryGetHeight (v.ExifData |> Skippable.defaultValue [])
            |> Option.defaultValue 0

          let pixels = width * height

          let desiredPixels = (1000 * 500)

          if variant.Dimension |> Dimension.pixels < desiredPixels && pixels > desiredPixels then
            Some v
          else
            None
        | None -> Some v)
      |> Seq.map (fun v ->
        async {
          let! _ = Workflow.createVariant ctx 1000 "gallery-1000" (v.Key()) |> Async.AwaitTask

          do! ctx.DocumentSession.SaveChangesAsync() |> Async.AwaitTask

          return ()
        })
      |> Async.Sequential

    ()
  }

let getFiles ctx (request: GenerateStaticGallery) =
  task {
    do! ensureAllImagesHaveHighresVariant ctx request.GalleryId
    let! gallery = ctx.DocumentSession.LoadAsync<Gallery>(request.GalleryId.value ())

    let! items =
      gallery.Items
      |> List.filter (fun v -> not (v.Hidden |> Skippable.defaultValue false))
      |> List.map (fun v -> v.File.Id.value ())
      |> List.toSeq
      |> ctx.DocumentSession.LoadManyAsync<FileProjection>

    let data =
      gallery.Items
      |> List.map Image.fixWidthAndHeightAccordingToOrientation
      |> List.filter (fun v -> not (v.Hidden |> Skippable.defaultValue false))
      |> List.map (fun x ->
        let v = items |> Seq.find (fun file -> file.Key() = x.File.Id)

        {| Id = v.Key()
           OriginalUrl = v |> getHighestLowresResolutionOrOriginal2
           Variants = v.LowresVersions
           Size = x.Size
           DimensionAdjustment =
            x.DimensionAdjustment
            |> Skippable.map (fun a ->
              { a with
                  Left = a.Left |> Skippable.defaultValue 0 |> Include
                  Top = a.Top |> Skippable.defaultValue 0 |> Include
                  Height = a.Height |> Skippable.defaultValue x.Size.Height |> Include
                  Width = a.Width |> Skippable.defaultValue x.Size.Width |> Include })
            |> Skippable.defaultValue (
              { Width = Include x.Size.Width
                Top = Include 0
                Left = Include 0
                Height = Include x.Size.Height }
            ) |}
      // ThumbnailUrl = v.ThumbnailUrl.Value
      // LowresUrl = v.LowresUrl.Value
      // FullHdUrl = v.FullHdUrl.Value
      )
      |> Seq.toList

    return gallery, data
  }

let generateStaticGallery (ctx: IWebRequestContext) request =
  taskResult {

    let! gallery, data = getFiles ctx request
    let options = JsonSerializerOptions(WriteIndented = true)

    options.Converters.Add(JsonFSharpConverter())

    let serialized = System.Text.Json.JsonSerializer.Serialize(data, options)

    let serialized = $"""export const gallery = {serialized} as const"""

    do!
      System.IO.File.WriteAllTextAsync(
        $".\\svelte-client\\src\\gallery-{gallery.Name}.ts",
        // $"C:\\home\\jannik\\repos\\travel-photo-blog-vite\\src\\gallery-{gallery.Name}.json",
        serialized
      )

    return ()
  }

type GenerateBlogDataHandler
  (
    ctx: IWebRequestContext,
    session: IDocumentSession,
    logger: ILogger<GenerateBlogDataHandler>
  ) =
  interface IRequestHandler<GenerateStaticGallery, ApiResult<unit>> with
    member this.Handle(request, token) = generateStaticGallery ctx request

  interface IRequestHandler<GenerateBlogData, MediatR.Unit> with
    member this.Handle(request, token) =
      logger.LogInformation("generate blog")

      task {
        let! result =
          session
            .Query<FileProjection>()
            .Where(fun v -> v.Tags.Any(fun x -> x = request.TagName))
            .ToListAsync()

        // get derived info
        let data =
          result
          //          |> Seq.sortBy(fun v-> v.Filename)
          |> Seq.map (fun v -> { Id = v.Id; OriginalUrl = v.Url })
          |> Seq.toList

        let serialized =
          System.Text.Json.JsonSerializer.Serialize(data, JsonSerializerOptions(WriteIndented = true))

        do!
          System.IO.File.WriteAllTextAsync(
            $"C:\\home\\jannik\\repos\\travel-photo-blog-vite\\src\\blog-{request.TagName}.json",
            serialized
          )

        logger.LogInformation("done")

        return MediatR.Unit.Value
      // ThumbnailUrl = v.ThumbnailUrl.Value
      // LowresUrl = v.LowresUrl.Value
      // FullHdUrl = v.FullHdUrl.Value
      }