namespace AzFiles.GenerateObsidianNotes

open System
open AzureFiles
open MediatR
open Glow.Core.Actions
open FsToolkit.ErrorHandling

[<Action(Route = "api/my/write-obsidian-notes", AllowAnonymous = true)>]
type GenerateObsidianNotes() =
  interface IRequest<ServiceResult<MediatR.Unit>>

type BlogPhoto =
  { Id: Guid
    OriginalUrl: string
  // FullHdUrl: string
  // ThumbnailUrl: string
  // LowresUrl: string
   }

type Handler(ctx: IWebRequestContext) =
  interface IRequestHandler<GenerateObsidianNotes, ServiceResult<MediatR.Unit>> with
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
          v, $"""---
type: photo
url: {v.Url}
location: {v.Location|>Option.map stringifyLocation|>Option.defaultValue ""}
tags: is/photo {v.Tags|>String.concat ","}
date: {v.DateTime|>Option.map(fun v->v.ToDateTimeUtc().ToString())|>Option.defaultValue ""}
date-digitized: {v.DateTimeDigitized|>Option.map(fun v->v.ToDateTimeUtc().ToString())|>Option.defaultValue ""}
date-original: {v.DateTimeOriginal|>Option.map(fun v->v.ToDateTimeUtc().ToString())|>Option.defaultValue ""}
---
![{v.Filename}]({v.Url})
"""
          )

        for (file,md) in markdown do
          do! System.IO.File.WriteAllLinesAsync($"C:\\home\\jannik\\obsidian\\default\\20-photos\\photo - {file.Id}.md", [|md|])
        
        return MediatR.Unit.Value
      }

