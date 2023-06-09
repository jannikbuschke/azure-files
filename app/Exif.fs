module AzFiles.Exif

open System
open System.Text.Json.Serialization
open System.Threading.Tasks
open AzureFiles
open Polly
open SixLabors.ImageSharp
open SixLabors.ImageSharp.Metadata.Profiles.Exif

type ushort = uint16

type Rational = { Numerator: uint; Denominator: uint }
type SignedRational = { Numerator: int; Denominator: int }

type ExifValue =
  | XPosition of Rational
  | YPosition of Rational
  | XResolution of Rational
  | YResolution of Rational
  | BatteryLevel of Rational
  | ExposureTime of Rational
  | FNumber of Rational
  | MDScalePixel of Rational
  | CompressedBitsPerPixel of Rational
  | ApertureValue of Rational
  | MaxApertureValue of Rational
  | SubjectDistance of Rational
  | FocalLength of Rational
  | FlashEnergy2 of Rational
  | FocalPlaneXResolution2 of Rational
  | FocalPlaneYResolution2 of Rational
  | ExposureIndex2 of Rational
  | Humidity of Rational
  | Pressure of Rational
  | Acceleration of Rational
  | FlashEnergy of Rational
  | FocalPlaneXResolution of Rational
  | FocalPlaneYResolution of Rational
  | ExposureIndex of Rational
  | DigitalZoomRatio of Rational
  | GPSAltitude of Rational
  | GPSDOP of Rational
  | GPSSpeed of Rational
  | GPSTrack of Rational
  | GPSImgDirection of Rational
  | GPSDestBearing of Rational
  | GPSDestDistance of Rational

  | WhitePoint of Rational []
  | PrimaryChromaticities of Rational []
  | YCbCrCoefficients of Rational []
  | ReferenceBlackWhite of Rational []
  | GPSLatitude of Rational []
  | GPSLongitude of Rational []
  | GPSTimestamp of Rational []
  | GPSDestLatitude of Rational []
  | GPSDestLongitude of Rational []
  | LensSpecification of Rational []

  | ImageDescription of string
  | Make of string
  | Model of string
  | Software of string
  | DateTime of string
  | Artist of string
  | HostComputer of string
  | Copyright of string
  | DocumentName of string
  | PageName of string
  | InkNames of string
  | TargetPrinter of string
  | ImageID of string
  | MDLabName of string
  | MDSampleInfo of string
  | MDPrepDate of string
  | MDPrepTime of string
  | MDFileUnits of string
  | SEMInfo of string
  | SpectralSensitivity of string
  | DateTimeOriginal of string
  | DateTimeDigitized of string
  | SubsecTime of string
  | SubsecTimeOriginal of string
  | SubsecTimeDigitized of string
  | RelatedSoundFile of string
  | FaxSubaddress of string
  | OffsetTime of string
  | OffsetTimeOriginal of string
  | OffsetTimeDigitized of string
  | SecurityClassification of string
  | ImageHistory of string
  | ImageUniqueID of string
  | OwnerName of string
  | SerialNumber of string
  | LensMake of string
  | LensModel of string
  | LensSerialNumber of string
  | GDALMetadata of string
  | GDALNoData of string
  | GPSLatitudeRef of string
  | GPSLongitudeRef of string
  | GPSSatellites of string
  | GPSStatus of string
  | GPSMeasureMode of string
  | GPSSpeedRef of string
  | GPSTrackRef of string
  | GPSImgDirectionRef of string
  | GPSMapDatum of string
  | GPSDestLatitudeRef of string
  | GPSDestLongitudeRef of string
  | GPSDestBearingRef of string
  | GPSDestDistanceRef of string
  | GPSDateStamp of string

  | ImageWidth of Number
  | ImageLength of Number
  | RowsPerStrip of Number
  | TileWidth of Number
  | TileLength of Number
  | BadFaxLines of Number
  | ConsecutiveBadFaxLines of Number
  | PixelXDimension of Number
  | PixelYDimension of Number
  | OldSubfileType of ushort
  | Compression of ushort
  | PhotometricInterpretation of ushort
  | Thresholding of ushort
  | CellWidth of ushort
  | CellLength of ushort
  | FillOrder of ushort
  | Orientation of ushort
  | SamplesPerPixel of ushort
  | PlanarConfiguration of ushort
  | Predictor of ushort
  | GrayResponseUnit of ushort
  | ResolutionUnit of ushort
  | CleanFaxData of ushort
  | InkSet of ushort
  | NumberOfInks of ushort
  | DotRange of ushort
  | Indexed of ushort
  | OPIProxy of ushort
  | JPEGProc of ushort
  | JPEGRestartInterval of ushort
  | YCbCrPositioning of ushort
  | Rating of ushort
  | RatingPercent of ushort
  | ExposureProgram of ushort
  | Interlace of ushort
  | SelfTimerMode of ushort
  | SensitivityType of ushort
  | MeteringMode of ushort
  | LightSource of ushort
  | FocalPlaneResolutionUnit2 of ushort
  | SensingMethod2 of ushort
  | Flash of ushort
  | ColorSpace of ushort
  | FocalPlaneResolutionUnit of ushort
  | SensingMethod of ushort
  | CustomRendered of ushort
  | ExposureMode of ushort
  | WhiteBalance of ushort
  | FocalLengthIn35mmFilm of ushort
  | SceneCaptureType of ushort
  | GainControl of ushort
  | Contrast of ushort
  | Saturation of ushort
  | Sharpness of ushort
  | SubjectDistanceRange of ushort
  | GPSDifferential of ushort
  | FileSource of byte
  | SceneType of byte
  | FaxProfile of byte
  | ModeNumber of byte
  | GPSAltitudeRef of byte
  | SubfileType of uint
  | SubIFDOffset of uint
  | GPSIFDOffset of uint
  | T4Options of uint
  | T6Options of uint
  | XClipPathUnits of uint
  | YClipPathUnits of uint
  | ProfileType of uint
  | CodingMethods of uint
  | T82ptions of uint
  | JPEGInterchangeFormat of uint
  | JPEGInterchangeFormatLength of uint
  | MDFileTag of uint
  | StandardOutputSensitivity of uint
  | RecommendedExposureIndex of uint
  | ISOSpeed of uint
  | ISOSpeedLatitudeyyy of uint
  | ISOSpeedLatitudezzz of uint
  | FaxRecvParams of uint
  | FaxRecvTime of uint
  | ImageNumber of uint

  | Decode of SignedRational []

  | JPEGTables of byte []
  | OECF of byte []
  | ExifVersion of byte []
  | ComponentsConfiguration of byte []
  | MakerNote of byte []
  | FlashpixVersion of byte []
  | SpatialFrequencyResponse of byte []
  | SpatialFrequencyResponse2 of byte []
  | Noise of byte []
  | CFAPattern of byte []
  | DeviceSettingDescription of byte []
  | ImageSourceData of byte []
  | BitsPerSample of ushort []
  | MinSampleValue of ushort []
  | MaxSampleValue of ushort []
  | GrayResponseCurve of ushort []
  | ColorMap of ushort []
  | ExtraSamples of ushort []
  | PageNumber of ushort []
  | TransferFunction of ushort []
  | HalftoneHints of ushort []
  | SampleFormat of ushort []
  | TransferRange of ushort []
  | DefaultImageColor of ushort []
  | JPEGLosslessPredictors of ushort []
  | JPEGPointTransforms of ushort []
  | YCbCrSubsampling of ushort []
  | CFARepeatPatternDim of ushort []
  | IntergraphPacketData of ushort []
  | ISOSpeedRatings of ushort []
  | SubjectArea of ushort []
  | SubjectLocation of ushort []
  | StripOffsets of Number []
  | StripByteCounts of Number []
  | TileByteCounts of Number []
  | ImageLayer of Number []
  | FreeOffsets of uint []
  | FreeByteCounts of uint []
  | ColorResponseUnit of uint []
  | TileOffsets of uint []
  | SMinSampleValue of uint []
  | SMaxSampleValue of uint []
  | JPEGQTables of uint []
  | JPEGDCTables of uint []
  | JPEGACTables of uint []
  | StripRowCounts of uint []
  | IntergraphRegisters of uint []
  | TimeZoneOffset of uint []
  | SubIFDs of uint []


// type ExifData =
//   {
// XPosition: Skippable<Rational>
// YPosition: Skippable<Rational>

