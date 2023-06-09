module AzFiles.FileUploads

open System
open AzureFiles
open Microsoft.AspNetCore.Mvc
open Microsoft.Extensions.Logging
open BlobService
open System.IO
open FsToolkit.ErrorHandling
open Microsoft.Extensions.DependencyInjection
open SixLabors.ImageSharp

let validateAndUpload (ctx: IWebRequestContext) (serviceProvider: IServiceProvider) file =
  asyncResult {
    // todo, maybe only if image
    use image = Image.Load(file.FormFile.OpenReadStream())

    let getStream () =
      file.FormFile.OpenReadStream()
      |> System.Threading.Tasks.Task.FromResult
    // just to add it to the cache
    let! result = Exif.readExifData (file.Id, getStream)

    use stream = new MemoryStream()
    file.FormFile.OpenReadStream().CopyTo(stream)
    stream.Position <- 0

    use scope = serviceProvider.CreateScope()
    let ctx = scope.ServiceProvider.GetRequiredService<IWebRequestContext>()

    do!
      validateFileIsNotAlreadyUploaded ctx.DocumentSession file
      |> AsyncResult.mapError ErrorResult.FileIsDuplicate

    let! result = asyncUploadFile ctx file stream image

    return result
  }

type TestController(logger: ILogger<TestController>, ctx: IWebRequestContext, serviceProvider: IServiceProvider) =

  inherit ControllerBase()

  [<HttpPost("api/files/upload-files-async")>]
  member this.AsyncUploadFiles() =
    async {

      logger.LogInformation("handle upload form files {@formfiles}", ctx.HttpContext.Request.Form.Files)

      let! init =
        ctx.HttpContext.Request.Form.Files
        |> Seq.map Workflow.initiallyHandleFormFile
        |> Seq.map (validateAndUpload ctx serviceProvider)
        |> fun x -> x, 5
        |> Async.Parallel

      return MediatR.Unit
    }
    |> Async.StartAsTask