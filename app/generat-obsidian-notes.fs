namespace AzFiles.GenerateObsidianNotes

open System
open AzureFiles
open MediatR
open Glow.Core.Actions
open FsToolkit.ErrorHandling

[<Action(Route = "api/my/write-obsidian-notes", AllowAnonymous = true)>]
type GenerateObsidianNotes() =
  interface IRequest<ApiResult<MediatR.Unit>>

type BlogPhoto =
  { Id: Guid
    OriginalUrl: string
  // FullHdUrl: string
  // ThumbnailUrl: string
  // LowresUrl: string
   }

type Handler(ctx: IWebRequestContext) =
  interface IRequestHandler<GenerateObsidianNotes, ApiResult<MediatR.Unit>> with
    member this.Handle(_, _) =
      taskResult {
        let! entities = ctx.DocumentSession.QueryAsync<FileProjection>("where data -> 'RemovedFromInboxAt' <> 'null'")
        
        let stringifyLocation (location: (decimal array*decimal array))=
          let lat,long = location
          let lat = lat[0] + lat[1]/60m + lat[2]/3600m
          let long = long[0] + long[1]/60m + long[2]/3600m
          //Degrees + Minutes/60 + Seconds/3600
          $"[{lat},{long}]"

        let markdown = entities |> Seq.map FileViewmodel.FromFileProjection |> Seq.map(fun v->

          let properties = v.Properties |> Seq.map(fun v-> $"{v.Name.Value()}: {v.Value}")|>String.concat "\n"
          let ``type`` = "photo" + (if v.Tags|>List.contains("Doc") then "/doc" else "") 
          v, $"""---
type: {``type``}
url: {v.Url}
location: {v.Location|>Option.map stringifyLocation|>Option.defaultValue ""}
date: {v.DateTime|>Option.map(fun v->v.ToDateTimeUtc().ToString("yyyy-MM-dd"))|>Option.defaultValue ""}
exif-date: {v.DateTime|>Option.map(fun v->v.ToDateTimeUtc().ToString())|>Option.defaultValue ""}
exif-date-digitized: {v.DateTimeDigitized|>Option.map(fun v->v.ToDateTimeUtc().ToString())|>Option.defaultValue ""}
exif-date-original: {v.DateTimeOriginal|>Option.map(fun v->v.ToDateTimeUtc().ToString())|>Option.defaultValue ""}
{properties}
---
#is/photo {v.Tags|>List.map(fun v->"#"+v)|>String.concat " "}
![{v.Filename}]({v.Url})
"""
          )

        for (file,md) in markdown do
          do! System.IO.File.WriteAllLinesAsync($"C:\\home\\jannik\\obsidian\\default\\20-photos\\photo - {file.Id}.md", [|md|])
        
        return MediatR.Unit.Value
      }

