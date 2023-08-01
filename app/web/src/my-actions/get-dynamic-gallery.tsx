import { Box, Button, Center, Group, TextInput } from "@mantine/core"
import { Formik } from "formik"
import { RenderObject, useNotify } from "glow-core"
import { NodaTime } from "../client"
import { QueryWithBoundary } from "../query"
// import { DatePicker } from "formik-mantine"
import { DatePicker } from "@mantine/dates"
import React from "react"
import { css } from "@emotion/react"
import { useSearchParams } from "react-router-dom"
import dayjs from "dayjs"
import { ImageFilter } from "../client/AzFiles_Features"
import { TypedForm } from "../client/api"
import PhotoAlbum from "react-photo-album"
import Lightbox from "yet-another-react-lightbox"
import { useTypedQuery } from "../typed-api/use-query"

// function SelectedImage({
//   index,
//   left,
//   top,
//   photo,
//   onClick,
//   margin,
//   ...rest
// }: RenderImageProps<{
//   createdAt: NodaTime.Instant
//   selected: boolean
// }>) {
//   const [hovering, setHovering] = React.useState(false)
//   const isSelected = false

//   const sx = (100 - (30 / photo.width) * 100) / 100
//   const sy = (100 - (30 / photo.height) * 100) / 100
//   const transform = `translateZ(0px) scale3d(${sx}, ${sy}, 1)`
//   return (
//     <div style={{ position: "relative" }}>
//       {isSelected ? <Checkmark selected={true} /> : null}
//       <img
//         onClick={onClick as any}
//         // key={key}
//         width={photo.width}
//         height={photo.height}
//         // {...photo}
//         src={photo.src}
//         style={{ left, top, margin: isSelected ? 8 : 2 }}
//       />
//       <div
//         onMouseOver={() => setHovering(true)}
//         onMouseLeave={() => setHovering(false)}
//         style={{
//           position: "absolute",
//           left: 12,
//           bottom: 16,
//           opacity: hovering ? 1 : 0,
//           transition: "opacity 0.2s ease-in-out",
//         }}
//       >
//         <Group
//           position="apart"
//           onMouseOver={() => setHovering(true)}
//           onMouseLeave={() => setHovering(false)}
//           style={{
//             position: "absolute",
//             left: 12,
//             bottom: 16,
//             // opacity: hovering ? 1 : 0,
//             // transition: "opacity 0.2s ease-in-out",
//           }}
//         >
//           <Button size="xs">Like</Button>
//         </Group>
//       </div>
//       {/* <div>{photo.createdAt}</div> */}
//     </div>
//   )
// }

export function DynamicGalleryPage() {
  const [searchParams, setSearchParams] = useSearchParams()

  const startDateRaw = searchParams.get("startDate")
  const endDateRaw = searchParams.get("endDate")

  const filter: ImageFilter =
    Boolean(startDateRaw) && Boolean(endDateRaw)
      ? {
          Case: "DateRange",
          Fields: {
            item1: dayjs(startDateRaw!).toISOString() as NodaTime.Instant,
            item2: dayjs(endDateRaw!).toISOString() as NodaTime.Instant,
          },
        }
      : { Case: "All" }
  const [items] = useTypedQuery("/api/features/gallery/get-dynamic-gallery", {
    input: {
      filter,
    },
  })

  const { notifySuccess } = useNotify()
  const [currentImage, setCurrentImage] = React.useState(0)
  const [basicExampleOpen, setBasicExampleOpen] = React.useState(false)
  if (items.Case === "Error") {
    return <div>error</div>
  }
  const { positionedImages } = items.Fields

  const photos = positionedImages.map((v) => {
    console.log({ v })
    const width = v.placement.dimension.columnSpan
    const height = v.placement.dimension.rowSpan
    // const width = v.size.width
    // const height = v.size.height
    const ratio = width / height
    const dim =
      width > height ? { width: 3, height: 2 } : { width: 2, height: 3 }

    return {
      src: v.image.file.lowresVersions[0]?.url || v.image.file.url, // 'http://example.com/example/img1.jpg',
      // width,
      // height,
      width: dim.width,
      height: dim.height,
      createdAt: v.image.file.fileDateOrCreatedAt,
      selected: false,
      image: v,
      srcSet: [
        {
          src: v.image.file.url,
          width: v.image.size.width,
          height: v.image.size.height,
        },
        ...v.image.file.lowresVersions.map((v) => ({
          src: v.url,
          width: v.dimension.width,
          height: v.dimension.height,
        })),
      ],
      // width: v.image.size.width,
      // height: v.image.size.height,
      // width: v.placement.dimension.columnSpan, // 4,
      // height: v.placement.dimension.rowSpan, // 3
    }
  })
  return (
    <Box>
      <Box p="xs" bg="gray.2">
        <Group>
          <DatePicker
            name="startDate"
            value={startDateRaw ? new Date(startDateRaw) : null}
            label="Start"
            placeholder="Pick date and time"
            onChange={(v) => {
              setSearchParams(
                new URLSearchParams({
                  // ...data,
                  startDate: v === null ? "" : dayjs(v).format("YYYY-MM-DD"),
                  endDate: endDateRaw || "",
                }).toString(),
                { replace: true },
              )
            }}
            // maw={400}
            // mx="auto"
          />
          <DatePicker
            name="endDate"
            value={endDateRaw ? new Date(endDateRaw) : null}
            onChange={(v) => {
              setSearchParams(
                new URLSearchParams({
                  startDate: startDateRaw || "",
                  // ...data,
                  endDate: v === null ? "" : dayjs(v).format("YYYY-MM-DD"),
                }),
                { replace: true },
              )
            }}
            label="End"
            placeholder="Pick date and time"
            // maw={400}
            // mx="auto"
          />
          <TypedForm
            actionName="/api/file/tag-many"
            initialValues={{ filter, tags: [] }}
            onSuccess={() => notifySuccess()}
          >
            {(f, _) => (
              <Group>
                <Button
                  onClick={f.submitForm}
                  loading={f.isSubmitting}
                  style={{ alignSelf: "flex-end" }}
                >
                  Add tags
                </Button>
                <TextInput
                  value={f.values.tags.join(" ")}
                  onChange={(v) =>
                    f.setFieldValue(_.tags._PATH_, v.target.value.split(" "))
                  }
                  label="Tags"
                />
              </Group>
            )}
          </TypedForm>
        </Group>
      </Box>
      {/* <RenderObject Case={data.Case} Fields={data.Fields} /> */}
      <PhotoAlbum
        spacing={(containerWidth) => (containerWidth < 1200 ? 4 : 4)}
        layout="rows"
        photos={photos}
        onClick={(e) => {
          setCurrentImage(e.index)
          setBasicExampleOpen(true)
        }}
      />
      <Lightbox
        index={currentImage}
        open={basicExampleOpen}
        close={() => setBasicExampleOpen(false)}
        slides={photos}
      />
      x
    </Box>
  )
}
