module AzFiles.ImageProcessing

open System.IO
open AzureFiles
open SixLabors.ImageSharp
open SixLabors.ImageSharp.Formats.Jpeg
open SixLabors.ImageSharp.Processing
open SkiaSharp

let resizeImage (stream: Stream) (mainAxisLength: int) =
  task {
    let image = Image.Load(stream)

    let originalSize: Dimension =
      { Width = image.Width
        Height = image.Height }

    let pixels = originalSize.Width * originalSize.Height

    let targetSize: Dimension =
      if originalSize.Width > originalSize.Height then
        { Width = mainAxisLength
          Height = mainAxisLength / pixels }
      else
        { Height = mainAxisLength
          Width = mainAxisLength / pixels }

    image.Mutate
      (fun x ->
        x.Resize(targetSize.Width, targetSize.Height, true)
        |> ignore)

    let result = new MemoryStream()

    do! image.SaveAsync(result, JpegEncoder())

    result.Position <- 0

    return targetSize, result
  }

let resizeWithImageSharp (path: string) (mainAxisLength: int) =
  async {
    let image = Image.Load(path)

    let originalSize: Dimension =
      { Width = image.Width
        Height = image.Height }

    let pixels = originalSize.Width * originalSize.Height

    let targetSize: Dimension =
      if originalSize.Width > originalSize.Height then
        { Width = mainAxisLength
          Height = mainAxisLength / pixels }
      else
        { Height = mainAxisLength
          Width = mainAxisLength / pixels }

    image.Mutate
      (fun x ->
        x.Resize(targetSize.Width, targetSize.Height, true)
        |> ignore)

    let result = new MemoryStream()

    do!
      image.SaveAsync(result, JpegEncoder())
      |> Async.AwaitTask

    result.Position <- 0

    return targetSize, result
  }


let resize (stream: System.IO.Stream) (dimension: Dimension) (quality: SKFilterQuality) =
  use bitmap = SKBitmap.Decode(stream)

  //  let height =
//    System.Math.Min(dimension.Height, bitmap.Height)
//
//  let width =
//    System.Math.Min(dimension.Width, bitmap.Width)
//
//  let dim = { Width = width; Height = height }

  use skaledBitmap =
    bitmap.Resize(SKImageInfo(dimension.Width, dimension.Height), quality)

  use skaledImage = SKImage.FromBitmap skaledBitmap
  use data = skaledImage.Encode()
  data, dimension

let printTotalFileBytes (input: string) = async { return 5 }

let asyncListProcess (input: string list) =
  input
  |> Seq.map printTotalFileBytes
  |> Async.Sequential
  |> Async.Ignore
  |> Async.RunSynchronously
  |> ignore
