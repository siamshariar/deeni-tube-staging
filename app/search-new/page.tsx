"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import {
  Search, X, ChevronDown, ArrowLeft, Filter, History, SlidersHorizontal,
} from "lucide-react"
import AppHeader from "@/components/app-header"
import MobileNav from "@/components/mobile-nav"
import DesktopSidebar from "@/components/desktop-sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useMediaQuery } from "@/hooks/use-media-query"
import Image from "next/image"
import Link from "next/link"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

// ---------- CONSTANTS (unchanged) ----------
const languages = [
  { code: "en", label: "English" },
  { code: "ar", label: "Arabic" },
  { code: "hi", label: "Hindi" },
  { code: "bn", label: "Bengali" },
  { code: "ur", label: "Urdu" },
  { code: "tr", label: "Turkish" },
]

const categoryOptions = [
  "Aqeedah", "Fiqh", "Hadith", "Tafsir", "Seerah",
  "Dawah", "Family", "Finance", "Youth", "Spirituality",
  "Quran", "Salah", "Zakat", "Hajj", "Fasting",
  "Dhikr", "Dua", "Islamic History", "Marriage", "Parenting",
]

const scholarOptions = [
  "Sheikh Abdul Alim", "Dr. Bilal Philips", "Mufti Menk",
  "Sheikh Yasir Qadhi", "Nouman Ali Khan", "Omar Suleiman",
  "Dr. Zakir Naik", "Sheikh Assim Al Hakeem", "Sheikh Hamza Yusuf",
  "Sheikh Ibn Uthaymeen", "Sheikh Albani", "Imam Nawawi",
]

const channelOptions = [
  "Islamic Guidance", "Merciful Servant", "Digital Mimbar",
  "Huda TV", "Peace TV", "One Islam Productions",
  "Daily Dawah", "The Deen Show", "IlmFeed", "Islam Channel",
  "Eman Channel", "Quran Weekly",
]

const sampleResults = [
  {
    id: "1",
    title: "The Purpose of Life - Powerful Islamic Reminder",
    channel: "Daily Dawah",
    channelAvatar: "/placeholder.svg?height=36&width=36",
    views: "208K views",
    timeAgo: "6 days ago",
    duration: "18:28",
    thumbnail: "/placeholder.svg?height=480&width=854",
    description: "A powerful reminder about the true purpose of life from an Islamic perspective.",
  },
  {
    id: "2",
    title: "Tafsir of Surah Al-Fatiha - Sheikh Yasir Qadhi",
    channel: "Islamic Guidance",
    channelAvatar: "/placeholder.svg?height=36&width=36",
    views: "150K views",
    timeAgo: "3 days ago",
    duration: "25:15",
    thumbnail: "/placeholder.svg?height=480&width=854",
    description: "Complete tafsir of Surah Al-Fatiha by Sheikh Yasir Qadhi with detailed explanations.",
  },
  {
    id: "3",
    title: "How to Pray Salah - Step by Step Guide",
    channel: "Digital Mimbar",
    channelAvatar: "/placeholder.svg?height=36&width=36",
    views: "500K views",
    timeAgo: "1 week ago",
    duration: "12:40",
    thumbnail: "/placeholder.svg?height=480&width=854",
    description: "Learn how to pray salah correctly with this step by step guide for beginners.",
  },
  {
    id: "4",
    title: "The Day of Judgment - Signs and Events",
    channel: "Peace TV",
    channelAvatar: "/placeholder.svg?height=36&width=36",
    views: "350K views",
    timeAgo: "2 weeks ago",
    duration: "32:10",
    thumbnail: "/placeholder.svg?height=480&width=854",
    description: "An in-depth look at the signs of the Day of Judgment from Islamic sources.",
  },
  {
    id: "5",
    title: "Powerful Dua for Protection and Guidance",
    channel: "Huda TV",
    channelAvatar: "/placeholder.svg?height=36&width=36",
    views: "420K views",
    timeAgo: "1 month ago",
    duration: "8:45",
    thumbnail: "/placeholder.svg?height=480&width=854",
    description: "A collection of powerful duas for protection from evil and guidance in life.",
  },
  {
    id: "6",
    title: "Islamic Morning Routine - Start Your Day Right",
    channel: "Daily Dawah",
    channelAvatar: "/placeholder.svg?height=36&width=36",
    views: "180K views",
    timeAgo: "3 weeks ago",
    duration: "10:30",
    thumbnail: "/placeholder.svg?height=480&width=854",
    description: "Start your day with these Islamic morning practices and duas.",
  },
]

