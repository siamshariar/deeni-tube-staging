"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search, X, ChevronDown, ArrowLeft } from "lucide-react"
import AppHeader from "@/components/app-header"
import MobileNav from "@/components/mobile-nav"
import DesktopSidebar from "@/components/desktop-sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Image from "next/image"
import Link from "next/link"

const languages = [
  { code: "en", label: "En" },
  { code: "ar", label: "Ar" },
  { code: "hi", label: "Hi" },
  { code: "bn", label: "Bn" },
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
  },
]

type MultiSelectProps = {
  label: string
  options: string[]
  selected: string[]
  onChange: (values: string[]) => void
  searchable?: boolean
}

function MultiSelect({ label, options, selected, onChange, searchable = false }: MultiSelectProps) {
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
      <p className="text-sm font-medium mb-1.5 text-foreground">{label}</p>

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`w-full min-h-10 px-3 py-2 flex items-center gap-2 flex-wrap rounded-lg border text-left transition-colors ${
          open
            ? "border-primary ring-2 ring-primary/20"
            : "border-border hover:border-muted-foreground"
        } bg-background`}
      >
        <div className="flex flex-wrap gap-1.5 flex-1">
          {selected.length === 0 ? (
            <span className="text-sm text-muted-foreground">Search {label.toLowerCase()}...</span>
          ) : (
            selected.map((val) => (
              <span
                key={val}
                className="flex items-center gap-1 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-md font-medium"
              >
                {val}
                <span
                  role="button"
                  tabIndex={0}
                  onClick={(e) => remove(val, e)}
                  onKeyDown={(e) => e.key === "Enter" && remove(val, e as any)}
                  className="cursor-pointer hover:opacity-70"
                >
                  <X className="h-3 w-3" />
                </span>
              </span>
            ))
          )}
        </div>
        <ChevronDown
          className={`h-4 w-4 text-muted-foreground flex-shrink-0 ml-auto transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full bg-popover border rounded-lg shadow-lg overflow-hidden">
          {searchable && (
            <div className="p-2 border-b">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <input
                  type="text"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  placeholder={`Search ${label.toLowerCase()}...`}
                  className="w-full h-8 pl-7 pr-2 text-sm rounded border bg-muted/40 focus:outline-none focus:ring-1 focus:ring-primary/30"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>
          )}
          <div className="max-h-48 overflow-y-auto">
            {filteredOptions.length === 0 ? (
              <div className="px-4 py-3 text-sm text-muted-foreground text-center">
                No {label.toLowerCase()} found
              </div>
            ) : (
              filteredOptions.map((option) => {
                const isSelected = selected.includes(option)
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => toggle(option)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-colors hover:bg-muted ${
                      isSelected ? "bg-muted/60 font-medium" : ""
                    }`}
                  >
                    <span
                      className={`h-4 w-4 rounded border flex items-center justify-center flex-shrink-0 ${
                        isSelected
                          ? "bg-primary border-primary text-primary-foreground"
                          : "border-border"
                      }`}
                    >
                      {isSelected && (
                        <svg viewBox="0 0 12 12" className="h-3 w-3" fill="none">
                          <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
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

export default function SearchNewPage() {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [activeLangs, setActiveLangs] = useState<string[]>(["en"])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedScholars, setSelectedScholars] = useState<string[]>([])
  const [selectedChannels, setSelectedChannels] = useState<string[]>([])
  const [hasSearched, setHasSearched] = useState(false)
  const [results, setResults] = useState<typeof sampleResults>([])

  const toggleLang = (code: string) => {
    setActiveLangs((prev) =>
      prev.includes(code)
        ? prev.length > 1 ? prev.filter((l) => l !== code) : prev
        : [...prev, code]
    )
  }

  const clearAll = () => {
    setQuery("")
    setActiveLangs(["en"])
    setSelectedCategories([])
    setSelectedScholars([])
    setSelectedChannels([])
    setHasSearched(false)
    setResults([])
  }

  const handleSearch = () => {
    setHasSearched(true)
    setResults(sampleResults)
  }

  const hasFilters =
    selectedCategories.length > 0 ||
    selectedScholars.length > 0 ||
    selectedChannels.length > 0

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      
      <div className="flex">
        <div className="hidden md:block">
          <DesktopSidebar />
        </div>

        <div className="flex-1 md:pl-[240px] pt-[56px] md:pt-[80px]">
          <div className="max-w-2xl mx-auto pb-nav-safe md:pb-6">

            {/* Back + Title - Mobile Only */}
            <div className="flex items-center gap-2 px-4 py-2 md:hidden border-b">
              <button
                onClick={() => {
                  if (hasSearched) {
                    setHasSearched(false)
                    setResults([])
                  } else {
                    router.back()
                  }
                }}
                className="flex items-center justify-center h-9 w-9 rounded-full hover:bg-muted transition-colors"
                aria-label="Go back"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <h1 className="font-semibold text-base">Search</h1>
            </div>

            {/* Search Input */}
            <div className="px-4 py-3 border-b md:border-b-0">
              <div className="relative flex items-center">
                <Search className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search videos..."
                  className="w-full h-10 pl-9 pr-9 rounded-lg border bg-muted/40 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSearch()
                  }}
                />
                {query && (
                  <button
                    onClick={() => setQuery("")}
                    className="absolute right-3 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Advanced Search or Results */}
            {!hasSearched ? (
              <div className="px-4 pt-4 space-y-5">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-sm text-foreground">Advanced search</h2>
                  {hasFilters && (
                    <button
                      onClick={clearAll}
                      className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2"
                    >
                      Clear all
                    </button>
                  )}
                </div>

                {/* Language Filter */}
                <div>
                  <p className="text-sm font-medium mb-2">Languages</p>
                  <div className="flex flex-wrap gap-2">
                    {languages.map((lang) => {
                      const isActive = activeLangs.includes(lang.code)
                      return (
                        <button
                          key={lang.code}
                          onClick={() => toggleLang(lang.code)}
                          className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors border ${
                            isActive
                              ? "bg-primary text-primary-foreground border-primary"
                              : "bg-background text-foreground border-border hover:bg-muted"
                          }`}
                        >
                          {lang.label}
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Categories */}
                <MultiSelect
                  label="Categories"
                  options={categoryOptions}
                  selected={selectedCategories}
                  onChange={setSelectedCategories}
                  searchable={true}
                />

                {/* Scholars */}
                <MultiSelect
                  label="Scholars"
                  options={scholarOptions}
                  selected={selectedScholars}
                  onChange={setSelectedScholars}
                  searchable={true}
                />

                {/* Channels */}
                <MultiSelect
                  label="Channels"
                  options={channelOptions}
                  selected={selectedChannels}
                  onChange={setSelectedChannels}
                  searchable={true}
                />

                {/* Search Button */}
                <button
                  type="button"
                  onClick={handleSearch}
                  className="w-full h-10 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                >
                  <Search className="h-4 w-4" />
                  Search
                </button>
              </div>
            ) : (
              /* Search Results */
              <div className="px-4 pt-4">
                <p className="text-sm text-muted-foreground mb-4">
                  {results.length} results for &ldquo;{query}&rdquo;
                </p>
                <div className="space-y-4">
                  {results.map((video) => (
                    <Link
                      key={video.id}
                      href={`/videos/${video.id}`}
                      className="flex gap-3 group"
                    >
                      <div className="relative w-40 h-24 flex-shrink-0">
                        <Image
                          src={video.thumbnail}
                          alt={video.title}
                          fill
                          className="object-cover rounded-lg"
                        />
                        <div className="absolute bottom-1 right-1 bg-black bg-opacity-80 text-white text-xs px-1 py-0.5 rounded">
                          {video.duration}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
                          {video.title}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <Avatar className="h-5 w-5">
                            <AvatarImage src={video.channelAvatar} />
                            <AvatarFallback>{video.channel.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span className="text-xs text-muted-foreground">{video.channel}</span>
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          <span>{video.views}</span>
                          <span className="mx-1">•</span>
                          <span>{video.timeAgo}</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <MobileNav />
    </div>
  )
}