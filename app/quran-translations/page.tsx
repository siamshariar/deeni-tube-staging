"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Search, X } from "lucide-react"
import AppHeader from "@/components/app-header"
import MobileNav from "@/components/mobile-nav"
import DesktopSidebar from "@/components/desktop-sidebar"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Image from "next/image"
import Link from "next/link"

const languages = [
  { code: "bn", label: "Bengali" },
  { code: "ar", label: "Arabic" },
  { code: "en", label: "English" },
]

const quranVideos = [
  {
    id: "q1",
    title: "Complete Quran Recitation - Sheikh Sudais",
    channel: "Haramain Recordings",
    channelAvatar: "/placeholder.svg?height=36&width=36",
    views: "5.2M views",
    timeAgo: "1 year ago",
    duration: "45:30:00",
    thumbnail: "/placeholder.svg?height=480&width=854",
    category: "Full Quran",
    language: "ar",
  },
  {
    id: "q2",
    title: "Surah Al-Baqarah with Bangla Translation",
    channel: "Islamic Guidance",
    channelAvatar: "/placeholder.svg?height=36&width=36",
    views: "2.1M views",
    timeAgo: "6 months ago",
    duration: "2:45:00",
    thumbnail: "/placeholder.svg?height=480&width=854",
    category: "Surah Based",
    language: "bn",
  },
  {
    id: "q3",
    title: "Surah Yasin - English Translation & Tafsir",
    channel: "Daily Dawah",
    channelAvatar: "/placeholder.svg?height=36&width=36",
    views: "1.8M views",
    timeAgo: "3 months ago",
    duration: "45:20",
    thumbnail: "/placeholder.svg?height=480&width=854",
    category: "Surah Based",
    language: "en",
  },
  {
    id: "q4",
    title: "Quran Tafsir - Surah Al-Fatiha Explained",
    channel: "Digital Mimbar",
    channelAvatar: "/placeholder.svg?height=36&width=36",
    views: "890K views",
    timeAgo: "2 weeks ago",
    duration: "35:15",
    thumbnail: "/placeholder.svg?height=480&width=854",
    category: "Tafsir",
    language: "en",
  },
  {
    id: "q5",
    title: "সুরা আর রহমান - বাংলা অনুবাদ সহ",
    channel: "Quran Recitation",
    channelAvatar: "/placeholder.svg?height=36&width=36",
    views: "3.4M views",
    timeAgo: "1 year ago",
    duration: "1:20:00",
    thumbnail: "/placeholder.svg?height=480&width=854",
    category: "Surah Based",
    language: "bn",
  },
  {
    id: "q6",
    title: "Juz Amma Complete - 30th Para Recitation",
    channel: "Merciful Servant",
    channelAvatar: "/placeholder.svg?height=36&width=36",
    views: "4.1M views",
    timeAgo: "8 months ago",
    duration: "1:55:00",
    thumbnail: "/placeholder.svg?height=480&width=854",
    category: "Juz/Para",
    language: "ar",
  },
  {
    id: "q7",
    title: "Quran for Sleep - 8 Hours Relaxing Recitation",
    channel: "Islamic Sounds",
    channelAvatar: "/placeholder.svg?height=36&width=36",
    views: "12M views",
    timeAgo: "2 years ago",
    duration: "8:00:00",
    thumbnail: "/placeholder.svg?height=480&width=854",
    category: "Full Quran",
    language: "ar",
  },
  {
    id: "q8",
    title: "Learn Quran with Tajweed - Lesson 1",
    channel: "Huda TV",
    channelAvatar: "/placeholder.svg?height=36&width=36",
    views: "650K views",
    timeAgo: "4 months ago",
    duration: "28:40",
    thumbnail: "/placeholder.svg?height=480&width=854",
    category: "Tajweed",
    language: "en",
  },
  {
    id: "q9",
    title: "সহজ কুরআন শিক্ষা - প্রথম ক্লাস",
    channel: "Peace TV Bangla",
    channelAvatar: "/placeholder.svg?height=36&width=36",
    views: "1.2M views",
    timeAgo: "1 year ago",
    duration: "42:10",
    thumbnail: "/placeholder.svg?height=480&width=854",
    category: "Tajweed",
    language: "bn",
  },
  {
    id: "q10",
    title: "Quran Translation Comparison - 5 Languages",
    channel: "IlmFeed",
    channelAvatar: "/placeholder.svg?height=36&width=36",
    views: "320K views",
    timeAgo: "5 months ago",
    duration: "55:30",
    thumbnail: "/placeholder.svg?height=480&width=854",
    category: "Translation",
    language: "en",
  },
]

