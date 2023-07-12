namespace AzFiles

open System
open AzureFiles
open Microsoft.AspNetCore.Cors
open Microsoft.AspNetCore.Mvc
open Microsoft.Extensions.Logging
open BlobService
open System.IO
open FsToolkit.ErrorHandling
open Microsoft.Extensions.DependencyInjection
open SixLabors.ImageSharp
open System.Threading.Tasks

[<Route("api")>]
type TestControlle2r(logger: ILogger<TestControlle2r>, ctx: IWebRequestContext, serviceProvider: IServiceProvider) =

  inherit ControllerBase()

  [<EnableCors("AllowAll")>]
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
              |> Seq.map (AzFiles.FileUploads.validateAndUpload ctx serviceProvider)
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
