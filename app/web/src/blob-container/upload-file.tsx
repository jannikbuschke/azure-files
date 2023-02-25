import * as React from "react"
import {
  Group,
  Text,
  useMantineTheme,
  MantineTheme,
  Notification,
} from "@mantine/core"
import {
  useNotifications,
  updateNotification,
  showNotification,
} from "@mantine/notifications"
import { Dropzone, FileWithPath, IMAGE_MIME_TYPE } from "@mantine/dropzone"
import { useNotify } from "glow-core"
import { FSharpList } from "../client/Microsoft_FSharp_Collections"
import { FSharpResult } from "../client/Microsoft_FSharp_Core"
import { ErrorResult, FileSavedToStorage } from "../client/AzureFiles"
import { useSubscription } from "../client/subscriptions"
import { IconUpload, IconPhoto, IconX } from "@tabler/icons"

// function getIconColor(status: DropzoneStatus, theme: MantineTheme) {
//   return status.accepted
//     ? theme.colors[theme.primaryColor][theme.colorScheme === "dark" ? 4 : 6]
//     : status.rejected
//     ? theme.colors.red[theme.colorScheme === "dark" ? 4 : 6]
//     : theme.colorScheme === "dark"
//     ? theme.colors.dark[0]
//     : theme.colors.gray[7]
// }

export const dropzoneChildren = (
  // status: DropzoneStatus,
  theme: MantineTheme,
) => (
  <Group
    position="center"
    spacing="xl"
    style={{ minHeight: 220, pointerEvents: "none" }}
  >
    {/* <ImageUploadIcon
      status={status}
      style={{ color: getIconColor(status, theme) }}
      size={80}
    /> */}

    <div>
      <Text size="xl" inline>
        Drag images here or click to select files
      </Text>
      <Text size="sm" color="dimmed" inline mt={7}>
        Attach as many files as you like, each file should not exceed 5mb
      </Text>
    </div>
  </Group>
)

export function UploadFile() {
  const theme = useMantineTheme()
  // const [upload] = useTypedAction("/api/upload-files")
  const [loading, setloading] = React.useState(false)
  const { notifyError, notifySuccess, notifyInfo } = useNotify()

  useSubscription(
    "Glow.core.fs.MartenAndPgsql.EventPublisher+EventNotification",
    (v) => {
      v.events.forEach((e) => {
        notifyInfo(e?.Case || "some event happend")
      })
    },
  )
  const [files, setFiles] = React.useState(
    [] as {
      name: string
      status: "Uploading" | "Sucess" | "Error"
    }[],
  )
  const [filemap, setFilemap] = React.useState<{
    [filname: string]: {
      name: string
      status: "Uploading" | "Sucess" | "Already exists"
    }
  }>({})
  return (
    <>
      <Dropzone
        // style={{ height: 150 }}
        onDrop={async (files) => {
          showNotification({
            id: "uploading-files",
            title: "Uploading files",
            message: `Uploading ${files.length} files`,
            loading: true,
            autoClose: false,
          })
          setFilemap((map) => ({
            ...map,
            ...files.reduce(
              (prev, curr) => ({
                ...prev,
                [curr.name]: { name: curr.name, status: "Uploading" },
              }),
              {},
            ),
          }))
          setFiles(files.map((v) => ({ name: v.name, status: "Uploading" })))
          console.log("file", files)
          setloading(true)
          var data = new FormData()
          files.forEach((file: FileWithPath) => {
            data.append("file", file)
          })
          try {
            const response = await fetch("/api/files/upload-files-2", {
              headers: {
                "x-submit-intent": "execute",
              },
              method: "POST",
              body: data,
            })
            if (!response.ok) {
              console.log("error", response)
              const error = await response.json()
              throw error
            }
            console.log("response", response)
            const d = (await response.json()) as FSharpList<
              FSharpResult<FileSavedToStorage, ErrorResult>
            >
            updateNotification({
              id: "uploading-files",
              title: "Uploading files",
              message: `Uploading ${files.length} files`,
              color: "green",
              loading: false,
              autoClose: true,
            })
            d.forEach((result) => {
              if (result.Case === "Error") {
                const x = result.Fields
                if (x.Case === "FileIsDuplicate") {
                  const field = x.Fields
                  // notifyError(field.filename + " already exists")
                  setFilemap((v) => {
                    return {
                      ...v,
                      [field.filename]: {
                        ...v[field.filename]!,
                        // ...result.Fields,
                        status: "Already exists",
                      },
                    }
                  })
                }
                // notifyError(result.Fields)
              } else {
                // notifySuccess(result.Fields.filename)
                setFilemap((v) => ({
                  ...v,
                  [result.Fields.filename]: {
                    ...v[result.Fields.filename]!,
                    // ...result.Fields,
                    status: "Sucess",
                  },
                }))
              }
            })
          } catch (E: any) {
            console.log("catch error")
            updateNotification({
              id: "uploading-files",
              title: "Uploading files failed",
              message: `Uploading ${files.length} files failed. Error ${
                typeof E === "object" ? JSON.stringify(E) : E?.toString()
              }`,
              color: "red",
              loading: false,
              autoClose: false,
            })
            setloading(false)
          } finally {
            setloading(false)
          }
        }}
        onReject={(files) => console.log("rejected files", files)}
        maxSize={3 * 1024 ** 2}
        accept={IMAGE_MIME_TYPE}
      >
        <div>
          <Group
            position="center"
            spacing="xl"
            style={{ minHeight: 220, pointerEvents: "none" }}
          >
            <Dropzone.Accept>
              <IconUpload size={50} stroke={1.5} />
            </Dropzone.Accept>
            <Dropzone.Reject>
              <IconX
                size={50}
                stroke={1.5}
                color={theme.colors.red[theme.colorScheme === "dark" ? 4 : 6]}
              />
            </Dropzone.Reject>
            <Dropzone.Idle>
              <IconPhoto size={50} stroke={1.5} />
            </Dropzone.Idle>
            <div>
              <Text size="xl" inline>
                Drag images here or click to select files
              </Text>
              <Text size="sm" color="dimmed" inline mt={7}>
                Attach as many files as you like, each file should not exceed
                5mb
              </Text>
            </div>
          </Group>
        </div>
        {/* {(status) => <>{dropzoneChildren(theme)}</>} */}
      </Dropzone>
      {Object.keys(filemap).map((v) => {
        const file = filemap[v]
        return (
          <div>
            <Text
              span={true}
              color={
                file?.status === "Sucess"
                  ? "green"
                  : file?.status === "Already exists"
                  ? "red"
                  : "dimmed"
              }
            >
              {file?.status}
            </Text>{" "}
            <Text span={true} color={"dimmed"}>
              {file?.name}
            </Text>
          </div>
        )
      })}
      {/* {files.map((v) => (
        <div>
          {v.name} {v.status}
        </div>
      ))} */}
      {/* <Notification
        loading={loading}
        title="Uploading data to the server"
        disallowClose
      >
        Please wait until data is uploaded, you cannot close this notification
        yet
      </Notification> */}
    </>
  )
}
