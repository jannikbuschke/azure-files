import * as React from "react"
import {
  Group,
  Text,
  useMantineTheme,
  MantineTheme,
  Notification,
} from "@mantine/core"
import { Dropzone, DropzoneStatus, IMAGE_MIME_TYPE } from "@mantine/dropzone"
import { useTypedAction } from "../ts-models/api"

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
  status: DropzoneStatus,
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
  return (
    <>
      <Dropzone
        onDrop={async (files) => {
          setloading(true)
          var data = new FormData()
          files.forEach((file) => {
            data.append("file", file)
          })

          const response = await fetch("/api/upload-files-form", {
            method: "POST",
            body: data,
          })
          setloading(false)
        }}
        onReject={(files) => console.log("rejected files", files)}
        maxSize={3 * 1024 ** 2}
        accept={IMAGE_MIME_TYPE}
      >
        {(status) => dropzoneChildren(status, theme)}
      </Dropzone>
      <Notification
        loading={loading}
        title="Uploading data to the server"
        disallowClose
      >
        Please wait until data is uploaded, you cannot close this notification
        yet
      </Notification>
    </>
  )
}
