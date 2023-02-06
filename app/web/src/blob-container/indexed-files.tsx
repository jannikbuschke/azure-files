import {
  Box,
  Button,
  Chip,
  Grid,
  LoadingOverlay,
  Paper,
  Stack,
  Title,
  Image,
  SegmentedControl,
  ScrollArea,
} from "@mantine/core"
import { useForm } from "@mantine/form"
import { useFullscreen } from "@mantine/hooks"
import { useNotify } from "glow-core"
import * as React from "react"
import { Outlet, useMatch, useParams, useResolvedPath } from "react-router"
import { Link } from "react-router-dom"
import { useTypedAction, useTypedQuery } from "../client/api"
import { defaultFileAggregate, FileAggregate } from "../client/AzureFiles"
import { Guid } from "../client/System"
import { tags } from "./tag-values"

function CustomLink({ to, name }: { to: string; name: React.ReactNode }) {
  let resolved = useResolvedPath(to)
  let match = useMatch({ path: resolved.pathname, end: true })
  return (
    <Link to={to} style={{ textDecoration: match ? "underline" : "none" }}>
      {name}
      {/* <RenderObject {...match} /> */}
    </Link>
  )
}

const specialTags = {
  all: "___all",
  untagged: "___untagged",
} as const

export function IndexedFiles() {
  const [selectedTag, setSelectedTag] = React.useState<string>(
    specialTags.untagged,
  )

  const { data, loading, isFetching } = useTypedQuery(
    "/api/files/get-indexed-files",
    {
      input: {
        tagFilter: selectedTag,
        showUntagged: selectedTag === specialTags.untagged,
      },
      placeholder: [],
    },
  )
  return (
    <Paper>
      <LoadingOverlay visible={loading || isFetching}></LoadingOverlay>
      <SegmentedControl
        data={[
          { label: "Untagged", value: specialTags.untagged },
          { label: "All", value: specialTags.all } as any,
          ...tags,
        ]}
        value={selectedTag}
        onChange={(v) => {
          setSelectedTag(v)
        }}
      />
      <Grid p="md">
        <Grid.Col span={2}>
          <div>Filecount: {data.length}</div>
          <ScrollArea style={{ height: 750 }}>
            {/* ... content */}
            {data.map((v) => (
              <div key={v.id}>
                <CustomLink
                  to={`./${v.id}`}
                  name={
                    <div>
                      {/* thumbnailAvailable */}
                      {v.thumbnailUrl || v.lowresUrl ? (
                        <Image
                          radius="sm"
                          fit="contain"
                          width={"100%"}
                          src={v.thumbnailUrl || v.lowresUrl || v.url!}
                        />
                      ) : (
                        ""
                      )}
                      <div>{v.filename!}</div>
                    </div>
                  }
                />
              </div>
            ))}
          </ScrollArea>
        </Grid.Col>
        <Grid.Col span={10}>
          <Outlet />
        </Grid.Col>
      </Grid>
    </Paper>
  )
}

export function FileContent({
  data,
  id,
  onSave,
}: {
  data: FileAggregate
  id: string
  onSave?: () => void
}) {
  const form = useForm({
    initialValues: {
      tags: data?.tags?.map((v) => v) || [],
    },
  })
  const { notifyError } = useNotify()
  const [setTags, , { submitting }] = useTypedAction("/api/file/set-tags")
  const { ref, toggle, fullscreen } = useFullscreen()
  return (
    <Box mx="auto" key={id}>
      <LoadingOverlay visible={submitting}></LoadingOverlay>
      {/* <RenderObject {...form.values} /> */}
      <form
        onSubmit={form.onSubmit(async (values) => {
          await setTags({
            fileId: id as Guid,
            tags: values.tags.map((v) => ({ name: v })),
          })
          onSave && onSave()
        })}
      >
        <Stack spacing={"sm"}>
          <Stack
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Title>{data.filename}</Title>
            <Button type="submit" size="sm">
              Save
            </Button>
            <Button size="sm" onClick={() => toggle()}>
              fullscreen
            </Button>
          </Stack>
          {/* <Text size="xs">{data.md5Hash}</Text> */}
          <Chip.Group multiple={true} {...form.getInputProps("tags")}>
            {tags.map((v) => (
              <Chip size="sm" key={v.value} value={v.value}>
                {v.label}
              </Chip>
            ))}
          </Chip.Group>
        </Stack>
      </form>
      <br />
      <div ref={ref}>
        <Image
          radius="sm"
          fit="contain"
          width={"100%"}
          height={"100%"}
          src={data.lowresUrl || data.url!}
          onError={() => notifyError("Could not load image")}
          // src="https://images.unsplash.com/photo-1511216335778-7cb8f49fa7a3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=720&q=80"
          // alt="Random unsplash image"
        />
        <Button>Tag</Button>
      </div>
      {/* <img src={`https://azfilesdevsa.blob.core.windows.net/inbox/${id}`} /> */}
      {/* <img src="https://azfilesdevsa.blob.core.windows.net/inbox/0ddd673d-62a2-425b-a263-db5aabc4dabb" /> */}
      {/* <RenderObject {...form.values} /> */}
    </Box>
  )
}

export function IndexedFileDetail() {
  const { id } = useParams<"id">()
  const { data, isFetched } = useTypedQuery("/api/files/get-indexed-file", {
    input: { id: id as Guid },
    placeholder: defaultFileAggregate,
  })

  return isFetched ? <FileContent data={data} id={id!} /> : <div>loading</div>
}
