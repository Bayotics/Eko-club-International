import { Skeleton } from "@/components/ui/skeleton"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export default function EventDetailLoading() {
  return (
    <div className="pt-20">
      {/* Breadcrumb */}
      <div className="bg-gradient-to-r from-[#f8f9fa] to-[#e9ecef] py-5">
        <div className="container mx-auto px-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/events">Events</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <Skeleton className="h-4 w-24" />
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Skeleton className="h-8 w-32 mb-6" />

            <div className="mb-8">
              <Skeleton className="h-[400px] w-full mb-6 rounded-lg" />

              <Skeleton className="h-10 w-3/4 mb-4" />
              <Skeleton className="h-6 w-24 mb-6" />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <Skeleton className="h-20 w-full rounded-lg" />
                <Skeleton className="h-20 w-full rounded-lg" />
                <Skeleton className="h-20 w-full rounded-lg" />
              </div>

              <Skeleton className="h-8 w-48 mb-4" />
              <div className="space-y-3 mb-8">
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-5 w-3/4" />
              </div>

              <Skeleton className="h-8 w-48 mb-4" />
              <Skeleton className="h-5 w-full mb-2" />
              <Skeleton className="h-5 w-1/2" />
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="mb-8">
              <Skeleton className="h-[300px] w-full rounded-lg mb-6" />
              <Skeleton className="h-10 w-full" />
            </div>

            <Skeleton className="h-[200px] w-full rounded-lg" />
          </div>
        </div>

        {/* Related Events */}
        <div className="mt-12">
          <Skeleton className="h-8 w-64 mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Skeleton className="h-[280px] w-full rounded-lg" />
            <Skeleton className="h-[280px] w-full rounded-lg" />
            <Skeleton className="h-[280px] w-full rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  )
}
