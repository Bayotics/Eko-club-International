import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-24 md:py-32">
      <div className="max-w-3xl mx-auto">
        <Skeleton className="h-10 w-3/4 mb-6" />
        <Skeleton className="h-6 w-full mb-10" />

        <div className="space-y-6">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-12 w-1/3" />
        </div>

        <div className="mt-10">
          <Skeleton className="h-8 w-full mb-4" />
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-4 w-1/2" />
              </div>
              <Skeleton className="h-8 w-24" />
            </div>
            <div className="flex items-center gap-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-4 w-1/2" />
              </div>
              <Skeleton className="h-8 w-24" />
            </div>
            <div className="flex items-center gap-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-4 w-1/2" />
              </div>
              <Skeleton className="h-8 w-24" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
