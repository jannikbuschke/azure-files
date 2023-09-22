namespace AzFiles

open System
open System.Collections.Generic
open System.Globalization
open System.Web
open SixLabors.ImageSharp
open SixLabors.ImageSharp.Metadata.Profiles.Exif

module Metadata =

  let tryGetExifValue (exif: ExifProfile) (tag: ExifTag<string>) =
    exif.GetValue(tag) |> Option.ofObj |> Option.map (fun v -> v.Value)

  let tryGetUint16ArrayExifValue (exif: ExifProfile) (tag: ExifTag<uint16 array>) =
    exif.GetValue(tag) |> Option.ofObj |> Option.map (fun v -> v.Value)

  let tryGetRationalArrayExifValue (exif: ExifProfile) (tag: ExifTag<Rational array>) =
    exif.GetValue(tag) |> Option.ofObj |> Option.map (fun v -> v.Value)

  let tryGetValue (dict: IDictionary<string, string>) (key: string) =
    match dict.TryGetValue key with
    | true, value -> value |> Option.ofObj |> Option.map HttpUtility.HtmlDecode
    | false, _ -> None

  let getValue (dict: IDictionary<string, string>) (key: string) = dict[key] |> HttpUtility.HtmlDecode

  let tryGetLocalChecksum (dict: IDictionary<string, string>) =
    tryGetValue dict "local_checksum" |> Option.map Checksum.Checksum

  let tryGetOriginalFilename (dict: IDictionary<string, string>) = tryGetValue dict "original_filename"

  let tryGetId (dict: IDictionary<string, string>) =
    tryGetValue dict "id"
    |> Option.map HttpUtility.HtmlDecode
    |> Option.map Guid.Parse
    |> Option.map FileId.create

  let encodeLocation (location: Rational array) =
    location
    |> Array.map (fun v -> v.ToString())
    |> String.concat ";"
    |> HttpUtility.HtmlEncode

  let decodeLocation (location: string) =
    location
    |> HttpUtility.HtmlDecode
    |> (fun v -> v.Split [| ';' |])
    |> Array.map (fun v -> UInt16.Parse v)
    |> Array.toList

  // let getlocation (dict: IDictionary<string, string>) =
  //   getValue dict "gps_latitude"
  //   |> decodeLocation
  //   |> List.toArray
  //   |> fun latitude ->
  //
  //        getValue dict "gps_longitude"
  //        |> decodeLocation
  //        |> List.toArray
  //        |> fun longitude ->
  //
  //             { Latitude = latitude
  //               Longitude = longitude }

  let tryGetDateTime (dict: IDictionary<string, string>) =
    tryGetValue dict "datetime"
    |> Option.map (fun input ->
      let success, x =
        DateTimeOffset.TryParseExact(
          input = input,
          format = "yyyy:MM:dd HH:mm:ss",
          formatProvider = null,
          styles = DateTimeStyles.AssumeLocal
        )

      x)

  let createMetadata (localChecksum: Checksum) (originalFilename: string) (id: FileId) (image: Image) =
    let d = Dictionary<string, string>()

    seq {
      ("local_checksum", localChecksum.value () |> HttpUtility.HtmlEncode)
      ("original_filename", originalFilename |> HttpUtility.HtmlEncode)

      ("id", id |> FileId.value |> (fun v -> v.ToString()) |> HttpUtility.HtmlEncode)
    }
    |> Seq.iter d.Add

    if image <> null then
      d.Add("width", image.Width.ToString())
      d.Add("height", image.Height.ToString())

    // let exifProperties =
    //   AzFiles.Exif.readExif image.Metadata.ExifProfile
    //   |> Option.map Seq.toList

    // let image = exifProperties |> Option.map(fun properties-> {|
    //               Width = image.Width
    //               Height = image.Height
    //               ExifProperties = properties
    //                  |})

    // TODO: maybe add to dictionary?
    d