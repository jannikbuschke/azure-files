import * as React from "react"
import { QueryOptions, UseQueryOptions } from "react-query"
import { useApi, ApiResult, useNotify } from "glow-core"
import { useAction, useSubmit, UseSubmit, ProblemDetails } from "glow-core"
import { Formik, FormikConfig, FormikFormProps, FormikProps } from "formik"
import { Form } from "formik-antd"
import * as System from "./System"
import * as AzFiles from "./AzFiles"
import * as Microsoft_FSharp_Collections from "./Microsoft_FSharp_Collections"
import * as AzureFiles from "./AzureFiles"
import * as System_Text_Json_Serialization from "./System_Text_Json_Serialization"
import * as Microsoft_FSharp_Core from "./Microsoft_FSharp_Core"
import * as Glow_core_fs_MartenAndPgsql from "./Glow_core_fs_MartenAndPgsql"
import * as System_Collections_Generic from "./System_Collections_Generic"
import * as AzFiles_Features from "./AzFiles_Features"
import * as Glow_TestAutomation from "./Glow_TestAutomation"
import * as Glow_Azure_AzureKeyVault from "./Glow_Azure_AzureKeyVault"
import * as Glow_Core_Profiles from "./Glow_Core_Profiles"
import * as Glow_Core_MartenAndPgsql from "./Glow_Core_MartenAndPgsql"
import * as MediatR from "./MediatR"
import * as Glow_Api from "./Glow_Api"
import * as Glow_Debug from "./Glow_Debug"
import * as Azure_Storage_Blobs_Models from "./Azure_Storage_Blobs_Models"
import * as Azure from "./Azure"
import * as NodaTime from "./NodaTime"

