"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Search, X, BookOpen, ChevronLeft, ChevronRight, MoreVertical, Play } from "lucide-react"
import AppHeader from "@/components/app-header"
import MobileNav from "@/components/mobile-nav"
import DesktopSidebar from "@/components/desktop-sidebar"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useMediaQuery } from "@/hooks/use-media-query"
import Image from "next/image"
import Link from "next/link"

const languages = [
  { code: "all", label: "All Languages" },
  { code: "bn", label: "Bengali" },
  { code: "ar", label: "Arabic" },
  { code: "en", label: "English" },
  { code: "ur", label: "Urdu" },
  { code: "hi", label: "Hindi" },
  { code: "tr", label: "Turkish" },
]

const categories = ["All", "Full Quran", "Surah Based", "Tafsir", "Juz/Para", "Tajweed", "Translation"]

const quranVideos = [
  { id: "q1", title: "Complete Quran Recitation - Sheikh Sudais", channel: "Haramain Recordings", channelAvatar: "/placeholder.svg?height=36&width=36", views: "5.2M views", timeAgo: "1 year ago", duration: "45:30:00", thumbnail: "/placeholder.svg?height=480&width=854", category: "Full Quran", language: "ar" },
  { id: "q2", title: "Surah Al-Baqarah with Bangla Translation", channel: "Islamic Guidance", channelAvatar: "/placeholder.svg?height=36&width=36", views: "2.1M views", timeAgo: "6 months ago", duration: "2:45:00", thumbnail: "/placeholder.svg?height=480&width=854", category: "Surah Based", language: "bn" },
  { id: "q3", title: "Surah Yasin - English Translation & Tafsir", channel: "Daily Dawah", channelAvatar: "/placeholder.svg?height=36&width=36", views: "1.8M views", timeAgo: "3 months ago", duration: "45:20", thumbnail: "/placeholder.svg?height=480&width=854", category: "Surah Based", language: "en" },
  { id: "q4", title: "Quran Tafsir - Surah Al-Fatiha Explained", channel: "Digital Mimbar", channelAvatar: "/placeholder.svg?height=36&width=36", views: "890K views", timeAgo: "2 weeks ago", duration: "35:15", thumbnail: "/placeholder.svg?height=480&width=854", category: "Tafsir", language: "en" },
  { id: "q5", title: "সুরা আর রহমান - বাংলা অনুবাদ সহ", channel: "Quran Recitation", channelAvatar: "/placeholder.svg?height=36&width=36", views: "3.4M views", timeAgo: "1 year ago", duration: "1:20:00", thumbnail: "/placeholder.svg?height=480&width=854", category: "Surah Based", language: "bn" },
  { id: "q6", title: "Juz Amma Complete - 30th Para Recitation", channel: "Merciful Servant", channelAvatar: "/placeholder.svg?height=36&width=36", views: "4.1M views", timeAgo: "8 months ago", duration: "1:55:00", thumbnail: "/placeholder.svg?height=480&width=854", category: "Juz/Para", language: "ar" },
  { id: "q7", title: "Quran for Sleep - 8 Hours Relaxing Recitation", channel: "Islamic Sounds", channelAvatar: "/placeholder.svg?height=36&width=36", views: "12M views", timeAgo: "2 years ago", duration: "8:00:00", thumbnail: "/placeholder.svg?height=480&width=854", category: "Full Quran", language: "ar" },
  { id: "q8", title: "Learn Quran with Tajweed - Lesson 1", channel: "Huda TV", channelAvatar: "/placeholder.svg?height=36&width=36", views: "650K views", timeAgo: "4 months ago", duration: "28:40", thumbnail: "/placeholder.svg?height=480&width=854", category: "Tajweed", language: "en" },
  { id: "q9", title: "সহজ কুরআন শিক্ষা - প্রথম ক্লাস", channel: "Peace TV Bangla", channelAvatar: "/placeholder.svg?height=36&width=36", views: "1.2M views", timeAgo: "1 year ago", duration: "42:10", thumbnail: "/placeholder.svg?height=480&width=854", category: "Tajweed", language: "bn" },
  { id: "q10", title: "Quran Translation Comparison - 5 Languages", channel: "IlmFeed", channelAvatar: "/placeholder.svg?height=36&width=36", views: "320K views", timeAgo: "5 months ago", duration: "55:30", thumbnail: "/placeholder.svg?height=480&width=854", category: "Translation", language: "en" },
]

function VideoSkeleton() {
  return (
    <div className="flex flex-col">
      <Skeleton className="aspect-video w-full rounded-xl" />
      <div className="flex mt-2 gap-2">
        <Skeleton className="h-9 w-9 rounded-full flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-3 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
    </div>
  )
}

