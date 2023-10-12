namespace AzFiles.Galleries

open System
open System.Text.Json.Serialization
open AzFiles
open AzFiles.Exif

type Size = { Width: int; Height: int }

type Col =
  | Col of int

  member this.value() =
    match this with
    | Col n -> n

  static member create(n: int) =
    if n = 0 then
      failwith "Col must be greater than 0"
    else
      Col n

type Row =
  | Row of int

  member this.value() =
    match this with
    | Row n -> n

  static member create(n: int) =
    if n = 0 then
      failwith "Row must be greater than 0"
    else
      Row n

type GridPosition = { Row: Row; Column: Col }

type ColSpan =
  | Colspan of int

  static member create(n: int) =
    if n = 0 then
      failwith "Colspan must be greater than 0"
    else
      Colspan n

  member this.value() =
    match this with
    | Colspan n -> n

type RowSpan =
  | RowSpan of int

  member this.value() =
    match this with
    | RowSpan n -> n

  static member create(n: int) =
    if n = 0 then
      failwith "Rowspan must be greater than 0"
    else
      RowSpan n

type GridPlacementDimension =
  { ColumnSpan: ColSpan
    RowSpan: RowSpan }

type GridPlacement =
  { Position: GridPosition
    Dimension: GridPlacementDimension }

type ImageDimension = | Highlight

type DimensionAdjustment =
  { Top: Skippable<int>
    Left: Skippable<int>
    Width: Skippable<int>
    Height: Skippable<int> }

type GalleryFile =
  { Id: FileId
    CreatedAt: NodaTime.Instant
    Url: string
    Filename: string
    Tags: string list
    LowresVersions: ImageVariant list
    FileDateOrCreatedAt: NodaTime.Instant
    Location: (decimal array * decimal array) option
    Orientation: Skippable<uint16 option>
    ExifData: Skippable<ExifValue list>
     }

type Image =
  { Size: Size
    File: GalleryFile
    Dimension: GridPlacementDimension
    DimensionAdjustment: Skippable<DimensionAdjustment>
    Hidden: Skippable<bool> }

module Image =

  let galleryFileFromFileViewmodel (viewmodel: FileViewmodel) =
    { GalleryFile.Id = viewmodel.Id
      CreatedAt = viewmodel.CreatedAt
      Url = viewmodel.Url
      Filename = viewmodel.Filename
      Tags = viewmodel.Tags
      LowresVersions = viewmodel.LowresVersions
      FileDateOrCreatedAt = viewmodel.FileDateOrCreatedAt
      Location = viewmodel.Location
      Orientation = (viewmodel.ExifData |> Skippable.defaultValue []) |> Exif.tryGetOrientation|>Include
      ExifData = viewmodel.ExifData
       }

  let fixWidthAndHeightAccordingToOrientation (v: Image) =
    let orientation = v.File.Orientation |> Skippable.defaultValue((v.File.ExifData |> Skippable.defaultValue []) |> Exif.tryGetOrientation)

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

type GalleryImage = GalleryImage of FileId * GridPlacementDimension

type GalleryId =
  | GalleryId of Guid

  member this.value() =
    match this with
    | GalleryId id -> id

type Gallery =
  { Id: Guid
    Columns: uint
    Images: GalleryImage list }

  member this.Key() = this.Id |> GalleryId
