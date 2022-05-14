namespace AzureFiles

module Domain =

  type FileAdded =
    { Filename: string
      Md5Hash: byte array
      Id: System.Guid }

type Tag = { Name: string }

type TagsSet = { Tags: Tag list }


open Domain

module Projections =

  type File() =
    member val Id = Unchecked.defaultof<System.Guid> with get, set
    member val Filename = Unchecked.defaultof<string> with get, set
    member val Md5Hash = Unchecked.defaultof<byte array> with get, set
    member val Tags = Unchecked.defaultof<ResizeArray<Tag>> with get, set

    member this.Apply(e: FileAdded) =
      this.Id <- e.Id
      this.Md5Hash <- e.Md5Hash
      this.Filename <- e.Filename
      this.Tags <- ResizeArray()

    member this.Apply(e: TagsSet) = this.Tags <- ResizeArray(e.Tags)