namespace AzFiles.Features.Gallery

open System.Text.Json.Serialization
open AzFiles
open AzFiles.Features.GetTaggedImages
open Glow.Core.Actions
open FsToolkit.ErrorHandling
open MediatR
open AzFiles.Galleries
open Utils
open System.Linq
open Marten

type GalleryItem = { Width: int; Height: int }

type Gallery =
  { Id: System.Guid
    Name: string
    Description: string option
    Items: Image list }
  member this.Key() = this.Id |> GalleryId.GalleryId

type GalleryBasedOn = Filter of ImageFilter

module PersistentGallery =

  let gridColumns = 3

  type PositionedImage =
    { Image: Image
      Placement: GridPlacement }

  [<Action(Route = "api/features/gallery/create-gallery", AllowAnonymous = true)>]
  type CreateGallery =
    { Name: string
      BasedOn: GalleryBasedOn
      Description: string }
    interface IRequest<ApiResult<GalleryId>>

  [<Action(Route = "api/features/gallery/update-gallery", AllowAnonymous = true)>]
  type UpdateGallery =
    { Id: GalleryId
      Items: Image list }
    interface IRequest<ApiResult<unit>>

  [<Action(Route = "api/features/gallery/get-galleries", AllowAnonymous = true)>]
  type GetGalleries() =
    class
    end

    interface IRequest<ApiResult<Gallery list>>

  type GetGalleryParameter =
    | Id of GalleryId
    | Name of string

  type PaginatedResult<'a> = { Value: 'a list; Count: int }

  [<Action(Route = "api/features/gallery/get-gallery", AllowAnonymous = true)>]
  type GetGallery =
    { Argument: GetGalleryParameter }
    interface IRequest<ApiResult<Gallery>>

  [<Action(Route = "api/features/gallery/get-gallery-items", AllowAnonymous = true)>]
  type GetGalleryItems =
    { Argument: GetGalleryParameter
      Pagination: Pagination }
    interface IRequest<ApiResult<PaginatedResult<Image>>>

  type CreateGalleryHandler(ctx: IWebRequestContext) =
    interface IRequestHandler<CreateGallery, ApiResult<GalleryId>> with
      member this.Handle(request, _) =
        taskResult {
          let! result =
            match request.BasedOn with
            | Filter filter ->
              AzFiles.Features.GetTaggedImages.GetImages.getCachedTaggedFiles
                ctx
                { Filter = filter
                  ChronologicalSortDirection = Asc
                  Pagination = NoPagination }

          printfn "Found images %A" result.Result.Length

          let images =
            result.Result
            |> List.filter (fun v -> v.FileInfo.Type = FileType.Image)
            |> List.map (fun v ->
              let exifData = (v.ExifData |> Skippable.defaultValue [])

              let width =
                exifData
                |> Exif.tryGetWidth
                |> Option.defaultValue 99

              let height =
                exifData
                |> Exif.tryGetHeight
                |> Option.defaultValue 99

              let dim = GetDynamicGallery.getDesiredDimension v

              printfn "image %A" v.Filename

              { Dimension = dim
                Size = { Width = width; Height = height }
                File = v
                Hidden = Skippable.Include false })

          let gallery: Gallery =
            { Id = System.Guid.NewGuid()
              Name = request.Name
              Description = request.Description |> Option.ofString
              Items = images }

          ctx.DocumentSession.Store(gallery)
          do! ctx.DocumentSession.SaveChangesAsync()

          return gallery.Key()
        }

    interface IRequestHandler<GetGalleries, ApiResult<Gallery list>> with
      member this.Handle(_, cancellationToken) =
        taskResult {
          let! x =
            ctx
              .DocumentSession
              .Query<Gallery>()
              .ToListAsync(cancellationToken)

          return x |> Seq.toList
        }

    interface IRequestHandler<UpdateGallery, ApiResult<unit>> with
      member this.Handle(request, _) =
        taskResult {
          let! gallery =
            request.Id.value ()
            |> ctx.DocumentSession.LoadAsync<Gallery>

          let items =
            gallery.Items
            |> List.map (fun v ->
              let updatedItem =
                request.Items
                |> List.tryFind (fun x -> x.File.Id = v.File.Id)

              match updatedItem with
              | Some updatedItem -> updatedItem
              | None -> v)

          ctx.DocumentSession.Store({ gallery with Items = items })
          do! ctx.DocumentSession.SaveChangesAsync()
          return ()
        }

    interface IRequestHandler<GetGallery, ApiResult<Gallery>> with
      member this.Handle(request, _) =
        taskResult {
          let! gallery =
            match request.Argument with
            | Id id ->
              id.value ()
              |> ctx.DocumentSession.LoadAsync<Gallery>
            | Name name ->
              task {
                let! values =
                  ctx
                    .DocumentSession
                    .Query<Gallery>()
                    .Where(fun v -> v.Name = name)
                    .ToListAsync()

                return values |> Seq.head
              }

          return gallery
        }

    interface IRequestHandler<GetGalleryItems, ApiResult<PaginatedResult<Image>>> with
      member this.Handle(request, _) =
        taskResult {
          let! gallery =
            match request.Argument with
            | Id id ->
              id.value ()
              |> ctx.DocumentSession.LoadAsync<Gallery>
            | Name name ->
              task {
                let! values =
                  ctx
                    .DocumentSession
                    .Query<Gallery>()
                    .Where(fun v -> v.Name = name)
                    .ToListAsync()

                return values |> Seq.head
              }

          let map (v: Image) =
            let orientation =
              (v.File.ExifData |> Skippable.defaultValue [])
              |> Exif.tryGetOrientation

            let size: Size =
              match orientation with
              | Some 6us
              | Some 8us
              | Some 5us
              | Some 7us ->
                { Width = v.Size.Height
                  Height = v.Size.Width }
              | _ -> v.Size

            { v with Size = size }

          let gallery = { gallery with Items = gallery.Items |> List.map map }

          return
            match request.Pagination with
            | Pagination.NoPagination ->
              { Value = gallery.Items
                Count = gallery.Items.Length }
            | Pagination.Page page ->
              let images =
                gallery.Items
                |> List.skip (page.PageNumber * page.PageSize)
                |> List.truncate page.PageSize

              { Value = images
                Count = gallery.Items.Length }
        }