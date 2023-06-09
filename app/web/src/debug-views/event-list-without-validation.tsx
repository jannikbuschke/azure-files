import {
  Box,
  Button,
  Collapse,
  Group,
  LoadingOverlay,
  Paper,
  ScrollArea,
  Stack,
  Table,
  Text,
} from "@mantine/core"
import dayjs from "dayjs"
import { ErrorBanner, useNotify } from "glow-core"
import React from "react"
import { Prism } from "@mantine/prism"
import { TextInput } from "formik-mantine"
import { TypedForm, useTypedQuery } from "../client/api"
import { useSubscriptions } from "../client/subscriptions"
import { EventViewmodel2 } from "../client/Glow_Core_MartenAndPgsql"
import { Label } from "../generic/label"
import { AsyncButton } from "../typed-api/ActionButton"

export function EsEventListWithoutValidation() {
  const { data, error, refetch, loading } = useTypedQuery(
    "/api/es/get-events-without-validation",
    {
      input: {},
      placeholder: [],
    },
  )
  // const [rerender, setRerender] = React.useState(0)
  // useInterval(() => setRerender(rerender + 1), 5000)
  const [selected, setSelected] = React.useState<null | EventViewmodel2>()
  useSubscriptions(
    (v) => {
      refetch()
    },
    [refetch],
  )
  const { notifyError, notifySuccess } = useNotify()
  const [opened, setOpened] = React.useState(false)
  return (
    <div style={{ position: "relative" }}>
      <ErrorBanner message={error} />

      <Button variant="default" onClick={() => setOpened((o) => !o)}>
        Rename event type
      </Button>

      <Collapse in={opened}>
        <Paper p="xs" shadow="xs" my="xs">
          <TypedForm
            actionName={"/api/debug/rename-event-dotnet-type"}
            initialValues={{ oldName: "", newName: "" }}
            onSuccess={(result) => {
              if (result.Case === "Error") {
                notifyError(result.Case)
              } else {
                notifySuccess(JSON.stringify(result))
              }
            }}
          >
            {(f, _) => (
              <Stack align={"start"}>
                <TextInput
                  name={_.oldName._PATH_}
                  label={"Old name"}
                  style={{ width: 800 }}
                />
                <TextInput
                  name={_.newName._PATH_}
                  label={"New name"}
                  style={{ width: 800 }}
                />
                <Button loading={f.isSubmitting} onClick={() => f.submitForm()}>
                  Rename
                </Button>
              </Stack>
            )}
          </TypedForm>
        </Paper>
      </Collapse>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "600px 1fr",
          gap: 8,
          alignItems: "start",
        }}
      >
        <Paper shadow="xs">
          <Table
          // key={rerender}
          >
            <thead>
              <tr>
                <th>Stream</th>
                <th>V</th>
                <th>Seq</th>
                <th>Time</th>
                <th>Name</th>
              </tr>
            </thead>
            <tbody>
              {data.map((element) => {
                const timestamp = dayjs(element.timestamp)
                const diff = timestamp.diff(dayjs())
                return (
                  <Box
                    component="tr"
                    key={element.id}
                    sx={(theme) => ({
                      background:
                        selected?.id == element.id
                          ? theme.colorScheme === "light"
                            ? theme.colors.gray![3]
                            : theme.colors.dark![3]
                          : undefined,
                    })}
                    onClick={() => setSelected(element)}
                  >
                    <td>{element.stream_id?.substring(0, 5)}</td>
                    <td>{element.version}</td>
                    <td>{element.seq_id}</td>
                    <td>
                      {/* {diff}{" "} */}
                      {diff >= -1000000
                        ? dayjs(element.timestamp).fromNow()
                        : timestamp.isSame(dayjs(), "day")
                        ? dayjs(element.timestamp).format("LT")
                        : dayjs(element.timestamp).format("L LT")}
                    </td>
                    <td>{element.type}</td>
                  </Box>
                )
              })}
            </tbody>
          </Table>
        </Paper>
        <Paper shadow="xs" pos="sticky" top={10}>
          <ScrollArea style={{ height: 900 }}>
            <div>
              {selected ? (
                <>
                  <Box p="md">
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "auto 1fr",
                        gap: "2px 30px",
                      }}
                    >
                      <Label>dotnet type</Label>
                      <Text>{selected.mt_dotnet_type}</Text>
                      <Label>type</Label>
                      <Text>{selected.type}</Text>
                      <Label>timestamp</Label>
                      <Text>{dayjs(selected.timestamp).format("L LT")}</Text>
                      <Label>version</Label>
                      <Text>{selected.version}</Text>
                      <Label>Stream Id</Label>
                      <Text>{selected.stream_id}</Text>
                      <Label>Event Id</Label>
                      <Text>{selected.id}</Text>
                      <Label>Seq id</Label>
                      <Text>{selected.seq_id}</Text>
                      <Label>Is archived</Label>
                      <Text>{selected.is_archived ? "Yes" : "No"}</Text>
                    </div>
                  </Box>
                  <Prism language="json">
                    {JSON.stringify(JSON.parse(selected.data), null, 2)}
                  </Prism>
                  <Prism language="json">
                    {JSON.stringify(JSON.parse(selected.headers), null, 2)}
                  </Prism>
                  {selected.is_archived ? (
                    <AsyncButton
                      m="xs"
                      variant="default"
                      action="/api/debug/restore-event"
                      values={{ eventId: selected.id }}
                    >
                      Restore
                    </AsyncButton>
                  ) : (
                    <AsyncButton
                      m="xs"
                      variant="default"
                      action="/api/debug/archive-event"
                      values={{ eventId: selected.id }}
                    >
                      Archive
                    </AsyncButton>
                  )}
                </>
              ) : null}
            </div>
          </ScrollArea>
        </Paper>
      </div>
      <LoadingOverlay visible={loading} />
    </div>
  )
}
