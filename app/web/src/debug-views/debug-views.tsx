import * as React from "react"
import {
  Container,
  TextInput as Input,
  Paper,
  Table,
  Button,
  Group,
  Stack,
  ScrollArea,
  MantineProvider,
  Box,
  useMantineTheme,
} from "@mantine/core"
import { LoadingOverlay } from "@mantine/core"
import { ErrorBanner, useNotify } from "glow-core"
import { Prism } from "@mantine/prism"
import { useTypedAction, useTypedQuery } from "../client/api"
import { AsyncButton } from "../typed-api/ActionButton"

export function DebugViews() {
  const [documentName, setDocumentName] = React.useState("file")
  const { data: documentNames, error: errorDocumentNames } = useTypedQuery(
    "/api/gebug/get-document-names",
    {
      input: { dummy: {} },
      placeholder: [],
    },
  )
  const {
    data: documents,
    loading: loadingDocuments,
    error: errorDocuments,
    isLoading,
  } = useTypedQuery("/api/debug/get-documents", {
    input: { documentName },
    placeholder: [],
  })

  const [projectionName, setProjectionName] = React.useState("File")
  const [rebuildProjection, , { submitting: rebuildingProjection }] =
    useTypedAction("/api/debug/rebuild-projection")
  const [rebuildAllProjection, , { submitting: rebuildingAllprojections }] =
    useTypedAction("/api/debug/rebuild-all-projections")
  const [selected, setSelected] = React.useState<null | any>()

  const { colorScheme } = useMantineTheme()
  const { notifyError, notifySuccess } = useNotify()
  return (
    <MantineProvider
      theme={{
        colorScheme,
        components: {
          Button: {
            defaultProps: { variant: "default", size: "xs" },
          },
        },
      }}
    >
      <Container fluid={true} pos="relative">
        <ErrorBanner message={errorDocuments} />
        <ErrorBanner message={errorDocumentNames} />
        <LoadingOverlay visible={isLoading} />
        <Paper shadow="xs" p="md">
          <Group>
            <Group>
              <Input
                value={projectionName}
                onChange={(v) => setProjectionName(v.target.value)}
              />

              <Button
                loading={rebuildingProjection}
                onClick={async () => {
                  const result = await rebuildProjection({ projectionName })
                  if (result.ok) {
                    notifySuccess()
                  } else {
                    notifyError(result.error)
                  }
                }}
              >
                Rebuild projection '{projectionName}'
              </Button>
              {/* <AsyncButton
                action="/api/application/remove-all-event-data"
                values={{ validationPhrase: "I know what I am doing" }}
              >
                Delete all
              </AsyncButton> */}
            </Group>
            <Group>
              <Button
                loading={rebuildingAllprojections}
                onClick={async () => {
                  const result = await rebuildAllProjection({ payload: {} })
                  if (result.ok) {
                    notifySuccess()
                  } else {
                    notifyError(result.error)
                  }
                }}
              >
                Rebuild all projections
              </Button>
            </Group>
          </Group>
          <Stack>
            <Input
              label="Document name"
              value={documentName}
              onChange={(v) => setDocumentName(v.target.value)}
            />
            <Group>
              {documentNames.map((v) => (
                <Button onClick={() => setDocumentName(v)}>{v}</Button>
              ))}
              {/* {[
              "MeetingItem",
              "Meeting",
              "File",
              "User",
              "Committee",
              "Member",
              "CacheUser",
              "GlobalDomainConfiguration",
            ].map((v) => (
              <Button onClick={() => setDocumentName(v)}>{v}</Button>
            ))} */}
            </Group>
          </Stack>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "450px 1fr",
              gap: 8,
              alignItems: "start",
            }}
          >
            <Paper shadow="xs">
              <Table>
                <thead>
                  <tr>
                    <th>id</th>
                    <th>name</th>
                    {/* {documents.length > 0 ? (
                      Object.keys(documents[0])
                        // .filter((v) => v != "id" && v != "meetingId")
                        .map((v) => <th>{v}</th>)
                    ) : (
                      <th>text</th>
                    )} */}
                  </tr>
                </thead>
                <tbody>
                  {documents.map((v) => (
                    <Box
                      component="tr"
                      key={v.id}
                      sx={(theme) => ({
                        background:
                          selected?.id == v.id
                            ? theme.colors.gray![3]
                            : undefined,
                      })}
                      onClick={() => setSelected(v)}
                    >
                      <td>{v.id.substring(0, 8)}</td>
                      <td>
                        {v.name || v.title || v.displayName || v.data || "N/A"}
                      </td>
                      {/* <td>{JSON.stringify(v)}</td> */}
                      {/* {Object.keys(v)
                        .map((k) => {
                          const cellData = v[k]
                          return (
                            <td>
                              {typeof cellData === "object"
                                ? JSON.stringify(cellData)
                                : cellData}
                            </td>
                          )
                        })} */}
                    </Box>
                  ))}
                </tbody>
                {/* <tbody>{rows}</tbody> */}
              </Table>
            </Paper>
            <Paper shadow="xs" pos="sticky" top={10}>
              <div>
                <Prism language="json">
                  {selected ? JSON.stringify(selected, null, 2) : ""}
                </Prism>
                {/* <Prism language="json">
                  {selected ? JSON.stringify(selected.headers, null, 2) : ""}
                </Prism> */}
              </div>
            </Paper>
          </div>
        </Paper>
      </Container>
    </MantineProvider>
  )
}
