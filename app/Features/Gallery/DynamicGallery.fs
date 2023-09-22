namespace AzFiles.Features.Gallery

open System.Text.Json.Serialization
open AzFiles
open AzFiles.Features.GetTaggedImages
open Glow.Core.Actions
open FsToolkit.ErrorHandling
open MediatR
open AzFiles.Galleries

module GetDynamicGallery =

  type ImageType =
    | Square
    | Landscape
    | Portrait

  type GridPositions = int array array

  let gridColumns = 3

  type PositionedImage =
    { Image: Image
      Placement: GridPlacement }

  type ComputeGallery =
    { Position: int
      Images: PositionedImage list
      mutable Positions: GridPositions }

  type GalleryViewmodel =
    { PositionedImages: PositionedImage list
      Positions: int list list }

  let getInitialState () =
    { Position = 0
      Images = []
      Positions = Array.init 1000 (fun v -> Array.init gridColumns (fun v -> 0)) // System.Array.CreateInstance(typeof<int>, [| 20; gridColumns |], [| 0; 0 |]) :?> int [,]
    }

  let getPosition columns i = i % columns, i / columns

  let getSpace columns i desiredDimension =
    let startColumn, startRow = getPosition columns i

    let endColumn = startColumn + desiredDimension.ColumnSpan.value () - 1

    let endRow = startRow + desiredDimension.RowSpan.value () - 1
    printfn "get space for i=%d" i
    printfn "startColumn=%d startRow=%d endColumn=%d endRow=%d" startColumn startRow endColumn endRow

    let result =
      [ startColumn..endColumn ]
      |> List.collect (fun col -> [ startRow..endRow ] |> List.map (fun row -> (Col col, Row row)))

    printfn "result=%A" result
    result

  let isSpaceAvailable columns i (gridPositions: int array array) desiredDimension =
    let cells = getSpace columns i desiredDimension

    printfn
      "checkinf available space fore I=%d Dim=(colSpan=%d,rowSpan=%d) Cells %A"
      i
      (desiredDimension.ColumnSpan.value ())
      (desiredDimension.RowSpan.value ())
      cells

    if cells |> List.length > 5 then
      failwith "too many cells"

    let isOccupied =
      cells
      |> List.exists (fun (Col col, Row row) -> (col >= columns) || (gridPositions[row][col] <> 0))

    printfn "is occupied %b" isOccupied
    not isOccupied

  let rec findNextAvailableSpace columns i gridPositions desiredDimension =

    if i = 5 then
      printfn "i=5 (%d). Check if space is available" i

    if isSpaceAvailable columns i gridPositions desiredDimension then
      printfn "space available for i=%d" i
      i
    else
      printfn "no space available for i=%d. Do recursive lookup for i+1" i
      findNextAvailableSpace columns (i + 1) gridPositions desiredDimension

  let getImageType width height =
    if width > height then Landscape
    else if width < height then Portrait
    else Square

  let getDesiredDimension (el: FileViewmodel) =
    let exif = el.ExifData |> Skippable.defaultValue []
    let width = exif |> Exif.tryGetWidth |> Option.defaultValue 99

    let isHighlight = el.Tags |> List.contains "⭐"

    let height = exif |> Exif.tryGetHeight |> Option.defaultValue -1

    let imageType = getImageType width height

    (match imageType with
     | Square -> if isHighlight then (2, 2) else (1, 1)
     | Landscape -> if isHighlight then (2, 1) else (1, 1)
     | Portrait -> if isHighlight then (1, 2) else (1, 1))
    |> fun (colSpan, rowSpan) ->
         { ColumnSpan = ColSpan.create colSpan
           RowSpan = RowSpan.create rowSpan }

  let placeItem (state, i) (el: Image) =

    printfn "\n===================="

    printfn "Placin item %d" i
    printfn "====================\n"
    let desiredDimension = el.Dimension

    let nextAvailable =
      findNextAvailableSpace gridColumns state.Position state.Positions desiredDimension

    let place = getSpace gridColumns nextAvailable desiredDimension

    place
    |> List.iter (fun (Col col, Row row) ->
      state.Positions[row][col] <- i
      ())

    let minCol = place |> List.map fst |> List.min
    let maxcol = place |> List.map fst |> List.max
    let minRow = place |> List.map snd |> List.min
    let maxRow = place |> List.map snd |> List.max

    printf "head %A" (place |> List.head)

    let head = place |> List.head

    let nextPosition =
      (head |> fst |> (fun (Col col) -> col))
      + (head |> snd |> (fun (Row row) -> row)) * gridColumns
      + desiredDimension.ColumnSpan.value ()

    printfn "Next position %d" nextPosition

    printfn "Current positions %A" state.Positions

    let positionedImage =
      { Image = el
        Placement =
          { Position = { Column = minCol; Row = minRow }
            Dimension =
              { ColumnSpan = Colspan(maxcol.value () - minCol.value () + 1)
                RowSpan = RowSpan(maxRow.value () - minRow.value () + 1) } } }

    ({ state with
        Images = state.Images @ [ positionedImage ]
        Positions = state.Positions
        Position = nextPosition },
     i + 1)

  [<Action(Route = "api/features/gallery/get-dynamic-gallery", AllowAnonymous = true)>]
  type GetDynamicGallery =
    { Filter: ImageFilter }

    interface IRequest<ApiResult<GalleryViewmodel>>

  let computeGallery images =

    let gallery = images |> List.fold placeItem (getInitialState (), 1)

    printfn "Gallery = %A" gallery

    gallery

  let getDynamicGallery (ctx: IWebRequestContext) (filter: ImageFilter) =
    taskResult {
      let! result =
        AzFiles.Features.GetTaggedImages.GetImages.getCachedTaggedFiles
          ctx
          { Filter = filter
            ChronologicalSortDirection = Asc
            Pagination = NoPagination }

      let images =
        result.Result
        |> List.filter (fun v -> v.FileInfo.Type = FileType.Image)
        |> List.map (fun v ->
          let exifData = (v.ExifData |> Skippable.defaultValue [])

          let width = exifData |> Exif.tryGetWidth |> Option.defaultValue -1

          let height = exifData |> Exif.tryGetHeight |> Option.defaultValue -1

          let dim = getDesiredDimension v

          { Dimension = dim
            Hidden = Skippable.Include false
            DimensionAdjustment = Skip
            Size = { Width = width; Height = height }
            File = v })

      return computeGallery images
    }

  let getGallery (ctx: IWebRequestContext) (id: GalleryId) =
    taskResult {
      let! gallery = id.value () |> ctx.DocumentSession.LoadAsync<Gallery>

      let ids =
        gallery.Images
        |> List.choose (fun v ->
          match v with
          | GalleryImage.GalleryImage(id, placement) -> Some(id.value (), placement)
          | _ -> None)

      let! files = ids |> Seq.map fst |> ctx.DocumentSession.LoadManyAsync<FileProjection>

      let images =
        files
        |> Seq.map (fun file ->
          let fileViewmodel = file |> FileViewmodel.FromFileProjection

          let galleryImage =
            gallery.Images
            |> List.tryFind (fun v ->
              match v with
              | GalleryImage.GalleryImage(id, _) -> id.value () = file.Id
              | _ -> false)
            |> Option.defaultValue (
              GalleryImage.GalleryImage(
                file.Key(),
                getDesiredDimension fileViewmodel

              )
            )

          let i: Image =
            { Size = { Width = 0; Height = 0 }
              File = fileViewmodel
              Hidden = Skippable.Include false
              DimensionAdjustment = Skip
              Dimension =
                { RowSpan = RowSpan 0
                  ColumnSpan = Colspan 0 } }

          i)
        |> Seq.toList

      return computeGallery images
    }

  type Handler(ctx: IWebRequestContext) =
    interface IRequestHandler<GetDynamicGallery, ApiResult<GalleryViewmodel>> with
      member this.Handle(request, _) =
        taskResult {
          let! state, _ = getDynamicGallery ctx request.Filter

          return
            { PositionedImages = state.Images
              Positions = state.Positions |> Array.toList |> List.map (fun v -> v |> Array.toList) }
        }
