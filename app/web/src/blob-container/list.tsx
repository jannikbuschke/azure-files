import * as React from "react"
import { Container, Grid, Stack } from "@mantine/core"
import { useTypedQuery } from "../ts-models/api"
import { Outlet, useParams } from "react-router"
import { Link } from "react-router-dom"
import { RenderObject } from "glow-core"
// import { RenderObject } from "glow-core"

export function BlobContainerDetail() {
  const { id: name } = useParams<{ id: string }>()
  const { data } = useTypedQuery("/api/blob/get-files", {
    input: { name: name! },
    placeholder: [],
  })
  return (
    <Stack>
      {data.map((v) => (
        <div>
          <b>{v.name}</b> {v.metadata["originalfilename"]}
          {/* // <div>
          //   metadata:
          //   {Object.keys(v.metadata).map((key) => (
          //     <div>
          //       {key}: {v.metadata[key]}
          //     </div>
          //   ))}
          // </div> */}
        </div>
      ))}
      {/* <RenderObject {...data} /> */}
    </Stack>
  )
}

export function BlobContainerList() {
  const { data: pages } = useTypedQuery("/api/blob/get-containers", {
    input: {},
    placeholder: [],
  })

  const blobs = pages // pages.flatMap((v) => v.values)

  return (
    <div style={{ display: "grid", gridTemplateColumns: "150px 1fr" }}>
      <Stack>
        {blobs.map((v, i) => (
          <Link to={v.name!} key={i}>
            {i} {v.name} {v.versionId}
          </Link>
        ))}
      </Stack>
      <Outlet />
    </div>
  )
}
