import * as React from "react"
import { Route, Routes } from "react-router"
import { BlobItemDetail } from "./blob-container/blob-detail"
import { IndexedFileDetail, IndexedFiles } from "./blob-container/indexed-files"
import { BlobContainerDetail, BlobContainerList } from "./blob-container/list"
import { UploadFile } from "./blob-container/upload-file"

export function AllContentRoutes() {
  return (
    <Routes>
      <Route path="/container" element={<BlobContainerList />}>
        <Route path=":id" element={<BlobContainerDetail />}>
          <Route path=":itemId" element={<BlobItemDetail />} />
        </Route>
      </Route>
      <Route path="/upload-file" element={<UploadFile />} />
      <Route path="/indexed-files" element={<IndexedFiles />}>
        <Route path=":id" element={<IndexedFileDetail />} />
      </Route>
    </Routes>
  )
}
