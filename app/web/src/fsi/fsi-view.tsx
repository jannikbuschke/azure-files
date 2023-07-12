import { Button } from "@mantine/core"
import { Textarea } from "formik-mantine"
import { TypedForm } from "../client/api"

export function Fsi() {
  return (
    <div>
      <TypedForm
        actionName="/api/fsi/evaluate"
        initialValues={{ expression: "5+4" }}
      >
        {(f, _) => (
          <div>
            <Textarea name={_.expression._PATH_} />
            <Button loading={f.isSubmitting} onClick={() => f.submitForm()}>
              Eval
            </Button>
          </div>
        )}
      </TypedForm>
    </div>
  )
}
