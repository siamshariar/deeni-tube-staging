"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Globe, MoreVertical, Play } from "lucide-react"
import AppHeader from "@/components/app-header"
import MobileNav from "@/components/mobile-nav"
import DesktopSidebar from "@/components/desktop-sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useMediaQuery } from "@/hooks/use-media-query"

const scholarData: Record<string, any> = {
  "abdul-alim": {
    id: "abdul-alim",
    name: "Sheikh Abdul Alim",
    designation: "Islamic Scholar & Lecturer",
    image: "/portrait-of-abdul-alim.png",
    description: "Sheikh Abdul Alim is a renowned Islamic scholar known for his deep knowledge of Quran and Hadith. He has dedicated his life to spreading authentic Islamic teachings through lectures, books, and online content. His approach combines traditional Islamic scholarship with contemporary relevance.",
    website: "abdulalim.com",
    facebook: "facebook.com/sheikhabdulalim",
    twitter: "twitter.com/abdulalim",
    youtube: "youtube.com/@sheikhabdulalim",
  },
  "bilal-philips": {
    id: "bilal-philips",
    name: "Dr. Bilal Philips",
    designation: "Islamic Preacher & Author",
    image: "/placeholder.svg?height=96&width=96",
    description: "Dr. Bilal Philips is a Jamaican-born Canadian Islamic scholar, teacher, speaker, and author. He is the founder and chancellor of the International Open University.",
    website: "bilalphilips.com",
    facebook: "facebook.com/drbilalphilips",
    twitter: "twitter.com/drbilalphilips",
    youtube: "youtube.com/@bilalphilips",
  },
}

const defaultScholar = {
  id: "default",
  name: "Scholar",
  designation: "Islamic Scholar",
  image: "/placeholder.svg?height=96&width=96",
  description: "A respected Islamic scholar and teacher.",
  website: "",
  facebook: "",
  twitter: "",
  youtube: "",
}

const languages = [
  { code: "en", label: "English" },
  { code: "ar", label: "Arabic" },
  { code: "hi", label: "Hindi" },
  { code: "bn", label: "Bengali" },
  { code: "ur", label: "Urdu" },
]

