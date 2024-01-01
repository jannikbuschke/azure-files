module AzFiles.CheckIntegrity

open Giraffe.ViewEngine
open Giraffe.ViewEngine.Htmx
open Giraffe
open Microsoft.AspNetCore.Http

let queryValueAsInt (request: HttpRequest) name =
  request.Query.Item name
  |> Seq.tryHead
  |> Option.map System.Int32.Parse

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

let checkFiles (appCtx: IWebRequestContext) pageSize pagenumber =
  task {
    let! allFiles = appCtx.DocumentSession.GetAllFileIds()
    let container = appCtx.GetSrcContainer()

    // minimum of two (pagenumber+pageSize) and allFiles.Count
    let skip = System.Math.Min(pagenumber * pageSize, allFiles.Length)

    let take = System.Math.Min(pageSize, allFiles.Length - skip)

    let existingBlobs =
      allFiles
      |> List.skip skip
      |> List.take take
      |> List.map (fun x -> x, container.GetBlobClient(x.Id.ToString()).Exists())

    return existingBlobs
  }

let deleteAllNotFound =
  fun (next: HttpFunc) (ctx: HttpContext) ->
    task {
      let appCtx = ctx.GetService<IWebRequestContext>()

      let pageSize =
        queryValueAsInt ctx.Request "pageSize"
        |> Option.defaultValue 100

      let pagenumber =
        queryValueAsInt ctx.Request "page"
        |> Option.defaultValue 0

      let! existingBlobs = checkFiles appCtx pageSize pagenumber

      let items =
        existingBlobs
        |> List.filter (fun (x, response) -> not response.Value)

      items
      |> List.iter (fun (x, response) ->
        let id = x.Id |> FileId.create
        appCtx.DocumentSession.Events.AppendFileStream(id, FileEvent.Deleted EmptyRecord.Instance))

      do! appCtx.DocumentSession.SaveChangesAsync()

      let items =
        items
        |> List.map (fun (x, response) ->
          div [] [
            span [] [ str (x.Id.ToString()) ]
            span [ _class (
                     "mx-2"
                     + if response.Value then
                         " text-green-500"
                       else
                         " text-red-500"
                   ) ] [
              str (
                if response.Value then
                  "exists"
                else
                  "NOT FOUND"
              )
            ]

          ])

      let view =
        items
        |> div [ _class "border-2 border-red-500 rounded" ]
        // |> div [ _class "flex flex-col justify-between items-center" ]
        |> page "page"
        |> htmlView

      return! view next ctx
    }

let checkIntegrity =
  fun (next: HttpFunc) (ctx: HttpContext) ->
    task {
      let appCtx = ctx.GetService<IWebRequestContext>()

      let pageSize =
        queryValueAsInt ctx.Request "pageSize"
        |> Option.defaultValue 100

      let pagenumber =
        queryValueAsInt ctx.Request "page"
        |> Option.defaultValue 0

      let! existingBlobs = checkFiles appCtx pageSize pagenumber
      // let existingBlobs =
      //   allFiles
      //   |> List.skip (pagenumber * pageSize)
      //   |> List.take pageSize
      //   |> List.map (fun x -> x, container.GetBlobClient(x.Id.ToString()).Exists())

      let deleteAllbutton =
        button [ _hxPost $"/delete-not-found?pageSize={pageSize}&page={pagenumber}"
                 _class "bg-blue rounded" ] [
          str "Delete all NOT FOUND"
        ]

      let items =
        existingBlobs
        |> List.map (fun (x, response) ->
          div [] [
            span [] [ str (x.Id.ToString()) ]
            span [ _class (
                     "mx-2"
                     + if response.Value then
                         " text-green-500"
                       else
                         " text-red-500"
                   ) ] [
              str (
                if response.Value then
                  "exists"
                else
                  "NOT FOUND"
              )
            ]

          ])

      let view =
        (deleteAllbutton :: items)
        |> div [ _class "flex flex-col justify-between items-center" ]
        |> page "page"
        |> htmlView

      return! view next ctx
    }