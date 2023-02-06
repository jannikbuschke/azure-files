namespace AzureFiles


type ImageVariant = { Url: string; Dimension: Dimension }

[<CLIMutable>]
type FileAggregate =
  { Id: System.Guid
    Url: string option
    Filename: string
    Md5Hash: byte array
    LocalMd5Hash: Checksum
    Tags: string list
    ThumbnailUrl: string option
    LowresUrl: string option
    FullHdUrl: string option
    Variants: ImageVariant list }
  member this.Key() = FileId.create this.Id

  member this.Apply(e: FileSavedToStorage, meta: Marten.Events.IEvent) : FileAggregate =
    { Id = meta.Id
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