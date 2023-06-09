//////////////////////////////////////
//   This file is auto generated   //
//////////////////////////////////////

import * as System from "./System"
import * as System_Text_Json_Serialization from "./System_Text_Json_Serialization"
import * as Microsoft_FSharp_Core from "./Microsoft_FSharp_Core"
import * as Azure_Storage_Blobs_Models from "./Azure_Storage_Blobs_Models"
import * as NodaTime from "./NodaTime"
import * as Microsoft_FSharp_Collections from "./Microsoft_FSharp_Collections"
import * as AzFiles from "./AzFiles"
import * as System_Collections_Generic from "./System_Collections_Generic"

export type GetBlobFile = {
  itemId: System.String
  containerId: System.String
}
export var defaultGetBlobFile: GetBlobFile = {
  itemId: '',
  containerId: ''
}

export type DeleteAllBlobs = {
  containerName: System.String
}
export var defaultDeleteAllBlobs: DeleteAllBlobs = {
  containerName: ''
}

export type DeleteBlobFile = {
  itemId: System.String
  containerId: System.String
}
export var defaultDeleteBlobFile: DeleteBlobFile = {
  itemId: '',
  containerId: ''
}

export type GetIndexedFiles = {
  tagFilter: System.String
  showUntagged: System.Boolean
}
export var defaultGetIndexedFiles: GetIndexedFiles = {
  tagFilter: '',
  showUntagged: false
}

export type GetIndexedFile = {
  id: System.Guid
}
export var defaultGetIndexedFile: GetIndexedFile = {
  id: '00000000-0000-0000-0000-000000000000'
}

export type GetFiles = {
  name: System.String
}
export var defaultGetFiles: GetFiles = {
  name: ''
}

export type GetNextUntaggedBlob = {
}
export var defaultGetNextUntaggedBlob: GetNextUntaggedBlob = {
}

export type GetAllUntagged = {
}
export var defaultGetAllUntagged: GetAllUntagged = {
}

export type UploadFormFiles = {
}
export var defaultUploadFormFiles: UploadFormFiles = {
}

export type TestAction = {
}
export var defaultTestAction: TestAction = {
}

export type GetBlobContainers = {
}
export var defaultGetBlobContainers: GetBlobContainers = {
}

export type FileId_Case_FileId = System.Guid
export type FileId = FileId_Case_FileId
export type FileId_Case = "FileId"
export var FileId_AllCases = [ "FileId" ] as const
export var defaultFileId_Case_FileId = '00000000-0000-0000-0000-000000000000'
export var defaultFileId = defaultFileId_Case_FileId as FileId

export type EmptyRecord = {
  skip: System_Text_Json_Serialization.Skippable<Microsoft_FSharp_Core.Unit>
}
export var defaultEmptyRecord: EmptyRecord = {
  skip: undefined
}

export type AzureFilesBlobProperties = {
  properties: Azure_Storage_Blobs_Models.BlobProperties
  tags: Azure_Storage_Blobs_Models.GetBlobTagResult
}
export var defaultAzureFilesBlobProperties: AzureFilesBlobProperties = {
  properties: Azure_Storage_Blobs_Models.defaultBlobProperties,
  tags: Azure_Storage_Blobs_Models.defaultGetBlobTagResult
}

export type Checksum_Case_Checksum = System.String
export type Checksum = Checksum_Case_Checksum
export type Checksum_Case = "Checksum"
export var Checksum_AllCases = [ "Checksum" ] as const
export var defaultChecksum_Case_Checksum = ''
export var defaultChecksum = defaultChecksum_Case_Checksum as Checksum

export type Dimension = {
  width: System.Int32
  height: System.Int32
}
export var defaultDimension: Dimension = {
  width: 0,
  height: 0
}

export type ImageVariant = {
  url: System.String
  dimension: Dimension
}
export var defaultImageVariant: ImageVariant = {
  url: '',
  dimension: defaultDimension
}

export type FileProjection = {
  id: System.Guid
  createdAt: NodaTime.Instant
  url: System.String
  filename: System.String
  md5Hash: System_Collections_Generic.IEnumerable<System.Byte>
  removedFromInboxAt: Microsoft_FSharp_Core.FSharpOption<NodaTime.Instant>
  localMd5Hash: Checksum
  tags: Microsoft_FSharp_Collections.FSharpList<System.String>
  lowresVersions: System_Text_Json_Serialization.Skippable<Microsoft_FSharp_Collections.FSharpList<ImageVariant>>
  exifData: Microsoft_FSharp_Collections.FSharpList<AzFiles.ExifValue>
  dateTimeOriginal: Microsoft_FSharp_Core.FSharpOption<NodaTime.Instant>
  fileDateOrCreatedAt: NodaTime.Instant
  inbox: System.Boolean
}
export var defaultFileProjection: FileProjection = {
  id: '00000000-0000-0000-0000-000000000000',
  createdAt: "9999-12-31T23:59:59.999999999Z",
  url: '',
  filename: '',
  md5Hash: [],
  removedFromInboxAt: null,
  localMd5Hash: defaultChecksum,
  tags: [] ,
  lowresVersions: undefined,
  exifData: [] ,
  dateTimeOriginal: null,
  fileDateOrCreatedAt: "9999-12-31T23:59:59.999999999Z",
  inbox: false
}

