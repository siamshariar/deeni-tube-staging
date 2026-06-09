"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Gamepad2 } from "lucide-react"
import AppHeader from "@/components/app-header"
import MobileNav from "@/components/mobile-nav"
import DesktopSidebar from "@/components/desktop-sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Image from "next/image"
import Link from "next/link"

const gamingVideos = [
  { id: "g1", title: "Islamic Quiz Game - Test Your Knowledge", channel: "Islamic Games", views: "320K views", timeAgo: "2 weeks ago", duration: "25:15", thumbnail: "/placeholder.svg?height=480&width=854" },
  { id: "g2", title: "Quran Competition 2024 - Finals", channel: "Deen Challenge", views: "180K views", timeAgo: "1 month ago", duration: "45:30", thumbnail: "/placeholder.svg?height=480&width=854" },
  { id: "g3", title: "Islamic Trivia - Prophets Edition", channel: "Quiz Islam", views: "95K views", timeAgo: "2 months ago", duration: "15:40", thumbnail: "/placeholder.svg?height=480&width=854" },
  { id: "g4", title: "Halal Games Review - Top 5 Picks", channel: "Muslim Gaming", views: "210K views", timeAgo: "3 months ago", duration: "18:20", thumbnail: "/placeholder.svg?height=480&width=854" },
  { id: "g5", title: "Islamic Geography Challenge", channel: "Islamic Games", views: "75K views", timeAgo: "4 months ago", duration: "12:50", thumbnail: "/placeholder.svg?height=480&width=854" },
  { id: "g6", title: "Learn Arabic Through Games", channel: "Arabic Fun", views: "150K views", timeAgo: "5 months ago", duration: "22:10", thumbnail: "/placeholder.svg?height=480&width=854" },
]

export default function GamingPage() {
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
            <h1 className="font-semibold text-lg">Gaming</h1>
          </div>
          <div className="max-w-5xl mx-auto px-4">
            <div className="flex items-center gap-2 py-4">
              <Gamepad2 className="h-6 w-6 text-green-500" />
              <h1 className="text-2xl font-bold hidden md:block">Islamic Games & Quizzes</h1>
            </div>
            <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-6">
              {gamingVideos.map((video) => (
                <Link key={video.id} href={`/videos/${video.id}/${video.id}`} className="flex flex-col group">
                  <div className="relative aspect-video w-full">
                    <Image src={video.thumbnail} alt={video.title} fill className="object-cover rounded-lg" />
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-1 py-0.5 rounded">{video.duration}</div>
                  </div>
                  <div className="flex mt-2 gap-2">
                    <Avatar className="h-9 w-9 flex-shrink-0"><AvatarFallback>{video.channel.charAt(0)}</AvatarFallback></Avatar>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm line-clamp-2 group-hover:text-primary">{video.title}</h3>
                      <p className="text-xs text-muted-foreground mt-1">{video.channel}</p>
                      <p className="text-xs text-muted-foreground">{video.views} • {video.timeAgo}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            <div className="flex flex-col md:hidden pb-6">
              {gamingVideos.map((video) => (
                <Link key={video.id} href={`/videos/${video.id}/${video.id}`} className="flex gap-3 py-3 border-b">
                  <div className="relative w-40 h-24 flex-shrink-0">
                    <Image src={video.thumbnail} alt={video.title} fill className="object-cover rounded-lg" />
                    <div className="absolute bottom-1 right-1 bg-black bg-opacity-80 text-white text-xs px-1 py-0.5 rounded">{video.duration}</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm line-clamp-2">{video.title}</h3>
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