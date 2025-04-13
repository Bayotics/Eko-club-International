import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="container mx-auto px-4">
        {/* Hero Section Skeleton */}
        <div className="py-20 mb-16">
          <Skeleton className="h-12 w-64 mx-auto mb-4" />
          <Skeleton className="h-6 w-full max-w-lg mx-auto mb-6" />
          <Skeleton className="h-10 w-40 mx-auto" />
        </div>

        {/* Impact Section Skeleton */}
        <div className="mb-16">
          <Skeleton className="h-10 w-64 mx-auto mb-4" />
          <Skeleton className="h-6 w-full max-w-lg mx-auto mb-10" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-64 w-full rounded-lg" />
            ))}
          </div>
        </div>

        {/* Donation Form Skeleton */}
        <div className="mb-16">
          <Skeleton className="h-10 w-64 mx-auto mb-4" />
          <Skeleton className="h-6 w-full max-w-lg mx-auto mb-10" />
          <Skeleton className="h-96 w-full max-w-3xl mx-auto rounded-lg" />
        </div>
      </div>
    </div>
  )
}
