//////////////////////////////////////
//   This file is auto generated   //
//////////////////////////////////////

import * as System from "./System"
import * as SixLabors_ImageSharp from "./SixLabors_ImageSharp"
import * as AzureFiles from "./AzureFiles"
import * as Microsoft_FSharp_Core from "./Microsoft_FSharp_Core"
import * as System_Collections_Generic from "./System_Collections_Generic"

export type GenerateBlogData = {
  tagName: System.String
}
export var defaultGenerateBlogData: GenerateBlogData = {
  tagName: ''
}

export type GetLobbyItems = {
  filterActive: System.Boolean
}
export var defaultGetLobbyItems: GetLobbyItems = {
  filterActive: false
}

export type Rational = {
  numerator: System.UInt32
  denominator: System.UInt32
}
export var defaultRational: Rational = {
  numerator: 0,
  denominator: 0
}

export type RationalArray<T> = Array<T> // fullname AzFiles.Exif+Rational[]
export var defaultRationalArray: <T>(t:T) => RationalArray<T> = <T>(t:T) => []

export type SignedRational = {
  numerator: System.Int32
  denominator: System.Int32
}
export var defaultSignedRational: SignedRational = {
  numerator: 0,
  denominator: 0
}

export type SignedRationalArray<T> = Array<T> // fullname AzFiles.Exif+SignedRational[]
export var defaultSignedRationalArray: <T>(t:T) => SignedRationalArray<T> = <T>(t:T) => []