export type Location = {
  latitude: System.Decimal
  longitude: System.Decimal
}
export var defaultLocation: Location = {
  latitude: System.defaultDecimal,
  longitude: System.defaultDecimal
}

export type ImageInfo = {
  dateCreated: Microsoft_FSharp_Core.FSharpOption<System.DateTimeOffset>
  location: Microsoft_FSharp_Core.FSharpOption<Location>
}
export var defaultImageInfo: ImageInfo = {
  dateCreated: null,
  location: null
}

export type FileSavedToStorage = {
  filename: System.String
  md5Hash: System_Collections_Generic.IEnumerable<System.Byte>
  localMd5Hash: Checksum
  url: System.String
  blobUrl: System_Text_Json_Serialization.Skippable<System.String>
  blobName: System_Text_Json_Serialization.Skippable<System.String>
  blobContainerName: System_Text_Json_Serialization.Skippable<System.String>
  blobAccountName: System_Text_Json_Serialization.Skippable<System.String>
  blobSequenceNumber: System_Text_Json_Serialization.Skippable<System.Int64>
  eTag: System_Text_Json_Serialization.Skippable<System.String>
  imageInfo: Microsoft_FSharp_Core.FSharpOption<ImageInfo>
}
export var defaultFileSavedToStorage: FileSavedToStorage = {
  filename: '',
  md5Hash: [],
  localMd5Hash: defaultChecksum,
  url: '',
  blobUrl: undefined,
  blobName: undefined,
  blobContainerName: undefined,
  blobAccountName: undefined,
  blobSequenceNumber: undefined,
  eTag: undefined,
  imageInfo: null
}

export type FileIsDuplicate = {
  fileId: FileId
  filename: System.String
}
export var defaultFileIsDuplicate: FileIsDuplicate = {
  fileId: defaultFileId,
  filename: ''
}

export type ErrorResult_Case_FileIsDuplicate = { Case: "FileIsDuplicate", Fields: FileIsDuplicate }
export type ErrorResult_Case_NetworkError = { Case: "NetworkError", Fields: System.String }
export type ErrorResult = ErrorResult_Case_FileIsDuplicate | ErrorResult_Case_NetworkError
export type ErrorResult_Case = "FileIsDuplicate" | "NetworkError"
export var ErrorResult_AllCases = [ "FileIsDuplicate", "NetworkError" ] as const
export var defaultErrorResult_Case_FileIsDuplicate = { Case: "FileIsDuplicate", Fields: defaultFileIsDuplicate }
export var defaultErrorResult_Case_NetworkError = { Case: "NetworkError", Fields: '' }
export var defaultErrorResult = defaultErrorResult_Case_FileIsDuplicate as ErrorResult

export type ServiceError = {
  message: System.String
}
export var defaultServiceError: ServiceError = {
  message: ''
}

export type FileViewmodel = {
  id: System.Guid
  createdAt: NodaTime.Instant
  url: System.String
  filename: System.String
  md5Hash: System_Collections_Generic.IEnumerable<System.Byte>
  removedFromInboxAt: Microsoft_FSharp_Core.FSharpOption<NodaTime.Instant>
  localMd5Hash: Checksum
  tags: Microsoft_FSharp_Collections.FSharpList<System.String>
  exifData: Microsoft_FSharp_Collections.FSharpList<AzFiles.ExifValue>
  dateTimeOriginal: Microsoft_FSharp_Core.FSharpOption<NodaTime.Instant>
  dateTime: Microsoft_FSharp_Core.FSharpOption<NodaTime.Instant>
  dateTimeDigitized: Microsoft_FSharp_Core.FSharpOption<NodaTime.Instant>
  fileDateOrCreatedAt: NodaTime.Instant
  location: Microsoft_FSharp_Core.FSharpOption<System.Tuple<System.DecimalArray,System.DecimalArray>>
}
export var defaultFileViewmodel: FileViewmodel = {
  id: '00000000-0000-0000-0000-000000000000',
  createdAt: "9999-12-31T23:59:59.999999999Z",
  url: '',
  filename: '',
  md5Hash: [],
  removedFromInboxAt: null,
  localMd5Hash: defaultChecksum,
  tags: [] ,
  exifData: [] ,
  dateTimeOriginal: null,
  dateTime: null,
  dateTimeDigitized: null,
  fileDateOrCreatedAt: "9999-12-31T23:59:59.999999999Z",
  location: null
}

export type DuplicateCheckResult_Case_IsNew = { Case: "IsNew" }
export type DuplicateCheckResult_Case_IsDuplicate = { Case: "IsDuplicate", Fields: FileId }
export type DuplicateCheckResult = DuplicateCheckResult_Case_IsNew | DuplicateCheckResult_Case_IsDuplicate
export type DuplicateCheckResult_Case = "IsNew" | "IsDuplicate"
export var DuplicateCheckResult_AllCases = [ "IsNew", "IsDuplicate" ] as const
export var defaultDuplicateCheckResult_Case_IsNew = { Case: "IsNew" }
export var defaultDuplicateCheckResult_Case_IsDuplicate = { Case: "IsDuplicate", Fields: defaultFileId }
export var defaultDuplicateCheckResult = defaultDuplicateCheckResult_Case_IsNew as DuplicateCheckResult

