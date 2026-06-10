"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Flame, Play, MoreVertical } from "lucide-react"
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

const trendingVideos = [
  { id: "t1", title: "The Purpose of Life - Powerful Islamic Reminder", channel: "Daily Dawah", channelAvatar: "/placeholder.svg?height=36&width=36", views: "2.8M views", timeAgo: "1 day ago", duration: "18:28", thumbnail: "/placeholder.svg?height=480&width=854", rank: 1, description: "A powerful reminder about the true purpose of life from an Islamic perspective." },
  { id: "t2", title: "Surah Al Baqarah - Beautiful Recitation That Touches The Heart", channel: "Islamic Recitation", channelAvatar: "/placeholder.svg?height=36&width=36", views: "1.5M views", timeAgo: "2 days ago", duration: "2:45:00", thumbnail: "/placeholder.svg?height=480&width=854", rank: 2, description: "Experience the beautiful recitation of Surah Al Baqarah." },
  { id: "t3", title: "Tafsir of Surah Al-Fatiha - Complete Explanation", channel: "Islamic Guidance", channelAvatar: "/placeholder.svg?height=36&width=36", views: "980K views", timeAgo: "3 days ago", duration: "25:15", thumbnail: "/placeholder.svg?height=480&width=854", rank: 3, description: "Complete tafsir of Surah Al-Fatiha with detailed explanations." },
  { id: "t4", title: "How to Pray Salah - Step by Step Guide for Beginners", channel: "Digital Mimbar", channelAvatar: "/placeholder.svg?height=36&width=36", views: "750K views", timeAgo: "4 days ago", duration: "12:40", thumbnail: "/placeholder.svg?height=480&width=854", rank: 4, description: "Learn how to pray salah correctly with this step by step guide." },
  { id: "t5", title: "Stories of the Prophets - Prophet Musa (AS) Full Movie", channel: "Merciful Servant", channelAvatar: "/placeholder.svg?height=36&width=36", views: "620K views", timeAgo: "5 days ago", duration: "45:00", thumbnail: "/placeholder.svg?height=480&width=854", rank: 5, description: "The complete story of Prophet Musa (AS) from the Quran." },
  { id: "t6", title: "Morning Azkar - Start Your Day with Blessings", channel: "The Daily Reminder", channelAvatar: "/placeholder.svg?height=36&width=36", views: "550K views", timeAgo: "6 days ago", duration: "15:30", thumbnail: "/placeholder.svg?height=480&width=854", rank: 6, description: "Start your day with these powerful morning azkar and duas." },
  { id: "t7", title: "The Day of Judgment - Signs and Events Explained", channel: "Islamic Guidance", channelAvatar: "/placeholder.svg?height=36&width=36", views: "480K views", timeAgo: "1 week ago", duration: "32:10", thumbnail: "/placeholder.svg?height=480&width=854", rank: 7, description: "An in-depth look at the signs of the Day of Judgment." },
  { id: "t8", title: "Ramadan Preparation Guide 2026 - Complete Plan", channel: "Peace TV", channelAvatar: "/placeholder.svg?height=36&width=36", views: "420K views", timeAgo: "1 week ago", duration: "20:45", thumbnail: "/placeholder.svg?height=480&width=854", rank: 8, description: "Get ready for Ramadan with this complete preparation guide." },
  { id: "t9", title: "Powerful Dua for Protection and Success", channel: "Huda TV", channelAvatar: "/placeholder.svg?height=36&width=36", views: "380K views", timeAgo: "1 week ago", duration: "8:45", thumbnail: "/placeholder.svg?height=480&width=854", rank: 9, description: "A collection of powerful duas for protection and success." },
  { id: "t10", title: "Islamic Finance 101 - Halal Investing Guide", channel: "Islamic Finance Channel", channelAvatar: "/placeholder.svg?height=36&width=36", views: "320K views", timeAgo: "2 weeks ago", duration: "28:00", thumbnail: "/placeholder.svg?height=480&width=854", rank: 10, description: "Learn the basics of Islamic finance and halal investing." },
]

function VideoSkeleton() {
  return (
    <div className="flex gap-3 md:gap-4 py-3">
      <Skeleton className="w-8 h-8 flex-shrink-0" />
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

export default function TrendingPage() {
  const router = useRouter()
  const isMobile = useMediaQuery("(max-width: 768px)")
  const [isLoading, setIsLoading] = useState(true)
  const [videos, setVideos] = useState(trendingVideos)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

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
            <h1 className="font-semibold text-lg">Trending</h1>
          </div>

          <div className="max-w-[1096px] mx-auto px-4 md:px-6">
            {/* Header */}
            <div className="py-4 md:py-6">
              <div className="flex items-center gap-3">
                {!isMobile && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center">
                      <Flame className="h-5 w-5 text-red-500" />
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold">Trending</h1>
                      <p className="text-sm text-muted-foreground">What's popular right now</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Content */}
            {isLoading ? (
              <div className="space-y-1">
                <VideoSkeleton />
                <VideoSkeleton />
                <VideoSkeleton />
                <VideoSkeleton />
                <VideoSkeleton />
                <VideoSkeleton />
                <VideoSkeleton />
              </div>
            ) : videos.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Flame className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-1">No trending videos</h3>
                <p className="text-muted-foreground">Check back later for trending content</p>
              </div>
            ) : (
              <div className="space-y-1">
                {videos.map((video) => (
                  <div key={video.id} className="flex gap-3 md:gap-4 py-3 group hover:bg-muted/30 rounded-xl px-2 transition-colors">
                    {/* Rank Number */}
                    <div className="flex items-center justify-center w-8 flex-shrink-0">
                      <span className={`text-xl md:text-2xl font-bold ${
                        video.rank <= 3 ? 'text-primary' : 'text-muted-foreground/50'
                      }`}>
                        {video.rank}
                      </span>
                    </div>

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
                      {/* Rank badge on thumbnail for top 3 */}
                      {video.rank <= 3 && (
                        <div className="absolute top-1.5 left-1.5 bg-primary text-primary-foreground text-xs font-bold px-2 py-0.5 rounded-full">
                          #{video.rank}
                        </div>
                      )}
                    </Link>

                    {/* Video Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <Link href={`/videos/${video.channel}/${video.id}`}>
                            <h3 className="font-medium text-sm md:text-base line-clamp-2 group-hover:text-primary transition-colors">
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
                            <span className="text-xs text-muted-foreground">• Verified</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {video.views} • {video.timeAgo}
                          </p>
                          {!isMobile && video.description && (
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{video.description}</p>
                          )}
                          {/* View count bar for visual */}
                          <div className="hidden md:block mt-2 max-w-[200px] h-1 bg-muted rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-primary/50 rounded-full" 
                              style={{ width: `${Math.max(10, 100 - (video.rank * 10))}%` }} 
                            />
                          </div>
                        </div>

                        {/* Actions */}
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
                            <DropdownMenuItem className="py-3 cursor-pointer flex items-center gap-3">
                              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2v16z"/>
                              </svg>
                              <span>Save to Watch later</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="py-3 cursor-pointer flex items-center gap-3">
                              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M17 3a2.85 2.85 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>
                              </svg>
                              <span>Add to playlist</span>
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