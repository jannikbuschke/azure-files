namespace AzFiles.Features.GoogleDrive

open AzFiles
open Glow.Core.Actions
open Google.Apis.Download
open Marten
open MediatR

open System.Text
open Google.Apis.Auth.OAuth2
open Google.Apis.Drive.v3
open Google.Apis.Services
open Google.Apis.Upload
open Google.Apis.Util.Store
open System
open System.IO
open System.Threading

open Google.Apis.Auth.OAuth2
open Google.Apis.Services
open Google.Apis.Util.Store

open FsToolkit.ErrorHandling

module Google =

  let scopes = [| DriveService.Scope.Drive |]
  let applicationName = "Google Drive API Sample"

  let clientid = Environment.GetEnvironmentVariable("GOOGLE_CLIENT_ID")
  let clientSecret = Environment.GetEnvironmentVariable("GOOGLE_CLIENT_SECRET")

  let credential =
    GoogleWebAuthorizationBroker.AuthorizeAsync(
      ClientSecrets(ClientId = clientid, ClientSecret = clientSecret),
      scopes,
      "user",
      CancellationToken.None,
      FileDataStore("Books.ListMyLibrary")
    )
    |> Async.AwaitTask
    |> Async.RunSynchronously

  let service =
    new DriveService(
      new BaseClientService.Initializer(HttpClientInitializer = credential, ApplicationName = applicationName)
    )

// Create a new file
// let fileMetadata =
//     new Google.Apis.Drive.v3.Data.File(Name = "Sample File", MimeType = "text/plain")
//
// let bytes = "Hello World 2ß23-07-11" |> Encoding.UTF8.GetBytes
// let request, response =
//     use stream =  new MemoryStream( bytes)
//     // use stream = new FileStream("sample.txt", FileMode.Open)
//     let request = service.Files.Create(fileMetadata, stream, "text/plain")
//     let result = request.UploadAsync(CancellationToken.None) |> Async.AwaitTask |> Async.RunSynchronously
//     request, result


// if response.Status = UploadStatus.Failed then
//   printfn "Error uploading file: %s" response.Exception.Message
//   exit 1
//
//
// let id = request.ResponseBody.Id
//
// printfn "File ID: %s" id

type GDriveFile = { Id: string; Name: string }

[<Action(Route = "api/g-drive/show-files", AllowAnonymous = true)>]
type GetGoogleDriveFiles() =
  class
  end

  interface IRequest<Result<GDriveFile list, ApiError>>

[<Action(Route = "api/g-drive/download-file-to-inbox", AllowAnonymous = true)>]
type DownloadFileToInbox =
  { Id: string }
  interface IRequest<Result<unit, ApiError>>

type Handler(ctx: IWebRequestContext) =
  interface IRequestHandler<GetGoogleDriveFiles, Result<GDriveFile list, ApiError>> with
    member this.Handle(request, token) =
      taskResult {
        let! result = Google.service.Files.List().ExecuteAsync()

        return
          result.Files
          |> Seq.map (fun v -> { Id = v.Id; Name = v.Name })
          |> Seq.toList
      }

  interface IRequestHandler<DownloadFileToInbox, Result<unit, ApiError>> with
    member this.Handle(request, token) =
      taskResult {
        let! result =
          Google
            .service
            .Files
            .Get(request.Id)
            .ExecuteAsync()

        use stream = new MemoryStream()

        // let file = new FileInfo(result.Name)
        // use stream = file.OpenWrite()
        let request = Google.service.Files.Get(request.Id)
        let! result2 = request.ExecuteAsync()
        let! result = request.DownloadAsync(stream)

        do!
          result.Status = DownloadStatus.Completed
          |> Result.requireTrue (
            { ApiError.Message = "Download failed"
              Info = Some(ApiErrorInfo.ErrorResult(NetworkError(""))) }
          )

        stream.Position <- 0L

        let! inbox = ctx.GetInboxContainer()

        let! result5 =
          inbox.UploadBlobAsync(blobName = result2.Name, content = stream, cancellationToken = CancellationToken.None)

        return ()
      }