import { Box, Container, Paper, Table } from "@mantine/core"
import dayjs from "dayjs"
import { ErrorBanner, RenderObject } from "glow-core"
import React from "react"
import { useInterval, useTimeout } from "react-use"
import { Prism } from "@mantine/prism"
import { useTypedQuery } from "../client/api"
import { useSubscriptions } from "../client/subscriptions"
import { EventViewmodel } from "../client/Glow_Core_MartenAndPgsql"

export function EsEventList() {
  const { data, error, refetch } = useTypedQuery("/api/es/get-events", {
    input: {},
    placeholder: [],
  })
  const [rerender, setRerender] = React.useState(0)
  useInterval(() => setRerender(rerender + 1), 5000)
  const [selected, setSelected] = React.useState<null | EventViewmodel>()
  useSubscriptions(
    (v) => {
      refetch()
    },
    [refetch],
  )
  return (
    <div>
      <ErrorBanner message={error} />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "auto 1fr",
          gap: 8,
          alignItems: "start",
        }}
      >
        <Paper shadow="xs">
          <Table key={rerender}>
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
                          ? theme.colors.gray![3]
                          : undefined,
                    })}
                    onClick={() => setSelected(element)}
                  >
                    <td>{element.streamId?.substring(0, 5)}</td>
                    <td>{element.version}</td>
                    <td>{element.sequence}</td>
                    <td>
                      {/* {diff}{" "} */}
                      {diff >= -1000000
                        ? dayjs(element.timestamp).fromNow()
                        : timestamp.isSame(dayjs(), "day")
                        ? dayjs(element.timestamp).format("LT")
                        : dayjs(element.timestamp).format("L LT")}
                    </td>
                    <td>{element.eventTypeName}</td>
                  </Box>
                )
              })}
            </tbody>
          </Table>
        </Paper>
        <Paper shadow="xs" pos="sticky" top={10}>
          <div>
            <Prism language="json">
              {selected ? JSON.stringify(selected.data, null, 2) : ""}
            </Prism>
            <Prism language="json">
              {selected ? JSON.stringify(selected.headers, null, 2) : ""}
            </Prism>
          </div>
        </Paper>
      </div>
    </div>
  )
}
