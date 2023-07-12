import { useState } from "react"
import { Document, Page } from "react-pdf"
import * as pdfjs from "pdfjs-dist"
import type { DocumentProps } from "react-pdf"

const src = new URL("pdfjs-dist/build/pdf.worker.js", import.meta.url)
console.log("meta url", import.meta.url)
pdfjs.GlobalWorkerOptions.workerSrc =
  "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.6.172/pdf.worker.min.js"

import { useParams } from "react-router"

export function PdfViewer({ url }: { url: string }) {
  return (
    <div>
      <Document
        file={url}
        onLoadSuccess={(v) => {
          console.log("pdf loaded", v)
        }}
      >
        <Page pageNumber={1} width={600} />
      </Document>
    </div>
  )
}

export function PdfPage() {
  const { id } = useParams()
  return <PdfViewer url={`/content/src/${id}`} />
}
