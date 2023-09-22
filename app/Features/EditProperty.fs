namespace AzFiles.Features

open AzFiles
open Glow.Core.Actions
open MediatR

open FsToolkit.ErrorHandling

[<Action(Route = "api/add-property", AllowAnonymous = true)>]
type AddProperty =
  { Id: FileId
    Property: Property }
  interface IRequest<ApiResult<unit>>

[<Action(Route = "api/remove-property", AllowAnonymous = true)>]
type RemoveProperty =
  { Id: FileId
    PropertyName: PropertyName }
  interface IRequest<ApiResult<unit>>

[<Action(Route = "UpdateProperty", AllowAnonymous = true)>]
type UpdateProperty =
  { Id: FileId
    Property: Property }
  interface IRequest<ApiResult<unit>>

[<Action(Route = "api/upsert-properties", AllowAnonymous = true)>]
type UpsertProperties =
  { Id: FileId
    Properties: Property list }
  interface IRequest<ApiResult<unit>>

[<Action(Route = "api/upsert-properties-raw", AllowAnonymous = true)>]
type UpsertPropertiesRaw =
  { Id: FileId
    Values: string }
  interface IRequest<ApiResult<unit>>

module EditProperty =
  let parse (value: string) =
    value.Split "\n"
    |> Seq.map (fun x -> x.Split ":")
    |> Seq.map (fun x ->
      ({ Property.Name = PropertyName x.[0]
         Value = x.[1] }))

  type PropertyDiff =
    | Added of Property
    | Removed of PropertyName
    | Updated of Property
    | NoChange of PropertyName

  let diff (origList: Property list) (newList: Property list) =
    let result =
      newList
      |> List.map (fun v ->
        let orig =
          origList
          |> List.tryFind (fun o -> o.Name = v.Name)

        match orig with
        | Some orig ->
          if orig = v then
            (PropertyDiff.NoChange v.Name)
          else
            (PropertyDiff.Updated v)
        | None -> (PropertyDiff.Added v))

    let removed =
      origList
      |> List.choose (fun v ->
        match newList |> List.tryFind (fun o -> o.Name = v.Name) with
        | None -> Some(PropertyDiff.Removed v.Name)
        | Some _ -> None)

    result @ removed

  type Handler(ctx: IWebRequestContext) =
    interface IRequestHandler<AddProperty, ApiResult<unit>> with
      member this.Handle(request, token) =
        taskResult {
          let! file = ctx.DocumentSession.LoadFile request.Id

          ctx.DocumentSession.Events.AppendFileStream(
            file.Key(),
            FileEvent.PropertyChanged(PropertyChanged.PropertyAdded request.Property)
          )

          do! ctx.DocumentSession.SaveChangesAsync()
        }

    interface IRequestHandler<RemoveProperty, ApiResult<unit>> with
      member this.Handle(request, token) =
        taskResult {
          let! file = ctx.DocumentSession.LoadFile request.Id

          ctx.DocumentSession.Events.AppendFileStream(
            file.Key(),
            FileEvent.PropertyChanged(PropertyChanged.PropertyRemoved request.PropertyName)
          )

          do! ctx.DocumentSession.SaveChangesAsync()
        }

    interface IRequestHandler<UpdateProperty, ApiResult<unit>> with
      member this.Handle(request, token) =
        taskResult {
          let! file = ctx.DocumentSession.LoadFile request.Id

          ctx.DocumentSession.Events.AppendFileStream(
            file.Key(),
            FileEvent.PropertyChanged(PropertyChanged.PropertyUpdated request.Property)
          )

          do! ctx.DocumentSession.SaveChangesAsync()
        }

    interface IRequestHandler<UpsertProperties, ApiResult<unit>> with
      member this.Handle(request, token) =
        taskResult {
          let! file = ctx.DocumentSession.LoadFile request.Id
          do! ctx.DocumentSession.SaveChangesAsync()
        }

    interface IRequestHandler<UpsertPropertiesRaw, ApiResult<unit>> with
      member this.Handle(request, token) =
        taskResult {
          let! file = ctx.DocumentSession.LoadFile request.Id
          let properties = parse request.Values |> Seq.toList
          let diff = diff file.Properties properties

          let propertyChanges =
            diff
            |> List.choose (fun e ->
              match e with
              | PropertyDiff.Added p -> PropertyChanged.PropertyAdded p |> Some
              | PropertyDiff.Removed p -> PropertyChanged.PropertyRemoved p |> Some
              | PropertyDiff.Updated p -> PropertyChanged.PropertyUpdated p |> Some
              | PropertyDiff.NoChange _ -> None)
          if not propertyChanges.IsEmpty then
            ctx.DocumentSession.Events.AppendFileStream(file.Key(), FileEvent.PropertiesChanged propertyChanges)

          do! ctx.DocumentSession.SaveChangesAsync()
        }
