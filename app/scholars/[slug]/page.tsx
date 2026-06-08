"use client"

import { useState } from "react"
import { useRouter, useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Globe, ChevronRight } from "lucide-react"
import AppHeader from "@/components/app-header"
import MobileNav from "@/components/mobile-nav"
import DesktopSidebar from "@/components/desktop-sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

const scholarData = {
  id: "abdul-alim",
  name: "Sheikh Abdul Alim",
  designation: "Islamic Scholar & Lecturer",
  image: "/portrait-of-abdul-alim.png",
  description: "Sheikh Abdul Alim is a renowned Islamic scholar known for his deep knowledge of Quran and Hadith. He has dedicated his life to spreading authentic Islamic teachings through lectures, books, and online content. His approach combines traditional Islamic scholarship with contemporary relevance.",
  website: "abdulalim.com",
  facebook: "facebook.com/sheikhabdulalim",
  twitter: "twitter.com/abdulalim",
  youtube: "youtube.com/@sheikhabdulalim",
}

const languages = [
  { code: "en", label: "En" },
  { code: "ar", label: "Ar" },
  { code: "hi", label: "Hi" },
  { code: "bn", label: "Bn" },
]

const videos = [
  { id: "v1", title: "The Importance of Seeking Knowledge in Islam", channel: "Islamic Guidance", views: "150K views", timeAgo: "3 days ago", duration: "25:15", thumbnail: "/placeholder.svg?height=480&width=854" },
  { id: "v2", title: "Understanding Tawheed - The Oneness of Allah", channel: "Daily Dawah", views: "208K views", timeAgo: "6 days ago", duration: "18:28", thumbnail: "/placeholder.svg?height=480&width=854" },
  { id: "v3", title: "Lessons from Surah Al-Kahf", channel: "Digital Mimbar", views: "500K views", timeAgo: "1 week ago", duration: "35:10", thumbnail: "/placeholder.svg?height=480&width=854" },
  { id: "v4", title: "The Life of Prophet Muhammad (PBUH) - Part 1", channel: "Islamic Guidance", views: "1.2M views", timeAgo: "2 weeks ago", duration: "45:00", thumbnail: "/placeholder.svg?height=480&width=854" },
  { id: "v5", title: "Fiqh of Worship - Salah and Zakat", channel: "Digital Mimbar", views: "89K views", timeAgo: "3 weeks ago", duration: "28:45", thumbnail: "/placeholder.svg?height=480&width=854" },
]

export default function ScholarDetailPage() {
  const router = useRouter()
  const params = useParams()
  const [activeLang, setActiveLang] = useState("en")
  const [showFullDescription, setShowFullDescription] = useState(false)
  const [showAllLinks, setShowAllLinks] = useState(false)

  const scholar = scholarData

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      {/* Mobile Back + Title */}
      <div className="md:hidden flex items-center gap-3 px-4 py-2 pt-[56px] border-b bg-background">
        <button onClick={() => router.back()} className="flex items-center justify-center h-9 w-9 rounded-full hover:bg-muted transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-base font-semibold truncate">{scholar.name}</h1>
      </div>

      <div className="flex">
        <DesktopSidebar className="hidden md:block" />

        <div className="flex-1 md:pl-[240px] md:pt-[80px] pb-nav-safe">
          {/* Scholar Info */}
          <div className="px-4 py-6 border-b">
            <div className="flex items-start gap-4">
              <Avatar className="h-20 w-20 md:h-24 md:w-24 flex-shrink-0">
                <AvatarImage src={scholar.image} alt={scholar.name} />
                <AvatarFallback>{scholar.name.charAt(0)}</AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <h1 className="text-xl md:text-2xl font-bold">{scholar.name}</h1>
                <p className="text-sm text-muted-foreground">{scholar.designation}</p>

                {/* Description */}
                <p className="text-sm text-muted-foreground mt-2">
                  {showFullDescription ? (
                    <>
                      {scholar.description}
                      <button onClick={() => setShowFullDescription(false)} className="text-blue-600 ml-1 hover:underline font-medium">Show less</button>
                    </>
                  ) : (
                    <>
                      {scholar.description.length > 120 ? scholar.description.substring(0, 120) + "..." : scholar.description}
                      {scholar.description.length > 120 && (
                        <button onClick={() => setShowFullDescription(true)} className="text-blue-600 ml-1 hover:underline font-medium">...more</button>
                      )}
                    </>
                  )}
                </p>

                {/* Links */}
                <div className="mt-2 space-y-1">
                  <Link href={`https://${scholar.website}`} className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                    <Globe className="h-3 w-3" />{scholar.website}
                  </Link>
                  {showAllLinks ? (
                    <>
                      <Link href={`https://${scholar.facebook}`} className="text-sm text-blue-600 hover:underline block">Facebook</Link>
                      <Link href={`https://${scholar.twitter}`} className="text-sm text-blue-600 hover:underline block">Twitter</Link>
                      <Link href={`https://${scholar.youtube}`} className="text-sm text-blue-600 hover:underline block">YouTube</Link>
                      <button onClick={() => setShowAllLinks(false)} className="text-xs text-blue-600 hover:underline font-medium">Show less</button>
                    </>
                  ) : (
                    <button onClick={() => setShowAllLinks(true)} className="text-xs text-blue-600 hover:underline font-medium">and 3 more links</button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Language Tabs */}
          <div className="border-b">
            <div className="flex gap-2 px-4 py-3 overflow-x-auto scrollbar-hide">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setActiveLang(lang.code)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-colors border ${
                    activeLang === lang.code
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background text-foreground border-border hover:bg-muted"
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>

          {/* Videos by Selected Language */}
          <div className="px-4 py-3">
            <p className="text-sm text-muted-foreground mb-3">
              Videos in {languages.find(l => l.code === activeLang)?.label || activeLang}
            </p>
          </div>

          {/* Video Grid - Desktop */}
          <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 px-4 pb-6">
            {videos.map((video) => (
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
          <div className="flex flex-col md:hidden px-4 pb-6">
            {videos.map((video) => (
              <Link key={video.id} href={`/videos/${video.id}`} className="flex gap-3 py-3 border-b">
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