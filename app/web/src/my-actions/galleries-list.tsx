import { Box, Button } from "@mantine/core"
import { Link } from "react-router-dom"
import { QueryWithBoundary } from "../query"

export function GalleriesListView() {
  return (
    <QueryWithBoundary
      name="/api/features/gallery/get-galleries"
      input={{ none: { skip: undefined } }}
    >
      {(data) => (
        <Box>
          <h1>Galleries</h1>
          <Button component={Link} to="create">
            Create
          </Button>
          {data.Case === "Ok" ? (
            <>
              {data.Fields.map((v) => (
                <div>
                  <Link to={`${v.id}`}>{v.name}</Link>
                </div>
              ))}
            </>
          ) : (
            <div>ERROR</div>
          )}
        </Box>
      )}
    </QueryWithBoundary>
  )
}
