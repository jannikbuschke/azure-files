//////////////////////////////////////
//   This file is auto generated   //
//////////////////////////////////////

import * as AzFiles from "./AzFiles"
import * as Microsoft_FSharp_Collections from "./Microsoft_FSharp_Collections"
import * as System from "./System"
import * as NodaTime from "./NodaTime"
import * as Microsoft_FSharp_Core from "./Microsoft_FSharp_Core"
import * as System_Collections_Generic from "./System_Collections_Generic"

//*** Cyclic dependencies dected ***
//*** this can cause problems when generating types and defualt values ***
//*** Please ensure that your types don't have cyclic dependencies ***
// ImageFilter
//*** ******************* ***

export type RemoveTaggedImagesFromInbox = {
}
export var defaultRemoveTaggedImagesFromInbox: RemoveTaggedImagesFromInbox = {
}

export type AddProperty = {
  id: AzFiles.FileId
  property: AzFiles.Property
}
export var defaultAddProperty: AddProperty = {
  id: AzFiles.defaultFileId,
  property: AzFiles.defaultProperty
}

export type RemoveProperty = {
  id: AzFiles.FileId
  propertyName: AzFiles.PropertyName
}
export var defaultRemoveProperty: RemoveProperty = {
  id: AzFiles.defaultFileId,
  propertyName: AzFiles.defaultPropertyName
}

export type UpdateProperty = {
  id: AzFiles.FileId
  property: AzFiles.Property
}
export var defaultUpdateProperty: UpdateProperty = {
  id: AzFiles.defaultFileId,
  property: AzFiles.defaultProperty
}

export type UpsertProperties = {
  id: AzFiles.FileId
  properties: Microsoft_FSharp_Collections.FSharpList<AzFiles.Property>
}
export var defaultUpsertProperties: UpsertProperties = {
  id: AzFiles.defaultFileId,
  properties: [] 
}

export type UpsertPropertiesRaw = {
  id: AzFiles.FileId
  values: System.String
}
export var defaultUpsertPropertiesRaw: UpsertPropertiesRaw = {
  id: AzFiles.defaultFileId,
  values: ''
}

export type Rotate = {
  id: AzFiles.FileId
  property: AzFiles.Property
}
export var defaultRotate: Rotate = {
  id: AzFiles.defaultFileId,
  property: AzFiles.defaultProperty
}


// This type has cyclic dependencies: AzFiles.Features.GetTaggedImages+ImageFilter
// in general this should be avoided. We render a 'stub' value here that will be changed at the bottom of this file
export type ImageFilter_Case_All = { Case: "All" }
export type ImageFilter_Case_Tagged = { Case: "Tagged", Fields: Microsoft_FSharp_Collections.FSharpList<System.String> }
export type ImageFilter_Case_DateRange = { Case: "DateRange", Fields: { item1: NodaTime.Instant, item2: NodaTime.Instant } }
export type ImageFilter_Case_And = { Case: "And", Fields: { item1: ImageFilter, item2: ImageFilter } }
export type ImageFilter_Case_Or = { Case: "Or", Fields: { item1: ImageFilter, item2: ImageFilter } }
export type ImageFilter = ImageFilter_Case_All | ImageFilter_Case_Tagged | ImageFilter_Case_DateRange | ImageFilter_Case_And | ImageFilter_Case_Or
export type ImageFilter_Case = "All" | "Tagged" | "DateRange" | "And" | "Or"
export var ImageFilter_AllCases = [ "All", "Tagged", "DateRange", "And", "Or" ] as const
export var defaultImageFilter_Case_All = { Case: "All" }
export var defaultImageFilter_Case_Tagged = { Case: "Tagged", Fields: []  }
export var defaultImageFilter_Case_DateRange = { Case: "DateRange", Fields: {  Item1: "9999-12-31T23:59:59.999999999Z",  Item2: "9999-12-31T23:59:59.999999999Z" }  }
export var defaultImageFilter_Case_And = { Case: "And", Fields: {  Item1: defaultImageFilter,  Item2: defaultImageFilter }  }
export var defaultImageFilter_Case_Or = { Case: "Or", Fields: {  Item1: defaultImageFilter,  Item2: defaultImageFilter }  }
export var defaultImageFilter = defaultImageFilter_Case_All as ImageFilter
export var defaultImageFilter: ImageFilter = { } as any as ImageFilter

export type Page = {
  pageNumber: System.Int32
  pageSize: System.Int32
}
export var defaultPage: Page = {
  pageNumber: 0,
  pageSize: 0
}

export type Pagination_Case_NoPagination = { Case: "NoPagination" }
export type Pagination_Case_Page = { Case: "Page", Fields: Page }
export type Pagination = Pagination_Case_NoPagination | Pagination_Case_Page
export type Pagination_Case = "NoPagination" | "Page"
export var Pagination_AllCases = [ "NoPagination", "Page" ] as const
export var defaultPagination_Case_NoPagination = { Case: "NoPagination" }
export var defaultPagination_Case_Page = { Case: "Page", Fields: defaultPage }
export var defaultPagination = defaultPagination_Case_NoPagination as Pagination

