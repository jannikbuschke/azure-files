import { Button, Group } from "@mantine/core"
import * as React from "react"
import { useTypedAction } from "../ts-models/api"
import { showNotification, updateNotification } from "@mantine/notifications"

let i = 0

export function GenerateBlogActions() {
  const [generateBlogData] = useTypedAction("/api/my/write-blog-data")
  async function generateData(tagName: "publish" | "stage-for-blog") {
    const id = i++
    showNotification({
      id: "loading-" + id,
      title: "Generate data",
      message: "Generating " + tagName,
      loading: true,
    })
    await generateBlogData({ tagName })
    updateNotification({
      id: "loading-" + id,
      title: "done",
      message: "✅",
      loading: false,
      color: "grape",
      autoClose: 5000,
    })
  }
  return (
    <Group>
      <Button
        onClick={async () => {
          await generateData("stage-for-blog")
        }}
      >
        Stage for blog
      </Button>
      <Button
        onClick={async () => {
          await generateData("publish")
        }}
      >
        Production
      </Button>
    </Group>
  )
}
