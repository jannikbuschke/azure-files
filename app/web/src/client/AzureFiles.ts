//////////////////////////////////////
//   This file is auto generated   //
//////////////////////////////////////

import * as System from "./System"
import * as System_Collections_Generic from "./System_Collections_Generic"
import * as Azure_Storage_Blobs_Models from "./Azure_Storage_Blobs_Models"
import * as Microsoft_FSharp_Core from "./Microsoft_FSharp_Core"
import * as Microsoft_FSharp_Collections from "./Microsoft_FSharp_Collections"
import * as System_Text_Json_Serialization from "./System_Text_Json_Serialization"

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

export type TagAdded = {
  name: System.String
}
export var defaultTagAdded: TagAdded = {
  name: ''
}

export type SetTags = {
  fileId: System.Guid
  tags: System_Collections_Generic.List<TagAdded>
}
export var defaultSetTags: SetTags = {
  fileId: '00000000-0000-0000-0000-000000000000',
  tags: []
}

export type SetTagsBatched = {
  tags: System_Collections_Generic.List<TagAdded>
  files: System_Collections_Generic.Dictionary<System.Guid,System.Boolean>
}
export var defaultSetTagsBatched: SetTagsBatched = {
  tags: [],
  files: ({})
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

export type UploadSystemFiles = {
  filePaths: System_Collections_Generic.List<System.String>
}
export var defaultUploadSystemFiles: UploadSystemFiles = {
  filePaths: []
}

export type RenameSystemFiles = {
  files: System_Collections_Generic.List<System.String>
  folderName: System.String
}
export var defaultRenameSystemFiles: RenameSystemFiles = {
  files: [],
  folderName: ''
}

export type GetBlobContainers = {
}
export var defaultGetBlobContainers: GetBlobContainers = {
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

export type FileAggregate = {
  id: System.Guid
  url: Microsoft_FSharp_Core.FSharpOption<System.String>
  filename: System.String
  md5Hash: System_Collections_Generic.IEnumerable<System.Byte>
  localMd5Hash: Checksum
  tags: Microsoft_FSharp_Collections.FSharpList<System.String>
  thumbnailUrl: Microsoft_FSharp_Core.FSharpOption<System.String>
  lowresUrl: Microsoft_FSharp_Core.FSharpOption<System.String>
  fullHdUrl: Microsoft_FSharp_Core.FSharpOption<System.String>
  variants: Microsoft_FSharp_Collections.FSharpList<ImageVariant>
}
export var defaultFileAggregate: FileAggregate = {
  id: '00000000-0000-0000-0000-000000000000',
  url: null,
  filename: '',
  md5Hash: [],
  localMd5Hash: defaultChecksum,
  tags: [] ,
  thumbnailUrl: null,
  lowresUrl: null,
  fullHdUrl: null,
  variants: [] 
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
  eTag: undefined
}

export type FileId_Case_FileId = System.Guid
export type FileId = FileId_Case_FileId
export type FileId_Case = "FileId"
export var FileId_AllCases = [ "FileId" ] as const
export var defaultFileId_Case_FileId = '00000000-0000-0000-0000-000000000000'
export var defaultFileId = defaultFileId_Case_FileId as FileId

export type ErrorResult_Case_FileIsDuplicate = { Case: "FileIsDuplicate", Fields: { duplicateFileId: FileId, filename: System.String } }
export type ErrorResult_Case_NetworkError = { Case: "NetworkError", Fields: System.String }
export type ErrorResult = ErrorResult_Case_FileIsDuplicate | ErrorResult_Case_NetworkError
export type ErrorResult_Case = "FileIsDuplicate" | "NetworkError"
export var ErrorResult_AllCases = [ "FileIsDuplicate", "NetworkError" ] as const
export var defaultErrorResult_Case_FileIsDuplicate = { Case: "FileIsDuplicate", Fields: {  duplicateFileId: defaultFileId,  filename: '' }  }
export var defaultErrorResult_Case_NetworkError = { Case: "NetworkError", Fields: '' }
export var defaultErrorResult = defaultErrorResult_Case_FileIsDuplicate as ErrorResult