//         public static ExifTag<Rational> XPosition { get; } = new ExifTag<Rational>(ExifTagValue.XPosition);
//         public static ExifTag<Rational> YPosition { get; } = new ExifTag<Rational>(ExifTagValue.YPosition);
//         public static ExifTag<Rational> XResolution { get; } = new ExifTag<Rational>(ExifTagValue.XResolution);
//         public static ExifTag<Rational> YResolution { get; } = new ExifTag<Rational>(ExifTagValue.YResolution);
//         public static ExifTag<Rational> BatteryLevel { get; } = new ExifTag<Rational>(ExifTagValue.BatteryLevel);
//         public static ExifTag<Rational> ExposureTime { get; } = new ExifTag<Rational>(ExifTagValue.ExposureTime);
//         public static ExifTag<Rational> FNumber { get; } = new ExifTag<Rational>(ExifTagValue.FNumber);
//         public static ExifTag<Rational> MDScalePixel { get; } = new ExifTag<Rational>(ExifTagValue.MDScalePixel);
//         public static ExifTag<Rational> CompressedBitsPerPixel { get; } = new ExifTag<Rational>(ExifTagValue.CompressedBitsPerPixel);
//         public static ExifTag<Rational> ApertureValue { get; } = new ExifTag<Rational>(ExifTagValue.ApertureValue);
//         public static ExifTag<Rational> MaxApertureValue { get; } = new ExifTag<Rational>(ExifTagValue.MaxApertureValue);
//         public static ExifTag<Rational> SubjectDistance { get; } = new ExifTag<Rational>(ExifTagValue.SubjectDistance);
//         public static ExifTag<Rational> FocalLength { get; } = new ExifTag<Rational>(ExifTagValue.FocalLength);
//         public static ExifTag<Rational> FlashEnergy2 { get; } = new ExifTag<Rational>(ExifTagValue.FlashEnergy2);
//         public static ExifTag<Rational> FocalPlaneXResolution2 { get; } = new ExifTag<Rational>(ExifTagValue.FocalPlaneXResolution2);
//         public static ExifTag<Rational> FocalPlaneYResolution2 { get; } = new ExifTag<Rational>(ExifTagValue.FocalPlaneYResolution2);
//         public static ExifTag<Rational> ExposureIndex2 { get; } = new ExifTag<Rational>(ExifTagValue.ExposureIndex2);
//         public static ExifTag<Rational> Humidity { get; } = new ExifTag<Rational>(ExifTagValue.Humidity);
//         public static ExifTag<Rational> Pressure { get; } = new ExifTag<Rational>(ExifTagValue.Pressure);
//         public static ExifTag<Rational> Acceleration { get; } = new ExifTag<Rational>(ExifTagValue.Acceleration);
//         public static ExifTag<Rational> FlashEnergy { get; } = new ExifTag<Rational>(ExifTagValue.FlashEnergy);
//         public static ExifTag<Rational> FocalPlaneXResolution { get; } = new ExifTag<Rational>(ExifTagValue.FocalPlaneXResolution);
//         public static ExifTag<Rational> FocalPlaneYResolution { get; } = new ExifTag<Rational>(ExifTagValue.FocalPlaneYResolution);
//         public static ExifTag<Rational> ExposureIndex { get; } = new ExifTag<Rational>(ExifTagValue.ExposureIndex);
//         public static ExifTag<Rational> DigitalZoomRatio { get; } = new ExifTag<Rational>(ExifTagValue.DigitalZoomRatio);
//         public static ExifTag<Rational> GPSAltitude { get; } = new ExifTag<Rational>(ExifTagValue.GPSAltitude);
//         public static ExifTag<Rational> GPSDOP { get; } = new ExifTag<Rational>(ExifTagValue.GPSDOP);
//         public static ExifTag<Rational> GPSSpeed { get; } = new ExifTag<Rational>(ExifTagValue.GPSSpeed);
//         public static ExifTag<Rational> GPSTrack { get; } = new ExifTag<Rational>(ExifTagValue.GPSTrack);
//         public static ExifTag<Rational> GPSImgDirection { get; } = new ExifTag<Rational>(ExifTagValue.GPSImgDirection);
//         public static ExifTag<Rational> GPSDestBearing { get; } = new ExifTag<Rational>(ExifTagValue.GPSDestBearing);
//         public static ExifTag<Rational> GPSDestDistance { get; } = new ExifTag<Rational>(ExifTagValue.GPSDestDistance)

//         public static ExifTag<string> ImageDescription { get; } = new ExifTag<string>(ExifTagValue.ImageDescription);
//         public static ExifTag<string> Make { get; } = new ExifTag<string>(ExifTagValue.Make);
//         public static ExifTag<string> Model { get; } = new ExifTag<string>(ExifTagValue.Model);
//         public static ExifTag<string> Software { get; } = new ExifTag<string>(ExifTagValue.Software);
//         public static ExifTag<string> DateTime { get; } = new ExifTag<string>(ExifTagValue.DateTime);
//         public static ExifTag<string> Artist { get; } = new ExifTag<string>(ExifTagValue.Artist);
//         public static ExifTag<string> HostComputer { get; } = new ExifTag<string>(ExifTagValue.HostComputer);
//         public static ExifTag<string> Copyright { get; } = new ExifTag<string>(ExifTagValue.Copyright);
//         public static ExifTag<string> DocumentName { get; } = new ExifTag<string>(ExifTagValue.DocumentName);
//         public static ExifTag<string> PageName { get; } = new ExifTag<string>(ExifTagValue.PageName);
//         public static ExifTag<string> InkNames { get; } = new ExifTag<string>(ExifTagValue.InkNames);
//         public static ExifTag<string> TargetPrinter { get; } = new ExifTag<string>(ExifTagValue.TargetPrinter);
//         public static ExifTag<string> ImageID { get; } = new ExifTag<string>(ExifTagValue.ImageID);
//         public static ExifTag<string> MDLabName { get; } = new ExifTag<string>(ExifTagValue.MDLabName);
//         public static ExifTag<string> MDSampleInfo { get; } = new ExifTag<string>(ExifTagValue.MDSampleInfo);
//         public static ExifTag<string> MDPrepDate { get; } = new ExifTag<string>(ExifTagValue.MDPrepDate);
//         public static ExifTag<string> MDPrepTime { get; } = new ExifTag<string>(ExifTagValue.MDPrepTime);
//         public static ExifTag<string> MDFileUnits { get; } = new ExifTag<string>(ExifTagValue.MDFileUnits);
//         public static ExifTag<string> SEMInfo { get; } = new ExifTag<string>(ExifTagValue.SEMInfo);
//         public static ExifTag<string> SpectralSensitivity { get; } = new ExifTag<string>(ExifTagValue.SpectralSensitivity);
//         public static ExifTag<string> DateTimeOriginal { get; } = new ExifTag<string>(ExifTagValue.DateTimeOriginal);
//         public static ExifTag<string> DateTimeDigitized { get; } = new ExifTag<string>(ExifTagValue.DateTimeDigitized);
//         public static ExifTag<string> SubsecTime { get; } = new ExifTag<string>(ExifTagValue.SubsecTime);
//         public static ExifTag<string> SubsecTimeOriginal { get; } = new ExifTag<string>(ExifTagValue.SubsecTimeOriginal);
//         public static ExifTag<string> SubsecTimeDigitized { get; } = new ExifTag<string>(ExifTagValue.SubsecTimeDigitized);
//         public static ExifTag<string> RelatedSoundFile { get; } = new ExifTag<string>(ExifTagValue.RelatedSoundFile);
//         public static ExifTag<string> FaxSubaddress { get; } = new ExifTag<string>(ExifTagValue.FaxSubaddress);
//         public static ExifTag<string> OffsetTime { get; } = new ExifTag<string>(ExifTagValue.OffsetTime);
//         public static ExifTag<string> OffsetTimeOriginal { get; } = new ExifTag<string>(ExifTagValue.OffsetTimeOriginal);
//         public static ExifTag<string> OffsetTimeDigitized { get; } = new ExifTag<string>(ExifTagValue.OffsetTimeDigitized);
//         public static ExifTag<string> SecurityClassification { get; } = new ExifTag<string>(ExifTagValue.SecurityClassification);
//         public static ExifTag<string> ImageHistory { get; } = new ExifTag<string>(ExifTagValue.ImageHistory);
//         public static ExifTag<string> ImageUniqueID { get; } = new ExifTag<string>(ExifTagValue.ImageUniqueID);
//         public static ExifTag<string> OwnerName { get; } = new ExifTag<string>(ExifTagValue.OwnerName);
//         public static ExifTag<string> SerialNumber { get; } = new ExifTag<string>(ExifTagValue.SerialNumber);
//         public static ExifTag<string> LensMake { get; } = new ExifTag<string>(ExifTagValue.LensMake);
//         public static ExifTag<string> LensModel { get; } = new ExifTag<string>(ExifTagValue.LensModel);
//         public static ExifTag<string> LensSerialNumber { get; } = new ExifTag<string>(ExifTagValue.LensSerialNumber);
//         public static ExifTag<string> GDALMetadata { get; } = new ExifTag<string>(ExifTagValue.GDALMetadata);
//         public static ExifTag<string> GDALNoData { get; } = new ExifTag<string>(ExifTagValue.GDALNoData);
//         public static ExifTag<string> GPSLatitudeRef { get; } = new ExifTag<string>(ExifTagValue.GPSLatitudeRef);
//         public static ExifTag<string> GPSLongitudeRef { get; } = new ExifTag<string>(ExifTagValue.GPSLongitudeRef);
//         public static ExifTag<string> GPSSatellites { get; } = new ExifTag<string>(ExifTagValue.GPSSatellites);
//         public static ExifTag<string> GPSStatus { get; } = new ExifTag<string>(ExifTagValue.GPSStatus);
//         public static ExifTag<string> GPSMeasureMode { get; } = new ExifTag<string>(ExifTagValue.GPSMeasureMode);
//         public static ExifTag<string> GPSSpeedRef { get; } = new ExifTag<string>(ExifTagValue.GPSSpeedRef);
//         public static ExifTag<string> GPSTrackRef { get; } = new ExifTag<string>(ExifTagValue.GPSTrackRef);
//         public static ExifTag<string> GPSImgDirectionRef { get; } = new ExifTag<string>(ExifTagValue.GPSImgDirectionRef);
//         public static ExifTag<string> GPSMapDatum { get; } = new ExifTag<string>(ExifTagValue.GPSMapDatum);
//         public static ExifTag<string> GPSDestLatitudeRef { get; } = new ExifTag<string>(ExifTagValue.GPSDestLatitudeRef);
//         public static ExifTag<string> GPSDestLongitudeRef { get; } = new ExifTag<string>(ExifTagValue.GPSDestLongitudeRef);
//         public static ExifTag<string> GPSDestBearingRef { get; } = new ExifTag<string>(ExifTagValue.GPSDestBearingRef);
//         public static ExifTag<string> GPSDestDistanceRef { get; } = new ExifTag<string>(ExifTagValue.GPSDestDistanceRef);
//         public static ExifTag<string> GPSDateStamp { get; } = new ExifTag<string>(ExifTagValue.GPSDateStamp)

