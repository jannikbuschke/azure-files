import {
  Box,
  Button,
  Group,
  Pagination as MantinePagination,
  Popover,
} from "@mantine/core"
import { useFormikContext } from "formik"
import { RenderObject } from "glow-core"
import { NodaTime } from "../client"
import React from "react"
import { css } from "@emotion/react"
import { useSearchParams } from "react-router-dom"
import { pathProxy, TypedForm } from "../client/api"
import { useParams } from "react-router"
import { Guid } from "../client/System"
import { Image } from "../client/AzFiles_Galleries"
import { useTypedQuery } from "../typed-api/use-query"
import { match } from "ts-pattern"
import { UpdateGallery } from "../client/AzFiles_Features_Gallery"
import { NumberInput } from "formik-mantine"

import PhotoAlbum from "react-photo-album"
import Lightbox from "yet-another-react-lightbox"

const _ = pathProxy<UpdateGallery, UpdateGallery>()

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
//   image: Image
// }>) {
//   const {
//     values: { items },
//     setFieldValue,
//   } = useFormikContext<UpdateGallery>()
//   const [hovering, setHovering] = React.useState(false)
//   const isSelected = false

//   const item = items[index]!
//   const sx = (100 - (30 / photo.width) * 100) / 100
//   const sy = (100 - (30 / photo.height) * 100) / 100
//   const transform = `translateZ(0px) scale3d(${sx}, ${sy}, 1)`
//   return (
//     <div
//       onMouseOver={() => setHovering(true)}
//       onMouseLeave={() => setHovering(false)}
//       style={{ position: "relative" }}
//     >
//       <img
//         onClick={(e) => onClick && onClick(e, { photo: photo, index } as any)}
//         // key={key}
//         width={photo.width}
//         height={photo.height}
//         // {...photo}
//         src={photo.src}
//         style={{
//           filter: item.hidden === true ? "blur(3px)" : "none",
//           left,
//           top,
//           margin: isSelected ? 8 : 2,
//           opacity: item.hidden === true ? 0.5 : 1,
//         }}
//       />

//       <div
//         style={{
//           position: "absolute",
//           left: 12,
//           bottom: 16,
//           opacity: hovering ? 1 : 0.1,
//           transition: "opacity 0.2s ease-in-out",
//         }}
//       >
//         <Group
//           spacing="xs"
//           onMouseOver={() => setHovering(true)}
//           onMouseLeave={() => setHovering(false)}
//           style={
//             {
//               // opacity: hovering ? 1 : 0,
//               // transition: "opacity 0.2s ease-in-out",
//             }
//           }
//         >
//           <Button
//             size="xs"
//             variant="default"
//             onClick={() =>
//               setFieldValue(_.items[index]!.hidden._PATH_, !item.hidden)
//             }
//             // color="dark"
//             // variant={item.hidden ? "light" : "filled"}
//           >
//             {item.hidden === true ? "Show" : "Hide"}
//           </Button>
//           {/* <Checkbox name={_.items[index]!.hidden._PATH_} /> */}
//           <NumberInput
//             size="xs"
//             name={_.items[index]!.dimension.columnSpan._PATH_}
//             style={{ width: 80 }}
//           />
//           <NumberInput
//             size="xs"
//             name={_.items[index]!.dimension.rowSpan._PATH_}
//             style={{ width: 80 }}
//           />
//           <Popover width={500} position="bottom" withArrow shadow="md">
//             <Popover.Target>
//               <Button size="xs" variant="default">
//                 i
//               </Button>
//             </Popover.Target>
//             <Popover.Dropdown>
//               <RenderObject
//                 dimension={item.dimension}
//                 size={item.size}
//                 sx={sx}
//                 sy={sy}
//                 width={photo.width}
//                 height={photo.height}
//                 size={photo.image.size}
//                 dim={photo.image.dimension}
//                 tags={photo.image.file.tags}
//               />
//             </Popover.Dropdown>
//           </Popover>
//         </Group>
//       </div>
//     </div>
//   )
// }

function usePagination() {
  const [searchParams, setSearchParams] = useSearchParams()
  const pagination = {
    pageNumber: parseInt(searchParams.get("page") || "0"),
    pageSize: parseInt(searchParams.get("pageSize") || "100"),
  }
  return {
    pagination,
    setPage: (pageNumber: number) => {
      setSearchParams(
        new URLSearchParams({
          page: (pageNumber - 1).toString(),
          pageSize: pagination.pageSize.toString(),
        }).toString(),
        { replace: false },
      )
    },
  }
}

export function EditGalleryView() {
  const { id } = useParams<{ id: Guid }>()
  const { pagination, setPage } = usePagination()
  const [currentImage, setCurrentImage] = React.useState(0)
  const [basicExampleOpen, setBasicExampleOpen] = React.useState(false)

  const [data] = useTypedQuery("/api/features/gallery/get-gallery", {
    input: {
      argument: {
        Case: "Id",
        Fields: id!,
      },
    },
  })
  const [items] = useTypedQuery("/api/features/gallery/get-gallery-items", {
    input: {
      pagination: {
        Case: "Page",
        Fields: pagination,
      },
      argument: {
        Case: "Id",
        Fields: id!,
      },
    },
  })

  if (!id) {
    return <div>no id</div>
  }
  if (items.Case === "Error") {
    return <div>error</div>
  }
  const { count, value: galleryItems } = items.Fields

  const photos = galleryItems.map((v) => {
    console.log({ v })
    const width = v.dimension.columnSpan
    const height = v.dimension.rowSpan
    // const width = v.size.width
    // const height = v.size.height
    const ratio = width / height
    const dim =
      width > height ? { width: 3, height: 2 } : { width: 2, height: 3 }

    return {
      src: v.file.lowresVersions[0]?.url || v.file.url, // 'http://example.com/example/img1.jpg',
      // width,
      // height,
      width: dim.width,
      height: dim.height,
      createdAt: v.file.fileDateOrCreatedAt,
      selected: false,
      image: v,
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
      // width: v.image.size.width,
      // height: v.image.size.height,
      // width: v.placement.dimension.columnSpan, // 4,
      // height: v.placement.dimension.rowSpan, // 3
    }
  })
  return (
    <Box
      css={css`
        img {
          object-fit: cover;
        }
      `}
    >
      {match(data)
        .with({ Case: "Error" }, () => <div>error</div>)
        .with({ Case: "Ok" }, ({ Fields: gallery }) => (
          <>
            <h1>Edit gallery {gallery.name}</h1>
            <TypedForm
              actionName="/api/features/gallery/update-gallery"
              initialValues={{ id: id!, items: galleryItems }}
            >
              {(f, _) => (
                <>
                  <Group>
                    <Button loading={f.isSubmitting} onClick={f.submitForm}>
                      Save
                    </Button>
                    <MantinePagination
                      total={Math.ceil(count / pagination.pageSize)}
                      page={pagination.pageNumber + 1}
                      onChange={setPage}
                    />
                  </Group>

                  <PhotoAlbum
                    spacing={(containerWidth) =>
                      containerWidth < 1200 ? 4 : 4
                    }
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

                  <MantinePagination
                    total={Math.ceil(count / pagination.pageSize)}
                    page={pagination.pageNumber + 1}
                    onChange={setPage}
                  />
                </>
              )}
            </TypedForm>
          </>
        ))
        .exhaustive()}
    </Box>
  )
}