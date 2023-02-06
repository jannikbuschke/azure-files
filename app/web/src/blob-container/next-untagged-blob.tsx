import { Container } from "@mantine/core"
import { ErrorBanner } from "glow-core"
import { FileContent } from "./indexed-files"
import * as React from "react"
import { useTypedQuery } from "../client/api"
import { defaultFileAggregate } from "../client/AzureFiles"

export function NextUntaggedBlob() {
  const { data, error, refetch } = useTypedQuery(
    "/api/file/get-next-untagged",
    {
      input: {},
      placeholder: defaultFileAggregate,
    },
  )

  return (
    <Container>
      <ErrorBanner message={error} />

      <FileContent
        key={data.id}
        data={data}
        id={data.id}
        onSave={() => refetch()}
      />
      {/* <RenderObject {...data} /> */}
    </Container>
  )
}
