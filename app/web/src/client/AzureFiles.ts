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

export type PropertyName_Case_PropertyName = System.String
export type PropertyName = PropertyName_Case_PropertyName
export type PropertyName_Case = "PropertyName"
export var PropertyName_AllCases = [ "PropertyName" ] as const
export var defaultPropertyName_Case_PropertyName = ''
export var defaultPropertyName = defaultPropertyName_Case_PropertyName as PropertyName

export type Property = {
  name: PropertyName
  value: System.String
}
export var defaultProperty: Property = {
  name: defaultPropertyName,
  value: ''
}

export type EmptyRecord = {
  skip: System_Text_Json_Serialization.Skippable<Microsoft_FSharp_Core.Unit>
}
export var defaultEmptyRecord: EmptyRecord = {
  skip: undefined
}

export type Filter_Case_Date = { Case: "Date", Fields: System.String }
export type Filter_Case_RangeFilter = { Case: "RangeFilter", Fields: { from: System.String, until: System.String } }
export type Filter = Filter_Case_Date | Filter_Case_RangeFilter
export type Filter_Case = "Date" | "RangeFilter"
export var Filter_AllCases = [ "Date", "RangeFilter" ] as const
export var defaultFilter_Case_Date = { Case: "Date", Fields: '' }
export var defaultFilter_Case_RangeFilter = { Case: "RangeFilter", Fields: {  from: '',  until: '' }  }
export var defaultFilter = defaultFilter_Case_Date as Filter

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
  name: System.String
  url: System.String
  dimension: Dimension
}
export var defaultImageVariant: ImageVariant = {
  name: '',
  url: '',
  dimension: defaultDimension
}

