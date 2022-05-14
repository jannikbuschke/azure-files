import {
  Box,
  Button,
  Chip,
  Chips,
  Grid,
  LoadingOverlay,
  Paper,
  Stack,
  Title,
  Text,
  Image,
  SegmentedControl,
} from "@mantine/core"
import { useForm } from "@mantine/form"
import { RenderObject } from "glow-core"
import * as React from "react"
import { Outlet, useMatch, useParams, useResolvedPath } from "react-router"
import { Link } from "react-router-dom"
import { useTypedAction, useTypedQuery } from "../ts-models/api"
import { defaultFile, File } from "../ts-models/AzureFiles"

const tags = [
  { label: "Keep", value: "keep" },
  { label: "Stage for blob", value: "stage-for-blog" },
  { label: "publish", value: "publish" },
]

function CustomLink({ to, name }: { to: string; name: string }) {
  let resolved = useResolvedPath(to)
  let match = useMatch({ path: resolved.pathname, end: true })
  return (
    <Link to={to} style={{ textDecoration: match ? "underline" : "none" }}>
      {name}
      {/* <RenderObject {...match} /> */}
    </Link>
  )
}

export function IndexedFiles() {
  const [selectedTag, setSelectedTag] = React.useState<string | undefined>(
    undefined,
  )
  const { data, loading } = useTypedQuery("/api/files/get-indexed-files", {
    input: {
      filterByTag: selectedTag === "___all" ? null : selectedTag || null,
    },
    placeholder: [],
  })
  return (
    <Paper shadow="xs" p="md">
      <LoadingOverlay visible={loading}></LoadingOverlay>
      <SegmentedControl
        data={[{ label: "All", value: "___all" } as any, ...tags]}
        value={selectedTag}
        onChange={(v) => {
          setSelectedTag((selected) => (selected === v ? undefined : v))
        }}
      />
      <Grid>
        <Grid.Col span={4}>
          <div>Filecount: {data.length}</div>
          {data.map((v) => (
            <div key={v.id}>
              <CustomLink to={`./${v.id}`} name={v.filename!} />
            </div>
          ))}
        </Grid.Col>
        <Grid.Col span={8}>
          <Outlet />
        </Grid.Col>
      </Grid>
    </Paper>
  )
}

function FileContent({ data, id }: { data: File; id: string }) {
  const form = useForm({
    initialValues: {
      tags: data?.tags?.map((v) => v.name) || [],
    },
  })

  const [setTags, , { submitting }] = useTypedAction("/api/file/set-tags")
  return (
    <Box mx="auto">
      <LoadingOverlay visible={submitting}></LoadingOverlay>
      <form
        onSubmit={form.onSubmit(async (values) => {
          await setTags({
            fileId: id!,
            tags: values.tags.map((v) => ({ name: v })),
          })
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
          </Stack>
          {/* <Text size="xs">{data.md5Hash}</Text> */}
          <Chips size="sm" multiple={true} {...form.getInputProps("tags")}>
            {tags.map((v) => (
              <Chip key={v.value} value={v.value}>
                {v.label}
              </Chip>
            ))}
          </Chips>
        </Stack>
      </form>
      <br />
      <Image
        radius="sm"
        fit="contain"
        width={600}
        src={`https://azfilesdevsa.blob.core.windows.net/src/${id}`}
        // src="https://images.unsplash.com/photo-1511216335778-7cb8f49fa7a3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=720&q=80"
        // alt="Random unsplash image"
      />
      {/* <img src={`https://azfilesdevsa.blob.core.windows.net/inbox/${id}`} /> */}
      {/* <img src="https://azfilesdevsa.blob.core.windows.net/inbox/0ddd673d-62a2-425b-a263-db5aabc4dabb" /> */}
      <RenderObject {...form.values} />
    </Box>
  )
}

export function IndexedFileDetail() {
  const { id } = useParams<"id">()
  const { data, isFetched } = useTypedQuery("/api/files/get-indexed-file", {
    input: { id: id! },
    placeholder: defaultFile,
  })

  return isFetched ? <FileContent data={data} id={id!} /> : <div>loading</div>
}
