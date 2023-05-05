//////////////////////////////////////
//   This file is auto generated   //
//////////////////////////////////////

import * as AzureFiles from "./AzureFiles"
import * as Microsoft_FSharp_Collections from "./Microsoft_FSharp_Collections"
import * as System from "./System"
import * as Microsoft_FSharp_Core from "./Microsoft_FSharp_Core"
import * as System_Collections_Generic from "./System_Collections_Generic"

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

export type InboxFileResult = {
  previous: Microsoft_FSharp_Core.FSharpOption<AzureFiles.FileId>
  file: AzureFiles.FileAggregate
  next: Microsoft_FSharp_Core.FSharpOption<AzureFiles.FileId>
}
export var defaultInboxFileResult: InboxFileResult = {
  previous: null,
  file: AzureFiles.defaultFileAggregate,
  next: null
}

