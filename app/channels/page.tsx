"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Search, X, Tv } from "lucide-react"
import AppHeader from "@/components/app-header"
import MobileNav from "@/components/mobile-nav"
import DesktopSidebar from "@/components/desktop-sidebar"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useMediaQuery } from "@/hooks/use-media-query"
import { cn } from "@/lib/utils"
import Link from "next/link"

const channels = [
  { id: "1", name: "Islamic Guidance", slug: "islamic-guidance", avatar: "/medical-professional-profile.png", subscribers: "2.5M subscribers", verified: true },
  { id: "2", name: "Merciful Servant", slug: "merciful-servant", avatar: "/placeholder.svg?height=48&width=48", subscribers: "1.8M subscribers", verified: true },
  { id: "3", name: "Digital Mimbar", slug: "digital-mimbar", avatar: "/placeholder.svg?height=48&width=48", subscribers: "950K subscribers", verified: true },
  { id: "4", name: "Huda TV", slug: "huda-tv", avatar: "/placeholder.svg?height=48&width=48", subscribers: "3.2M subscribers", verified: true },
  { id: "5", name: "Peace TV", slug: "peace-tv", avatar: "/placeholder.svg?height=48&width=48", subscribers: "5.1M subscribers", verified: true },
  { id: "6", name: "One Islam Productions", slug: "one-islam", avatar: "/placeholder.svg?height=48&width=48", subscribers: "2.1M subscribers", verified: false },
  { id: "7", name: "Daily Dawah", slug: "daily-dawah", avatar: "/placeholder.svg?height=48&width=48", subscribers: "780K subscribers", verified: false },
  { id: "8", name: "The Deen Show", slug: "deen-show", avatar: "/placeholder.svg?height=48&width=48", subscribers: "450K subscribers", verified: false },
  { id: "9", name: "IlmFeed", slug: "ilmfeed", avatar: "/placeholder.svg?height=48&width=48", subscribers: "620K subscribers", verified: true },
  { id: "10", name: "Islam Channel", slug: "islam-channel", avatar: "/placeholder.svg?height=48&width=48", subscribers: "1.2M subscribers", verified: true },
  { id: "11", name: "Eman Channel", slug: "eman-channel", avatar: "/placeholder.svg?height=48&width=48", subscribers: "340K subscribers", verified: false },
  { id: "12", name: "Quran Weekly", slug: "quran-weekly", avatar: "/placeholder.svg?height=48&width=48", subscribers: "890K subscribers", verified: true },
]

function VerifiedIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={cn("w-4 h-4 text-gray-500", className)}>
      <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
    </svg>
  )
}

function ChannelSkeleton() {
  return (
    <div className="flex items-center gap-4 px-2 py-3">
      <Skeleton className="h-14 w-14 md:h-16 md:w-16 rounded-full flex-shrink-0" />
      <div className="flex-1 min-w-0 space-y-2">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-3 w-24" />
      </div>
      <Skeleton className="h-9 w-24 rounded-full flex-shrink-0" />
    </div>
  )
}

export default function ChannelsPage() {
  const router = useRouter()
  const isMobile = useMediaQuery("(max-width: 768px)")
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [subscribeState, setSubscribeState] = useState<Record<string, boolean>>({})

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600)
    return () => clearTimeout(timer)
  }, [])

  const toggleSubscribe = (id: string) => {
    setSubscribeState(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const filteredChannels = channels.filter(ch => {
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    return ch.name.toLowerCase().includes(q) || ch.subscribers.toLowerCase().includes(q)
  })

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <div className="flex">
        <DesktopSidebar className="hidden md:block" />
        <div className="flex-1 md:pl-[240px] pt-[56px] md:pt-[80px] pb-nav-safe md:pb-6">
          <div className="md:hidden flex items-center gap-3 px-4 py-3 border-b sticky top-[56px] bg-background z-10">
            <button onClick={() => router.back()} className="flex items-center justify-center h-9 w-9 rounded-full hover:bg-muted transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="font-semibold text-lg">Channels</h1>
          </div>

          <div className="max-w-[800px] mx-auto px-4 md:px-6">
            <div className="py-4 md:py-6">
              {!isMobile && (
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                    <Tv className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold">Channels</h1>
                    <p className="text-sm text-muted-foreground">Manage your channel preferences</p>
                  </div>
                </div>
              )}

              {/* Search */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search channels"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-muted/50 rounded-full text-sm outline-none focus:bg-muted transition-colors"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            {isLoading ? (
              <div className="divide-y">
                <ChannelSkeleton /><ChannelSkeleton /><ChannelSkeleton />
                <ChannelSkeleton /><ChannelSkeleton /><ChannelSkeleton />
              </div>
            ) : filteredChannels.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Tv className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-1">No channels found</h3>
                <p className="text-muted-foreground">Try different keywords</p>
              </div>
            ) : (
              <div className="divide-y">
                {filteredChannels.map((channel) => (
                  <div key={channel.id} className="flex items-center gap-3 md:gap-4 px-2 py-3 hover:bg-muted/50 transition-colors">
                    <Link href={`/channel-new/${channel.slug}`} className="flex-shrink-0">
                      <Avatar className="h-12 w-12 md:h-14 md:w-14">
                        <AvatarImage src={channel.avatar} />
                        <AvatarFallback>{channel.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link href={`/channel-new/${channel.slug}`} className="hover:underline">
                        <div className="flex items-center gap-1">
                          <h3 className="font-medium text-sm md:text-base truncate">{channel.name}</h3>
                          {channel.verified && <VerifiedIcon />}
                        </div>
                      </Link>
                      <p className="text-xs md:text-sm text-muted-foreground">{channel.subscribers}</p>
                    </div>
                    <Button
                      onClick={() => toggleSubscribe(channel.id)}
                      variant={subscribeState[channel.id] ? "outline" : "default"}
                      size="sm"
                      className={cn(
                        "rounded-full flex-shrink-0",
                        subscribeState[channel.id]
                          ? "bg-muted hover:bg-muted/80 text-foreground"
                          : "bg-foreground text-background hover:bg-foreground/90"
                      )}
                    >
                      {subscribeState[channel.id] ? 'Subscribed' : 'Subscribe'}
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <MobileNav />
    </div>
  )
}