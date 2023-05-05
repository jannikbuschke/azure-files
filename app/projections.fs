namespace AzureFiles


type ImageVariant = { Url: string; Dimension: Dimension }

[<CLIMutable>]
type FileAggregate =
  { Id: System.Guid
    CreatedAt: NodaTime.Instant
    Url: string option
    Filename: string
    Md5Hash: byte array
    Inbox: bool
    LocalMd5Hash: Checksum
    Tags: string list
    ThumbnailUrl: string option
    LowresUrl: string option
    FullHdUrl: string option
    Variants: ImageVariant list }
  member this.Key() = FileId.create this.Id

  member this.Apply(e: FileSavedToStorage, meta: Marten.Events.IEvent) : FileAggregate =
    { Id = meta.Id
      CreatedAt =
        meta.Timestamp
        |> NodaTime.Instant.FromDateTimeOffset
      Inbox = true
      Url = Some e.Url
      Md5Hash = e.Md5Hash
      LocalMd5Hash = e.LocalMd5Hash
      Filename = e.Filename
      Tags = []
      ThumbnailUrl = None
      LowresUrl = None
      FullHdUrl = None
      Variants = [] }

  member this.Apply(e: LowresVersionCreated) : FileAggregate =
    { this with
        Variants =
          this.Variants
          @ [ { Dimension = e.Dimension; Url = e.Url } ]

    // if e.VariantName = "thumbnail" then
    //   this.ThumbnailUrl <- e.Url
    //
    // if e.VariantName = "lowres" then
    //   this.LowresUrl <- e.Url
    //
    // if e.VariantName = "fullhd" then
    //   this.FullHdUrl <- e.Url
     }

  member this.Apply(e: TagAdded) : FileAggregate =
    { this with Tags = this.Tags @ [ e.Name ] }

  member this.Apply(e: TagRemoved) : FileAggregate =
    { this with Tags = this.Tags |> List.filter (fun v -> v <> e.Name) }


  member this.ShouldDelete(e: CheckedForDuplicate) : bool =
    match e.DuplicateCheckResult with
    | DuplicateCheckResult.IsDuplicate _ -> true
    | _ -> false

  // member this.Apply(FileSavedToStorage e, meta: Marten.Events.IEvent) : FileAggregate =
  //   { Id = meta.Id
  //     Url = None
  //     Filename = ""
  //     Md5Hash = [||]
  //     LocalMd5Hash = Checksum ""
  //     Tags = []
  //     ThumbnailUrl = None
  //     LowresUrl = None
  //     FullHdUrl = None
  //     Variants = [] }

  member this.Apply(e: FileEvent) : FileAggregate =
    match e with
    | LowresVersionCreated evt -> this.Apply(evt)
    | TagAdded e -> this.Apply(e)
    | TagRemoved e -> this.Apply(e)
    | Deleted _ -> this

  member this.ShouldDelete(e: FileEvent) : bool =
    match e with
    | Deleted _ -> true
    | _ -> false

namespace AzureFiles

open System.Runtime.CompilerServices
open Marten
open FsToolkit.ErrorHandling

[<Extension>]
type Extensions2() =

  [<Extension>]
  static member GetFiles(ty: IDocumentSession) =
    task {
      let! files = ty.Query<FileAggregate>().ToListAsync()
      return files |> Seq.toList
    }

  [<Extension>]
  static member LoadFile(ty: IDocumentSession, FileId id) =
    taskResult {
      let! file = ty.LoadAsync<FileAggregate>(id)

      if box file = null then
        return! Error { ServiceError.Message = "File not found" }
      else
        return file
    }