// ---------- MULTI-SELECT COMPONENT (unchanged) ----------
function MultiSelect({ label, options, selected, onChange, searchable = false }: {
  label: string
  options: string[]
  selected: string[]
  onChange: (values: string[]) => void
  searchable?: boolean
}) {
  const [open, setOpen] = useState(false)
  const [searchText, setSearchText] = useState("")
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
        setSearchText("")
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const toggle = (value: string) => {
    onChange(
      selected.includes(value)
        ? selected.filter((v) => v !== value)
        : [...selected, value]
    )
  }

  const remove = (value: string, e: React.MouseEvent) => {
    e.stopPropagation()
    onChange(selected.filter((v) => v !== value))
  }

  const filteredOptions = searchText
    ? options.filter((opt) => opt.toLowerCase().includes(searchText.toLowerCase()))
    : options

  return (
    <div ref={ref} className="relative">
      <label className="text-sm font-medium mb-1.5 block text-foreground">{label}</label>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "w-full min-h-10 px-3 py-2 flex items-center gap-2 flex-wrap rounded-xl border text-left transition-colors bg-background",
          open ? "border-primary ring-2 ring-primary/20" : "border-border hover:border-muted-foreground"
        )}
      >
        <div className="flex flex-wrap gap-1.5 flex-1">
          {selected.length === 0 ? (
            <span className="text-sm text-muted-foreground">Select {label.toLowerCase()}...</span>
          ) : (
            selected.map((val) => (
              <span key={val} className="flex items-center gap-1 bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full font-medium">
                {val}
                <span role="button" tabIndex={0} onClick={(e) => remove(val, e)} className="cursor-pointer hover:opacity-70">
                  <X className="h-3 w-3" />
                </span>
              </span>
            ))
          )}
        </div>
        <ChevronDown className={`h-4 w-4 text-muted-foreground flex-shrink-0 ml-auto transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full bg-popover border rounded-xl shadow-lg overflow-hidden">
          {searchable && (
            <div className="p-2 border-b">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <input
                  type="text"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  placeholder={`Search ${label.toLowerCase()}...`}
                  className="w-full h-8 pl-7 pr-2 text-sm rounded-lg border bg-muted/40 focus:outline-none focus:ring-1 focus:ring-primary/30"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>
          )}
          <div className="max-h-48 overflow-y-auto">
            {filteredOptions.length === 0 ? (
              <div className="px-4 py-3 text-sm text-muted-foreground text-center">No {label.toLowerCase()} found</div>
            ) : (
              filteredOptions.map((option) => {
                const isSelected = selected.includes(option)
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => toggle(option)}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-colors hover:bg-muted",
                      isSelected && "bg-muted/60 font-medium"
                    )}
                  >
                    <span className={cn(
                      "h-4 w-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors",
                      isSelected ? "bg-primary border-primary" : "border-muted-foreground/30"
                    )}>
                      {isSelected && (
                        <svg viewBox="0 0 12 12" className="h-3 w-3 text-primary-foreground" fill="none">
                          <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </span>
                    {option}
                  </button>
                )
              })
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function VideoSkeleton() {
  return (
    <div className="flex gap-3 py-3">
      <Skeleton className="w-40 md:w-56 aspect-video rounded-lg flex-shrink-0" />
      <div className="flex-1 min-w-0 space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-3 w-32" />
      </div>
    </div>
  )
}

// ---------- MAIN PAGE ----------
export default function SearchNewPage() {
  const router = useRouter()
  const isMobile = useMediaQuery("(max-width: 768px)")
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Search state
  const [query, setQuery] = useState("")
  const [activeLangs, setActiveLangs] = useState<string[]>(["en"])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedScholars, setSelectedScholars] = useState<string[]>([])
  const [selectedChannels, setSelectedChannels] = useState<string[]>([])

  const [hasSearched, setHasSearched] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<typeof sampleResults>([])
  const [recentSearchesList, setRecentSearchesList] = useState<string[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('recentSearches')
      return stored ? JSON.parse(stored) : []
    }
    return []
  })

  // Mobile filter sheet open state (controlled)
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)

  // Focus input on mount
  useEffect(() => {
    searchInputRef.current?.focus()
  }, [])

  // Helper: check if any filter is active
  const hasFilters = useCallback(() => {
    return (
      selectedCategories.length > 0 ||
      selectedScholars.length > 0 ||
      selectedChannels.length > 0 ||
      activeLangs.filter(l => l !== "en").length > 0
    )
  }, [selectedCategories, selectedScholars, selectedChannels, activeLangs])

  // Toggle language (at least one must stay selected)
  const toggleLang = (code: string) => {
    setActiveLangs((prev) =>
      prev.includes(code)
        ? prev.length > 1 ? prev.filter((l) => l !== code) : prev
        : [...prev, code]
    )
  }

  // Reset all filters and remove search results (go back to initial view)
  const resetAllFilters = () => {
    setActiveLangs(["en"])
    setSelectedCategories([])
    setSelectedScholars([])
    setSelectedChannels([])
    // Clear search results and return to initial state
    setHasSearched(false)
    setResults([])
  }

  // Perform search (simulate API)
  const performSearch = useCallback(() => {
    if (!query.trim() && !hasFilters()) return

    // Save to recent searches
    if (query.trim()) {
      const updated = [query.trim(), ...recentSearchesList.filter(s => s !== query.trim())].slice(0, 8)
      setRecentSearchesList(updated)
      localStorage.setItem('recentSearches', JSON.stringify(updated))
    }

    setIsLoading(true)
    setHasSearched(true)

    // Close mobile filter sheet after search
    if (isMobile) {
      setMobileFilterOpen(false)
    }

    setTimeout(() => {
      setResults(sampleResults) // mock
      setIsLoading(false)
    }, 800)
  }, [query, hasFilters, recentSearchesList, isMobile])

  // Clear recent searches
  const clearRecentSearches = () => {
    setRecentSearchesList([])
    localStorage.removeItem('recentSearches')
  }

  const removeRecentSearch = (search: string) => {
    const updated = recentSearchesList.filter(s => s !== search)
    setRecentSearchesList(updated)
    localStorage.setItem('recentSearches', JSON.stringify(updated))
  }

  const handleRecentSearchClick = (search: string) => {
    setQuery(search)
    setTimeout(() => {
      const updated = [search, ...recentSearchesList.filter(s => s !== search)].slice(0, 8)
      setRecentSearchesList(updated)
      localStorage.setItem('recentSearches', JSON.stringify(updated))
      performSearch()
    }, 100)
  }

  // Filters panel content (shared between desktop sidebar and mobile sheet)
  const FiltersContent = () => (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-base">Filters</h2>
        {hasFilters() && (
          <button onClick={resetAllFilters} className="text-sm text-primary hover:underline">
            Clear all
          </button>
        )}
      </div>

      {/* Languages */}
      <div>
        <p className="text-sm font-medium mb-2">Languages</p>
        <div className="flex flex-wrap gap-2">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => toggleLang(lang.code)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-colors",
                activeLangs.includes(lang.code)
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80 text-foreground"
              )}
            >
              {lang.label}
            </button>
          ))}
        </div>
      </div>

      {/* Categories */}
      <MultiSelect
        label="Categories"
        options={categoryOptions}
        selected={selectedCategories}
        onChange={setSelectedCategories}
        searchable
      />

      {/* Scholars */}
      <MultiSelect
        label="Scholars"
        options={scholarOptions}
        selected={selectedScholars}
        onChange={setSelectedScholars}
        searchable
      />

      {/* Channels */}
      <MultiSelect
        label="Channels"
        options={channelOptions}
        selected={selectedChannels}
        onChange={setSelectedChannels}
        searchable
      />

      <Button onClick={performSearch} className="w-full rounded-full" disabled={!query.trim() && !hasFilters()}>
        <Search className="h-4 w-4 mr-2" />
        Search
      </Button>
    </div>
  )

  // Active filter chips (displayed above results)
  const FilterChips = () => {
    const activeLanguageChips = activeLangs.filter(l => l !== "en").map(lang => ({
      type: "lang",
      label: languages.find(l => l.code === lang)?.label || lang,
      value: lang,
      onRemove: () => toggleLang(lang)
    }))
    const categoryChips = selectedCategories.map(cat => ({
      type: "cat",
      label: cat,
      value: cat,
      onRemove: () => setSelectedCategories(prev => prev.filter(c => c !== cat))
    }))
    const scholarChips = selectedScholars.map(s => ({
      type: "scholar",
      label: s,
      value: s,
      onRemove: () => setSelectedScholars(prev => prev.filter(sc => sc !== s))
    }))
    const channelChips = selectedChannels.map(ch => ({
      type: "channel",
      label: ch,
      value: ch,
      onRemove: () => setSelectedChannels(prev => prev.filter(c => c !== ch))
    }))
    const allChips = [...activeLanguageChips, ...categoryChips, ...scholarChips, ...channelChips]
    if (allChips.length === 0) return null
    return (
      <div className="flex flex-wrap gap-2 mb-4">
        {allChips.map((chip, idx) => (
          <span key={idx} className="flex items-center gap-1 bg-primary/10 text-primary text-xs px-3 py-1 rounded-full font-medium">
            {chip.label}
            <button onClick={chip.onRemove} className="hover:opacity-70">
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
        <button onClick={resetAllFilters} className="text-xs text-muted-foreground hover:text-foreground">
          Clear all
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      <div className="flex">
        <DesktopSidebar className="hidden md:block" />

        <div className="flex-1 md:pl-[240px] pt-[56px] md:pt-[80px]">
          <div className="max-w-[1400px] mx-auto pb-nav-safe md:pb-6">

            {/* Mobile header with search input and filter button */}
            <div className="md:hidden flex items-center gap-2 px-4 py-3 sticky top-[56px] bg-background z-10">
              <button
                onClick={() => {
                  if (hasSearched && (query || hasFilters())) {
                    // Go back to filter view? Or just clear? We'll reset to filter view but keep state.
                    setHasSearched(false)
                  } else {
                    router.back()
                  }
                }}
                className="flex items-center justify-center h-9 w-9 rounded-full hover:bg-muted transition-colors"
                aria-label="Go back"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div className="flex-1 relative">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search"
                  className="w-full h-10 pl-10 pr-10 rounded-full bg-muted/50 text-sm placeholder:text-muted-foreground focus:outline-none focus:bg-muted transition-colors"
                  onKeyDown={(e) => e.key === "Enter" && performSearch()}
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                {query && (
                  <button onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              <Sheet open={mobileFilterOpen} onOpenChange={setMobileFilterOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="icon" className="h-9 w-9 rounded-full flex-shrink-0">
                    <SlidersHorizontal className="h-4 w-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle>Filter search</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <FiltersContent />
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* Desktop search bar */}
            <div className="hidden md:flex items-center gap-3 px-6 py-4">
              <div className="flex-1 relative max-w-2xl">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search videos, scholars, channels..."
                  className="w-full h-12 pl-12 pr-12 rounded-full bg-muted/50 text-base placeholder:text-muted-foreground focus:outline-none focus:bg-muted transition-colors"
                  onKeyDown={(e) => e.key === "Enter" && performSearch()}
                />
                {query && (
                  <button onClick={() => setQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6 px-4 md:px-6">
              {/* Desktop filters sidebar (sticky) */}
              <aside className="hidden md:block w-80 flex-shrink-0 sticky top-[80px] h-[calc(100vh-80px)] overflow-y-auto pb-8">
                <FiltersContent />
              </aside>

              {/* Main content: recent searches OR search results */}
              <div className="flex-1 min-w-0">
                {!hasSearched ? (
                  // -------- No search yet: show recent searches and a hint ----------
                  <div>
                    {recentSearchesList.length > 0 && (
                      <div className="mb-6">
                        <div className="flex items-center justify-between mb-3">
                          <h2 className="font-semibold text-sm">Recent searches</h2>
                          <button onClick={clearRecentSearches} className="text-xs text-muted-foreground hover:text-foreground">
                            Clear all
                          </button>
                        </div>
                        <div className="space-y-1">
                          {recentSearchesList.map((search) => (
                            <div key={search} className="flex items-center justify-between group">
                              <button
                                onClick={() => handleRecentSearchClick(search)}
                                className="flex items-center gap-3 py-2 px-2 rounded-lg hover:bg-muted/50 transition-colors flex-1 text-left"
                              >
                                <History className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                <span className="text-sm">{search}</span>
                              </button>
                              <button
                                onClick={() => removeRecentSearch(search)}
                                className="p-1.5 rounded-full hover:bg-muted transition-colors opacity-0 group-hover:opacity-100"
                              >
                                <X className="h-4 w-4 text-muted-foreground" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    <div className="text-center py-12 text-muted-foreground">
                      <Search className="h-12 w-12 mx-auto mb-3 opacity-30" />
                      <p>Use the filters and search box to find Islamic content</p>
                    </div>
                  </div>
                ) : (
                  // -------- Search results ----------
                  <div>
                    {/* Active filter chips */}
                    <FilterChips />

                    <p className="text-sm text-muted-foreground mb-4">
                      {isLoading ? 'Searching...' : `${results.length} results for "${query || 'filtered search'}"`}
                    </p>

                    {isLoading ? (
                      <div className="space-y-4">
                        <VideoSkeleton /><VideoSkeleton /><VideoSkeleton /><VideoSkeleton />
                      </div>
                    ) : results.length === 0 ? (
                      <div className="text-center py-16">
                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                          <Search className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-medium mb-1">No results found</h3>
                        <p className="text-muted-foreground">Try different keywords or adjust your filters</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {results.map((video) => (
                          <Link key={video.id} href={`/videos/${video.channel}/${video.id}`} className="flex gap-3 md:gap-4 group">
                            <div className="relative w-40 md:w-56 aspect-video flex-shrink-0">
                              <Image src={video.thumbnail} alt={video.title} fill className="object-cover rounded-xl" />
                              <div className="absolute bottom-1.5 right-1.5 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded font-medium">
                                {video.duration}
                              </div>
                              <div className="absolute inset-0 bg-black/20 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="bg-black/60 rounded-full p-2">
                                  <svg viewBox="0 0 24 24" className="h-5 w-5 text-white fill-white"><path d="M8 5v14l11-7z"/></svg>
                                </div>
                              </div>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-medium text-sm md:text-base line-clamp-2 group-hover:text-primary transition-colors">
                                {video.title}
                              </h3>
                              <div className="flex items-center gap-2 mt-1">
                                <Avatar className="h-5 w-5">
                                  <AvatarImage src={video.channelAvatar} />
                                  <AvatarFallback className="text-[10px]">{video.channel.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <span className="text-xs text-muted-foreground">{video.channel}</span>
                              </div>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {video.views} • {video.timeAgo}
                              </p>
                              {!isMobile && video.description && (
                                <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{video.description}</p>
                              )}
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <MobileNav />
    </div>
  )
}