"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Search, X, ChevronDown } from "lucide-react"
import MobileNav from "@/components/mobile-nav"

const languages = [
  { code: "en", label: "En" },
  { code: "ar", label: "Ar" },
  { code: "hi", label: "Hi" },
  { code: "bn", label: "Bn" },
  { code: "ur", label: "Ur" },
  { code: "tr", label: "Tr" },
]

const categoryOptions = [
  "Aqeedah", "Fiqh", "Hadith", "Tafsir", "Seerah",
  "Dawah", "Family", "Finance", "Youth", "Spirituality",
]

const scholarOptions = [
  "Sheikh Abdul Alim", "Dr. Bilal Philips", "Mufti Menk",
  "Sheikh Yasir Qadhi", "Nouman Ali Khan", "Omar Suleiman",
]

const channelOptions = [
  "Islamic Guidance", "Merciful Servant", "Digital Mimbar",
  "Huda TV", "Peace TV", "One Islam Productions",
]

type MultiSelectProps = {
  label: string
  options: string[]
  selected: string[]
  onChange: (values: string[]) => void
}

function MultiSelect({ label, options, selected, onChange }: MultiSelectProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
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

  return (
    <div ref={ref} className="relative">
      <p className="text-sm font-medium mb-1.5 text-foreground">{label}</p>

      {/* Trigger */}
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
            <span className="text-sm text-muted-foreground">Select {label.toLowerCase()}…</span>
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

      {/* Dropdown */}
      {open && (
        <div className="absolute z-50 mt-1 w-full bg-popover border rounded-lg shadow-lg overflow-hidden">
          <div className="max-h-48 overflow-y-auto">
            {options.map((option) => {
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
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default function SearchPage() {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [activeLangs, setActiveLangs] = useState<string[]>(["en"])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedScholars, setSelectedScholars] = useState<string[]>([])
  const [selectedChannels, setSelectedChannels] = useState<string[]>([])

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
  }

  const hasFilters =
    selectedCategories.length > 0 ||
    selectedScholars.length > 0 ||
    selectedChannels.length > 0

  return (
    <div className="min-h-screen bg-background pb-nav-safe md:pb-6">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b">
          <div className="flex items-center gap-2 px-4 py-3">
            <button
              onClick={() => router.back()}
              className="flex items-center justify-center h-9 w-9 rounded-full hover:bg-muted transition-colors"
              aria-label="Go back"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="font-semibold text-base">Search</h1>
          </div>

          {/* Search Input */}
          <div className="px-4 pb-3">
            <div className="relative flex items-center">
              <Search className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search videos…"
                className="w-full h-10 pl-9 pr-9 rounded-lg border bg-muted/40 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
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
        </div>

        {/* Advanced Search */}
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
          />

          {/* Scholars */}
          <MultiSelect
            label="Scholars"
            options={scholarOptions}
            selected={selectedScholars}
            onChange={setSelectedScholars}
          />

          {/* Channels */}
          <MultiSelect
            label="Channels"
            options={channelOptions}
            selected={selectedChannels}
            onChange={setSelectedChannels}
          />

          {/* Search Button */}
          <button
            type="button"
            className="w-full h-10 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            <Search className="h-4 w-4" />
            Search
          </button>
        </div>
      </div>

      <MobileNav />
    </div>
  )
}