// public static ExifTag<Number> ImageWidth { get; } = new ExifTag<Number>(ExifTagValue.ImageWidth);
// public static ExifTag<Number> ImageLength { get; } = new ExifTag<Number>(ExifTagValue.ImageLength);
// public static ExifTag<Number> RowsPerStrip { get; } = new ExifTag<Number>(ExifTagValue.RowsPerStrip);
// public static ExifTag<Number> TileWidth { get; } = new ExifTag<Number>(ExifTagValue.TileWidth);
// public static ExifTag<Number> TileLength { get; } = new ExifTag<Number>(ExifTagValue.TileLength);
// public static ExifTag<Number> BadFaxLines { get; } = new ExifTag<Number>(ExifTagValue.BadFaxLines);
// public static ExifTag<Number> ConsecutiveBadFaxLines { get; } = new ExifTag<Number>(ExifTagValue.ConsecutiveBadFaxLines);
// public static ExifTag<Number> PixelXDimension { get; } = new ExifTag<Number>(ExifTagValue.PixelXDimension);
// public static ExifTag<Number> PixelYDimension { get; } = new ExifTag<Number>(ExifTagValue.PixelYDimension);

// public static ExifTag<ushort> OldSubfileType { get; } = new ExifTag<ushort>(ExifTagValue.OldSubfileType);
// public static ExifTag<ushort> Compression { get; } = new ExifTag<ushort>(ExifTagValue.Compression);
// public static ExifTag<ushort> PhotometricInterpretation { get; } = new ExifTag<ushort>(ExifTagValue.PhotometricInterpretation);
// public static ExifTag<ushort> Thresholding { get; } = new ExifTag<ushort>(ExifTagValue.Thresholding);
// public static ExifTag<ushort> CellWidth { get; } = new ExifTag<ushort>(ExifTagValue.CellWidth);
// public static ExifTag<ushort> CellLength { get; } = new ExifTag<ushort>(ExifTagValue.CellLength);
// public static ExifTag<ushort> FillOrder { get; } = new ExifTag<ushort>(ExifTagValue.FillOrder);
// public static ExifTag<ushort> Orientation { get; } = new ExifTag<ushort>(ExifTagValue.Orientation);
// public static ExifTag<ushort> SamplesPerPixel { get; } = new ExifTag<ushort>(ExifTagValue.SamplesPerPixel);
// public static ExifTag<ushort> PlanarConfiguration { get; } = new ExifTag<ushort>(ExifTagValue.PlanarConfiguration);
// public static ExifTag<ushort> Predictor { get; } = new ExifTag<ushort>(ExifTagValue.Predictor);
// public static ExifTag<ushort> GrayResponseUnit { get; } = new ExifTag<ushort>(ExifTagValue.GrayResponseUnit);
// public static ExifTag<ushort> ResolutionUnit { get; } = new ExifTag<ushort>(ExifTagValue.ResolutionUnit);
// public static ExifTag<ushort> CleanFaxData { get; } = new ExifTag<ushort>(ExifTagValue.CleanFaxData);
// public static ExifTag<ushort> InkSet { get; } = new ExifTag<ushort>(ExifTagValue.InkSet);
// public static ExifTag<ushort> NumberOfInks { get; } = new ExifTag<ushort>(ExifTagValue.NumberOfInks);
// public static ExifTag<ushort> DotRange { get; } = new ExifTag<ushort>(ExifTagValue.DotRange);
// public static ExifTag<ushort> Indexed { get; } = new ExifTag<ushort>(ExifTagValue.Indexed);
// public static ExifTag<ushort> OPIProxy { get; } = new ExifTag<ushort>(ExifTagValue.OPIProxy);
// public static ExifTag<ushort> JPEGProc { get; } = new ExifTag<ushort>(ExifTagValue.JPEGProc);
// public static ExifTag<ushort> JPEGRestartInterval { get; } = new ExifTag<ushort>(ExifTagValue.JPEGRestartInterval);
// public static ExifTag<ushort> YCbCrPositioning { get; } = new ExifTag<ushort>(ExifTagValue.YCbCrPositioning);
// public static ExifTag<ushort> Rating { get; } = new ExifTag<ushort>(ExifTagValue.Rating);
// public static ExifTag<ushort> RatingPercent { get; } = new ExifTag<ushort>(ExifTagValue.RatingPercent);
// public static ExifTag<ushort> ExposureProgram { get; } = new ExifTag<ushort>(ExifTagValue.ExposureProgram);
// public static ExifTag<ushort> Interlace { get; } = new ExifTag<ushort>(ExifTagValue.Interlace);
// public static ExifTag<ushort> SelfTimerMode { get; } = new ExifTag<ushort>(ExifTagValue.SelfTimerMode);
// public static ExifTag<ushort> SensitivityType { get; } = new ExifTag<ushort>(ExifTagValue.SensitivityType);
// public static ExifTag<ushort> MeteringMode { get; } = new ExifTag<ushort>(ExifTagValue.MeteringMode);
// public static ExifTag<ushort> LightSource { get; } = new ExifTag<ushort>(ExifTagValue.LightSource);
// public static ExifTag<ushort> FocalPlaneResolutionUnit2 { get; } = new ExifTag<ushort>(ExifTagValue.FocalPlaneResolutionUnit2);
// public static ExifTag<ushort> SensingMethod2 { get; } = new ExifTag<ushort>(ExifTagValue.SensingMethod2);
// public static ExifTag<ushort> Flash { get; } = new ExifTag<ushort>(ExifTagValue.Flash);
// public static ExifTag<ushort> ColorSpace { get; } = new ExifTag<ushort>(ExifTagValue.ColorSpace);
// public static ExifTag<ushort> FocalPlaneResolutionUnit { get; } = new ExifTag<ushort>(ExifTagValue.FocalPlaneResolutionUnit);
// public static ExifTag<ushort> SensingMethod { get; } = new ExifTag<ushort>(ExifTagValue.SensingMethod);
// public static ExifTag<ushort> CustomRendered { get; } = new ExifTag<ushort>(ExifTagValue.CustomRendered);
// public static ExifTag<ushort> ExposureMode { get; } = new ExifTag<ushort>(ExifTagValue.ExposureMode);
// public static ExifTag<ushort> WhiteBalance { get; } = new ExifTag<ushort>(ExifTagValue.WhiteBalance);
// public static ExifTag<ushort> FocalLengthIn35mmFilm { get; } = new ExifTag<ushort>(ExifTagValue.FocalLengthIn35mmFilm);
// public static ExifTag<ushort> SceneCaptureType { get; } = new ExifTag<ushort>(ExifTagValue.SceneCaptureType);
// public static ExifTag<ushort> GainControl { get; } = new ExifTag<ushort>(ExifTagValue.GainControl);
// public static ExifTag<ushort> Contrast { get; } = new ExifTag<ushort>(ExifTagValue.Contrast);
// public static ExifTag<ushort> Saturation { get; } = new ExifTag<ushort>(ExifTagValue.Saturation);
// public static ExifTag<ushort> Sharpness { get; } = new ExifTag<ushort>(ExifTagValue.Sharpness);
// public static ExifTag<ushort> SubjectDistanceRange { get; } = new ExifTag<ushort>(ExifTagValue.SubjectDistanceRange);
// public static ExifTag<ushort> GPSDifferential { get; } = new ExifTag<ushort>(ExifTagValue.GPSDifferential);

