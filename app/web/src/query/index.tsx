import React from "react"
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

type QueryProps<QueryName extends keyof QueryTable> = {
  name: QueryName
  input: QueryInputs[QueryName]
  children: (data: QueryOutputs[QueryName]) => React.ReactElement
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
}: // placeholder,
QueryProps<QueryName>) {
  const { data } = useTypedQuery(name, {
    input: input,
    placeholder: null as any,
    queryOptions: {
      suspense: true,
      useErrorBoundary: true,
    },
  })

  // not sure why typescript does not infer data correctly
  return children(data)
}