export type ExifValue_Case_XPosition = { Case: "XPosition", Fields: Rational }
export type ExifValue_Case_YPosition = { Case: "YPosition", Fields: Rational }
export type ExifValue_Case_XResolution = { Case: "XResolution", Fields: Rational }
export type ExifValue_Case_YResolution = { Case: "YResolution", Fields: Rational }
export type ExifValue_Case_BatteryLevel = { Case: "BatteryLevel", Fields: Rational }
export type ExifValue_Case_ExposureTime = { Case: "ExposureTime", Fields: Rational }
export type ExifValue_Case_FNumber = { Case: "FNumber", Fields: Rational }
export type ExifValue_Case_MDScalePixel = { Case: "MDScalePixel", Fields: Rational }
export type ExifValue_Case_CompressedBitsPerPixel = { Case: "CompressedBitsPerPixel", Fields: Rational }
export type ExifValue_Case_ApertureValue = { Case: "ApertureValue", Fields: Rational }
export type ExifValue_Case_MaxApertureValue = { Case: "MaxApertureValue", Fields: Rational }
export type ExifValue_Case_SubjectDistance = { Case: "SubjectDistance", Fields: Rational }
export type ExifValue_Case_FocalLength = { Case: "FocalLength", Fields: Rational }
export type ExifValue_Case_FlashEnergy2 = { Case: "FlashEnergy2", Fields: Rational }
export type ExifValue_Case_FocalPlaneXResolution2 = { Case: "FocalPlaneXResolution2", Fields: Rational }
export type ExifValue_Case_FocalPlaneYResolution2 = { Case: "FocalPlaneYResolution2", Fields: Rational }
export type ExifValue_Case_ExposureIndex2 = { Case: "ExposureIndex2", Fields: Rational }
export type ExifValue_Case_Humidity = { Case: "Humidity", Fields: Rational }
export type ExifValue_Case_Pressure = { Case: "Pressure", Fields: Rational }
export type ExifValue_Case_Acceleration = { Case: "Acceleration", Fields: Rational }
export type ExifValue_Case_FlashEnergy = { Case: "FlashEnergy", Fields: Rational }
export type ExifValue_Case_FocalPlaneXResolution = { Case: "FocalPlaneXResolution", Fields: Rational }
export type ExifValue_Case_FocalPlaneYResolution = { Case: "FocalPlaneYResolution", Fields: Rational }
export type ExifValue_Case_ExposureIndex = { Case: "ExposureIndex", Fields: Rational }
export type ExifValue_Case_DigitalZoomRatio = { Case: "DigitalZoomRatio", Fields: Rational }
export type ExifValue_Case_GPSAltitude = { Case: "GPSAltitude", Fields: Rational }
export type ExifValue_Case_GPSDOP = { Case: "GPSDOP", Fields: Rational }
export type ExifValue_Case_GPSSpeed = { Case: "GPSSpeed", Fields: Rational }
export type ExifValue_Case_GPSTrack = { Case: "GPSTrack", Fields: Rational }
export type ExifValue_Case_GPSImgDirection = { Case: "GPSImgDirection", Fields: Rational }
export type ExifValue_Case_GPSDestBearing = { Case: "GPSDestBearing", Fields: Rational }
export type ExifValue_Case_GPSDestDistance = { Case: "GPSDestDistance", Fields: Rational }
export type ExifValue_Case_WhitePoint = { Case: "WhitePoint", Fields: System_Collections_Generic.IEnumerable<Rational> }
export type ExifValue_Case_PrimaryChromaticities = { Case: "PrimaryChromaticities", Fields: System_Collections_Generic.IEnumerable<Rational> }
export type ExifValue_Case_YCbCrCoefficients = { Case: "YCbCrCoefficients", Fields: System_Collections_Generic.IEnumerable<Rational> }
export type ExifValue_Case_ReferenceBlackWhite = { Case: "ReferenceBlackWhite", Fields: System_Collections_Generic.IEnumerable<Rational> }
export type ExifValue_Case_GPSLatitude = { Case: "GPSLatitude", Fields: System_Collections_Generic.IEnumerable<Rational> }
export type ExifValue_Case_GPSLongitude = { Case: "GPSLongitude", Fields: System_Collections_Generic.IEnumerable<Rational> }
export type ExifValue_Case_GPSTimestamp = { Case: "GPSTimestamp", Fields: System_Collections_Generic.IEnumerable<Rational> }
export type ExifValue_Case_GPSDestLatitude = { Case: "GPSDestLatitude", Fields: System_Collections_Generic.IEnumerable<Rational> }
export type ExifValue_Case_GPSDestLongitude = { Case: "GPSDestLongitude", Fields: System_Collections_Generic.IEnumerable<Rational> }
export type ExifValue_Case_LensSpecification = { Case: "LensSpecification", Fields: System_Collections_Generic.IEnumerable<Rational> }
export type ExifValue_Case_ImageDescription = { Case: "ImageDescription", Fields: System.String }
export type ExifValue_Case_Make = { Case: "Make", Fields: System.String }
export type ExifValue_Case_Model = { Case: "Model", Fields: System.String }
export type ExifValue_Case_Software = { Case: "Software", Fields: System.String }
export type ExifValue_Case_DateTime = { Case: "DateTime", Fields: System.String }
export type ExifValue_Case_Artist = { Case: "Artist", Fields: System.String }
export type ExifValue_Case_HostComputer = { Case: "HostComputer", Fields: System.String }
export type ExifValue_Case_Copyright = { Case: "Copyright", Fields: System.String }
export type ExifValue_Case_DocumentName = { Case: "DocumentName", Fields: System.String }
export type ExifValue_Case_PageName = { Case: "PageName", Fields: System.String }
export type ExifValue_Case_InkNames = { Case: "InkNames", Fields: System.String }
export type ExifValue_Case_TargetPrinter = { Case: "TargetPrinter", Fields: System.String }
export type ExifValue_Case_ImageID = { Case: "ImageID", Fields: System.String }
export type ExifValue_Case_MDLabName = { Case: "MDLabName", Fields: System.String }
export type ExifValue_Case_MDSampleInfo = { Case: "MDSampleInfo", Fields: System.String }
export type ExifValue_Case_MDPrepDate = { Case: "MDPrepDate", Fields: System.String }
export type ExifValue_Case_MDPrepTime = { Case: "MDPrepTime", Fields: System.String }
export type ExifValue_Case_MDFileUnits = { Case: "MDFileUnits", Fields: System.String }
export type ExifValue_Case_SEMInfo = { Case: "SEMInfo", Fields: System.String }
export type ExifValue_Case_SpectralSensitivity = { Case: "SpectralSensitivity", Fields: System.String }
export type ExifValue_Case_DateTimeOriginal = { Case: "DateTimeOriginal", Fields: System.String }
export type ExifValue_Case_DateTimeDigitized = { Case: "DateTimeDigitized", Fields: System.String }
export type ExifValue_Case_SubsecTime = { Case: "SubsecTime", Fields: System.String }
export type ExifValue_Case_SubsecTimeOriginal = { Case: "SubsecTimeOriginal", Fields: System.String }
export type ExifValue_Case_SubsecTimeDigitized = { Case: "SubsecTimeDigitized", Fields: System.String }
export type ExifValue_Case_RelatedSoundFile = { Case: "RelatedSoundFile", Fields: System.String }
export type ExifValue_Case_FaxSubaddress = { Case: "FaxSubaddress", Fields: System.String }
export type ExifValue_Case_OffsetTime = { Case: "OffsetTime", Fields: System.String }
export type ExifValue_Case_OffsetTimeOriginal = { Case: "OffsetTimeOriginal", Fields: System.String }
export type ExifValue_Case_OffsetTimeDigitized = { Case: "OffsetTimeDigitized", Fields: System.String }
export type ExifValue_Case_SecurityClassification = { Case: "SecurityClassification", Fields: System.String }
export type ExifValue_Case_ImageHistory = { Case: "ImageHistory", Fields: System.String }
export type ExifValue_Case_ImageUniqueID = { Case: "ImageUniqueID", Fields: System.String }
export type ExifValue_Case_OwnerName = { Case: "OwnerName", Fields: System.String }
export type ExifValue_Case_SerialNumber = { Case: "SerialNumber", Fields: System.String }
export type ExifValue_Case_LensMake = { Case: "LensMake", Fields: System.String }
export type ExifValue_Case_LensModel = { Case: "LensModel", Fields: System.String }
export type ExifValue_Case_LensSerialNumber = { Case: "LensSerialNumber", Fields: System.String }
export type ExifValue_Case_GDALMetadata = { Case: "GDALMetadata", Fields: System.String }
export type ExifValue_Case_GDALNoData = { Case: "GDALNoData", Fields: System.String }
export type ExifValue_Case_GPSLatitudeRef = { Case: "GPSLatitudeRef", Fields: System.String }
export type ExifValue_Case_GPSLongitudeRef = { Case: "GPSLongitudeRef", Fields: System.String }
export type ExifValue_Case_GPSSatellites = { Case: "GPSSatellites", Fields: System.String }
export type ExifValue_Case_GPSStatus = { Case: "GPSStatus", Fields: System.String }
export type ExifValue_Case_GPSMeasureMode = { Case: "GPSMeasureMode", Fields: System.String }
export type ExifValue_Case_GPSSpeedRef = { Case: "GPSSpeedRef", Fields: System.String }
export type ExifValue_Case_GPSTrackRef = { Case: "GPSTrackRef", Fields: System.String }
export type ExifValue_Case_GPSImgDirectionRef = { Case: "GPSImgDirectionRef", Fields: System.String }
export type ExifValue_Case_GPSMapDatum = { Case: "GPSMapDatum", Fields: System.String }
export type ExifValue_Case_GPSDestLatitudeRef = { Case: "GPSDestLatitudeRef", Fields: System.String }
export type ExifValue_Case_GPSDestLongitudeRef = { Case: "GPSDestLongitudeRef", Fields: System.String }
export type ExifValue_Case_GPSDestBearingRef = { Case: "GPSDestBearingRef", Fields: System.String }
export type ExifValue_Case_GPSDestDistanceRef = { Case: "GPSDestDistanceRef", Fields: System.String }
export type ExifValue_Case_GPSDateStamp = { Case: "GPSDateStamp", Fields: System.String }
export type ExifValue_Case_ImageWidth = { Case: "ImageWidth", Fields: SixLabors_ImageSharp.Number }
export type ExifValue_Case_ImageLength = { Case: "ImageLength", Fields: SixLabors_ImageSharp.Number }
export type ExifValue_Case_RowsPerStrip = { Case: "RowsPerStrip", Fields: SixLabors_ImageSharp.Number }
export type ExifValue_Case_TileWidth = { Case: "TileWidth", Fields: SixLabors_ImageSharp.Number }
export type ExifValue_Case_TileLength = { Case: "TileLength", Fields: SixLabors_ImageSharp.Number }
export type ExifValue_Case_BadFaxLines = { Case: "BadFaxLines", Fields: SixLabors_ImageSharp.Number }
export type ExifValue_Case_ConsecutiveBadFaxLines = { Case: "ConsecutiveBadFaxLines", Fields: SixLabors_ImageSharp.Number }
export type ExifValue_Case_PixelXDimension = { Case: "PixelXDimension", Fields: SixLabors_ImageSharp.Number }
export type ExifValue_Case_PixelYDimension = { Case: "PixelYDimension", Fields: SixLabors_ImageSharp.Number }
export type ExifValue_Case_OldSubfileType = { Case: "OldSubfileType", Fields: System.UInt16 }
export type ExifValue_Case_Compression = { Case: "Compression", Fields: System.UInt16 }
export type ExifValue_Case_PhotometricInterpretation = { Case: "PhotometricInterpretation", Fields: System.UInt16 }
export type ExifValue_Case_Thresholding = { Case: "Thresholding", Fields: System.UInt16 }
export type ExifValue_Case_CellWidth = { Case: "CellWidth", Fields: System.UInt16 }
export type ExifValue_Case_CellLength = { Case: "CellLength", Fields: System.UInt16 }
export type ExifValue_Case_FillOrder = { Case: "FillOrder", Fields: System.UInt16 }
export type ExifValue_Case_Orientation = { Case: "Orientation", Fields: System.UInt16 }
export type ExifValue_Case_SamplesPerPixel = { Case: "SamplesPerPixel", Fields: System.UInt16 }
export type ExifValue_Case_PlanarConfiguration = { Case: "PlanarConfiguration", Fields: System.UInt16 }
export type ExifValue_Case_Predictor = { Case: "Predictor", Fields: System.UInt16 }
export type ExifValue_Case_GrayResponseUnit = { Case: "GrayResponseUnit", Fields: System.UInt16 }
export type ExifValue_Case_ResolutionUnit = { Case: "ResolutionUnit", Fields: System.UInt16 }
export type ExifValue_Case_CleanFaxData = { Case: "CleanFaxData", Fields: System.UInt16 }
export type ExifValue_Case_InkSet = { Case: "InkSet", Fields: System.UInt16 }
export type ExifValue_Case_NumberOfInks = { Case: "NumberOfInks", Fields: System.UInt16 }
export type ExifValue_Case_DotRange = { Case: "DotRange", Fields: System.UInt16 }
export type ExifValue_Case_Indexed = { Case: "Indexed", Fields: System.UInt16 }
export type ExifValue_Case_OPIProxy = { Case: "OPIProxy", Fields: System.UInt16 }
export type ExifValue_Case_JPEGProc = { Case: "JPEGProc", Fields: System.UInt16 }
export type ExifValue_Case_JPEGRestartInterval = { Case: "JPEGRestartInterval", Fields: System.UInt16 }
export type ExifValue_Case_YCbCrPositioning = { Case: "YCbCrPositioning", Fields: System.UInt16 }
export type ExifValue_Case_Rating = { Case: "Rating", Fields: System.UInt16 }
export type ExifValue_Case_RatingPercent = { Case: "RatingPercent", Fields: System.UInt16 }
export type ExifValue_Case_ExposureProgram = { Case: "ExposureProgram", Fields: System.UInt16 }
export type ExifValue_Case_Interlace = { Case: "Interlace", Fields: System.UInt16 }
export type ExifValue_Case_SelfTimerMode = { Case: "SelfTimerMode", Fields: System.UInt16 }
export type ExifValue_Case_SensitivityType = { Case: "SensitivityType", Fields: System.UInt16 }
export type ExifValue_Case_MeteringMode = { Case: "MeteringMode", Fields: System.UInt16 }
export type ExifValue_Case_LightSource = { Case: "LightSource", Fields: System.UInt16 }
export type ExifValue_Case_FocalPlaneResolutionUnit2 = { Case: "FocalPlaneResolutionUnit2", Fields: System.UInt16 }
export type ExifValue_Case_SensingMethod2 = { Case: "SensingMethod2", Fields: System.UInt16 }
export type ExifValue_Case_Flash = { Case: "Flash", Fields: System.UInt16 }
export type ExifValue_Case_ColorSpace = { Case: "ColorSpace", Fields: System.UInt16 }
export type ExifValue_Case_FocalPlaneResolutionUnit = { Case: "FocalPlaneResolutionUnit", Fields: System.UInt16 }
export type ExifValue_Case_SensingMethod = { Case: "SensingMethod", Fields: System.UInt16 }
export type ExifValue_Case_CustomRendered = { Case: "CustomRendered", Fields: System.UInt16 }
export type ExifValue_Case_ExposureMode = { Case: "ExposureMode", Fields: System.UInt16 }
export type ExifValue_Case_WhiteBalance = { Case: "WhiteBalance", Fields: System.UInt16 }
export type ExifValue_Case_FocalLengthIn35mmFilm = { Case: "FocalLengthIn35mmFilm", Fields: System.UInt16 }
export type ExifValue_Case_SceneCaptureType = { Case: "SceneCaptureType", Fields: System.UInt16 }
export type ExifValue_Case_GainControl = { Case: "GainControl", Fields: System.UInt16 }
export type ExifValue_Case_Contrast = { Case: "Contrast", Fields: System.UInt16 }
export type ExifValue_Case_Saturation = { Case: "Saturation", Fields: System.UInt16 }
export type ExifValue_Case_Sharpness = { Case: "Sharpness", Fields: System.UInt16 }
export type ExifValue_Case_SubjectDistanceRange = { Case: "SubjectDistanceRange", Fields: System.UInt16 }
export type ExifValue_Case_GPSDifferential = { Case: "GPSDifferential", Fields: System.UInt16 }
export type ExifValue_Case_FileSource = { Case: "FileSource", Fields: System.Byte }
export type ExifValue_Case_SceneType = { Case: "SceneType", Fields: System.Byte }
export type ExifValue_Case_FaxProfile = { Case: "FaxProfile", Fields: System.Byte }
export type ExifValue_Case_ModeNumber = { Case: "ModeNumber", Fields: System.Byte }
export type ExifValue_Case_GPSAltitudeRef = { Case: "GPSAltitudeRef", Fields: System.Byte }
export type ExifValue_Case_SubfileType = { Case: "SubfileType", Fields: System.UInt32 }
export type ExifValue_Case_SubIFDOffset = { Case: "SubIFDOffset", Fields: System.UInt32 }
export type ExifValue_Case_GPSIFDOffset = { Case: "GPSIFDOffset", Fields: System.UInt32 }
export type ExifValue_Case_T4Options = { Case: "T4Options", Fields: System.UInt32 }
export type ExifValue_Case_T6Options = { Case: "T6Options", Fields: System.UInt32 }
export type ExifValue_Case_XClipPathUnits = { Case: "XClipPathUnits", Fields: System.UInt32 }
export type ExifValue_Case_YClipPathUnits = { Case: "YClipPathUnits", Fields: System.UInt32 }
export type ExifValue_Case_ProfileType = { Case: "ProfileType", Fields: System.UInt32 }
export type ExifValue_Case_CodingMethods = { Case: "CodingMethods", Fields: System.UInt32 }
export type ExifValue_Case_T82ptions = { Case: "T82ptions", Fields: System.UInt32 }
export type ExifValue_Case_JPEGInterchangeFormat = { Case: "JPEGInterchangeFormat", Fields: System.UInt32 }
export type ExifValue_Case_JPEGInterchangeFormatLength = { Case: "JPEGInterchangeFormatLength", Fields: System.UInt32 }
export type ExifValue_Case_MDFileTag = { Case: "MDFileTag", Fields: System.UInt32 }
export type ExifValue_Case_StandardOutputSensitivity = { Case: "StandardOutputSensitivity", Fields: System.UInt32 }
export type ExifValue_Case_RecommendedExposureIndex = { Case: "RecommendedExposureIndex", Fields: System.UInt32 }
export type ExifValue_Case_ISOSpeed = { Case: "ISOSpeed", Fields: System.UInt32 }
export type ExifValue_Case_ISOSpeedLatitudeyyy = { Case: "ISOSpeedLatitudeyyy", Fields: System.UInt32 }
export type ExifValue_Case_ISOSpeedLatitudezzz = { Case: "ISOSpeedLatitudezzz", Fields: System.UInt32 }
export type ExifValue_Case_FaxRecvParams = { Case: "FaxRecvParams", Fields: System.UInt32 }
export type ExifValue_Case_FaxRecvTime = { Case: "FaxRecvTime", Fields: System.UInt32 }
export type ExifValue_Case_ImageNumber = { Case: "ImageNumber", Fields: System.UInt32 }
export type ExifValue_Case_Decode = { Case: "Decode", Fields: System_Collections_Generic.IEnumerable<SignedRational> }
export type ExifValue_Case_JPEGTables = { Case: "JPEGTables", Fields: System_Collections_Generic.IEnumerable<System.Byte> }
export type ExifValue_Case_OECF = { Case: "OECF", Fields: System_Collections_Generic.IEnumerable<System.Byte> }
export type ExifValue_Case_ExifVersion = { Case: "ExifVersion", Fields: System_Collections_Generic.IEnumerable<System.Byte> }
export type ExifValue_Case_ComponentsConfiguration = { Case: "ComponentsConfiguration", Fields: System_Collections_Generic.IEnumerable<System.Byte> }
export type ExifValue_Case_MakerNote = { Case: "MakerNote", Fields: System_Collections_Generic.IEnumerable<System.Byte> }
export type ExifValue_Case_FlashpixVersion = { Case: "FlashpixVersion", Fields: System_Collections_Generic.IEnumerable<System.Byte> }
export type ExifValue_Case_SpatialFrequencyResponse = { Case: "SpatialFrequencyResponse", Fields: System_Collections_Generic.IEnumerable<System.Byte> }
export type ExifValue_Case_SpatialFrequencyResponse2 = { Case: "SpatialFrequencyResponse2", Fields: System_Collections_Generic.IEnumerable<System.Byte> }
export type ExifValue_Case_Noise = { Case: "Noise", Fields: System_Collections_Generic.IEnumerable<System.Byte> }
export type ExifValue_Case_CFAPattern = { Case: "CFAPattern", Fields: System_Collections_Generic.IEnumerable<System.Byte> }
export type ExifValue_Case_DeviceSettingDescription = { Case: "DeviceSettingDescription", Fields: System_Collections_Generic.IEnumerable<System.Byte> }
export type ExifValue_Case_ImageSourceData = { Case: "ImageSourceData", Fields: System_Collections_Generic.IEnumerable<System.Byte> }
export type ExifValue_Case_BitsPerSample = { Case: "BitsPerSample", Fields: System_Collections_Generic.IEnumerable<System.UInt16> }
export type ExifValue_Case_MinSampleValue = { Case: "MinSampleValue", Fields: System_Collections_Generic.IEnumerable<System.UInt16> }
export type ExifValue_Case_MaxSampleValue = { Case: "MaxSampleValue", Fields: System_Collections_Generic.IEnumerable<System.UInt16> }
export type ExifValue_Case_GrayResponseCurve = { Case: "GrayResponseCurve", Fields: System_Collections_Generic.IEnumerable<System.UInt16> }
export type ExifValue_Case_ColorMap = { Case: "ColorMap", Fields: System_Collections_Generic.IEnumerable<System.UInt16> }
export type ExifValue_Case_ExtraSamples = { Case: "ExtraSamples", Fields: System_Collections_Generic.IEnumerable<System.UInt16> }
export type ExifValue_Case_PageNumber = { Case: "PageNumber", Fields: System_Collections_Generic.IEnumerable<System.UInt16> }
export type ExifValue_Case_TransferFunction = { Case: "TransferFunction", Fields: System_Collections_Generic.IEnumerable<System.UInt16> }
export type ExifValue_Case_HalftoneHints = { Case: "HalftoneHints", Fields: System_Collections_Generic.IEnumerable<System.UInt16> }
export type ExifValue_Case_SampleFormat = { Case: "SampleFormat", Fields: System_Collections_Generic.IEnumerable<System.UInt16> }
export type ExifValue_Case_TransferRange = { Case: "TransferRange", Fields: System_Collections_Generic.IEnumerable<System.UInt16> }
export type ExifValue_Case_DefaultImageColor = { Case: "DefaultImageColor", Fields: System_Collections_Generic.IEnumerable<System.UInt16> }
export type ExifValue_Case_JPEGLosslessPredictors = { Case: "JPEGLosslessPredictors", Fields: System_Collections_Generic.IEnumerable<System.UInt16> }
export type ExifValue_Case_JPEGPointTransforms = { Case: "JPEGPointTransforms", Fields: System_Collections_Generic.IEnumerable<System.UInt16> }
export type ExifValue_Case_YCbCrSubsampling = { Case: "YCbCrSubsampling", Fields: System_Collections_Generic.IEnumerable<System.UInt16> }
export type ExifValue_Case_CFARepeatPatternDim = { Case: "CFARepeatPatternDim", Fields: System_Collections_Generic.IEnumerable<System.UInt16> }
export type ExifValue_Case_IntergraphPacketData = { Case: "IntergraphPacketData", Fields: System_Collections_Generic.IEnumerable<System.UInt16> }
export type ExifValue_Case_ISOSpeedRatings = { Case: "ISOSpeedRatings", Fields: System_Collections_Generic.IEnumerable<System.UInt16> }
export type ExifValue_Case_SubjectArea = { Case: "SubjectArea", Fields: System_Collections_Generic.IEnumerable<System.UInt16> }
export type ExifValue_Case_SubjectLocation = { Case: "SubjectLocation", Fields: System_Collections_Generic.IEnumerable<System.UInt16> }
export type ExifValue_Case_StripOffsets = { Case: "StripOffsets", Fields: System_Collections_Generic.IEnumerable<SixLabors_ImageSharp.Number> }
export type ExifValue_Case_StripByteCounts = { Case: "StripByteCounts", Fields: System_Collections_Generic.IEnumerable<SixLabors_ImageSharp.Number> }
export type ExifValue_Case_TileByteCounts = { Case: "TileByteCounts", Fields: System_Collections_Generic.IEnumerable<SixLabors_ImageSharp.Number> }
export type ExifValue_Case_ImageLayer = { Case: "ImageLayer", Fields: System_Collections_Generic.IEnumerable<SixLabors_ImageSharp.Number> }
export type ExifValue_Case_FreeOffsets = { Case: "FreeOffsets", Fields: System_Collections_Generic.IEnumerable<System.UInt32> }
export type ExifValue_Case_FreeByteCounts = { Case: "FreeByteCounts", Fields: System_Collections_Generic.IEnumerable<System.UInt32> }
export type ExifValue_Case_ColorResponseUnit = { Case: "ColorResponseUnit", Fields: System_Collections_Generic.IEnumerable<System.UInt32> }
export type ExifValue_Case_TileOffsets = { Case: "TileOffsets", Fields: System_Collections_Generic.IEnumerable<System.UInt32> }
export type ExifValue_Case_SMinSampleValue = { Case: "SMinSampleValue", Fields: System_Collections_Generic.IEnumerable<System.UInt32> }
export type ExifValue_Case_SMaxSampleValue = { Case: "SMaxSampleValue", Fields: System_Collections_Generic.IEnumerable<System.UInt32> }
export type ExifValue_Case_JPEGQTables = { Case: "JPEGQTables", Fields: System_Collections_Generic.IEnumerable<System.UInt32> }
export type ExifValue_Case_JPEGDCTables = { Case: "JPEGDCTables", Fields: System_Collections_Generic.IEnumerable<System.UInt32> }
export type ExifValue_Case_JPEGACTables = { Case: "JPEGACTables", Fields: System_Collections_Generic.IEnumerable<System.UInt32> }
export type ExifValue_Case_StripRowCounts = { Case: "StripRowCounts", Fields: System_Collections_Generic.IEnumerable<System.UInt32> }
export type ExifValue_Case_IntergraphRegisters = { Case: "IntergraphRegisters", Fields: System_Collections_Generic.IEnumerable<System.UInt32> }
export type ExifValue_Case_TimeZoneOffset = { Case: "TimeZoneOffset", Fields: System_Collections_Generic.IEnumerable<System.UInt32> }
export type ExifValue_Case_SubIFDs = { Case: "SubIFDs", Fields: System_Collections_Generic.IEnumerable<System.UInt32> }
export type ExifValue = ExifValue_Case_XPosition | ExifValue_Case_YPosition | ExifValue_Case_XResolution | ExifValue_Case_YResolution | ExifValue_Case_BatteryLevel | ExifValue_Case_ExposureTime | ExifValue_Case_FNumber | ExifValue_Case_MDScalePixel | ExifValue_Case_CompressedBitsPerPixel | ExifValue_Case_ApertureValue | ExifValue_Case_MaxApertureValue | ExifValue_Case_SubjectDistance | ExifValue_Case_FocalLength | ExifValue_Case_FlashEnergy2 | ExifValue_Case_FocalPlaneXResolution2 | ExifValue_Case_FocalPlaneYResolution2 | ExifValue_Case_ExposureIndex2 | ExifValue_Case_Humidity | ExifValue_Case_Pressure | ExifValue_Case_Acceleration | ExifValue_Case_FlashEnergy | ExifValue_Case_FocalPlaneXResolution | ExifValue_Case_FocalPlaneYResolution | ExifValue_Case_ExposureIndex | ExifValue_Case_DigitalZoomRatio | ExifValue_Case_GPSAltitude | ExifValue_Case_GPSDOP | ExifValue_Case_GPSSpeed | ExifValue_Case_GPSTrack | ExifValue_Case_GPSImgDirection | ExifValue_Case_GPSDestBearing | ExifValue_Case_GPSDestDistance | ExifValue_Case_WhitePoint | ExifValue_Case_PrimaryChromaticities | ExifValue_Case_YCbCrCoefficients | ExifValue_Case_ReferenceBlackWhite | ExifValue_Case_GPSLatitude | ExifValue_Case_GPSLongitude | ExifValue_Case_GPSTimestamp | ExifValue_Case_GPSDestLatitude | ExifValue_Case_GPSDestLongitude | ExifValue_Case_LensSpecification | ExifValue_Case_ImageDescription | ExifValue_Case_Make | ExifValue_Case_Model | ExifValue_Case_Software | ExifValue_Case_DateTime | ExifValue_Case_Artist | ExifValue_Case_HostComputer | ExifValue_Case_Copyright | ExifValue_Case_DocumentName | ExifValue_Case_PageName | ExifValue_Case_InkNames | ExifValue_Case_TargetPrinter | ExifValue_Case_ImageID | ExifValue_Case_MDLabName | ExifValue_Case_MDSampleInfo | ExifValue_Case_MDPrepDate | ExifValue_Case_MDPrepTime | ExifValue_Case_MDFileUnits | ExifValue_Case_SEMInfo | ExifValue_Case_SpectralSensitivity | ExifValue_Case_DateTimeOriginal | ExifValue_Case_DateTimeDigitized | ExifValue_Case_SubsecTime | ExifValue_Case_SubsecTimeOriginal | ExifValue_Case_SubsecTimeDigitized | ExifValue_Case_RelatedSoundFile | ExifValue_Case_FaxSubaddress | ExifValue_Case_OffsetTime | ExifValue_Case_OffsetTimeOriginal | ExifValue_Case_OffsetTimeDigitized | ExifValue_Case_SecurityClassification | ExifValue_Case_ImageHistory | ExifValue_Case_ImageUniqueID | ExifValue_Case_OwnerName | ExifValue_Case_SerialNumber | ExifValue_Case_LensMake | ExifValue_Case_LensModel | ExifValue_Case_LensSerialNumber | ExifValue_Case_GDALMetadata | ExifValue_Case_GDALNoData | ExifValue_Case_GPSLatitudeRef | ExifValue_Case_GPSLongitudeRef | ExifValue_Case_GPSSatellites | ExifValue_Case_GPSStatus | ExifValue_Case_GPSMeasureMode | ExifValue_Case_GPSSpeedRef | ExifValue_Case_GPSTrackRef | ExifValue_Case_GPSImgDirectionRef | ExifValue_Case_GPSMapDatum | ExifValue_Case_GPSDestLatitudeRef | ExifValue_Case_GPSDestLongitudeRef | ExifValue_Case_GPSDestBearingRef | ExifValue_Case_GPSDestDistanceRef | ExifValue_Case_GPSDateStamp | ExifValue_Case_ImageWidth | ExifValue_Case_ImageLength | ExifValue_Case_RowsPerStrip | ExifValue_Case_TileWidth | ExifValue_Case_TileLength | ExifValue_Case_BadFaxLines | ExifValue_Case_ConsecutiveBadFaxLines | ExifValue_Case_PixelXDimension | ExifValue_Case_PixelYDimension | ExifValue_Case_OldSubfileType | ExifValue_Case_Compression | ExifValue_Case_PhotometricInterpretation | ExifValue_Case_Thresholding | ExifValue_Case_CellWidth | ExifValue_Case_CellLength | ExifValue_Case_FillOrder | ExifValue_Case_Orientation | ExifValue_Case_SamplesPerPixel | ExifValue_Case_PlanarConfiguration | ExifValue_Case_Predictor | ExifValue_Case_GrayResponseUnit | ExifValue_Case_ResolutionUnit | ExifValue_Case_CleanFaxData | ExifValue_Case_InkSet | ExifValue_Case_NumberOfInks | ExifValue_Case_DotRange | ExifValue_Case_Indexed | ExifValue_Case_OPIProxy | ExifValue_Case_JPEGProc | ExifValue_Case_JPEGRestartInterval | ExifValue_Case_YCbCrPositioning | ExifValue_Case_Rating | ExifValue_Case_RatingPercent | ExifValue_Case_ExposureProgram | ExifValue_Case_Interlace | ExifValue_Case_SelfTimerMode | ExifValue_Case_SensitivityType | ExifValue_Case_MeteringMode | ExifValue_Case_LightSource | ExifValue_Case_FocalPlaneResolutionUnit2 | ExifValue_Case_SensingMethod2 | ExifValue_Case_Flash | ExifValue_Case_ColorSpace | ExifValue_Case_FocalPlaneResolutionUnit | ExifValue_Case_SensingMethod | ExifValue_Case_CustomRendered | ExifValue_Case_ExposureMode | ExifValue_Case_WhiteBalance | ExifValue_Case_FocalLengthIn35mmFilm | ExifValue_Case_SceneCaptureType | ExifValue_Case_GainControl | ExifValue_Case_Contrast | ExifValue_Case_Saturation | ExifValue_Case_Sharpness | ExifValue_Case_SubjectDistanceRange | ExifValue_Case_GPSDifferential | ExifValue_Case_FileSource | ExifValue_Case_SceneType | ExifValue_Case_FaxProfile | ExifValue_Case_ModeNumber | ExifValue_Case_GPSAltitudeRef | ExifValue_Case_SubfileType | ExifValue_Case_SubIFDOffset | ExifValue_Case_GPSIFDOffset | ExifValue_Case_T4Options | ExifValue_Case_T6Options | ExifValue_Case_XClipPathUnits | ExifValue_Case_YClipPathUnits | ExifValue_Case_ProfileType | ExifValue_Case_CodingMethods | ExifValue_Case_T82ptions | ExifValue_Case_JPEGInterchangeFormat | ExifValue_Case_JPEGInterchangeFormatLength | ExifValue_Case_MDFileTag | ExifValue_Case_StandardOutputSensitivity | ExifValue_Case_RecommendedExposureIndex | ExifValue_Case_ISOSpeed | ExifValue_Case_ISOSpeedLatitudeyyy | ExifValue_Case_ISOSpeedLatitudezzz | ExifValue_Case_FaxRecvParams | ExifValue_Case_FaxRecvTime | ExifValue_Case_ImageNumber | ExifValue_Case_Decode | ExifValue_Case_JPEGTables | ExifValue_Case_OECF | ExifValue_Case_ExifVersion | ExifValue_Case_ComponentsConfiguration | ExifValue_Case_MakerNote | ExifValue_Case_FlashpixVersion | ExifValue_Case_SpatialFrequencyResponse | ExifValue_Case_SpatialFrequencyResponse2 | ExifValue_Case_Noise | ExifValue_Case_CFAPattern | ExifValue_Case_DeviceSettingDescription | ExifValue_Case_ImageSourceData | ExifValue_Case_BitsPerSample | ExifValue_Case_MinSampleValue | ExifValue_Case_MaxSampleValue | ExifValue_Case_GrayResponseCurve | ExifValue_Case_ColorMap | ExifValue_Case_ExtraSamples | ExifValue_Case_PageNumber | ExifValue_Case_TransferFunction | ExifValue_Case_HalftoneHints | ExifValue_Case_SampleFormat | ExifValue_Case_TransferRange | ExifValue_Case_DefaultImageColor | ExifValue_Case_JPEGLosslessPredictors | ExifValue_Case_JPEGPointTransforms | ExifValue_Case_YCbCrSubsampling | ExifValue_Case_CFARepeatPatternDim | ExifValue_Case_IntergraphPacketData | ExifValue_Case_ISOSpeedRatings | ExifValue_Case_SubjectArea | ExifValue_Case_SubjectLocation | ExifValue_Case_StripOffsets | ExifValue_Case_StripByteCounts | ExifValue_Case_TileByteCounts | ExifValue_Case_ImageLayer | ExifValue_Case_FreeOffsets | ExifValue_Case_FreeByteCounts | ExifValue_Case_ColorResponseUnit | ExifValue_Case_TileOffsets | ExifValue_Case_SMinSampleValue | ExifValue_Case_SMaxSampleValue | ExifValue_Case_JPEGQTables | ExifValue_Case_JPEGDCTables | ExifValue_Case_JPEGACTables | ExifValue_Case_StripRowCounts | ExifValue_Case_IntergraphRegisters | ExifValue_Case_TimeZoneOffset | ExifValue_Case_SubIFDs
export type ExifValue_Case = "XPosition" | "YPosition" | "XResolution" | "YResolution" | "BatteryLevel" | "ExposureTime" | "FNumber" | "MDScalePixel" | "CompressedBitsPerPixel" | "ApertureValue" | "MaxApertureValue" | "SubjectDistance" | "FocalLength" | "FlashEnergy2" | "FocalPlaneXResolution2" | "FocalPlaneYResolution2" | "ExposureIndex2" | "Humidity" | "Pressure" | "Acceleration" | "FlashEnergy" | "FocalPlaneXResolution" | "FocalPlaneYResolution" | "ExposureIndex" | "DigitalZoomRatio" | "GPSAltitude" | "GPSDOP" | "GPSSpeed" | "GPSTrack" | "GPSImgDirection" | "GPSDestBearing" | "GPSDestDistance" | "WhitePoint" | "PrimaryChromaticities" | "YCbCrCoefficients" | "ReferenceBlackWhite" | "GPSLatitude" | "GPSLongitude" | "GPSTimestamp" | "GPSDestLatitude" | "GPSDestLongitude" | "LensSpecification" | "ImageDescription" | "Make" | "Model" | "Software" | "DateTime" | "Artist" | "HostComputer" | "Copyright" | "DocumentName" | "PageName" | "InkNames" | "TargetPrinter" | "ImageID" | "MDLabName" | "MDSampleInfo" | "MDPrepDate" | "MDPrepTime" | "MDFileUnits" | "SEMInfo" | "SpectralSensitivity" | "DateTimeOriginal" | "DateTimeDigitized" | "SubsecTime" | "SubsecTimeOriginal" | "SubsecTimeDigitized" | "RelatedSoundFile" | "FaxSubaddress" | "OffsetTime" | "OffsetTimeOriginal" | "OffsetTimeDigitized" | "SecurityClassification" | "ImageHistory" | "ImageUniqueID" | "OwnerName" | "SerialNumber" | "LensMake" | "LensModel" | "LensSerialNumber" | "GDALMetadata" | "GDALNoData" | "GPSLatitudeRef" | "GPSLongitudeRef" | "GPSSatellites" | "GPSStatus" | "GPSMeasureMode" | "GPSSpeedRef" | "GPSTrackRef" | "GPSImgDirectionRef" | "GPSMapDatum" | "GPSDestLatitudeRef" | "GPSDestLongitudeRef" | "GPSDestBearingRef" | "GPSDestDistanceRef" | "GPSDateStamp" | "ImageWidth" | "ImageLength" | "RowsPerStrip" | "TileWidth" | "TileLength" | "BadFaxLines" | "ConsecutiveBadFaxLines" | "PixelXDimension" | "PixelYDimension" | "OldSubfileType" | "Compression" | "PhotometricInterpretation" | "Thresholding" | "CellWidth" | "CellLength" | "FillOrder" | "Orientation" | "SamplesPerPixel" | "PlanarConfiguration" | "Predictor" | "GrayResponseUnit" | "ResolutionUnit" | "CleanFaxData" | "InkSet" | "NumberOfInks" | "DotRange" | "Indexed" | "OPIProxy" | "JPEGProc" | "JPEGRestartInterval" | "YCbCrPositioning" | "Rating" | "RatingPercent" | "ExposureProgram" | "Interlace" | "SelfTimerMode" | "SensitivityType" | "MeteringMode" | "LightSource" | "FocalPlaneResolutionUnit2" | "SensingMethod2" | "Flash" | "ColorSpace" | "FocalPlaneResolutionUnit" | "SensingMethod" | "CustomRendered" | "ExposureMode" | "WhiteBalance" | "FocalLengthIn35mmFilm" | "SceneCaptureType" | "GainControl" | "Contrast" | "Saturation" | "Sharpness" | "SubjectDistanceRange" | "GPSDifferential" | "FileSource" | "SceneType" | "FaxProfile" | "ModeNumber" | "GPSAltitudeRef" | "SubfileType" | "SubIFDOffset" | "GPSIFDOffset" | "T4Options" | "T6Options" | "XClipPathUnits" | "YClipPathUnits" | "ProfileType" | "CodingMethods" | "T82ptions" | "JPEGInterchangeFormat" | "JPEGInterchangeFormatLength" | "MDFileTag" | "StandardOutputSensitivity" | "RecommendedExposureIndex" | "ISOSpeed" | "ISOSpeedLatitudeyyy" | "ISOSpeedLatitudezzz" | "FaxRecvParams" | "FaxRecvTime" | "ImageNumber" | "Decode" | "JPEGTables" | "OECF" | "ExifVersion" | "ComponentsConfiguration" | "MakerNote" | "FlashpixVersion" | "SpatialFrequencyResponse" | "SpatialFrequencyResponse2" | "Noise" | "CFAPattern" | "DeviceSettingDescription" | "ImageSourceData" | "BitsPerSample" | "MinSampleValue" | "MaxSampleValue" | "GrayResponseCurve" | "ColorMap" | "ExtraSamples" | "PageNumber" | "TransferFunction" | "HalftoneHints" | "SampleFormat" | "TransferRange" | "DefaultImageColor" | "JPEGLosslessPredictors" | "JPEGPointTransforms" | "YCbCrSubsampling" | "CFARepeatPatternDim" | "IntergraphPacketData" | "ISOSpeedRatings" | "SubjectArea" | "SubjectLocation" | "StripOffsets" | "StripByteCounts" | "TileByteCounts" | "ImageLayer" | "FreeOffsets" | "FreeByteCounts" | "ColorResponseUnit" | "TileOffsets" | "SMinSampleValue" | "SMaxSampleValue" | "JPEGQTables" | "JPEGDCTables" | "JPEGACTables" | "StripRowCounts" | "IntergraphRegisters" | "TimeZoneOffset" | "SubIFDs"
export var ExifValue_AllCases = [ "XPosition", "YPosition", "XResolution", "YResolution", "BatteryLevel", "ExposureTime", "FNumber", "MDScalePixel", "CompressedBitsPerPixel", "ApertureValue", "MaxApertureValue", "SubjectDistance", "FocalLength", "FlashEnergy2", "FocalPlaneXResolution2", "FocalPlaneYResolution2", "ExposureIndex2", "Humidity", "Pressure", "Acceleration", "FlashEnergy", "FocalPlaneXResolution", "FocalPlaneYResolution", "ExposureIndex", "DigitalZoomRatio", "GPSAltitude", "GPSDOP", "GPSSpeed", "GPSTrack", "GPSImgDirection", "GPSDestBearing", "GPSDestDistance", "WhitePoint", "PrimaryChromaticities", "YCbCrCoefficients", "ReferenceBlackWhite", "GPSLatitude", "GPSLongitude", "GPSTimestamp", "GPSDestLatitude", "GPSDestLongitude", "LensSpecification", "ImageDescription", "Make", "Model", "Software", "DateTime", "Artist", "HostComputer", "Copyright", "DocumentName", "PageName", "InkNames", "TargetPrinter", "ImageID", "MDLabName", "MDSampleInfo", "MDPrepDate", "MDPrepTime", "MDFileUnits", "SEMInfo", "SpectralSensitivity", "DateTimeOriginal", "DateTimeDigitized", "SubsecTime", "SubsecTimeOriginal", "SubsecTimeDigitized", "RelatedSoundFile", "FaxSubaddress", "OffsetTime", "OffsetTimeOriginal", "OffsetTimeDigitized", "SecurityClassification", "ImageHistory", "ImageUniqueID", "OwnerName", "SerialNumber", "LensMake", "LensModel", "LensSerialNumber", "GDALMetadata", "GDALNoData", "GPSLatitudeRef", "GPSLongitudeRef", "GPSSatellites", "GPSStatus", "GPSMeasureMode", "GPSSpeedRef", "GPSTrackRef", "GPSImgDirectionRef", "GPSMapDatum", "GPSDestLatitudeRef", "GPSDestLongitudeRef", "GPSDestBearingRef", "GPSDestDistanceRef", "GPSDateStamp", "ImageWidth", "ImageLength", "RowsPerStrip", "TileWidth", "TileLength", "BadFaxLines", "ConsecutiveBadFaxLines", "PixelXDimension", "PixelYDimension", "OldSubfileType", "Compression", "PhotometricInterpretation", "Thresholding", "CellWidth", "CellLength", "FillOrder", "Orientation", "SamplesPerPixel", "PlanarConfiguration", "Predictor", "GrayResponseUnit", "ResolutionUnit", "CleanFaxData", "InkSet", "NumberOfInks", "DotRange", "Indexed", "OPIProxy", "JPEGProc", "JPEGRestartInterval", "YCbCrPositioning", "Rating", "RatingPercent", "ExposureProgram", "Interlace", "SelfTimerMode", "SensitivityType", "MeteringMode", "LightSource", "FocalPlaneResolutionUnit2", "SensingMethod2", "Flash", "ColorSpace", "FocalPlaneResolutionUnit", "SensingMethod", "CustomRendered", "ExposureMode", "WhiteBalance", "FocalLengthIn35mmFilm", "SceneCaptureType", "GainControl", "Contrast", "Saturation", "Sharpness", "SubjectDistanceRange", "GPSDifferential", "FileSource", "SceneType", "FaxProfile", "ModeNumber", "GPSAltitudeRef", "SubfileType", "SubIFDOffset", "GPSIFDOffset", "T4Options", "T6Options", "XClipPathUnits", "YClipPathUnits", "ProfileType", "CodingMethods", "T82ptions", "JPEGInterchangeFormat", "JPEGInterchangeFormatLength", "MDFileTag", "StandardOutputSensitivity", "RecommendedExposureIndex", "ISOSpeed", "ISOSpeedLatitudeyyy", "ISOSpeedLatitudezzz", "FaxRecvParams", "FaxRecvTime", "ImageNumber", "Decode", "JPEGTables", "OECF", "ExifVersion", "ComponentsConfiguration", "MakerNote", "FlashpixVersion", "SpatialFrequencyResponse", "SpatialFrequencyResponse2", "Noise", "CFAPattern", "DeviceSettingDescription", "ImageSourceData", "BitsPerSample", "MinSampleValue", "MaxSampleValue", "GrayResponseCurve", "ColorMap", "ExtraSamples", "PageNumber", "TransferFunction", "HalftoneHints", "SampleFormat", "TransferRange", "DefaultImageColor", "JPEGLosslessPredictors", "JPEGPointTransforms", "YCbCrSubsampling", "CFARepeatPatternDim", "IntergraphPacketData", "ISOSpeedRatings", "SubjectArea", "SubjectLocation", "StripOffsets", "StripByteCounts", "TileByteCounts", "ImageLayer", "FreeOffsets", "FreeByteCounts", "ColorResponseUnit", "TileOffsets", "SMinSampleValue", "SMaxSampleValue", "JPEGQTables", "JPEGDCTables", "JPEGACTables", "StripRowCounts", "IntergraphRegisters", "TimeZoneOffset", "SubIFDs" ] as const
export var defaultExifValue_Case_XPosition = { Case: "XPosition", Fields: defaultRational }
export var defaultExifValue_Case_YPosition = { Case: "YPosition", Fields: defaultRational }
export var defaultExifValue_Case_XResolution = { Case: "XResolution", Fields: defaultRational }
export var defaultExifValue_Case_YResolution = { Case: "YResolution", Fields: defaultRational }
export var defaultExifValue_Case_BatteryLevel = { Case: "BatteryLevel", Fields: defaultRational }
export var defaultExifValue_Case_ExposureTime = { Case: "ExposureTime", Fields: defaultRational }
export var defaultExifValue_Case_FNumber = { Case: "FNumber", Fields: defaultRational }
export var defaultExifValue_Case_MDScalePixel = { Case: "MDScalePixel", Fields: defaultRational }
export var defaultExifValue_Case_CompressedBitsPerPixel = { Case: "CompressedBitsPerPixel", Fields: defaultRational }
export var defaultExifValue_Case_ApertureValue = { Case: "ApertureValue", Fields: defaultRational }
export var defaultExifValue_Case_MaxApertureValue = { Case: "MaxApertureValue", Fields: defaultRational }
export var defaultExifValue_Case_SubjectDistance = { Case: "SubjectDistance", Fields: defaultRational }
export var defaultExifValue_Case_FocalLength = { Case: "FocalLength", Fields: defaultRational }
export var defaultExifValue_Case_FlashEnergy2 = { Case: "FlashEnergy2", Fields: defaultRational }
export var defaultExifValue_Case_FocalPlaneXResolution2 = { Case: "FocalPlaneXResolution2", Fields: defaultRational }
export var defaultExifValue_Case_FocalPlaneYResolution2 = { Case: "FocalPlaneYResolution2", Fields: defaultRational }
export var defaultExifValue_Case_ExposureIndex2 = { Case: "ExposureIndex2", Fields: defaultRational }
export var defaultExifValue_Case_Humidity = { Case: "Humidity", Fields: defaultRational }
export var defaultExifValue_Case_Pressure = { Case: "Pressure", Fields: defaultRational }
export var defaultExifValue_Case_Acceleration = { Case: "Acceleration", Fields: defaultRational }
export var defaultExifValue_Case_FlashEnergy = { Case: "FlashEnergy", Fields: defaultRational }
export var defaultExifValue_Case_FocalPlaneXResolution = { Case: "FocalPlaneXResolution", Fields: defaultRational }
export var defaultExifValue_Case_FocalPlaneYResolution = { Case: "FocalPlaneYResolution", Fields: defaultRational }
export var defaultExifValue_Case_ExposureIndex = { Case: "ExposureIndex", Fields: defaultRational }
export var defaultExifValue_Case_DigitalZoomRatio = { Case: "DigitalZoomRatio", Fields: defaultRational }
export var defaultExifValue_Case_GPSAltitude = { Case: "GPSAltitude", Fields: defaultRational }
export var defaultExifValue_Case_GPSDOP = { Case: "GPSDOP", Fields: defaultRational }
export var defaultExifValue_Case_GPSSpeed = { Case: "GPSSpeed", Fields: defaultRational }
export var defaultExifValue_Case_GPSTrack = { Case: "GPSTrack", Fields: defaultRational }
export var defaultExifValue_Case_GPSImgDirection = { Case: "GPSImgDirection", Fields: defaultRational }
export var defaultExifValue_Case_GPSDestBearing = { Case: "GPSDestBearing", Fields: defaultRational }
export var defaultExifValue_Case_GPSDestDistance = { Case: "GPSDestDistance", Fields: defaultRational }
export var defaultExifValue_Case_WhitePoint = { Case: "WhitePoint", Fields: [] }
export var defaultExifValue_Case_PrimaryChromaticities = { Case: "PrimaryChromaticities", Fields: [] }
export var defaultExifValue_Case_YCbCrCoefficients = { Case: "YCbCrCoefficients", Fields: [] }
export var defaultExifValue_Case_ReferenceBlackWhite = { Case: "ReferenceBlackWhite", Fields: [] }
export var defaultExifValue_Case_GPSLatitude = { Case: "GPSLatitude", Fields: [] }
export var defaultExifValue_Case_GPSLongitude = { Case: "GPSLongitude", Fields: [] }
export var defaultExifValue_Case_GPSTimestamp = { Case: "GPSTimestamp", Fields: [] }
export var defaultExifValue_Case_GPSDestLatitude = { Case: "GPSDestLatitude", Fields: [] }
export var defaultExifValue_Case_GPSDestLongitude = { Case: "GPSDestLongitude", Fields: [] }
export var defaultExifValue_Case_LensSpecification = { Case: "LensSpecification", Fields: [] }
export var defaultExifValue_Case_ImageDescription = { Case: "ImageDescription", Fields: '' }
export var defaultExifValue_Case_Make = { Case: "Make", Fields: '' }
export var defaultExifValue_Case_Model = { Case: "Model", Fields: '' }
export var defaultExifValue_Case_Software = { Case: "Software", Fields: '' }
export var defaultExifValue_Case_DateTime = { Case: "DateTime", Fields: '' }
export var defaultExifValue_Case_Artist = { Case: "Artist", Fields: '' }
export var defaultExifValue_Case_HostComputer = { Case: "HostComputer", Fields: '' }
export var defaultExifValue_Case_Copyright = { Case: "Copyright", Fields: '' }
export var defaultExifValue_Case_DocumentName = { Case: "DocumentName", Fields: '' }
export var defaultExifValue_Case_PageName = { Case: "PageName", Fields: '' }
export var defaultExifValue_Case_InkNames = { Case: "InkNames", Fields: '' }
export var defaultExifValue_Case_TargetPrinter = { Case: "TargetPrinter", Fields: '' }
export var defaultExifValue_Case_ImageID = { Case: "ImageID", Fields: '' }
export var defaultExifValue_Case_MDLabName = { Case: "MDLabName", Fields: '' }
export var defaultExifValue_Case_MDSampleInfo = { Case: "MDSampleInfo", Fields: '' }
export var defaultExifValue_Case_MDPrepDate = { Case: "MDPrepDate", Fields: '' }
export var defaultExifValue_Case_MDPrepTime = { Case: "MDPrepTime", Fields: '' }
export var defaultExifValue_Case_MDFileUnits = { Case: "MDFileUnits", Fields: '' }
export var defaultExifValue_Case_SEMInfo = { Case: "SEMInfo", Fields: '' }
export var defaultExifValue_Case_SpectralSensitivity = { Case: "SpectralSensitivity", Fields: '' }
export var defaultExifValue_Case_DateTimeOriginal = { Case: "DateTimeOriginal", Fields: '' }
export var defaultExifValue_Case_DateTimeDigitized = { Case: "DateTimeDigitized", Fields: '' }
export var defaultExifValue_Case_SubsecTime = { Case: "SubsecTime", Fields: '' }
export var defaultExifValue_Case_SubsecTimeOriginal = { Case: "SubsecTimeOriginal", Fields: '' }
export var defaultExifValue_Case_SubsecTimeDigitized = { Case: "SubsecTimeDigitized", Fields: '' }
export var defaultExifValue_Case_RelatedSoundFile = { Case: "RelatedSoundFile", Fields: '' }
export var defaultExifValue_Case_FaxSubaddress = { Case: "FaxSubaddress", Fields: '' }
export var defaultExifValue_Case_OffsetTime = { Case: "OffsetTime", Fields: '' }
export var defaultExifValue_Case_OffsetTimeOriginal = { Case: "OffsetTimeOriginal", Fields: '' }
export var defaultExifValue_Case_OffsetTimeDigitized = { Case: "OffsetTimeDigitized", Fields: '' }
export var defaultExifValue_Case_SecurityClassification = { Case: "SecurityClassification", Fields: '' }
export var defaultExifValue_Case_ImageHistory = { Case: "ImageHistory", Fields: '' }
export var defaultExifValue_Case_ImageUniqueID = { Case: "ImageUniqueID", Fields: '' }
export var defaultExifValue_Case_OwnerName = { Case: "OwnerName", Fields: '' }
export var defaultExifValue_Case_SerialNumber = { Case: "SerialNumber", Fields: '' }
export var defaultExifValue_Case_LensMake = { Case: "LensMake", Fields: '' }
export var defaultExifValue_Case_LensModel = { Case: "LensModel", Fields: '' }
export var defaultExifValue_Case_LensSerialNumber = { Case: "LensSerialNumber", Fields: '' }
export var defaultExifValue_Case_GDALMetadata = { Case: "GDALMetadata", Fields: '' }
export var defaultExifValue_Case_GDALNoData = { Case: "GDALNoData", Fields: '' }
export var defaultExifValue_Case_GPSLatitudeRef = { Case: "GPSLatitudeRef", Fields: '' }
export var defaultExifValue_Case_GPSLongitudeRef = { Case: "GPSLongitudeRef", Fields: '' }
export var defaultExifValue_Case_GPSSatellites = { Case: "GPSSatellites", Fields: '' }
export var defaultExifValue_Case_GPSStatus = { Case: "GPSStatus", Fields: '' }
export var defaultExifValue_Case_GPSMeasureMode = { Case: "GPSMeasureMode", Fields: '' }
export var defaultExifValue_Case_GPSSpeedRef = { Case: "GPSSpeedRef", Fields: '' }
export var defaultExifValue_Case_GPSTrackRef = { Case: "GPSTrackRef", Fields: '' }
export var defaultExifValue_Case_GPSImgDirectionRef = { Case: "GPSImgDirectionRef", Fields: '' }
export var defaultExifValue_Case_GPSMapDatum = { Case: "GPSMapDatum", Fields: '' }
export var defaultExifValue_Case_GPSDestLatitudeRef = { Case: "GPSDestLatitudeRef", Fields: '' }
export var defaultExifValue_Case_GPSDestLongitudeRef = { Case: "GPSDestLongitudeRef", Fields: '' }
export var defaultExifValue_Case_GPSDestBearingRef = { Case: "GPSDestBearingRef", Fields: '' }
export var defaultExifValue_Case_GPSDestDistanceRef = { Case: "GPSDestDistanceRef", Fields: '' }
export var defaultExifValue_Case_GPSDateStamp = { Case: "GPSDateStamp", Fields: '' }
export var defaultExifValue_Case_ImageWidth = { Case: "ImageWidth", Fields: SixLabors_ImageSharp.defaultNumber }
export var defaultExifValue_Case_ImageLength = { Case: "ImageLength", Fields: SixLabors_ImageSharp.defaultNumber }
export var defaultExifValue_Case_RowsPerStrip = { Case: "RowsPerStrip", Fields: SixLabors_ImageSharp.defaultNumber }
export var defaultExifValue_Case_TileWidth = { Case: "TileWidth", Fields: SixLabors_ImageSharp.defaultNumber }
export var defaultExifValue_Case_TileLength = { Case: "TileLength", Fields: SixLabors_ImageSharp.defaultNumber }
export var defaultExifValue_Case_BadFaxLines = { Case: "BadFaxLines", Fields: SixLabors_ImageSharp.defaultNumber }
export var defaultExifValue_Case_ConsecutiveBadFaxLines = { Case: "ConsecutiveBadFaxLines", Fields: SixLabors_ImageSharp.defaultNumber }
export var defaultExifValue_Case_PixelXDimension = { Case: "PixelXDimension", Fields: SixLabors_ImageSharp.defaultNumber }
export var defaultExifValue_Case_PixelYDimension = { Case: "PixelYDimension", Fields: SixLabors_ImageSharp.defaultNumber }
export var defaultExifValue_Case_OldSubfileType = { Case: "OldSubfileType", Fields: System.defaultUInt16 }
export var defaultExifValue_Case_Compression = { Case: "Compression", Fields: System.defaultUInt16 }
export var defaultExifValue_Case_PhotometricInterpretation = { Case: "PhotometricInterpretation", Fields: System.defaultUInt16 }
export var defaultExifValue_Case_Thresholding = { Case: "Thresholding", Fields: System.defaultUInt16 }
export var defaultExifValue_Case_CellWidth = { Case: "CellWidth", Fields: System.defaultUInt16 }
export var defaultExifValue_Case_CellLength = { Case: "CellLength", Fields: System.defaultUInt16 }
export var defaultExifValue_Case_FillOrder = { Case: "FillOrder", Fields: System.defaultUInt16 }
export var defaultExifValue_Case_Orientation = { Case: "Orientation", Fields: System.defaultUInt16 }
export var defaultExifValue_Case_SamplesPerPixel = { Case: "SamplesPerPixel", Fields: System.defaultUInt16 }
export var defaultExifValue_Case_PlanarConfiguration = { Case: "PlanarConfiguration", Fields: System.defaultUInt16 }
export var defaultExifValue_Case_Predictor = { Case: "Predictor", Fields: System.defaultUInt16 }
export var defaultExifValue_Case_GrayResponseUnit = { Case: "GrayResponseUnit", Fields: System.defaultUInt16 }
export var defaultExifValue_Case_ResolutionUnit = { Case: "ResolutionUnit", Fields: System.defaultUInt16 }
export var defaultExifValue_Case_CleanFaxData = { Case: "CleanFaxData", Fields: System.defaultUInt16 }
export var defaultExifValue_Case_InkSet = { Case: "InkSet", Fields: System.defaultUInt16 }
export var defaultExifValue_Case_NumberOfInks = { Case: "NumberOfInks", Fields: System.defaultUInt16 }
export var defaultExifValue_Case_DotRange = { Case: "DotRange", Fields: System.defaultUInt16 }
export var defaultExifValue_Case_Indexed = { Case: "Indexed", Fields: System.defaultUInt16 }
export var defaultExifValue_Case_OPIProxy = { Case: "OPIProxy", Fields: System.defaultUInt16 }
export var defaultExifValue_Case_JPEGProc = { Case: "JPEGProc", Fields: System.defaultUInt16 }
export var defaultExifValue_Case_JPEGRestartInterval = { Case: "JPEGRestartInterval", Fields: System.defaultUInt16 }
export var defaultExifValue_Case_YCbCrPositioning = { Case: "YCbCrPositioning", Fields: System.defaultUInt16 }
export var defaultExifValue_Case_Rating = { Case: "Rating", Fields: System.defaultUInt16 }
export var defaultExifValue_Case_RatingPercent = { Case: "RatingPercent", Fields: System.defaultUInt16 }
export var defaultExifValue_Case_ExposureProgram = { Case: "ExposureProgram", Fields: System.defaultUInt16 }
export var defaultExifValue_Case_Interlace = { Case: "Interlace", Fields: System.defaultUInt16 }
export var defaultExifValue_Case_SelfTimerMode = { Case: "SelfTimerMode", Fields: System.defaultUInt16 }
export var defaultExifValue_Case_SensitivityType = { Case: "SensitivityType", Fields: System.defaultUInt16 }
export var defaultExifValue_Case_MeteringMode = { Case: "MeteringMode", Fields: System.defaultUInt16 }
export var defaultExifValue_Case_LightSource = { Case: "LightSource", Fields: System.defaultUInt16 }
export var defaultExifValue_Case_FocalPlaneResolutionUnit2 = { Case: "FocalPlaneResolutionUnit2", Fields: System.defaultUInt16 }
export var defaultExifValue_Case_SensingMethod2 = { Case: "SensingMethod2", Fields: System.defaultUInt16 }
export var defaultExifValue_Case_Flash = { Case: "Flash", Fields: System.defaultUInt16 }
export var defaultExifValue_Case_ColorSpace = { Case: "ColorSpace", Fields: System.defaultUInt16 }
export var defaultExifValue_Case_FocalPlaneResolutionUnit = { Case: "FocalPlaneResolutionUnit", Fields: System.defaultUInt16 }
export var defaultExifValue_Case_SensingMethod = { Case: "SensingMethod", Fields: System.defaultUInt16 }
export var defaultExifValue_Case_CustomRendered = { Case: "CustomRendered", Fields: System.defaultUInt16 }
export var defaultExifValue_Case_ExposureMode = { Case: "ExposureMode", Fields: System.defaultUInt16 }
export var defaultExifValue_Case_WhiteBalance = { Case: "WhiteBalance", Fields: System.defaultUInt16 }
export var defaultExifValue_Case_FocalLengthIn35mmFilm = { Case: "FocalLengthIn35mmFilm", Fields: System.defaultUInt16 }
export var defaultExifValue_Case_SceneCaptureType = { Case: "SceneCaptureType", Fields: System.defaultUInt16 }
export var defaultExifValue_Case_GainControl = { Case: "GainControl", Fields: System.defaultUInt16 }
export var defaultExifValue_Case_Contrast = { Case: "Contrast", Fields: System.defaultUInt16 }
export var defaultExifValue_Case_Saturation = { Case: "Saturation", Fields: System.defaultUInt16 }
export var defaultExifValue_Case_Sharpness = { Case: "Sharpness", Fields: System.defaultUInt16 }
export var defaultExifValue_Case_SubjectDistanceRange = { Case: "SubjectDistanceRange", Fields: System.defaultUInt16 }
export var defaultExifValue_Case_GPSDifferential = { Case: "GPSDifferential", Fields: System.defaultUInt16 }
export var defaultExifValue_Case_FileSource = { Case: "FileSource", Fields: 0 }
export var defaultExifValue_Case_SceneType = { Case: "SceneType", Fields: 0 }
export var defaultExifValue_Case_FaxProfile = { Case: "FaxProfile", Fields: 0 }
export var defaultExifValue_Case_ModeNumber = { Case: "ModeNumber", Fields: 0 }
export var defaultExifValue_Case_GPSAltitudeRef = { Case: "GPSAltitudeRef", Fields: 0 }
export var defaultExifValue_Case_SubfileType = { Case: "SubfileType", Fields: 0 }
export var defaultExifValue_Case_SubIFDOffset = { Case: "SubIFDOffset", Fields: 0 }
export var defaultExifValue_Case_GPSIFDOffset = { Case: "GPSIFDOffset", Fields: 0 }
export var defaultExifValue_Case_T4Options = { Case: "T4Options", Fields: 0 }
export var defaultExifValue_Case_T6Options = { Case: "T6Options", Fields: 0 }
export var defaultExifValue_Case_XClipPathUnits = { Case: "XClipPathUnits", Fields: 0 }
export var defaultExifValue_Case_YClipPathUnits = { Case: "YClipPathUnits", Fields: 0 }
export var defaultExifValue_Case_ProfileType = { Case: "ProfileType", Fields: 0 }
export var defaultExifValue_Case_CodingMethods = { Case: "CodingMethods", Fields: 0 }
export var defaultExifValue_Case_T82ptions = { Case: "T82ptions", Fields: 0 }
export var defaultExifValue_Case_JPEGInterchangeFormat = { Case: "JPEGInterchangeFormat", Fields: 0 }
export var defaultExifValue_Case_JPEGInterchangeFormatLength = { Case: "JPEGInterchangeFormatLength", Fields: 0 }
export var defaultExifValue_Case_MDFileTag = { Case: "MDFileTag", Fields: 0 }
export var defaultExifValue_Case_StandardOutputSensitivity = { Case: "StandardOutputSensitivity", Fields: 0 }
export var defaultExifValue_Case_RecommendedExposureIndex = { Case: "RecommendedExposureIndex", Fields: 0 }
export var defaultExifValue_Case_ISOSpeed = { Case: "ISOSpeed", Fields: 0 }
export var defaultExifValue_Case_ISOSpeedLatitudeyyy = { Case: "ISOSpeedLatitudeyyy", Fields: 0 }
export var defaultExifValue_Case_ISOSpeedLatitudezzz = { Case: "ISOSpeedLatitudezzz", Fields: 0 }
export var defaultExifValue_Case_FaxRecvParams = { Case: "FaxRecvParams", Fields: 0 }
export var defaultExifValue_Case_FaxRecvTime = { Case: "FaxRecvTime", Fields: 0 }
export var defaultExifValue_Case_ImageNumber = { Case: "ImageNumber", Fields: 0 }
export var defaultExifValue_Case_Decode = { Case: "Decode", Fields: [] }
export var defaultExifValue_Case_JPEGTables = { Case: "JPEGTables", Fields: [] }
export var defaultExifValue_Case_OECF = { Case: "OECF", Fields: [] }
export var defaultExifValue_Case_ExifVersion = { Case: "ExifVersion", Fields: [] }
export var defaultExifValue_Case_ComponentsConfiguration = { Case: "ComponentsConfiguration", Fields: [] }
export var defaultExifValue_Case_MakerNote = { Case: "MakerNote", Fields: [] }
export var defaultExifValue_Case_FlashpixVersion = { Case: "FlashpixVersion", Fields: [] }
export var defaultExifValue_Case_SpatialFrequencyResponse = { Case: "SpatialFrequencyResponse", Fields: [] }
export var defaultExifValue_Case_SpatialFrequencyResponse2 = { Case: "SpatialFrequencyResponse2", Fields: [] }
export var defaultExifValue_Case_Noise = { Case: "Noise", Fields: [] }
export var defaultExifValue_Case_CFAPattern = { Case: "CFAPattern", Fields: [] }
export var defaultExifValue_Case_DeviceSettingDescription = { Case: "DeviceSettingDescription", Fields: [] }
export var defaultExifValue_Case_ImageSourceData = { Case: "ImageSourceData", Fields: [] }
export var defaultExifValue_Case_BitsPerSample = { Case: "BitsPerSample", Fields: [] }
export var defaultExifValue_Case_MinSampleValue = { Case: "MinSampleValue", Fields: [] }
export var defaultExifValue_Case_MaxSampleValue = { Case: "MaxSampleValue", Fields: [] }
export var defaultExifValue_Case_GrayResponseCurve = { Case: "GrayResponseCurve", Fields: [] }
export var defaultExifValue_Case_ColorMap = { Case: "ColorMap", Fields: [] }
export var defaultExifValue_Case_ExtraSamples = { Case: "ExtraSamples", Fields: [] }
export var defaultExifValue_Case_PageNumber = { Case: "PageNumber", Fields: [] }
export var defaultExifValue_Case_TransferFunction = { Case: "TransferFunction", Fields: [] }
export var defaultExifValue_Case_HalftoneHints = { Case: "HalftoneHints", Fields: [] }
export var defaultExifValue_Case_SampleFormat = { Case: "SampleFormat", Fields: [] }
export var defaultExifValue_Case_TransferRange = { Case: "TransferRange", Fields: [] }
export var defaultExifValue_Case_DefaultImageColor = { Case: "DefaultImageColor", Fields: [] }
export var defaultExifValue_Case_JPEGLosslessPredictors = { Case: "JPEGLosslessPredictors", Fields: [] }
export var defaultExifValue_Case_JPEGPointTransforms = { Case: "JPEGPointTransforms", Fields: [] }
export var defaultExifValue_Case_YCbCrSubsampling = { Case: "YCbCrSubsampling", Fields: [] }
export var defaultExifValue_Case_CFARepeatPatternDim = { Case: "CFARepeatPatternDim", Fields: [] }
export var defaultExifValue_Case_IntergraphPacketData = { Case: "IntergraphPacketData", Fields: [] }
export var defaultExifValue_Case_ISOSpeedRatings = { Case: "ISOSpeedRatings", Fields: [] }
export var defaultExifValue_Case_SubjectArea = { Case: "SubjectArea", Fields: [] }
export var defaultExifValue_Case_SubjectLocation = { Case: "SubjectLocation", Fields: [] }
export var defaultExifValue_Case_StripOffsets = { Case: "StripOffsets", Fields: [] }
export var defaultExifValue_Case_StripByteCounts = { Case: "StripByteCounts", Fields: [] }
export var defaultExifValue_Case_TileByteCounts = { Case: "TileByteCounts", Fields: [] }
export var defaultExifValue_Case_ImageLayer = { Case: "ImageLayer", Fields: [] }
export var defaultExifValue_Case_FreeOffsets = { Case: "FreeOffsets", Fields: [] }
export var defaultExifValue_Case_FreeByteCounts = { Case: "FreeByteCounts", Fields: [] }
export var defaultExifValue_Case_ColorResponseUnit = { Case: "ColorResponseUnit", Fields: [] }
export var defaultExifValue_Case_TileOffsets = { Case: "TileOffsets", Fields: [] }
export var defaultExifValue_Case_SMinSampleValue = { Case: "SMinSampleValue", Fields: [] }
export var defaultExifValue_Case_SMaxSampleValue = { Case: "SMaxSampleValue", Fields: [] }
export var defaultExifValue_Case_JPEGQTables = { Case: "JPEGQTables", Fields: [] }
export var defaultExifValue_Case_JPEGDCTables = { Case: "JPEGDCTables", Fields: [] }
export var defaultExifValue_Case_JPEGACTables = { Case: "JPEGACTables", Fields: [] }
export var defaultExifValue_Case_StripRowCounts = { Case: "StripRowCounts", Fields: [] }
export var defaultExifValue_Case_IntergraphRegisters = { Case: "IntergraphRegisters", Fields: [] }
export var defaultExifValue_Case_TimeZoneOffset = { Case: "TimeZoneOffset", Fields: [] }
export var defaultExifValue_Case_SubIFDs = { Case: "SubIFDs", Fields: [] }
export var defaultExifValue = defaultExifValue_Case_XPosition as ExifValue

