namespace AzFiles.Features.Gallery

open AzFiles.Features.GetTaggedImages

type GalleryItem = { Width: int; Height: int }

type Gallery =
  { Id: System.Guid
    Name: string
    Description: string option
    Items: AzFiles.Galleries.Image list }

  member this.Key() = this.Id |> AzFiles.Galleries.GalleryId

type GalleryBasedOn = Filter of ImageFilter