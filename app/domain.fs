namespace AzFiles

open System
open System.Text.Json.Serialization
open System.Threading.Tasks
open AzFiles.Exif
open Azure.Storage.Blobs
open Marten
open Microsoft.AspNetCore.Http
open Microsoft.Extensions.Configuration
open Microsoft.Extensions.Logging

type PropertyName =
  | PropertyName of string

  member this.Value() =
    let (PropertyName s) = this
    s

type Property = { Name: PropertyName; Value: string }

type PropertyChanged =
  | PropertyAdded of Property
  | PropertyRemoved of PropertyName
  | PropertyUpdated of Property

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

module Dimension =
  let pixels d = d.Width * d.Height

type LowresVersionCreated =
  {
    // remove id
    // Id: System.Guid
    Dimension: Dimension
    Url: string
    // blob id?
    VariantName: string }

type Variant =
  | Root
  | VariantName of string

type PublicUrlCreated = { Url: string; Variant: Variant }

type Location =
  { Latitude: decimal
    Longitude: decimal }

type ImageInfo =
  { DateCreated: DateTimeOffset option
    Location: Location option }

type FileSavedToStorage =
  { Filename: string
    Md5Hash: byte array
    LocalMd5Hash: Checksum option
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
  | PublicUrlCreated of PublicUrlCreated
  | TagAdded of TagAdded
  | TagRemoved of TagRemoved
  | Deleted of EmptyRecord
  | ExifDataUpdated of ExifDataUpdated
  | RemovedFromInbox of EmptyRecord
  | PropertyChanged of PropertyChanged
  | PropertiesChanged of PropertyChanged list

type GetContainerAsync = unit -> Task<BlobContainerClient>
type GetContainer = unit -> BlobContainerClient
type GetServiceClient = unit -> BlobServiceClient

type IWebRequestContext =
  abstract HttpContext: HttpContext
  abstract UserId: string option
  abstract DocumentSession: IDocumentSession
  abstract GetBlobServiceClient: GetServiceClient
  abstract GetSrcContainerAsync: GetContainerAsync
  abstract GetInboxContainerAsync: GetContainerAsync
  abstract GetVariantsContainerAsync: GetContainerAsync
  abstract GetSrcContainer: GetContainer
  abstract GetInboxContainer: GetContainer
  abstract GetVariantsContainer: GetContainer
  abstract Configuration: IConfiguration
  abstract GetLogger<'T> : unit -> ILogger<'T>

module WebRequestContext =
  let getBlobContentStreamAsync (container: BlobContainerClient) (fileId: FileId) =
    task {
      let fileId = fileId.value().ToString()
      let blobClient = container.GetBlobClient(fileId)

      try
        let! s = blobClient.DownloadStreamingAsync()
        return Result.Ok s.Value.Content
      with
      | ex ->
        return Result.Error(NetworkError(sprintf "Could not get blob for file '%s'. Message = %s" fileId ex.Message))
    }

  let getInboxBlobContentStreamAsync (ctx: IWebRequestContext) (fileId: FileId) =
    task {
      let! container = ctx.GetInboxContainerAsync()
      let! stream = getBlobContentStreamAsync container fileId
      return stream
    }

  let getSrcBlobContentStreamAsync (ctx: IWebRequestContext) (fileId: FileId) =
    fun () ->
      task {
        let container = ctx.GetSrcContainer()
        let! stream = getBlobContentStreamAsync container fileId
        return stream
      }

type ApiErrorInfo = ErrorResult of ErrorResult

type ApiError =
  { Message: string
    Info: ApiErrorInfo option }

type ApiResult<'T> = Result<'T, ApiError>