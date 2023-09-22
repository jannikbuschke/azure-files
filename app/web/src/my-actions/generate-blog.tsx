import { Button, Group } from "@mantine/core"
import * as React from "react"
import { showNotification, updateNotification } from "@mantine/notifications"
import { AsyncButton } from "../typed-api/ActionButton"
import { useTypedAction } from "../client/api"
import { QueryWithBoundary } from "../query"

let i = 0

export function GenerateBlogActions() {
  const [generateStaticGallery] = useTypedAction(
    "/api/my/create-static-gallery",
  )
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
      <QueryWithBoundary name="/api/features/gallery/get-galleries" input={{}}>
        {(data) => (
          <>
            {data.Case === "Ok"
              ? data.Fields.map((gallery) => (
                  <AsyncButton
                    action="/api/my/create-static-gallery"
                    values={{ galleryId: gallery.id }}
                  >
                    {gallery.name}
                  </AsyncButton>
                ))
              : null}
          </>
        )}
      </QueryWithBoundary>
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
      <AsyncButton action="/api/my/write-obsidian-notes" values={{}}>
        Generate obsidian photos
      </AsyncButton>
    </Group>
  )
}
