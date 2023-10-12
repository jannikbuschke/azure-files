namespace AzFiles

open System
open System.Globalization
open System.Text.Json.Serialization
open AzFiles.Exif

module NodaTime =
  let strContainsOnlyNumber (s: string) = s |> Seq.forall Char.IsDigit

  let parseDateTimeStringToInstant v =

    if strContainsOnlyNumber v then
      v
      |> Int64.Parse
      |> NodaTime.Instant.FromUnixTimeMilliseconds
      |> Some
    else
      match
        DateTimeOffset.TryParseExact
          (
            v,
            "yyyy:MM:dd HH:mm:ss",
            System.Globalization.CultureInfo.InvariantCulture,
            DateTimeStyles.None
          )
        with
      | true, value ->
        value
        |> NodaTime.Instant.FromDateTimeOffset
        |> Some
      | false, _ -> None


  let asLocalDate (t: NodaTime.Instant) =
    t.ToDateTimeUtc()
    |> NodaTime.LocalDate.FromDateTime

module SpecialTag =
  let MarkForCleanup = "mark-for-cleanup"

type ImageVariant =
  { Name: string
    Url: string
    Dimension: Dimension }

[<CLIMutable>]
type FileHandledProjection =
  { Id: System.Guid
    Md5Hash: byte array
    LocalMd5Hash: Checksum option
    Filename: string }
  member this.Key() = FileId.create this.Id

  member this.Apply(e: FileInitEvent, meta: Marten.Events.IEvent) : FileHandledProjection =
    match e with
    | FileSavedToStorage e ->
      { Id = meta.Id
        Md5Hash = e.Md5Hash
        LocalMd5Hash = e.LocalMd5Hash
        Filename = e.Filename }

[<CLIMutable>]
type FileProjection =
  { Id: System.Guid
    CreatedAt: NodaTime.Instant
    OriginalDateTime: Skippable<string option>
    // CreatedAtOrUploadedAt: string
    Url: string
    Filename: string
    Md5Hash: byte array
    RemovedFromInboxAt: NodaTime.Instant option
    LocalMd5Hash: Checksum option
    Tags: string list
    LowresVersions: ImageVariant list
    Properties: Property list

    // ThumbnailUrl: string option
    // LowresUrl: string option
    // FullHdUrl: string option
    // Variants: ImageVariant list
    ExifData: Skippable<ExifValue list> }
  member this.DateTimeOriginal =
    let data = this.ExifData |> Skippable.defaultValue []

    (data
     |> List.choose (fun v ->
       match v with
       | ExifValue.DateTimeOriginal v -> Some v
       | _ -> None)
     |> List.tryHead)
    |> Option.map NodaTime.parseDateTimeStringToInstant
    |> Option.flatten

  member this.FileDateOrCreatedAt =
    this.DateTimeOriginal
    |> Option.defaultValue this.CreatedAt

  member this.Inbox = this.RemovedFromInboxAt = None
  member this.Key() = FileId.create this.Id

  member this.Apply(e: FileInitEvent, meta: Marten.Events.IEvent) : FileProjection =
    match e with
    | FileSavedToStorage e ->
      { Id = meta.Id
        CreatedAt =
          meta.Timestamp
          |> NodaTime.Instant.FromDateTimeOffset
        OriginalDateTime = Include None
        // CreatedAtOrUploadedAt = meta.Timestamp.ToString("yyyy-MM-dd")
        Properties = []
        RemovedFromInboxAt = None
        Url = e.Url
        Md5Hash = e.Md5Hash
        LocalMd5Hash = e.LocalMd5Hash
        Filename = e.Filename
        Tags = []
        ExifData = Skip
        LowresVersions = [] }

  member this.ShouldDelete(e: CheckedForDuplicate) : bool =
    match e.DuplicateCheckResult with
    | DuplicateCheckResult.IsDuplicate _ -> true
    | _ -> false

  member this.Apply(e: FileEvent, m: Marten.Events.IEvent) : FileProjection =
    let timestamp = m.Timestamp |> NodaTime.Instant.FromDateTimeOffset

    let applyPropertyChanged fileProjection e =
      match e with
      | PropertyChanged.PropertyAdded property ->
        { fileProjection with Properties = (fileProjection.Properties @ [ property ]) }
      | PropertyChanged.PropertyRemoved propertyName ->
        { fileProjection with
            Properties =
              (fileProjection.Properties
               |> List.filter (fun v -> v.Name <> propertyName)) }
      | PropertyChanged.PropertyUpdated property ->
        { fileProjection with
            Properties =
              (fileProjection.Properties
               |> List.map (fun v ->
                 if v.Name = property.Name then
                   property
                 else
                   v)) }

    match e with
    | TagAdded e ->
      { this with
          Tags =
            if (e.Name = SpecialTag.MarkForCleanup) then
              [ e.Name ]
            else
              this.Tags @ [ e.Name ]
              |> List.distinct
              |> List.filter (fun v -> v <> SpecialTag.MarkForCleanup) }
    | TagRemoved e -> { this with Tags = this.Tags |> List.filter (fun v -> v <> e.Name) }
    | Deleted _ -> this
    | ExifDataUpdated e ->

      let date = AzFiles.Exif.getDate e.Data

      let dateFormatted =
        date
        |> Option.map (fun v ->
          match
            DateTimeOffset.TryParseExact
              (
                v,
                "yyyy:MM:dd HH:mm:ss",
                System.Globalization.CultureInfo.InvariantCulture,
                DateTimeStyles.None
              )
            with
          | true, value -> Some(value.ToString("yyyy-MM-dd"))
          | false, _ -> None)
        |> Option.flatten

      printfn "Date: %A" dateFormatted

      { this with
          ExifData = Include e.Data
          OriginalDateTime = Include dateFormatted }
    | RemovedFromInbox _ -> { this with RemovedFromInboxAt = Some timestamp }
    | LowresVersionCreated e ->
      { this with
          LowresVersions =
            (this.LowresVersions)
            @ [ { Name = e.VariantName
                  Url = e.Url
                  Dimension = e.Dimension } ] }
    | PropertiesChanged propertyChanges ->
      propertyChanges
      |> List.fold (fun acc v -> applyPropertyChanged acc v) this
    | PropertyChanged e -> applyPropertyChanged this e

  member this.ShouldDelete(e: FileEvent) : bool =
    match e with
    | Deleted _ -> true
    | _ -> false



