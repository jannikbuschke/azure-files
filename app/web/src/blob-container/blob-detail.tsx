import { Button, Container } from "@mantine/core"
import { ErrorBanner, RenderObject } from "glow-core"
import { useNavigate, useParams } from "react-router"
import { useTypedAction, useTypedQuery } from "../client/api"
import { defaultAzureFilesBlobProperties } from "../client/AzFiles"

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
