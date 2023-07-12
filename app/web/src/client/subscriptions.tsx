import * as React from "react"
import { Form } from "formik-antd"
import mitt, { Handler, WildcardHandler } from "mitt"
import { useNotification, useWildcardNotification } from "glow-core/lib/notifications/type-notifications"
import * as System from "./System"
import * as Glow_Core_MartenAndPgsql from "./Glow_Core_MartenAndPgsql"
import * as AzureFiles from "./AzureFiles"
import * as AzFiles_Features from "./AzFiles_Features"
import * as Microsoft_FSharp_Collections from "./Microsoft_FSharp_Collections"
import * as AzFiles_Features_GoogleDrive from "./AzFiles_Features_GoogleDrive"
import * as AzFiles_Features_Fsi from "./AzFiles_Features_Fsi"
import * as AzFiles_GenerateObsidianNotes from "./AzFiles_GenerateObsidianNotes"
import * as AzFiles from "./AzFiles"
import * as System_Text_Json_Serialization from "./System_Text_Json_Serialization"
import * as Microsoft_FSharp_Core from "./Microsoft_FSharp_Core"
import * as Glow_TestAutomation from "./Glow_TestAutomation"
import * as Glow_Azure_AzureKeyVault from "./Glow_Azure_AzureKeyVault"
import * as Glow_Core_Profiles from "./Glow_Core_Profiles"
import * as MediatR from "./MediatR"
import * as Glow_Debug from "./Glow_Debug"
import * as System_Collections_Generic from "./System_Collections_Generic"
import * as Azure_Storage_Blobs_Models from "./Azure_Storage_Blobs_Models"
import * as Azure from "./Azure"
import * as NodaTime from "./NodaTime"

export type Events = {
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