type Extension = Extension of string

type FileType =
  | Image
  | Video
  | Pdf
  | Other

type FileInfo =
  { Extension: Extension
    Type: FileType }

type FileViewmodel =
  { Id: FileId
    CreatedAt: NodaTime.Instant
    Url: string
    Filename: string
    Md5Hash: byte array
    RemovedFromInboxAt: NodaTime.Instant option
    LocalMd5Hash: Checksum option
    Tags: string list
    Properties: Property list
    // ThumbnailUrl: string option
    // LowresUrl: string option
    // FullHdUrl: string option
    // Variants: ImageVariant list
    LowresVersions: ImageVariant list
    ExifData: Skippable<ExifValue list>
    DateTimeOriginal: NodaTime.Instant option
    DateTime: NodaTime.Instant option
    DateTimeDigitized: NodaTime.Instant option
    FileDateOrCreatedAt: NodaTime.Instant
    Location: (decimal array * decimal array) option
    FileInfo: FileInfo }
  member this.DateTimeAsLocalDate() =
    this.DateTimeOriginal
    |> Option.map (fun date ->
      date.ToDateTimeUtc()
      |> NodaTime.LocalDate.FromDateTime)

  static member FromFileProjection(file: FileProjection) =

    let getDateTimeDigitized v =
      match v with
      | ExifValue.DateTimeDigitized v -> Some v
      | _ -> None

    let getDateTime v =
      match v with
      | ExifValue.DateTime v -> Some v
      | _ -> None

    let getDateTimeOriginal v =
      match v with
      | ExifValue.DateTimeOriginal v -> Some v
      | _ -> None

    let exifData = file.ExifData |> Skippable.defaultValue []

    let getExifValueAsInstant extract =
      (exifData |> List.choose extract |> List.tryHead)
      |> Option.map NodaTime.parseDateTimeStringToInstant
      |> Option.flatten

    let getExifRational extract =
      (exifData |> List.choose extract |> List.tryHead)
      |> Option.map (fun (v: Rational array) -> v)

    let dateTimeOriginal = getExifValueAsInstant getDateTimeOriginal
    let dateTime = getExifValueAsInstant getDateTime
    let dateTimeDigitized = getExifValueAsInstant getDateTimeDigitized

    let fileDateOrCreated =
      dateTimeOriginal
      |> Option.defaultValue file.CreatedAt

    let getGpsLatitude v =
      match v with
      | ExifValue.GPSLatitude v -> Some v
      | _ -> None

    let getGpsLongitude v =
      match v with
      | ExifValue.GPSLongitude v -> Some v
      | _ -> None

    let latitude = getExifRational getGpsLatitude
    let longitude = getExifRational getGpsLongitude

    let lat =
      latitude
      |> Option.map (fun v ->
        v
        |> Array.map (fun v -> (decimal v.Numerator) / (decimal v.Denominator)))

    let lon =
      longitude
      |> Option.map (fun v ->
        v
        |> Array.map (fun v -> (decimal v.Numerator) / (decimal v.Denominator)))

    let sysFileInfo = System.IO.FileInfo(file.Filename)

    let fileType =
      match sysFileInfo.Extension.ToLower() with
      | ".pdf" -> FileType.Pdf
      | ".jpg"
      | ".jpeg"
      | ".png"
      | ".gif"
      | ".bmp"
      | ".tif"
      | ".tiff" -> FileType.Image
      | ".mov"
      | ".mp4"
      | ".avi"
      | ".wmv"
      | ".mpg"
      | ".mpeg"
      | ".m4v" -> FileType.Video
      | _ -> FileType.Other

    { Id = file.Key()
      CreatedAt = file.CreatedAt
      Url = file.Url
      Filename = file.Filename
      Md5Hash = file.Md5Hash
      RemovedFromInboxAt = file.RemovedFromInboxAt
      LocalMd5Hash = file.LocalMd5Hash
      Tags = file.Tags
      Properties = file.Properties
      // ThumbnailUrl = file.ThumbnailUrl
      // LowresUrl = file.LowresUrl
      // FullHdUrl = file.FullHdUrl
      // Variants = file.Variants
      LowresVersions = file.LowresVersions
      ExifData = file.ExifData
      DateTimeOriginal = dateTimeOriginal
      DateTimeDigitized = dateTimeDigitized
      DateTime = dateTime
      FileDateOrCreatedAt = fileDateOrCreated
      FileInfo =
        { Extension = Extension sysFileInfo.Extension
          Type = fileType }
      Location =
        match lat, lon with
        | Some lat, Some lon -> Some(lat, lon)
        | _ -> None }