const videos = [
  { id: "v1", title: "The Importance of Seeking Knowledge in Islam", channel: "Islamic Guidance", channelAvatar: "/placeholder.svg?height=36&width=36", views: "150K views", timeAgo: "3 days ago", duration: "25:15", thumbnail: "/placeholder.svg?height=480&width=854" },
  { id: "v2", title: "Understanding Tawheed - The Oneness of Allah", channel: "Daily Dawah", channelAvatar: "/placeholder.svg?height=36&width=36", views: "208K views", timeAgo: "6 days ago", duration: "18:28", thumbnail: "/placeholder.svg?height=480&width=854" },
  { id: "v3", title: "Lessons from Surah Al-Kahf", channel: "Digital Mimbar", channelAvatar: "/placeholder.svg?height=36&width=36", views: "500K views", timeAgo: "1 week ago", duration: "35:10", thumbnail: "/placeholder.svg?height=480&width=854" },
  { id: "v4", title: "The Life of Prophet Muhammad (PBUH) - Part 1", channel: "Islamic Guidance", channelAvatar: "/placeholder.svg?height=36&width=36", views: "1.2M views", timeAgo: "2 weeks ago", duration: "45:00", thumbnail: "/placeholder.svg?height=480&width=854" },
  { id: "v5", title: "Fiqh of Worship - Salah and Zakat", channel: "Digital Mimbar", channelAvatar: "/placeholder.svg?height=36&width=36", views: "89K views", timeAgo: "3 weeks ago", duration: "28:45", thumbnail: "/placeholder.svg?height=480&width=854" },
  { id: "v6", title: "The Power of Dua - Connecting with Allah", channel: "Peace TV", channelAvatar: "/placeholder.svg?height=36&width=36", views: "320K views", timeAgo: "1 month ago", duration: "22:30", thumbnail: "/placeholder.svg?height=480&width=854" },
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

// Mobile video skeleton (horizontal, matches final video list)
function MobileVideoSkeleton() {
  return (
    <div className="flex gap-3 py-3">
      <Skeleton className="w-40 aspect-video rounded-lg flex-shrink-0" />
      <div className="flex-1 min-w-0 space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <div className="flex items-center gap-2 mt-2">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
    </div>
  )
}

export default function ScholarDetailPage() {
  const router = useRouter()
  const params = useParams()
  const isMobile = useMediaQuery("(max-width: 768px)")
  const [activeLang, setActiveLang] = useState("en")
  const [showFullDescription, setShowFullDescription] = useState(false)
  const [showAllLinks, setShowAllLinks] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const slug = params.slug as string
  const scholar = scholarData[slug] || { ...defaultScholar, name: slug?.replace(/-/g, ' ') || "Scholar", id: slug }

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600)
    return () => clearTimeout(timer)
  }, [slug])

  const activeLangLabel = languages.find(l => l.code === activeLang)?.label || activeLang

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      <div className="md:hidden flex items-center gap-3 px-4 py-3 border-b sticky top-[56px] bg-background z-10">
        <button onClick={() => router.back()} className="flex items-center justify-center h-9 w-9 rounded-full hover:bg-muted transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="font-semibold text-lg truncate">{scholar.name}</h1>
      </div>

      <div className="flex">
        <DesktopSidebar className="hidden md:block" />

        <div className="flex-1 md:pl-[240px] md:pt-[80px] pb-nav-safe">
          {isLoading ? (
            <div className="max-w-[1096px] mx-auto">
              {/* Skeleton for scholar info (matches final layout) */}
              <div className="px-4 md:px-6 pt-20 pb-4 border-b">
                <div className="flex flex-col md:flex-row md:items-start gap-4">
                  {/* Avatar skeleton */}
                  <div className="flex-shrink-0">
                    <Skeleton className="h-20 w-20 md:h-24 md:w-24 rounded-full" />
                  </div>
                  <div className="flex-1 min-w-0 space-y-3">
                    <Skeleton className="h-6 w-40 md:w-48" />
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-full max-w-md" />
                    <Skeleton className="h-4 w-full max-w-sm" />
                    <div className="flex gap-2 mt-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Language tabs skeleton */}
              <div className="border-b px-4 md:px-6 py-3">
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-16 rounded-full" />
                  <Skeleton className="h-8 w-16 rounded-full" />
                  <Skeleton className="h-8 w-16 rounded-full" />
                  <Skeleton className="h-8 w-16 rounded-full" />
                </div>
              </div>

              {/* Videos count skeleton */}
              <div className="px-4 md:px-6 py-3">
                <Skeleton className="h-4 w-32" />
              </div>

              {/* Desktop video grid skeleton (only visible on md+) */}
              <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 px-4 md:px-6 pb-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <VideoSkeleton key={i} />
                ))}
              </div>

              {/* Mobile video list skeleton (only visible on mobile) */}
              <div className="flex flex-col md:hidden px-4 pb-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <MobileVideoSkeleton key={i} />
                ))}
              </div>
            </div>
          ) : (
            <div className="max-w-[1096px] mx-auto">
              {/* Scholar Info - Mobile: left-aligned, desktop: side by side */}
              <div className="px-4 md:px-6 pt-8 md:pt-6 pb-4 border-b">
                <div className="flex flex-col md:flex-row md:items-start mt-10 gap-4">
                  <Avatar className="h-20 w-20 md:h-24 md:w-24 flex-shrink-0 ring-2 ring-muted">
                    <AvatarImage src={scholar.image} alt={scholar.name} />
                    <AvatarFallback className="text-xl">{scholar.name.charAt(0)}</AvatarFallback>
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-1">
                      <h1 className="text-xl md:text-2xl font-bold">{scholar.name}</h1>
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5">{scholar.designation}</p>

                    <div className="mt-2">
                      <p className="text-sm text-muted-foreground">
                        {showFullDescription ? (
                          <>
                            {scholar.description}
                            <button onClick={() => setShowFullDescription(false)} className="text-primary ml-1 hover:underline font-medium">Show less</button>
                          </>
                        ) : (
                          <>
                            {scholar.description.slice(0, 120)}
                            {scholar.description.length > 120 && (
                              <button onClick={() => setShowFullDescription(true)} className="text-primary ml-1 hover:underline font-medium">...more</button>
                            )}
                          </>
                        )}
                      </p>
                    </div>

                    {/* Links */}
                    {scholar.website && (
                      <div className="mt-2 space-y-1">
                        <Link href={`https://${scholar.website}`} target="_blank" className="text-sm text-primary hover:underline flex items-center gap-1">
                          <Globe className="h-3 w-3" />{scholar.website}
                        </Link>
                        {showAllLinks ? (
                          <>
                            {scholar.facebook && <Link href={`https://${scholar.facebook}`} target="_blank" className="text-sm text-primary hover:underline block">Facebook</Link>}
                            {scholar.twitter && <Link href={`https://${scholar.twitter}`} target="_blank" className="text-sm text-primary hover:underline block">Twitter</Link>}
                            {scholar.youtube && <Link href={`https://${scholar.youtube}`} target="_blank" className="text-sm text-primary hover:underline block">YouTube</Link>}
                            <button onClick={() => setShowAllLinks(false)} className="text-xs text-primary hover:underline font-medium">Show less</button>
                          </>
                        ) : (
                          <button onClick={() => setShowAllLinks(true)} className="text-xs text-primary hover:underline font-medium">and 3 more links</button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Language Tabs */}
              <div className="border-b">
                <div className="flex gap-2 px-4 md:px-6 py-3 overflow-x-auto scrollbar-none">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => setActiveLang(lang.code)}
                      className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                        activeLang === lang.code
                          ? "bg-foreground text-background"
                          : "bg-muted hover:bg-muted/80 text-foreground"
                      }`}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Videos Count */}
              <div className="px-4 md:px-6 py-3">
                <p className="text-sm text-muted-foreground">
                  {videos.length} videos in {activeLangLabel}
                </p>
              </div>

              {/* Desktop Grid */}
              <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 px-4 md:px-6 pb-6">
                {videos.map((video) => (
                  <div key={video.id} className="flex flex-col group">
                    <Link href={`/videos/${video.channel}/${video.id}`} className="relative aspect-video w-full">
                      <Image src={video.thumbnail} alt={video.title} fill className="object-cover rounded-xl" />
                      <div className="absolute bottom-1.5 right-1.5 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded font-medium">{video.duration}</div>
                      <div className="absolute inset-0 bg-black/20 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="bg-black/60 rounded-full p-2"><Play className="h-5 w-5 text-white fill-white" /></div>
                      </div>
                    </Link>
                    <div className="flex mt-3 gap-2">
                      <Link href={`/channel/${video.channel}`}>
                        <Avatar className="h-9 w-9 flex-shrink-0"><AvatarImage src={video.channelAvatar} /><AvatarFallback>{video.channel.charAt(0)}</AvatarFallback></Avatar>
                      </Link>
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
                ))}
              </div>

              {/* Mobile List */}
              <div className="flex flex-col md:hidden px-4 pb-6">
                {videos.map((video) => (
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
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <MobileNav />
    </div>
  )
}