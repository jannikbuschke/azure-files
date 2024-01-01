namespace AzFiles.Features.DownloadFile

open AzFiles
open Microsoft.AspNetCore.Mvc

type DownloadFileController(ctx: IWebRequestContext) =
  inherit ControllerBase()

  [<HttpGet("/content/inbox/{filename}")>]
  member this.Get(filename: string) =
    task {
      let! container = ctx.GetInboxContainerAsync()
      printfn "trying to get blob %s" filename
      let client = container.GetBlobClient(filename)
      let! result = client.DownloadAsync()
      let info = result.Value
      info.Content.CopyTo(this.Response.Body)
      do! this.Response.CompleteAsync()
    }

  [<HttpGet("/content/src/{id}")>]
  member this.GetSourcefile(id: string) =
    task {
      let! container = ctx.GetSrcContainerAsync()
      let client = container.GetBlobClient(id)
      let! result = client.DownloadAsync()
      let info = result.Value
      // info.Content.Position <- 0
      return this.File(info.Content, "application/octet-stream")
    // info.Content.CopyTo(this.Response.Body)
    // do! this.Response.CompleteAsync()
    }
