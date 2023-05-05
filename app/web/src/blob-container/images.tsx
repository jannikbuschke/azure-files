import { Box, Grid, SegmentedControl, Image, Badge, Group } from "@mantine/core"
import { useMediaQuery } from "@mantine/hooks"
import React from "react"
import { QueryWithBoundary } from "../query"

export function ImagesGallery() {
  const [selectedTag, setSelectedTag] = React.useState<string | null>(null)
  const isSmallScreen = useMediaQuery("(max-width: 800px)")
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
          includingTags:
            selectedTag === "all" ? [] : selectedTag ? [selectedTag] : [],
        }}
      >
        {(data) => (
          <Grid gutter="xs">
            {data.map((v, i) => (
              <Grid.Col span={isSmallScreen ? 12 : 2}>
                <div style={{ width: "100%", position: "relative" }}>
                  {/* {i} */}
                  {/* <LoadingOverlay
                    visible={Boolean(f.isSubmitting && f.values.files[v.id])}
                  /> */}
                  <Image
                    fit={isSmallScreen ? "contain" : "cover"}
                    width={isSmallScreen ? "100%" : undefined}
                    height={isSmallScreen ? undefined : 200}
                    radius="md"
                    src={v.lowresUrl || v.thumbnailUrl || v.url!}
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
                  {/* <Checkbox
                    disabled={f.isSubmitting}
                    name={`files[${v.id}]`}
                    style={{
                      position: "absolute",
                      top: 5,
                      left: 5,
                      opacity: f.values.files[v.id] ? 0.9 : 0.8,
                    }}
                  /> */}
                  {/* {JSON.stringify(f.values, null, 4)} */}
                </div>
              </Grid.Col>
            ))}
          </Grid>
        )}
      </QueryWithBoundary>
    </Box>
  )
}
