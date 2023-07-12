module AzFiles.FileUploads

open System
open System.Diagnostics
open AzureFiles
open BlobService
open System.IO
open FsToolkit.ErrorHandling
open Microsoft.Extensions.DependencyInjection
open SixLabors.ImageSharp

let validateAndUpload (ctx: IWebRequestContext) (serviceProvider: IServiceProvider) file =
  asyncResult {

    do!
      validateFileIsNotAlreadyUploaded ctx.DocumentSession file
      |> AsyncResult.mapError ErrorResult.FileIsDuplicate

    let stopwatch = Stopwatch()
    stopwatch.Start()
    let fileStream = file.FormFile.OpenReadStream()
    let! info = Image.IdentifyAsync(fileStream)
    // sprintf "After Identify: %s" (stopwatch.Elapsed.ToString())
    fileStream.Position <- 0

    let! _ = Image.DetectFormatAsync(fileStream)
    // sprintf "After DetectFormat: %s" (stopwatch.Elapsed.ToString())
    fileStream.Position <- 0

    use! image =
      if info = null then
        System.Threading.Tasks.Task.FromResult null
      else
        Image.LoadAsync(fileStream)

    fileStream.Position <- 0
    // let getStream () =
    //   fileStream
    //   |> System.Threading.Tasks.Task.FromResult
    // just to add it to the cache
    let! _ =
      Exif.readExifData (
        ctx.GetLogger<obj>(),
        file.Id,
        fun () ->
          fileStream
          |> System.Threading.Tasks.Task.FromResult
      )

    fileStream.Position <- 0
    use stream = new MemoryStream()
    fileStream.CopyTo(stream)
    stream.Position <- 0

    use scope = serviceProvider.CreateScope()
    let ctx = scope.ServiceProvider.GetRequiredService<IWebRequestContext>()

    let! result = asyncUploadFile ctx file stream image

    return result
  }

// type TestController(logger: ILogger<TestController>, ctx: IWebRequestContext, serviceProvider: IServiceProvider) =
//
//   inherit ControllerBase()
//
//   [<HttpGet("api/html")>]
//   member this.Get() = this.Ok("hello world")
//
//   [<HttpPost("api/files/upload-files-async")>]
//   member this.AsyncUploadFiles() =
//     async {
//       failwith "not working"
//
//       logger.LogInformation("handle upload form files {@formfiles}", ctx.HttpContext.Request.Form.Files)
//
//       let! init =
//         ctx.HttpContext.Request.Form.Files
//         |> Seq.map Workflow.initiallyHandleFormFile
//         |> Seq.map (validateAndUpload ctx serviceProvider)
//         |> fun x -> x, 5
//         |> Async.Parallel
//
//       return init
//     }
//     |> Async.StartAsTask