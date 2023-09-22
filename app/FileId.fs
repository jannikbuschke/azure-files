namespace AzFiles

type FileId =
  | FileId of System.Guid

  member this.value() =
    let (FileId id) = this
    id

module FileId =

  let value (id: FileId) =
    let (FileId id) = id
    id

  let create id = FileId id