export type GetBlobMetadata = {
  blobId: System.String
}
export var defaultGetBlobMetadata: GetBlobMetadata = {
  blobId: ''
}

export type GetExifDataFromBlobFile = {
  blobId: AzFiles.FileId
}
export var defaultGetExifDataFromBlobFile: GetExifDataFromBlobFile = {
  blobId: AzFiles.defaultFileId
}

export type GetNavbar = {
}
export var defaultGetNavbar: GetNavbar = {
}

export type DeleteFile = {
  fileId: AzFiles.FileId
}
export var defaultDeleteFile: DeleteFile = {
  fileId: AzFiles.defaultFileId
}

export type TagMany = {
  filter: ImageFilter
  tags: Microsoft_FSharp_Collections.FSharpList<System.String>
}
export var defaultTagMany: TagMany = {
  filter: defaultImageFilter,
  tags: [] 
}

export type SetTags = {
  fileId: System.Guid
  tags: Microsoft_FSharp_Collections.FSharpList<System.String>
}
export var defaultSetTags: SetTags = {
  fileId: '00000000-0000-0000-0000-000000000000',
  tags: [] 
}

export type GetTags = {
  none: AzFiles.EmptyRecord
}
export var defaultGetTags: GetTags = {
  none: AzFiles.defaultEmptyRecord
}

export type ChronologicalSortDirection_Case_Asc = { Case: "Asc" }
export type ChronologicalSortDirection_Case_Desc = { Case: "Desc" }
export type ChronologicalSortDirection = ChronologicalSortDirection_Case_Asc | ChronologicalSortDirection_Case_Desc
export type ChronologicalSortDirection_Case = "Asc" | "Desc"
export var ChronologicalSortDirection_AllCases = [ "Asc", "Desc" ] as const
export var defaultChronologicalSortDirection_Case_Asc = { Case: "Asc" }
export var defaultChronologicalSortDirection_Case_Desc = { Case: "Desc" }
export var defaultChronologicalSortDirection = defaultChronologicalSortDirection_Case_Asc as ChronologicalSortDirection

export type GetImages = {
  chronologicalSortDirection: ChronologicalSortDirection
  pagination: Pagination
  filter: ImageFilter
}
export var defaultGetImages: GetImages = {
  chronologicalSortDirection: defaultChronologicalSortDirection,
  pagination: defaultPagination,
  filter: defaultImageFilter
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
  id: AzFiles.FileId
}
export var defaultGetInboxFile: GetInboxFile = {
  id: AzFiles.defaultFileId
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
  previous: Microsoft_FSharp_Core.FSharpOption<AzFiles.FileId>
  file: AzFiles.FileViewmodel
  next: Microsoft_FSharp_Core.FSharpOption<AzFiles.FileId>
  nextUrl: Microsoft_FSharp_Core.FSharpOption<System.String>
}
export var defaultInboxFileResult: InboxFileResult = {
  previous: null,
  file: AzFiles.defaultFileViewmodel,
  next: null,
  nextUrl: null
}

// Render cyclic fixes
//
// the type AzFiles.Features.GetTaggedImages+ImageFilter has cyclic dependencies
// in general this should be avoided
//
Object.assign(defaultImageFilter, (export type ImageFilter_Case_All = { Case: "All" }
export type ImageFilter_Case_Tagged = { Case: "Tagged", Fields: Microsoft_FSharp_Collections.FSharpList<System.String> }
export type ImageFilter_Case_DateRange = { Case: "DateRange", Fields: { item1: NodaTime.Instant, item2: NodaTime.Instant } }
export type ImageFilter_Case_And = { Case: "And", Fields: { item1: ImageFilter, item2: ImageFilter } }
export type ImageFilter_Case_Or = { Case: "Or", Fields: { item1: ImageFilter, item2: ImageFilter } }
export type ImageFilter = ImageFilter_Case_All | ImageFilter_Case_Tagged | ImageFilter_Case_DateRange | ImageFilter_Case_And | ImageFilter_Case_Or
export type ImageFilter_Case = "All" | "Tagged" | "DateRange" | "And" | "Or"
export var ImageFilter_AllCases = [ "All", "Tagged", "DateRange", "And", "Or" ] as const
export var defaultImageFilter_Case_All = { Case: "All" }
export var defaultImageFilter_Case_Tagged = { Case: "Tagged", Fields: []  }
export var defaultImageFilter_Case_DateRange = { Case: "DateRange", Fields: {  Item1: "9999-12-31T23:59:59.999999999Z",  Item2: "9999-12-31T23:59:59.999999999Z" }  }
export var defaultImageFilter_Case_And = { Case: "And", Fields: {  Item1: defaultImageFilter,  Item2: defaultImageFilter }  }
export var defaultImageFilter_Case_Or = { Case: "Or", Fields: {  Item1: defaultImageFilter,  Item2: defaultImageFilter }  }
export var defaultImageFilter = defaultImageFilter_Case_All as ImageFilter
))

