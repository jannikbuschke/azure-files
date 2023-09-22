//////////////////////////////////////
//   This file is auto generated   //
//////////////////////////////////////

import * as System from "./System"
import * as System_Text_Json_Serialization from "./System_Text_Json_Serialization"
import * as AzFiles from "./AzFiles"
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
  file: AzFiles.FileViewmodel
  dimension: GridPlacementDimension
  dimensionAdjustment: System_Text_Json_Serialization.Skippable<DimensionAdjustment>
  hidden: System_Text_Json_Serialization.Skippable<System.Boolean>
}
export var defaultImage: Image = {
  size: defaultSize,
  file: AzFiles.defaultFileViewmodel,
  dimension: defaultGridPlacementDimension,
  dimensionAdjustment: undefined,
  hidden: undefined
}

export type Row_Case_Row = System.Int32
export type Row = Row_Case_Row
export type Row_Case = "Row"
export var Row_AllCases = [ "Row" ] as const
export var defaultRow_Case_Row = 0
export var defaultRow = defaultRow_Case_Row as Row

export type Col_Case_Col = System.Int32
export type Col = Col_Case_Col
export type Col_Case = "Col"
export var Col_AllCases = [ "Col" ] as const
export var defaultCol_Case_Col = 0
export var defaultCol = defaultCol_Case_Col as Col

export type GridPosition = {
  row: Row
  column: Col
}
export var defaultGridPosition: GridPosition = {
  row: defaultRow,
  column: defaultCol
}

export type GridPlacement = {
  position: GridPosition
  dimension: GridPlacementDimension
}
export var defaultGridPlacement: GridPlacement = {
  position: defaultGridPosition,
  dimension: defaultGridPlacementDimension
}

