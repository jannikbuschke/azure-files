//////////////////////////////////////
//   This file is auto generated   //
//////////////////////////////////////

import * as System from "./System"
import * as AzFiles from "./AzFiles"
import * as NodaTime from "./NodaTime"
import * as Microsoft_FSharp_Collections from "./Microsoft_FSharp_Collections"
import * as Microsoft_FSharp_Core from "./Microsoft_FSharp_Core"
import * as System_Text_Json_Serialization from "./System_Text_Json_Serialization"
import * as System_Collections_Generic from "./System_Collections_Generic"

export type GalleryId_Case_GalleryId = System.Guid
export type GalleryId = GalleryId_Case_GalleryId
export type GalleryId_Case = "GalleryId"
export var GalleryId_AllCases = [ "GalleryId" ] as const
export var defaultGalleryId_Case_GalleryId = '00000000-0000-0000-0000-000000000000'
export var defaultGalleryId = defaultGalleryId_Case_GalleryId as GalleryId

export type Size = {
  width: System.Int32
  height: System.Int32
}
export var defaultSize: Size = {
  width: 0,
  height: 0
}

export type GalleryFile = {
  id: AzFiles.FileId
  createdAt: NodaTime.Instant
  url: System.String
  filename: System.String
  tags: Microsoft_FSharp_Collections.FSharpList<System.String>
  lowresVersions: Microsoft_FSharp_Collections.FSharpList<AzFiles.ImageVariant>
  fileDateOrCreatedAt: NodaTime.Instant
  location: Microsoft_FSharp_Core.FSharpOption<System.Tuple<System.DecimalArray,System.DecimalArray>>
  orientation: System_Text_Json_Serialization.Skippable<Microsoft_FSharp_Core.FSharpOption<System.UInt16>>
  exifData: System_Text_Json_Serialization.Skippable<Microsoft_FSharp_Collections.FSharpList<AzFiles.ExifValue>>
}
export var defaultGalleryFile: GalleryFile = {
  id: AzFiles.defaultFileId,
  createdAt: "9999-12-31T23:59:59.999999999Z",
  url: '',
  filename: '',
  tags: [] ,
  lowresVersions: [] ,
  fileDateOrCreatedAt: "9999-12-31T23:59:59.999999999Z",
  location: null,
  orientation: undefined,
  exifData: undefined
}

export type ColSpan_Case_Colspan = System.Int32
export type ColSpan = ColSpan_Case_Colspan
export type ColSpan_Case = "Colspan"
export var ColSpan_AllCases = [ "Colspan" ] as const
export var defaultColSpan_Case_Colspan = 0
export var defaultColSpan = defaultColSpan_Case_Colspan as ColSpan

export type RowSpan_Case_RowSpan = System.Int32
export type RowSpan = RowSpan_Case_RowSpan
export type RowSpan_Case = "RowSpan"
export var RowSpan_AllCases = [ "RowSpan" ] as const
export var defaultRowSpan_Case_RowSpan = 0
export var defaultRowSpan = defaultRowSpan_Case_RowSpan as RowSpan

export type GridPlacementDimension = {
  columnSpan: ColSpan
  rowSpan: RowSpan
}
export var defaultGridPlacementDimension: GridPlacementDimension = {
  columnSpan: defaultColSpan,
  rowSpan: defaultRowSpan
}

export type DimensionAdjustment = {
  top: System_Text_Json_Serialization.Skippable<System.Int32>
  left: System_Text_Json_Serialization.Skippable<System.Int32>
  width: System_Text_Json_Serialization.Skippable<System.Int32>
  height: System_Text_Json_Serialization.Skippable<System.Int32>
}
export var defaultDimensionAdjustment: DimensionAdjustment = {
  top: undefined,
  left: undefined,
  width: undefined,
  height: undefined
}

export type Image = {
  size: Size
  file: GalleryFile
  dimension: GridPlacementDimension
  dimensionAdjustment: System_Text_Json_Serialization.Skippable<DimensionAdjustment>
  hidden: System_Text_Json_Serialization.Skippable<System.Boolean>
}
export var defaultImage: Image = {
  size: defaultSize,
  file: defaultGalleryFile,
  dimension: defaultGridPlacementDimension,
  dimensionAdjustment: undefined,
  hidden: undefined
}

