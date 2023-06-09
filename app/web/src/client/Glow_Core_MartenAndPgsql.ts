//////////////////////////////////////
//   This file is auto generated   //
//////////////////////////////////////

import * as System from "./System"
import * as MediatR from "./MediatR"
import * as System_Collections_Generic from "./System_Collections_Generic"
import * as NodaTime from "./NodaTime"

export type GetDocuments = {
  documentName: System.String
}
export var defaultGetDocuments: GetDocuments = {
  documentName: ''
}

export type ArchiveEvent = {
  eventId: System.Guid
}
export var defaultArchiveEvent: ArchiveEvent = {
  eventId: '00000000-0000-0000-0000-000000000000'
}

export type RestoreEvent = {
  eventId: System.Guid
}
export var defaultRestoreEvent: RestoreEvent = {
  eventId: '00000000-0000-0000-0000-000000000000'
}

export type RenameEventDotnetTypeName = {
  oldName: System.String
  newName: System.String
}
export var defaultRenameEventDotnetTypeName: RenameEventDotnetTypeName = {
  oldName: '',
  newName: ''
}

export type RemoveAllData = {
  validationPhrase: System.String
}
export var defaultRemoveAllData: RemoveAllData = {
  validationPhrase: ''
}

export type RebuildProjections = {
  projectionName: System.String
}
export var defaultRebuildProjections: RebuildProjections = {
  projectionName: ''
}

export type RebuildAllProjections = {
  payload: MediatR.Unit
}
export var defaultRebuildAllProjections: RebuildAllProjections = {
  payload: MediatR.defaultUnit
}

export type GetKnownDocumentNames = {
  dummy: MediatR.Unit
}
export var defaultGetKnownDocumentNames: GetKnownDocumentNames = {
  dummy: MediatR.defaultUnit
}

export type GetEsEvents = {
}
export var defaultGetEsEvents: GetEsEvents = {
}

export type GetEsEventsWithoutValidation = {
}
export var defaultGetEsEventsWithoutValidation: GetEsEventsWithoutValidation = {
}

export type GetPgsqlActivities = {
}
export var defaultGetPgsqlActivities: GetPgsqlActivities = {
}

export type GetLastModified = {
  id: System.Guid
}
export var defaultGetLastModified: GetLastModified = {
  id: '00000000-0000-0000-0000-000000000000'
}

export type ApiErrorType_Case_NotFound = { Case: "NotFound" }
export type ApiErrorType_Case_BadRequest = { Case: "BadRequest" }
export type ApiErrorType_Case_Unauthorized = { Case: "Unauthorized" }
export type ApiErrorType_Case_Forbidden = { Case: "Forbidden" }
export type ApiErrorType_Case_InternalServerError = { Case: "InternalServerError" }
export type ApiErrorType = ApiErrorType_Case_NotFound | ApiErrorType_Case_BadRequest | ApiErrorType_Case_Unauthorized | ApiErrorType_Case_Forbidden | ApiErrorType_Case_InternalServerError
export type ApiErrorType_Case = "NotFound" | "BadRequest" | "Unauthorized" | "Forbidden" | "InternalServerError"
export var ApiErrorType_AllCases = [ "NotFound", "BadRequest", "Unauthorized", "Forbidden", "InternalServerError" ] as const
export var defaultApiErrorType_Case_NotFound = { Case: "NotFound" }
export var defaultApiErrorType_Case_BadRequest = { Case: "BadRequest" }
export var defaultApiErrorType_Case_Unauthorized = { Case: "Unauthorized" }
export var defaultApiErrorType_Case_Forbidden = { Case: "Forbidden" }
export var defaultApiErrorType_Case_InternalServerError = { Case: "InternalServerError" }
export var defaultApiErrorType = defaultApiErrorType_Case_NotFound as ApiErrorType

export type ApiError = {
  message: System.String
  type: ApiErrorType
}
export var defaultApiError: ApiError = {
  message: '',
  type: defaultApiErrorType
}

export type EventViewmodel = {
  id: System.Guid
  version: System.Int64
  sequence: System.Int64
  data: System.Object
  streamId: System.Guid
  streamKey: System.String
  timestamp: System.DateTimeOffset
  tenantId: System.String
  eventTypeName: System.String
  dotNetTypeName: System.String
  causationId: System.String
  correlationId: System.String
  headers: System_Collections_Generic.Dictionary<System.String,System.Object>
  isArchived: System.Boolean
  aggregateTypeName: System.String
}
export var defaultEventViewmodel: EventViewmodel = {
  id: '00000000-0000-0000-0000-000000000000',
  version: 0,
  sequence: 0,
  data: {},
  streamId: '00000000-0000-0000-0000-000000000000',
  streamKey: '',
  timestamp: "0000-00-00T00:00:00+00:00",
  tenantId: '',
  eventTypeName: '',
  dotNetTypeName: '',
  causationId: '',
  correlationId: '',
  headers: ({}),
  isArchived: false,
  aggregateTypeName: ''
}

export type EventViewmodel2 = {
  seq_id: System.Int64
  id: System.Guid
  stream_id: System.Guid
  version: System.Int64
  data: System.String
  type: System.String
  timestamp: NodaTime.Instant
  tenant_id: System.String
  mt_dotnet_type: System.String
  headers: System.String
  is_archived: System.Boolean
}
export var defaultEventViewmodel2: EventViewmodel2 = {
  seq_id: 0,
  id: '00000000-0000-0000-0000-000000000000',
  stream_id: '00000000-0000-0000-0000-000000000000',
  version: 0,
  data: '',
  type: '',
  timestamp: "9999-12-31T23:59:59.999999999Z",
  tenant_id: '',
  mt_dotnet_type: '',
  headers: '',
  is_archived: false
}

export type Activity = {
  username: System.Object
  db: System.Object
  state: System.Object
  query: System.Object
  pid: System.Object
}
export var defaultActivity: Activity = {
  username: {},
  db: {},
  state: {},
  query: {},
  pid: {}
}

export type StreamInfo = {
  lastEdited: System.DateTimeOffset
  created: System.DateTimeOffset
  version: System.Int64
}
export var defaultStreamInfo: StreamInfo = {
  lastEdited: "0000-00-00T00:00:00+00:00",
  created: "0000-00-00T00:00:00+00:00",
  version: 0
}

