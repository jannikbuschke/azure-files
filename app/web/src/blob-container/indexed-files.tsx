import {
  Box,
  Button,
  Grid,
  LoadingOverlay,
  Paper,
  Title,
  Image,
  ScrollArea,
  Center,
  Group,
  NavLink as MantineNavLink,
} from "@mantine/core"
import { useFullscreen, useHotkeys, useViewportSize } from "@mantine/hooks"
import { useNotify } from "glow-core"
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
import { FileAggregate, FileId } from "../client/AzureFiles"
import { Guid } from "../client/System"
import { TiArrowLeft, TiArrowRight } from "react-icons/ti"
import { QueryWithBoundary } from "../query"
import dayjs from "dayjs"
import { FSharpOption } from "../client/Microsoft_FSharp_Core"
import { AzFiles, AzFiles_Features } from "../client"
import { AsyncButton } from "../typed-api/ActionButton"

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

  return (
    <Paper>
      <Grid>
        <Grid.Col span={2}>
          <ScrollArea style={{ height: "85vh" }} scrollbarSize={0}>
            <QueryWithBoundary name="/api/get-inbox-files" input={{}}>
              {(data) => (
                <>
                  {/* <div>Filecount: {data.length}</div> */}
                  {/* <NavTable dataSource={data} columns={[]} /> */}
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
                                  style={{ textDecoration: "none" }}
                                  active={isActive}
                                  variant="light"
                                  label={file.filename}
                                  description={
                                    file.createdAt
                                      ? dayjs(file.createdAt).format("L LT")
                                      : "N/A"
                                  }
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
  id: FileId
  onSave?: () => void
  next: FSharpOption<FileId>
  prev: FSharpOption<FileId>
}) {
  const [params] = useSearchParams()
  const shouldFullscreen = params.get("fullscreen")
  const { notifyError, notifyInfo } = useNotify()
  const [setTags, , { submitting }] = useTypedAction("/api/file/set-tags")
  const { ref, toggle, fullscreen } = useFullscreen()
  React.useEffect(() => {
    if (shouldFullscreen) {
      toggle()
    }
  }, [toggle, shouldFullscreen])
  const x = useViewportSize()
  const navigate = useNavigate()

  const navNext =
    next === null
      ? undefined
      : () => {
          navigate(`../${next}`)
        }

  const navPrev = prev === null ? undefined : () => navigate(`../${prev}`)

  const setTagsAndNavigate = async (tags: AzFiles_Features.SetTags) => {
    await setTags(tags)
    navNext && navNext()
  }
  useHotkeys([
    ["ArrowLeft", () => navPrev && navPrev()],
    ["ArrowRight", () => navNext && navNext()],
  ])

  const actions = (
    <>
      <Button
        variant="subtle"
        leftIcon={<TiArrowLeft size={50} />}
        disabled={navPrev === undefined}
        onClick={navPrev}
      />
      <Button
        onClick={() => setTagsAndNavigate({ fileId: id, tags: ["Stage"] })}
      >
        Stage
      </Button>
      <Button
        onClick={() => setTagsAndNavigate({ fileId: id, tags: ["Publish"] })}
      >
        Publish
      </Button>
      <Button
        onClick={() => setTagsAndNavigate({ fileId: id, tags: ["Keep"] })}
      >
        Keep
      </Button>
      <AsyncButton
        action="/api/file/delete-file"
        values={{ fileId: id }}
        variant="subtle"
        color="red"
        onSuccess={() => navNext && navNext()}
      >
        Delete
      </AsyncButton>
      {/* <Button variant="subtle" color="red">
        Delete
      </Button> */}
      <Button
        variant="subtle"
        rightIcon={<TiArrowRight size={50} />}
        disabled={navNext === undefined}
        onClick={navNext}
      />
    </>
  )

  return (
    <Box
      mx="auto"
      sx={(theme) => ({
        backgroundColor:
          theme.colorScheme === "dark"
            ? theme.colors.dark[6]
            : theme.colors.gray[2],
      })}
      p="xs"
    >
      <LoadingOverlay visible={submitting}></LoadingOverlay>
      <Box>
        <Title truncate={true}>{data.filename}</Title>
      </Box>
      <Button size="xs" onClick={() => toggle()} variant="default">
        fullscreen
      </Button>
      <br />
      <div ref={ref} style={{ display: fullscreen ? undefined : "block" }}>
        <Image
          radius="sm"
          fit={"contain"}
          width={fullscreen ? x.width : "100%"}
          height={fullscreen ? x.height : "80vh"}
          src={data.lowresUrl || data.url!}
          onError={() => notifyError("Could not load image")}
        />
        <Center>
          <Group
            style={{ zIndex: 5 }}
            sx={(theme) => ({
              backgroundColor:
                theme.colorScheme === "dark"
                  ? theme.colors.dark[5]
                  : theme.colors.gray[4],
            })}
            // bg="dark.5"
            p="xs"
            mt={fullscreen ? -200 : "xs"}
            position="center"
          >
            {actions}
          </Group>
        </Center>
      </div>
      {/* <div>
        <Image
          opacity={fullscreen ? 1 : 0}
          key={fullscreen ? "fullscreen" : "not-fullscreen"}
          radius="sm"
          fit={"contain"}
          width={x.width}
          height={x.height}
          src={data.lowresUrl || data.url!}
          onError={() => notifyError("Could not load image")}
        />
        <Center>
          <Group
            style={{ zIndex: 5 }}
            bg="dark.5"
            p="xs"
            mt={fullscreen ? -200 : "xs"}
            position="center"
          >
            {actions}
          </Group>
        </Center>
      </div> */}
    </Box>
  )
}

export function IndexedFileDetail({}: {}) {
  const { id } = useParams<"id">()
  const { data } = useTypedQuery("/api/get-inbox-file", {
    input: { id: id as Guid },
    placeholder: AzFiles_Features.defaultInboxFileResult,
  })

  return (
    <FileContent
      data={data.file}
      next={data.next}
      prev={data.previous}
      id={id as Guid}
    />
  )
}
