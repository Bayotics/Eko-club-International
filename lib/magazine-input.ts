import { MAGAZINE_KEY_PATTERN } from "@/lib/magazine-limits"

const str = (value: unknown) => (typeof value === "string" ? value.trim() : "")
const isHttpsOrEmpty = (value: string) => !value || value.startsWith("https://")

export function parseMagazineInput(body: Record<string, unknown>) {
  const pdfStorage = body.pdfStorage === "r2" ? "r2" : "cloudinary"
  const data = {
    title: str(body.title),
    issueNumber: str(body.issueNumber),
    publishedDate: str(body.publishedDate),
    description: str(body.description),
    coverImage: str(body.coverImage),
    pdfCoverImage: str(body.pdfCoverImage),
    pdfStorage,
    pdfUrl: pdfStorage === "cloudinary" ? str(body.pdfUrl) : "",
    pdfPublicId: pdfStorage === "cloudinary" ? str(body.pdfPublicId) : "",
    pdfKey: pdfStorage === "r2" ? str(body.pdfKey) : "",
  }

  if (!data.title) return { error: "Title is required" }
  if (!data.publishedDate || Number.isNaN(Date.parse(data.publishedDate))) return { error: "A valid publication date is required" }
  if (pdfStorage === "r2" && !MAGAZINE_KEY_PATTERN.test(data.pdfKey)) return { error: "Magazine PDF is required" }
  if (pdfStorage === "cloudinary" && !data.pdfUrl.startsWith("https://")) return { error: "Magazine PDF is required" }
  if (!isHttpsOrEmpty(data.coverImage) || !isHttpsOrEmpty(data.pdfCoverImage)) return { error: "Invalid cover image URL" }

  return { data: { ...data, publishedDate: new Date(data.publishedDate) } }
}