export type FileProjection = {
  id: System.Guid
  createdAt: NodaTime.Instant
  originalDateTime: System_Text_Json_Serialization.Skippable<Microsoft_FSharp_Core.FSharpOption<System.String>>
  url: System.String
  filename: System.String
  md5Hash: System_Collections_Generic.IEnumerable<System.Byte>
  removedFromInboxAt: Microsoft_FSharp_Core.FSharpOption<NodaTime.Instant>
  localMd5Hash: Microsoft_FSharp_Core.FSharpOption<Checksum>
  tags: Microsoft_FSharp_Collections.FSharpList<System.String>
  lowresVersions: Microsoft_FSharp_Collections.FSharpList<ImageVariant>
  properties: Microsoft_FSharp_Collections.FSharpList<Property>
  exifData: System_Text_Json_Serialization.Skippable<Microsoft_FSharp_Collections.FSharpList<AzFiles.ExifValue>>
  dateTimeOriginal: Microsoft_FSharp_Core.FSharpOption<NodaTime.Instant>
  fileDateOrCreatedAt: NodaTime.Instant
  inbox: System.Boolean
}
export var defaultFileProjection: FileProjection = {
  id: '00000000-0000-0000-0000-000000000000',
  createdAt: "9999-12-31T23:59:59.999999999Z",
  originalDateTime: undefined,
  url: '',
  filename: '',
  md5Hash: [],
  removedFromInboxAt: null,
  localMd5Hash: null,
  tags: [] ,
  lowresVersions: [] ,
  properties: [] ,
  exifData: undefined,
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
  localMd5Hash: Microsoft_FSharp_Core.FSharpOption<Checksum>
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
  localMd5Hash: null,
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
export type ErrorResult_Case_FileNotFound = { Case: "FileNotFound", Fields: FileId }
export type ErrorResult = ErrorResult_Case_FileIsDuplicate | ErrorResult_Case_NetworkError | ErrorResult_Case_FileNotFound
export type ErrorResult_Case = "FileIsDuplicate" | "NetworkError" | "FileNotFound"
export var ErrorResult_AllCases = [ "FileIsDuplicate", "NetworkError", "FileNotFound" ] as const
export var defaultErrorResult_Case_FileIsDuplicate = { Case: "FileIsDuplicate", Fields: defaultFileIsDuplicate }
export var defaultErrorResult_Case_NetworkError = { Case: "NetworkError", Fields: '' }
export var defaultErrorResult_Case_FileNotFound = { Case: "FileNotFound", Fields: defaultFileId }
export var defaultErrorResult = defaultErrorResult_Case_FileIsDuplicate as ErrorResult

export type ApiErrorInfo_Case_ErrorResult = ErrorResult
export type ApiErrorInfo = ApiErrorInfo_Case_ErrorResult
export type ApiErrorInfo_Case = "ErrorResult"
export var ApiErrorInfo_AllCases = [ "ErrorResult" ] as const
export var defaultApiErrorInfo_Case_ErrorResult = defaultErrorResult
export var defaultApiErrorInfo = defaultApiErrorInfo_Case_ErrorResult as ApiErrorInfo

export type ApiError = {
  message: System.String
  info: Microsoft_FSharp_Core.FSharpOption<ApiErrorInfo>
}
export var defaultApiError: ApiError = {
  message: '',
  info: null
}

export type Extension_Case_Extension = System.String
export type Extension = Extension_Case_Extension
export type Extension_Case = "Extension"
export var Extension_AllCases = [ "Extension" ] as const
export var defaultExtension_Case_Extension = ''
export var defaultExtension = defaultExtension_Case_Extension as Extension

export type FileType_Case_Image = { Case: "Image" }
export type FileType_Case_Video = { Case: "Video" }
export type FileType_Case_Pdf = { Case: "Pdf" }
export type FileType_Case_Other = { Case: "Other" }
export type FileType = FileType_Case_Image | FileType_Case_Video | FileType_Case_Pdf | FileType_Case_Other
export type FileType_Case = "Image" | "Video" | "Pdf" | "Other"
export var FileType_AllCases = [ "Image", "Video", "Pdf", "Other" ] as const
export var defaultFileType_Case_Image = { Case: "Image" }
export var defaultFileType_Case_Video = { Case: "Video" }
export var defaultFileType_Case_Pdf = { Case: "Pdf" }
export var defaultFileType_Case_Other = { Case: "Other" }
export var defaultFileType = defaultFileType_Case_Image as FileType

export type FileInfo = {
  extension: Extension
  type: FileType
}
export var defaultFileInfo: FileInfo = {
  extension: defaultExtension,
  type: defaultFileType
}

export type FileViewmodel = {
  id: FileId
  createdAt: NodaTime.Instant
  url: System.String
  filename: System.String
  md5Hash: System_Collections_Generic.IEnumerable<System.Byte>
  removedFromInboxAt: Microsoft_FSharp_Core.FSharpOption<NodaTime.Instant>
  localMd5Hash: Microsoft_FSharp_Core.FSharpOption<Checksum>
  tags: Microsoft_FSharp_Collections.FSharpList<System.String>
  properties: Microsoft_FSharp_Collections.FSharpList<Property>
  lowresVersions: Microsoft_FSharp_Collections.FSharpList<ImageVariant>
  exifData: System_Text_Json_Serialization.Skippable<Microsoft_FSharp_Collections.FSharpList<AzFiles.ExifValue>>
  dateTimeOriginal: Microsoft_FSharp_Core.FSharpOption<NodaTime.Instant>
  dateTime: Microsoft_FSharp_Core.FSharpOption<NodaTime.Instant>
  dateTimeDigitized: Microsoft_FSharp_Core.FSharpOption<NodaTime.Instant>
  fileDateOrCreatedAt: NodaTime.Instant
  location: Microsoft_FSharp_Core.FSharpOption<System.Tuple<System.DecimalArray,System.DecimalArray>>
  fileInfo: FileInfo
}
export var defaultFileViewmodel: FileViewmodel = {
  id: defaultFileId,
  createdAt: "9999-12-31T23:59:59.999999999Z",
  url: '',
  filename: '',
  md5Hash: [],
  removedFromInboxAt: null,
  localMd5Hash: null,
  tags: [] ,
  properties: [] ,
  lowresVersions: [] ,
  exifData: undefined,
  dateTimeOriginal: null,
  dateTime: null,
  dateTimeDigitized: null,
  fileDateOrCreatedAt: "9999-12-31T23:59:59.999999999Z",
  location: null,
  fileInfo: defaultFileInfo
}

export type DuplicateCheckResult_Case_IsNew = { Case: "IsNew" }
export type DuplicateCheckResult_Case_IsDuplicate = { Case: "IsDuplicate", Fields: FileId }
export type DuplicateCheckResult = DuplicateCheckResult_Case_IsNew | DuplicateCheckResult_Case_IsDuplicate
export type DuplicateCheckResult_Case = "IsNew" | "IsDuplicate"
export var DuplicateCheckResult_AllCases = [ "IsNew", "IsDuplicate" ] as const
export var defaultDuplicateCheckResult_Case_IsNew = { Case: "IsNew" }
export var defaultDuplicateCheckResult_Case_IsDuplicate = { Case: "IsDuplicate", Fields: defaultFileId }
export var defaultDuplicateCheckResult = defaultDuplicateCheckResult_Case_IsNew as DuplicateCheckResult

