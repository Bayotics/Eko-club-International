import { v2 as cloudinary } from "cloudinary"
import { deleteObject, headObject } from "@/lib/r2"
import { MAX_MAGAZINE_PDF_BYTES, MAX_MAGAZINE_PDF_MB } from "@/lib/magazine-limits"

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

interface StoredPdf {
  pdfStorage?: string
  pdfPublicId?: string
  pdfKey?: string
}

const pdfIdentity = (pdf: StoredPdf) => (pdf.pdfStorage === "r2" ? `r2:${pdf.pdfKey}` : `cloudinary:${pdf.pdfPublicId}`)

export const isSamePdf = (a: StoredPdf, b: StoredPdf) => pdfIdentity(a) === pdfIdentity(b)

// The browser uploads straight to R2, so confirm the object really exists and respects the limits before saving.
export async function verifyR2Upload(key: string): Promise<string | null> {
  const object = await headObject(key)
  if (!object) return "The PDF upload could not be found. Please upload it again."
  if (object.size > MAX_MAGAZINE_PDF_BYTES) {
    await deleteObject(key).catch(() => {})
    return `PDF must be under ${MAX_MAGAZINE_PDF_MB} MB`
  }
  if (object.contentType !== "application/pdf") return "Only PDF files are allowed"
  return null
}

export async function removeStoredPdf(pdf: StoredPdf) {
  try {
    if (pdf.pdfStorage === "r2" && pdf.pdfKey) {
      await deleteObject(pdf.pdfKey)
    } else if (pdf.pdfPublicId) {
      await cloudinary.uploader.destroy(pdf.pdfPublicId, { resource_type: "image", invalidate: true })
    }
  } catch (error) {
    console.error("Failed to delete magazine PDF:", error)
  }
}
