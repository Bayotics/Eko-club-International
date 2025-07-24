import { RefreshCw } from "lucide-react"

export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
        <p className="text-gray-600">Loading registrations...</p>
      </div>
    </div>
  )
}
