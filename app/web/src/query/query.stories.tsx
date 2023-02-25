import { Box, Paper } from "@mantine/core"
import { Query } from "."

export function QueryStory() {
  return (
    <Box>
      <Paper p="xs" shadow="xs">
        {/* <Query name="/api/ms-teams/get-team-and-channel-name">{(data) => <RenderObject {...data} />}</Query> */}
      </Paper>
    </Box>
  )
}
