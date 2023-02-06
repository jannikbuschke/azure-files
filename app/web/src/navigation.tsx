import * as React from "react"
import { Route, Routes, Outlet } from "react-router"
import { BlobItemDetail } from "./blob-container/blob-detail"
import { IndexedFileDetail, IndexedFiles } from "./blob-container/indexed-files"
import { BlobContainerDetail, BlobContainerList } from "./blob-container/list"
import { NextUntaggedBlob } from "./blob-container/next-untagged-blob"
import { UploadFile } from "./blob-container/upload-file"
import { GenerateBlogActions } from "./my-actions/generate-blog"
import { UntaggedFilesView } from "./untagged-files"
import {} from "glow-mantine/lib/debug-views/debug-data"
import { DebugViews } from "glow-mantine/lib/debug-views/debug-views"
import { EsEventList } from "glow-mantine/lib/debug-views/event-list"
import { EsEventListWithoutValidation } from "glow-mantine/lib/debug-views/event-list-without-validation"
import { PgsqlActivities } from "glow-mantine/lib/debug-views/pgsql"
import { Nav } from "glow-mantine/lib/nav"

export function AllContentRoutes() {
  return (
    <Routes>
      <Route path="/container" element={<BlobContainerList />}>
        <Route path=":id" element={<BlobContainerDetail />}>
          <Route path=":itemId" element={<BlobItemDetail />} />
        </Route>
      </Route>
      <Route path="/upload-file" element={<UploadFile />} />
      <Route path="/untagged-files" element={<UntaggedFilesView />} />
      <Route path="/indexed-files" element={<IndexedFiles />}>
        <Route path=":id" element={<IndexedFileDetail />} />
        <Route path="next-untagged" element={<NextUntaggedBlob />} />
      </Route>
      <Route path="/actions" element={<GenerateBlogActions />} />
      <Route
        path="/debug"
        element={
          <div>
            <Nav
              matchPattern="/debug/:id"
              data={[
                { label: "events", value: "events" },
                {
                  label: "events-without-validation",
                  value: "events-without-validation",
                },
                { label: "aggregates", value: "aggregates" },
                { label: "pgsql", value: "pgsql" },
              ]}
            />
            debug
            <Outlet />
          </div>
        }
      >
        <Route path="events" element={<EsEventList />} />
        <Route
          path="events-without-validation"
          element={<EsEventListWithoutValidation />}
        />
        <Route path="aggregates" element={<DebugViews />} />
        <Route path="pgsql" element={<PgsqlActivities />} />
      </Route>
    </Routes>
  )
}
