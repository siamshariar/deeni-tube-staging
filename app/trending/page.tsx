"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Flame } from "lucide-react"
import AppHeader from "@/components/app-header"
import MobileNav from "@/components/mobile-nav"
import DesktopSidebar from "@/components/desktop-sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Image from "next/image"
import Link from "next/link"

const trendingVideos = [
  { id: "t1", title: "The Purpose of Life - Powerful Islamic Reminder", channel: "Daily Dawah", views: "2.8M views", timeAgo: "1 day ago", duration: "18:28", thumbnail: "/placeholder.svg?height=480&width=854", rank: 1 },
  { id: "t2", title: "Surah Al Baqarah - Beautiful Recitation", channel: "Islamic Recitation", views: "1.5M views", timeAgo: "2 days ago", duration: "2:45:00", thumbnail: "/placeholder.svg?height=480&width=854", rank: 2 },
  { id: "t3", title: "Tafsir of Surah Al-Fatiha - Complete", channel: "Islamic Guidance", views: "980K views", timeAgo: "3 days ago", duration: "25:15", thumbnail: "/placeholder.svg?height=480&width=854", rank: 3 },
  { id: "t4", title: "How to Pray Salah - Step by Step", channel: "Digital Mimbar", views: "750K views", timeAgo: "4 days ago", duration: "12:40", thumbnail: "/placeholder.svg?height=480&width=854", rank: 4 },
  { id: "t5", title: "Stories of the Prophets - Prophet Musa", channel: "Merciful Servant", views: "620K views", timeAgo: "5 days ago", duration: "45:00", thumbnail: "/placeholder.svg?height=480&width=854", rank: 5 },
  { id: "t6", title: "Morning Azkar - Start Your Day", channel: "The Daily Reminder", views: "550K views", timeAgo: "6 days ago", duration: "15:30", thumbnail: "/placeholder.svg?height=480&width=854", rank: 6 },
  { id: "t7", title: "The Day of Judgment - Signs", channel: "Islamic Guidance", views: "480K views", timeAgo: "1 week ago", duration: "32:10", thumbnail: "/placeholder.svg?height=480&width=854", rank: 7 },
  { id: "t8", title: "Ramadan Preparation Guide", channel: "Peace TV", views: "420K views", timeAgo: "1 week ago", duration: "20:45", thumbnail: "/placeholder.svg?height=480&width=854", rank: 8 },
]

export default function TrendingPage() {
  const router = useRouter()

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
            <h1 className="font-semibold text-lg">Trending</h1>
          </div>
          <div className="max-w-4xl mx-auto px-4">
            <div className="flex items-center gap-2 py-4">
              <Flame className="h-6 w-6 text-red-500" />
              <h1 className="text-2xl font-bold hidden md:block">Trending</h1>
            </div>
            <div className="space-y-4 pb-6">
              {trendingVideos.map((video) => (
                <Link key={video.id} href={`/videos/${video.id}/${video.id}`} className="flex gap-4 group">
                  <div className="text-2xl font-bold text-muted-foreground/50 w-8 text-right flex-shrink-0 self-center">
                    {video.rank}
                  </div>
                  <div className="relative w-40 h-24 md:w-56 md:h-32 flex-shrink-0">
                    <Image src={video.thumbnail} alt={video.title} fill className="object-cover rounded-lg" />
                    <div className="absolute bottom-1 right-1 bg-black bg-opacity-80 text-white text-xs px-1 py-0.5 rounded">{video.duration}</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm md:text-base line-clamp-2 group-hover:text-primary transition-colors">{video.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{video.channel}</p>
                    <p className="text-xs text-muted-foreground">{video.views} • {video.timeAgo}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
      <MobileNav />
    </div>
  )
}