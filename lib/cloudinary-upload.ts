export const MAX_PDF_BYTES = 10 * 1024 * 1024
export const MAX_IMAGE_BYTES = 10 * 1024 * 1024
export const IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"]

export type UploadFolder = "eko-communicator" | "in-loving-memory"

export interface UploadResult {
  url: string
  publicId: string
}

export function validateImage(file: File): string | null {
  if (!IMAGE_TYPES.includes(file.type)) return `${file.name}: only JPG, PNG or WEBP images are allowed`
  if (file.size > MAX_IMAGE_BYTES) return `${file.name}: images must be under 10 MB`
  return null
}

export function validatePdf(file: File): string | null {
  if (file.type !== "application/pdf") return `${file.name}: only PDF files are allowed`
  if (file.size > MAX_PDF_BYTES) return `${file.name} is ${(file.size / 1024 / 1024).toFixed(1)} MB. The limit is 10 MB`
  return null
}

export async function uploadToCloudinary(
  file: File,
  folder: UploadFolder,
  onProgress?: (percent: number) => void,
): Promise<UploadResult> {
  const signRes = await fetch("/api/upload/signature", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ folder }),
  })
  const sign = await signRes.json()
  if (!signRes.ok) throw new Error(sign.error || "Could not authorize upload")

  const form = new FormData()
  form.append("file", file)
  form.append("api_key", sign.apiKey)
  form.append("timestamp", String(sign.timestamp))
  form.append("signature", sign.signature)
  form.append("folder", sign.folder)

  // PDFs are uploaded as "image" so Cloudinary can render page 1 as a cover thumbnail.
  const endpoint = `https://api.cloudinary.com/v1_1/${sign.cloudName}/image/upload`

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open("POST", endpoint)
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) onProgress(Math.round((event.loaded / event.total) * 100))
    }
    xhr.onload = () => {
      let body: any = {}
      try {
        body = JSON.parse(xhr.responseText)
      } catch {}
      if (xhr.status >= 200 && xhr.status < 300 && body.secure_url) {
        resolve({ url: body.secure_url, publicId: body.public_id })
      } else {
        reject(new Error(body?.error?.message || `Upload failed (${xhr.status})`))
      }
    }
    xhr.onerror = () => reject(new Error("Network error during upload"))
    xhr.send(form)
  })
}

export function pdfCoverFromUrl(pdfUrl: string, width = 600): string {
  if (!pdfUrl.includes("/image/upload/") || !pdfUrl.toLowerCase().endsWith(".pdf")) return ""
  return pdfUrl.replace("/image/upload/", `/image/upload/pg_1,w_${width},c_limit,f_jpg/`).replace(/\.pdf$/i, ".jpg")
}
