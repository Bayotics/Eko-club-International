const str = (value: unknown) => (typeof value === "string" ? value.trim() : "")
const isDate = (value: string) => !Number.isNaN(Date.parse(value))

export function parseMemorialInput(body: Record<string, unknown>) {
  const name = str(body.name)
  const photo = str(body.photo)
  const dateOfBirth = str(body.dateOfBirth)
  const dateOfPassing = str(body.dateOfPassing)
  const gallery = Array.isArray(body.gallery)
    ? body.gallery.map(str).filter((url) => url.startsWith("https://"))
    : []

  if (!name) return { error: "Name is required" }
  if (!dateOfPassing || !isDate(dateOfPassing)) return { error: "A valid date of passing is required" }
  if (dateOfBirth && !isDate(dateOfBirth)) return { error: "Invalid date of birth" }
  if (dateOfBirth && new Date(dateOfBirth) > new Date(dateOfPassing)) {
    return { error: "Date of birth must be before date of passing" }
  }
  if (photo && !photo.startsWith("https://")) return { error: "Invalid photo URL" }

  return {
    data: {
      name,
      photo,
      dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
      dateOfPassing: new Date(dateOfPassing),
      chapter: str(body.chapter),
      role: str(body.role),
      biography: typeof body.biography === "string" ? body.biography : "",
      gallery,
    },
  }
}
