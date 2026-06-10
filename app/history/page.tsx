"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Trash2, Search, X, MoreVertical, History, Pause } from "lucide-react"
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
  { id: "v1", title: "The Purpose of Life - Powerful Islamic Reminder", channel: "Daily Dawah", channelAvatar: "/placeholder.svg?height=32&width=32", views: "208K views", timeAgo: "Today", duration: "18:28", thumbnail: "/placeholder.svg?height=480&width=854", watchedPercent: 75, watchedTimestamp: 831, videoUrl: "https://www.youtube.com/embed/5qap5aO4i9A?start=831" },
  { id: "v2", title: "Tafsir of Surah Al-Fatiha", channel: "Islamic Guidance", channelAvatar: "/placeholder.svg?height=32&width=32", views: "150K views", timeAgo: "Yesterday", duration: "25:15", thumbnail: "/placeholder.svg?height=480&width=854", watchedPercent: 100, watchedTimestamp: 1515, videoUrl: "https://www.youtube.com/embed/5qap5aO4i9A?start=1515" },
  { id: "v3", title: "How to Pray Salah - Complete Guide for Beginners", channel: "Digital Mimbar", channelAvatar: "/placeholder.svg?height=32&width=32", views: "500K views", timeAgo: "2 days ago", duration: "12:40", thumbnail: "/placeholder.svg?height=480&width=854", watchedPercent: 45, watchedTimestamp: 342, videoUrl: "https://www.youtube.com/embed/5qap5aO4i9A?start=342" },
  { id: "v4", title: "Stories of the Prophets - Full Series Compilation", channel: "Merciful Servant", channelAvatar: "/placeholder.svg?height=32&width=32", views: "1.2M views", timeAgo: "Last week", duration: "45:00", thumbnail: "/placeholder.svg?height=480&width=854", watchedPercent: 30, watchedTimestamp: 810, videoUrl: "https://www.youtube.com/embed/5qap5aO4i9A?start=810" },
  { id: "v5", title: "Beautiful Quran Recitation - Emotional", channel: "Islamic Recitation", channelAvatar: "/placeholder.svg?height=32&width=32", views: "89K views", timeAgo: "Last week", duration: "15:20", thumbnail: "/placeholder.svg?height=480&width=854", watchedPercent: 100, watchedTimestamp: 920, videoUrl: "https://www.youtube.com/embed/5qap5aO4i9A?start=920" },
  { id: "v6", title: "The Day of Judgment - Signs and Events", channel: "Peace TV", channelAvatar: "/placeholder.svg?height=32&width=32", views: "350K views", timeAgo: "2 weeks ago", duration: "32:10", thumbnail: "/placeholder.svg?height=480&width=854", watchedPercent: 90, watchedTimestamp: 1737, videoUrl: "https://www.youtube.com/embed/5qap5aO4i9A?start=1737" },
  { id: "v7", title: "Powerful Dua for Protection and Guidance", channel: "Huda TV", channelAvatar: "/placeholder.svg?height=32&width=32", views: "420K views", timeAgo: "2 weeks ago", duration: "8:45", thumbnail: "/placeholder.svg?height=480&width=854", watchedPercent: 60, watchedTimestamp: 315, videoUrl: "https://www.youtube.com/embed/5qap5aO4i9A?start=315" },
  { id: "v8", title: "Islamic Morning Routine - Start Your Day Right", channel: "Daily Dawah", channelAvatar: "/placeholder.svg?height=32&width=32", views: "180K views", timeAgo: "3 weeks ago", duration: "10:30", thumbnail: "/placeholder.svg?height=480&width=854", watchedPercent: 100, watchedTimestamp: 630, videoUrl: "https://www.youtube.com/embed/5qap5aO4i9A?start=630" },
]

// Save watch progress to localStorage
const saveWatchProgress = (videoId: string, progress: { watchedPercent: number; watchedTimestamp: number }) => {
  if (typeof window === 'undefined') return
  const watchData = JSON.parse(localStorage.getItem('watchProgress') || '{}')
  watchData[videoId] = progress
  localStorage.setItem('watchProgress', JSON.stringify(watchData))
}

