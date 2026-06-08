"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Trash2 } from "lucide-react"
import AppHeader from "@/components/app-header"
import MobileNav from "@/components/mobile-nav"
import DesktopSidebar from "@/components/desktop-sidebar"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import Link from "next/link"

const sampleVideos = [
  { id: "v1", title: "The Purpose of Life - Powerful Islamic Reminder", channel: "Daily Dawah", views: "208K views", timeAgo: "Today", duration: "18:28", thumbnail: "/placeholder.svg?height=480&width=854" },
  { id: "v2", title: "Tafsir of Surah Al-Fatiha", channel: "Islamic Guidance", views: "150K views", timeAgo: "Yesterday", duration: "25:15", thumbnail: "/placeholder.svg?height=480&width=854" },
  { id: "v3", title: "How to Pray Salah", channel: "Digital Mimbar", views: "500K views", timeAgo: "2 days ago", duration: "12:40", thumbnail: "/placeholder.svg?height=480&width=854" },
  { id: "v4", title: "Stories of the Prophets", channel: "Merciful Servant", views: "1.2M views", timeAgo: "Last week", duration: "45:00", thumbnail: "/placeholder.svg?height=480&width=854" },
]

export default function HistoryPage() {
  const router = useRouter()
  const [videos, setVideos] = useState(sampleVideos)

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <div className="flex">
        <DesktopSidebar className="hidden md:block" />
        <div className="flex-1 md:pl-[240px] pt-[56px] md:pt-[80px] pb-nav-safe md:pb-6">
          <div className="md:hidden flex items-center gap-3 px-4 py-2 border-b">
            <button onClick={() => router.back()} className="flex items-center justify-center h-9 w-9 rounded-full hover:bg-muted transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="font-semibold text-lg">History</h1>
          </div>
          <div className="max-w-3xl mx-auto px-4">
            <div className="flex items-center justify-between py-4">
              <h1 className="hidden md:block text-2xl font-bold">Watch History</h1>
              {videos.length > 0 && (
                <Button variant="ghost" size="sm" className="text-destructive" onClick={() => setVideos([])}>
                  Clear all history
                </Button>
              )}
            </div>
            <div className="space-y-4">
              {videos.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No watch history</p>
              ) : (
                videos.map((video) => (
                  <div key={video.id} className="flex gap-3">
                    <Link href={`/videos/${video.id}`} className="relative w-40 h-24 flex-shrink-0">
                      <Image src={video.thumbnail} alt={video.title} fill className="object-cover rounded-lg" />
                      <div className="absolute bottom-1 right-1 bg-black bg-opacity-80 text-white text-xs px-1 py-0.5 rounded">{video.duration}</div>
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link href={`/videos/${video.id}`}><h3 className="font-medium text-sm line-clamp-2 hover:text-primary">{video.title}</h3></Link>
                      <p className="text-xs text-muted-foreground mt-1">{video.channel}</p>
                      <p className="text-xs text-muted-foreground">{video.views} • {video.timeAgo}</p>
                    </div>
                    <button onClick={() => setVideos(videos.filter(v => v.id !== video.id))} className="p-1.5 rounded-full hover:bg-muted transition-colors self-start flex-shrink-0">
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
      <MobileNav />
    </div>
  )
}