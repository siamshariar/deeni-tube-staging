"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Music, MoreVertical, Play, ChevronLeft, ChevronRight } from "lucide-react"
import AppHeader from "@/components/app-header"
import MobileNav from "@/components/mobile-nav"
import DesktopSidebar from "@/components/desktop-sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useMediaQuery } from "@/hooks/use-media-query"
import Image from "next/image"
import Link from "next/link"

const musicVideos = [
  { id: "m1", title: "Beautiful Nasheed Collection 2024 - No Music", channel: "Islamic Nasheed", channelAvatar: "/placeholder.svg?height=36&width=36", views: "1.2M views", timeAgo: "1 month ago", duration: "45:20", thumbnail: "/placeholder.svg?height=480&width=854" },
  { id: "m2", title: "Morning Nasheed - Start Your Day with Peace", channel: "Nasheed Vibes", channelAvatar: "/placeholder.svg?height=36&width=36", views: "890K views", timeAgo: "2 months ago", duration: "32:15", thumbnail: "/placeholder.svg?height=480&width=854" },
  { id: "m3", title: "Labbaik Allahuma Labbaik - Hajj Nasheed", channel: "Islamic Sounds", channelAvatar: "/placeholder.svg?height=36&width=36", views: "2.1M views", timeAgo: "3 months ago", duration: "12:40", thumbnail: "/placeholder.svg?height=480&width=854" },
  { id: "m4", title: "Ramadan Nasheed Playlist - 1 Hour", channel: "Deen Records", channelAvatar: "/placeholder.svg?height=36&width=36", views: "3.5M views", timeAgo: "4 months ago", duration: "1:05:00", thumbnail: "/placeholder.svg?height=480&width=854" },
  { id: "m5", title: "Ya Nabi Salam Alayka - Arabic Nasheed", channel: "Awakening Music", channelAvatar: "/placeholder.svg?height=36&width=36", views: "5.2M views", timeAgo: "6 months ago", duration: "8:30", thumbnail: "/placeholder.svg?height=480&width=854" },
  { id: "m6", title: "The 99 Names of Allah - Nasheed", channel: "Islamic Nasheed", channelAvatar: "/placeholder.svg?height=36&width=36", views: "4.1M views", timeAgo: "8 months ago", duration: "18:45", thumbnail: "/placeholder.svg?height=480&width=854" },
  { id: "m7", title: "Hasbi Rabbi Jallallah - Beautiful Nasheed", channel: "Nasheed Vibes", channelAvatar: "/placeholder.svg?height=36&width=36", views: "6.8M views", timeAgo: "1 year ago", duration: "15:20", thumbnail: "/placeholder.svg?height=480&width=854" },
  { id: "m8", title: "Qasida Burda Shareef - Full", channel: "Islamic Sounds", channelAvatar: "/placeholder.svg?height=36&width=36", views: "2.3M views", timeAgo: "1 year ago", duration: "55:10", thumbnail: "/placeholder.svg?height=480&width=854" },
]

const musicCategories = [
  "All", "Nasheed", "Quran Recitation", "Dua", "Lectures", "Adhan", "Poetry"
]

function VideoSkeleton() {
  return (
    <div className="flex flex-col">
      <Skeleton className="aspect-video w-full rounded-xl" />
      <div className="flex mt-2 gap-2">
        <Skeleton className="h-9 w-9 rounded-full flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-3 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
    </div>
  )
}

function VideoSkeletonHorizontal() {
  return (
    <div className="flex gap-3 py-3">
      <Skeleton className="w-40 aspect-video rounded-lg flex-shrink-0" />
      <div className="flex-1 min-w-0 space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-3 w-32" />
      </div>
    </div>
  )
}

