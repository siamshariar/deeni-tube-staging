import { Skeleton } from "@/components/ui/skeleton"

function ChannelSkeleton() {
  return (
    <div className="flex items-start gap-4 pb-6 border-b border-gray-100">
      <Skeleton className="h-16 w-16 rounded-full flex-shrink-0" />
      <div className="flex-1 min-w-0 space-y-2">
        <Skeleton className="h-5 w-48" />
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-full" />
      </div>
      <Skeleton className="h-10 w-32 rounded-full flex-shrink-0" />
    </div>
  )
}

export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="h-[56px] border-b" />
      <div className="flex">
        <div className="hidden md:block w-[240px]" />
        <div className="flex-1 md:pl-[240px] md:pt-[80px]">
          <div className="max-w-[1096px] mx-auto p-4 md:p-6">
            <Skeleton className="h-8 w-48 mb-6" />
            <div className="flex items-center gap-3 mb-6">
              <Skeleton className="h-10 w-64 rounded-full" />
              <Skeleton className="h-10 w-24 rounded-full" />
            </div>
            <Skeleton className="h-4 w-32 mb-6" />
            <div className="space-y-6">
              <ChannelSkeleton />
              <ChannelSkeleton />
              <ChannelSkeleton />
              <ChannelSkeleton />
              <ChannelSkeleton />
              <ChannelSkeleton />
              <ChannelSkeleton />
              <ChannelSkeleton />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}