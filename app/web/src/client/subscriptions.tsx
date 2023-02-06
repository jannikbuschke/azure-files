import * as React from "react"
import { Form } from "formik-antd"
import mitt, { Handler, WildcardHandler } from "mitt"
import { useNotification, useWildcardNotification } from "glow-core/lib/notifications/type-notifications"
import * as System from "./System"
import * as Glow_core_fs_MartenAndPgsql from "./Glow_core_fs_MartenAndPgsql"
import * as Microsoft_FSharp_Collections from "./Microsoft_FSharp_Collections"
import * as AzureFiles from "./AzureFiles"
import * as System_Collections_Generic from "./System_Collections_Generic"
import * as AzFiles from "./AzFiles"
import * as Glow_TestAutomation from "./Glow_TestAutomation"
import * as Glow_Azure_AzureKeyVault from "./Glow_Azure_AzureKeyVault"
import * as Glow_Core_Profiles from "./Glow_Core_Profiles"
import * as Glow_Core_MartenAndPgsql from "./Glow_Core_MartenAndPgsql"
import * as MediatR from "./MediatR"
import * as Glow_Api from "./Glow_Api"
import * as Glow_Debug from "./Glow_Debug"
import * as Azure_Storage_Blobs_Models from "./Azure_Storage_Blobs_Models"
import * as Azure from "./Azure"
import * as Microsoft_FSharp_Core from "./Microsoft_FSharp_Core"
import * as System_Text_Json_Serialization from "./System_Text_Json_Serialization"
import * as NodaTime from "./NodaTime"

export type Events = {
  'Glow.core.fs.MartenAndPgsql.EventPublisher+EventNotification': Glow_core_fs_MartenAndPgsql.EventNotification,
}

// export const emitter = mitt<Events>();

type TagWithKey<TagName extends string, T> = {
  [K in keyof T]: { [_ in TagName]: K } & T[K]
}

export type EventTable = TagWithKey<"url", Events>

export function useSubscription<EventName extends keyof EventTable>(
    name: EventName,
    callback: Handler<Events[EventName]>,
    deps?: any[],
    ) {
    const ctx = useNotification<EventName, Events>(name, callback, deps)
    return ctx
}

export function useSubscriptions(
  callback: WildcardHandler<Events>,
  deps?: any[],
) {
  const ctx = useWildcardNotification<Events>(callback, deps)
  return ctx
}