// Load watch progress from localStorage
const loadWatchProgress = (videoId: string) => {
  if (typeof window === 'undefined') return null
  const watchData = JSON.parse(localStorage.getItem('watchProgress') || '{}')
  return watchData[videoId] || null
}

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

export default function HistoryPage() {
  const router = useRouter()
  const isMobile = useMediaQuery("(max-width: 768px)")
  const [videos, setVideos] = useState(sampleVideos)
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [showClearConfirm, setShowClearConfirm] = useState(false)

  // Load saved watch progress on mount
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800)
    
    // Update video data with saved watch progress
    setVideos(prev => prev.map(video => {
      const savedProgress = loadWatchProgress(video.id)
      if (savedProgress) {
        return {
          ...video,
          watchedPercent: savedProgress.watchedPercent,
          watchedTimestamp: savedProgress.watchedTimestamp,
        }
      }
      return video
    }))
    
    return () => clearTimeout(timer)
  }, [])

  const handleRemoveVideo = (videoId: string) => {
    setVideos(prev => prev.filter(v => v.id !== videoId))
    // Also remove watch progress
    if (typeof window !== 'undefined') {
      const watchData = JSON.parse(localStorage.getItem('watchProgress') || '{}')
      delete watchData[videoId]
      localStorage.setItem('watchProgress', JSON.stringify(watchData))
    }
  }

  const handleClearAll = () => {
    setVideos([])
    setShowClearConfirm(false)
    // Clear all watch progress
    if (typeof window !== 'undefined') {
      localStorage.removeItem('watchProgress')
    }
  }

  const handleVideoClick = (video: typeof sampleVideos[0]) => {
    // Save current watch position before navigating
    saveWatchProgress(video.id, {
      watchedPercent: video.watchedPercent,
      watchedTimestamp: video.watchedTimestamp,
    })
    
    // Navigate to video page with watch timestamp
    router.push(`/videos/${video.channel}/${video.id}?t=${video.watchedTimestamp}`)
  }

  // Simulate updating watch progress (in real app, this would come from the video player)
  const simulateWatchProgress = (videoId: string) => {
    setVideos(prev => prev.map(v => {
      if (v.id === videoId) {
        const newPercent = Math.min(100, v.watchedPercent + 10)
        const totalSeconds = parseDuration(v.duration)
        const newTimestamp = Math.floor((newPercent / 100) * totalSeconds)
        return { ...v, watchedPercent: newPercent, watchedTimestamp: newTimestamp }
      }
      return v
    }))
  }

  const parseDuration = (duration: string): number => {
    const parts = duration.split(':').map(Number)
    if (parts.length === 2) return parts[0] * 60 + parts[1]
    if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2]
    return 0
  }

  const filteredVideos = videos.filter(video => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      video.title.toLowerCase().includes(query) ||
      video.channel.toLowerCase().includes(query)
    )
  })

  // Group videos by date
  const groupedVideos = filteredVideos.reduce((groups, video) => {
    const date = video.timeAgo
    if (!groups[date]) groups[date] = []
    groups[date].push(video)
    return groups
  }, {} as Record<string, typeof filteredVideos>)

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
            <h1 className="font-semibold text-lg">History</h1>
          </div>

          <div className="max-w-[1096px] mx-auto px-4 md:px-6">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-4 md:py-6">
              <div className="flex items-center gap-3">
                {!isMobile && <h1 className="text-2xl font-bold">Watch History</h1>}
                {!isLoading && videos.length > 0 && (
                  <span className="text-sm text-muted-foreground">
                    {videos.length} video{videos.length !== 1 ? 's' : ''}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">
                {/* Search */}
                <div className="relative flex-1 sm:flex-none">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search watch history"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full sm:w-64 pl-10 pr-4 py-2 bg-muted/50 rounded-full text-sm outline-none focus:bg-muted transition-colors"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
                {/* Clear All Button */}
                {videos.length > 0 && (
                  <>
                    {showClearConfirm ? (
                      <div className="flex items-center gap-2">
                        <Button variant="destructive" size="sm" onClick={handleClearAll} className="rounded-full">
                          Confirm clear
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => setShowClearConfirm(false)} className="rounded-full">
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:text-destructive rounded-full"
                        onClick={() => setShowClearConfirm(true)}
                      >
                        <Trash2 className="h-4 w-4 mr-1.5" />
                        <span className="hidden sm:inline">Clear all watch history</span>
                        <span className="sm:hidden">Clear all</span>
                      </Button>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Content */}
            {isLoading ? (
              <div className="space-y-6">
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
                      <History className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium mb-1">Watch history is empty</h3>
                    <p className="text-muted-foreground">Videos you watch will appear here</p>
                  </>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                {Object.entries(groupedVideos).map(([date, dateVideos]) => (
                  <div key={date}>
                    <h2 className="text-sm font-semibold text-muted-foreground mb-3 px-1">{date}</h2>
                    <div className="space-y-4">
                      {dateVideos.map((video) => (
                        <div key={video.id} className="flex gap-3 group">
                          {/* Thumbnail - Click to play */}
                          <button
                            onClick={() => handleVideoClick(video)}
                            className="relative w-40 md:w-56 aspect-video flex-shrink-0"
                          >
                            <Image src={video.thumbnail} alt={video.title} fill className="object-cover rounded-xl" />
                            {/* Duration */}
                            <div className="absolute bottom-1.5 right-1.5 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded font-medium">
                              {video.duration}
                            </div>
                            {/* Watched progress bar */}
                            {video.watchedPercent < 100 && (
                              <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/30 rounded-full mx-1.5 mb-1.5 overflow-hidden">
                                <div 
                                  className="h-full bg-red-600 rounded-full" 
                                  style={{ width: `${video.watchedPercent}%` }} 
                                />
                              </div>
                            )}
                            {/* Watched overlay with resume indicator */}
                            {video.watchedPercent > 0 && video.watchedPercent < 100 && (
                              <div className="absolute inset-0 bg-black/10 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="bg-black/70 rounded-full p-2">
                                  <Pause className="h-5 w-5 text-white" />
                                </div>
                              </div>
                            )}
                          </button>

                          {/* Video Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <button onClick={() => handleVideoClick(video)} className="text-left w-full">
                                  <h3 className="font-medium text-sm md:text-base line-clamp-2 hover:text-primary transition-colors">
                                    {video.title}
                                  </h3>
                                </button>
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
                                {/* Watch progress indicator */}
                                {video.watchedPercent < 100 && (
                                  <div className="mt-1.5">
                                    <div className="flex items-center gap-2">
                                      <div className="flex-1 max-w-[120px] h-1 bg-muted rounded-full overflow-hidden">
                                        <div className="h-full bg-red-600 rounded-full" style={{ width: `${video.watchedPercent}%` }} />
                                      </div>
                                      <span className="text-xs text-muted-foreground">
                                        {video.watchedPercent}% watched
                                      </span>
                                    </div>
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                      Resume at {formatTimestamp(video.watchedTimestamp)}
                                    </p>
                                  </div>
                                )}
                              </div>

                              {/* Remove Button */}
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <button className="p-1.5 rounded-full hover:bg-muted transition-colors flex-shrink-0 opacity-0 group-hover:opacity-100">
                                    <MoreVertical className="h-4 w-4 text-muted-foreground" />
                                  </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56">
                                  <DropdownMenuItem 
                                    className="py-3 cursor-pointer flex items-center gap-3"
                                    onClick={() => handleVideoClick(video)}
                                  >
                                    <Pause className="h-4 w-4" />
                                    <span>Resume playback</span>
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    className="py-3 cursor-pointer flex items-center gap-3 text-destructive"
                                    onClick={() => handleRemoveVideo(video.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                    <span>Remove from watch history</span>
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>

                              {/* Mobile Remove Button */}
                              {isMobile && (
                                <button 
                                  onClick={() => handleRemoveVideo(video.id)}
                                  className="p-1.5 rounded-full hover:bg-muted transition-colors flex-shrink-0"
                                >
                                  <Trash2 className="h-4 w-4 text-destructive" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
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

// Helper function to format timestamp to MM:SS or HH:MM:SS
function formatTimestamp(seconds: number): string {
  if (!seconds || seconds <= 0) return "0:00"
  const hrs = Math.floor(seconds / 3600)
  const mins = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  if (hrs > 0) {
    return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  return `${mins}:${secs.toString().padStart(2, '0')}`
}