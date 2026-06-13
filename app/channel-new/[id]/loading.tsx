// /app/channel-new/[id]/loading.tsx

import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Simulate AppHeader (already visible) */}

      <div className="flex">
        <div className="hidden md:block w-[240px]" />
        <div className="flex-1 md:pl-[240px] pt-[56px] md:pt-[80px] pb-nav-safe">
          {/* Banner skeleton */}
          <div className="w-full aspect-[3/1] md:aspect-[6/1.5] bg-muted animate-pulse" />

          {/* Channel info skeleton */}
          <div className="px-4 py-4 border-b">
            <div className="flex items-start gap-4">
              <Skeleton className="h-16 w-16 md:h-20 md:w-20 rounded-full flex-shrink-0" />
              <div className="flex-1 min-w-0 space-y-2">
                <Skeleton className="h-7 w-48" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-full max-w-md" />
                <div className="flex gap-2 mt-4">
                  <Skeleton className="h-9 w-32 rounded-full" />
                  <Skeleton className="h-9 w-20 rounded-full" />
                </div>
              </div>
            </div>
          </div>

          {/* Tabs skeleton */}
          <div className="border-b px-4">
            <div className="flex gap-6 h-12 items-center">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-4 w-14" />
              <Skeleton className="h-4 w-10" />
            </div>
          </div>

          {/* Desktop video grid skeleton */}
          <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={`dsk-${i}`} className="flex flex-col">
                <Skeleton className="aspect-video w-full rounded-lg" />
                <div className="flex mt-2 gap-2">
                  <Skeleton className="h-9 w-9 rounded-full flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile horizontal video skeleton – exactly matches final VideoCard layout */}
          <div className="flex flex-col md:hidden px-4 pb-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={`mob-${i}`} className="flex gap-3 py-3 border-b last:border-0">
                {/* Thumbnail placeholder – matches w-40 aspect-video */}
                <Skeleton className="w-40 aspect-video rounded-lg flex-shrink-0" />
                <div className="flex-1 min-w-0 space-y-2">
                  {/* Title lines */}
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  {/* Channel row: avatar + name + views */}
                  <div className="flex items-center gap-2 mt-2">
                    <Skeleton className="h-4 w-4 rounded-full" />
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}