import {
  Box,
  Button,
  Collapse,
  Group,
  Pagination as MantinePagination,
  Stack,
  Title,
} from "@mantine/core"
import { useFormikContext } from "formik"
import { RenderObject } from "glow-core"
import { NodaTime } from "../client"
import React from "react"
import { css } from "@emotion/react"
import { pathProxy, TypedForm } from "../client/api"
import { useParams } from "react-router"
import { Guid } from "../client/System"
import { GalleryId, Image } from "../client/AzFiles_Galleries"
import { useTypedQuery } from "../typed-api/use-query"
import { match } from "ts-pattern"
import { UpdateGallery } from "../client/AzFiles_Features_Gallery"
import { NumberInput } from "formik-mantine"
import PhotoAlbum, {
  RenderPhoto,
  Image as PhotoAlbumImage,
} from "react-photo-album"
import Lightbox from "yet-another-react-lightbox"
import { FSharpList } from "../client/Microsoft_FSharp_Collections"
import { ExifValue, FileId } from "../client/AzFiles"
import { useDisclosure } from "@mantine/hooks"
import { Text } from "@mantine/core"
import { AsyncButton } from "../typed-api/ActionButton"
import { TagAutoComplete } from "./create-gallery"
import { useUrlPagination } from "./useUrlPagination"

const _ = pathProxy<UpdateGallery, UpdateGallery>()

type MyPhoto = {
  src: string
  id: FileId
  galleryId: GalleryId
  // width,
  // height,
  width: number
  height: number
  createdAt: NodaTime.Instant
  selected: boolean
  image: Image
  srcSet: PhotoAlbumImage[]
  index: number
}

function AddImagesFromTag({ galleryId }: { galleryId: GalleryId }) {
  return (
    <Box>
      <TypedForm
        actionName="/api/features/gallery/add-images-on-base"
        initialValues={{
          galleryId,
          basedOn: { Case: "Tagged", Fields: [] },
        }}
      >
        {(f, _) => (
          <Box>
            <Stack spacing="xs">
              <TagAutoComplete f={f} _={_} />

              <Button loading={f.isSubmitting} onClick={f.submitForm}>
                Add images
              </Button>
            </Stack>
          </Box>
        )}
      </TypedForm>
    </Box>
  )
}

