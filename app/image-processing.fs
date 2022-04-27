module AzFiles.ImageProcessing

open SkiaSharp

type Dimension = { Width: int; Height: int }

let resize (stream: System.IO.Stream) (dimension: Dimension) (quality: SKFilterQuality) =
  use bitmap = SKBitmap.Decode(stream)

  let height =
    System.Math.Min(dimension.Height, bitmap.Height)

  let width =
    System.Math.Min(dimension.Width, bitmap.Width)

  let dim = { Width = width; Height = height }

  use skaledBitmap =
    bitmap.Resize(SKImageInfo(width, height), quality)


  use skaledImage = SKImage.FromBitmap skaledBitmap
  use data = skaledImage.Encode()
  data.AsStream(), dim

let printTotalFileBytes (input: string) = async { return 5 }

let asyncListProcess (input: string list) =
  input
  |> Seq.map printTotalFileBytes
  |> Async.Sequential
  |> Async.Ignore
  |> Async.RunSynchronously
  |> ignore