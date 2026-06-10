"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Search, X, FolderOpen } from "lucide-react"
import AppHeader from "@/components/app-header"
import MobileNav from "@/components/mobile-nav"
import DesktopSidebar from "@/components/desktop-sidebar"
import { Skeleton } from "@/components/ui/skeleton"
import { useMediaQuery } from "@/hooks/use-media-query"
import Link from "next/link"

const categories = [
  { id: "1", name: "Aqeedah", slug: "aqeedah", description: "Islamic Creed and Belief", videoCount: 245 },
  { id: "2", name: "Fiqh", slug: "fiqh", description: "Islamic Jurisprudence", videoCount: 189 },
  { id: "3", name: "Hadith", slug: "hadith", description: "Prophetic Traditions", videoCount: 312 },
  { id: "4", name: "Tafsir", slug: "tafsir", description: "Quranic Exegesis", videoCount: 278 },
  { id: "5", name: "Seerah", slug: "seerah", description: "Prophetic Biography", videoCount: 156 },
  { id: "6", name: "Dawah", slug: "dawah", description: "Islamic Propagation", videoCount: 198 },
  { id: "7", name: "Family", slug: "family", description: "Marriage and Family Life", videoCount: 134 },
  { id: "8", name: "Finance", slug: "finance", description: "Islamic Finance", videoCount: 87 },
  { id: "9", name: "Youth", slug: "youth", description: "Youth Development", videoCount: 112 },
  { id: "10", name: "Spirituality", slug: "spirituality", description: "Tazkiyah and Purification", videoCount: 203 },
  { id: "11", name: "Quran", slug: "quran", description: "Quran Recitation and Memorization", videoCount: 345 },
  { id: "12", name: "Salah", slug: "salah", description: "Prayer and Worship", videoCount: 167 },
  { id: "13", name: "Zakat", slug: "zakat", description: "Charity and Alms", videoCount: 56 },
  { id: "14", name: "Hajj", slug: "hajj", description: "Pilgrimage", videoCount: 78 },
  { id: "15", name: "Fasting", slug: "fasting", description: "Sawm and Ramadan", videoCount: 145 },
  { id: "16", name: "Dhikr", slug: "dhikr", description: "Remembrance of Allah", videoCount: 92 },
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
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600)
    return () => clearTimeout(timer)
  }, [])

  const filteredCategories = categories.filter(c => {
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    return c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)
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
            <h1 className="font-semibold text-lg">Categories</h1>
          </div>

          <div className="max-w-[800px] mx-auto px-4 md:px-6">
            <div className="py-4 md:py-6">
              {!isMobile && (
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                    <FolderOpen className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold">Categories</h1>
                    <p className="text-sm text-muted-foreground">Browse videos by topic</p>
                  </div>
                </div>
              )}

              <div className="relative mb-4">
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
            </div>

            {isLoading ? (
              <div className="divide-y">
                <CategorySkeleton /><CategorySkeleton /><CategorySkeleton />
                <CategorySkeleton /><CategorySkeleton /><CategorySkeleton />
              </div>
            ) : filteredCategories.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <FolderOpen className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-1">No categories found</h3>
                <p className="text-muted-foreground">Try different keywords</p>
              </div>
            ) : (
              <div className="divide-y">
                {filteredCategories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/categories/${category.slug}`}
                    className="flex items-center gap-3 md:gap-4 px-2 py-3 hover:bg-muted/50 transition-colors"
                  >
                    <div className="h-11 w-11 md:h-12 md:w-12 bg-muted rounded-xl flex items-center justify-center flex-shrink-0">
                      <FolderOpen className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm md:text-base truncate">{category.name}</h3>
                      <p className="text-xs md:text-sm text-muted-foreground">{category.description}</p>
                    </div>
                    <span className="text-xs text-muted-foreground flex-shrink-0">{category.videoCount} videos</span>
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