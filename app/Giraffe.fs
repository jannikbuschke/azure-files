module AzFiles.Giraffe

open System
open System.Diagnostics
open System.Text.Json.Serialization
open System.Web
open AzFiles.Features.GetInboxFiles
open AzFiles.Features.GetTaggedImages
open Azure.Storage.Sas
open Giraffe.ViewEngine
open Giraffe.ViewEngine.Htmx
open Giraffe
open Microsoft.AspNetCore.Builder
open Microsoft.AspNetCore.Http
open Microsoft.Extensions.DependencyInjection
open Giraffe.Htmx

let page pageTitle content =
  html [] [
    head [] [
      Htmx.Script.minified
      title [] [ str pageTitle ]
      link [ _rel "stylesheet"
             _href "/tailwind.generated.css" ]
      // add script / link

      // is this needed?
      style [] [
        str """.htmx-indicator { opacity: 0; transition: opacity 500ms ease-in; }"""
        str """.htmx-request .htmx-indicator { opacity: 1 }"""
        str """.htmx-request.htmx-indicator { opacity: 1 }"""
      ]

    ]
    body [
           // _class "bg-gradient-to-r from-cyan-500 to-blue-500"
           _class "bg-gradient-to-b from-slate-500 to-slate-300"
           // _class "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"
           // _class "bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90%"
           // _class "bg-gradient-to-r from-indigo-500"
           _hxBoost ] [
      content
      script [ _type "application/javascript" ] [
        rawText
          """
document.body.addEventListener('htmx:configRequest', function(evt) {
    //console.log({path:evt.detail.path, trigger:evt.detail.triggeringEvent.type, evt:evt});
    evt.detail.headers = {...evt.detail.headers, 'X-Triggering-Event-Type': evt.detail.triggeringEvent.type}
});
              """
      ]
    ]
  ]

let empty = page "First-in-inbox" (div [] [ str "No files in inbox" ])

type ButtonsState =
  | Elevated
  | Pressed

let addTagButton (id: System.Guid) (tag: string) state additionalAttributes =
  let elId = tag.Replace("@", "")

  let classes =
    match state with
    | Elevated -> "bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded shadow"
    | Pressed ->
      "bg-gray-200 hover:bg-gray-400 text-gray-800 font-semibold  border border-gray-400 py-2 px-4 rounded shadow-inner"

  div [] [
    button
      ([ _id elId
         _name tag
         _class classes
         _hxTrigger "click delay:500ms, dblclick"
         _hxPost $"/add-tag-to-image/{id}"
         _hxSwap "outerHTML "
         _hxIndicator $"#spinner-{elId}"
         _hxTarget $"#{elId}" ]
       @ additionalAttributes)
      [ str tag
        span [ _id $"spinner-{elId}"
               _class "htmx-indicator" ] [
          Text "..."
        ] ]
  // <img  id="spinner" class="htmx-indicator" src="/img/bars.svg"/>
  ]

let createLinkButton url title =
  a [ _class
        "no-underline hover:underline text-white bg-blue-500 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
      _hxPushUrl url
      _href url ] [
    str title
  ]

let tags =
  [ "highlight"
    "PKM"
    "lena"
    "ronja"
    "wilma"
    "yaren"
    "me"
    "info-tafel" ]

