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
import {
  TbUpload as IconUpload,
  TbPhoto as IconPhoto,
  TbX as IconX,
} from "react-icons/tb"

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

  useSubscription("AzFiles.EventPublisher+FileEventNotification", (v) => {
    v.events.forEach((e) => {
      notifyInfo(e?.Case || "some event happend")
    })
  })
  const [files, setFiles] = React.useState(
    [] as {
      file: File
      name: string
      status: "Init" | "Uploading" | "Sucess" | "Error"
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
        multiple={true}
        onDrop={async (files) => {
          for (let index = 0; index < files.length; index++) {
            // const array = files.slice(index * 5, index * 5 + 5)
            showNotification({
              id: "uploading-files-" + index,
              title: "Uploading files",
              message: `Uploading ${files.length} files (${index + 1})`,
              color: "blue",
              loading: true,
              autoClose: true,
            })
            try {
              const data = new FormData()
              data.append("file", files[index]!)

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
                id: "uploading-files-" + index,
                title: "Uploading files",
                message: `Uploaded a file`,
                color: "green",
                loading: false,
                autoClose: true,
              })
            } catch (E: any) {
              console.log("catch error")
              updateNotification({
                id: "uploading-files-" + index,
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
          }

          setloading(true)
        }}
        onReject={(files) => console.log("rejected files", files)}
        // maxSize={3 * 1024 ** 2}
        // accept={IMAGE_MIME_TYPE}
      >
        <div>
          <Group
            position="center"
            spacing="xl"
            style={{ minHeight: 220, pointerEvents: "none" }}
          >
            <Dropzone.Accept>
              <IconUpload
                size={50}
                //  stroke={1.5}
              />
            </Dropzone.Accept>
            <Dropzone.Reject>
              <IconX
                size={50}
                // stroke={1.5}
                color={theme.colors.red[theme.colorScheme === "dark" ? 4 : 6]}
              />
            </Dropzone.Reject>
            <Dropzone.Idle>
              <IconPhoto
                size={50}
                // stroke={1.5}
              />
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
