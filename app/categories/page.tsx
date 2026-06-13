"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Search, X, FolderOpen, SortAsc, Globe } from "lucide-react"
import AppHeader from "@/components/app-header"
import MobileNav from "@/components/mobile-nav"
import DesktopSidebar from "@/components/desktop-sidebar"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useMediaQuery } from "@/hooks/use-media-query"
import { cn } from "@/lib/utils"
import Link from "next/link"

// Mock categories with language support (in real app, each category has supported languages)
const allCategories = [
  { id: "1", name: "Aqeedah", slug: "aqeedah", description: "Islamic Creed and Belief", videoCount: 245, languages: ["en", "ar", "bn"] },
  { id: "2", name: "Fiqh", slug: "fiqh", description: "Islamic Jurisprudence", videoCount: 189, languages: ["en", "ar", "hi"] },
  { id: "3", name: "Hadith", slug: "hadith", description: "Prophetic Traditions", videoCount: 312, languages: ["en", "ar", "ur"] },
  { id: "4", name: "Tafsir", slug: "tafsir", description: "Quranic Exegesis", videoCount: 278, languages: ["en", "ar"] },
  { id: "5", name: "Seerah", slug: "seerah", description: "Prophetic Biography", videoCount: 156, languages: ["en", "bn"] },
  { id: "6", name: "Dawah", slug: "dawah", description: "Islamic Propagation", videoCount: 198, languages: ["en", "hi"] },
  { id: "7", name: "Family", slug: "family", description: "Marriage and Family Life", videoCount: 134, languages: ["en"] },
  { id: "8", name: "Finance", slug: "finance", description: "Islamic Finance", videoCount: 87, languages: ["en"] },
  { id: "9", name: "Youth", slug: "youth", description: "Youth Development", videoCount: 112, languages: ["en"] },
  { id: "10", name: "Spirituality", slug: "spirituality", description: "Tazkiyah and Purification", videoCount: 203, languages: ["en", "ar"] },
  { id: "11", name: "Quran", slug: "quran", description: "Quran Recitation and Memorization", videoCount: 345, languages: ["en", "ar", "bn"] },
  { id: "12", name: "Salah", slug: "salah", description: "Prayer and Worship", videoCount: 167, languages: ["en", "ar", "hi"] },
  { id: "13", name: "Zakat", slug: "zakat", description: "Charity and Alms", videoCount: 56, languages: ["en"] },
  { id: "14", name: "Hajj", slug: "hajj", description: "Pilgrimage", videoCount: 78, languages: ["en", "ar"] },
  { id: "15", name: "Fasting", slug: "fasting", description: "Sawm and Ramadan", videoCount: 145, languages: ["en", "bn"] },
  { id: "16", name: "Dhikr", slug: "dhikr", description: "Remembrance of Allah", videoCount: 92, languages: ["en", "ar"] },
]

const languageOptions = [
  { code: "en", label: "English" },
  { code: "ar", label: "Arabic" },
  { code: "hi", label: "Hindi" },
  { code: "bn", label: "Bengali" },
]

function CategorySkeleton() {
  return (
    <div className="flex items-center gap-4 px-2 py-3">
      <Skeleton className="h-12 w-12 rounded-xl flex-shrink-0" />
      <div className="flex-1 min-w-0 space-y-2">
        <Skeleton className="h-4 w-36" />
        <Skeleton className="h-3 w-48" />
      </div>
      <Skeleton className="h-3 w-12 flex-shrink-0" />
    </div>
  )
}

export default function CategoriesPage() {
  const router = useRouter()
  const isMobile = useMediaQuery("(max-width: 768px)")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(["en"])
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [isLoading, setIsLoading] = useState(true)

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

  const filteredCategories = allCategories
    .filter(category => {
      // Language filter
      if (!selectedLanguages.some(lang => category.languages.includes(lang))) return false
      // Search filter
      if (searchQuery) {
        const q = searchQuery.toLowerCase()
        return category.name.toLowerCase().includes(q) || category.description.toLowerCase().includes(q)
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
            <h1 className="font-semibold text-lg">Categories</h1>
          </div>

          <div className="max-w-[1000px] mx-auto px-4 md:px-6">
            <div className="py-4 md:py-6">
              {/* Desktop title */}
              {!isMobile && (
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center">
                    <FolderOpen className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold">Categories</h1>
                    <p className="text-sm text-muted-foreground">Browse videos by topic</p>
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
                    placeholder="Search categories"
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

            {/* Categories list */}
            {isLoading ? (
              <div className="divide-y">
                {Array.from({ length: 6 }).map((_, i) => <CategorySkeleton key={i} />)}
              </div>
            ) : filteredCategories.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <FolderOpen className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-1">No categories found</h3>
                <p className="text-muted-foreground">Try adjusting your language or search filters</p>
              </div>
            ) : (
              <div className="divide-y">
                {filteredCategories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/categories/${category.slug}`}
                    className="flex items-center gap-3 md:gap-4 px-2 py-3 hover:bg-muted/50 transition-colors group"
                  >
                    <div className="h-11 w-11 md:h-12 md:w-12 bg-muted rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-muted/80 transition-colors">
                      <FolderOpen className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm md:text-base truncate group-hover:text-primary transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-xs md:text-sm text-muted-foreground">{category.description}</p>
                    </div>
                    <span className="text-xs text-muted-foreground flex-shrink-0">
                      {category.videoCount} video{category.videoCount !== 1 ? 's' : ''}
                    </span>
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