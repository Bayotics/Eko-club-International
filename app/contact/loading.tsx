import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="pt-16 bg-white">
      {/* Hero Section Skeleton */}
      <div className="relative h-[50vh] md:h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Skeleton className="h-full w-full" />
        </div>
        <div className="container mx-auto px-4 relative z-10 text-center">
          <Skeleton className="h-12 w-48 mx-auto mb-4" />
          <Skeleton className="h-1 w-20 mx-auto mb-6" />
          <Skeleton className="h-6 w-full max-w-2xl mx-auto" />
        </div>
      </div>

      {/* Contact Form and Info Section Skeleton */}
      <div className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Form Skeleton */}
            <div className="bg-white p-6 md:p-8 rounded-lg shadow-lg">
              <Skeleton className="h-8 w-48 mb-6" />
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
              <div className="space-y-6">
                {[...Array(4)].map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            </div>

            {/* Contact Info Skeleton */}
            <div className="space-y-8">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-full" />
              <div className="space-y-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <Skeleton className="h-12 w-12 rounded-full" />
                    <div>
                      <Skeleton className="h-4 w-24 mb-2" />
                      <Skeleton className="h-4 w-48" />
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8 p-6 bg-gray-50 border border-gray-100 rounded-lg">
                <Skeleton className="h-4 w-32 mb-2" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Map Section Skeleton */}
      <div className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Skeleton className="h-8 w-48 mx-auto mb-4" />
            <Skeleton className="h-1 w-20 mx-auto mb-6" />
            <Skeleton className="h-4 w-full max-w-2xl mx-auto" />
          </div>
          <Skeleton className="h-[400px] md:h-[500px] w-full rounded-lg" />
        </div>
      </div>

      {/* FAQ Section Skeleton */}
      <div className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Skeleton className="h-8 w-64 mx-auto mb-4" />
            <Skeleton className="h-1 w-20 mx-auto mb-6" />
            <Skeleton className="h-4 w-full max-w-2xl mx-auto" />
          </div>
          <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-6">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="border-b border-gray-200 py-4">
                <Skeleton className="h-6 w-full mb-2" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Social Media Section Skeleton */}
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <Skeleton className="h-8 w-48 mx-auto mb-4" />
            <Skeleton className="h-1 w-20 mx-auto mb-6" />
            <Skeleton className="h-4 w-full max-w-2xl mx-auto" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex flex-col items-center justify-center p-6 bg-white rounded-lg shadow-md">
                <Skeleton className="h-14 w-14 rounded-full mb-4" />
                <Skeleton className="h-4 w-20" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action Skeleton */}
      <div className="py-16 bg-[#C8A97E]">
        <div className="container mx-auto px-4 text-center">
          <Skeleton className="h-8 w-64 mx-auto mb-6 bg-white/20" />
          <Skeleton className="h-4 w-full max-w-2xl mx-auto mb-8 bg-white/20" />
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Skeleton className="h-12 w-40 bg-white/20" />
            <Skeleton className="h-12 w-40 bg-white/20" />
          </div>
        </div>
      </div>
    </div>
  )
}
