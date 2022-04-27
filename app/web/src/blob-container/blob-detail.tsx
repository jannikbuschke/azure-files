import { Button, Container } from "@mantine/core"
import { ErrorBanner, RenderObject } from "glow-core"
import * as React from "react"
import { useNavigate, useParams } from "react-router"
import { useTypedAction, useTypedQuery } from "../ts-models/api"
import { defaultAzureFilesBlobProperties } from "../ts-models/AzureFiles"

export function BlobItemDetail() {
  const { id: containerId, itemId } = useParams<"id" | "itemId">()
  const { data, error } = useTypedQuery("/api/blob/get-file", {
    input: { itemId: itemId!, containerId: containerId! },
    placeholder: defaultAzureFilesBlobProperties,
  })
  const [deleteFile] = useTypedAction("/api/blob/delete-file")
  const navigate = useNavigate()
  return (
    <Container>
      <Button
        onClick={async () => {
          const result = await deleteFile({
            itemId: itemId!,
            containerId: containerId!,
          })
          if (result.ok) {
            navigate(-1)
          }
        }}
      >
        Delete
      </Button>
      <ErrorBanner message={error} />
      <RenderObject {...data} />
    </Container>
  )
}
