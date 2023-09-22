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
open AzFiles.Features.Gallery

module PersistentGallery =

  let getImagesOnBase filter ctx =
    task {
      let! result =
        match filter with
        | Filter filter ->
          AzFiles.Features.GetTaggedImages.GetImages.getCachedTaggedFiles
            ctx
            { Filter = filter
              ChronologicalSortDirection = Asc
              Pagination = NoPagination }

      return result.Result |> List.filter (fun v -> v.FileInfo.Type = FileType.Image)
    }

  let mapFileViewmodelToGalleryImage v =
    let exifData = (v.ExifData |> Skippable.defaultValue [])

    let width = exifData |> Exif.tryGetWidth |> Option.defaultValue -1

    let height = exifData |> Exif.tryGetHeight |> Option.defaultValue -1

    let dim = GetDynamicGallery.getDesiredDimension v

    printfn "image %A" v.Filename

    { Dimension = dim
      Size = { Width = width; Height = height }
      DimensionAdjustment = Skip
      File = v
      Hidden = Include false }

  let gridColumns = 3

  type PositionedImage =
    { Image: Image
      Placement: GridPlacement }

  [<Action(Route = "api/features/gallery/remove-item", AllowAnonymous = true)>]
  type RemoveItemFromGallery =
    { GalleryId: GalleryId
      FileId: FileId }

    interface IRequest<ApiResult<unit>>

  [<Action(Route = "api/features/gallery/create-gallery", AllowAnonymous = true)>]
  type CreateGallery =
    { Name: string
      BasedOn: GalleryBasedOn
      Description: string }

    interface IRequest<ApiResult<GalleryId>>

  [<Action(Route = "api/features/gallery/add-images-on-base", AllowAnonymous = true)>]
  type AddImagesOnBasedOn =
    { GalleryId: GalleryId
      BasedOn: GalleryBasedOn }

    interface IRequest<ApiResult<unit>>

  [<Action(Route = "api/features/gallery/update-gallery", AllowAnonymous = true)>]
  type UpdateGallery =
    { Id: GalleryId
      Items: Image list }

    interface IRequest<ApiResult<unit>>

  [<Action(Route = "api/features/gallery/get-galleries", AllowAnonymous = true)>]
  type GetGalleries() =
    class
      interface IRequest<ApiResult<Gallery list>>
    end

  [<Action(Route = "api/features/gallery/delete-gallery", AllowAnonymous = true)>]
  type DeleteGallery =
    { Id: GalleryId }

    interface IRequest<ApiResult<unit>>

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

  type GalleryHandler(ctx: IWebRequestContext) =
    interface IRequestHandler<DeleteGallery, ApiResult<unit>> with
      member this.Handle(request, _) =
        taskResult {
          ctx.DocumentSession.Delete<Gallery>(request.Id.value ())
          do! ctx.DocumentSession.SaveChangesAsync()
          return ()
        }

    interface IRequestHandler<RemoveItemFromGallery, ApiResult<unit>> with
      member this.Handle(request, _) =
        taskResult {
          let! gallery = request.GalleryId.value () |> ctx.DocumentSession.LoadAsync<Gallery>

          let gallery =
            { gallery with Items = gallery.Items |> List.filter (fun v -> v.File.Id <> request.FileId) }

          ctx.DocumentSession.Store gallery
          do! ctx.DocumentSession.SaveChangesAsync()
          return ()
        }

    interface IRequestHandler<CreateGallery, ApiResult<GalleryId>> with
      member this.Handle(request, _) =
        taskResult {
          let! result = getImagesOnBase request.BasedOn ctx

          printfn "Found images %A" result.Length

          let images = result |> List.map mapFileViewmodelToGalleryImage

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
          let! x = ctx.DocumentSession.Query<Gallery>().ToListAsync(cancellationToken)

          return x |> Seq.toList
        }

    interface IRequestHandler<AddImagesOnBasedOn, ApiResult<unit>> with
      member this.Handle(request, _) =
        taskResult {
          let! gallery = request.GalleryId.value () |> ctx.DocumentSession.LoadAsync<Gallery>
          let! result = getImagesOnBase request.BasedOn ctx

          let filtered =
            result
            |> List.filter (fun v -> not (gallery.Items |> List.exists (fun i -> i.File.Id = v.Id)))
            |> List.map mapFileViewmodelToGalleryImage

          let g =
            { gallery with
                Items =
                  (gallery.Items @ filtered)
                  |> List.sortByDescending (fun v -> v.File.FileDateOrCreatedAt) }

          ctx.DocumentSession.Store(g)
          do! ctx.DocumentSession.SaveChangesAsync()
          return ()
        }

    interface IRequestHandler<UpdateGallery, ApiResult<unit>> with
      member this.Handle(request, _) =
        taskResult {
          let! gallery = request.Id.value () |> ctx.DocumentSession.LoadAsync<Gallery>

          let items =
            gallery.Items
            |> List.map (fun v ->
              let updatedItem = request.Items |> List.tryFind (fun x -> x.File.Id = v.File.Id)

              match updatedItem with
              | Some updatedItem ->
                { v with
                    Hidden = updatedItem.Hidden
                    File = v.File
                    Dimension = updatedItem.Dimension
                    // Size = updatedItem.Size
                    DimensionAdjustment = updatedItem.DimensionAdjustment }
              | None -> v)

          ctx.DocumentSession.Store({ gallery with Items = items })
          do! ctx.DocumentSession.SaveChangesAsync()
          do! AzFiles.GenerateBlogData.generateStaticGallery ctx { GalleryId = gallery.Key() }
          return ()
        }

    interface IRequestHandler<GetGallery, ApiResult<Gallery>> with
      member this.Handle(request, _) =
        taskResult {
          let! gallery =
            match request.Argument with
            | Id id -> id.value () |> ctx.DocumentSession.LoadAsync<Gallery>
            | Name name ->
              task {
                let! values = ctx.DocumentSession.Query<Gallery>().Where(fun v -> v.Name = name).ToListAsync()

                return values |> Seq.head
              }

          return gallery
        }

    interface IRequestHandler<GetGalleryItems, ApiResult<PaginatedResult<Image>>> with
      member this.Handle(request, _) =
        taskResult {
          let! gallery =
            match request.Argument with
            | Id id -> id.value () |> ctx.DocumentSession.LoadAsync<Gallery>
            | Name name ->
              task {
                let! values = ctx.DocumentSession.Query<Gallery>().Where(fun v -> v.Name = name).ToListAsync()

                return values |> Seq.head
              }

          let gallery =
            { gallery with Items = gallery.Items
            //                                  |> List.map Image.fixWidthAndHeightAccordingToOrientation
             }

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
