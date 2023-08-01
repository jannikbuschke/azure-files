import * as React from "react"
import { Route, Routes, Outlet } from "react-router"
import { BlobItemDetail } from "./blob-container/blob-detail"
import { Inbox, IndexedFileDetail } from "./blob-container/inbox"
import { BlobContainerDetail, BlobContainerList } from "./blob-container/list"
import { UploadFile } from "./blob-container/upload-file"
import { GenerateBlogActions } from "./my-actions/generate-blog"
import { UntaggedFilesView } from "./untagged-files"
import { DebugViews } from "./debug-views/debug-views"
import { EsEventList } from "./debug-views/event-list"
import { EsEventListWithoutValidation } from "./debug-views/event-list-without-validation"
import { PgsqlActivities } from "./debug-views/pgsql"
import { Nav } from "glow-mantine/lib/nav"
import { ImagesGallery } from "./blob-container/images"
import { GalleryPreview } from "./blob-container/gallery-editor"
import { PdfPage } from "./blob-container/pdf-viewer"
import { Fsi } from "./fsi/fsi-view"
import { DynamicGalleryPage } from "./my-actions/get-dynamic-gallery"
import { CreateGalleryView } from "./my-actions/create-gallery"
import { EditGalleryView } from "./my-actions/edit-gallery"
import { GalleriesListView } from "./my-actions/galleries-list"
import { ViewGallery } from "./my-actions/view-gallery"

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
      <Route path="/inbox" element={<Inbox />}>
        <Route
          path=":id"
          element={
            <React.Suspense fallback={<div>loading...</div>}>
              <IndexedFileDetail />
            </React.Suspense>
          }
        />
      </Route>
      <Route path="/fsi" element={<Fsi />} />
      <Route path="/gallery-preview" element={<GalleryPreview />} />
      <Route path="/gallery">
        <Route path="create" element={<CreateGalleryView />} />
        <Route path=":id" element={<EditGalleryView />} />
        <Route index={true} element={<GalleriesListView />} />
      </Route>
      <Route path="/g/:name" element={<ViewGallery />} />
      <Route path="/dynamic-gallery" element={<DynamicGalleryPage />} />
      <Route path="/images" element={<ImagesGallery />} />
      <Route path="/pdfs/:id" element={<PdfPage />} />
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
