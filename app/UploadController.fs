namespace AzFiles

open System
open System.Diagnostics
open AzFiles
open BlobService
open System.IO
open FsToolkit.ErrorHandling
open Microsoft.Extensions.DependencyInjection
open SixLabors.ImageSharp

module FileUploads =

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
            |> Result.Ok
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

open Microsoft.AspNetCore.Mvc
open Microsoft.Extensions.Logging
open System.Threading.Tasks

[<Route("api")>]
type TestControlle2r(logger: ILogger<TestControlle2r>, ctx: IWebRequestContext, serviceProvider: IServiceProvider) =

  inherit ControllerBase()

  // [<EnableCors("AllowAll")>]
  [<HttpGet("html")>]
  member this.Get() = this.Ok("hello world")

  [<HttpPost("upload-file")>]
  member this.UploadFile() =
    async {
      let ctx = this.HttpContext.RequestServices.GetRequiredService<IWebRequestContext>()

      let serviceProvider =
        this.HttpContext.RequestServices.GetRequiredService<IServiceProvider>()

      let logger = ctx.GetLogger<obj>()
      logger.LogInformation("handle upload form files {@formfiles}", ctx.HttpContext.Request.Form.Files)

      // let validateAndUpload = x ctx serviceProvider

      let! result =
        try
          task {
            let! init =
              ctx.HttpContext.Request.Form.Files
              |> Seq.map Workflow.initiallyHandleFormFile
              |> Seq.map (FileUploads.validateAndUpload ctx serviceProvider)
              |> fun x -> x, 5
              |> Async.Parallel

            return
              init
              |> Seq.map (fun v ->
                v
                |> Result.mapError (fun error ->
                  { ApiError.Message = ""
                    Info = Some(ErrorResult error) }))
              |> Seq.toList
          }
          |> Async.AwaitTask
        with
        | e ->
          [ Error(
              { ApiError.Message = e.Message
                Info = None }
            ) ]
          |> Task.FromResult
          |> Async.AwaitTask
      // sprintf "Error %s" e.Message
      // None

      return result
    }
    |> Async.StartAsTask