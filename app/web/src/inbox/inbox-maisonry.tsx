import {
  Box,
  Button,
  LoadingOverlay,
  Image,
  Center,
  Group,
  Text,
  ActionIcon,
  Badge,
  Popover,
  Card,
  MantineProvider,
  Chip,
  Tooltip,
  Collapse,
} from "@mantine/core"
import {
  useDisclosure,
  useFullscreen,
  useHotkeys,
  useViewportSize,
} from "@mantine/hooks"
import { ErrorBanner, RenderObject, useNotify } from "glow-core"
import * as React from "react"
import { useNavigate, useParams } from "react-router"
import { useSearchParams } from "react-router-dom"
import { TypedForm, useTypedAction } from "../client/api"
import { Guid } from "../client/System"
import { TiArrowLeft, TiArrowRight } from "react-icons/ti"
import { QueryWithBoundary, updateQueryData } from "../query"
import dayjs from "dayjs"
import { FSharpOption } from "../client/Microsoft_FSharp_Core"
import { AsyncActionIcon, AsyncButton } from "../typed-api/ActionButton"
import { SetTags } from "../client/AzFiles_Features"
import { FileId, FileViewmodel } from "../client/AzFiles"
import { FiSun } from "react-icons/fi"
import { FaInbox, FaRecycle, FaTrash } from "react-icons/fa"
import { Textarea, TextInput } from "formik-mantine"
import { Formik } from "formik"
import Masonry from "react-masonry-css"
import { useQueryClient } from "react-query"
import { match } from "ts-pattern"
import { TbScreenShare } from "react-icons/tb"
import { FSharpList } from "../client/Microsoft_FSharp_Collections"
import { ExifValue } from "../client/AzFiles"

function RenderExifData({ data }: { data: FSharpList<ExifValue> }) {
  const resolutionX = data.filter((v) => v.Case === "PixelXDimension")[0]
    ?.Fields as number | undefined
  const resolutionY = data.filter((v) => v.Case === "PixelYDimension")[0]
    ?.Fields as number | undefined
  const [opened, { toggle }] = useDisclosure(false)

  const orientation = data.filter((v) => v.Case === "Orientation")[0]
  const RecommendedExposureIndex = data.filter(
    (v) => v.Case === "RecommendedExposureIndex",
  )[0]
  const ISOSpeedRatings = data.filter((v) => v.Case === "ISOSpeedRatings")[0]

  return (
    <div>
      {resolutionX && resolutionY ? (
        <Text>
          {resolutionX} x {resolutionY}
        </Text>
      ) : null}
      <Text>
        Orienation: {<RenderObject orientation={orientation} /> || null}
      </Text>

      <RenderObject {...{ RecommendedExposureIndex, ISOSpeedRatings }} />
      <Button size="xs" color="gray" variant="subtle" onClick={toggle}>
        {opened ? "Hide details" : "Show all exif data"}
      </Button>

      <Collapse in={opened}>
        <RenderObject {...data} />
      </Collapse>
    </div>
  )
}

function ShowMoreOptions({ v }: { v: FileViewmodel }) {
  const [opened, { toggle }] = useDisclosure(false)
  const date = v.dateTime || v.dateTimeDigitized || v.dateTimeOriginal
  return (
    <>
      <Button size="xs" color="gray" variant="subtle" onClick={toggle}>
        {opened ? "Hide details" : "..."}
      </Button>

      <Collapse in={opened}>
        {/* <a
          href={`./photos/${v.id}`}
          referrerPolicy="no-referrer"
          target="_blank"
        >
          Show source image
        </a> */}
        <Text>{v.filename}</Text>
        <Text>{v.id}</Text>
        {date ? (
          <>
            <Text>{dayjs(date).format("L LT")}</Text>
            <Text>{dayjs(date).format("YYYY MMM DDD")}</Text>
          </>
        ) : null}
        {v.exifData ? <RenderExifData data={v.exifData} /> : null}
      </Collapse>
    </>
  )
}

