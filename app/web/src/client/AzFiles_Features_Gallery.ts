//////////////////////////////////////
//   This file is auto generated   //
//////////////////////////////////////

import * as AzFiles_Features from "./AzFiles_Features"
import * as System from "./System"
import * as AzFiles_Galleries from "./AzFiles_Galleries"
import * as Microsoft_FSharp_Collections from "./Microsoft_FSharp_Collections"
import * as Microsoft_FSharp_Core from "./Microsoft_FSharp_Core"
import * as System_Collections_Generic from "./System_Collections_Generic"

export type GalleryBasedOn_Case_Filter = AzFiles_Features.ImageFilter
export type GalleryBasedOn = GalleryBasedOn_Case_Filter
export type GalleryBasedOn_Case = "Filter"
export var GalleryBasedOn_AllCases = [ "Filter" ] as const
export var defaultGalleryBasedOn_Case_Filter = AzFiles_Features.defaultImageFilter
export var defaultGalleryBasedOn = defaultGalleryBasedOn_Case_Filter as GalleryBasedOn

export type CreateGallery = {
  name: System.String
  basedOn: GalleryBasedOn
  description: System.String
}
export var defaultCreateGallery: CreateGallery = {
  name: '',
  basedOn: defaultGalleryBasedOn,
  description: ''
}

export type UpdateGallery = {
  id: AzFiles_Galleries.GalleryId
  items: Microsoft_FSharp_Collections.FSharpList<AzFiles_Galleries.Image>
}
export var defaultUpdateGallery: UpdateGallery = {
  id: AzFiles_Galleries.defaultGalleryId,
  items: [] 
}

export type GetGalleries = {
}
export var defaultGetGalleries: GetGalleries = {
}

export type GetGalleryParameter_Case_Id = { Case: "Id", Fields: AzFiles_Galleries.GalleryId }
export type GetGalleryParameter_Case_Name = { Case: "Name", Fields: System.String }
export type GetGalleryParameter = GetGalleryParameter_Case_Id | GetGalleryParameter_Case_Name
export type GetGalleryParameter_Case = "Id" | "Name"
export var GetGalleryParameter_AllCases = [ "Id", "Name" ] as const
export var defaultGetGalleryParameter_Case_Id = { Case: "Id", Fields: AzFiles_Galleries.defaultGalleryId }
export var defaultGetGalleryParameter_Case_Name = { Case: "Name", Fields: '' }
export var defaultGetGalleryParameter = defaultGetGalleryParameter_Case_Id as GetGalleryParameter

export type GetGallery = {
  argument: GetGalleryParameter
}
export var defaultGetGallery: GetGallery = {
  argument: defaultGetGalleryParameter
}

export type GetGalleryItems = {
  argument: GetGalleryParameter
  pagination: AzFiles_Features.Pagination
}
export var defaultGetGalleryItems: GetGalleryItems = {
  argument: defaultGetGalleryParameter,
  pagination: AzFiles_Features.defaultPagination
}

export type GetDynamicGallery = {
  filter: AzFiles_Features.ImageFilter
}
export var defaultGetDynamicGallery: GetDynamicGallery = {
  filter: AzFiles_Features.defaultImageFilter
}

export type Gallery = {
  id: System.Guid
  name: System.String
  description: Microsoft_FSharp_Core.FSharpOption<System.String>
  items: Microsoft_FSharp_Collections.FSharpList<AzFiles_Galleries.Image>
}
export var defaultGallery: Gallery = {
  id: '00000000-0000-0000-0000-000000000000',
  name: '',
  description: null,
  items: [] 
}


export type PaginatedResult<a> = {
  value: Microsoft_FSharp_Collections.FSharpList<a>
  count: System.Int32
}
export var defaultPaginatedResult: <a>(defaulta:a) => PaginatedResult<a> = <a>(defaulta:a) => ({
  value: [] ,
  count: 0
})

export type PositionedImage = {
  image: AzFiles_Galleries.Image
  placement: AzFiles_Galleries.GridPlacement
}
export var defaultPositionedImage: PositionedImage = {
  image: AzFiles_Galleries.defaultImage,
  placement: AzFiles_Galleries.defaultGridPlacement
}

export type GalleryViewmodel = {
  positionedImages: Microsoft_FSharp_Collections.FSharpList<PositionedImage>
  positions: Microsoft_FSharp_Collections.FSharpList<Microsoft_FSharp_Collections.FSharpList<System.Int32>>
}
export var defaultGalleryViewmodel: GalleryViewmodel = {
  positionedImages: [] ,
  positions: [] 
}