export type QueryInputs = {
  "/api/blob/get-file": AzureFiles.GetBlobFile,
  "/api/files/get-indexed-files": AzureFiles.GetIndexedFiles,
  "/api/files/get-indexed-file": AzureFiles.GetIndexedFile,
  "/api/blob/get-files": AzureFiles.GetFiles,
  "/api/file/get-next-untagged": AzureFiles.GetNextUntaggedBlob,
  "/api/file/get-all-untagged": AzureFiles.GetAllUntagged,
  "/api/blob/get-containers": AzureFiles.GetBlobContainers,
  "/api/get-navbar": AzFiles_Features.GetNavbar,
  "/api/get-tags": AzFiles_Features.GetTags,
  "/api/get-images": AzFiles_Features.GetImages,
  "/api/get-inbox-files": AzFiles_Features.GetInboxFiles,
  "/api/get-inbox-file": AzFiles_Features.GetInboxFile,
  "/api/glow/test-automation/get-available-fake-users": Glow_TestAutomation.GetAvailableFakeUsers,
  "/glow/profile/get-profile": Glow_Core_Profiles.GetProfile,
  "/api/gebug/get-document-names": Glow_Core_MartenAndPgsql.GetKnownDocumentNames,
  "/api/debug/get-documents": Glow_Core_MartenAndPgsql.GetDocuments,
  "/api/es/get-events2": Glow_Core_MartenAndPgsql.GetEsEvents2,
  "/api/es/get-events-without-validation": Glow_Core_MartenAndPgsql.GetEsEventsWithoutValidation,
  "/api/pgsql/get-activity": Glow_Core_MartenAndPgsql.GetPgsqlActivities,
  "/api/events/get-last-modified": Glow_Core_MartenAndPgsql.GetLastModified,
  "/api/es/get-events": Glow_Api.GetEsEvents,
  "/api/glow/pgsql/get-activity": Glow_Debug.GetPgsqlActivities,
}
export type QueryOutputs = {
  "/api/blob/get-file": AzureFiles.AzureFilesBlobProperties,
  "/api/files/get-indexed-files": System_Collections_Generic.List<AzureFiles.FileAggregate>,
  "/api/files/get-indexed-file": AzureFiles.FileAggregate,
  "/api/blob/get-files": System_Collections_Generic.List<Azure_Storage_Blobs_Models.BlobItem>,
  "/api/file/get-next-untagged": AzureFiles.FileAggregate,
  "/api/file/get-all-untagged": System_Collections_Generic.List<AzureFiles.FileAggregate>,
  "/api/blob/get-containers": System_Collections_Generic.List<Azure_Storage_Blobs_Models.BlobContainerItem>,
  "/api/get-navbar": AzFiles_Features.Navbar,
  "/api/get-tags": Microsoft_FSharp_Collections.FSharpList<System.String>,
  "/api/get-images": Microsoft_FSharp_Collections.FSharpList<AzureFiles.FileAggregate>,
  "/api/get-inbox-files": Microsoft_FSharp_Collections.FSharpList<AzureFiles.FileAggregate>,
  "/api/get-inbox-file": AzFiles_Features.InboxFileResult,
  "/api/glow/test-automation/get-available-fake-users": Glow_TestAutomation.FakeUsers,
  "/glow/profile/get-profile": Glow_Core_Profiles.Profile,
  "/api/gebug/get-document-names": Microsoft_FSharp_Collections.FSharpList<System.String>,
  "/api/debug/get-documents": System_Collections_Generic.IEnumerable<System.Object>,
  "/api/es/get-events2": Microsoft_FSharp_Collections.FSharpList<Glow_Core_MartenAndPgsql.EventViewmodel>,
  "/api/es/get-events-without-validation": System_Collections_Generic.List<Glow_Core_MartenAndPgsql.EventViewmodel2>,
  "/api/pgsql/get-activity": System_Collections_Generic.List<Glow_Core_MartenAndPgsql.Activity>,
  "/api/events/get-last-modified": Glow_Core_MartenAndPgsql.StreamInfo,
  "/api/es/get-events": System_Collections_Generic.List<Glow_Api.EventViewmodel>,
  "/api/glow/pgsql/get-activity": System_Collections_Generic.List<Glow_Debug.Activity>,
}
export type Outputs = {
  "/api/blob/delete-all-in-container": MediatR.Unit,
  "/api/blob/delete-file": MediatR.Unit,
  "/api/upload-form-files": Microsoft_FSharp_Collections.FSharpList<Microsoft_FSharp_Core.FSharpResult<AzureFiles.FileSavedToStorage,System.String>>,
  "/api/test-action": Microsoft_FSharp_Collections.FSharpList<Microsoft_FSharp_Core.FSharpResult<AzureFiles.FileSavedToStorage,AzureFiles.ErrorResult>>,
  "/api/upload-system-files": System_Collections_Generic.IEnumerable<Microsoft_FSharp_Core.FSharpOption<AzureFiles.FileSavedToStorage>>,
  "/api/rename-system-files": System_Collections_Generic.IEnumerable<System.String>,
  "/api/my/write-blog-data": MediatR.Unit,
  "/api/file/delete-file": Microsoft_FSharp_Core.FSharpResult<Microsoft_FSharp_Core.Unit,AzureFiles.ServiceError>,
  "/api/file/set-tags": Microsoft_FSharp_Core.FSharpResult<Microsoft_FSharp_Core.Unit,AzureFiles.ServiceError>,
  "/api/glow/set-openid-connect-options": MediatR.Unit,
  "/api/debug/archive-event": Microsoft_FSharp_Core.FSharpResult<Microsoft_FSharp_Core.Unit,Glow_Core_MartenAndPgsql.ApiError>,
  "/api/debug/restore-event": Microsoft_FSharp_Core.FSharpResult<Microsoft_FSharp_Core.Unit,Glow_Core_MartenAndPgsql.ApiError>,
  "/api/debug/rename-event-dotnet-type": Microsoft_FSharp_Core.FSharpResult<System.Int32,Glow_Core_MartenAndPgsql.ApiError>,
  "/api/application/remove-all-event-data": MediatR.Unit,
  "/api/debug/rebuild-projection": MediatR.Unit,
  "/api/debug/rebuild-all-projections": MediatR.Unit,
}
export type Actions = {
  "/api/blob/delete-all-in-container": AzureFiles.DeleteAllBlobs,
  "/api/blob/delete-file": AzureFiles.DeleteBlobFile,
  "/api/upload-form-files": AzureFiles.UploadFormFiles,
  "/api/test-action": AzureFiles.TestAction,
  "/api/upload-system-files": AzureFiles.UploadSystemFiles,
  "/api/rename-system-files": AzureFiles.RenameSystemFiles,
  "/api/my/write-blog-data": AzFiles.GenerateBlogData,
  "/api/file/delete-file": AzFiles_Features.DeleteFile,
  "/api/file/set-tags": AzFiles_Features.SetTags,
  "/api/glow/set-openid-connect-options": Glow_Azure_AzureKeyVault.SetOpenIdConnectOptions,
  "/api/debug/archive-event": Glow_Core_MartenAndPgsql.ArchiveEvent,
  "/api/debug/restore-event": Glow_Core_MartenAndPgsql.RestoreEvent,
  "/api/debug/rename-event-dotnet-type": Glow_Core_MartenAndPgsql.RenameEventDotnetTypeName,
  "/api/application/remove-all-event-data": Glow_Core_MartenAndPgsql.RemoveAllData,
  "/api/debug/rebuild-projection": Glow_Core_MartenAndPgsql.RebuildProjections,
  "/api/debug/rebuild-all-projections": Glow_Core_MartenAndPgsql.RebuildAllProjections,
}