// public static ExifTag<SignedRational[]> Decode { get; } = new ExifTag<SignedRational[]>(ExifTagValue.Decode);

// public static ExifTag<byte[]> JPEGTables { get; } = new ExifTag<byte[]>(ExifTagValue.JPEGTables);
// public static ExifTag<byte[]> OECF { get; } = new ExifTag<byte[]>(ExifTagValue.OECF);
// public static ExifTag<byte[]> ExifVersion { get; } = new ExifTag<byte[]>(ExifTagValue.ExifVersion);
// public static ExifTag<byte[]> ComponentsConfiguration { get; } = new ExifTag<byte[]>(ExifTagValue.ComponentsConfiguration);
// public static ExifTag<byte[]> MakerNote { get; } = new ExifTag<byte[]>(ExifTagValue.MakerNote);
// public static ExifTag<byte[]> FlashpixVersion { get; } = new ExifTag<byte[]>(ExifTagValue.FlashpixVersion);
// public static ExifTag<byte[]> SpatialFrequencyResponse { get; } = new ExifTag<byte[]>(ExifTagValue.SpatialFrequencyResponse);
// public static ExifTag<byte[]> SpatialFrequencyResponse2 { get; } = new ExifTag<byte[]>(ExifTagValue.SpatialFrequencyResponse2);
// public static ExifTag<byte[]> Noise { get; } = new ExifTag<byte[]>(ExifTagValue.Noise);
// public static ExifTag<byte[]> CFAPattern { get; } = new ExifTag<byte[]>(ExifTagValue.CFAPattern);
// public static ExifTag<byte[]> DeviceSettingDescription { get; } = new ExifTag<byte[]>(ExifTagValue.DeviceSettingDescription);
// public static ExifTag<byte[]> ImageSourceData { get; } = new ExifTag<byte[]>(ExifTagValue.ImageSourceData);
// public static ExifTag<byte> FileSource { get; } = new ExifTag<byte>(ExifTagValue.FileSource);
// public static ExifTag<byte> SceneType { get; } = new ExifTag<byte>(ExifTagValue.SceneType);


// public static ExifTag<ushort[]> BitsPerSample { get; } = new ExifTag<ushort[]>(ExifTagValue.BitsPerSample);
// public static ExifTag<ushort[]> MinSampleValue { get; } = new ExifTag<ushort[]>(ExifTagValue.MinSampleValue);
// public static ExifTag<ushort[]> MaxSampleValue { get; } = new ExifTag<ushort[]>(ExifTagValue.MaxSampleValue);
// public static ExifTag<ushort[]> GrayResponseCurve { get; } = new ExifTag<ushort[]>(ExifTagValue.GrayResponseCurve);
// public static ExifTag<ushort[]> ColorMap { get; } = new ExifTag<ushort[]>(ExifTagValue.ColorMap);
// public static ExifTag<ushort[]> ExtraSamples { get; } = new ExifTag<ushort[]>(ExifTagValue.ExtraSamples);
// public static ExifTag<ushort[]> PageNumber { get; } = new ExifTag<ushort[]>(ExifTagValue.PageNumber);
// public static ExifTag<ushort[]> TransferFunction { get; } = new ExifTag<ushort[]>(ExifTagValue.TransferFunction);
// public static ExifTag<ushort[]> HalftoneHints { get; } = new ExifTag<ushort[]>(ExifTagValue.HalftoneHints);
// public static ExifTag<ushort[]> SampleFormat { get; } = new ExifTag<ushort[]>(ExifTagValue.SampleFormat);
// public static ExifTag<ushort[]> TransferRange { get; } = new ExifTag<ushort[]>(ExifTagValue.TransferRange);
// public static ExifTag<ushort[]> DefaultImageColor { get; } = new ExifTag<ushort[]>(ExifTagValue.DefaultImageColor);
// public static ExifTag<ushort[]> JPEGLosslessPredictors { get; } = new ExifTag<ushort[]>(ExifTagValue.JPEGLosslessPredictors);
// public static ExifTag<ushort[]> JPEGPointTransforms { get; } = new ExifTag<ushort[]>(ExifTagValue.JPEGPointTransforms);
// public static ExifTag<ushort[]> YCbCrSubsampling { get; } = new ExifTag<ushort[]>(ExifTagValue.YCbCrSubsampling);
// public static ExifTag<ushort[]> CFARepeatPatternDim { get; } = new ExifTag<ushort[]>(ExifTagValue.CFARepeatPatternDim);
// public static ExifTag<ushort[]> IntergraphPacketData { get; } = new ExifTag<ushort[]>(ExifTagValue.IntergraphPacketData);
// public static ExifTag<ushort[]> ISOSpeedRatings { get; } = new ExifTag<ushort[]>(ExifTagValue.ISOSpeedRatings);
// public static ExifTag<ushort[]> SubjectArea { get; } = new ExifTag<ushort[]>(ExifTagValue.SubjectArea);
// public static ExifTag<ushort[]> SubjectLocation { get; } = new ExifTag<ushort[]>(ExifTagValue.SubjectLocation);

// public static ExifTag<byte> FaxProfile { get; } = new ExifTag<byte>(ExifTagValue.FaxProfile);
// public static ExifTag<byte> ModeNumber { get; } = new ExifTag<byte>(ExifTagValue.ModeNumber);
// public static ExifTag<byte> GPSAltitudeRef { get; } = new ExifTag<byte>(ExifTagValue.GPSAltitudeRef);


// public static ExifTag<uint> SubfileType { get; } = new ExifTag<uint>(ExifTagValue.SubfileType);
// public static ExifTag<uint> SubIFDOffset { get; } = new ExifTag<uint>(ExifTagValue.SubIFDOffset);
// public static ExifTag<uint> GPSIFDOffset { get; } = new ExifTag<uint>(ExifTagValue.GPSIFDOffset);
// public static ExifTag<uint> T4Options { get; } = new ExifTag<uint>(ExifTagValue.T4Options);
// public static ExifTag<uint> T6Options { get; } = new ExifTag<uint>(ExifTagValue.T6Options);
// public static ExifTag<uint> XClipPathUnits { get; } = new ExifTag<uint>(ExifTagValue.XClipPathUnits);
// public static ExifTag<uint> YClipPathUnits { get; } = new ExifTag<uint>(ExifTagValue.YClipPathUnits);
// public static ExifTag<uint> ProfileType { get; } = new ExifTag<uint>(ExifTagValue.ProfileType);
// public static ExifTag<uint> CodingMethods { get; } = new ExifTag<uint>(ExifTagValue.CodingMethods);
// public static ExifTag<uint> T82ptions { get; } = new ExifTag<uint>(ExifTagValue.T82ptions);
// public static ExifTag<uint> JPEGInterchangeFormat { get; } = new ExifTag<uint>(ExifTagValue.JPEGInterchangeFormat);
// public static ExifTag<uint> JPEGInterchangeFormatLength { get; } = new ExifTag<uint>(ExifTagValue.JPEGInterchangeFormatLength);
// public static ExifTag<uint> MDFileTag { get; } = new ExifTag<uint>(ExifTagValue.MDFileTag);
// public static ExifTag<uint> StandardOutputSensitivity { get; } = new ExifTag<uint>(ExifTagValue.StandardOutputSensitivity);
// public static ExifTag<uint> RecommendedExposureIndex { get; } = new ExifTag<uint>(ExifTagValue.RecommendedExposureIndex);
// public static ExifTag<uint> ISOSpeed { get; } = new ExifTag<uint>(ExifTagValue.ISOSpeed);
// public static ExifTag<uint> ISOSpeedLatitudeyyy { get; } = new ExifTag<uint>(ExifTagValue.ISOSpeedLatitudeyyy);
// public static ExifTag<uint> ISOSpeedLatitudezzz { get; } = new ExifTag<uint>(ExifTagValue.ISOSpeedLatitudezzz);
// public static ExifTag<uint> FaxRecvParams { get; } = new ExifTag<uint>(ExifTagValue.FaxRecvParams);
// public static ExifTag<uint> FaxRecvTime { get; } = new ExifTag<uint>(ExifTagValue.FaxRecvTime);
// public static ExifTag<uint> ImageNumber { get; } = new ExifTag<uint>(ExifTagValue.ImageNumber);

