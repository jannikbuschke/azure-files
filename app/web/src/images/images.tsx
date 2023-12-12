import { Box, SegmentedControl, Image, Badge, Group, Card } from "@mantine/core"
import React from "react"
import { QueryWithBoundary } from "../query"
import Masonry from "react-masonry-css"
import "./images.css"
import dayjs from "dayjs"

export function ImagesGallery() {
  const [selectedTag, setSelectedTag] = React.useState<string | null>(null)
  return (
    <Box>
      <QueryWithBoundary
        name="/api/get-tags"
        input={{ none: { skip: undefined } }}
      >
        {(data) => (
          <SegmentedControl
            mb="xs"
            value={selectedTag || ""}
            onChange={setSelectedTag}
            data={[...data, "all"].map((v) => ({ label: v, value: v }))}
          />
        )}
      </QueryWithBoundary>

      <QueryWithBoundary
        name="/api/get-images"
        input={{
          pagination: { Case: "NoPagination" },
          chronologicalSortDirection: { Case: "Asc" },
          filter:
            selectedTag !== null
              ? { Case: "Tagged", Fields: [selectedTag] }
              : { Case: "All" },
        }}
        queryOptions={{
          enabled: selectedTag !== null,
        }}
      >
        {(data) =>
          data === null ? (
            selectedTag === null ? (
              <div>no filter selected</div>
            ) : (
              <div>loading...</div>
            )
          ) : (
            <Masonry
              breakpointCols={{
                default: 3,
              }}
              className="my-masonry-grid"
              columnClassName="my-masonry-grid_column"
            >
              {data.map((v, i) => {
                const thumbnail = v.lowresVersions.find(
                  (v) => v.name == "thumbnail",
                )
                return (
                  <div
                    style={{
                      position: "relative",
                    }}
                  >
                    <Card shadow="sm" radius="md" withBorder={true}>
                      <Card.Section>
                        <Image
                          style={{}}
                          fit="contain"
                          src={`/api/photos/src/${v.id}`}
                          // src={thumbnail?.url || v.url!}
                          imageProps={{ loading: "lazy" }}
                        />
                        <Group position="apart" m="xs">
                          {thumbnail ? <Badge>Thumbnail</Badge> : null}
                          {v.dateTime ? (
                            <Badge
                              size="xs"
                              radius={"xl"}
                              variant="light"
                              color="gray"
                            >
                              {dayjs(v.dateTime).format("MMM YYYY")}
                            </Badge>
                          ) : null}
                          <Group>
                            {v.tags.map((v) => (
                              <Badge
                                size="xs"
                                radius={"xl"}
                                variant="light"
                                color="pink"
                              >
                                {v}
                              </Badge>
                            ))}
                          </Group>
                        </Group>
                      </Card.Section>
                    </Card>
                  </div>
                )
              })}
            </Masonry>
          )
        }
      </QueryWithBoundary>
    </Box>
  )
}
