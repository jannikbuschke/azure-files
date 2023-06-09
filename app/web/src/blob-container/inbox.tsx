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
  Text,
  ThemeIcon,
  ActionIcon,
  Badge,
} from "@mantine/core"
import { useFullscreen, useHotkeys, useViewportSize } from "@mantine/hooks"
import { ErrorBanner, RenderObject, useAction, useNotify } from "glow-core"
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
import { Guid } from "../client/System"
import { TiArrowLeft, TiArrowRight } from "react-icons/ti"
import { QueryWithBoundary } from "../query"
import dayjs from "dayjs"
import { FSharpOption } from "../client/Microsoft_FSharp_Core"
import { AsyncActionIcon, AsyncButton } from "../typed-api/ActionButton"
import { defaultInboxFileResult, SetTags } from "../client/AzFiles_Features"
import { FileId, FileViewmodel } from "../client/AzureFiles"
import { FiSun } from "react-icons/fi"
import { FaFileInvoiceDollar, FaInbox } from "react-icons/fa"
import { useKeyPress } from "react-use"

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

export function Înbox() {
  const [selectedTag, setSelectedTag] = React.useState<string>(
    specialTags.untagged,
  )

  return (
    <Paper>
      <Grid>
        <Grid.Col span={2}>
          <ScrollArea style={{ height: "95vh" }} scrollbarSize={0}>
            <QueryWithBoundary name="/api/get-inbox-files" input={{}}>
              {(data, { refetch }) => (
                <>
                  <Group ml="xs">
                    <AsyncActionIcon
                      values={{}}
                      action="/api/remove-tagged-images-from-inbox"
                      onSuccess={refetch}
                    >
                      <FaInbox size={20} />
                    </AsyncActionIcon>
                    <Text>{data.length}</Text>
                  </Group>
                  {/* <NavTable dataSource={data} columns={[]} /> */}
                  <div>
                    {data.map((file, i) => (
                      <>
                        {/* {i > 0 && <Divider my="xs" />} */}
                        <Box>
                          <NavLink
                            to={`./${file.id}`}
                            style={{ textDecoration: "none" }}
                          >
                            {({ isActive }) => (
                              <MantineNavLink
                                // p="xs"
                                // m="xs"
                                style={{ textDecoration: "none" }}
                                active={isActive}
                                variant="light"
                                label={file.filename}
                                description={
                                  <>
                                    {dayjs(file.fileDateOrCreatedAt).format(
                                      "YYYY-MM-DD",
                                    )}{" "}
                                    {file.tags.map((tag) => (
                                      <Badge color="gray" radius={0} size="xs">
                                        {tag}
                                      </Badge>
                                    ))}
                                  </>
                                }
                              />
                            )}
                          </NavLink>
                        </Box>
                      </>
                    ))}
                  </div>
                </>
              )}
            </QueryWithBoundary>
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
  nextUrl,
  prev,
}: {
  data: FileViewmodel
  id: FileId
  onSave?: () => void
  next: FSharpOption<FileId>
  nextUrl: FSharpOption<string>
  prev: FSharpOption<FileId>
}) {
  const [params] = useSearchParams()
  const shouldFullscreen = params.get("fullscreen")
  const { notifyError, notifyInfo } = useNotify()
  React.useEffect(() => {
    notifyInfo("mount")
  }, [])
  React.useEffect(() => {
    notifyInfo("file id changed")
  }, [id])

  // const { data: exif, error } = useTypedQuery(
  //   "/api/blob/get-exif-data-from-blob-file",
  //   { input: { blobId: id }, placeholder: [] },
  // )
  // const { data: metadata } = useTypedQuery("/api/blob/get-blob-metadata", {
  //   input: { blobId: id },
  //   placeholder: null as any,
  //   queryOptions: { suspense: true, useErrorBoundary: true },
  // })

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

  const setTagsAndNavigate = async (tags: SetTags) => {
    console.log("set tags")
    notifyInfo(tags.tags.join(", "))
    await setTags(tags)
    console.log("navigate")
    navNext && navNext()
  }

  useHotkeys([
    ["ArrowLeft", () => navPrev && navPrev()],
    ["ArrowRight", () => navNext && navNext()],
    ["p", () => setTagsAndNavigate({ fileId: id, tags: ["PKM"] })],
    [
      "ctrl+d",
      () => setTagsAndNavigate({ fileId: id, tags: ["mark-for-cleanup"] }),
    ],
    ["d", () => setTagsAndNavigate({ fileId: id, tags: ["doc"] })],
  ])

  const [fitIndex, setFit] = React.useState(0)
  const fit: React.CSSProperties["objectFit"] = (
    [
      "contain",
      "cover",
      "fill",
      "inherit",
      "none",
      "revert",
      "scale-down",
      "unset",
    ] as React.CSSProperties["objectFit"][]
  )[fitIndex % 5]!
  const actions = (
    <>
      <Button
        size="xs"
        color="dark"
        variant="subtle"
        leftIcon={<TiArrowLeft size={50} />}
        disabled={navPrev === undefined}
        onClick={navPrev}
      />
      <Button
        size="xs"
        variant="default"
        onClick={() => setTagsAndNavigate({ fileId: id, tags: ["Stage"] })}
      >
        Stage
      </Button>
      <Button
        size="xs"
        variant="default"
        onClick={() => setTagsAndNavigate({ fileId: id, tags: ["PKM"] })}
      >
        PKM
      </Button>
      <Button
        size="xs"
        variant="default"
        onClick={() => setTagsAndNavigate({ fileId: id, tags: ["Publish"] })}
      >
        Publish
      </Button>
      <Button
        size="xs"
        variant="default"
        onClick={() => setTagsAndNavigate({ fileId: id, tags: ["Keep"] })}
      >
        Keep
      </Button>
      <Button
        size="xs"
        color="dark"
        variant="subtle"
        onClick={() => setFit(fitIndex + 1)}
      >
        Change fit ({fit})
      </Button>
      <AsyncButton
        size="xs"
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
        size="xs"
        color="dark"
        variant="subtle"
        rightIcon={<TiArrowRight size={50} />}
        disabled={navNext === undefined}
        onClick={navNext}
      />
    </>
  )
  const url = data.url
  const date = data.dateTime || data.dateTimeDigitized || data.dateTimeOriginal

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
      {/* <RenderObject
        createdAt={data.createdAt}
        original={data.dateTimeOriginal || null}
        dateTime={data.dateTime || null}
        digizied={data.dateTimeDigitized || null}
      /> */}
      {/* <ErrorBanner message={error} /> */}
      {/* <RenderObject exif={exif} meta={metadata} /> */}

      <br />
      <div ref={ref} style={{ display: fullscreen ? undefined : "block" }}>
        {url && (
          <>
            <Box
              bg="gray.2"
              p={2}
              style={{ opacity: 0.8, position: "absolute", zIndex: 1 }}
            >
              <Group>
                <div>
                  <Group>
                    <Text size="xs" span={true}>
                      {data.filename}
                    </Text>
                    {data.tags.map((v) => (
                      <Badge size="xs" radius={0}>
                        #{v}
                      </Badge>
                    ))}
                  </Group>
                  <Text size="xs" color="gray">
                    {date ? dayjs(date).locale("de").format("L LT") : null}
                  </Text>
                </div>
                {/* <Title truncate={true}>{data.filename}</Title> */}
                {!fullscreen && (
                  <ActionIcon onClick={() => toggle()}>
                    <FiSun size={20} />
                  </ActionIcon>
                )}
              </Group>
            </Box>
            <Image
              radius="sm"
              fit={fit}
              width={fullscreen ? x.width : "100%"}
              height={fullscreen ? x.height : "80vh"}
              src={url}
              onError={(x) => {
                console.warn("image component error", x)
                notifyError("Could not load image")
              }}
            />
            {/* {nextUrl && <Image opacity={0} radius="sm" src={nextUrl} />} */}
          </>
        )}
        <Center>
          <Group
            style={{ zIndex: 5, opacity: 0.8 }}
            sx={(theme) => ({
              backgroundColor:
                theme.colorScheme === "dark"
                  ? theme.colors.dark[5]
                  : theme.colors.gray[4],
            })}
            // bg="dark.5"
            p={2}
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

export function IndexedFileDetail() {
  const { id } = useParams<"id">()
  const { data, loading } = useTypedQuery("/api/get-inbox-file", {
    input: { id: id as Guid },
    placeholder: defaultInboxFileResult,
  })
  const { notifyInfo } = useNotify()

  return (
    <FileContent
      data={data.file}
      next={data.next}
      nextUrl={data.nextUrl}
      prev={data.previous}
      id={id as Guid}
    />
  )
}
