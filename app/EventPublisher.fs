module AzFiles.EventPublisher

open System
open AzureFiles
open FSharp.Control
open Glow.Core.MartenSubscriptions
open Glow.Core.Notifications
open Glow.Invoices.Api.Test
open Glow.NotificationsCore
open Microsoft.Extensions.DependencyInjection
open Microsoft.Extensions.Logging

type FileEventNotification =
  { Events: FileEvent list }

  interface IClientNotification

type UserEventPublisher(sp: IServiceProvider) =
  interface IMartenEventsConsumer with
    member this.ConsumeAsync(documentOperations, streamActions, ct) =
      task {
        use scope = sp.CreateScope()
        let logger = scope.GetService<ILogger<UserEventPublisher>>()

        let svc = scope.GetService<IClientNotificationService>()

        let x =
          streamActions
          |> Seq.collect (fun v -> v.Events)
          |> Seq.choose (fun v ->
            let result =
              match box v.Data with
              | :? FileEvent as filEvent -> Some(filEvent)
              | _ -> None

            result)

        do! svc.PublishNotification({ Events = x |> Seq.toList })

        return ()
      }