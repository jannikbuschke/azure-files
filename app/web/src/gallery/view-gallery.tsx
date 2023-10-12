import { Box } from "@mantine/core"
import React from "react"
import { css } from "@emotion/react"
import { useParams } from "react-router"
import { useTypedQuery } from "../typed-api/use-query"
import PhotoAlbum from "react-photo-album"
import Lightbox from "yet-another-react-lightbox"

export function ViewGallery() {
  const { name } = useParams<{ name: string }>()
  const [currentImage, setCurrentImage] = React.useState(0)
  const [data] = useTypedQuery("/api/features/gallery/get-gallery", {
    input: {
      argument: { Case: "Name", Fields: name! },
    },
  })

  if (!name) {
    return <div>no id</div>
  }

  if (data.Case === "Error") {
    return <div>Error</div>
  }
  const gallery = data.Fields
  const items = gallery.items.filter(
    (v) => v.hidden === undefined || v.hidden === false,
  )
  const photos = items.map((v, i) => {
    console.log({ v })
    const width = v.dimension.columnSpan
    const height = v.dimension.rowSpan
    // const width = v.size.width
    // const height = v.size.height
    const ratio = width / height
    const dim =
      width > height ? { width: 3, height: 2 } : { width: 2, height: 3 }

    const l = v.file.lowresVersions[0]!

    return {
      index: i,
      src: v.file.lowresVersions[0]?.url || v.file.url, // 'http://example.com/example/img1.jpg',
      // width,
      // height,
      // width: dim.width,
      // height: dim.height,
      createdAt: v.file.fileDateOrCreatedAt,
      selected: false,
      image: v,

      width: v.size.width * 4,
      height: v.size.height * 4,
      srcSet: [
        {
          src: v.file.url,
          width: v.size.width,
          height: v.size.height,
        },
        ...v.file.lowresVersions.map((v) => ({
          src: v.url,
          width: v.dimension.width,
          height: v.dimension.height,
        })),
      ],
      // width: v.placement.dimension.columnSpan, // 4,
      // height: v.placement.dimension.rowSpan, // 3
    }
  })
  const [basicExampleOpen, setBasicExampleOpen] = React.useState(false)
  return (
    <Box
      css={css`
        img {
          object-fit: cover;
        }
      `}
    >
      <>
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
      </>
    </Box>
  )
}
