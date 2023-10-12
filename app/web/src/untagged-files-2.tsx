import {
  Affix,
  Button,
  Grid,
  Image,
  LoadingOverlay,
  Transition,
} from "@mantine/core"
import { Checkbox } from "formik-mantine"
import { FaArrowUp, FaTrash } from "react-icons/fa"
import { useWindowScroll } from "@mantine/hooks"
import { Paper } from "@mantine/core"
import { showNotification } from "@mantine/notifications"
import { tags } from "./blob-container/tag-values"
import { Stack } from "@mantine/core"
import { TypedForm, useTypedQuery } from "./client/api"

const tags = [
  { label: "Keep", value: "keep", icon: <FaArchive /> },
  { label: "Stage for blob", value: "stage-for-blog", icon: null },
  { label: "publish", value: "publish", icon: <FaArrowUp /> },
  { label: "trash", value: "trash", icon: <FaTrash /> },
]

function UntaggedFilesView() {
  const { data, refetch } = useTypedQuery("/api/file/get-all-untagged", {
    input: {},
    placeholder: [],
  })
  const [scroll, scrollTo] = useWindowScroll()
  return (
    <div>
      <TypedForm
        actionName="/api/file/set-tags-batched"
        initialValues={{
          // fileIds: [],
          tags: [],
          files: {},
        }}
        onSuccess={() => {
          showNotification({ message: "Success", color: "green" })
          refetch()
        }}
      >
        {(f) => (
          <div>
            <Affix position={{ top: 20, right: 20 }}>
              <Paper shadow="xl" p="xs" style={{ background: "transparent" }}>
                <Stack style={{ flexDirection: "row" }}>
                  {tags.map((v) => (
                    <Button
                      size="xs"
                      color="teal"
                      key={v.value}
                      disabled={f.isSubmitting}
                      leftIcon={v.icon}
                      // style={transitionStyles}
                      onClick={() => {
                        // defaultTag
                        f.setFieldValue("tags", [{ name: v.value }])
                        f.submitForm()
                      }}
                    >
                      {v.label}
                    </Button>
                  ))}
                </Stack>
              </Paper>

              {/* <Transition transition="slide-up" mounted={scroll.y > 0}>
          {(transitionStyles) => (
          )}
        </Transition> */}
            </Affix>
            <Grid style={{ marginTop: 80 }} gutter="xs">
              {data.map((v, i) => (
                <Grid.Col span={4}>
                  <div style={{ width: "100%", position: "relative" }}>
                    {/* {i} */}
                    <LoadingOverlay
                      visible={Boolean(f.isSubmitting && f.values.files[v.id])}
                    />
                    <Image
                      onClick={() => {
                        const currentValue = f.values.files[v.id]
                        const result = !Boolean(f.values.files[v.id])
                        console.log("on click", { result, currentValue })
                        f.setFieldValue(`files[${v.id}]`, result, true)
                      }}
                      // radius="md"
                      src={v.lowresUrl || v.thumbnailUrl || v.url!}
                    />
                    <Checkbox
                      disabled={f.isSubmitting}
                      name={`files[${v.id}]`}
                      style={{
                        position: "absolute",
                        top: 5,
                        left: 5,
                        opacity: f.values.files[v.id] ? 0.9 : 0.8,
                      }}
                    />
                    {/* {JSON.stringify(f.values, null, 4)} */}
                  </div>
                </Grid.Col>
              ))}
            </Grid>
          </div>
        )}
      </TypedForm>
      <pre>{JSON.stringify(data, null, 4)}</pre>
    </div>
  )
}