function VideoSkeletonHorizontal() {
  return (
    <div className="flex gap-3 py-3">
      <Skeleton className="w-40 aspect-video rounded-lg flex-shrink-0" />
      <div className="flex-1 min-w-0 space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-3 w-32" />
      </div>
    </div>
  )
}

export default function QuranTranslationsPage() {
  const router = useRouter()
  const isMobile = useMediaQuery("(max-width: 768px)")
  const [selectedLang, setSelectedLang] = useState("all")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const langScrollRef = useRef<HTMLDivElement>(null)
  const catScrollRef = useRef<HTMLDivElement>(null)
  const [showLangLeft, setShowLangLeft] = useState(false)
  const [showLangRight, setShowLangRight] = useState(true)
  const [showCatLeft, setShowCatLeft] = useState(false)
  const [showCatRight, setShowCatRight] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600)
    return () => clearTimeout(timer)
  }, [])

  const updateArrows = useCallback((ref: React.RefObject<HTMLDivElement>, setLeft: (v: boolean) => void, setRight: (v: boolean) => void) => {
    const el = ref.current
    if (!el) return
    const hasScroll = el.scrollWidth > el.clientWidth + 2
    setLeft(hasScroll && el.scrollLeft > 8)
    setRight(hasScroll && el.scrollLeft < el.scrollWidth - el.clientWidth - 8)
  }, [])

  useEffect(() => {
    const langEl = langScrollRef.current
    const catEl = catScrollRef.current
    if (!langEl || !catEl) return
    const handler = () => {
      updateArrows(langScrollRef, setShowLangLeft, setShowLangRight)
      updateArrows(catScrollRef, setShowCatLeft, setShowCatRight)
    }
    langEl.addEventListener('scroll', handler, { passive: true })
    catEl.addEventListener('scroll', handler, { passive: true })
    window.addEventListener('resize', handler)
    setTimeout(handler, 100)
    setTimeout(handler, 500)
    return () => {
      langEl.removeEventListener('scroll', handler)
      catEl.removeEventListener('scroll', handler)
      window.removeEventListener('resize', handler)
    }
  }, [updateArrows])

  const scrollChips = (ref: React.RefObject<HTMLDivElement>, direction: 'left' | 'right') => {
    const el = ref.current
    if (!el) return
    el.scrollBy({ left: direction === 'left' ? -el.clientWidth * 0.6 : el.clientWidth * 0.6, behavior: 'smooth' })
  }

  const filteredVideos = quranVideos.filter((video) => {
    if (selectedLang !== "all" && video.language !== selectedLang) return false
    if (selectedCategory !== "All" && video.category !== selectedCategory) return false
    if (searchQuery && !video.title.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  const scrollableChips = (
    ref: React.RefObject<HTMLDivElement>,
    items: { code?: string; label: string; category?: string }[],
    selected: string,
    onSelect: (val: string) => void,
    showLeft: boolean,
    showRight: boolean,
  ) => (
    <div className="relative py-2">
      <div className={`absolute left-0 top-0 bottom-0 z-10 flex items-center transition-opacity duration-200 ${showLeft ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute left-0 top-0 bottom-0 w-10 bg-gradient-to-r from-background to-transparent" />
        <button onClick={() => scrollChips(ref, 'left')} className="relative ml-0.5 h-8 w-8 rounded-full bg-background border shadow-md flex items-center justify-center hover:bg-muted transition-colors">
          <ChevronLeft className="h-4 w-4" />
        </button>
      </div>
      <div className={`absolute right-0 top-0 bottom-0 z-10 flex items-center transition-opacity duration-200 ${showRight ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l from-background to-transparent" />
        <button onClick={() => scrollChips(ref, 'right')} className="relative mr-0.5 h-8 w-8 rounded-full bg-background border shadow-md flex items-center justify-center hover:bg-muted transition-colors">
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
      <div ref={ref} className="overflow-x-auto scrollbar-none" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}>
        <div className="flex gap-2 px-8 w-max">
          {items.map((item) => {
            const value = item.code || item.label
            return (
              <button
                key={value}
                onClick={() => onSelect(value)}
                className={`px-3.5 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  selected === value ? "bg-foreground text-background" : "bg-muted hover:bg-muted/80 text-foreground"
                }`}
              >
                {item.label}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <div className="flex">
        <DesktopSidebar className="hidden md:block" />
        <div className="flex-1 md:pl-[240px] pt-[56px] md:pt-[80px] pb-nav-safe md:pb-6">
          <div className="md:hidden flex items-center gap-3 px-4 py-3 border-b sticky top-[56px] bg-background z-10">
            <button onClick={() => router.back()} className="flex items-center justify-center h-9 w-9 rounded-full hover:bg-muted transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="font-semibold text-lg">Quran Translations</h1>
          </div>

          <div className="max-w-[1096px] mx-auto px-3 md:px-6">
            {/* Desktop Header */}
            <div className="hidden md:flex items-center gap-3 py-4 md:py-6">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">Quran Translations</h1>
                <p className="text-sm text-muted-foreground">Recitations and translations in multiple languages</p>
              </div>
            </div>

            {/* Language Filter */}
            <div className="border-b">
              {scrollableChips(langScrollRef, languages, selectedLang, setSelectedLang, showLangLeft, showLangRight)}
            </div>

            {/* Category Filter */}
            <div className="border-b">
              {scrollableChips(catScrollRef, categories.map(c => ({ label: c })), selectedCategory, setSelectedCategory, showCatLeft, showCatRight)}
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
                  className="pl-10 pr-10 h-10 text-sm rounded-full bg-muted/50"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Results Count */}
            {!isLoading && (
              <p className="text-xs md:text-sm text-muted-foreground mb-3 md:mb-4">
                {filteredVideos.length} video{filteredVideos.length !== 1 ? 's' : ''} found
              </p>
            )}

            {/* Desktop Grid */}
            {isLoading ? (
              <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-6">
                {Array.from({ length: 8 }).map((_, i) => <VideoSkeleton key={i} />)}
              </div>
            ) : (
              <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-6">
                {filteredVideos.length === 0 ? (
                  <div className="col-span-full text-center py-12 text-muted-foreground">No videos found</div>
                ) : (
                  filteredVideos.map((video) => (
                    <div key={video.id} className="flex flex-col group">
                      <Link href={`/videos/${video.channel}/${video.id}`} className="relative aspect-video w-full">
                        <Image src={video.thumbnail} alt={video.title} fill className="object-cover rounded-xl" />
                        <div className="absolute bottom-1.5 right-1.5 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded font-medium">{video.duration}</div>
                        <div className="absolute inset-0 bg-black/20 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="bg-black/60 rounded-full p-2"><Play className="h-5 w-5 text-white fill-white" /></div>
                        </div>
                      </Link>
                      <div className="flex mt-3 gap-2">
                        <Link href={`/channel/${video.channel}`}><Avatar className="h-9 w-9 flex-shrink-0"><AvatarImage src={video.channelAvatar} /><AvatarFallback>{video.channel.charAt(0)}</AvatarFallback></Avatar></Link>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-1">
                            <Link href={`/videos/${video.channel}/${video.id}`}><h3 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">{video.title}</h3></Link>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <button className="p-1 rounded-full hover:bg-muted transition-colors flex-shrink-0 opacity-0 group-hover:opacity-100"><MoreVertical className="h-4 w-4 text-muted-foreground" /></button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuItem className="py-2.5 cursor-pointer flex items-center gap-2 text-sm" onClick={() => router.push(`/videos/${video.channel}/${video.id}`)}><Play className="h-4 w-4" /><span>Play now</span></DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">{video.channel}</p>
                          <p className="text-xs text-muted-foreground">{video.views} • {video.timeAgo}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Mobile List */}
            {isLoading ? (
              <div className="flex flex-col md:hidden pb-6">
                {Array.from({ length: 4 }).map((_, i) => <VideoSkeletonHorizontal key={i} />)}
              </div>
            ) : (
              <div className="flex flex-col md:hidden pb-6">
                {filteredVideos.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">No videos found</div>
                ) : (
                  filteredVideos.map((video) => (
                    <div key={video.id} className="flex gap-3 py-3 border-b last:border-0 group">
                      <Link href={`/videos/${video.channel}/${video.id}`} className="relative w-40 aspect-video flex-shrink-0">
                        <Image src={video.thumbnail} alt={video.title} fill className="object-cover rounded-lg" />
                        <div className="absolute bottom-1 right-1 bg-black/80 text-white text-[10px] px-1 py-0.5 rounded font-medium">{video.duration}</div>
                      </Link>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-1">
                          <div className="flex-1 min-w-0">
                            <Link href={`/videos/${video.channel}/${video.id}`}><h3 className="font-medium text-sm line-clamp-2">{video.title}</h3></Link>
                            <div className="flex items-center gap-1.5 mt-1">
                              <Avatar className="h-4 w-4"><AvatarImage src={video.channelAvatar} /><AvatarFallback className="text-[8px]">{video.channel.charAt(0)}</AvatarFallback></Avatar>
                              <span className="text-[11px] text-muted-foreground">{video.channel}</span>
                            </div>
                            <p className="text-[11px] text-muted-foreground mt-0.5">{video.views} • {video.timeAgo}</p>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button className="p-1 rounded-full hover:bg-muted transition-colors flex-shrink-0"><MoreVertical className="h-4 w-4 text-muted-foreground" /></button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                              <DropdownMenuItem className="py-2.5 cursor-pointer flex items-center gap-2 text-sm" onClick={() => router.push(`/videos/${video.channel}/${video.id}`)}><Play className="h-4 w-4" /><span>Play now</span></DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <MobileNav />
    </div>
  )
}