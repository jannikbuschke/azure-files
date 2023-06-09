import { Button, HoverCard, ScrollArea } from "@mantine/core"
import { Prism } from "@mantine/prism"
import { ErrorBanner } from "glow-core"
import { useNavigate, useParams } from "react-router-dom"
import { useTypedQuery } from "glow-mantine/src/client/api"

type DocumentName = "Meeting" | "MeetingItem"

function isDocumentName(name: string): name is DocumentName {
  switch (name) {
    case "Meeting":
      return true
    case "MeetingItem":
      return true
  }
  return false
}

export type DocumentJsonViewProps = {
  documentName: DocumentName
  documentId: string
}

export function DocumentJsonViewRoute() {
  const { documentName, documentId } =
    useParams<"documentName" | "documentId">()
  if (!documentId) {
    return <div>missing route parameter 'documentId'</div>
  }
  if (!documentName) {
    return <div>missing route parameter 'documentName'</div>
  }
  if (!isDocumentName(documentName)) {
    return <div>documentName '{documentName}' is not valud</div>
  }
  return (
    <div>
      <DocumentJsonView documentName={documentName} documentId={documentId} />
    </div>
  )
}

export function DocumentJsonViewLink(props: DocumentJsonViewProps) {
  const navigate = useNavigate()
  return (
    <HoverCard shadow="md">
      <HoverCard.Target>
        <Button
          size="xs"
          p={0}
          variant="subtle"
          onClick={() =>
            navigate(
              `/debug/documents/${props.documentName}/${props.documentId}`,
            )
          }
        >
          Debug data
        </Button>
      </HoverCard.Target>
      <HoverCard.Dropdown>
        <ScrollArea style={{ height: 500 }}>
          <DocumentJsonView {...props} />
        </ScrollArea>
      </HoverCard.Dropdown>
    </HoverCard>
  )
}

export function DocumentJsonView({
  documentName,
  documentId,
}: DocumentJsonViewProps) {
  const {
    data: documents,
    loading: loadingDocuments,
    error: errorDocuments,
    isLoading,
  } = useTypedQuery("/api/debug/get-documents", {
    input: { documentName },
    placeholder: [],
  })

  const doc = documents.filter((v) => v.id === documentId)

  if (!doc) {
    return <div>Document with id '{documentId}' not found</div>
  }
  return (
    <div>
      <ErrorBanner message={errorDocuments} />
      <Prism language="json">{JSON.stringify(doc, null, 2)}</Prism>
    </div>
  )
}
