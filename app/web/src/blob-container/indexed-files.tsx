import {
  Box,
  Button,
  Checkbox,
  Chip,
  Chips,
  Container,
  Group,
  MultiSelect,
  TextInput,
} from "@mantine/core"
import { useForm } from "@mantine/form"
import { RenderObject } from "glow-core"
import * as React from "react"
import { Outlet, useParams } from "react-router"
import { Link } from "react-router-dom"
import { useTypedAction, useTypedQuery } from "../ts-models/api"
import { defaultFile, File } from "../ts-models/AzureFiles"

export function IndexedFiles() {
  const { data } = useTypedQuery("/api/files/get-indexed-files", {
    input: {},
    placeholder: [],
  })
  return (
    <div>
      <div>Filecount: {data.length}</div>
      {data.map((v) => (
        <div>
          <Link to={`./${v.id}`}>{v.filename}</Link>
        </div>
      ))}

      <Outlet />
    </div>
  )
}

function FileContent({ data, id }: { data: File; id: string }) {
  const form = useForm({
    initialValues: {
      tags: data.tags.map((v) => v.name),
    },
  })

  const tags = [
    { label: "Keep", value: "keep" },
    { label: "Stage for blob", value: "stage-for-blog" },
    { label: "publish", value: "publish" },
  ]

  const [setTags] = useTypedAction("/api/file/set-tags")

  return (
    <Box sx={{ maxWidth: 500 }} mx="auto">
      <form
        onSubmit={form.onSubmit(async (values) => {
          await setTags({
            fileId: id!,
            tags: values.tags.map((v) => ({ name: v })),
          })
        })}
      >
        <Chips multiple={true} {...form.getInputProps("tags")}>
          {tags.map((v) => (
            <Chip value={v.value}>{v.label}</Chip>
          ))}
        </Chips>

        <Group position="right" mt="md">
          <Button type="submit">Submit</Button>
        </Group>
      </form>
      {/* <RenderObject {...data} /> */}
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
