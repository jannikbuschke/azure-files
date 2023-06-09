namespace AzureFiles

open System
open System.Text.Json.Serialization
open AzFiles.Exif

type ImageVariant = { Url: string; Dimension: Dimension }

[<CLIMutable>]
type FileProjection =
  { Id: System.Guid
    CreatedAt: NodaTime.Instant
    Url: string
    Filename: string
    Md5Hash: byte array
    RemovedFromInboxAt: NodaTime.Instant option
    LocalMd5Hash: Checksum
    Tags: string list
    LowresVersions: Skippable<ImageVariant list>
    // ThumbnailUrl: string option
    // LowresUrl: string option
    // FullHdUrl: string option
    // Variants: ImageVariant list
    ExifData: ExifValue list }
  member this.DateTimeOriginal =

    (this.ExifData
     |> List.choose (fun v ->
       match v with
       | ExifValue.DateTimeOriginal v -> Some v
       | _ -> None)
     |> List.tryHead)
    |> Option.map (fun v ->
      DateTimeOffset.ParseExact(v, "yyyy:MM:dd HH:mm:ss", System.Globalization.CultureInfo.InvariantCulture)
      |> NodaTime.Instant.FromDateTimeOffset)

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
        RemovedFromInboxAt = None
        Url = e.Url
        Md5Hash = e.Md5Hash
        LocalMd5Hash = e.LocalMd5Hash
        Filename = e.Filename
        Tags = []
        ExifData = []
        LowresVersions = Skip }

  member this.ShouldDelete(e: CheckedForDuplicate) : bool =
    match e.DuplicateCheckResult with
    | DuplicateCheckResult.IsDuplicate _ -> true
    | _ -> false

  member this.Apply(e: FileEvent, m: Marten.Events.IEvent) : FileProjection =
    let timestamp = m.Timestamp |> NodaTime.Instant.FromDateTimeOffset

    match e with
    | TagAdded e -> { this with Tags = this.Tags @ [ e.Name ] |> List.distinct }
    | TagRemoved e -> { this with Tags = this.Tags |> List.filter (fun v -> v <> e.Name) }
    | Deleted _ -> this
    | ExifDataUpdated e -> { this with ExifData = e.Data }
    | RemovedFromInbox _ -> { this with RemovedFromInboxAt = Some timestamp }
    | LowresVersionCreated e ->
      { this with
          LowresVersions =
            (this.LowresVersions |> Skippable.defaultValue [])
            @ [ { Url = e.Url; Dimension = e.Dimension } ]
            |> Include }

  member this.ShouldDelete(e: FileEvent) : bool =
    match e with
    | Deleted _ -> true
    | _ -> false

type FileViewmodel =
  { Id: System.Guid
    CreatedAt: NodaTime.Instant
    Url: string
    Filename: string
    Md5Hash: byte array
    RemovedFromInboxAt: NodaTime.Instant option
    LocalMd5Hash: Checksum
    Tags: string list
    // ThumbnailUrl: string option
    // LowresUrl: string option
    // FullHdUrl: string option
    // Variants: ImageVariant list
    ExifData: ExifValue list
    DateTimeOriginal: NodaTime.Instant option
    DateTime: NodaTime.Instant option
    DateTimeDigitized: NodaTime.Instant option
    FileDateOrCreatedAt: NodaTime.Instant
    Location: (decimal array * decimal array) option }

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

    let getExifValueAsInstant extract =
      (file.ExifData
       |> List.choose extract
       |> List.tryHead)
      |> Option.map (fun v ->
        DateTimeOffset.ParseExact(v, "yyyy:MM:dd HH:mm:ss", System.Globalization.CultureInfo.InvariantCulture)
        |> NodaTime.Instant.FromDateTimeOffset)

    let getExifRational extract =
      (file.ExifData
       |> List.choose extract
       |> List.tryHead)
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

    { Id = file.Id
      CreatedAt = file.CreatedAt
      Url = file.Url
      Filename = file.Filename
      Md5Hash = file.Md5Hash
      RemovedFromInboxAt = file.RemovedFromInboxAt
      LocalMd5Hash = file.LocalMd5Hash
      Tags = file.Tags
      // ThumbnailUrl = file.ThumbnailUrl
      // LowresUrl = file.LowresUrl
      // FullHdUrl = file.FullHdUrl
      // Variants = file.Variants
      ExifData = file.ExifData
      DateTimeOriginal = dateTimeOriginal
      DateTimeDigitized = dateTimeDigitized
      DateTime = dateTime
      FileDateOrCreatedAt = fileDateOrCreated
      Location =
        match lat, lon with
        | Some lat, Some lon -> Some(lat, lon)
        | _ -> None }


namespace AzureFiles

open System.Runtime.CompilerServices
open Marten
open FsToolkit.ErrorHandling

[<Extension>]
type Extensions2() =

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
        return! Error { ServiceError.Message = "File not found" }
      else
        return file
    }