function ImageComponent({ v, input }: { v: FileViewmodel; input: any }) {
  const [setTags, , { submitting }] = useTypedAction("/api/file/set-tags")
  const queryClient = useQueryClient()

  // const { notifyInfo } = useNotify()
  const isMarkedForCleanup = v.tags.some((v) => v === "mark-for-cleanup")

  async function addTag(tag: string, fileId: FileId) {
    // notifyInfo("Tagging")
    await setTags({ fileId, tags: [tag] })
    console.log("update query data")
    updateQueryData({
      client: queryClient,
      name: "/api/get-inbox-files",
      input,
      updater: (data) =>
        data
          ? {
              count: data.count,
              values: data.values.map((v) =>
                v.id === fileId ? { ...v, tags: [...v.tags, tag] } : v,
              ),
            }
          : { count: 0, values: [] },
    })
  }
  const thumbnail = v.lowresVersions?.find((v) => v.name === "thumbnail")
  const [hovering, setHovering] = React.useState(false)
  return (
    <Card
      shadow="sm"
      radius="md"
      withBorder={true}
      opacity={isMarkedForCleanup ? 0.3 : undefined}
    >
      <Card.Section
        style={
          {
            //  maxHeight: 500, maxWidth: 500
          }
        }
      >
        {match(v.fileInfo.type)
          .with({ Case: "Image" }, () => (
            <div style={{ position: "relative" }}>
              <Image
                // style={{ maxHeight: 500, maxWidth: 500 }}
                onMouseOver={() => {
                  setHovering(true)
                }}
                onMouseLeave={() => {
                  setHovering(false)
                }}
                src={`/api/photos/inbox/${v.id}`}
                // src={thumbnail?.url || v.url!}
                imageProps={{
                  loading: "lazy",
                }}
                style={{
                  maxHeight: 500,
                  maxWidth: 500,
                }}
              />
              <ActionIcon
                component="a"
                href={`./photos/${v.id}`}
                referrerPolicy="no-referrer"
                target="_blank"
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  opacity: hovering ? 0.4 : 0.1,
                }}
              >
                <TbScreenShare size="1.125rem" />
              </ActionIcon>
            </div>
          ))
          .otherwise((x) => (
            <Group pt="xs" px="md">
              <Text>
                {x.Case} {v.filename}
              </Text>
            </Group>
          ))}
        <Group px="md" pt="xs" position="apart">
          {v.dateTime ? (
            <Badge size="xs" radius={"xl"} variant="light" color="gray">
              <Tooltip label={v.dateTime ? dayjs(v.dateTime).format("LT") : ""}>
                <div>{dayjs(v.dateTime).format("MMM YYYY")}</div>
              </Tooltip>
            </Badge>
          ) : null}
          {v.tags.map((v) => (
            <Badge
              size="xs"
              radius={"xl"}
              variant={v === "mark-for-cleanup" ? "filled" : "light"}
              color={v === "mark-for-cleanup" ? "red" : "blue"}
            >
              {v}
            </Badge>
          ))}
          <ShowMoreOptions v={v} />
        </Group>
      </Card.Section>
      {match(v.fileInfo.type)
        .with({ Case: "Image" }, () => (
          <Card.Section>
            <MantineProvider
              theme={{
                components: {
                  Chip: {
                    defaultProps: { size: "xs", variant: "filled" },
                  },
                  ActionIcon: { defaultProps: { size: "xs" } },
                  Button: { defaultProps: { size: "xs" } },
                },
              }}
            >
              <Chip.Group p="md">
                {[
                  "PKM",
                  "⭐",
                  "@lena",
                  "@wilma",
                  "@ronja",
                  "@me",
                  "@yaren",
                  "info-tafel",
                ].map((tag) => (
                  <Chip
                    size="xs"
                    checked={v.tags.some((t) => t === tag)}
                    color="blue"
                    onClick={() => addTag(tag, v.id)}
                  >
                    {tag}
                  </Chip>
                ))}
              </Chip.Group>

              <Group p="xs" position="right">
                <Chip
                  mt="xs"
                  disabled={v.tags.some((v) => v === "mark-for-cleanup")}
                  checked={false}
                  size="xs"
                  variant="filled"
                  onClick={() => {
                    // notifyInfo("Marked for cleanup")
                    addTag("mark-for-cleanup", v.id)
                  }}
                >
                  <FaTrash />
                  {/* <FaTrash /> */}
                </Chip>
              </Group>
            </MantineProvider>
          </Card.Section>
        ))
        .otherwise(() => null)}
    </Card>
  )
}

export function InboxMaisonry() {
  const [cached, setCached] = React.useState(true)

  const [input, setInput] = React.useState({
    cached,
    count: 50,
    order: { Case: "Desc" },
  } as const)

  return (
    <QueryWithBoundary
      name="/api/get-inbox-files"
      input={{ ...input, ...{ cached } }}
    >
      {(data, { refetch }) => (
        <>
          <Group
            ml="xs"
            style={{ position: "sticky", top: 10, zIndex: 5 }}
            p="xs"
            bg="blue"
          >
            <AsyncActionIcon
              values={{}}
              action="/api/remove-tagged-images-from-inbox"
              onSuccess={refetch}
            >
              <FaInbox size={20} />
            </AsyncActionIcon>
            <ActionIcon
              onClick={() => {
                setCached((v) => !v)
              }}
            >
              {cached ? <FaRecycle size={20} /> : <FaInbox size={20} />}
            </ActionIcon>
            <Text>{data.count}</Text>
          </Group>
          <Masonry
            style={{ marginTop: 40 }}
            breakpointCols={{
              default: 3,
              // 900: 3,
              // 1200: 2,
              // 500: 1,
            }}
            className="my-masonry-grid"
            columnClassName="my-masonry-grid_column"
          >
            {data.values.map((v, i) => {
              return <ImageComponent v={v} input={input} />
            })}
          </Masonry>
        </>
      )}
    </QueryWithBoundary>
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
