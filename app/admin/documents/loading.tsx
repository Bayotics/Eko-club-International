import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center pt-24">
      <Loader2 className="h-8 w-8 animate-spin text-[#C8A97E]" />
      <span className="ml-2 text-lg">Loading documents...</span>
    </div>
  )
}
