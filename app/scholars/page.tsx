"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Search, X, GraduationCap, SortAsc } from "lucide-react"
import AppHeader from "@/components/app-header"
import MobileNav from "@/components/mobile-nav"
import DesktopSidebar from "@/components/desktop-sidebar"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { useMediaQuery } from "@/hooks/use-media-query"
import { cn } from "@/lib/utils"
import Link from "next/link"

// Mock scholar data with language support
const allScholars = [
  { id: "1", name: "Sheikh Abdul Alim", slug: "abdul-alim", designation: "Islamic Scholar", image: "/portrait-of-abdul-alim.png", languages: ["en", "ar", "bn"] },
  { id: "2", name: "Dr. Bilal Philips", slug: "bilal-philips", designation: "Islamic Preacher", image: "/placeholder.svg?height=48&width=48", languages: ["en"] },
  { id: "3", name: "Mufti Menk", slug: "mufti-menk", designation: "Grand Mufti", image: "/placeholder.svg?height=48&width=48", languages: ["en", "ur"] },
  { id: "4", name: "Sheikh Yasir Qadhi", slug: "yasir-qadhi", designation: "Islamic Scholar", image: "/placeholder.svg?height=48&width=48", languages: ["en"] },
  { id: "5", name: "Nouman Ali Khan", slug: "nouman-ali-khan", designation: "Quran Instructor", image: "/placeholder.svg?height=48&width=48", languages: ["en"] },
  { id: "6", name: "Omar Suleiman", slug: "omar-suleiman", designation: "Islamic Scholar", image: "/placeholder.svg?height=48&width=48", languages: ["en"] },
  { id: "7", name: "Dr. Zakir Naik", slug: "zakir-naik", designation: "Comparative Religion", image: "/placeholder.svg?height=48&width=48", languages: ["en", "hi"] },
  { id: "8", name: "Sheikh Assim Al Hakeem", slug: "assim-al-hakeem", designation: "Islamic Scholar", image: "/placeholder.svg?height=48&width=48", languages: ["en", "ar"] },
  { id: "9", name: "Sheikh Hamza Yusuf", slug: "hamza-yusuf", designation: "Islamic Scholar", image: "/placeholder.svg?height=48&width=48", languages: ["en"] },
  { id: "10", name: "Imam Nawawi", slug: "imam-nawawi", designation: "Hadith Scholar", image: "/placeholder.svg?height=48&width=48", languages: ["ar"] },
  { id: "11", name: "Sheikh Ibn Uthaymeen", slug: "ibn-uthaymeen", designation: "Islamic Scholar", image: "/placeholder.svg?height=48&width=48", languages: ["ar"] },
  { id: "12", name: "Sheikh Albani", slug: "albani", designation: "Hadith Scholar", image: "/placeholder.svg?height=48&width=48", languages: ["ar", "fr"] },
  // Add Arabic names
  { id: "13", name: "الشيخ محمد العثيمين", slug: "ibn-uthaymeen-ar", designation: "عالم مسلم", image: "/placeholder.svg?height=48&width=48", languages: ["ar"] },
  { id: "14", name: "محمد صديق المنشاوي", slug: "minshawi", designation: "قارئ قرآن", image: "/placeholder.svg?height=48&width=48", languages: ["ar"] },
]

const languageOptions = [
  { code: "en", label: "English" },
  { code: "ar", label: "Arabic" },
  { code: "hi", label: "Hindi" },
  { code: "bn", label: "Bengali" },
  { code: "ur", label: "Urdu" },
  { code: "tr", label: "Turkish" },
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
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(["en"])
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600)
    return () => clearTimeout(timer)
  }, [])

  const toggleLanguage = (code: string) => {
    setSelectedLanguages(prev =>
      prev.includes(code)
        ? prev.length > 1 ? prev.filter(l => l !== code) : prev
        : [...prev, code]
    )
  }

  const filteredScholars = allScholars
    .filter(scholar => {
      // Language filter: scholar must have at least one of selected languages
      if (!selectedLanguages.some(lang => scholar.languages.includes(lang))) return false
      // Search filter
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        return scholar.name.toLowerCase().includes(q) || scholar.designation.toLowerCase().includes(q)
      }
      return true
    })
    .sort((a, b) => {
      if (sortOrder === "asc") return a.name.localeCompare(b.name)
      return b.name.localeCompare(a.name)
    })

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <div className="flex">
        <DesktopSidebar className="hidden md:block" />
        <div className="flex-1 md:pl-[240px] pt-[56px] md:pt-[80px] pb-nav-safe md:pb-6">
          {/* Mobile header */}
          <div className="md:hidden flex items-center gap-3 px-4 py-3 border-b sticky top-[56px] bg-background z-10">
            <button onClick={() => router.back()} className="flex items-center justify-center h-9 w-9 rounded-full hover:bg-muted transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="font-semibold text-lg">Scholars</h1>
          </div>

          <div className="max-w-[1000px] mx-auto px-4 md:px-6">
            <div className="py-4 md:py-6">
              {/* Desktop title */}
              {!isMobile && (
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                    <GraduationCap className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold">Scholars</h1>
                    <p className="text-sm text-muted-foreground">Browse Islamic scholars and lecturers</p>
                  </div>
                </div>
              )}

              {/* Language chips */}
              <div className="flex flex-wrap gap-2 mb-4">
                {languageOptions.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => toggleLanguage(lang.code)}
                    className={cn(
                      "px-4 py-1.5 rounded-full text-sm font-medium transition-colors",
                      selectedLanguages.includes(lang.code)
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted hover:bg-muted/80 text-foreground"
                    )}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>

              {/* Search and sort row */}
              <div className="flex items-center gap-2 mb-4">
                <div className="relative flex-1">
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
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setSortOrder(prev => prev === "asc" ? "desc" : "asc")}
                  className="rounded-full flex-shrink-0"
                  aria-label="Sort A-Z"
                >
                  <SortAsc className={cn("h-4 w-4 transition-transform", sortOrder === "desc" && "rotate-180")} />
                </Button>
              </div>
            </div>

            {/* Scholar list */}
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
                <p className="text-muted-foreground">Try different language filters or keywords</p>
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
                      <AvatarImage src={scholar.image} alt={scholar.name} />
                      <AvatarFallback>{scholar.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm md:text-base truncate">{scholar.name}</h3>
                      <p className="text-xs md:text-sm text-muted-foreground">{scholar.designation}</p>
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