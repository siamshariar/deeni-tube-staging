"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Search, X, GraduationCap } from "lucide-react"
import AppHeader from "@/components/app-header"
import MobileNav from "@/components/mobile-nav"
import DesktopSidebar from "@/components/desktop-sidebar"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useMediaQuery } from "@/hooks/use-media-query"
import Link from "next/link"

const scholars = [
  { id: "1", name: "Sheikh Abdul Alim", slug: "abdul-alim", subtitle: "Islamic Scholar", image: "/portrait-of-abdul-alim.png" },
  { id: "2", name: "Dr. Bilal Philips", slug: "bilal-philips", subtitle: "Islamic Preacher", image: "/placeholder.svg?height=48&width=48" },
  { id: "3", name: "Mufti Menk", slug: "mufti-menk", subtitle: "Grand Mufti", image: "/placeholder.svg?height=48&width=48" },
  { id: "4", name: "Sheikh Yasir Qadhi", slug: "yasir-qadhi", subtitle: "Islamic Scholar", image: "/placeholder.svg?height=48&width=48" },
  { id: "5", name: "Nouman Ali Khan", slug: "nouman-ali-khan", subtitle: "Quran Instructor", image: "/placeholder.svg?height=48&width=48" },
  { id: "6", name: "Omar Suleiman", slug: "omar-suleiman", subtitle: "Islamic Scholar", image: "/placeholder.svg?height=48&width=48" },
  { id: "7", name: "Dr. Zakir Naik", slug: "zakir-naik", subtitle: "Comparative Religion", image: "/placeholder.svg?height=48&width=48" },
  { id: "8", name: "Sheikh Assim Al Hakeem", slug: "assim-al-hakeem", subtitle: "Islamic Scholar", image: "/placeholder.svg?height=48&width=48" },
  { id: "9", name: "Sheikh Hamza Yusuf", slug: "hamza-yusuf", subtitle: "Islamic Scholar", image: "/placeholder.svg?height=48&width=48" },
  { id: "10", name: "Imam Nawawi", slug: "imam-nawawi", subtitle: "Hadith Scholar", image: "/placeholder.svg?height=48&width=48" },
  { id: "11", name: "Sheikh Ibn Uthaymeen", slug: "ibn-uthaymeen", subtitle: "Islamic Scholar", image: "/placeholder.svg?height=48&width=48" },
  { id: "12", name: "Sheikh Albani", slug: "albani", subtitle: "Hadith Scholar", image: "/placeholder.svg?height=48&width=48" },
]

function ScholarSkeleton() {
  return (
    <div className="flex items-center gap-4 px-2 py-3">
      <Skeleton className="h-14 w-14 md:h-16 md:w-16 rounded-full flex-shrink-0" />
      <div className="flex-1 min-w-0 space-y-2">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-3 w-28" />
      </div>
    </div>
  )
}

export default function ScholarsPage() {
  const router = useRouter()
  const isMobile = useMediaQuery("(max-width: 768px)")
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600)
    return () => clearTimeout(timer)
  }, [])

  const filteredScholars = scholars.filter(s => {
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    return s.name.toLowerCase().includes(q) || s.subtitle.toLowerCase().includes(q)
  })

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
            <h1 className="font-semibold text-lg">Scholars</h1>
          </div>

          <div className="max-w-[800px] mx-auto px-4 md:px-6">
            <div className="py-4 md:py-6">
              {!isMobile && (
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                    <GraduationCap className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold">Scholars</h1>
                    <p className="text-sm text-muted-foreground">Browse Islamic scholars and lecturers</p>
                  </div>
                </div>
              )}

              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search scholars"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-muted/50 rounded-full text-sm outline-none focus:bg-muted transition-colors"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            {isLoading ? (
              <div className="divide-y">
                <ScholarSkeleton /><ScholarSkeleton /><ScholarSkeleton />
                <ScholarSkeleton /><ScholarSkeleton /><ScholarSkeleton />
              </div>
            ) : filteredScholars.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <GraduationCap className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-1">No scholars found</h3>
                <p className="text-muted-foreground">Try different keywords</p>
              </div>
            ) : (
              <div className="divide-y">
                {filteredScholars.map((scholar) => (
                  <Link
                    key={scholar.id}
                    href={`/scholars/${scholar.slug}`}
                    className="flex items-center gap-3 md:gap-4 px-2 py-3 hover:bg-muted/50 transition-colors"
                  >
                    <Avatar className="h-12 w-12 md:h-14 md:w-14 flex-shrink-0">
                      <AvatarImage src={scholar.image} />
                      <AvatarFallback>{scholar.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm md:text-base truncate">{scholar.name}</h3>
                      <p className="text-xs md:text-sm text-muted-foreground">{scholar.subtitle}</p>
                    </div>
                  </Link>
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