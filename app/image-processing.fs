module AzFiles.ImageProcessing

open System.IO
open AzFiles
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


    printf "original size (width=%d, height=%d)\n" originalSize.Width originalSize.Height

    // let pixels = originalSize.Width * originalSize.Height

    let targetSize: Dimension =
      if originalSize.Width > originalSize.Height then
        { Width = mainAxisLength; Height = 0 }
      else
        { Height = mainAxisLength; Width = 0 }

    printf "target size (width=%d, height=%d)\n" targetSize.Width targetSize.Height

    image.Mutate (fun x ->
      x.Resize(targetSize.Width, targetSize.Height, true)
      |> ignore)

    let targetSize =
      { Width = image.Width
        Height = image.Height }

    printf "mutated image size (width=%d, height=%d)\n" image.Width image.Height

    let result = new MemoryStream()

    do! image.SaveAsync(result, JpegEncoder())

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
