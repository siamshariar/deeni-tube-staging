"use client"

import { Search, Bell, Menu, Mic, ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import { useState, useEffect, useRef, useCallback } from "react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import VideoCard from "@/components/video-card"
import MobileNav from "@/components/mobile-nav"
import DesktopSidebar from "@/components/desktop-sidebar"
import AccountDropdown from "@/components/account-dropdown"

export default function Home() {
  const [prevScrollPos, setPrevScrollPos] = useState(0)
  const [visible, setVisible] = useState(true)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(true)
  const tagsContainerRef = useRef<HTMLDivElement>(null)
  const tabsListInnerRef = useRef<HTMLDivElement>(null)

  // Add these state variables inside the Home component
  const [loading, setLoading] = useState(true)
  const [videos, setVideos] = useState<any[]>([])
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)
  const observer = useRef<IntersectionObserver | null>(null)
  const loadingRef = useRef<HTMLDivElement>(null)

  // Simulate fetching videos
  const fetchVideos = useCallback(async (pageNum: number) => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Dummy data - 8 videos per page
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

    // Stop after 5 pages (40 videos total)
    if (pageNum >= 5) {
      setHasMore(false)
    }

    return newVideos
  }, [])

  // Load initial videos
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

  // Set up intersection observer for infinite scrolling
  useEffect(() => {
    if (loading) return

    const handleObserver = (entries: IntersectionObserverEntry[]) => {
      const [target] = entries
      if (target.isIntersecting && hasMore) {
        setPage((prevPage) => prevPage + 1)
      }
    }

    observer.current = new IntersectionObserver(handleObserver, {
      rootMargin: "0px 0px 200px 0px",
      threshold: 0.1,
    })

    if (loadingRef.current) {
      observer.current.observe(loadingRef.current)
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect()
      }
    }
  }, [loading, hasMore])

  // Load more videos when page changes
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

      // Determine if scrolling up or down
      const isScrollingDown = currentScrollPos > prevScrollPos

      // Only hide when scrolling down AND scrolled past the threshold (150px)
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

  // Check if we need to show the scroll arrows
  const checkScrollArrows = () => {
    if (tabsListInnerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = tabsListInnerRef.current
      setShowLeftArrow(scrollLeft > 0)
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10) // Adding a small buffer
    }
  }

  // Add scroll event listener to update arrow visibility
  useEffect(() => {
    const container = tabsListInnerRef.current
    if (container) {
      container.addEventListener("scroll", checkScrollArrows)
      // Initial check
      checkScrollArrows()
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", checkScrollArrows)
      }
    }
  }, [])

  // Scroll the tags container left or right
  const scrollTags = (direction: "left" | "right") => {
    if (tabsListInnerRef.current) {
      const scrollAmount = 300 // Adjust scroll amount as needed
      const scrollPosition =
        direction === "left"
          ? tabsListInnerRef.current.scrollLeft - scrollAmount
          : tabsListInnerRef.current.scrollLeft + scrollAmount

      tabsListInnerRef.current.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      })
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header - shown only on small screens */}
      <header
        className={`flex items-center justify-between p-4 border-b md:hidden fixed top-0 left-0 right-0 bg-background z-20 transition-transform duration-300 ${
          visible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="flex items-center gap-3">
          <Menu className="w-6 h-6 text-muted-foreground" />
          <Image src="/youtube-logo.svg" alt="YouTube" width={90} height={20} className="h-5 w-auto" />
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="rounded-full">
            <Search className="w-5 h-5" />
          </Button>
          <AccountDropdown />
        </div>
      </header>

      {/* Desktop Header - hidden on small screens */}
      <header className="hidden md:flex fixed top-0 left-0 right-0 items-center justify-between px-4 py-2 border-b bg-background z-20">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="rounded-full">
            <Menu className="w-5 h-5" />
          </Button>
          <Image src="/youtube-logo.svg" alt="YouTube" width={120} height={30} className="h-6 w-auto" />
        </div>

        <div className="flex-1 max-w-[720px] mx-4">
          <div className="flex items-center">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search"
                className="w-full h-10 py-2 px-4 rounded-l-full border focus:outline-none focus:border-blue-500"
              />
            </div>
            <Button
              variant="secondary"
              size="icon"
              className="rounded-r-full h-10 border border-l-0 bg-gray-100 hover:bg-gray-200"
            >
              <Search className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon" className="rounded-full ml-2 bg-gray-100 hover:bg-gray-200">
              <Mic className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="rounded-full">
            <Bell className="w-5 h-5" />
          </Button>
          <AccountDropdown />
        </div>
      </header>

      <div className="flex">
        {/* Desktop Sidebar - hidden on small screens */}
        <DesktopSidebar className="hidden md:block" />

        <main className="flex-1 md:pl-[240px] md:pt-[108px] pt-[36px] md:pb-0 pb-nav-safe overflow-x-hidden">
          {/* Category Tabs - Fixed for both mobile and desktop */}
          <div
            className={`relative overflow-hidden border-b fixed left-0 right-0 bg-background z-10 transition-transform duration-300 md:fixed md:top-[56px] md:left-[240px] md:right-0 md:z-10 md:bg-background max-w-[100vw] ${
              visible ? "top-[56px]" : "top-0 -translate-y-full"
            }`}
          >
            {/* Left Navigation Arrow - only visible on web view */}
            <button
              className={`hidden md:flex absolute left-0 top-1/2 transform -translate-y-1/2 z-20 h-12 px-2 items-center justify-center bg-gradient-to-r from-background to-transparent ${
                showLeftArrow ? "opacity-100" : "opacity-0 pointer-events-none"
              } transition-opacity duration-200`}
              onClick={() => scrollTags("left")}
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            {/* Tags Container */}
            <div ref={tagsContainerRef} id="tags-container">
              <Tabs defaultValue="all" className="w-full">
                <TabsList
                  ref={tabsListInnerRef}
                  className="h-12 px-4 py-1 bg-background w-full flex-nowrap overflow-x-auto scrollbar-hide sticky left-0"
                  onMouseDown={(e) => {
                    // Prevent default behavior
                    e.preventDefault()

                    // Get the container element
                    const container = e.currentTarget as HTMLDivElement
                    if (!container) return

                    // Initial position
                    const startX = e.pageX
                    const scrollLeft = container.scrollLeft

                    // Track if we're dragging (to distinguish from a click)
                    let isDragging = false

                    const onMouseMove = (e: MouseEvent) => {
                      isDragging = true
                      const x = e.pageX
                      const walk = (startX - x) * 1.5 // Scroll speed multiplier
                      container.scrollLeft = scrollLeft + walk
                    }

                    const onMouseUp = () => {
                      document.removeEventListener("mousemove", onMouseMove)
                      document.removeEventListener("mouseup", onMouseUp)

                      // If it was just a click (not a drag), allow the default behavior
                      if (!isDragging) {
                        // The click will propagate normally
                      }
                    }

                    document.addEventListener("mousemove", onMouseMove)
                    document.addEventListener("mouseup", onMouseUp)
                  }}
                  onTouchStart={(e) => {
                    // Get the container element
                    const container = e.currentTarget as HTMLDivElement
                    if (!container) return

                    // Initial position
                    const touch = e.touches[0]
                    const startX = touch.pageX
                    const scrollLeft = container.scrollLeft

                    // Track if we're dragging
                    let isDragging = false

                    const onTouchMove = (e: TouchEvent) => {
                      isDragging = true
                      const touch = e.touches[0]
                      const x = touch.pageX
                      const walk = (startX - x) * 1.5 // Scroll speed multiplier
                      container.scrollLeft = scrollLeft + walk

                      // Prevent page scrolling while dragging the tabs
                      if (Math.abs(walk) > 10) {
                        e.preventDefault()
                      }
                    }

                    const onTouchEnd = () => {
                      document.removeEventListener("touchmove", onTouchMove)
                      document.removeEventListener("touchend", onTouchEnd)
                    }

                    document.addEventListener("touchmove", onTouchMove, { passive: false })
                    document.addEventListener("touchend", onTouchEnd)
                  }}
                >
                  <TabsTrigger
                    value="all"
                    className="px-4 py-1 rounded-full data-[state=active]:bg-black data-[state=active]:text-white cursor-pointer"
                  >
                    All
                  </TabsTrigger>
                  <TabsTrigger
                    value="mawlana"
                    className="px-4 py-1 rounded-full data-[state=active]:bg-black data-[state=active]:text-white cursor-pointer"
                  >
                    Mawlānā
                  </TabsTrigger>
                  <TabsTrigger
                    value="dawah"
                    className="px-4 py-1 rounded-full data-[state=active]:bg-black data-[state=active]:text-white cursor-pointer"
                  >
                    Dawah
                  </TabsTrigger>
                  <TabsTrigger
                    value="podcasts"
                    className="px-4 py-1 rounded-full data-[state=active]:bg-black data-[state=active]:text-white cursor-pointer"
                  >
                    Podcasts
                  </TabsTrigger>
                  <TabsTrigger
                    value="news"
                    className="px-4 py-1 rounded-full data-[state=active]:bg-black data-[state=active]:text-white cursor-pointer"
                  >
                    News
                  </TabsTrigger>
                  <TabsTrigger
                    value="tarawih"
                    className="px-4 py-1 rounded-full data-[state=active]:bg-black data-[state=active]:text-white cursor-pointer"
                  >
                    Tarawih
                  </TabsTrigger>
                  <TabsTrigger
                    value="live"
                    className="px-4 py-1 rounded-full data-[state=active]:bg-black data-[state=active]:text-white cursor-pointer"
                  >
                    Live
                  </TabsTrigger>
                  <TabsTrigger
                    value="recitation"
                    className="px-4 py-1 rounded-full data-[state=active]:bg-black data-[state=active]:text-white cursor-pointer"
                  >
                    Religious recitation
                  </TabsTrigger>
                  <TabsTrigger
                    value="quran"
                    className="px-4 py-1 rounded-full data-[state=active]:bg-black data-[state=active]:text-white cursor-pointer"
                  >
                    Quran
                  </TabsTrigger>
                  <TabsTrigger
                    value="fatwa"
                    className="px-4 py-1 rounded-full data-[state=active]:bg-black data-[state=active]:text-white cursor-pointer"
                  >
                    Fatwa
                  </TabsTrigger>
                  <TabsTrigger
                    value="isb"
                    className="px-4 py-1 rounded-full data-[state=active]:bg-black data-[state=active]:text-white cursor-pointer"
                  >
                    Islamic Studies
                  </TabsTrigger>
                  <TabsTrigger
                    value="ramadan"
                    className="px-4 py-1 rounded-full data-[state=active]:bg-black data-[state=active]:text-white cursor-pointer"
                  >
                    Ramadan
                  </TabsTrigger>
                  <TabsTrigger
                    value="eid"
                    className="px-4 py-1 rounded-full data-[state=active]:bg-black data-[state=active]:text-white cursor-pointer"
                  >
                    Eid
                  </TabsTrigger>
                  <TabsTrigger
                    value="nasheed"
                    className="px-4 py-1 rounded-full data-[state=active]:bg-black data-[state=active]:text-white cursor-pointer"
                  >
                    Nasheed
                  </TabsTrigger>
                  <TabsTrigger
                    value="series"
                    className="px-4 py-1 rounded-full data-[state=active]:bg-black data-[state=active]:text-white cursor-pointer"
                  >
                    Series
                  </TabsTrigger>
                  <TabsTrigger
                    value="lectures"
                    className="px-4 py-1 rounded-full data-[state=active]:bg-black data-[state=active]:text-white cursor-pointer"
                  >
                    Lectures
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Right Navigation Arrow - only visible on web view */}
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
            {videos.map((video, index) => (
              <VideoCard key={video.id} isHorizontal={false} />
            ))}

            {loading && (
              <>
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={`skeleton-${index}`} className="flex flex-col">
                    <div className="relative aspect-video w-full">
                      <Skeleton className="h-full w-full rounded-lg" />
                    </div>
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
              </>
            )}

            {/* Loading indicator for infinite scroll */}
            {hasMore && <div ref={loadingRef} className="col-span-full flex justify-center p-4" />}

            {/* End of content message */}
            {!hasMore && !loading && videos.length > 0 && (
              <div className="col-span-full text-center p-4 text-muted-foreground">
                You've reached the end of the list
              </div>
            )}
          </div>

          {/* Video List - Mobile */}
          <div className="flex flex-col md:hidden pt-12">
            {videos.map((video, index) => (
              <VideoCard key={video.id} isHorizontal={true} />
            ))}

            {loading && (
              <>
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={`skeleton-mobile-${index}`} className="flex p-2 border-b">
                    <Skeleton className="h-48 w-full rounded-lg flex-shrink-0" />
                    <div className="flex mt-2 gap-3 ml-3">
                      <Skeleton className="h-9 w-9 rounded-full flex-shrink-0" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-3 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    </div>
                  </div>
                ))}
              </>
            )}

            {/* Loading indicator for infinite scroll */}
            {hasMore && <div ref={loadingRef} className="flex justify-center p-4" />}

            {/* End of content message */}
            {!hasMore && !loading && videos.length > 0 && (
              <div className="text-center p-4 text-muted-foreground">You've reached the end of the list</div>
            )}
          </div>
        </main>
      </div>

      {/* Mobile navigation */}
      <MobileNav />
    </div>
  )
}