const categories = ["All", "Full Quran", "Surah Based", "Tafsir", "Juz/Para", "Tajweed", "Translation"]

export default function QuranTranslationsPage() {
  const router = useRouter()
  const [selectedLang, setSelectedLang] = useState("all")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredVideos = quranVideos
    .filter((video) => {
      if (selectedLang !== "all" && video.language !== selectedLang) return false
      if (selectedCategory !== "All" && video.category !== selectedCategory) return false
      if (searchQuery && !video.title.toLowerCase().includes(searchQuery.toLowerCase())) return false
      return true
    })

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <div className="flex">
        <DesktopSidebar className="hidden md:block" />
        <div className="flex-1 md:pl-[240px] pt-[56px] md:pt-[80px] pb-nav-safe md:pb-6">
          {/* Mobile Back + Title */}
          <div className="md:hidden flex items-center gap-3 px-4 py-2 border-b">
            <button
              onClick={() => router.back()}
              className="flex items-center justify-center h-9 w-9 rounded-full hover:bg-muted transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="font-semibold text-lg">Quran Translations</h1>
          </div>

          <div className="max-w-5xl mx-auto px-4">
            {/* Desktop Header */}
            <h1 className="hidden md:block text-2xl font-bold py-4">Quran Translations</h1>

            {/* Language Filter */}
            <div className="flex gap-2 py-3 overflow-x-auto scrollbar-hide border-b">
              <button
                onClick={() => setSelectedLang("all")}
                className={`px-3 py-1 rounded-full text-xs font-medium border whitespace-nowrap ${
                  selectedLang === "all" ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-muted"
                }`}
              >
                All Languages
              </button>
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setSelectedLang(lang.code)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border whitespace-nowrap ${
                    selectedLang === lang.code ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-muted"
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>

            {/* Category Filter */}
            <div className="flex gap-2 py-3 overflow-x-auto scrollbar-hide border-b">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border whitespace-nowrap ${
                    selectedCategory === cat ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-muted"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="py-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search Quran videos..."
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

            {/* Results Count */}
            <p className="text-xs text-muted-foreground mb-3">
              {filteredVideos.length} video{filteredVideos.length !== 1 ? "s" : ""} found
            </p>

            {/* Video Grid - Desktop */}
            <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-6">
              {filteredVideos.length === 0 ? (
                <div className="col-span-full text-center py-8 text-muted-foreground text-sm">
                  No videos found
                </div>
              ) : (
                filteredVideos.map((video) => (
                  <Link key={video.id} href={`/videos/${video.id}/${video.id}`} className="flex flex-col group">
                    <div className="relative aspect-video w-full">
                      <Image src={video.thumbnail} alt={video.title} fill className="object-cover rounded-lg" />
                      <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-1 py-0.5 rounded">
                        {video.duration}
                      </div>
                    </div>
                    <div className="flex mt-2 gap-2">
                      <Avatar className="h-9 w-9 flex-shrink-0">
                        <AvatarImage src={video.channelAvatar} />
                        <AvatarFallback>{video.channel.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
                          {video.title}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1">{video.channel}</p>
                        <p className="text-xs text-muted-foreground">
                          {video.views} • {video.timeAgo}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>

            {/* Video List - Mobile */}
            <div className="flex flex-col md:hidden pb-6">
              {filteredVideos.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  No videos found
                </div>
              ) : (
                filteredVideos.map((video) => (
                  <Link key={video.id} href={`/videos/${video.id}/${video.id}`} className="flex gap-3 py-3 border-b">
                    <div className="relative w-40 h-24 flex-shrink-0">
                      <Image src={video.thumbnail} alt={video.title} fill className="object-cover rounded-lg" />
                      <div className="absolute bottom-1 right-1 bg-black bg-opacity-80 text-white text-xs px-1 py-0.5 rounded">
                        {video.duration}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm line-clamp-2">{video.title}</h3>
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