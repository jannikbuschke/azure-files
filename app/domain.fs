namespace AzureFiles

open System.Text.Json.Serialization
open System.Threading.Tasks
open Azure.Storage.Blobs
open Marten
open Microsoft.AspNetCore.Http
open Microsoft.Extensions.Configuration

type DuplicateCheckResult =
  | IsNew
  | IsDuplicate of FileId

type ErrorResult =
  | FileIsDuplicate of duplicateFileId: FileId * filename: string
  | NetworkError of string

// type LocalFile =
//   { Id: FileId
//     LocalFilePath: string
//     LocalChecksum: Checksum
//     DuplicateCheckResult: DuplicateCheckResult option }

type Checksum = Checksum of string

type FormFileScanned =
  { Id: FileId
    FormFile: IFormFile
    Filename: string
    LocalChecksum: Checksum }

type FileScanned =
  { Id: FileId
    LocalFilePath: string option
    Filename: string
    LocalChecksum: Checksum }

type CheckedForDuplicate =
  { DuplicateCheckResult: DuplicateCheckResult }

type OriginalFileUploaded =
  { Md5Hash: byte array
    LocalMd5Hash: Checksum
    Url: string }

type Dimension = { Width: int; Height: int }

type LowresVersionCreated =
  {
    // remove id
    // Id: System.Guid
    Dimension: Dimension
    Url: string
    // blob id?
    VariantName: string }

type FileSavedToStorage =
  { Filename: string
    Md5Hash: byte array
    LocalMd5Hash: Checksum
    Url: string
    BlobUrl: Skippable<string>
    BlobName: Skippable<string>
    BlobContainerName: Skippable<string>
    BlobAccountName: Skippable<string>
    BlobSequenceNumber: Skippable<int64>
    ETag: Skippable<string> }

type FileInitEvent = FileSavedToStorage of FileSavedToStorage

type TagAdded = { Name: string }
type TagRemoved = { Name: string }

type FileEvent =
  | LowresVersionCreated of LowresVersionCreated
  | TagAdded of TagAdded
  | TagRemoved of TagRemoved


type GlowWebRequestContext =
  { HttpContext: HttpContext
    UserId: string option
    DocumentSession: IDocumentSession

   }

type AuthenticatedWebRequestContext =
  { HttpContext: HttpContext
    UserId: string }

type GetContainer = unit -> Task<BlobContainerClient>

type WebRequestContext =
  { HttpContext: HttpContext
    UserId: string option
    DocumentSession: IDocumentSession
    GetSrcContainer: GetContainer
    GetInboxContainer: GetContainer
    GetVariantsContainer: GetContainer
    Configuration: IConfiguration }