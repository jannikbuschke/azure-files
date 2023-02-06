// Assembly: app, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null
import * as React from "react"
import { QueryOptions, UseQueryOptions } from "react-query"
import { useApi, ApiResult, useNotify } from "glow-core"
import { useAction, useSubmit, UseSubmit, ProblemDetails } from "glow-core"
import { Formik, FormikConfig, FormikFormProps, FormikProps } from "formik"
import { Form } from "formik-antd"
import * as AzureFiles from "./AzureFiles"
import * as AzFiles from "./AzFiles"
import * as Glow_TestAutomation from "./Glow.TestAutomation"
import * as Glow_Azure_AzureKeyVault from "./Glow.Azure.AzureKeyVault"
import * as Glow_Core_Profiles from "./Glow.Core.Profiles"
import * as Azure_Storage_Blobs_Models from "./Azure.Storage.Blobs.Models"
import * as Azure from "./Azure"
import * as MediatR from "./MediatR"

export type QueryInputs = {
  "/api/blob/get-file": AzureFiles.GetBlobFile,
  "/api/files/get-indexed-files": AzureFiles.GetIndexedFiles,
  "/api/files/get-indexed-file": AzureFiles.GetIndexedFile,
  "/api/blob/get-files": AzureFiles.GetFiles,
  "/api/file/get-next-untagged": AzureFiles.GetNextUntaggedBlob,
  "/api/file/get-all-untagged": AzureFiles.GetAllUntagged,
  "/api/blob/get-containers": AzureFiles.GetBlobContainers,
  "/api/glow/test-automation/get-available-fake-users": Glow_TestAutomation.GetAvailableFakeUsers,
  "/glow/profile/get-profile": Glow_Core_Profiles.GetProfile,
}
export type QueryOutputs = {
  "/api/blob/get-file": AzureFiles.AzureFilesBlobProperties,
  "/api/files/get-indexed-files": Array<AzureFiles.FileAggregate>,
  "/api/files/get-indexed-file": AzureFiles.FileAggregate,
  "/api/blob/get-files": Array<Azure_Storage_Blobs_Models.BlobItem>,
  "/api/file/get-next-untagged": AzureFiles.FileAggregate,
  "/api/file/get-all-untagged": Array<AzureFiles.FileAggregate>,
  "/api/blob/get-containers": Array<Azure_Storage_Blobs_Models.BlobContainerItem>,
  "/api/glow/test-automation/get-available-fake-users": Glow_TestAutomation.FakeUsers,
  "/glow/profile/get-profile": Glow_Core_Profiles.Profile,
}
export type Outputs = {
  "/api/blob/delete-all-in-container": MediatR.Unit,
  "/api/blob/delete-file": MediatR.Unit,
  "/api/file/set-tags": MediatR.Unit,
  "/api/file/set-tags-batched": MediatR.Unit,
  "/api/upload-form-files": MediatR.Unit,
  "/api/upload-system-files": Array<AzureFiles.FileSavedToStorage>,
  "/api/rename-system-files": any,
  "/api/my/write-blog-data": MediatR.Unit,
  "/api/glow/set-openid-connect-options": MediatR.Unit,
}
export type Actions = {
  "/api/blob/delete-all-in-container": AzureFiles.DeleteAllBlobs,
  "/api/blob/delete-file": AzureFiles.DeleteBlobFile,
  "/api/file/set-tags": AzureFiles.SetTags,
  "/api/file/set-tags-batched": AzureFiles.SetTagsBatched,
  "/api/upload-form-files": AzureFiles.UploadFormFiles,
  "/api/upload-system-files": AzureFiles.UploadSystemFiles,
  "/api/rename-system-files": AzureFiles.RenameSystemFiles,
  "/api/my/write-blog-data": AzFiles.GenerateBlogData,
  "/api/glow/set-openid-connect-options": Glow_Azure_AzureKeyVault.SetOpenIdConnectOptions,
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

type QueryTable = TagWithKey<"url", QueryInputs>;

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
  onError,
}: Omit<FormikConfig<Actions[ActionName]>, "onSubmit"> & {

  actionName: ActionName
  beforeSubmit?: (values: Actions[ActionName]) => Actions[ActionName]
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
        <Form {...formProps}>
          {typeof children === "function" ? children(f) : children}
        </Form>

      )}
    </Formik>)
}

