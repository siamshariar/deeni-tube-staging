"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Search, X, ChevronDown, Bell, BellRing, BellOff } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import AppHeader from "@/components/app-header"
import MobileNav from "@/components/mobile-nav"
import DesktopSidebar from "@/components/desktop-sidebar"
import { useChannelPreferences } from "@/hooks/use-channel-preferences"

export interface ListItem {
  id: string
  name: string
  slug: string
  image?: string
  subtitle?: string
  description?: string
}

interface ListPageProps {
  title: string
  items: ListItem[]
  languageFilter?: boolean
  showSort?: boolean
  basePath: string
  itemType: "channel" | "scholar" | "category"
}

const languages = [
  { code: "en", label: "En" },
  { code: "ar", label: "Ar" },
  { code: "hi", label: "Hi" },
  { code: "bn", label: "Bn" },
]

export default function ListPage({ title, items, languageFilter = true, showSort = true, basePath, itemType }: ListPageProps) {
  const router = useRouter()
  const [activeLang, setActiveLang] = useState("en")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [searchQuery, setSearchQuery] = useState("")

  // Channel preference hooks (only used for channel type)
  const { getPreference, setPreference } = useChannelPreferences()

  const filteredItems = items
    .filter((item) => {
      if (!searchQuery) return true
      return item.name.toLowerCase().includes(searchQuery.toLowerCase())
    })
    .sort((a, b) => {
      if (sortOrder === "asc") return a.name.localeCompare(b.name)
      return b.name.localeCompare(a.name)
    })

  const getDetailPath = (slug: string) => {
    if (itemType === "channel") {
      return `/channel-new/${slug}`
    }
    return `/${basePath}/${slug}`
  }

  const handleBellClick = (e: React.MouseEvent, itemId: string) => {
    e.stopPropagation()
    const current = getPreference(itemId)
    const next = current === "all" ? "personalized" : current === "personalized" ? "none" : "all"
    setPreference(itemId, next)
  }

  const getBellIcon = (itemId: string) => {
    const pref = getPreference(itemId)
    if (pref === "none") return <BellOff className="h-4 w-4 text-muted-foreground/50" />
    if (pref === "all") return <Bell className="h-4 w-4 text-primary" />
    return <BellRing className="h-4 w-4 text-primary" />
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      <div className="flex">
        <DesktopSidebar className="hidden md:block" />

        <div className="flex-1 md:pl-[240px] pt-[56px] md:pt-[80px]">
          {/* Mobile Back + Title */}
          <div className="md:hidden flex items-center gap-3 px-4 py-2 border-b">
            <button
              onClick={() => router.back()}
              className="flex items-center justify-center h-9 w-9 rounded-full hover:bg-muted transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="font-semibold text-lg">{title}</h1>
          </div>

          {/* Language Filter */}
          {languageFilter && (
            <div className="flex gap-2 px-4 py-3 overflow-x-auto scrollbar-hide border-b">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setActiveLang(lang.code)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors border ${
                    activeLang === lang.code
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background text-foreground border-border hover:bg-muted"
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          )}

          {/* Search + Sort */}
          <div className="flex items-center gap-3 px-4 py-3 border-b">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder={`Search ${title.toLowerCase()}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-9 h-9 text-sm rounded-full bg-muted/40"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            {showSort && (
              <button
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full border text-xs font-medium hover:bg-muted transition-colors flex-shrink-0"
              >
                A-Z
                <ChevronDown className={`h-3 w-3 transition-transform ${sortOrder === "desc" ? "rotate-180" : ""}`} />
              </button>
            )}
          </div>

          {/* List Items */}
          <div className="divide-y">
            {filteredItems.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground text-sm">
                No {itemType}s found
              </div>
            ) : (
              filteredItems.map((item) => (
                <div
                  key={item.id}
                  className="w-full flex items-center gap-4 px-4 py-3 hover:bg-muted/50 transition-colors cursor-pointer"
                  onClick={() => router.push(getDetailPath(item.slug))}
                >
                  <Avatar className="h-12 w-12 flex-shrink-0">
                    <AvatarImage src={item.image || `/placeholder.svg?height=48&width=48`} alt={item.name} />
                    <AvatarFallback>{item.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{item.name}</p>
                    {item.subtitle && (
                      <p className="text-xs text-muted-foreground truncate">{item.subtitle}</p>
                    )}
                    {item.description && (
                      <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{item.description}</p>
                    )}
                  </div>

                  {/* Bell icon for channel preference - only for channel type */}
                  {itemType === "channel" && (
                    <button
                      onClick={(e) => handleBellClick(e, item.id)}
                      className="p-2 rounded-full hover:bg-muted transition-colors flex-shrink-0"
                      title={
                        getPreference(item.id) === "none"
                          ? "Ignored - Click to follow"
                          : getPreference(item.id) === "all"
                          ? "All notifications - Click to change"
                          : "Personalized - Click to change"
                      }
                    >
                      {getBellIcon(item.id)}
                    </button>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <MobileNav />
    </div>
  )
}