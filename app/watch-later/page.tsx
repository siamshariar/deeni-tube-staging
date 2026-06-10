"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Trash2, Search, X, MoreVertical, Clock, Play, Shuffle } from "lucide-react"
import AppHeader from "@/components/app-header"
import MobileNav from "@/components/mobile-nav"
import DesktopSidebar from "@/components/desktop-sidebar"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useMediaQuery } from "@/hooks/use-media-query"
import Image from "next/image"
import Link from "next/link"

const sampleVideos = [
  { id: "v1", title: "The Purpose of Life - Powerful Islamic Reminder", channel: "Daily Dawah", channelAvatar: "/placeholder.svg?height=32&width=32", views: "208K views", timeAgo: "6 days ago", duration: "18:28", thumbnail: "/placeholder.svg?height=480&width=854" },
  { id: "v2", title: "Tafsir of Surah Al-Fatiha - Complete Explanation", channel: "Islamic Guidance", channelAvatar: "/placeholder.svg?height=32&width=32", views: "150K views", timeAgo: "3 days ago", duration: "25:15", thumbnail: "/placeholder.svg?height=480&width=854" },
  { id: "v3", title: "How to Pray Salah - Step by Step Guide", channel: "Digital Mimbar", channelAvatar: "/placeholder.svg?height=32&width=32", views: "500K views", timeAgo: "1 week ago", duration: "12:40", thumbnail: "/placeholder.svg?height=480&width=854" },
  { id: "v4", title: "Stories of the Prophets - Full Series", channel: "Merciful Servant", channelAvatar: "/placeholder.svg?height=32&width=32", views: "1.2M views", timeAgo: "2 weeks ago", duration: "45:00", thumbnail: "/placeholder.svg?height=480&width=854" },
  { id: "v5", title: "Beautiful Quran Recitation - Emotional", channel: "Islamic Recitation", channelAvatar: "/placeholder.svg?height=32&width=32", views: "89K views", timeAgo: "3 weeks ago", duration: "15:20", thumbnail: "/placeholder.svg?height=480&width=854" },
  { id: "v6", title: "The Day of Judgment - Signs and Events", channel: "Peace TV", channelAvatar: "/placeholder.svg?height=32&width=32", views: "350K views", timeAgo: "1 month ago", duration: "32:10", thumbnail: "/placeholder.svg?height=480&width=854" },
  { id: "v7", title: "Powerful Dua for Protection and Guidance", channel: "Huda TV", channelAvatar: "/placeholder.svg?height=32&width=32", views: "420K views", timeAgo: "1 month ago", duration: "8:45", thumbnail: "/placeholder.svg?height=480&width=854" },
  { id: "v8", title: "Islamic Morning Routine - Start Your Day Right", channel: "Daily Dawah", channelAvatar: "/placeholder.svg?height=32&width=32", views: "180K views", timeAgo: "2 months ago", duration: "10:30", thumbnail: "/placeholder.svg?height=480&width=854" },
]

function VideoSkeleton() {
  return (
    <div className="flex gap-3 py-3">
      <Skeleton className="w-40 md:w-56 aspect-video rounded-lg flex-shrink-0" />
      <div className="flex-1 min-w-0 space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-3 w-32" />
      </div>
    </div>
  )
}

