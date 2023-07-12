namespace Glow.Core.MartenAndPgsql

open System.Collections.Generic
open AzureFiles
open FSharp.Control
open Glow.Core.Actions
open Marten
open MediatR
open Microsoft.Extensions.Logging
open System.Linq

[<Action(Route = "api/debug/get-documents", Policy = "admin")>]
type GetDocuments() =
  interface IRequest<IEnumerable<obj>>
  member val DocumentName = Unchecked.defaultof<string> with get, set

type Handler(session: IDocumentSession, logger: ILogger<Handler>, store: IDocumentStore) =
  member this.loadDocuments<'DocumentType>(session: IDocumentSession) =
    task {
      let! result = session.Query<'DocumentType>().ToListAsync()
      return result.Cast<obj>()
    }

  interface IRequestHandler<GetDocuments, IEnumerable<obj>> with
    member this.Handle(request, _) =

      task {

        let! query =
          match request.DocumentName.ToLower() with
          | "file" -> this.loadDocuments<FileProjection> session
          // | "meeting" -> loadDocuments session
          // | "user" -> loadDocuments session
          // | "committee" -> loadDocuments session
          // | "member" -> loadDocuments session
          // | "domainconfiguration" -> loadDocuments session
          // | "workspacesingletonconfiguration" -> loadDocuments session
          // | "mynotificationsettings" -> loadDocuments session
          // | "file" -> loadDocuments session
          | _ -> failwith $"not supported document type: '{request.DocumentName.ToLower()}'"

        return query
      }