// public static ExifTag<Number[]> StripOffsets { get; } = new ExifTag<Number[]>(ExifTagValue.StripOffsets);
// public static ExifTag<Number[]> StripByteCounts { get; } = new ExifTag<Number[]>(ExifTagValue.StripByteCounts);
// public static ExifTag<Number[]> TileByteCounts { get; } = new ExifTag<Number[]>(ExifTagValue.TileByteCounts);
// public static ExifTag<Number[]> ImageLayer { get; } = new ExifTag<Number[]>(ExifTagValue.ImageLayer);

// public static ExifTag<Number[]> StripOffsets { get; } = new ExifTag<Number[]>(ExifTagValue.StripOffsets);
// public static ExifTag<Number[]> StripByteCounts { get; } = new ExifTag<Number[]>(ExifTagValue.StripByteCounts);
// public static ExifTag<Number[]> TileByteCounts { get; } = new ExifTag<Number[]>(ExifTagValue.TileByteCounts);
// public static ExifTag<Number[]> ImageLayer { get; } = new ExifTag<Number[]>(ExifTagValue.ImageLayer);

// public static ExifTag<uint[]> FreeOffsets { get; } = new ExifTag<uint[]>(ExifTagValue.FreeOffsets);
// public static ExifTag<uint[]> FreeByteCounts { get; } = new ExifTag<uint[]>(ExifTagValue.FreeByteCounts);
// public static ExifTag<uint[]> ColorResponseUnit { get; } = new ExifTag<uint[]>(ExifTagValue.ColorResponseUnit);
// public static ExifTag<uint[]> TileOffsets { get; } = new ExifTag<uint[]>(ExifTagValue.TileOffsets);
// public static ExifTag<uint[]> SMinSampleValue { get; } = new ExifTag<uint[]>(ExifTagValue.SMinSampleValue);
// public static ExifTag<uint[]> SMaxSampleValue { get; } = new ExifTag<uint[]>(ExifTagValue.SMaxSampleValue);
// public static ExifTag<uint[]> JPEGQTables { get; } = new ExifTag<uint[]>(ExifTagValue.JPEGQTables);
// public static ExifTag<uint[]> JPEGDCTables { get; } = new ExifTag<uint[]>(ExifTagValue.JPEGDCTables);
// public static ExifTag<uint[]> JPEGACTables { get; } = new ExifTag<uint[]>(ExifTagValue.JPEGACTables);
// public static ExifTag<uint[]> StripRowCounts { get; } = new ExifTag<uint[]>(ExifTagValue.StripRowCounts);
// public static ExifTag<uint[]> IntergraphRegisters { get; } = new ExifTag<uint[]>(ExifTagValue.IntergraphRegisters);
// public static ExifTag<uint[]> TimeZoneOffset { get; } = new ExifTag<uint[]>(ExifTagValue.TimeZoneOffset);
// public static ExifTag<uint[]> SubIFDs { get; } = new ExifTag<uint[]>(ExifTagValue.SubIFDs)



// public static ExifTag<Rational[]> WhitePoint { get; } = new ExifTag<Rational[]>(ExifTagValue.WhitePoint);
// public static ExifTag<Rational[]> PrimaryChromaticities { get; } = new ExifTag<Rational[]>(ExifTagValue.PrimaryChromaticities);
// public static ExifTag<Rational[]> YCbCrCoefficients { get; } = new ExifTag<Rational[]>(ExifTagValue.YCbCrCoefficients);
// public static ExifTag<Rational[]> ReferenceBlackWhite { get; } = new ExifTag<Rational[]>(ExifTagValue.ReferenceBlackWhite);
// public static ExifTag<Rational[]> GPSLatitude { get; } = new ExifTag<Rational[]>(ExifTagValue.GPSLatitude);
// public static ExifTag<Rational[]> GPSLongitude { get; } = new ExifTag<Rational[]>(ExifTagValue.GPSLongitude);
// public static ExifTag<Rational[]> GPSTimestamp { get; } = new ExifTag<Rational[]>(ExifTagValue.GPSTimestamp);
// public static ExifTag<Rational[]> GPSDestLatitude { get; } = new ExifTag<Rational[]>(ExifTagValue.GPSDestLatitude);
// public static ExifTag<Rational[]> GPSDestLongitude { get; } = new ExifTag<Rational[]>(ExifTagValue.GPSDestLongitude);
// public static ExifTag<Rational[]> LensSpecification { get; } = new ExifTag<Rational[]>(ExifTagValue.LensSpecification);
// }