export function EditGalleryView() {
  const { id } = useParams<{ id: Guid }>()
  const { pagination, setPage } = useUrlPagination()
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

  const photos = galleryItems.map((v, i) => {
    const { width, height } = v.size

    return {
      id: v.file.id,
      galleryId: id,
      index: i,
      src: v.file.lowresVersions[0]?.url || v.file.url,
      width,
      height,
      // width: dim.width,
      // height: dim.height,
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
            <Title>Edit gallery {gallery.name}</Title>

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
                    <AsyncButton
                      color="red"
                      action="/api/features/gallery/delete-gallery"
                      values={{ id: gallery.id }}
                    >
                      delete
                    </AsyncButton>
                    <AddImagesFromTag galleryId={gallery.id} />
                  </Group>

                  <PhotoAlbum<MyPhoto>
                    spacing={(containerWidth) =>
                      containerWidth < 1200 ? 4 : 4
                    }
                    layout="rows"
                    photos={photos}
                    onClick={(e) => {
                      setCurrentImage(e.index)
                      setBasicExampleOpen(true)
                    }}
                    renderPhoto={renderPhoto}
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

function RenderExifData({ data }: { data: FSharpList<ExifValue> }) {
  const resolutionX = data.filter((v) => v.Case === "PixelXDimension")[0]
    ?.Fields as number | undefined
  const resolutionY = data.filter((v) => v.Case === "PixelYDimension")[0]
    ?.Fields as number | undefined
  const [opened, { toggle }] = useDisclosure(false)

  const orientation = data
    .map((v) => (v.Case === "Orientation" ? v.Fields : null))
    .filter((v) => v !== null)[0]

  const RecommendedExposureIndex = data.filter(
    (v) => v.Case === "RecommendedExposureIndex",
  )[0]
  const ISOSpeedRatings = data.filter((v) => v.Case === "ISOSpeedRatings")[0]

  return (
    <div>
      {resolutionX && resolutionY ? (
        <Text>
          Image Size = {resolutionX} x {resolutionY}
        </Text>
      ) : null}
      <Text>Orienation: {orientation || null}</Text>

      <Button size="xs" color="gray" variant="subtle" onClick={toggle}>
        {opened ? "Hide details" : "Show all exif data"}
      </Button>

      <Collapse in={opened}>
        <RenderObject {...data} />
      </Collapse>
    </div>
  )
}

const renderPhoto: RenderPhoto<MyPhoto> = (props) => {
  const {
    layout,
    layoutOptions,
    imageProps: { alt, style, ...restImageProps },
    photo,
  } = props
  const {
    values: { items },
    setFieldValue,
  } = useFormikContext<UpdateGallery>()

  const index = photo.index
  const item = items[photo.index]!
  return (
    <div
      style={{
        border: "2px solid #eee",
        borderRadius: "4px",
        boxSizing: "content-box",
        alignItems: "center",
        width: style?.width,
        padding: `${layoutOptions.padding - 2}px`,
        paddingBottom: 0,
      }}
    >
      <img
        alt={alt}
        style={{ ...style, width: "100%", padding: 0 }}
        // {...restImageProps}
        src={`/api/photos/src/${item.file.id}`}
      />
      <div
        style={{
          padding: 8,
          // paddingTop: "8px",
          // paddingBottom: "8px",
          overflow: "visible",
          whiteSpace: "nowrap",
          // textAlign: "center",
        }}
      >
        {/* <div>
          Layout ={" "}
          {Math.round(layout.width) + " x " + Math.round(layout.height)}
        </div> */}
        <div>
          Dim = {photo.width} x {photo.height}
        </div>

        <Group>
          <Button
            size="xs"
            variant="default"
            onClick={() =>
              setFieldValue(_.items[index]!.hidden._PATH_, !item.hidden)
            }
            // color="dark"
            // variant={item.hidden ? "light" : "filled"}
          >
            {item.hidden === true ? "Show" : "Hide"}
          </Button>
          {/* <Checkbox name={_.items[index]!.hidden._PATH_} /> */}
          {/* <NumberInput
            size="xs"
            label="Colspan"
            name={_.items[index]!.dimension.columnSpan._PATH_}
            style={{ width: 80 }}
          />
          <NumberInput
            size="xs"
            label="Rowspan"
            name={_.items[index]!.dimension.rowSpan._PATH_}
            style={{ width: 80 }}
          /> */}
          <NumberInput
            size="xs"
            label="Width"
            name={_.items[index]!.size.width._PATH_}
            style={{ width: 80 }}
          />
          <NumberInput
            size="xs"
            label="Height"
            name={_.items[index]!.size.height._PATH_}
            style={{ width: 80 }}
          />
          <NumberInput
            size="xs"
            label="Left"
            name={_.items[index]!.dimensionAdjustment.left._PATH_}
            style={{ width: 80 }}
          />
          <NumberInput
            size="xs"
            label="Top"
            name={_.items[index]!.dimensionAdjustment.top._PATH_}
            style={{ width: 80 }}
          />
          <NumberInput
            size="xs"
            label="Width"
            name={_.items[index]!.dimensionAdjustment.width._PATH_}
            style={{ width: 80 }}
          />
          <NumberInput
            size="xs"
            label="Height"
            name={_.items[index]!.dimensionAdjustment.height._PATH_}
            style={{ width: 80 }}
          />
          <AsyncButton
            action="/api/features/gallery/remove-item"
            values={{ fileId: photo.id, galleryId: photo.galleryId }}
          >
            Remove
          </AsyncButton>
        </Group>

        <RenderExifData data={props.photo.image.file.exifData || []} />
        {/* <RenderObject props={props} /> */}
      </div>
    </div>
  )
}