export default function MusicPage() {
  const router = useRouter()
  const isMobile = useMediaQuery("(max-width: 768px)")
  const [activeCategory, setActiveCategory] = useState("All")
  const [isLoading, setIsLoading] = useState(true)
  const chipScrollRef = useRef<HTMLDivElement>(null)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600)
    return () => clearTimeout(timer)
  }, [])

  const updateArrows = useCallback(() => {
    const el = chipScrollRef.current
    if (!el) return
    const hasScroll = el.scrollWidth > el.clientWidth + 2
    setShowLeftArrow(hasScroll && el.scrollLeft > 8)
    setShowRightArrow(hasScroll && el.scrollLeft < el.scrollWidth - el.clientWidth - 8)
  }, [])

  useEffect(() => {
    const el = chipScrollRef.current
    if (!el) return
    el.addEventListener('scroll', updateArrows, { passive: true })
    window.addEventListener('resize', updateArrows)
    updateArrows()
    const t1 = setTimeout(updateArrows, 0)
    const t2 = setTimeout(updateArrows, 100)
    const t3 = setTimeout(updateArrows, 500)
    return () => {
      el.removeEventListener('scroll', updateArrows)
      window.removeEventListener('resize', updateArrows)
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }, [updateArrows])

  const scrollChips = (direction: 'left' | 'right') => {
    const el = chipScrollRef.current
    if (!el) return
    const amount = el.clientWidth * 0.7
    el.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <div className="flex">
        <DesktopSidebar className="hidden md:block" />
        <div className="flex-1 md:pl-[240px] pt-[56px] md:pt-[80px] pb-nav-safe md:pb-6">
          {/* Mobile Header */}
          <div className="md:hidden flex items-center gap-2 px-3 py-2.5 border-b sticky top-[56px] bg-background z-20">
            <button onClick={() => router.back()} className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full hover:bg-muted transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-1.5">
              <Music className="h-5 w-5 text-primary" />
              <h1 className="font-semibold text-base">Nasheed & Music</h1>
            </div>
          </div>

          <div className="max-w-[1096px] mx-auto px-3 md:px-6">
            {/* Desktop Header */}
            <div className="hidden md:flex items-center gap-3 py-4 md:py-6">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Music className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Nasheed & Islamic Music</h1>
                <p className="text-sm text-muted-foreground">Beautiful Islamic nasheeds and devotional music</p>
              </div>
            </div>

            {/* Category Pills - Scrollable */}
            <div className="relative py-2 md:py-3 mb-3 md:mb-4">
              {/* Left Arrow */}
              <div className={`absolute left-0 top-0 bottom-0 z-10 flex items-center transition-opacity duration-200 ${showLeftArrow ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                <div className="absolute left-0 top-0 bottom-0 w-10 bg-gradient-to-r from-background to-transparent" />
                <button onClick={() => scrollChips('left')} className="relative ml-0.5 h-8 w-8 rounded-full bg-background border shadow-md flex items-center justify-center hover:bg-muted transition-colors">
                  <ChevronLeft className="h-4 w-4" />
                </button>
              </div>

              {/* Right Arrow */}
              <div className={`absolute right-0 top-0 bottom-0 z-10 flex items-center transition-opacity duration-200 ${showRightArrow ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                <div className="absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-background to-transparent" />
                <button onClick={() => scrollChips('right')} className="relative mr-0.5 h-8 w-8 rounded-full bg-background border shadow-md flex items-center justify-center hover:bg-muted transition-colors">
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>

              <div ref={chipScrollRef} className="overflow-x-auto scrollbar-none" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}>
                <div className="flex gap-2 px-8 w-max">
                  {musicCategories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setActiveCategory(category)}
                      className={`px-3.5 py-1.5 md:py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                        activeCategory === category
                          ? "bg-foreground text-background"
                          : "bg-muted hover:bg-muted/80 text-foreground"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Video Count */}
            {!isLoading && (
              <p className="text-xs md:text-sm text-muted-foreground mb-3 md:mb-4">
                {musicVideos.length} videos
              </p>
            )}

            {/* Desktop Grid Layout */}
            {isLoading ? (
              <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <VideoSkeleton key={i} />
                ))}
              </div>
            ) : (
              <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-6">
                {musicVideos.map((video) => (
                  <div key={video.id} className="flex flex-col group">
                    <Link href={`/videos/${video.channel}/${video.id}`} className="relative aspect-video w-full">
                      <Image src={video.thumbnail} alt={video.title} fill className="object-cover rounded-xl" />
                      <div className="absolute bottom-1.5 right-1.5 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded font-medium">
                        {video.duration}
                      </div>
                      <div className="absolute inset-0 bg-black/20 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="bg-black/60 rounded-full p-2">
                          <Play className="h-5 w-5 text-white fill-white" />
                        </div>
                      </div>
                    </Link>
                    <div className="flex mt-3 gap-2">
                      <Link href={`/channel/${video.channel}`}>
                        <Avatar className="h-9 w-9 flex-shrink-0">
                          <AvatarImage src={video.channelAvatar} />
                          <AvatarFallback>{video.channel.charAt(0)}</AvatarFallback>
                        </Avatar>
                      </Link>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-1">
                          <Link href={`/videos/${video.channel}/${video.id}`}>
                            <h3 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
                              {video.title}
                            </h3>
                          </Link>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button className="p-1 rounded-full hover:bg-muted transition-colors flex-shrink-0 opacity-0 group-hover:opacity-100">
                                <MoreVertical className="h-4 w-4 text-muted-foreground" />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuItem className="py-2.5 cursor-pointer flex items-center gap-2 text-sm" onClick={() => router.push(`/videos/${video.channel}/${video.id}`)}>
                                <Play className="h-4 w-4" /><span>Play now</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem className="py-2.5 cursor-pointer flex items-center gap-2 text-sm">
                                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>
                                <span>Save to Watch Later</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{video.channel}</p>
                        <p className="text-xs text-muted-foreground">{video.views} • {video.timeAgo}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Mobile List Layout */}
            {isLoading ? (
              <div className="flex flex-col md:hidden pb-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <VideoSkeletonHorizontal key={i} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col md:hidden pb-6">
                {musicVideos.map((video) => (
                  <div key={video.id} className="flex gap-3 py-3 border-b last:border-0 group">
                    <Link href={`/videos/${video.channel}/${video.id}`} className="relative w-40 aspect-video flex-shrink-0">
                      <Image src={video.thumbnail} alt={video.title} fill className="object-cover rounded-lg" />
                      <div className="absolute bottom-1 right-1 bg-black/80 text-white text-[10px] px-1 py-0.5 rounded font-medium">
                        {video.duration}
                      </div>
                    </Link>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-1">
                        <div className="flex-1 min-w-0">
                          <Link href={`/videos/${video.channel}/${video.id}`}>
                            <h3 className="font-medium text-sm line-clamp-2">{video.title}</h3>
                          </Link>
                          <div className="flex items-center gap-1.5 mt-1">
                            <Avatar className="h-4 w-4">
                              <AvatarImage src={video.channelAvatar} />
                              <AvatarFallback className="text-[8px]">{video.channel.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="text-[11px] text-muted-foreground">{video.channel}</span>
                          </div>
                          <p className="text-[11px] text-muted-foreground mt-0.5">{video.views} • {video.timeAgo}</p>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="p-1 rounded-full hover:bg-muted transition-colors flex-shrink-0">
                              <MoreVertical className="h-4 w-4 text-muted-foreground" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem className="py-2.5 cursor-pointer flex items-center gap-2 text-sm" onClick={() => router.push(`/videos/${video.channel}/${video.id}`)}>
                              <Play className="h-4 w-4" /><span>Play now</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="py-2.5 cursor-pointer flex items-center gap-2 text-sm">
                              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>
                              <span>Save to Watch Later</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
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