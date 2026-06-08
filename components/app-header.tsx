"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Search, Bell, Menu, Mic, ArrowLeft, X, UserCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import AccountDropdown from "@/components/account-dropdown"
import MobileSidebar from "@/components/mobile-sidebar"

export default function AppHeader() {
  const router = useRouter()
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)
  const [showMobileSearch, setShowMobileSearch] = useState(false)
  const [mobileSearchQuery, setMobileSearchQuery] = useState("")
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const prefs = localStorage.getItem("deeni-language-prefs")
    if (prefs) {
      try {
        const parsed = JSON.parse(prefs)
        setIsLoggedIn(!parsed.isGuest)
      } catch {}
    }
  }, [])

  const handleMobileSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (mobileSearchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(mobileSearchQuery.trim())}`)
      setShowMobileSearch(false)
      setMobileSearchQuery("")
    }
  }

  return (
    <>
      {/* Mobile Header */}
      <header className="md:hidden fixed top-0 left-0 right-0 bg-background z-20 border-b">
        {showMobileSearch ? (
          <div className="flex items-center gap-2 px-3 py-2">
            <button
              onClick={() => { setShowMobileSearch(false); setMobileSearchQuery("") }}
              className="flex items-center justify-center h-9 w-9 rounded-full hover:bg-muted transition-colors flex-shrink-0"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <form onSubmit={handleMobileSearchSubmit} className="flex-1 flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={mobileSearchQuery}
                  onChange={(e) => setMobileSearchQuery(e.target.value)}
                  placeholder="Search"
                  autoFocus
                  className="w-full h-9 pl-3 pr-8 text-sm rounded-full border bg-muted/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                />
                {mobileSearchQuery && (
                  <button onClick={() => setMobileSearchQuery("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              <Button variant="ghost" size="icon" className="rounded-full flex-shrink-0 bg-gray-100 hover:bg-gray-200" type="button">
                <Mic className="h-5 w-5" />
              </Button>
            </form>
          </div>
        ) : (
          <div className="flex items-center justify-between px-4 py-2">
            <div className="flex items-center gap-3">
              <button onClick={() => setMobileSidebarOpen(true)} className="flex items-center justify-center h-9 w-9 rounded-full hover:bg-muted transition-colors">
                <Menu className="h-5 w-5" />
              </button>
              <Link href="/">
                <Image src="/youtube-logo.svg" alt="YouTube" width={90} height={20} className="h-5 w-auto" />
              </Link>
            </div>

            <div className="flex items-center gap-1">
              <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setShowMobileSearch(true)}>
                <Search className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Mic className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Bell className="h-5 w-5" />
              </Button>
              {isLoggedIn ? (
                <AccountDropdown />
              ) : (
                <Link href="/signin">
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <UserCircle className="h-5 w-5" />
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Desktop Header */}
      <header className="hidden md:flex fixed top-0 left-0 right-0 items-center justify-between px-4 py-2 border-b bg-background z-20">
        <div className="flex items-center gap-4">
          <Link href="/">
            <Image src="/youtube-logo.svg" alt="YouTube" width={120} height={30} className="h-6 w-auto" />
          </Link>
        </div>

        <div className="flex-1 max-w-[720px] mx-4">
          <form onSubmit={(e) => e.preventDefault()} className="flex items-center">
            <div className="relative flex-1">
              <input type="text" placeholder="Search" className="w-full h-10 py-2 px-4 rounded-l-full border focus:outline-none focus:border-blue-500" />
            </div>
            <Button variant="secondary" size="icon" className="rounded-r-full h-10 border border-l-0 bg-gray-100 hover:bg-gray-200">
              <Search className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full ml-2 bg-gray-100 hover:bg-gray-200">
              <Mic className="w-5 h-5" />
            </Button>
          </form>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="rounded-full">
            <Bell className="w-5 h-5" />
          </Button>
          {isLoggedIn ? (
            <AccountDropdown />
          ) : (
            <Link href="/signin">
              <Button variant="outline" className="rounded-full flex items-center gap-2 h-9 text-sm px-4 text-blue-600 border-blue-300 hover:bg-blue-50">
                <UserCircle className="h-5 w-5" />
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </header>

      <MobileSidebar isOpen={mobileSidebarOpen} onClose={() => setMobileSidebarOpen(false)} />
    </>
  )
}