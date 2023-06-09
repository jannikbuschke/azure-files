import * as React from "react"
import { Group, Text, useMantineTheme, MantineTheme } from "@mantine/core"
import { updateNotification, showNotification } from "@mantine/notifications"
import { Dropzone } from "@mantine/dropzone"
import { useNotify } from "glow-core"
import { FSharpList } from "../client/Microsoft_FSharp_Collections"
import { FSharpResult } from "../client/Microsoft_FSharp_Core"
import { ErrorResult, FileSavedToStorage } from "../client/AzureFiles"
import { useSubscription } from "../client/subscriptions"
import {
  TbUpload as IconUpload,
  TbPhoto as IconPhoto,
  TbX as IconX,
  TbFileCheck,
  TbFileUnknown,
} from "react-icons/tb"
import { QueryWithBoundary } from "../query"
import { useTypedQuery } from "../client/api"

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
  const { data, refetch } = useTypedQuery("/api/auto-inbox/get-items", {
    input: { filterActive: false },
    placeholder: [],
  })
  const theme = useMantineTheme()
  // const [upload] = useTypedAction("/api/upload-files")
  const [loading, setloading] = React.useState(false)
  const { notifyError, notifySuccess, notifyInfo } = useNotify()

  useSubscription(
    "Glow.core.fs.MartenAndPgsql.EventPublisher+EventNotification",
    (v) => {
      console.log(
        "Glow.core.fs.MartenAndPgsql.EventPublisher+EventNotification",
        v,
      )
      refetch()
    },
    [],
  )

  useSubscription(
    "AzFiles.EventPublisher+FileEventNotification",
    (v) => {
      v.events.forEach((e) => {
        notifyInfo(e?.Case || "some event happend")
      })
    },
    [],
  )
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
            if (index === 0) {
              showNotification({
                id: "uploading-files",
                title: "Uploading files",
                message: `Uploading ${files.length} files (${index + 1})`,
                color: "blue",
                loading: true,
                autoClose: false,
              })
            } else {
              updateNotification({
                id: "uploading-files",
                message: `Uploading ${files.length} files (${index + 1})`,
                autoClose: false,
              })
            }
            try {
              const data = new FormData()
              data.append("file", files[index]!)

              const response = await fetch("/upload", {
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
              // updateNotification({
              //   id: "uploading-files-" + index,
              //   // title: "File successfully uploaded",
              //   message: `File successfully uploaded`,
              //   color: "green",
              //   loading: false,
              //   autoClose: true,
              // })
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
              updateNotification({
                id: "uploading-files",
                // title: "File successfully uploaded",
                message: `Files successfully uploaded`,
                color: "green",
                loading: false,
                autoClose: true,
              })
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
      {/* {Object.keys(filemap).map((v) => {
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
      })} */}
      {/* <QueryWithBoundary
        name={"/api/auto-inbox/get-items"}
        input={{
          filterActive: false,
        }}
      > */}
      {(data) => (
        <div style={{}}>
          {data.map((v) => (
            <div>
              {v.id} {v.fileId}{" "}
              {v.processed ? <TbFileCheck /> : <TbFileUnknown />}
            </div>
          ))}
        </div>
      )}
      {/* </QueryWithBoundary> */}
    </>
  )
}
