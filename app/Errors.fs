namespace AzFiles

type DuplicateCheckResult =
  | IsNew
  | IsDuplicate of FileId

type FileIsDuplicate = { FileId: FileId; Filename: string }

type ErrorResult =
  | FileIsDuplicate of FileIsDuplicate
  | NetworkError of string
  | FileNotFound of FileId
  member this.Message=
    match this with
    | FileIsDuplicate { FileId = id; Filename = filename } ->
      sprintf "File %s is a duplicate of %s" filename (id.value().ToString())
    | NetworkError msg -> sprintf "Network error: %s" msg
    | FileNotFound id -> sprintf "File %s not found" (id.value().ToString())
