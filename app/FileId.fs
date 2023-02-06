namespace AzureFiles


type FileId = FileId of System.Guid

module FileId =

  let value (id: FileId) =
    let (FileId id) = id
    id

  let create id = FileId id
