"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Search, X, MoreVertical, Play } from "lucide-react"
import AppHeader from "@/components/app-header"
import MobileNav from "@/components/mobile-nav"
import DesktopSidebar from "@/components/desktop-sidebar"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useMediaQuery } from "@/hooks/use-media-query"

const categoryData: Record<string, { name: string; description: string }> = {
  "aqeedah": { name: "Aqeedah", description: "Islamic Creed and Belief" },
  "fiqh": { name: "Fiqh", description: "Islamic Jurisprudence" },
  "hadith": { name: "Hadith", description: "Prophetic Traditions" },
  "tafsir": { name: "Tafsir", description: "Quranic Exegesis" },
  "seerah": { name: "Seerah", description: "Prophetic Biography" },
  "dawah": { name: "Dawah", description: "Islamic Propagation" },
  "family": { name: "Family", description: "Marriage and Family Life" },
  "finance": { name: "Finance", description: "Islamic Finance" },
  "youth": { name: "Youth", description: "Youth Development" },
  "spirituality": { name: "Spirituality", description: "Tazkiyah and Purification" },
  "quran": { name: "Quran", description: "Quran Recitation and Memorization" },
  "salah": { name: "Salah", description: "Prayer and Worship" },
}

const videos = [
  { id: "v1", title: "The Importance of Aqeedah in Islam", channel: "Islamic Guidance", channelAvatar: "/placeholder.svg?height=36&width=36", views: "150K views", timeAgo: "3 days ago", duration: "25:15", thumbnail: "/placeholder.svg?height=480&width=854" },
  { id: "v2", title: "Understanding Tawheed - Core Beliefs", channel: "Daily Dawah", channelAvatar: "/placeholder.svg?height=36&width=36", views: "208K views", timeAgo: "6 days ago", duration: "18:28", thumbnail: "/placeholder.svg?height=480&width=854" },
  { id: "v3", title: "Correct Islamic Creed - Aqeedah Series", channel: "Digital Mimbar", channelAvatar: "/placeholder.svg?height=36&width=36", views: "500K views", timeAgo: "1 week ago", duration: "35:10", thumbnail: "/placeholder.svg?height=480&width=854" },
  { id: "v4", title: "Foundations of Faith - Part 1", channel: "Islamic Guidance", channelAvatar: "/placeholder.svg?height=36&width=36", views: "1.2M views", timeAgo: "2 weeks ago", duration: "45:00", thumbnail: "/placeholder.svg?height=480&width=854" },
  { id: "v5", title: "Belief in Allah and His Attributes", channel: "Merciful Servant", channelAvatar: "/placeholder.svg?height=36&width=36", views: "89K views", timeAgo: "3 weeks ago", duration: "28:45", thumbnail: "/placeholder.svg?height=480&width=854" },
  { id: "v6", title: "The Six Pillars of Faith", channel: "Peace TV", channelAvatar: "/placeholder.svg?height=36&width=36", views: "320K views", timeAgo: "1 month ago", duration: "22:30", thumbnail: "/placeholder.svg?height=480&width=854" },
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

export default function CategoryVideosPage() {
  const router = useRouter()
  const params = useParams()
  const isMobile = useMediaQuery("(max-width: 768px)")
  const slug = params.slug as string
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  const category = categoryData[slug] || { name: slug?.replace(/-/g, ' ') || "Category", description: "" }

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600)
    return () => clearTimeout(timer)
  }, [slug])

  const filteredVideos = videos.filter(v =>
    !searchQuery || v.title.toLowerCase().includes(searchQuery.toLowerCase()) || v.channel.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      <div className="md:hidden flex items-center gap-3 px-4 py-3 border-b sticky top-[56px] bg-background z-10">
        <button onClick={() => router.back()} className="flex items-center justify-center h-9 w-9 rounded-full hover:bg-muted transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="font-semibold text-lg truncate">{category.name}</h1>
      </div>

      <div className="flex">
        <DesktopSidebar className="hidden md:block" />

        <div className="flex-1 md:pl-[240px] md:pt-[80px] pb-nav-safe">
          <div className="max-w-[1096px] mx-auto">
            {isLoading ? (
              <div className="px-4 md:px-6 py-4 md:py-6">
                <Skeleton className="h-7 w-36 mb-2" />
                <Skeleton className="h-4 w-64 mb-4" />
                <Skeleton className="h-10 w-full rounded-full mb-4" />
                <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {Array.from({ length: 6 }).map((_, i) => <VideoSkeleton key={i} />)}
                </div>
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="px-4 md:px-6 py-4 md:py-6">
                  <div className="hidden md:block mb-2">
                    <h1 className="text-2xl font-bold">{category.name}</h1>
                    <p className="text-sm text-muted-foreground mt-1">{category.description}</p>
                  </div>

                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder={`Search ${category.name} videos...`}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-10 h-10 text-sm rounded-full bg-muted/50"
                    />
                    {searchQuery && (
                      <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>

                  {/* Video Count */}
                  <p className="text-xs md:text-sm text-muted-foreground mt-3 md:mt-4">
                    {filteredVideos.length} video{filteredVideos.length !== 1 ? 's' : ''} in {category.name}
                  </p>
                </div>

                {/* Desktop Grid */}
                <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 px-4 md:px-6 pb-6">
                  {filteredVideos.map((video) => (
                    <div key={video.id} className="flex flex-col group">
                      <Link href={`/videos/${video.channel}/${video.id}`} className="relative aspect-video w-full">
                        <Image src={video.thumbnail} alt={video.title} fill className="object-cover rounded-xl" />
                        <div className="absolute bottom-1.5 right-1.5 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded font-medium">{video.duration}</div>
                        <div className="absolute inset-0 bg-black/20 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="bg-black/60 rounded-full p-2"><Play className="h-5 w-5 text-white fill-white" /></div>
                        </div>
                      </Link>
                      <div className="flex mt-3 gap-2">
                        <Link href={`/channel/${video.channel}`}>
                          <Avatar className="h-9 w-9 flex-shrink-0"><AvatarImage src={video.channelAvatar} /><AvatarFallback>{video.channel.charAt(0)}</AvatarFallback></Avatar>
                        </Link>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-1">
                            <Link href={`/videos/${video.channel}/${video.id}`}><h3 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">{video.title}</h3></Link>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <button className="p-1 rounded-full hover:bg-muted transition-colors flex-shrink-0 opacity-0 group-hover:opacity-100"><MoreVertical className="h-4 w-4 text-muted-foreground" /></button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuItem className="py-2.5 cursor-pointer flex items-center gap-2 text-sm" onClick={() => router.push(`/videos/${video.channel}/${video.id}`)}><Play className="h-4 w-4" /><span>Play now</span></DropdownMenuItem>
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

                {/* Mobile List */}
                <div className="flex flex-col md:hidden px-4 pb-6">
                  {filteredVideos.map((video) => (
                    <div key={video.id} className="flex gap-3 py-3 border-b last:border-0 group">
                      <Link href={`/videos/${video.channel}/${video.id}`} className="relative w-40 aspect-video flex-shrink-0">
                        <Image src={video.thumbnail} alt={video.title} fill className="object-cover rounded-lg" />
                        <div className="absolute bottom-1 right-1 bg-black/80 text-white text-[10px] px-1 py-0.5 rounded font-medium">{video.duration}</div>
                      </Link>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-1">
                          <div className="flex-1 min-w-0">
                            <Link href={`/videos/${video.channel}/${video.id}`}><h3 className="font-medium text-sm line-clamp-2">{video.title}</h3></Link>
                            <div className="flex items-center gap-1.5 mt-1">
                              <Avatar className="h-4 w-4"><AvatarImage src={video.channelAvatar} /><AvatarFallback className="text-[8px]">{video.channel.charAt(0)}</AvatarFallback></Avatar>
                              <span className="text-[11px] text-muted-foreground">{video.channel}</span>
                            </div>
                            <p className="text-[11px] text-muted-foreground mt-0.5">{video.views} • {video.timeAgo}</p>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button className="p-1 rounded-full hover:bg-muted transition-colors flex-shrink-0"><MoreVertical className="h-4 w-4 text-muted-foreground" /></button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuItem className="py-2.5 cursor-pointer flex items-center gap-2 text-sm" onClick={() => router.push(`/videos/${video.channel}/${video.id}`)}><Play className="h-4 w-4" /><span>Play now</span></DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <MobileNav />
    </div>
  )
}