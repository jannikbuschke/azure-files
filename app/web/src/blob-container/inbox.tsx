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
  Popover,
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
import { TypedForm, useTypedAction, useTypedQuery } from "../client/api"
import { Guid } from "../client/System"
import { TiArrowLeft, TiArrowRight } from "react-icons/ti"
import { QueryWithBoundary } from "../query"
import dayjs from "dayjs"
import { FSharpOption } from "../client/Microsoft_FSharp_Core"
import { AsyncActionIcon, AsyncButton } from "../typed-api/ActionButton"
import { defaultInboxFileResult, SetTags } from "../client/AzFiles_Features"
import { FileId, FileViewmodel } from "../client/AzureFiles"
import { FiSun } from "react-icons/fi"
import {
  FaFileInvoiceDollar,
  FaInbox,
  FaRecycle,
  FaCloudRain,
} from "react-icons/fa"
import { useKeyPress } from "react-use"
import { Input, Textarea, TextInput } from "formik-mantine"
import { Formik } from "formik"
import { InboxMaisonry } from "./inbox-maisonry"

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

export function Inbox() {
  return <InboxMaisonry />
}

function InboxMasterDetail() {
  const [cached, setCached] = React.useState(true)

  return (
    <Paper>
      <Grid>
        <Grid.Col span={2}>
          <ScrollArea style={{ height: "95vh" }} scrollbarSize={0}>
            <QueryWithBoundary
              name="/api/get-inbox-files"
              input={{ cached, count: 50, order: { Case: "Desc" } }}
            >
              {({ values: data, count }, { refetch }) => (
                <>
                  <Group ml="xs">
                    <AsyncActionIcon
                      values={{}}
                      action="/api/remove-tagged-images-from-inbox"
                      onSuccess={refetch}
                    >
                      <FaInbox size={20} />
                    </AsyncActionIcon>
                    <ActionIcon
                      onClick={() => {
                        setCached(!cached)
                      }}
                    >
                      <FaRecycle size={20} />
                    </ActionIcon>
                    <Text>{count}</Text>
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
  disabled,
  preloadUrl,
}: {
  data: FileViewmodel
  id: FileId
  onSave?: () => void
  next: FSharpOption<FileId>
  nextUrl: FSharpOption<string>
  prev: FSharpOption<FileId>
  disabled: boolean
  preloadUrl: FSharpOption<string>
}) {
  const [params] = useSearchParams()
  const shouldFullscreen = params.get("fullscreen")
  const { notifyError, notifyInfo } = useNotify()

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

  const navPrev =
    prev === null
      ? undefined
      : disabled
      ? undefined
      : () => navigate(`../${prev}`)

  const setTagsAndNavigate = async (tags: SetTags) => {
    if (disabled) {
      return
    }
    // notifyInfo(tags.tags.join(", "))
    await setTags(tags)
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
      {/* <Button
        size="xs"
        variant="default"
        onClick={() => setTagsAndNavigate({ fileId: id, tags: ["Stage"] })}
      >
        Stage
      </Button> */}
      <Button
        size="xs"
        variant="default"
        onClick={() => setTagsAndNavigate({ fileId: id, tags: ["PKM"] })}
      >
        PKM
      </Button>

      <Popover>
        <Popover.Dropdown>
          <Formik
            initialValues={{ value: "doc/" }}
            onSubmit={(v) =>
              setTagsAndNavigate({
                fileId: id,
                tags: [...v.value.split(" ")],
              })
            }
          >
            {(f) => (
              <form>
                <Group>
                  <TextInput name="value" autoFocus={true} />
                  <TextInput name="value" autoFocus={true} />
                  <Button onClick={f.submitForm} size="xs">
                    Add
                  </Button>
                </Group>
              </form>
            )}
          </Formik>
        </Popover.Dropdown>
        <Popover.Target>
          <Button size="xs" variant="default">
            Doc
          </Button>
        </Popover.Target>
      </Popover>
      {/* <Button
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
      </Button> */}
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
            mt={fullscreen ? -40 : "xs"}
            position="center"
          >
            {actions}
          </Group>
        </Center>
        <TypedForm
          actionName="/api/upsert-properties-raw"
          initialValues={{
            id: data.id,
            values: data.properties
              .map((v) => v.name + ": " + v.value)
              .join("\n"),
          }}
        >
          {(f, _) => (
            <>
              <Textarea name={_.values._PATH_} />
              <Button onClick={f.submitForm}>Save</Button>
            </>
          )}
        </TypedForm>
        <div style={{ height: 1, opacity: 0 }}>
          {nextUrl && (
            <Image height={1} opacity={0.5} radius="sm" src={nextUrl} />
          )}
        </div>
      </div>
    </Box>
  )
}

export function IndexedFileDetail() {
  const { id } = useParams<"id">()

  return (
    <QueryWithBoundary name={"/api/get-inbox-file"} input={{ id: id as Guid }}>
      {(data) => {
        if (data.Case === "Error") {
          return <ErrorBanner message={data.Fields.message} />
        } else {
          const d = data.Fields
          return (
            <FileContent
              preloadUrl={null}
              disabled={false}
              data={d.file}
              next={d.next}
              nextUrl={d.nextUrl}
              prev={d.previous}
              id={id as Guid}
            />
          )
        }
      }}
    </QueryWithBoundary>
  )
}

export function InternalIndexedFileDetail({
  id,
  disabled,
  preload,
}: {
  id: string
  disabled: boolean
  preload: FSharpOption<string>
}) {
  // const { data, loading } = useTypedQuery("/api/get-inbox-file", {
  //   input: { id: id as Guid },
  //   placeholder: null,
  //   queryOptions: {
  //     cacheTime: 5000,
  //   },
  // })

  return (
    <QueryWithBoundary name={"/api/get-inbox-file"} input={{ id: id as Guid }}>
      {(data) => {
        if (data.Case === "Error") {
          return <ErrorBanner message={data.Fields.message} />
        } else {
          const d = data.Fields
          return (
            <FileContent
              preloadUrl={preload}
              disabled={disabled}
              data={d.file}
              next={d.next}
              nextUrl={d.nextUrl}
              prev={d.previous}
              id={id as Guid}
            />
          )
        }
      }}
    </QueryWithBoundary>
  )
}
