import React from "react"
import { QueryClient, UseQueryOptions } from "react-query"
import { Updater } from "react-query/types/core/utils"
import { Microsoft_FSharp_Core } from "../client"
import {
  useTypedQuery,
  Actions,
  ActionTable,
  QueryInputs,
  QueryOutputs,
  useTypedAction,
  QueryTable,
} from "../client/api"
import { ErrorBoundary } from "../error-boundary"

export function LoadBoundary({
  children,
}: {
  children: React.ReactNode | React.ReactNode[]
}) {
  return (
    <React.Suspense fallback={<div>loading...</div>}>{children}</React.Suspense>
  )
}

// <ActionName extends keyof QueryTable>(key: ActionName, {
//     placeholder,
//     input,
//     queryOptions
//   }: {
//     placeholder: QueryOutputs[ActionName],
//     input:  QueryInputs[ActionName]
//     queryOptions?: UseQueryOptions<QueryOutputs[ActionName]>
//   }): ApiResult<QueryOutputs[ActionName]>
//UseQueryOptions<QueryOutputs[QueryName], unknown, QueryOutputs[QueryName]
type QueryProps<QueryName extends keyof QueryTable> = {
  name: QueryName
  input: QueryInputs[QueryName]
  queryOptions?: UseQueryOptions<
    QueryOutputs[QueryName],
    unknown,
    QueryOutputs[QueryName]
  >
  children: (
    data: QueryOutputs[QueryName],
    controls: { refetch: () => void },
  ) => React.ReactElement
  // placeholder: QueryOutputs[QueryName]
  // onSuccess?: (payload: Outputs[ActionName]) => void
  // onError?: (error: ProblemDetails) => void
}

export function QueryWithBoundary<QueryName extends keyof QueryTable>(
  props: QueryProps<QueryName>,
) {
  return (
    <div>
      <ErrorBoundary>
        <LoadBoundary>
          <Query {...props} />
        </LoadBoundary>
      </ErrorBoundary>
    </div>
  )
}

export function Query<QueryName extends keyof QueryTable>({
  name,
  input,
  children,
  queryOptions,
}: // placeholder,
QueryProps<QueryName>) {
  const { data, refetch } = useTypedQuery(name, {
    input: input,
    placeholder: null as any,
    queryOptions: {
      suspense: true,
      useErrorBoundary: true,
      ...(queryOptions ? queryOptions : {}),
    },
  })

  // not sure why typescript does not infer data correctly
  return children(data, { refetch })
}

type UpdateQueryDataProps<QueryName extends keyof QueryTable> = {
  name: QueryName
  input: QueryInputs[QueryName]
  client: QueryClient
  updater: Updater<QueryOutputs[QueryName] | undefined, QueryOutputs[QueryName]>
  // children: (
  //   data: QueryOutputs[QueryName],
  //   controls: { refetch: () => void },
  // ) => React.ReactElement
  // placeholder: QueryOutputs[QueryName]
  // onSuccess?: (payload: Outputs[ActionName]) => void
  // onError?: (error: ProblemDetails) => void
}

export function updateQueryData<QueryName extends keyof QueryTable>({
  client,
  name,
  input,
  updater,
}: // placeholder,
UpdateQueryDataProps<QueryName>) {
  client.setQueryData<QueryOutputs[QueryName]>([name, input], updater)
}

// export function useTypedQuery<ActionName extends keyof QueryTable>(key: ActionName, {
//     placeholder,
//     input,
//     queryOptions
//   }: {
//     placeholder: QueryOutputs[ActionName],
//     input:  QueryInputs[ActionName]
//     queryOptions?: UseQueryOptions<QueryOutputs[ActionName]>
//   }): ApiResult<QueryOutputs[ActionName]> {

//   const { data, ...rest} = useApi({
//     url: key,
//     method:"POST",
//     payload: input,
//     // todo: find defaultPlaceholder
//     placeholder: placeholder,
//     queryOptions: queryOptions
//   })

//   const result = data as QueryOutputs[ActionName]

//   return { data: result, ...rest} as any
// }