type TagWithKey<TagName extends string, T> = {
  [K in keyof T]: { [_ in TagName]: K } & T[K]
};

export type ActionTable = TagWithKey<"url", Actions>

export type TypedActionHookResult<
  ActionName extends keyof ActionTable
> = UseSubmit<Actions[ActionName], Outputs[ActionName]>

export type TypedActionHook = <ActionName extends keyof ActionTable>(
  key: ActionName,
) => TypedActionHookResult<ActionName>

export const useTypedAction: TypedActionHook = <
  ActionName extends keyof ActionTable
>(
  key: ActionName,
) => {
  const s = useAction<Actions[ActionName], Outputs[ActionName]>(key)
  return s
}

export type QueryTable = TagWithKey<"url", QueryInputs>;

export function useTypedQuery<ActionName extends keyof QueryTable>(key: ActionName, {
    placeholder,
    input,
    queryOptions
  }: {
    placeholder: QueryOutputs[ActionName],
    input:  QueryInputs[ActionName]
    queryOptions?: UseQueryOptions<QueryOutputs[ActionName]>
  }): ApiResult<QueryOutputs[ActionName]> {

  const { data, ...rest} = useApi({
    url: key,
    method:"POST",
    payload: input,
    // todo: find defaultPlaceholder
    placeholder: placeholder,
    queryOptions: queryOptions
  })

  const result = data as QueryOutputs[ActionName]

  return { data: result, ...rest} as any
}

export type FieldPath<P, S> = {
  _PATH_: string & { _BRAND_: P & S }
}

export type PathProxy<P, S> = FieldPath<P, S> &
  { [K in keyof S]: PathProxy<P, S[K]> }

const IdPath = { _PATH_: "" } as FieldPath<any, any>

export function pathProxy<S, P = S>(
  parent: FieldPath<P, S> = IdPath as any,
): PathProxy<P, S> {
  return new Proxy(parent as any, {
    get(target: any, key: any) {
      if (key in target) return target[key]
      return pathProxy<any, any>({
        _PATH_: `${parent._PATH_ && parent._PATH_ + "."}${key}`,
        } as any)
    },
})
}

export function TypedForm<ActionName extends keyof ActionTable>({
  initialValues,
  actionName,
  formProps,
  children,
  onSuccess,
  beforeSubmit,
  onSubmit,
  onError,
}: Omit<FormikConfig<Actions[ActionName]>, "onSubmit"|"children"> & {
  children: ((props: FormikProps<Actions[ActionName]>, pathProxy: PathProxy<Actions[ActionName], Actions[ActionName]>) => React.ReactNode) | React.ReactNode
  actionName: ActionName
  beforeSubmit?: (values: Actions[ActionName]) => Actions[ActionName]
  onSubmit?: (values: Actions[ActionName]) => void
  formProps?: FormikFormProps
  onSuccess?: (payload: Outputs[ActionName]) => void
  onError?: (error: ProblemDetails) => void
}) {
  const _ = React.useMemo(()=> pathProxy<Actions[ActionName]>(),[])
  const { messageSuccess, notifyError} = useNotify()
  const [submit, validate] = useTypedAction<ActionName>(actionName)
  return (
    <Formik
      validate={(values) => validate(beforeSubmit ? beforeSubmit(values) : values) }
      validateOnBlur={true}
      enableReinitialize={true}
      validateOnChange={false}
      initialValues={initialValues}
      onSubmit={async (values) => {
        onSubmit && onSubmit(values)
        const response = await submit(beforeSubmit ? beforeSubmit(values) : values)
        if (response.ok) {
          onSuccess && onSuccess(response.payload)
        } else {
          onError && onError(response.error)
          !onError && notifyError(response.error)
        }
      }
    }
    >
      {(f) => (
       <form {...formProps}>
        {typeof children === "function" ? children(f,_) : children}
        </form>

      )}
    </Formik>)
}

