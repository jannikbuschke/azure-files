module AzFiles.Features.GetBlobMetadata

open System.Collections.Generic
open AzFiles
open AzFiles.Exif
open AzFiles
open Glow.Core.Actions
open MediatR

[<Action(Route = "api/blob/get-blob-metadata", AllowAnonymous = true)>]
type GetBlobMetadata =
  { BlobId: string }
  interface IRequest<IDictionary<string, string>>

type GetBlobMetadataHandler(ctx: IWebRequestContext) =

  interface IRequestHandler<GetBlobMetadata, IDictionary<string, string>> with
    member this.Handle(request, _) =
      task {
        let! container = ctx.GetSrcContainer()
        let client = container.GetBlobClient request.BlobId
        let! response = client.GetPropertiesAsync()
        return response.Value.Metadata
      }


[<Action(Route = "api/blob/get-exif-data-from-blob-file", AllowAnonymous = true)>]
type GetExifDataFromBlobFile =
  { BlobId: FileId }
  interface IRequest<ExifValue list option>

type GetExifDataFromBlobFileHandler(ctx: IWebRequestContext) =
  interface IRequestHandler<GetExifDataFromBlobFile, ExifValue list option> with
    member this.Handle(request, token) =
      task {

        let stopWatch = System.Diagnostics.Stopwatch.StartNew()

        let getStream () =
          task {
            let! container = ctx.GetSrcContainer()
            let client = container.GetBlobClient(request.BlobId.value().ToString())

            let! s = client.DownloadStreamingAsync()
            return s.Value.Content
          }

        let! result = Exif.readExifData (ctx.GetLogger<obj>(), request.BlobId, getStream)
        //
        // let exif =
        //   Exif.readExifFromStream s.Value.Content
        //   |> Option.map Seq.toList

        stopWatch.Stop()
        printfn "%f" stopWatch.Elapsed.TotalMilliseconds
        return result.Result
      }
