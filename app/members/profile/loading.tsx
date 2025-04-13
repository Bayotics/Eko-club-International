import { Loader2 } from "lucide-react"

export default function ProfileLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center pt-16">
      <div className="text-center">
        <Loader2 className="h-10 w-10 animate-spin text-[#C8A97E] mx-auto" />
        <h3 className="mt-4 text-lg font-medium text-gray-900">Loading profile...</h3>
        <p className="mt-2 text-sm text-gray-500">Please wait while we fetch your profile information.</p>
      </div>
    </div>
  )
}