let inboxImagePage (file: FileProjection) (request: HttpRequest) (skip: int) =
  let webCtx = request.HttpContext.GetService<IWebRequestContext>()

  let buttons =
    [ "⭐"
      "PKM"
      "@lena"
      "@ronja"
      "@wilma"
      "@yaren"
      "@me"
      "info-tafel" ]
    |> List.map (fun tag ->
      addTagButton
        file.Id
        tag
        (if file.Tags |> List.contains tag then
           ButtonsState.Pressed
         else
           ButtonsState.Elevated)
        [])

  let deleteButton =
    addTagButton file.Id SpecialTag.MarkForCleanup ButtonsState.Elevated [ _hxConfirm "Are you sure?" ]

  // no-underline hover:underline

  let inboxLink skip = $"""/giraffe/inbox/{skip}"""
  let next = createLinkButton (inboxLink (skip + 1)) ">"
  let skip5 = createLinkButton (inboxLink (skip + 5)) ">>"

  let prev = createLinkButton (inboxLink (skip - 1)) "<"
  let prev5 = createLinkButton (inboxLink (skip - 5)) "<<"

  let variantscontainer = webCtx.GetVariantsContainer()
  let srcContainer = webCtx.GetSrcContainer()

  let createSasUri container id =
    AzFiles.Workflow.createSasUri0 container id BlobSasPermissions.Read (DateTimeOffset.Now.AddMinutes(20))

  let getSrcset (file: FileProjection) =
    let uri = createSasUri srcContainer (file.Id.ToString())

    let width =
      Exif.tryGetWidth (file.ExifData |> Skippable.defaultValue [])
      |> Option.defaultValue 0

    //"(max-width: 600px) 480px, 800px"

    let values =
      (file.LowresVersions
       |> List.map (fun x ->
         let uri = createSasUri variantscontainer (x.Id(file.Key()))

         ($"{uri.AbsoluteUri} {x.Dimension.Width}w", $"(max-width: {x.Dimension.Width + 1000}px) {x.Dimension.Width}px")))
      @ [ ($"{uri.AbsoluteUri} {width}w", $"{width}px") ]

    let srcset =
      values
      |> List.map fst
      |> fun x -> String.Join(", ", x)

    let sizes =
      values
      |> List.map snd
      |> fun x -> String.Join(", ", x)

    srcset, sizes

  let srcset, sizes = getSrcset file

  let image =
    img [ _src file.Url
          _srcset srcset
          _sizes sizes
          _class "object-contain mx-2"
          _style "max-height: calc(100vh - 150px);box-shadow: var(--shadow-elevation-high);" ]

  page
    "First-in-inbox"
    (div [ _class "flex flex-col justify-between"
           _style "align-items: center;height:100svh;padding:8px;" ] [
      div [ _class "my-0.5 font-mono text-sm text-slate-800" ] [
        str file.Filename
      ]
      image
      // img [ _src file.Url
      //       _class "object-contain mx-2"
      //       _style "max-height: calc(100vh - 150px);box-shadow: var(--shadow-elevation-high);" ]
      div
        [ _class "flex items-center gap-2 my-2" ]
        ([ prev5; prev ]
         @ buttons @ [ deleteButton ] @ [ next; skip5 ])
     ])

let attify tag =
  match tag with
  | "lena"
  | "yaren"
  | "ronja"
  | "wilma"
  | "me" -> sprintf "@%s" tag
  | _ -> tag

