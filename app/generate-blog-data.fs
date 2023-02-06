module AzFiles.GenerateBlogData

open System
open System.Text.Json
open AzureFiles
open Marten
open MediatR
open System.Linq
open Glow.Core.Actions
open Microsoft.Extensions.Configuration
open Microsoft.Extensions.Logging

type BlogType =
  | Stage
  | Production

[<Action(Route = "api/my/write-blog-data", AllowAnonymous = true)>]
type GenerateBlogData() =
  interface IRequest
  member val TagName = Unchecked.defaultof<string> with get, set

type BlogPhoto =
  { Id: Guid
    FullHdUrl: string
    OriginalUrl: string
    ThumbnailUrl: string
    LowresUrl: string }

type GenerateBlogDataHandler(session: IDocumentSession, logger: ILogger<GenerateBlogDataHandler>, configuration: IConfiguration) =
  interface IRequestHandler<GenerateBlogData, MediatR.Unit> with
    member this.Handle(request, token) =
      logger.LogInformation("generate blog")

      task {
        let! result =
          session
            .Query<FileAggregate>()
            .Where(fun v -> v.Tags.Any(fun x -> x = request.TagName))
            .ToListAsync()

        // get derived info
        let data =
          result
          //          |> Seq.sortBy(fun v-> v.Filename)
          |> Seq.map
               (fun v ->
                 { Id = v.Id
                   OriginalUrl = v.Url.Value
                   ThumbnailUrl = v.ThumbnailUrl.Value
                   LowresUrl = v.LowresUrl.Value
                   FullHdUrl = v.FullHdUrl.Value })
          |> Seq.toList

        let serialized =
          System.Text.Json.JsonSerializer.Serialize(data, JsonSerializerOptions(WriteIndented = true))

        do! System.IO.File.WriteAllTextAsync($"C:\\home\\jannik\\repos\\travel-photo-blog-vite\\src\\blog-{request.TagName}.json", serialized)
        logger.LogInformation("done")

        return MediatR.Unit.Value
      }
