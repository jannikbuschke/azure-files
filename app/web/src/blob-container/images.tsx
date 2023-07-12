import {
  Box,
  Grid,
  SegmentedControl,
  Image,
  Badge,
  Group,
  Space,
  Card,
  Button,
  Text,
} from "@mantine/core"
import { useMediaQuery } from "@mantine/hooks"
import React from "react"
import { QueryWithBoundary } from "../query"
import Masonry from "react-masonry-css"
import "./images.css"
import { useLocation } from "react-router"
import dayjs from "dayjs"

export function ImagesGallery() {
  const [selectedTag, setSelectedTag] = React.useState<string | null>(null)
  const isSmallScreen = useMediaQuery("(max-width: 800px)")
  const { search } = useLocation()
  const date = new URLSearchParams(search).get("date")
  return (
    <Box>
      <QueryWithBoundary
        name="/api/get-tags"
        input={{ none: { skip: undefined } }}
      >
        {(data) => (
          <SegmentedControl
            value={selectedTag || ""}
            onChange={setSelectedTag}
            data={[...data, "all"].map((v) => ({ label: v, value: v }))}
          />
        )}
      </QueryWithBoundary>

      <QueryWithBoundary
        name="/api/get-images"
        input={{
          date: date,
          includingTags:
            selectedTag === "all" ? [] : selectedTag ? [selectedTag] : [],
        }}
      >
        {(data) => (
          <Masonry
            breakpointCols={{
              default: 1,
              // default: 3,
              // 1200: 2,
              // 500: 1,
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
                    // width: "100%",
                    position: "relative",
                  }}
                >
                  {/* {v.url!} */}
                  {/* // width={isSmallScreen ? "100%" : undefined}
                // height={isSmallScreen ? undefined : 200} */}
                  <Card
                    shadow="sm"
                    radius="md"
                    withBorder={true}
                    // style={{
                    //   maxHeight: "95vh",
                    //   maxWidth: "95vw",
                    // }}
                  >
                    <Card.Section>
                      <Image
                        style={{
                          height: "95vh",
                          maxHeight: "95vh",
                          maxWidth: "95vw",
                        }}
                        fit="cover"
                        // fit={isSmallScreen ? "contain" : "cover"}
                        // radius="md"
                        src={thumbnail?.url || v.url!}
                        imageProps={{ loading: "lazy" }}
                      />
                      <Group
                        position="apart"
                        m="xs"
                        // style={{
                        //   opacity: 0.8,
                        //   position: "absolute",
                        //   bottom: 8,
                        //   left: 8,
                        // }}
                        // spacing={4}
                      >
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
                    {/* {Math.random() < 0.5 ? (
                    <Text size="sm" color="dimmed">
                      With Fjord Tours you can explore more of the magical fjord
                      landscapes with tours and activities on and around the
                      fjords of Norway
                    </Text>
                  ) : null}
                  <Group position="apart" mt="xs" mb="xs">
                    <Button
                      size="xs"
                      mt="md"
                      radius="md"
                      variant="light"
                      color="blue"
                    >
                      Tag
                    </Button>
                    <Button
                      size="xs"
                      mt="md"
                      radius="md"
                      variant="light"
                      color="red"
                    >
                      Delete
                    </Button>
                  </Group> */}
                  </Card>
                </div>
              )
            })}
          </Masonry>
        )}
      </QueryWithBoundary>

      {/* <QueryWithBoundary
        name="/api/get-images"
        queryOptions={{ enabled: false }}
        input={{
          date: null,
          includingTags:
            selectedTag === "all" ? [] : selectedTag ? [selectedTag] : [],
        }}
      >
        {(data) => (
          <Grid gutter="xs">
            {data.map((v, i) => (
              <Grid.Col span={isSmallScreen ? 12 : 2}>
                <div style={{ width: "100%", position: "relative" }}>
                  <Image
                    fit={isSmallScreen ? "contain" : "cover"}
                    width={isSmallScreen ? "100%" : undefined}
                    height={isSmallScreen ? undefined : 200}
                    radius="md"
                    src={v.url!}
                  />
                  <Group
                    style={{ position: "absolute", bottom: 6, right: 6 }}
                    spacing={4}
                  >
                    {v.tags.map((v) => (
                      <Badge
                        opacity={0.35}
                        size="xs"
                        radius={"xl"}
                        variant="light"
                        color="gray"
                      >
                        {v}
                      </Badge>
                    ))}
                  </Group>
                </div>
              </Grid.Col>
            ))}
          </Grid>
        )}
      </QueryWithBoundary> */}
    </Box>
  )
}
