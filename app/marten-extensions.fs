namespace AzureFiles

open System.Runtime.CompilerServices
open Marten
open Marten.Events

[<Extension>]
type Extensions() =
  [<Extension>]
  static member StartFileStream(ty: IEventStore, id: FileId, FileSavedToStorage createdEvent) =
    let id = FileId.value id
    Serilog.Log.Logger.Information("start filestream {id}", id)
    ty.StartStream(id, [ createdEvent :> obj ])

  [<Extension>]
  static member AppendFileStream(ty: IEventStore, id: FileId, e: FileEvent) =
    let id = FileId.value id
    Serilog.Log.Logger.Information("append to filestream {id}", id)

    ty.Append(id, [ e :> obj ]) |> ignore
    ()
// match e with
// | LowresVersionCreated e -> ty.Append(id, [ e :> obj ])
// | TagAdded e -> ty.Append(id, [ e :> obj ])
// | TagRemoved e -> ty.Append(id, [ e :> obj ])