let getTaggedImages =
  fun (next: HttpFunc) (ctx: HttpContext) ->
    let appCtx = ctx.GetService<IWebRequestContext>()

    let tagInputs =
      tags
      |> List.choose (fun x ->
        let tagId = x |> sprintf "tag_%s"
        let tags = ctx.Request.Query.Item tagId
        let head = tags |> Seq.tryHead

        if head = Some "on" then
          Some(attify x)
        else
          None)

    let skip =
      ctx.Request.Query.Item "skip"
      |> Seq.tryHead
      |> Option.map System.Int32.Parse
      |> Option.defaultValue 0

    let skip =
      if tagInputs |> List.contains "@yaren" then
        0
      else
        skip

    task {
      let pageSize = 20

      let pageSize =
        if tagInputs |> List.contains "@yaren" then
          1
        else
          pageSize

      let createLink (tags: string seq) skip =
        let tags =
          tags
          |> Seq.map (sprintf "tags=%s")
          |> fun tags -> String.Join("&", tags)

        $"""/tagged-images?{tags}&skip={skip}"""

      let nextBtn = createLinkButton (createLink tagInputs (skip + (1 * pageSize))) ">"
      let prevBtn = createLinkButton (createLink tagInputs (skip - (1 * pageSize))) "<"

      let rec createImageFilterFromManyTags (tags: string list) =
        match tags with
        | [] -> failwith "Not allowed"
        | [ _ ] -> failwith "Not allowed"
        | tags ->
          if tags.Length = 2 then
            ImageFilter.And(ImageFilter.Tagged [ tags.[0] ], ImageFilter.Tagged [ tags.[1] ])
          else
            ImageFilter.And(ImageFilter.Tagged [ tags.[0] ], createImageFilterFromManyTags tags.Tail)

      let imagefilter =
        match tagInputs with
        | [] -> ImageFilter.All
        | [ tag ] -> ImageFilter.Tagged [ tag ]
        | tags -> createImageFilterFromManyTags tags

      let request: GetImages =
        { ChronologicalSortDirection = ChronologicalSortDirection.Desc
          Pagination = Pagination.NoPagination
          Filter = imagefilter }

      let watch = Stopwatch()
      watch.Start()
      printfn "query files"
      let! result = AzFiles.Features.GetTaggedImages.GetImages.getFilesByFilter appCtx request

      printfn "got files in %A" watch.Elapsed

      let skip = Math.Min(skip, result.Result.Length)

      let pagination =
        [ div [ _class "flex my-2 gap-4" ] [
            prevBtn
            nextBtn
          ] ]

      let count =
        span [ _class "text-gray-500 my-2" ] [
          str (sprintf "Count: %i" result.Result.Length)
        ]

      let renderImage file =
        let image =
          img [ _src file.Url
                _class "mx-2"
                _style "max-height: 95svh;max-width:97svw;margin-bottom:16px;box-shadow: var(--shadow-elevation-high);" ]

        div [] [
          a [ _hxNoBoost
              _class "text-gray-500 mx-2"
              _href $"/download/{file.Id.value().ToString()}" ] [
            image
          ]
        // div [ _class "my-2" ] [
        //   span [ _class "text-gray-500 mx-2" ] [
        //     str file.Filename
        //   ]
        //   // a [ _hxNoBoost
        //   //     _class "text-gray-500 mx-2"
        //   //     _href $"/download/{file.Id.value().ToString()}" ] [
        //   //   str "Download"
        //   // ]
        // ]
        ]

      let taginputs =
        (tags
         |> List.map (fun tag ->
           div [ _class "flex items-center mb-4 gap-1" ] [
             input [ _type "checkbox"
                     _id tag
                     _class
                       "w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                     _name (sprintf "tag_%s" tag) ]
             label [ _class "ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                     _for tag ] [
               str tag
             ]
           ]))

      let filters =
        div [ _class "mt-2" ] [
          form
            [ _action "/tagged-images?"
              _method "GET" ]

            (div [ _class "flex gap-4" ] taginputs
             :: [ div [] [
                    button [ _class "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                             _type "submit" ] [
                      str "Suche"
                    ]
                  ] ])
        ]

      let view =
        result.Result
        |> List.skip skip
        |> List.truncate pageSize
        |> List.map renderImage
        |> fun x ->
             [ filters ]
             @ pagination
               @ [ count ] @ x @ [ count ] @ pagination
        |> div [ _class "flex flex-col justify-between items-center" ]
        |> page (String.Join("-", tagInputs))
        |> htmlView

      return! view next ctx
    }

let inboxItemi (skip: int) : HttpHandler =
  fun (next: HttpFunc) (ctx: HttpContext) ->
    let appCtx = ctx.GetService<IWebRequestContext>()

    task {
      let! result =
        AzFiles.Features.GetInboxFiles.GetInboxFiles.cachePolicy.ExecuteAndCaptureAsync(
          (AzFiles.Features.GetInboxFiles.GetInboxFiles.getInboxFiles (appCtx, Order.Desc)),
          Polly.Context("get-inbox-files")
        )

      let list =
        if result.Result.Length > skip then
          result.Result |> List.skip skip
        else
          []

      match list with
      | [] -> return! htmlView empty next ctx
      | head :: _ -> return! htmlView (inboxImagePage head ctx.Request skip) next ctx
    }

type TriggeringEventType =
  | Click
  | DblClick

let tryGetHeadervalue (request: HttpRequest) (key: string) =
  match request.Headers.TryGetValue key with
  | true, value -> Some value
  | _ -> None

let getTriggeringEventType (request: HttpRequest) =
  tryGetHeadervalue request "X-Triggering-Event-Type"
  |> Option.map (fun value ->
    match value.Item(0) with
    | "click" -> Some Click
    | "dblclick" -> Some DblClick
    | _ -> None)
  |> Option.flatten

let addTagToImage (id: string) =
  fun (next: HttpFunc) (ctx: HttpContext) ->
    task {
      // printfn "IsHtmxRequest %A" ctx.Request.Headers.HxRequest
      // printfn "HxCurrentUrl %A" ctx.Request.Headers.HxCurrentUrl
      // printfn "HxTarget %A" ctx.Request.Headers.HxTarget
      printfn "HxTrigger %A" ctx.Request.Headers.HxTrigger
      printfn "HxTriggername %A" ctx.Request.Headers.HxTriggerName
      printfn "Headers %A" ctx.Request.Headers

      let triggeringEventType = getTriggeringEventType ctx.Request

      // printfn "Query %A" ctx.Request.Query
      //
      // ctx.Request.Query.Item "triggeringEventType"
      // |> printfn "triggeringEventType %A"

      let tag =
        ctx.Request.Headers.HxTriggerName
        |> Option.map HttpUtility.HtmlDecode

      let tag =
        if tag = Some "%E2%AD%90" then
          Some "⭐"
        else
          tag
      //
      // ctx.Request.Headers |> Seq.iter (printfn "%A")
      // printfn "Tag = %A" tag
      // printfn "Id = %s" id

      match tag with
      | Some tag ->
        let appCtx = ctx.GetService<IWebRequestContext>()

        let! file =
          id
          |> System.Guid.Parse
          |> FileId
          |> appCtx.DocumentSession.LoadFile

        match file with
        | Result.Ok file ->
          appCtx.DocumentSession.Events.AppendFileStream(file.Key(), FileEvent.TagAdded { Name = tag })
          ()
        | Result.Error _ -> ()

        do! appCtx.DocumentSession.SaveChangesAsync()

        match triggeringEventType with
        | Some TriggeringEventType.Click -> ()
        | Some TriggeringEventType.DblClick ->
          if ctx.Request.Path.HasValue then
            printfn "Path %A" ctx.Request.Headers.HxCurrentUrl

            match ctx.Request.Headers.HxCurrentUrl
                  |> Option.map (fun v -> v.AbsoluteUri.Split("/"))
                  |> Option.map Array.tryLast
                  |> Option.flatten
              with
            | Some value ->
              printfn "parse value '%s' as int" value

              match System.Int32.TryParse value with
              | true, skip -> ctx.Response.Headers.Add("Hx-Redirect", $"/giraffe/inbox/{skip + 1}")
              | _ -> ctx.Response.Headers.Add("Hx-Redirect", $"/giraffe/inbox/{1}")
            | None -> ()

        | None -> ()

        return! htmlView (addTagButton System.Guid.Empty tag ButtonsState.Elevated [ _disabled ]) next ctx
      | None ->
        return!
          htmlView
            (div [] [
              Text("Could not find tag (TriggerName)")
             ])
            next
            ctx
    }

let download (id: string) =
  fun (next: HttpFunc) (ctx: HttpContext) ->
    task {
      let appCtx = ctx.GetService<IWebRequestContext>()

      let! file =
        id
        |> System.Guid.Parse
        |> FileId
        |> appCtx.DocumentSession.LoadFile

      match file with
      | Result.Ok file ->
        let hd =
          file.LowresVersions
          |> List.tryFind (fun x -> x.Name = "hd")

        match hd with
        | Some hd ->
          let container = appCtx.GetVariantsContainer()
          let client = container.GetBlobClient(hd.Id(file.Key()))
          let! stream = client.DownloadStreamingAsync()

          return! ctx.WriteStreamAsync(false, stream.Value.Content, None, None)
        | None ->
          printfn "hd variant not found for id %s" id
          return! next ctx
      | Result.Error e ->
        printfn "error while preparing download for %s: %s" id e.Message
        return! next ctx
    }

let webApp =
  choose [ routef "/add-tag-to-image/%s" addTagToImage
           route "/tagged-images" >=> getTaggedImages
           routef "/download/%s" download
           route "/gridstack-all.js"
           >=> htmlFile "wwwroot/gridstack-all.js"
           route "/delete-not-found"
           >=> AzFiles.CheckIntegrity.deleteAllNotFound
           route "/integrity-check"
           >=> AzFiles.CheckIntegrity.checkIntegrity
           route "/giraffe/inbox" >=> inboxItemi 0
           routef "/giraffe/inbox/%i" inboxItemi
           route "/ping" >=> text "pong" ]

let addGiraffe (services: IServiceCollection) = services.AddGiraffe()
let configureGiraffeApp (app: WebApplication) = app.UseGiraffe(webApp)