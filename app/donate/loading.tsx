import { Skeleton } from "@/components/ui/skeleton"

export default function DonateLoading() {
  return (
    <div className="min-h-screen bg-white pt-16">
      {/* Breadcrumb Skeleton */}
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      </div>

      {/* Hero Section Skeleton */}
      <div className="py-20 bg-gradient-to-r from-gray-900 to-gray-800">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Skeleton className="h-12 w-3/4 mx-auto mb-6" />
            <Skeleton className="h-6 w-full mx-auto mb-4" />
            <Skeleton className="h-6 w-5/6 mx-auto mb-8" />
            <div className="flex justify-center gap-4">
              <Skeleton className="h-12 w-32" />
              <Skeleton className="h-12 w-32" />
            </div>
          </div>
        </div>
      </div>

      {/* Impact Section Skeleton */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Skeleton className="h-10 w-64 mx-auto mb-4" />
            <div className="w-20 h-1 bg-gray-200 mx-auto mb-6"></div>
            <Skeleton className="h-6 w-full max-w-3xl mx-auto" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {Array(4)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-md p-6 border border-gray-100">
                  <Skeleton className="h-16 w-16 rounded-full mb-4" />
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Form Section Skeleton */}
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <Skeleton className="h-10 w-64 mx-auto mb-4" />
            <div className="w-20 h-1 bg-gray-200 mx-auto mb-6"></div>
            <Skeleton className="h-6 w-full max-w-3xl mx-auto" />
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="space-y-8">
                <div>
                  <Skeleton className="h-6 w-40 mb-4" />
                  <div className="flex gap-4">
                    <Skeleton className="h-14 w-full" />
                    <Skeleton className="h-14 w-full" />
                  </div>
                </div>

                <div>
                  <Skeleton className="h-6 w-40 mb-4" />
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {Array(6)
                      .fill(0)
                      .map((_, i) => (
                        <Skeleton key={i} className="h-14" />
                      ))}
                  </div>
                </div>

                <div>
                  <Skeleton className="h-6 w-40 mb-4" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Array(4)
                      .fill(0)
                      .map((_, i) => (
                        <div key={i}>
                          <Skeleton className="h-5 w-24 mb-2" />
                          <Skeleton className="h-10 w-full" />
                        </div>
                      ))}
                  </div>
                </div>

                <Skeleton className="h-14 w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
