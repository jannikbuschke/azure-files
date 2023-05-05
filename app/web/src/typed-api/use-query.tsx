import { useApi } from "glow-core"
import { UseQueryOptions, UseQueryResult } from "react-query"
import { QueryInputs, QueryOutputs, QueryTable } from "../client/api"

export type ApiResult<Result> = UseQueryResult<Result, any> & {
  data: Result
  loading: boolean
  reload: () => void
}

export function useTypedQuery<ActionName extends keyof QueryTable>(
  key: ActionName,
  {
    placeholder,
    input,
    queryOptions,
  }: {
    placeholder?: QueryOutputs[ActionName]
    input: QueryInputs[ActionName]
    queryOptions?: UseQueryOptions<QueryOutputs[ActionName]>
  },
): [QueryOutputs[ActionName], ApiResult<QueryOutputs[ActionName]>] {
  const apiResult = useApi({
    url: key,
    method: "POST",
    payload: input,
    // todo: find defaultPlaceholder
    placeholder: placeholder,
    queryOptions: { ...queryOptions, suspense: true, useErrorBoundary: true },
  })

  const result = apiResult.data as QueryOutputs[ActionName]

  return [result, apiResult]
}
