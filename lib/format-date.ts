// Dates from <input type="date"> are stored as UTC midnight; format in UTC so the day never shifts.
export function formatDateUTC(value: string | Date | null | undefined, style: "long" | "monthYear" | "year" = "long") {
  if (!value) return ""
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ""
  const options: Intl.DateTimeFormatOptions =
    style === "year"
      ? { year: "numeric", timeZone: "UTC" }
      : style === "monthYear"
        ? { month: "long", year: "numeric", timeZone: "UTC" }
        : { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }
  return date.toLocaleDateString("en-US", options)
}

export function lifeSpan(m: { dateOfBirth?: string | null; dateOfPassing: string }) {
  return m.dateOfBirth
    ? `${formatDateUTC(m.dateOfBirth, "year")} – ${formatDateUTC(m.dateOfPassing, "year")}`
    : `Passed ${formatDateUTC(m.dateOfPassing)}`
}

export function toDateInputValue(value: string | Date | null | undefined) {
  if (!value) return ""
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 10)
}
