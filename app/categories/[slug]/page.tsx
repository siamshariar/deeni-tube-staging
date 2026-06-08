"use client"

import { useState } from "react"
import { useRouter, useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Search, X } from "lucide-react"
import AppHeader from "@/components/app-header"
import MobileNav from "@/components/mobile-nav"
import DesktopSidebar from "@/components/desktop-sidebar"
import { Input } from "@/components/ui/input"

const categoryData: Record<string, { name: string; description: string }> = {
  "aqeedah": { name: "Aqeedah", description: "Islamic Creed and Belief" },
  "fiqh": { name: "Fiqh", description: "Islamic Jurisprudence" },
  "hadith": { name: "Hadith", description: "Prophetic Traditions" },
  "tafsir": { name: "Tafsir", description: "Quranic Exegesis" },
  "seerah": { name: "Seerah", description: "Prophetic Biography" },
  "dawah": { name: "Dawah", description: "Islamic Propagation" },
}

const videos = [
  { id: "v1", title: "The Importance of Aqeedah in Islam", channel: "Islamic Guidance", views: "150K views", timeAgo: "3 days ago", duration: "25:15", thumbnail: "/placeholder.svg?height=480&width=854", priority: 10 },
  { id: "v2", title: "Understanding Tawheed - Core Beliefs", channel: "Daily Dawah", views: "208K views", timeAgo: "6 days ago", duration: "18:28", thumbnail: "/placeholder.svg?height=480&width=854", priority: 8 },
  { id: "v3", title: "Correct Islamic Creed - Aqeedah Series", channel: "Digital Mimbar", views: "500K views", timeAgo: "1 week ago", duration: "35:10", thumbnail: "/placeholder.svg?height=480&width=854", priority: 9 },
  { id: "v4", title: "Foundations of Faith - Part 1", channel: "Islamic Guidance", views: "1.2M views", timeAgo: "2 weeks ago", duration: "45:00", thumbnail: "/placeholder.svg?height=480&width=854", priority: 7 },
  { id: "v5", title: "Belief in Allah and His Attributes", channel: "Merciful Servant", views: "89K views", timeAgo: "3 weeks ago", duration: "28:45", thumbnail: "/placeholder.svg?height=480&width=854", priority: 6 },
]

export default function CategoryVideosPage() {
  const router = useRouter()
  const params = useParams()
  const slug = params.slug as string
  const [searchQuery, setSearchQuery] = useState("")

  const category = categoryData[slug] || { name: slug, description: "" }

  // Filter and sort by priority
  const filteredVideos = videos
    .filter(v => !searchQuery || v.title.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => b.priority - a.priority)

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      {/* Mobile Back + Title */}
      <div className="md:hidden flex items-center gap-3 px-4 py-2 pt-[56px] border-b bg-background">
        <button onClick={() => router.back()} className="flex items-center justify-center h-9 w-9 rounded-full hover:bg-muted transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-base font-semibold truncate">{category.name}</h1>
      </div>

      <div className="flex">
        <DesktopSidebar className="hidden md:block" />

        <div className="flex-1 md:pl-[240px] md:pt-[80px] pb-nav-safe">
          {/* Desktop Header */}
          <div className="hidden md:block px-4 py-4 border-b">
            <h1 className="text-2xl font-bold">{category.name}</h1>
            <p className="text-sm text-muted-foreground mt-1">{category.description}</p>
          </div>

          {/* Search */}
          <div className="px-4 py-3 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder={`Search ${category.name} videos...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-9 h-9 text-sm rounded-full bg-muted/40"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* Video Grid - Desktop */}
          <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
            {filteredVideos.map((video) => (
              <div key={video.id} className="flex flex-col cursor-pointer">
                <Link href={`/videos/${video.id}`} className="relative aspect-video w-full">
                  <Image src={video.thumbnail} alt={video.title} fill className="object-cover rounded-lg" />
                  <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-1 py-0.5 rounded">{video.duration}</div>
                </Link>
                <div className="flex mt-2 gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm line-clamp-2">{video.title}</h3>
                    <p className="text-muted-foreground text-xs mt-1">{video.channel}</p>
                    <p className="text-muted-foreground text-xs">{video.views} • {video.timeAgo}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Video List - Mobile */}
          <div className="flex flex-col md:hidden">
            {filteredVideos.map((video) => (
              <Link key={video.id} href={`/videos/${video.id}`} className="flex gap-3 p-3 border-b">
                <div className="relative w-40 h-24 flex-shrink-0">
                  <Image src={video.thumbnail} alt={video.title} fill className="object-cover rounded-lg" />
                  <div className="absolute bottom-1 right-1 bg-black bg-opacity-80 text-white text-xs px-1 py-0.5 rounded">{video.duration}</div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-sm line-clamp-2">{video.title}</h3>
                  <p className="text-muted-foreground text-xs mt-1">{video.channel}</p>
                  <p className="text-muted-foreground text-xs">{video.views} • {video.timeAgo}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      <MobileNav />
    </div>
  )
}