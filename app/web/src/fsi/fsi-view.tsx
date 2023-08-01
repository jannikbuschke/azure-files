import { Box, Button } from "@mantine/core"
import { Textarea } from "formik-mantine"
import { TypedForm } from "../client/api"

import Editor from "react-simple-code-editor"
import { highlight, languages } from "prismjs/components/prism-core"
import "prismjs/components/prism-clike"
import "prismjs/components/prism-fsharp"
import "prismjs/components/prism-javascript"
import "prismjs/themes/prism.css" //Example style, you can use another
import { RenderObject, useNotify } from "glow-core"
import { useHotkeys } from "@mantine/hooks"
import { useFormik, useFormikContext } from "formik"
import React from "react"
import { EvalResult } from "../client/AzFiles_Features_Fsi"
// import { css } from "@emotion/css"

console.log({ languages })

function SubmitOnCtrlEnter() {
  const ctx = useFormikContext()
  useHotkeys([["ctrl+Enter", () => ctx.submitForm()]])
  return null
}

export function Fsi() {
  const [result, setResult] = React.useState<EvalResult>()
  const { notifyError } = useNotify()
  return (
    <div>
      <TypedForm
        actionName="/api/fsi/evaluate"
        initialValues={{ expression: "5+4" }}
        onSuccess={(result) => {
          if (result.Case === "Ok") {
            setResult(result.Fields)
          } else {
            notifyError(result.Fields.message)
          }
          console.log({ result })
        }}
      >
        {(f, _) => (
          <>
            <Textarea name={_.expression._PATH_} />
            <SubmitOnCtrlEnter />
            <Box
              mt="xs"
              bg="white"
              sx={(theme) => ({
                "&:focus": {
                  border: `4px solid ${theme.colors.gray[2]}`,
                },
                border: `1px solid ${theme.colors.gray[5]}`,
                borderRadius: 4,
              })}
            >
              <Editor
                textareaClassName="asd"
                preClassName="asd"
                value={f.values.expression}
                onValueChange={(code) =>
                  f.setFieldValue(_.expression._PATH_, code)
                }
                highlight={(code) => highlight(code, languages.fsharp)}
                padding={10}
                style={{
                  fontFamily: '"Fira code", "Fira Mono", monospace',
                  fontSize: 12,
                  border: "none",
                }}
              />
            </Box>
            <Button
              mt="xs"
              loading={f.isSubmitting}
              onClick={() => f.submitForm()}
            >
              Eval
            </Button>

            {result && (
              <Box
                mt="xs"
                bg="gray.2"
                p="xs"
                style={{ whiteSpace: "pre-wrap" }}
              >
                <b>Result: </b> {result.result}
              </Box>
            )}
            {result && (
              <Box
                mt="xs"
                bg="gray.4"
                p="xs"
                style={{ whiteSpace: "pre-wrap" }}
              >
                <div dangerouslySetInnerHTML={{ __html: result.out || "" }} />
              </Box>
            )}

            {result && result.error && (
              <Box
                mt="xs"
                bg="red.1"
                p="xs"
                color="red"
                sx={(theme) => ({ color: theme.colors.red[8] })}
                style={{ whiteSpace: "pre-wrap" }}
              >
                <div dangerouslySetInnerHTML={{ __html: result.error || "" }} />
              </Box>
            )}
          </>
        )}
      </TypedForm>
    </div>
  )
}
