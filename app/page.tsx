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
  const chipContainerRef = useRef<HTMLDivElement>(null)
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  
  // Drag state
  const isDragging = useRef(false)
  const startX = useRef(0)
  const scrollLeftStart = useRef(0)
  const hasDragged = useRef(false)
  const dragThreshold = 5

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

  const updateArrows = useCallback(() => {
    const el = scrollContainerRef.current
    if (!el) return
    
    const scrollLeft = el.scrollLeft
    const scrollWidth = el.scrollWidth
    const clientWidth = el.clientWidth
    const maxScroll = scrollWidth - clientWidth
    
    // Show left arrow if scrolled more than 10px
    setShowLeftArrow(scrollLeft > 10)
    // Show right arrow if not scrolled to end (with 10px tolerance)
    setShowRightArrow(scrollLeft < maxScroll - 10)
  }, [])

  useEffect(() => {
    const el = scrollContainerRef.current
    if (!el) return
    
    el.addEventListener("scroll", updateArrows, { passive: true })
    window.addEventListener("resize", updateArrows)
    
    // Check arrows after delays to ensure content is rendered
    const timeouts = [0, 100, 300, 500, 1000].map(delay => 
      setTimeout(updateArrows, delay)
    )
    
    return () => {
      el.removeEventListener("scroll", updateArrows)
      window.removeEventListener("resize", updateArrows)
      timeouts.forEach(clearTimeout)
    }
  }, [updateArrows, initialLoading])

  const scrollChips = (direction: "left" | "right") => {
    const el = scrollContainerRef.current
    if (!el) return
    
    const scrollAmount = el.clientWidth * 0.8
    
    if (direction === "left") {
      el.scrollBy({ left: -scrollAmount, behavior: "smooth" })
    } else {
      el.scrollBy({ left: scrollAmount, behavior: "smooth" })
    }
  }

  // Mouse drag handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    // Only initiate drag on the container, not buttons
    const target = e.target as HTMLElement
    if (target.tagName === "BUTTON" || target.closest("button")) return
    
    isDragging.current = true
    hasDragged.current = false
    startX.current = e.clientX
    scrollLeftStart.current = scrollContainerRef.current?.scrollLeft || 0
    
    if (scrollContainerRef.current) {
      scrollContainerRef.current.style.cursor = "grabbing"
      scrollContainerRef.current.style.userSelect = "none"
      scrollContainerRef.current.style.scrollBehavior = "auto"
    }
    
    e.preventDefault()
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current || !scrollContainerRef.current) return
      
      const dx = e.clientX - startX.current
      
      if (Math.abs(dx) > dragThreshold) {
        hasDragged.current = true
      }
      
      if (hasDragged.current) {
        e.preventDefault()
        scrollContainerRef.current.scrollLeft = scrollLeftStart.current - dx
      }
    }

    const handleMouseUp = (e: MouseEvent) => {
      if (!isDragging.current) return
      
      isDragging.current = false
      
      if (scrollContainerRef.current) {
        scrollContainerRef.current.style.cursor = ""
        scrollContainerRef.current.style.userSelect = ""
        scrollContainerRef.current.style.scrollBehavior = "smooth"
      }
      
      if (hasDragged.current) {
        const handleClick = (e: Event) => {
          e.stopPropagation()
          e.preventDefault()
          document.removeEventListener("click", handleClick, true)
        }
        document.addEventListener("click", handleClick, true)
        
        setTimeout(() => {
          document.removeEventListener("click", handleClick, true)
        }, 0)
      }
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseup", handleMouseUp)
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", handleMouseUp)
    }
  }, [])

  const handleChipClick = (chip: string) => {
    setActiveChip(chip)
  }

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <LanguagePrompt open={!hasSelected} onSave={(langs) => savePreferences(langs, true)} onSkip={skipForNow} />
      <AppHeader />

      <div className="flex">
        <DesktopSidebar className="hidden md:block" />

        <main className="flex-1 md:pl-[240px] md:pt-[62px] pt-0 md:pb-0 pb-nav-safe overflow-hidden w-full max-w-[100vw]">
          {hasSelected && preferredLanguages.length > 0 && (
            <div className="px-4 py-1.5 text-xs text-muted-foreground bg-muted/30 border-b hidden md:block">
              Content: {preferredLanguages.map(l => l.toUpperCase()).join(", ")}{isGuest && " (Guest)"}
            </div>
          )}

          {/* Chip Bar - YouTube Style with Fixed Padding */}
          <div
            className={`sticky top-[56px] md:top-[32px] z-10 bg-background border-b ${
              visible ? "" : "-translate-y-full"
            } transition-transform duration-300`}
          >
            <div className="relative h-12">
              {/* Scrollable Chip Container - Always same padding */}
              <div
                ref={scrollContainerRef}
                className="h-full overflow-x-auto scrollbar-none px-[0.75rem] mr-4"
                style={{ 
                  scrollbarWidth: "none", 
                  msOverflowStyle: "none",
                  WebkitOverflowScrolling: "touch",
                }}
                onMouseDown={handleMouseDown}
                onScroll={updateArrows}
              >
                <div 
                  ref={chipContainerRef}
                  className="flex gap-2 py-2 w-max items-center h-full"
                >
                  {chipItems.map((chip) => (
                    <button
                      key={chip}
                      onClick={() => handleChipClick(chip)}
                      className={`px-3.5 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 select-none ${
                        activeChip === chip
                          ? "bg-foreground text-background"
                          : "bg-muted hover:bg-muted/80 text-foreground"
                      }`}
                    >
                      {chip}
                    </button>
                  ))}
                </div>
              </div>

              {/* Left Arrow Overlay */}
              <div 
                className={`absolute left-0 top-0 bottom-0 z-20 flex items-center transition-opacity duration-200 ${
                  showLeftArrow ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
              >
                <div className="absolute left-0 top-0 bottom-0 w-14 bg-gradient-to-r from-background via-background to-transparent" />
                <button
                  className="relative ml-2 h-9 w-9 rounded-full bg-black hover:bg-black/90 flex items-center justify-center shadow-lg"
                  onClick={() => scrollChips("left")}
                  aria-label="Previous"
                >
                  <ChevronLeft className="h-5 w-5 text-white" />
                </button>
              </div>

              {/* Right Arrow Overlay */}
              <div 
                className={`absolute right-0 top-0 bottom-0 z-20 flex items-center justify-end transition-opacity duration-200 ${
                  showRightArrow ? "opacity-100" : "opacity-0 pointer-events-none"
                }`}
              >
                <div className="absolute right-0 top-0 bottom-0 w-14 bg-gradient-to-l from-background via-background to-transparent" />
                <button
                  className="relative mr-3 h-9 w-9 rounded-full bg-black hover:bg-black/90 flex items-center justify-center shadow-lg"
                  onClick={() => scrollChips("right")}
                  aria-label="Next"
                >
                  <ChevronRight className="h-5 w-5 text-white" />
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          {initialLoading && (
            <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={`dsk-${i}`} className="flex flex-col">
                  <Skeleton className="aspect-video w-full rounded-lg" />
                  <div className="flex mt-2 gap-2">
                    <Skeleton className="h-9 w-9 rounded-full flex-shrink-0" />
                    <div className="flex-1 space-y-2"><Skeleton className="h-4 w-full" /><Skeleton className="h-3 w-3/4" /><Skeleton className="h-3 w-1/2" /></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {initialLoading && (
            <div className="flex flex-col md:hidden">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={`msk-${i}`} className="flex flex-col p-3">
                  <Skeleton className="aspect-video w-full rounded-lg" />
                  <div className="flex mt-3 gap-3">
                    <Skeleton className="h-9 w-9 rounded-full flex-shrink-0" />
                    <div className="flex-1 space-y-2"><Skeleton className="h-4 w-full" /><Skeleton className="h-3 w-3/4" /><Skeleton className="h-3 w-1/2" /></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!initialLoading && (
            <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
              {videos.map((video) => <VideoCard key={video.id} isHorizontal={false} />)}
              {loadingMore && Array.from({ length: 4 }).map((_, i) => (
                <div key={`ldsk-${i}`} className="flex flex-col">
                  <Skeleton className="aspect-video w-full rounded-lg" />
                  <div className="flex mt-2 gap-2">
                    <Skeleton className="h-9 w-9 rounded-full flex-shrink-0" />
                    <div className="flex-1 space-y-2"><Skeleton className="h-4 w-full" /><Skeleton className="h-3 w-3/4" /><Skeleton className="h-3 w-1/2" /></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!initialLoading && (
            <div className="flex flex-col md:hidden">
              {videos.map((video) => <VideoCard key={video.id} isHorizontal={true} />)}
              {loadingMore && Array.from({ length: 2 }).map((_, i) => (
                <div key={`lmsk-${i}`} className="flex flex-col p-3">
                  <Skeleton className="aspect-video w-full rounded-lg" />
                  <div className="flex mt-3 gap-3">
                    <Skeleton className="h-9 w-9 rounded-full flex-shrink-0" />
                    <div className="flex-1 space-y-2"><Skeleton className="h-4 w-full" /><Skeleton className="h-3 w-3/4" /><Skeleton className="h-3 w-1/2" /></div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {hasMore && !initialLoading && (
            <div ref={loadingRef} className="flex justify-center p-4">
              {loadingMore && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />Loading...
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