export type LobbyExit_Case_Delete = { Case: "Delete" }
export type LobbyExit_Case_MoveToSrc = { Case: "MoveToSrc" }
export type LobbyExit = LobbyExit_Case_Delete | LobbyExit_Case_MoveToSrc
export type LobbyExit_Case = "Delete" | "MoveToSrc"
export var LobbyExit_AllCases = [ "Delete", "MoveToSrc" ] as const
export var defaultLobbyExit_Case_Delete = { Case: "Delete" }
export var defaultLobbyExit_Case_MoveToSrc = { Case: "MoveToSrc" }
export var defaultLobbyExit = defaultLobbyExit_Case_Delete as LobbyExit

export type LobbyItem = {
  id: System.Guid
  fileId: AzureFiles.FileId
  rawFileId: System.Guid
  duplicateCheckResult: AzureFiles.DuplicateCheckResult
  processed: System.Boolean
  target: Microsoft_FSharp_Core.FSharpOption<LobbyExit>
}
export var defaultLobbyItem: LobbyItem = {
  id: '00000000-0000-0000-0000-000000000000',
  fileId: AzureFiles.defaultFileId,
  rawFileId: '00000000-0000-0000-0000-000000000000',
  duplicateCheckResult: AzureFiles.defaultDuplicateCheckResult,
  processed: false,
  target: null
}

