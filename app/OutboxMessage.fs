namespace AzFiles

open System
open AzureFiles

type MoveFileToFolder =
  { FileId: Guid
    SrcFolder: string
    TargetFolder: string }

type OutboxAction = MoveFileToFolder of MoveFileToFolder

type OutboxMessage =
  { Id: Guid
    Created: NodaTime.Instant
    Action: OutboxAction
   }