namespace AzFiles

open System.Runtime.CompilerServices
open Marten
open FsToolkit.ErrorHandling
open Npgsql.FSharp

type Filter =
  | Date of string
  | RangeFilter of from: string * until: string

[<Extension>]
type Extensions2() =

  [<Extension>]
  static member GetFiles(ty: IDocumentSession, filter: Filter) =
    task {
      let where, parameters =
        match filter with
        | Date date -> "data ->> 'OriginalDateTime' = @date", [ "@date", Sql.string date ]
        | RangeFilter (from, until) ->
          "data ->> 'OriginalDateTime' <= @from",
          [ ("@from", Sql.string from)
            "@until", Sql.string until ]

      let! result =
        ty.Connection
        |> Sql.existingConnection
        |> Sql.query $"SELECT * FROM mt_doc_file WHERE {where}"
        |> Sql.parameters parameters
        |> Sql.executeAsync (fun row -> {| Id = row.uuid "id" |})

      let! files = ty.LoadManyAsync<FileProjection>(result |> Seq.map (fun v -> v.Id))
      // let! files = ty.Query<FileProjection>().ToListAsync()
      return files |> Seq.toList
    }

  [<Extension>]
  static member GetFilesOfDate(ty: IDocumentSession, date: string) =
    task {
//      let serializer = ty.DocumentStore.Options.Serializer()

      let! result =
        ty.Connection
        |> Sql.existingConnection
        |> Sql.query "SELECT * FROM mt_doc_file WHERE data ->> 'OriginalDateTime' = @date"
        |> Sql.parameters [ "@date", Sql.string date ]
        |> Sql.executeAsync (fun row -> {| Id = row.uuid "id" |}
        // Data = "data" |> row.string |>  |> serializer.FromJson<FileProjection>
        )

      let! files = ty.LoadManyAsync<FileProjection>(result |> Seq.map (fun v -> v.Id))
      // let! files = ty.Query<FileProjection>().ToListAsync()
      return files |> Seq.toList
    }

  [<Extension>]
  static member GetFiles(ty: IDocumentSession) =
    task {
      let! files = ty.Query<FileProjection>().ToListAsync()
      return files |> Seq.toList
    }

  [<Extension>]
  static member LoadFile(ty: IDocumentSession, FileId id) =
    taskResult {
      let! file = ty.LoadAsync<FileProjection>(id)

      if box file = null then
        return!
          Error
            { ApiError.Message = "File not found"
              Info = Some(ErrorResult(FileNotFound(FileId id))) }
      else
        return file
    }
