namespace AzureFiles

open System
open System.Text.Json.Serialization
open System.Threading.Tasks
open AzFiles.Exif
open Azure.Storage.Blobs
open Marten
open Microsoft.AspNetCore.Http
open Microsoft.Extensions.Configuration
open Microsoft.Extensions.Logging

type DuplicateCheckResult =
  | IsNew
  | IsDuplicate of FileId

type FileIsDuplicate = { FileId: FileId; Filename: string }

type ErrorResult =
  | FileIsDuplicate of FileIsDuplicate
  | NetworkError of string

type Checksum =
  | Checksum of string
  member this.value() =
    match this with
    | Checksum s -> s

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

type Location =
  { Latitude: decimal
    Longitude: decimal }

type ImageInfo =
  { DateCreated: DateTimeOffset option
    Location: Location option }

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
    ETag: Skippable<string>
    ImageInfo: ImageInfo option }

type FileInitEvent = FileSavedToStorage of FileSavedToStorage

type TagAdded = { Name: string }
type TagRemoved = { Name: string }

type EmptyRecord =
  { Skip: Skippable<unit> }
  static member Instance = { Skip = Skippable.Skip }

type ExifDataUpdated = { Data: ExifValue list }

type FileDeleted = EmptyRecord

type FileEvent =
  | LowresVersionCreated of LowresVersionCreated
  | TagAdded of TagAdded
  | TagRemoved of TagRemoved
  | Deleted of EmptyRecord
  | ExifDataUpdated of ExifDataUpdated
  | RemovedFromInbox of EmptyRecord
  

// type GlowWebRequestContext =
//   { HttpContext: HttpContext
//     UserId: string option
//     DocumentSession: IDocumentSession }

// type AuthenticatedWebRequestContext =
//   { HttpContext: HttpContext
//     UserId: string }

type GetContainer = unit -> Task<BlobContainerClient>

type IWebRequestContext =
  abstract HttpContext: HttpContext
  abstract UserId: string option
  abstract DocumentSession: IDocumentSession
  abstract GetSrcContainer: GetContainer
  abstract GetInboxContainer: GetContainer
  abstract GetVariantsContainer: GetContainer
  abstract Configuration: IConfiguration
  abstract GetLogger<'T> : unit -> ILogger<'T>

module WebRequestContext =
  let getBlobContentStreamAsync (ctx: IWebRequestContext) (fileId: FileId) =
    fun () -> 
      task {
        let! container = ctx.GetSrcContainer()
        let blobClient = container.GetBlobClient(fileId.value().ToString())
        let! s = blobClient.DownloadStreamingAsync()
        return s.Value.Content
      }

// type WebRequestContext =
//   { HttpContext: HttpContext
//     UserId: string option
//     DocumentSession: IDocumentSession
//     GetSrcContainer: GetContainer
//     GetInboxContainer: GetContainer
//     GetVariantsContainer: GetContainer
//     Configuration: IConfiguration
//     GetLogger<'T> : unit -> ILogger<'T>
//     }



type ServiceError = { Message: string }

type ServiceResult<'T> = Result<'T, ServiceError>
