import { ActionIcon, ActionIconProps, Button, ButtonProps } from "@mantine/core"
import { useNotify } from "glow-core"
import { ProblemDetails } from "glow-core/src/actions/use-submit"
import { Actions, ActionTable, Outputs, useTypedAction } from "../client/api"

export function AsyncActionIcon<ActionName extends keyof ActionTable>({
  action,
  values,
  onSuccess,
  onError,
  ...props
}: Omit<ActionIconProps, "onClick" | "loading"> & {
  action: keyof ActionTable
  values: Actions[ActionName]
  onSuccess?: (payload: Outputs[ActionName]) => void
  onError?: (error: ProblemDetails) => void
}) {
  const [submit, _, { submitting }] = useTypedAction(action)
  const { notifyError } = useNotify()
  return (
    <ActionIcon
      {...props}
      loading={submitting}
      onClick={async () => {
        const result = await submit(values)
        if (result.ok) {
          onSuccess && onSuccess(result.payload as any)
        } else {
          onError ? onError(result.error) : notifyError(result.error)
        }
      }}
    />
  )
}

export function AsyncButton<ActionName extends keyof ActionTable>({
  action,
  values,
  onSuccess,
  onError,
  ...props
}: Omit<ButtonProps, "onClick" | "loading"> & {
  action: ActionName
  values: Actions[ActionName]
  onSuccess?: (payload: Outputs[ActionName]) => void
  onError?: (error: ProblemDetails) => void
}) {
  const [submit, _, { submitting }] = useTypedAction(action)
  const { notifyError } = useNotify()
  return (
    <Button
      {...props}
      loading={submitting}
      onClick={async () => {
        const result = await submit(values)
        if (result.ok) {
          onSuccess && onSuccess(result.payload)
        } else {
          onError ? onError(result.error) : notifyError(result.error)
        }
      }}
    />
  )
}
