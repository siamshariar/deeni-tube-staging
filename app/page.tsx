"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import VideoCard from "@/components/video-card"
import MobileNav from "@/components/mobile-nav"
import DesktopSidebar from "@/components/desktop-sidebar"
import AppHeader from "@/components/app-header"
import LanguagePrompt from "@/components/language-prompt"
import { useLanguage } from "@/hooks/use-language"
import { useChannelPreferences } from "@/hooks/use-channel-preferences"

export default function Home() {
  const [prevScrollPos, setPrevScrollPos] = useState(0)
  const [visible, setVisible] = useState(true)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(true)
  const tagsContainerRef = useRef<HTMLDivElement>(null)
  const tabsListInnerRef = useRef<HTMLDivElement>(null)

  const [loading, setLoading] = useState(true)
  const [videos, setVideos] = useState<any[]>([])
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)
  const observer = useRef<IntersectionObserver | null>(null)
  const loadingRef = useRef<HTMLDivElement>(null)

  // Language + Channel Preferences
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
      duration: `${Math.floor(Math.random() * 10) + 1}:${Math.floor(Math.random() * 60)
        .toString()
        .padStart(2, "0")}`,
    }))

    if (pageNum >= 5) setHasMore(false)
    return newVideos
  }, [])

  useEffect(() => {
    const loadInitialVideos = async () => {
      setLoading(true)
      try {
        const initialVideos = await fetchVideos(1)
        setVideos(initialVideos)
      } catch (error) {
        console.error("Error fetching videos:", error)
      } finally {
        setLoading(false)
      }
    }
    loadInitialVideos()
  }, [fetchVideos])

  useEffect(() => {
    if (loading) return

    const handleObserver = (entries: IntersectionObserverEntry[]) => {
      const [target] = entries
      if (target.isIntersecting && hasMore) setPage((prevPage) => prevPage + 1)
    }

    observer.current = new IntersectionObserver(handleObserver, {
      rootMargin: "0px 0px 200px 0px",
      threshold: 0.1,
    })

    if (loadingRef.current) observer.current.observe(loadingRef.current)
    return () => { if (observer.current) observer.current.disconnect() }
  }, [loading, hasMore])

  useEffect(() => {
    if (page === 1) return
    const loadMoreVideos = async () => {
      setLoading(true)
      try {
        const newVideos = await fetchVideos(page)
        setVideos((prev) => [...prev, ...newVideos])
      } catch (error) {
        console.error("Error fetching more videos:", error)
      } finally {
        setLoading(false)
      }
    }
    loadMoreVideos()
  }, [page, fetchVideos])

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY
      const isScrollingDown = currentScrollPos > prevScrollPos
      if (isScrollingDown && currentScrollPos > 150) {
        setVisible(false)
      } else {
        setVisible(true)
      }
      setPrevScrollPos(currentScrollPos)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [prevScrollPos])

  const checkScrollArrows = () => {
    if (tabsListInnerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = tabsListInnerRef.current
      setShowLeftArrow(scrollLeft > 0)
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  useEffect(() => {
    const container = tabsListInnerRef.current
    if (container) {
      container.addEventListener("scroll", checkScrollArrows)
      checkScrollArrows()
    }
    return () => { if (container) container.removeEventListener("scroll", checkScrollArrows) }
  }, [])

  const scrollTags = (direction: "left" | "right") => {
    if (tabsListInnerRef.current) {
      const scrollAmount = 300
      const scrollPosition =
        direction === "left"
          ? tabsListInnerRef.current.scrollLeft - scrollAmount
          : tabsListInnerRef.current.scrollLeft + scrollAmount
      tabsListInnerRef.current.scrollTo({ left: scrollPosition, behavior: "smooth" })
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Language Selection Prompt - First Time Only */}
      <LanguagePrompt
        open={!hasSelected}
        onSave={(langs) => savePreferences(langs, true)}
        onSkip={skipForNow}
      />

      <AppHeader />

      <div className="flex">
        <DesktopSidebar className="hidden md:block" />

        <main className="flex-1 md:pl-[240px] md:pt-[108px] pt-[36px] md:pb-0 pb-nav-safe overflow-x-hidden">
          {/* Language Indicator - Shows selected languages */}
          {hasSelected && preferredLanguages.length > 0 && (
            <div className="px-4 py-1.5 text-xs text-muted-foreground bg-muted/30 border-b hidden md:block">
              Content: {preferredLanguages.map(l => l.toUpperCase()).join(", ")}
              {isGuest && " (Guest)"}
            </div>
          )}

          {/* Category Tabs - Fixed */}
          <div
            className={`relative overflow-hidden border-b fixed left-0 right-0 bg-background z-10 transition-transform duration-300 md:fixed md:top-[56px] md:left-[240px] md:right-0 md:z-10 md:bg-background max-w-[100vw] ${
              visible ? "top-[56px]" : "top-0 -translate-y-full"
            }`}
          >
            <button
              className={`hidden md:flex absolute left-0 top-1/2 transform -translate-y-1/2 z-20 h-12 px-2 items-center justify-center bg-gradient-to-r from-background to-transparent ${
                showLeftArrow ? "opacity-100" : "opacity-0 pointer-events-none"
              } transition-opacity duration-200`}
              onClick={() => scrollTags("left")}
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <div ref={tagsContainerRef} id="tags-container">
              <Tabs defaultValue="all" className="w-full">
                <TabsList
                  ref={tabsListInnerRef}
                  className="h-12 px-4 py-1 bg-background w-full flex-nowrap overflow-x-auto scrollbar-hide sticky left-0"
                >
                  <TabsTrigger value="all" className="px-4 py-1 rounded-full data-[state=active]:bg-black data-[state=active]:text-white cursor-pointer text-xs">All</TabsTrigger>
                  <TabsTrigger value="mawlana" className="px-4 py-1 rounded-full data-[state=active]:bg-black data-[state=active]:text-white cursor-pointer text-xs">Mawlana</TabsTrigger>
                  <TabsTrigger value="dawah" className="px-4 py-1 rounded-full data-[state=active]:bg-black data-[state=active]:text-white cursor-pointer text-xs">Dawah</TabsTrigger>
                  <TabsTrigger value="podcasts" className="px-4 py-1 rounded-full data-[state=active]:bg-black data-[state=active]:text-white cursor-pointer text-xs">Podcasts</TabsTrigger>
                  <TabsTrigger value="news" className="px-4 py-1 rounded-full data-[state=active]:bg-black data-[state=active]:text-white cursor-pointer text-xs">News</TabsTrigger>
                  <TabsTrigger value="tarawih" className="px-4 py-1 rounded-full data-[state=active]:bg-black data-[state=active]:text-white cursor-pointer text-xs">Tarawih</TabsTrigger>
                  <TabsTrigger value="live" className="px-4 py-1 rounded-full data-[state=active]:bg-black data-[state=active]:text-white cursor-pointer text-xs">Live</TabsTrigger>
                  <TabsTrigger value="recitation" className="px-4 py-1 rounded-full data-[state=active]:bg-black data-[state=active]:text-white cursor-pointer text-xs">Recitation</TabsTrigger>
                  <TabsTrigger value="quran" className="px-4 py-1 rounded-full data-[state=active]:bg-black data-[state=active]:text-white cursor-pointer text-xs">Quran</TabsTrigger>
                  <TabsTrigger value="fatwa" className="px-4 py-1 rounded-full data-[state=active]:bg-black data-[state=active]:text-white cursor-pointer text-xs">Fatwa</TabsTrigger>
                  <TabsTrigger value="isb" className="px-4 py-1 rounded-full data-[state=active]:bg-black data-[state=active]:text-white cursor-pointer text-xs">Islamic Studies</TabsTrigger>
                  <TabsTrigger value="ramadan" className="px-4 py-1 rounded-full data-[state=active]:bg-black data-[state=active]:text-white cursor-pointer text-xs">Ramadan</TabsTrigger>
                  <TabsTrigger value="eid" className="px-4 py-1 rounded-full data-[state=active]:bg-black data-[state=active]:text-white cursor-pointer text-xs">Eid</TabsTrigger>
                  <TabsTrigger value="nasheed" className="px-4 py-1 rounded-full data-[state=active]:bg-black data-[state=active]:text-white cursor-pointer text-xs">Nasheed</TabsTrigger>
                  <TabsTrigger value="series" className="px-4 py-1 rounded-full data-[state=active]:bg-black data-[state=active]:text-white cursor-pointer text-xs">Series</TabsTrigger>
                  <TabsTrigger value="lectures" className="px-4 py-1 rounded-full data-[state=active]:bg-black data-[state=active]:text-white cursor-pointer text-xs">Lectures</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <button
              className={`hidden md:flex absolute right-0 top-1/2 transform -translate-y-1/2 z-20 h-12 px-2 items-center justify-center bg-gradient-to-l from-background to-transparent ${
                showRightArrow ? "opacity-100" : "opacity-0 pointer-events-none"
              } transition-opacity duration-200`}
              onClick={() => scrollTags("right")}
              aria-label="Scroll right"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          {/* Video Grid - Desktop */}
          <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
            {videos.map((video) => (
              <VideoCard key={video.id} isHorizontal={false} />
            ))}
            {loading && Array.from({ length: 4 }).map((_, i) => (
              <div key={`sk-${i}`} className="flex flex-col">
                <div className="relative aspect-video w-full"><Skeleton className="h-full w-full rounded-lg" /></div>
                <div className="flex mt-2 gap-2"><Skeleton className="h-9 w-9 rounded-full flex-shrink-0" /><div className="flex-1 space-y-2"><Skeleton className="h-4 w-full" /><Skeleton className="h-3 w-3/4" /></div></div>
              </div>
            ))}
            {hasMore && <div ref={loadingRef} className="col-span-full flex justify-center p-4" />}
            {!hasMore && !loading && videos.length > 0 && (
              <div className="col-span-full text-center p-4 text-muted-foreground">You've reached the end</div>
            )}
          </div>

          {/* Video List - Mobile */}
          <div className="flex flex-col md:hidden pt-12">
            {videos.map((video) => (
              <VideoCard key={video.id} isHorizontal={true} />
            ))}
            {loading && Array.from({ length: 3 }).map((_, i) => (
              <div key={`skm-${i}`} className="flex gap-3 p-3">
                <Skeleton className="w-40 h-24 rounded-lg flex-shrink-0" />
                <div className="flex-1 space-y-2"><Skeleton className="h-4 w-full" /><Skeleton className="h-3 w-3/4" /></div>
              </div>
            ))}
            {hasMore && <div ref={loadingRef} className="flex justify-center p-4" />}
            {!hasMore && !loading && videos.length > 0 && (
              <div className="text-center p-4 text-muted-foreground">You've reached the end</div>
            )}
          </div>
        </main>
      </div>

      <MobileNav />
    </div>
  )
}