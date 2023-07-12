//////////////////////////////////////
//   This file is auto generated   //
//////////////////////////////////////

import * as AzureFiles from "./AzureFiles"
import * as Microsoft_FSharp_Collections from "./Microsoft_FSharp_Collections"
import * as System from "./System"
import * as Microsoft_FSharp_Core from "./Microsoft_FSharp_Core"
import * as System_Collections_Generic from "./System_Collections_Generic"

export type RemoveTaggedImagesFromInbox = {
}
export var defaultRemoveTaggedImagesFromInbox: RemoveTaggedImagesFromInbox = {
}

export type AddProperty = {
  id: AzureFiles.FileId
  property: AzureFiles.Property
}
export var defaultAddProperty: AddProperty = {
  id: AzureFiles.defaultFileId,
  property: AzureFiles.defaultProperty
}

export type RemoveProperty = {
  id: AzureFiles.FileId
  propertyName: AzureFiles.PropertyName
}
export var defaultRemoveProperty: RemoveProperty = {
  id: AzureFiles.defaultFileId,
  propertyName: AzureFiles.defaultPropertyName
}

export type UpdateProperty = {
  id: AzureFiles.FileId
  property: AzureFiles.Property
}
export var defaultUpdateProperty: UpdateProperty = {
  id: AzureFiles.defaultFileId,
  property: AzureFiles.defaultProperty
}

export type UpsertProperties = {
  id: AzureFiles.FileId
  properties: Microsoft_FSharp_Collections.FSharpList<AzureFiles.Property>
}
export var defaultUpsertProperties: UpsertProperties = {
  id: AzureFiles.defaultFileId,
  properties: [] 
}

export type UpsertPropertiesRaw = {
  id: AzureFiles.FileId
  values: System.String
}
export var defaultUpsertPropertiesRaw: UpsertPropertiesRaw = {
  id: AzureFiles.defaultFileId,
  values: ''
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
  date: Microsoft_FSharp_Core.FSharpOption<System.String>
}
export var defaultGetImages: GetImages = {
  includingTags: [] ,
  date: null
}

export type SetTags = {
  fileId: System.Guid
  tags: Microsoft_FSharp_Collections.FSharpList<System.String>
}
export var defaultSetTags: SetTags = {
  fileId: '00000000-0000-0000-0000-000000000000',
  tags: [] 
}

export type TagMany = {
  filter: AzureFiles.Filter
  tags: Microsoft_FSharp_Collections.FSharpList<System.String>
}
export var defaultTagMany: TagMany = {
  filter: AzureFiles.defaultFilter,
  tags: [] 
}

export type Order_Case_Desc = { Case: "Desc" }
export type Order_Case_Asc = { Case: "Asc" }
export type Order = Order_Case_Desc | Order_Case_Asc
export type Order_Case = "Desc" | "Asc"
export var Order_AllCases = [ "Desc", "Asc" ] as const
export var defaultOrder_Case_Desc = { Case: "Desc" }
export var defaultOrder_Case_Asc = { Case: "Asc" }
export var defaultOrder = defaultOrder_Case_Desc as Order

export type GetInboxFiles = {
  cached: System.Boolean
  count: System.Int32
  order: Order
}
export var defaultGetInboxFiles: GetInboxFiles = {
  cached: false,
  count: 0,
  order: defaultOrder
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


export type Page<T> = {
  values: Microsoft_FSharp_Collections.FSharpList<T>
  count: System.Int32
}
export var defaultPage: <T>(defaultT:T) => Page<T> = <T>(defaultT:T) => ({
  values: [] ,
  count: 0
})

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