export default function WatchLaterPage() {
  const router = useRouter()
  const isMobile = useMediaQuery("(max-width: 768px)")
  const [videos, setVideos] = useState(sampleVideos)
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [showClearConfirm, setShowClearConfirm] = useState(false)
  const [removedVideos, setRemovedVideos] = useState<string[]>([])
  const [undoTimer, setUndoTimer] = useState<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600)
    return () => {
      clearTimeout(timer)
      if (undoTimer) clearTimeout(undoTimer)
    }
  }, [])

  const handleRemoveVideo = (videoId: string) => {
    const removedVideo = videos.find(v => v.id === videoId)
    if (!removedVideo) return

    setVideos(prev => prev.filter(v => v.id !== videoId))
    setRemovedVideos(prev => [...prev, videoId])

    if (undoTimer) clearTimeout(undoTimer)
    const timer = setTimeout(() => {
      setRemovedVideos(prev => prev.filter(id => id !== videoId))
    }, 5000)
    setUndoTimer(timer)
  }

  const handleUndo = (videoId: string) => {
    const removedVideo = sampleVideos.find(v => v.id === videoId)
    if (removedVideo) {
      setVideos(prev => [...prev, removedVideo])
    }
    setRemovedVideos(prev => prev.filter(id => id !== videoId))
    if (undoTimer) clearTimeout(undoTimer)
  }

  const handleClearAll = () => {
    setVideos([])
    setShowClearConfirm(false)
    setRemovedVideos([])
  }

  const handlePlayAll = () => {
    if (videos.length > 0) {
      router.push(`/videos/${videos[0].channel}/${videos[0].id}`)
    }
  }

  const handleShufflePlay = () => {
    if (videos.length > 0) {
      const randomIndex = Math.floor(Math.random() * videos.length)
      router.push(`/videos/${videos[randomIndex].channel}/${videos[randomIndex].id}`)
    }
  }

  const filteredVideos = videos.filter(video => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      video.title.toLowerCase().includes(query) ||
      video.channel.toLowerCase().includes(query)
    )
  })

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <div className="flex">
        <DesktopSidebar className="hidden md:block" />
        <div className="flex-1 md:pl-[240px] pt-[56px] md:pt-[80px] pb-nav-safe md:pb-6">
          {/* Mobile Header */}
          <div className="md:hidden flex items-center gap-3 px-4 py-3 border-b sticky top-[56px] bg-background z-10">
            <button onClick={() => router.back()} className="flex items-center justify-center h-9 w-9 rounded-full hover:bg-muted transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="font-semibold text-lg">Watch Later</h1>
          </div>

          <div className="max-w-[1096px] mx-auto px-4 md:px-6">
            {/* Header Section */}
            <div className="py-4 md:py-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                  {!isMobile && (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                        <Clock className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <h1 className="text-2xl font-bold">Watch Later</h1>
                        {!isLoading && videos.length > 0 && (
                          <p className="text-sm text-muted-foreground">
                            {videos.length} video{videos.length !== 1 ? 's' : ''}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                  {isMobile && !isLoading && videos.length > 0 && (
                    <span className="text-sm text-muted-foreground">
                      {videos.length} video{videos.length !== 1 ? 's' : ''}
                    </span>
                  )}
                </div>

                {videos.length > 0 && (
                  <div className="flex items-center gap-2">
                    <Button onClick={handlePlayAll} className="rounded-full gap-2" size="sm">
                      <Play className="h-4 w-4" /> Play all
                    </Button>
                    <Button onClick={handleShufflePlay} variant="outline" className="rounded-full gap-2" size="sm">
                      <Shuffle className="h-4 w-4" /> Shuffle
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Search and Clear */}
            {videos.length > 0 && (
              <div className="flex items-center gap-3 mb-6">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search Watch Later"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-muted/50 rounded-full text-sm outline-none focus:bg-muted transition-colors"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>

                {showClearConfirm ? (
                  <div className="flex items-center gap-2">
                    <Button variant="destructive" size="sm" onClick={handleClearAll} className="rounded-full">
                      Confirm remove all
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setShowClearConfirm(false)} className="rounded-full">
                      Cancel
                    </Button>
                  </div>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-destructive hover:text-destructive rounded-full flex-shrink-0"
                    onClick={() => setShowClearConfirm(true)}
                  >
                    <Trash2 className="h-4 w-4 mr-1.5" />
                    <span className="hidden sm:inline">Remove all</span>
                  </Button>
                )}
              </div>
            )}

            {/* Undo Snackbar */}
            {removedVideos.length > 0 && (
              <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-black/90 text-white px-4 py-3 rounded-full text-sm font-medium shadow-lg flex items-center gap-3 animate-fade-in-up">
                <span>Video removed from Watch Later</span>
                <button onClick={() => handleUndo(removedVideos[removedVideos.length - 1])} className="text-blue-400 hover:text-blue-300 font-medium">
                  Undo
                </button>
                <button onClick={() => setRemovedVideos([])} className="text-white/60 hover:text-white">
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* Content */}
            {isLoading ? (
              <div className="space-y-4">
                <VideoSkeleton />
                <VideoSkeleton />
                <VideoSkeleton />
                <VideoSkeleton />
                <VideoSkeleton />
              </div>
            ) : filteredVideos.length === 0 ? (
              <div className="text-center py-16">
                {searchQuery ? (
                  <>
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium mb-1">No results found</h3>
                    <p className="text-muted-foreground mb-4">Try different keywords</p>
                    <Button variant="outline" className="rounded-full" onClick={() => setSearchQuery("")}>
                      Clear search
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                      <Clock className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium mb-1">Watch Later is empty</h3>
                    <p className="text-muted-foreground mb-4">
                      Save videos to watch later by clicking the Save button on any video
                    </p>
                    <Button className="rounded-full" onClick={() => router.push('/')}>
                      Browse videos
                    </Button>
                  </>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredVideos.map((video) => (
                  <div key={video.id} className="flex gap-3 group">
                    {/* Thumbnail */}
                    <Link href={`/videos/${video.channel}/${video.id}`} className="relative w-40 md:w-56 aspect-video flex-shrink-0">
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

                    {/* Video Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <Link href={`/videos/${video.channel}/${video.id}`}>
                            <h3 className="font-medium text-sm md:text-base line-clamp-2 hover:text-primary transition-colors">
                              {video.title}
                            </h3>
                          </Link>
                          <div className="flex items-center gap-2 mt-1">
                            <Link href={`/channel/${video.channel}`} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
                              <Avatar className="h-5 w-5">
                                <AvatarImage src={video.channelAvatar} />
                                <AvatarFallback className="text-[10px]">{video.channel.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <span>{video.channel}</span>
                            </Link>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {video.views} • {video.timeAgo}
                          </p>
                        </div>

                        {/* Always visible 3-dot menu */}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="p-1.5 rounded-full hover:bg-muted transition-colors flex-shrink-0">
                              <MoreVertical className="h-4 w-4 text-muted-foreground" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuItem
                              className="py-3 cursor-pointer flex items-center gap-3"
                              onClick={() => router.push(`/videos/${video.channel}/${video.id}`)}
                            >
                              <Play className="h-4 w-4" />
                              <span>Play now</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="py-3 cursor-pointer flex items-center gap-3 text-destructive"
                              onClick={() => handleRemoveVideo(video.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                              <span>Remove from Watch Later</span>
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

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}