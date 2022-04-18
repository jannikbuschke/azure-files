// Assembly: app, Version=1.0.0.0, Culture=neutral, PublicKeyToken=null
import * as React from "react"
import { QueryOptions, UseQueryOptions } from "react-query"
import { useApi, ApiResult, notifySuccess, notifyError } from "glow-core"
import { useAction, useSubmit, UseSubmit, ProblemDetails } from "glow-core/es/actions/use-submit"
import { Formik, FormikConfig, FormikFormProps } from "formik"
import { Form } from "formik-antd"
import * as AzureFiles from "./AzureFiles"
import * as Glow_TestAutomation from "./Glow.TestAutomation"
import * as Glow_Azure_AzureKeyVault from "./Glow.Azure.AzureKeyVault"
import * as Azure_Storage_Blobs_Models from "./Azure.Storage.Blobs.Models"
import * as Glow_Core_Profiles from "./Glow.Core.Profiles"

type QueryInputs = {
  "/api/blob/get-files": AzureFiles.GetFiles,
  "/api/blob/get-containers": AzureFiles.GetBlobContainers,
  "/api/glow/test-automation/get-available-fake-users": Glow_TestAutomation.GetAvailableFakeUsers,
}
type QueryOutputs = {
  "/api/blob/get-files": Azure_Storage_Blobs_Models.BlobItem[],
  "/api/blob/get-containers": Azure_Storage_Blobs_Models.BlobContainerItem[],
  "/api/glow/test-automation/get-available-fake-users": Glow_TestAutomation.FakeUsers,
}
export type Outputs = {
  "/api/upload-form-files": any,
  "/api/upload-system-files": any,
  "/api/glow/set-openid-connect-options": any,
}
export type Actions = {
  "/api/upload-form-files": AzureFiles.UploadFormFiles,
  "/api/upload-system-files": AzureFiles.UploadSystemFiles,
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

export function TypedForm<ActionName extends keyof ActionTable>({
  initialValues,
  actionName,
  formProps,
  children,
  onSuccess,
  onError,
}: Omit<FormikConfig<Actions[ActionName]>, "onSubmit"> & {
  actionName: ActionName
  formProps?: FormikFormProps
  onSuccess?: (payload: Outputs[ActionName]) => void
  onError?: (error: ProblemDetails) => void
}) {
  const [submit, validate] = useTypedAction<ActionName>(actionName)
  return (
    <Formik
      validate={validate}
      validateOnBlur={true}
      enableReinitialize={true}
      validateOnChange={false}
      initialValues={initialValues}
      onSubmit={async (values) => {
        const response = await submit(values)
        if (response.ok) {
          onSuccess && onSuccess(response.payload)
        } else {
          onError && onError(response.error)
          !onError && notifyError(response.error)
        }
      }}
    >
      {(f) => (
        <Form {...formProps}>
          {typeof children === "function" ? children(f) : children}
        </Form>
      )}
    </Formik>)
}

