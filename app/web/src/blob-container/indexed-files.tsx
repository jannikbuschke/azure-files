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
  Text,
  Center,
  Group,
  Divider,
  NavLink as MantineNavLink,
} from "@mantine/core"
import { useForm } from "@mantine/form"
import { useFullscreen, useViewportSize } from "@mantine/hooks"
import { RenderObject, useNotify } from "glow-core"
import * as React from "react"
import {
  Outlet,
  useMatch,
  useNavigate,
  useParams,
  useResolvedPath,
} from "react-router"
import { Link, NavLink, useSearchParams } from "react-router-dom"
import { useTypedAction, useTypedQuery } from "../client/api"
import {
  defaultFileAggregate,
  defaultInboxFileResult,
  FileAggregate,
  FileId,
} from "../client/AzureFiles"
import { Guid } from "../client/System"
import { tags } from "./tag-values"
import { IconCaretLeft, IconCaretRight } from "@tabler/icons"
import { QueryWithBoundary } from "../query"
import { NavTable } from "glow-beta/lib/list/nav-table"
import dayjs from "dayjs"
import { FSharpOption } from "../client/Microsoft_FSharp_Core"

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
            <QueryWithBoundary name="/api/get-inbox-files" input={{}}>
              {(data) => (
                <>
                  <NavTable dataSource={data} columns={[]} />
                  <div>
                    {data.map((file, i) => (
                      <>
                        {/* {i > 0 && <Divider my="xs" />} */}
                        <Box>
                          <NavLink to={`./${file.id}`}>
                            {({ isActive }) => (
                              <>
                                <MantineNavLink
                                  // p="xs"
                                  // m="xs"
                                  active={isActive}
                                  variant="light"
                                  label={file.filename}
                                  description={dayjs(file.createdAt).format(
                                    "L LT",
                                  )}
                                />
                              </>
                            )}
                          </NavLink>
                        </Box>
                      </>
                    ))}
                  </div>
                </>
              )}
            </QueryWithBoundary>
            {/* ... content */}
            {/* {data.map((v) => (
              <div key={v.id}>
                <CustomLink
                  to={`./${v.id}`}
                  name={
                    <div>
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
            ))} */}
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
  next,
  prev,
}: {
  data: FileAggregate
  id: string
  onSave?: () => void
  next: FSharpOption<FileId>
  prev: FSharpOption<FileId>
}) {
  const form = useForm({
    initialValues: {
      tags: data?.tags?.map((v) => v) || [],
    },
  })
  const [params] = useSearchParams()
  const shouldFullscreen = params.get("fullscreen")

  const { notifyError } = useNotify()
  const [setTags, , { submitting }] = useTypedAction("/api/file/set-tags")
  const { ref, toggle, fullscreen } = useFullscreen()
  React.useEffect(() => {
    if (shouldFullscreen) {
      toggle()
    }
  }, [toggle, shouldFullscreen])
  const x = useViewportSize()
  const navigate = useNavigate()
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
          <Stack>
            <div style={{ maxWidth: 600 }}>
              <Title truncate={true}>{data.filename}</Title>
            </div>
          </Stack>
          <Group>
            <Button type="submit" size="sm">
              Save
            </Button>
            <Button size="sm" onClick={() => toggle()}>
              fullscreen
            </Button>
          </Group>
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
      <div>
        <Image
          // key={fullscreen ? "fullscreen" : "not-fullscreen"}
          radius="sm"
          fit={"contain"}
          width={fullscreen ? x.width : "800px"}
          height={fullscreen ? x.height : "500px"}
          src={data.lowresUrl || data.url!}
          onError={() => notifyError("Could not load image")}
          // src="https://images.unsplash.com/photo-1511216335778-7cb8f49fa7a3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=720&q=80"
          // alt="Random unsplash image"
        />
        <Center>
          <Group
            style={{ zIndex: 5 }}
            bg="dark.5"
            p="xs"
            mt={fullscreen ? -200 : "xs"}
            // style={{
            //   position: "absolute",
            //   bottom: 50,
            //   left: "50%",
            //   right: "50%",
            // }}
            position="center"
            // style={{ width: 500 }}
          >
            <Button variant="subtle" leftIcon={<IconCaretLeft />}>
              {/* Previous */}
            </Button>

            <Button>Stage</Button>
            <Button>Publish</Button>
            <Button>Keep</Button>
            <Button variant="subtle" color="red">
              Delete
            </Button>
            <Button variant="subtle" rightIcon={<IconCaretRight />}>
              {/* Next */}
            </Button>
          </Group>
        </Center>
      </div>
      <div ref={ref}>
        <Image
          opacity={fullscreen ? 1 : 0}
          key={fullscreen ? "fullscreen" : "not-fullscreen"}
          radius="sm"
          fit={"contain"}
          width={x.width}
          height={x.height}
          src={data.lowresUrl || data.url!}
          onError={() => notifyError("Could not load image")}
          // src="https://images.unsplash.com/photo-1511216335778-7cb8f49fa7a3?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=720&q=80"
          // alt="Random unsplash image"
        />
        <Center>
          <Group
            style={{ zIndex: 5 }}
            bg="dark.5"
            p="xs"
            mt={fullscreen ? -200 : "xs"}
            // style={{
            //   position: "absolute",
            //   bottom: 50,
            //   left: "50%",
            //   right: "50%",
            // }}
            position="center"
            // style={{ width: 500 }}
          >
            <Button
              variant="subtle"
              leftIcon={<IconCaretLeft />}
              disabled={prev === null}
              onClick={
                prev === null
                  ? undefined
                  : () => navigate(`../${prev}?fullscreen=true`)
              }
            >
              {/* Previous */}
            </Button>

            <Button>Stage</Button>
            <Button>Publish</Button>
            <Button>Keep</Button>
            <Button variant="subtle" color="red">
              Delete
            </Button>
            <Button
              variant="subtle"
              rightIcon={<IconCaretRight />}
              disabled={next === null}
              onClick={
                next === null
                  ? undefined
                  : () => {
                      navigate(`../${next}?fullscreen=true`)
                    }
              }
            />
          </Group>
        </Center>
      </div>
      {/* <img src={`https://azfilesdevsa.blob.core.windows.net/inbox/${id}`} /> */}
      {/* <img src="https://azfilesdevsa.blob.core.windows.net/inbox/0ddd673d-62a2-425b-a263-db5aabc4dabb" /> */}
      {/* <RenderObject {...form.values} /> */}
    </Box>
  )
}

export function IndexedFileDetail({}: {}) {
  const { id } = useParams<"id">()
  const navigate = useNavigate()
  const { data, isFetched } = useTypedQuery("/api/get-inbox-file", {
    input: { id: id as Guid },
    placeholder: defaultInboxFileResult,
  })

  return isFetched ? (
    <FileContent
      data={data.file}
      next={data.next}
      prev={data.previous}
      id={id!}
    />
  ) : (
    <div>loading</div>
  )
}
