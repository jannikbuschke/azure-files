//////////////////////////////////////
//   This file is auto generated   //
//////////////////////////////////////

import * as System from "./System"
import * as AzureFiles from "./AzureFiles"
import * as Microsoft_FSharp_Collections from "./Microsoft_FSharp_Collections"
import * as Microsoft_FSharp_Core from "./Microsoft_FSharp_Core"
import * as NodaTime from "./NodaTime"
import * as System_Collections_Generic from "./System_Collections_Generic"

export type RemoveTaggedImagesFromInbox = {
}
export var defaultRemoveTaggedImagesFromInbox: RemoveTaggedImagesFromInbox = {
}

export type GetBlobMetadata = {
  blobId: System.String
}
export var defaultGetBlobMetadata: GetBlobMetadata = {
  blobId: ''
}

export type GetExifDataFromBlobFile = {
  blobId: AzureFiles.FileId
}
export var defaultGetExifDataFromBlobFile: GetExifDataFromBlobFile = {
  blobId: AzureFiles.defaultFileId
}

export type GetNavbar = {
}
export var defaultGetNavbar: GetNavbar = {
}

export type DeleteFile = {
  fileId: AzureFiles.FileId
}
export var defaultDeleteFile: DeleteFile = {
  fileId: AzureFiles.defaultFileId
}

export type GetTags = {
  none: AzureFiles.EmptyRecord
}
export var defaultGetTags: GetTags = {
  none: AzureFiles.defaultEmptyRecord
}

export type GetImages = {
  includingTags: Microsoft_FSharp_Collections.FSharpList<System.String>
}
export var defaultGetImages: GetImages = {
  includingTags: [] 
}

export type SetTags = {
  fileId: System.Guid
  tags: Microsoft_FSharp_Collections.FSharpList<System.String>
}
export var defaultSetTags: SetTags = {
  fileId: '00000000-0000-0000-0000-000000000000',
  tags: [] 
}

export type GetInboxFiles = {
}
export var defaultGetInboxFiles: GetInboxFiles = {
}

export type GetInboxFile = {
  id: AzureFiles.FileId
}
export var defaultGetInboxFile: GetInboxFile = {
  id: AzureFiles.defaultFileId
}

export type Message = {
  title: System.String
  color: System.String
}
export var defaultMessage: Message = {
  title: '',
  color: ''
}

export type Navbar = {
  message: Microsoft_FSharp_Core.FSharpOption<Message>
}
export var defaultNavbar: Navbar = {
  message: null
}

export type FileListViewmodel = {
  id: AzureFiles.FileId
  filename: System.String
  url: System.String
  fileDateOrCreatedAt: NodaTime.Instant
  inbox: System.Boolean
  tags: Microsoft_FSharp_Collections.FSharpList<System.String>
}
export var defaultFileListViewmodel: FileListViewmodel = {
  id: AzureFiles.defaultFileId,
  filename: '',
  url: '',
  fileDateOrCreatedAt: "9999-12-31T23:59:59.999999999Z",
  inbox: false,
  tags: [] 
}

export type InboxFileResult = {
  previous: Microsoft_FSharp_Core.FSharpOption<AzureFiles.FileId>
  file: AzureFiles.FileViewmodel
  next: Microsoft_FSharp_Core.FSharpOption<AzureFiles.FileId>
  nextUrl: Microsoft_FSharp_Core.FSharpOption<System.String>
}
export var defaultInboxFileResult: InboxFileResult = {
  previous: null,
  file: AzureFiles.defaultFileViewmodel,
  next: null,
  nextUrl: null
}