let readExif (exifProfile: ExifProfile) =
  if exifProfile = null then
    None
  else

    let parseRational (tag: ExifTag<SixLabors.ImageSharp.Rational>) =
      let v = exifProfile.GetValue tag

      v
      |> Option.ofObj
      |> Option.map (fun v -> v.Value)
      |> Option.map (fun v ->
        { Rational.Numerator = v.Numerator
          Rational.Denominator = v.Denominator })
      |> Skippable.ofOption

    let parseRationalField (tag: ExifTag<SixLabors.ImageSharp.Rational>, case: Rational -> ExifValue) =
      tag |> parseRational |> Skippable.map case

    let parseRationalArray (tag: ExifTag<SixLabors.ImageSharp.Rational []>) =
      let v = exifProfile.GetValue tag

      v
      |> Option.ofObj
      |> Option.map (fun v -> v.Value)
      |> Option.map (fun v ->
        v
        |> Array.map (fun v ->
          { Rational.Numerator = v.Numerator
            Rational.Denominator = v.Denominator }))
      |> Skippable.ofOption

    let parseRationalArrayField (tag: ExifTag<SixLabors.ImageSharp.Rational []>, case: Rational [] -> ExifValue) =
      tag |> parseRationalArray |> Skippable.map case


    // ExifProfile.GetValue<'TValueType>(tag: ExifTag<'TValueType>) : IExifValue<'TValueType>
    let parsestring (tag: ExifTag<string>) =
      let v = exifProfile.GetValue tag

      v
      |> Option.ofObj
      |> Option.map (fun v -> v.Value)
      |> Skippable.ofOption

    let parseStringField (tag: ExifTag<string>, case: string -> ExifValue) =
      tag |> parsestring |> Skippable.map case

    let parseNumber (tag: ExifTag<SixLabors.ImageSharp.Number>) =
      let v = exifProfile.GetValue tag

      v
      |> Option.ofObj
      |> Option.map (fun v -> v.Value)
      |> Skippable.ofOption

    let parseNumberField (tag: ExifTag<Number>, case: Number -> ExifValue) =
      tag |> parseNumber |> Skippable.map case

    let parseNumberArray (tag: ExifTag<SixLabors.ImageSharp.Number []>) =
      let v = exifProfile.GetValue tag

      v
      |> Option.ofObj
      |> Option.map (fun v -> v.Value)
      |> Skippable.ofOption

    let parseNumberArrayField (tag: ExifTag<Number []>, case: Number [] -> ExifValue) =
      tag |> parseNumberArray |> Skippable.map case

    let parseIntArray (tag: ExifTag<int []>) =
      let v = exifProfile.GetValue tag

      v
      |> Option.ofObj
      |> Option.map (fun v -> v.Value)
      |> Skippable.ofOption

    let parseintArrayField (tag: ExifTag<int []>, case: int [] -> ExifValue) =
      tag |> parseIntArray |> Skippable.map case

    let parseUintArray (tag: ExifTag<uint []>) =
      let v = exifProfile.GetValue tag

      v
      |> Option.ofObj
      |> Option.map (fun v -> v.Value)
      |> Skippable.ofOption

    let parseUintArrayField (tag: ExifTag<uint []>, case: uint [] -> ExifValue) =
      tag |> parseUintArray |> Skippable.map case

    let parseuint (tag: ExifTag<uint>) =
      let v = exifProfile.GetValue tag

      v
      |> Option.ofObj
      |> Option.map (fun v -> v.Value)
      |> Skippable.ofOption

    let parseUintField (tag: ExifTag<uint>, case: uint -> ExifValue) = tag |> parseuint |> Skippable.map case

    let parseushort (tag: ExifTag<ushort>) =
      let v = exifProfile.GetValue tag

      v
      |> Option.ofObj
      |> Option.map (fun v -> v.Value)
      |> Skippable.ofOption

    let parseUshortField (tag: ExifTag<ushort>, case: ushort -> ExifValue) =
      tag |> parseushort |> Skippable.map case


    let parseushortArray (tag: ExifTag<ushort []>) =
      let v = exifProfile.GetValue tag

      v
      |> Option.ofObj
      |> Option.map (fun v -> v.Value)
      |> Skippable.ofOption

    let parseUshortArrayField (tag: ExifTag<ushort []>, case: ushort [] -> ExifValue) =
      tag |> parseushortArray |> Skippable.map case

    let parsebyte (tag: ExifTag<byte>) =
      let v = exifProfile.GetValue tag

      v
      |> Option.ofObj
      |> Option.map (fun v -> v.Value)
      |> Skippable.ofOption

    let parseByteField (tag: ExifTag<byte>, case: byte -> ExifValue) = tag |> parsebyte |> Skippable.map case

    let parseByteArray (tag: ExifTag<byte []>) =
      let v = exifProfile.GetValue tag

      v
      |> Option.ofObj
      |> Option.map (fun v -> v.Value)
      |> Skippable.ofOption

    let parseByteArrayField (tag: ExifTag<byte []>, case: byte [] -> ExifValue) =
      tag |> parseByteArray |> Skippable.map case

    let parseInt (tag: ExifTag<int>) =
      let v = exifProfile.GetValue tag

      v
      |> Option.ofObj
      |> Option.map (fun v -> v.Value)
      |> Skippable.ofOption

    let parseIntField (tag: ExifTag<int>, case: int -> ExifValue) = tag |> parseInt |> Skippable.map case

    let parseSignedRational (tag: ExifTag<SixLabors.ImageSharp.SignedRational []>) =
      let v = exifProfile.GetValue tag

      v
      |> Option.ofObj
      |> Option.map (fun v -> v.Value)
      |> Option.map (fun v ->
        v
        |> Array.map (fun v ->
          { SignedRational.Numerator = v.Numerator
            SignedRational.Denominator = v.Denominator }))
      |> Skippable.ofOption

    let parseFieldSignedRational
      (
        tag: ExifTag<SixLabors.ImageSharp.SignedRational []>,
        case: SignedRational [] -> ExifValue
      ) =
      tag |> parseSignedRational |> Skippable.map case

    let parseIntField (tag: ExifTag<int>, case: int -> ExifValue) = tag |> parseInt |> Skippable.map case

    let parseExifTag (tag: ExifTag<'T>) =
      let v = exifProfile.GetValue(tag)

      if box v = null then
        None
      else
        v.Value |> Option.ofObj

    let data =
      seq {
        yield parseRationalField (ExifTag.XPosition, ExifValue.XPosition)
        yield parseRationalField (ExifTag.YPosition, ExifValue.YPosition)
        yield parseRationalField (ExifTag.XResolution, ExifValue.XResolution)
        yield parseRationalField (ExifTag.YResolution, ExifValue.YResolution)
        yield parseRationalField (ExifTag.BatteryLevel, ExifValue.BatteryLevel)
        yield parseRationalField (ExifTag.ExposureTime, ExifValue.ExposureTime)
        yield parseRationalField (ExifTag.FNumber, ExifValue.FNumber)
        yield parseRationalField (ExifTag.MDScalePixel, ExifValue.MDScalePixel)
        yield parseRationalField (ExifTag.CompressedBitsPerPixel, ExifValue.CompressedBitsPerPixel)
        yield parseRationalField (ExifTag.ApertureValue, ExifValue.ApertureValue)
        yield parseRationalField (ExifTag.MaxApertureValue, ExifValue.MaxApertureValue)
        yield parseRationalField (ExifTag.SubjectDistance, ExifValue.SubjectDistance)
        yield parseRationalField (ExifTag.FocalLength, ExifValue.FocalLength)
        yield parseRationalField (ExifTag.FlashEnergy2, ExifValue.FlashEnergy2)
        yield parseRationalField (ExifTag.FocalPlaneXResolution2, ExifValue.FocalPlaneXResolution2)
        yield parseRationalField (ExifTag.FocalPlaneYResolution2, ExifValue.FocalPlaneYResolution2)
        yield parseRationalField (ExifTag.ExposureIndex2, ExifValue.ExposureIndex2)
        yield parseRationalField (ExifTag.Humidity, ExifValue.Humidity)
        yield parseRationalField (ExifTag.Pressure, ExifValue.Pressure)
        yield parseRationalField (ExifTag.Acceleration, ExifValue.Acceleration)
        yield parseRationalField (ExifTag.FlashEnergy, ExifValue.FlashEnergy)
        yield parseRationalField (ExifTag.FocalPlaneXResolution, ExifValue.FocalPlaneXResolution)
        yield parseRationalField (ExifTag.FocalPlaneYResolution, ExifValue.FocalPlaneYResolution)
        yield parseRationalField (ExifTag.ExposureIndex, ExifValue.ExposureIndex)
        yield parseRationalField (ExifTag.DigitalZoomRatio, ExifValue.DigitalZoomRatio)
        yield parseRationalField (ExifTag.GPSAltitude, ExifValue.GPSAltitude)
        yield parseRationalField (ExifTag.GPSDOP, ExifValue.GPSDOP)
        yield parseRationalField (ExifTag.GPSSpeed, ExifValue.GPSSpeed)
        yield parseRationalField (ExifTag.GPSTrack, ExifValue.GPSTrack)
        yield parseRationalField (ExifTag.GPSImgDirection, ExifValue.GPSImgDirection)
        yield parseRationalField (ExifTag.GPSDestBearing, ExifValue.GPSDestBearing)
        yield parseRationalField (ExifTag.GPSDestDistance, ExifValue.GPSDestDistance)
        yield parseStringField (ExifTag.ImageDescription, ExifValue.ImageDescription)

        //Rational[]
        yield parseRationalArrayField (ExifTag.WhitePoint, ExifValue.WhitePoint)
        yield parseRationalArrayField (ExifTag.PrimaryChromaticities, ExifValue.PrimaryChromaticities)
        yield parseRationalArrayField (ExifTag.YCbCrCoefficients, ExifValue.YCbCrCoefficients)
        yield parseRationalArrayField (ExifTag.ReferenceBlackWhite, ExifValue.ReferenceBlackWhite)
        yield parseRationalArrayField (ExifTag.GPSLatitude, ExifValue.GPSLatitude)
        yield parseRationalArrayField (ExifTag.GPSLongitude, ExifValue.GPSLongitude)
        yield parseRationalArrayField (ExifTag.GPSTimestamp, ExifValue.GPSTimestamp)
        yield parseRationalArrayField (ExifTag.GPSDestLatitude, ExifValue.GPSDestLatitude)
        yield parseRationalArrayField (ExifTag.GPSDestLongitude, ExifValue.GPSDestLongitude)
        yield parseRationalArrayField (ExifTag.LensSpecification, ExifValue.LensSpecification)
        //string
        yield parseStringField (ExifTag.Make, ExifValue.Make)
        yield parseStringField (ExifTag.Model, ExifValue.Model)
        yield parseStringField (ExifTag.Software, ExifValue.Software)
        yield parseStringField (ExifTag.DateTime, ExifValue.DateTime)
        yield parseStringField (ExifTag.Artist, ExifValue.Artist)
        yield parseStringField (ExifTag.HostComputer, ExifValue.HostComputer)
        yield parseStringField (ExifTag.Copyright, ExifValue.Copyright)
        yield parseStringField (ExifTag.DocumentName, ExifValue.DocumentName)
        yield parseStringField (ExifTag.PageName, ExifValue.PageName)
        yield parseStringField (ExifTag.InkNames, ExifValue.InkNames)
        yield parseStringField (ExifTag.TargetPrinter, ExifValue.TargetPrinter)
        yield parseStringField (ExifTag.ImageID, ExifValue.ImageID)
        yield parseStringField (ExifTag.MDLabName, ExifValue.MDLabName)
        yield parseStringField (ExifTag.MDSampleInfo, ExifValue.MDSampleInfo)
        yield parseStringField (ExifTag.MDPrepDate, ExifValue.MDPrepDate)
        yield parseStringField (ExifTag.MDPrepTime, ExifValue.MDPrepTime)
        yield parseStringField (ExifTag.MDFileUnits, ExifValue.MDFileUnits)
        yield parseStringField (ExifTag.SEMInfo, ExifValue.SEMInfo)
        yield parseStringField (ExifTag.SpectralSensitivity, ExifValue.SpectralSensitivity)
        yield parseStringField (ExifTag.DateTimeOriginal, ExifValue.DateTimeOriginal)
        yield parseStringField (ExifTag.DateTimeDigitized, ExifValue.DateTimeDigitized)
        yield parseStringField (ExifTag.SubsecTime, ExifValue.SubsecTime)
        yield parseStringField (ExifTag.SubsecTimeOriginal, ExifValue.SubsecTimeOriginal)
        yield parseStringField (ExifTag.SubsecTimeDigitized, ExifValue.SubsecTimeDigitized)
        yield parseStringField (ExifTag.RelatedSoundFile, ExifValue.RelatedSoundFile)
        yield parseStringField (ExifTag.FaxSubaddress, ExifValue.FaxSubaddress)
        yield parseStringField (ExifTag.OffsetTime, ExifValue.OffsetTime)
        yield parseStringField (ExifTag.OffsetTimeOriginal, ExifValue.OffsetTimeOriginal)
        yield parseStringField (ExifTag.OffsetTimeDigitized, ExifValue.OffsetTimeDigitized)
        yield parseStringField (ExifTag.SecurityClassification, ExifValue.SecurityClassification)
        yield parseStringField (ExifTag.ImageHistory, ExifValue.ImageHistory)
        yield parseStringField (ExifTag.ImageUniqueID, ExifValue.ImageUniqueID)
        yield parseStringField (ExifTag.OwnerName, ExifValue.OwnerName)
        yield parseStringField (ExifTag.SerialNumber, ExifValue.SerialNumber)
        yield parseStringField (ExifTag.LensMake, ExifValue.LensMake)
        yield parseStringField (ExifTag.LensModel, ExifValue.LensModel)
        yield parseStringField (ExifTag.LensSerialNumber, ExifValue.LensSerialNumber)
        yield parseStringField (ExifTag.GDALMetadata, ExifValue.GDALMetadata)
        yield parseStringField (ExifTag.GDALNoData, ExifValue.GDALNoData)
        yield parseStringField (ExifTag.GPSLatitudeRef, ExifValue.GPSLatitudeRef)
        yield parseStringField (ExifTag.GPSLongitudeRef, ExifValue.GPSLongitudeRef)
        yield parseStringField (ExifTag.GPSSatellites, ExifValue.GPSSatellites)
        yield parseStringField (ExifTag.GPSStatus, ExifValue.GPSStatus)
        yield parseStringField (ExifTag.GPSMeasureMode, ExifValue.GPSMeasureMode)
        yield parseStringField (ExifTag.GPSSpeedRef, ExifValue.GPSSpeedRef)
        yield parseStringField (ExifTag.GPSTrackRef, ExifValue.GPSTrackRef)
        yield parseStringField (ExifTag.GPSImgDirectionRef, ExifValue.GPSImgDirectionRef)
        yield parseStringField (ExifTag.GPSMapDatum, ExifValue.GPSMapDatum)
        yield parseStringField (ExifTag.GPSDestLatitudeRef, ExifValue.GPSDestLatitudeRef)
        yield parseStringField (ExifTag.GPSDestLongitudeRef, ExifValue.GPSDestLongitudeRef)
        yield parseStringField (ExifTag.GPSDestBearingRef, ExifValue.GPSDestBearingRef)
        yield parseStringField (ExifTag.GPSDestDistanceRef, ExifValue.GPSDestDistanceRef)
        yield parseStringField (ExifTag.GPSDateStamp, ExifValue.GPSDateStamp)
        //number
        yield parseNumberField (ExifTag.ImageWidth, ExifValue.ImageWidth)
        yield parseNumberField (ExifTag.ImageLength, ExifValue.ImageLength)
        yield parseNumberField (ExifTag.RowsPerStrip, ExifValue.RowsPerStrip)
        yield parseNumberField (ExifTag.TileWidth, ExifValue.TileWidth)
        yield parseNumberField (ExifTag.TileLength, ExifValue.TileLength)
        yield parseNumberField (ExifTag.BadFaxLines, ExifValue.BadFaxLines)
        yield parseNumberField (ExifTag.ConsecutiveBadFaxLines, ExifValue.ConsecutiveBadFaxLines)
        yield parseNumberField (ExifTag.PixelXDimension, ExifValue.PixelXDimension)
        yield parseNumberField (ExifTag.PixelYDimension, ExifValue.PixelYDimension)
        //ushort
        yield parseUshortField (ExifTag.OldSubfileType, ExifValue.OldSubfileType)
        yield parseUshortField (ExifTag.Compression, ExifValue.Compression)
        yield parseUshortField (ExifTag.PhotometricInterpretation, ExifValue.PhotometricInterpretation)
        yield parseUshortField (ExifTag.Thresholding, ExifValue.Thresholding)
        yield parseUshortField (ExifTag.CellWidth, ExifValue.CellWidth)
        yield parseUshortField (ExifTag.CellLength, ExifValue.CellLength)
        yield parseUshortField (ExifTag.FillOrder, ExifValue.FillOrder)
        yield parseUshortField (ExifTag.Orientation, ExifValue.Orientation)
        yield parseUshortField (ExifTag.SamplesPerPixel, ExifValue.SamplesPerPixel)
        yield parseUshortField (ExifTag.PlanarConfiguration, ExifValue.PlanarConfiguration)
        yield parseUshortField (ExifTag.Predictor, ExifValue.Predictor)
        yield parseUshortField (ExifTag.GrayResponseUnit, ExifValue.GrayResponseUnit)
        yield parseUshortField (ExifTag.ResolutionUnit, ExifValue.ResolutionUnit)
        yield parseUshortField (ExifTag.CleanFaxData, ExifValue.CleanFaxData)
        yield parseUshortField (ExifTag.InkSet, ExifValue.InkSet)
        yield parseUshortField (ExifTag.NumberOfInks, ExifValue.NumberOfInks)
        yield parseUshortField (ExifTag.DotRange, ExifValue.DotRange)
        yield parseUshortField (ExifTag.Indexed, ExifValue.Indexed)
        yield parseUshortField (ExifTag.OPIProxy, ExifValue.OPIProxy)
        yield parseUshortField (ExifTag.JPEGProc, ExifValue.JPEGProc)
        yield parseUshortField (ExifTag.JPEGRestartInterval, ExifValue.JPEGRestartInterval)
        yield parseUshortField (ExifTag.YCbCrPositioning, ExifValue.YCbCrPositioning)
        yield parseUshortField (ExifTag.Rating, ExifValue.Rating)
        yield parseUshortField (ExifTag.RatingPercent, ExifValue.RatingPercent)
        yield parseUshortField (ExifTag.ExposureProgram, ExifValue.ExposureProgram)
        yield parseUshortField (ExifTag.Interlace, ExifValue.Interlace)
        yield parseUshortField (ExifTag.SelfTimerMode, ExifValue.SelfTimerMode)
        yield parseUshortField (ExifTag.SensitivityType, ExifValue.SensitivityType)
        yield parseUshortField (ExifTag.MeteringMode, ExifValue.MeteringMode)
        yield parseUshortField (ExifTag.LightSource, ExifValue.LightSource)
        yield parseUshortField (ExifTag.FocalPlaneResolutionUnit2, ExifValue.FocalPlaneResolutionUnit2)
        yield parseUshortField (ExifTag.SensingMethod2, ExifValue.SensingMethod2)
        yield parseUshortField (ExifTag.Flash, ExifValue.Flash)
        yield parseUshortField (ExifTag.ColorSpace, ExifValue.ColorSpace)
        yield parseUshortField (ExifTag.FocalPlaneResolutionUnit, ExifValue.FocalPlaneResolutionUnit)
        yield parseUshortField (ExifTag.SensingMethod, ExifValue.SensingMethod)
        yield parseUshortField (ExifTag.CustomRendered, ExifValue.CustomRendered)
        yield parseUshortField (ExifTag.ExposureMode, ExifValue.ExposureMode)
        yield parseUshortField (ExifTag.WhiteBalance, ExifValue.WhiteBalance)
        yield parseUshortField (ExifTag.FocalLengthIn35mmFilm, ExifValue.FocalLengthIn35mmFilm)
        yield parseUshortField (ExifTag.SceneCaptureType, ExifValue.SceneCaptureType)
        yield parseUshortField (ExifTag.GainControl, ExifValue.GainControl)
        yield parseUshortField (ExifTag.Contrast, ExifValue.Contrast)
        yield parseUshortField (ExifTag.Saturation, ExifValue.Saturation)
        yield parseUshortField (ExifTag.Sharpness, ExifValue.Sharpness)
        yield parseUshortField (ExifTag.SubjectDistanceRange, ExifValue.SubjectDistanceRange)
        yield parseUshortField (ExifTag.GPSDifferential, ExifValue.GPSDifferential)
        // byte field
        yield parseByteField (ExifTag.FileSource, ExifValue.FileSource)
        yield parseByteField (ExifTag.SceneType, ExifValue.SceneType)
        yield parseByteField (ExifTag.FaxProfile, ExifValue.FaxProfile)
        yield parseByteField (ExifTag.ModeNumber, ExifValue.ModeNumber)
        yield parseByteField (ExifTag.GPSAltitudeRef, ExifValue.GPSAltitudeRef)
        //uint
        yield parseUintField (ExifTag.SubfileType, ExifValue.SubfileType)
        yield parseUintField (ExifTag.SubIFDOffset, ExifValue.SubIFDOffset)
        yield parseUintField (ExifTag.GPSIFDOffset, ExifValue.GPSIFDOffset)
        yield parseUintField (ExifTag.T4Options, ExifValue.T4Options)
        yield parseUintField (ExifTag.T6Options, ExifValue.T6Options)
        yield parseUintField (ExifTag.XClipPathUnits, ExifValue.XClipPathUnits)
        yield parseUintField (ExifTag.YClipPathUnits, ExifValue.YClipPathUnits)
        yield parseUintField (ExifTag.ProfileType, ExifValue.ProfileType)
        yield parseUintField (ExifTag.CodingMethods, ExifValue.CodingMethods)
        yield parseUintField (ExifTag.T82ptions, ExifValue.T82ptions)
        yield parseUintField (ExifTag.JPEGInterchangeFormat, ExifValue.JPEGInterchangeFormat)
        yield parseUintField (ExifTag.JPEGInterchangeFormatLength, ExifValue.JPEGInterchangeFormatLength)
        yield parseUintField (ExifTag.MDFileTag, ExifValue.MDFileTag)
        yield parseUintField (ExifTag.StandardOutputSensitivity, ExifValue.StandardOutputSensitivity)
        yield parseUintField (ExifTag.RecommendedExposureIndex, ExifValue.RecommendedExposureIndex)
        yield parseUintField (ExifTag.ISOSpeed, ExifValue.ISOSpeed)
        yield parseUintField (ExifTag.ISOSpeedLatitudeyyy, ExifValue.ISOSpeedLatitudeyyy)
        yield parseUintField (ExifTag.ISOSpeedLatitudezzz, ExifValue.ISOSpeedLatitudezzz)
        yield parseUintField (ExifTag.FaxRecvParams, ExifValue.FaxRecvParams)
        yield parseUintField (ExifTag.FaxRecvTime, ExifValue.FaxRecvTime)
        yield parseUintField (ExifTag.ImageNumber, ExifValue.ImageNumber)
        // SignedRational
        yield parseFieldSignedRational (ExifTag.Decode, ExifValue.Decode)
        yield parseByteArrayField (ExifTag.JPEGTables, ExifValue.JPEGTables)
        yield parseByteArrayField (ExifTag.OECF, ExifValue.OECF)
        yield parseByteArrayField (ExifTag.ExifVersion, ExifValue.ExifVersion)
        yield parseByteArrayField (ExifTag.ComponentsConfiguration, ExifValue.ComponentsConfiguration)
        yield parseByteArrayField (ExifTag.MakerNote, ExifValue.MakerNote)
        yield parseByteArrayField (ExifTag.FlashpixVersion, ExifValue.FlashpixVersion)
        yield parseByteArrayField (ExifTag.SpatialFrequencyResponse, ExifValue.SpatialFrequencyResponse)
        yield parseByteArrayField (ExifTag.SpatialFrequencyResponse2, ExifValue.SpatialFrequencyResponse2)
        yield parseByteArrayField (ExifTag.Noise, ExifValue.Noise)
        yield parseByteArrayField (ExifTag.CFAPattern, ExifValue.CFAPattern)
        yield parseByteArrayField (ExifTag.DeviceSettingDescription, ExifValue.DeviceSettingDescription)
        yield parseByteArrayField (ExifTag.ImageSourceData, ExifValue.ImageSourceData)
        // ushort array
        yield parseUshortArrayField (ExifTag.BitsPerSample, ExifValue.BitsPerSample)
        yield parseUshortArrayField (ExifTag.MinSampleValue, ExifValue.MinSampleValue)
        yield parseUshortArrayField (ExifTag.MaxSampleValue, ExifValue.MaxSampleValue)
        yield parseUshortArrayField (ExifTag.GrayResponseCurve, ExifValue.GrayResponseCurve)
        yield parseUshortArrayField (ExifTag.ColorMap, ExifValue.ColorMap)
        yield parseUshortArrayField (ExifTag.ExtraSamples, ExifValue.ExtraSamples)
        yield parseUshortArrayField (ExifTag.PageNumber, ExifValue.PageNumber)
        yield parseUshortArrayField (ExifTag.TransferFunction, ExifValue.TransferFunction)
        yield parseUshortArrayField (ExifTag.HalftoneHints, ExifValue.HalftoneHints)
        yield parseUshortArrayField (ExifTag.SampleFormat, ExifValue.SampleFormat)
        yield parseUshortArrayField (ExifTag.TransferRange, ExifValue.TransferRange)
        yield parseUshortArrayField (ExifTag.DefaultImageColor, ExifValue.DefaultImageColor)
        yield parseUshortArrayField (ExifTag.JPEGLosslessPredictors, ExifValue.JPEGLosslessPredictors)
        yield parseUshortArrayField (ExifTag.JPEGPointTransforms, ExifValue.JPEGPointTransforms)
        yield parseUshortArrayField (ExifTag.YCbCrSubsampling, ExifValue.YCbCrSubsampling)
        yield parseUshortArrayField (ExifTag.CFARepeatPatternDim, ExifValue.CFARepeatPatternDim)
        yield parseUshortArrayField (ExifTag.IntergraphPacketData, ExifValue.IntergraphPacketData)
        yield parseUshortArrayField (ExifTag.ISOSpeedRatings, ExifValue.ISOSpeedRatings)
        yield parseUshortArrayField (ExifTag.SubjectArea, ExifValue.SubjectArea)
        yield parseUshortArrayField (ExifTag.SubjectLocation, ExifValue.SubjectLocation)
        // Numberarray
        yield parseNumberArrayField (ExifTag.StripOffsets, ExifValue.StripOffsets)
        yield parseNumberArrayField (ExifTag.StripByteCounts, ExifValue.StripByteCounts)
        yield parseNumberArrayField (ExifTag.TileByteCounts, ExifValue.TileByteCounts)
        yield parseNumberArrayField (ExifTag.ImageLayer, ExifValue.ImageLayer)
        // uin32[]
        yield parseUintArrayField (ExifTag.FreeOffsets, ExifValue.FreeOffsets)
        yield parseUintArrayField (ExifTag.FreeByteCounts, ExifValue.FreeByteCounts)
        yield parseUintArrayField (ExifTag.ColorResponseUnit, ExifValue.ColorResponseUnit)
        yield parseUintArrayField (ExifTag.TileOffsets, ExifValue.TileOffsets)
        yield parseUintArrayField (ExifTag.SMinSampleValue, ExifValue.SMinSampleValue)
        yield parseUintArrayField (ExifTag.SMaxSampleValue, ExifValue.SMaxSampleValue)
        yield parseUintArrayField (ExifTag.JPEGQTables, ExifValue.JPEGQTables)
        yield parseUintArrayField (ExifTag.JPEGDCTables, ExifValue.JPEGDCTables)
        yield parseUintArrayField (ExifTag.JPEGACTables, ExifValue.JPEGACTables)
        yield parseUintArrayField (ExifTag.StripRowCounts, ExifValue.StripRowCounts)
        yield parseUintArrayField (ExifTag.IntergraphRegisters, ExifValue.IntergraphRegisters)
        yield parseUintArrayField (ExifTag.TimeZoneOffset, ExifValue.TimeZoneOffset)
        yield parseUintArrayField (ExifTag.SubIFDs, ExifValue.SubIFDs)
      }
      |> Seq.choose Skippable.toOption
      |> Seq.toList

    // ExifTag.GPSLatitude

    Some data

let readExifFromStream (s: System.IO.Stream) =
  use image = Image.Load s

  readExif image.Metadata.ExifProfile


module ExifCache =
  let private memoryCache =
    new Microsoft.Extensions.Caching.Memory.MemoryCache(Microsoft.Extensions.Caching.Memory.MemoryCacheOptions())

  let private memoryCacheProvider =
    Polly.Caching.Memory.MemoryCacheProvider(memoryCache)
  // Create a Polly cache policy using that Polly.Caching.Memory.MemoryCacheProvider instance.
  let cachePolicy = Policy.CacheAsync(memoryCacheProvider, TimeSpan.FromSeconds(30))


let readExifData (blobId: FileId, getStreamAsync: unit -> Task<System.IO.Stream>) =
  task {

    let f ctx =
      task {
        printfn "Reading exif data"

        let! stream = getStreamAsync ()
        let result = stream |> readExifFromStream

        return result
      }

    let! result = ExifCache.cachePolicy.ExecuteAndCaptureAsync(f, Context(blobId.value().ToString()))

    return result
  }
