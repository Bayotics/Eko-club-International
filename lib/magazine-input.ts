const str = (value: unknown) => (typeof value === "string" ? value.trim() : "")

export function parseMagazineInput(body: Record<string, unknown>) {
  const data = {
    title: str(body.title),
    issueNumber: str(body.issueNumber),
    publishedDate: str(body.publishedDate),
    description: str(body.description),
    coverImage: str(body.coverImage),
    pdfUrl: str(body.pdfUrl),
    pdfPublicId: str(body.pdfPublicId),
  }

  if (!data.title) return { error: "Title is required" }
  if (!data.publishedDate || Number.isNaN(Date.parse(data.publishedDate))) return { error: "A valid publication date is required" }
  if (!data.pdfUrl.startsWith("https://")) return { error: "Magazine PDF is required" }
  if (data.coverImage && !data.coverImage.startsWith("https://")) return { error: "Invalid cover image URL" }

  return { data: { ...data, publishedDate: new Date(data.publishedDate) } }
}
