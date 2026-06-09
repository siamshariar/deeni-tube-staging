"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import VideoCard from "@/components/video-card"
import MobileNav from "@/components/mobile-nav"
import DesktopSidebar from "@/components/desktop-sidebar"
import AppHeader from "@/components/app-header"
import LanguagePrompt from "@/components/language-prompt"
import { useLanguage } from "@/hooks/use-language"
import { useChannelPreferences } from "@/hooks/use-channel-preferences"

const chipItems = [
  "All", "Mawlana", "Dawah", "Podcasts", "News", "Tarawih", "Live",
  "Recitation", "Quran", "Fatwa", "Islamic Studies", "Ramadan", "Eid",
  "Nasheed", "Series", "Lectures", "Recently uploaded", "Watched", "New to you",
]

export default function Home() {
  const [prevScrollPos, setPrevScrollPos] = useState(0)
  const [visible, setVisible] = useState(true)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(false)
  const [activeChip, setActiveChip] = useState("All")
  const chipListRef = useRef<HTMLDivElement>(null)
  const isDragging = useRef(false)
  const startX = useRef(0)
  const scrollLeftPos = useRef(0)

  const [initialLoading, setInitialLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [videos, setVideos] = useState<any[]>([])
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const loadingRef = useRef<HTMLDivElement>(null)
  const isFetchingRef = useRef(false)

  const { preferredLanguages, hasSelected, isGuest, savePreferences, skipForNow } = useLanguage()
  const { getIgnoredChannels, getFollowedChannels } = useChannelPreferences()

  const fetchVideos = useCallback(async (pageNum: number) => {
    await new Promise((resolve) => setTimeout(resolve, 1500))
    const newVideos = Array.from({ length: 8 }).map((_, i) => ({
      id: `video-${pageNum}-${i}`,
      title: `Video Title ${pageNum * 8 + i}`,
      channel: `Channel ${pageNum * 8 + i}`,
      views: `${Math.floor(Math.random() * 1000)}K views`,
      timestamp: `${Math.floor(Math.random() * 12) + 1} days ago`,
      duration: `${Math.floor(Math.random() * 10) + 1}:${Math.floor(Math.random() * 60).toString().padStart(2, "0")}`,
    }))
    if (pageNum >= 5) setHasMore(false)
    return newVideos
  }, [])

  useEffect(() => {
    let mounted = true
    const loadInitial = async () => {
      const initialVideos = await fetchVideos(1)
      if (mounted) { setVideos(initialVideos); setInitialLoading(false) }
    }
    loadInitial()
    return () => { mounted = false }
  }, [fetchVideos])

  useEffect(() => {
    if (initialLoading) return
    const handleObserver = (entries: IntersectionObserverEntry[]) => {
      const [target] = entries
      if (target.isIntersecting && hasMore && !isFetchingRef.current) setPage((prevPage) => prevPage + 1)
    }
    observerRef.current = new IntersectionObserver(handleObserver, { rootMargin: "0px 0px 200px 0px", threshold: 0.1 })
    const currentLoadingRef = loadingRef.current
    if (currentLoadingRef) observerRef.current.observe(currentLoadingRef)
    return () => {
      if (observerRef.current && currentLoadingRef) observerRef.current.unobserve(currentLoadingRef)
      observerRef.current?.disconnect()
    }
  }, [initialLoading])

  useEffect(() => {
    if (page === 1) return
    const loadMore = async () => {
      isFetchingRef.current = true
      setLoadingMore(true)
      const newVideos = await fetchVideos(page)
      setVideos((prev) => [...prev, ...newVideos])
      setLoadingMore(false)
      isFetchingRef.current = false
    }
    loadMore()
  }, [page, fetchVideos])

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY
      const isScrollingDown = currentScrollPos > prevScrollPos
      if (isScrollingDown && currentScrollPos > 150) setVisible(false)
      else setVisible(true)
      setPrevScrollPos(currentScrollPos)
    }
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [prevScrollPos])

  const checkScrollArrows = useCallback(() => {
    if (chipListRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = chipListRef.current
      setShowLeftArrow(scrollLeft > 12)
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 12)
    }
  }, [])

  useEffect(() => {
    const container = chipListRef.current
    if (container) {
      container.addEventListener("scroll", checkScrollArrows, { passive: true })
      checkScrollArrows()
    }
    return () => { if (container) container.removeEventListener("scroll", checkScrollArrows) }
  }, [checkScrollArrows])

  // Also check on resize and after chips render
  useEffect(() => {
    checkScrollArrows()
  }, [checkScrollArrows])

  const scrollChips = (direction: "left" | "right") => {
    if (chipListRef.current) {
      const { clientWidth } = chipListRef.current
      const scrollAmount = clientWidth * 0.75
      const scrollPosition = direction === "left"
        ? chipListRef.current.scrollLeft - scrollAmount
        : chipListRef.current.scrollLeft + scrollAmount
      chipListRef.current.scrollTo({ left: scrollPosition, behavior: "smooth" })
    }
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    isDragging.current = true
    startX.current = e.pageX - (chipListRef.current?.offsetLeft || 0)
    scrollLeftPos.current = chipListRef.current?.scrollLeft || 0
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return
    e.preventDefault()
    const x = e.pageX - (chipListRef.current?.offsetLeft || 0)
    const walk = (x - startX.current) * 2
    if (chipListRef.current) chipListRef.current.scrollLeft = scrollLeftPos.current - walk
  }

  const handleMouseUp = () => { isDragging.current = false }

  const handleTouchStart = (e: React.TouchEvent) => {
    isDragging.current = true
    startX.current = e.touches[0].pageX - (chipListRef.current?.offsetLeft || 0)
    scrollLeftPos.current = chipListRef.current?.scrollLeft || 0
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current) return
    const x = e.touches[0].pageX - (chipListRef.current?.offsetLeft || 0)
    const walk = (x - startX.current) * 2
    if (chipListRef.current) chipListRef.current.scrollLeft = scrollLeftPos.current - walk
  }

  const handleTouchEnd = () => { isDragging.current = false }

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <LanguagePrompt open={!hasSelected} onSave={(langs) => savePreferences(langs, true)} onSkip={skipForNow} />
      <AppHeader />

      <div className="flex">
        <DesktopSidebar className="hidden md:block" />

        <main className="flex-1 md:pl-[240px] md:pt-[108px] pt-0 md:pb-0 pb-nav-safe overflow-hidden w-full max-w-[100vw]">
          {hasSelected && preferredLanguages.length > 0 && (
            <div className="px-4 py-1.5 text-xs text-muted-foreground bg-muted/30 border-b hidden md:block">
              Content: {preferredLanguages.map(l => l.toUpperCase()).join(", ")}{isGuest && " (Guest)"}
            </div>
          )}

          {/* YouTube-style Chip Bar */}
          <div
            className={`relative border-b bg-background z-10 transition-transform duration-300 md:fixed md:top-[56px] md:left-[240px] md:right-0 md:z-10 md:bg-background w-full max-w-[100vw] ${
              visible ? "fixed top-[56px] left-0 right-0" : "fixed top-0 left-0 right-0 -translate-y-full"
            }`}
          >
            {/* Left gradient overlay */}
            <div className={`absolute left-0 top-0 bottom-0 w-14 z-10 bg-gradient-to-r from-background via-background/95 to-transparent pointer-events-none transition-opacity duration-200 ${
              showLeftArrow ? "opacity-100" : "opacity-0"
            }`} />

            {/* Left Arrow */}
            <div className={`absolute left-1 top-0 bottom-0 z-20 flex items-center transition-opacity duration-200 ${
              showLeftArrow ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}>
              <button
                className="h-9 w-9 flex items-center justify-center bg-black/90 hover:bg-black rounded-full shadow-lg"
                onClick={() => scrollChips("left")}
                aria-label="Scroll left"
              >
                <ChevronLeft className="h-5 w-5 text-white" />
              </button>
            </div>

            {/* Chip List */}
            <div
              ref={chipListRef}
              className="flex gap-2 px-[0.75rem] py-2.5 overflow-x-auto scrollbar-none cursor-grab active:cursor-grabbing select-none"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {chipItems.map((chip) => (
                <button
                  key={chip}
                  onClick={() => setActiveChip(chip)}
                  className={`px-3.5 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-colors flex-shrink-0 ${
                    activeChip === chip
                      ? "bg-foreground text-background"
                      : "bg-muted hover:bg-muted/80 text-foreground"
                  }`}
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Right gradient overlay */}
            <div className={`absolute right-0 top-0 bottom-0 w-14 z-10 bg-gradient-to-l from-background via-background/95 to-transparent pointer-events-none transition-opacity duration-200 ${
              showRightArrow ? "opacity-100" : "opacity-0"
            }`} />

            {/* Right Arrow */}
            <div className={`absolute right-1 top-0 bottom-0 z-20 flex items-center transition-opacity duration-200 ${
              showRightArrow ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}>
              <button
                className="h-9 w-9 flex items-center justify-center bg-black/90 hover:bg-black rounded-full shadow-lg"
                onClick={() => scrollChips("right")}
                aria-label="Scroll right"
              >
                <ChevronRight className="h-5 w-5 text-white" />
              </button>
            </div>
          </div>

          {/* Initial Loading - Desktop */}
          {initialLoading && (
            <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={`dsk-${i}`} className="flex flex-col">
                  <Skeleton className="aspect-video w-full rounded-lg" />
                  <div className="flex mt-2 gap-2">
                    <Skeleton className="h-9 w-9 rounded-full flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-3 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Initial Loading - Mobile */}
          {initialLoading && (
            <div className="flex flex-col md:hidden pt-[48px]">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={`msk-${i}`} className="flex flex-col p-3">
                  <Skeleton className="aspect-video w-full rounded-lg" />
                  <div className="flex mt-3 gap-3">
                    <Skeleton className="h-9 w-9 rounded-full flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-3 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Desktop Grid */}
          {!initialLoading && (
            <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
              {videos.map((video) => (
                <VideoCard key={video.id} isHorizontal={false} />
              ))}
              {loadingMore && Array.from({ length: 4 }).map((_, i) => (
                <div key={`ldsk-${i}`} className="flex flex-col">
                  <Skeleton className="aspect-video w-full rounded-lg" />
                  <div className="flex mt-2 gap-2">
                    <Skeleton className="h-9 w-9 rounded-full flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-3 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Mobile List */}
          {!initialLoading && (
            <div className="flex flex-col md:hidden pt-[48px]">
              {videos.map((video) => (
                <VideoCard key={video.id} isHorizontal={true} />
              ))}
              {loadingMore && Array.from({ length: 2 }).map((_, i) => (
                <div key={`lmsk-${i}`} className="flex flex-col p-3">
                  <Skeleton className="aspect-video w-full rounded-lg" />
                  <div className="flex mt-3 gap-3">
                    <Skeleton className="h-9 w-9 rounded-full flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-3 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {hasMore && !initialLoading && (
            <div ref={loadingRef} className="flex justify-center p-4">
              {loadingMore && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  Loading...
                </div>
              )}
            </div>
          )}

          {!hasMore && !initialLoading && videos.length > 0 && (
            <div className="text-center p-4 text-muted-foreground text-sm">You've reached the end</div>
          )}
        </main>
      </div>
      <MobileNav />
    </div>
  )
}