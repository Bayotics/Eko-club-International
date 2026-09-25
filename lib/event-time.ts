// Event times are US Eastern wall-clock values ("HH:mm") entered by admins.
// Event dates are stored as UTC midnight of the chosen calendar day, so they are formatted in UTC.
export const EVENT_TIME_ZONE_LABEL = "ET"
const DEFAULT_HOUR = 10
const DEFAULT_MINUTE = 0

function parseEventTime(time?: string | null): { hour: number; minute: number } | null {
  if (!time) return null
  const match = time.trim().match(/^(\d{1,2})[:.\s]?(\d{2})?\s*([ap]\.?m\.?)?$/i)
  if (!match) return null

  let hour = Number(match[1])
  const minute = match[2] ? Number(match[2]) : 0
  const meridiem = match[3]?.toLowerCase().replace(/\./g, "")

  if (meridiem) {
    if (hour < 1 || hour > 12) return null
    if (meridiem === "pm" && hour !== 12) hour += 12
    if (meridiem === "am" && hour === 12) hour = 0
  }
  if (hour > 23 || minute > 59) return null
  return { hour, minute }
}

export function formatEventTime(time?: string | null) {
  const { hour, minute } = parseEventTime(time) ?? { hour: DEFAULT_HOUR, minute: DEFAULT_MINUTE }
  const h12 = hour % 12 === 0 ? 12 : hour % 12
  return `${h12}:${String(minute).padStart(2, "0")} ${hour < 12 ? "AM" : "PM"} ${EVENT_TIME_ZONE_LABEL}`
}

// Local-midnight Date for the event's calendar day, for comparisons and calendar grids.
export function eventDay(date: string | Date) {
  const d = new Date(date)
  return new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate())
}

export function isPastEventDay(date: string | Date) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return eventDay(date) < today
}

export function formatEventDate(
  date: string | Date,
  options: Intl.DateTimeFormatOptions = { month: "long", day: "numeric", year: "numeric" },
) {
  const d = new Date(date)
  if (Number.isNaN(d.getTime())) return ""
  return d.toLocaleDateString("en-US", { ...options, timeZone: "UTC" })
}
