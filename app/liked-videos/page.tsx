"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, ThumbsUp } from "lucide-react"
import AppHeader from "@/components/app-header"
import MobileNav from "@/components/mobile-nav"
import DesktopSidebar from "@/components/desktop-sidebar"
import Image from "next/image"
import Link from "next/link"

const sampleVideos = [
  { id: "v1", title: "The Purpose of Life - Powerful Islamic Reminder", channel: "Daily Dawah", views: "208K views", timeAgo: "6 days ago", duration: "18:28", thumbnail: "/placeholder.svg?height=480&width=854" },
  { id: "v2", title: "Tafsir of Surah Al-Fatiha - Complete Explanation", channel: "Islamic Guidance", views: "150K views", timeAgo: "3 days ago", duration: "25:15", thumbnail: "/placeholder.svg?height=480&width=854" },
  { id: "v3", title: "How to Pray Salah - Step by Step Guide", channel: "Digital Mimbar", views: "500K views", timeAgo: "1 week ago", duration: "12:40", thumbnail: "/placeholder.svg?height=480&width=854" },
]

export default function LikedVideosPage() {
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
            <h1 className="font-semibold text-lg">Liked Videos</h1>
          </div>
          <div className="max-w-3xl mx-auto px-4">
            <div className="flex items-center gap-2 py-4">
              <ThumbsUp className="h-5 w-5" />
              <h1 className="hidden md:block text-2xl font-bold">Liked Videos</h1>
            </div>
            <div className="space-y-4">
              {sampleVideos.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No liked videos</p>
              ) : (
                sampleVideos.map((video) => (
                  <Link key={video.id} href={`/videos/${video.id}`} className="flex gap-3 group">
                    <div className="relative w-40 h-24 flex-shrink-0">
                      <Image src={video.thumbnail} alt={video.title} fill className="object-cover rounded-lg" />
                      <div className="absolute bottom-1 right-1 bg-black bg-opacity-80 text-white text-xs px-1 py-0.5 rounded">{video.duration}</div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">{video.title}</h3>
                      <p className="text-xs text-muted-foreground mt-1">{video.channel}</p>
                      <p className="text-xs text-muted-foreground">{video.views} • {video.timeAgo}</p>
                    </div>
                  </Link>
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