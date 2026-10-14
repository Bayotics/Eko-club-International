import { loadPdfJs } from "@/lib/pdfjs"
import { pdfCoverFromUrl, uploadToCloudinary } from "@/lib/cloudinary-upload"
import { MAX_MAGAZINE_PDF_BYTES, MAX_MAGAZINE_PDF_MB } from "@/lib/magazine-limits"

const COVER_WIDTH = 800

export function magazineCover(
  m: { coverImage?: string; pdfCoverImage?: string; pdfUrl?: string },
  width = 600,
) {
  return m.coverImage || m.pdfCoverImage || pdfCoverFromUrl(m.pdfUrl || "", width)
}

export function validateMagazinePdf(file: File): string | null {
  if (file.type !== "application/pdf") return `${file.name}: only PDF files are allowed`
  if (file.size > MAX_MAGAZINE_PDF_BYTES) {
    return `${file.name} is ${(file.size / 1024 / 1024).toFixed(1)} MB. The limit is ${MAX_MAGAZINE_PDF_MB} MB`
  }
  return null
}

export async function uploadMagazinePdf(file: File, onProgress?: (percent: number) => void): Promise<string> {
  const res = await fetch("/api/admin/eko-communicator/upload-url", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contentType: file.type, size: file.size }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || "Could not prepare the upload")

  await new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open("PUT", data.uploadUrl)
    xhr.setRequestHeader("Content-Type", file.type)
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) onProgress(Math.round((event.loaded / event.total) * 100))
    }
    xhr.onload = () => (xhr.status >= 200 && xhr.status < 300 ? resolve() : reject(new Error(`Upload failed (${xhr.status})`)))
    xhr.onerror = () =>
      reject(new Error("Upload was blocked. Check the R2 bucket's CORS policy allows this site."))
    xhr.send(file)
  })

  return data.key
}

// Renders page 1 locally and stores it on Cloudinary as the cover thumbnail.
export async function createPdfCover(file: File): Promise<string> {
  const pdfjs = await loadPdfJs()
  const doc = await pdfjs.getDocument({ data: new Uint8Array(await file.arrayBuffer()) }).promise
  try {
    const page = await doc.getPage(1)
    const viewport = page.getViewport({ scale: COVER_WIDTH / page.getViewport({ scale: 1 }).width })
    const canvas = document.createElement("canvas")
    canvas.width = Math.floor(viewport.width)
    canvas.height = Math.floor(viewport.height)
    const context = canvas.getContext("2d")!
    context.fillStyle = "#ffffff"
    context.fillRect(0, 0, canvas.width, canvas.height)
    await page.render({ canvas, canvasContext: context, viewport }).promise

    const blob = await new Promise<Blob>((resolve, reject) =>
      canvas.toBlob((b) => (b ? resolve(b) : reject(new Error("Could not create cover image"))), "image/jpeg", 0.85),
    )
    const { url } = await uploadToCloudinary(new File([blob], "cover.jpg", { type: "image/jpeg" }), "eko-communicator")
    return url
  } finally {
    doc.destroy()
  }
}
