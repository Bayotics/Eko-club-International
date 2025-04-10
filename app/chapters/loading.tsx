import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="pt-24 pb-16">
      {/* Breadcrumb Skeleton */}
      <div className="bg-gray-50 dark:bg-gray-800 py-4 mb-8 mt-4">
        <div className="container mx-auto px-4">
          <Skeleton className="h-6 w-48" />
        </div>
      </div>

      {/* Hero Section Skeleton */}
      <div className="bg-gradient-to-r from-[#1a1a2e] to-[#16213e] text-white">
        <div className="container mx-auto px-4 py-16 md:py-24">
          <div className="max-w-3xl mx-auto text-center">
            <Skeleton className="h-12 w-3/4 mx-auto mb-6" />
            <Skeleton className="h-1 w-24 mx-auto mb-6" />
            <Skeleton className="h-20 w-full mx-auto mb-8" />
            <div className="flex flex-wrap justify-center gap-3">
              <Skeleton className="h-10 w-32 rounded-full" />
              <Skeleton className="h-10 w-32 rounded-full" />
              <Skeleton className="h-10 w-32 rounded-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Filter Section Skeleton */}
      <div className="py-12 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="mb-8 text-center">
            <Skeleton className="h-10 w-64 mx-auto mb-4" />
            <Skeleton className="h-1 w-24 mx-auto mb-6" />
            <Skeleton className="h-16 w-full max-w-2xl mx-auto" />
          </div>

          <div className="flex flex-wrap justify-center gap-3 mb-12">
            <Skeleton className="h-10 w-24 rounded-full" />
            <Skeleton className="h-10 w-24 rounded-full" />
            <Skeleton className="h-10 w-24 rounded-full" />
            <Skeleton className="h-10 w-24 rounded-full" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array(8)
              .fill(0)
              .map((_, i) => (
                <Skeleton key={i} className="h-64 rounded-lg" />
              ))}
          </div>
        </div>
      </div>

      {/* Chapter Presidents Section Skeleton */}
      <div className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Skeleton className="h-10 w-64 mx-auto mb-4" />
            <Skeleton className="h-1 w-24 mx-auto mb-6" />
            <Skeleton className="h-16 w-full max-w-2xl mx-auto" />
          </div>

          <div className="relative max-w-5xl mx-auto">
            <div className="flex gap-4 overflow-hidden">
              {Array(3)
                .fill(0)
                .map((_, i) => (
                  <Skeleton key={i} className="h-64 w-full max-w-xs flex-shrink-0 rounded-lg" />
                ))}
            </div>
            <div className="flex justify-center mt-8 gap-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-10 w-10 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
