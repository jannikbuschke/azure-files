import * as React from "react"
import { Route, Routes } from "react-router"
import { BlobContainerDetail, BlobContainerList } from "./blob-container/list"
import { UploadFile } from "./blob-container/upload-file"

export function AllContentRoutes() {
  return (
    <Routes>
      <Route path="/container" element={<BlobContainerList />}>
        <Route path=":id" element={<BlobContainerDetail />} />
      </Route>
      <Route path="/upload-file" element={<UploadFile />} />
    </Routes>
  )
}
