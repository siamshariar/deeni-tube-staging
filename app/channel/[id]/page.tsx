"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import {
  ArrowLeft,
  Bell,
  Cast,
  ChevronDown,
  Menu,
  MoreVertical,
  Search,
  Share,
  BellOff,
  UserMinus,
  Clock,
  Bookmark,
  Ban,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer"

import VideoCard from "@/components/video-card"
import DesktopSidebar from "@/components/desktop-sidebar"
import AccountDropdown from "@/components/account-dropdown"
import ChannelVideoCard from "@/components/channel-video-card"
import { useMediaQuery } from "@/hooks/use-media-query"
import { cn } from "@/lib/utils"
import MobileNav from "@/components/mobile-nav"

// Sample channel data
const channelData = {
  id: "drberg",
  name: "Dr. Eric Berg DC",
  handle: "@Drberg",
  avatar: "/medical-professional-profile.png",
  coverImage: "/vibrant-health-cover.png",
  subscribers: "13.3M subscribers",
  videos: "5.5K videos",
  description:
    "Dr. Eric Berg DC, age 60, discusses the truth about getting healthy and losing weight. Dr. Berg specializes in Healthy Ketosis and Intermittent Fasting. He is the director of Dr. Berg's Nutritionals, and a best-selling amazon.com author.",
  website: "drberg.com",
  verified: true,
  isSubscribed: true,
}

// Sample videos data
const videos = [
  {
    id: "v1",
    title: "How To Lose Weight WITHOUT Dieting",
    thumbnail: "/diverse-group-exercising.png",
    views: "17K views",
    timeAgo: "2 hours ago",
    duration: "6:24",
  },
  {
    id: "v2",
    title: "Drink This Before Bed — It Could Change Your Life",
    thumbnail: "/vibrant-health-drink.png",
    views: "437K views",
    timeAgo: "2 days ago",
    duration: "5:04",
  },
  {
    id: "v3",
    title: "Simple Trick to Fix Bad Circulation & Blood Flow in Your Feet and Legs",
    thumbnail: "/healthy-heart-motion.png",
    views: "217K views",
    timeAgo: "5 days ago",
    duration: "6:36",
  },
  {
    id: "v4",
    title: "7 Silent Signs of Pancreatic Cancer",
    thumbnail: "/healthy-pancreas-infographic.png",
    views: "1.2M views",
    timeAgo: "1 week ago",
    duration: "8:25",
  },
  {
    id: "v5",
    title: "The Truth About Vitamin D - What They Don't Tell You",
    thumbnail: "/sunny-health-lesson.png",
    views: "3.4M views",
    timeAgo: "2 weeks ago",
    duration: "7:15",
  },
  {
    id: "v6",
    title: "Top 10 Foods to Avoid for Weight Loss",
    thumbnail: "/food-avoidance-icons.png",
    views: "5.7M views",
    timeAgo: "3 weeks ago",
    duration: "9:42",
  },
]

// Sample playlists data
const playlists = [
  {
    id: "p1",
    title: "Healthy Keto Diet Basics",
    thumbnail: "/placeholder-bsxxw.png",
    videoCount: 24,
    updatedAt: "Updated 2 weeks ago",
    isPublic: true,
  },
  {
    id: "p2",
    title: "Intermittent Fasting Guide",
    thumbnail: "/intermittent-fasting-concept.png",
    videoCount: 18,
    updatedAt: "Updated 1 month ago",
    isPublic: true,
  },
  {
    id: "p3",
    title: "Weight Loss Success Stories",
    thumbnail: "/placeholder-gqeil.png",
    videoCount: 32,
    updatedAt: "Updated 3 days ago",
    isPublic: true,
  },
  {
    id: "p4",
    title: "Vitamin & Mineral Deficiencies",
    thumbnail: "/placeholder-aogpa.png",
    videoCount: 15,
    updatedAt: "Updated 2 months ago",
    isPublic: true,
  },
  {
    id: "p5",
    title: "Healthy Recipes",
    thumbnail: "/healthy-recipes.png",
    videoCount: 47,
    updatedAt: "Updated 1 week ago",
    isPublic: true,
  },
  {
    id: "p6",
    title: "Health Myths Debunked",
    thumbnail: "/placeholder-e3hoz.png",
    videoCount: 12,
    updatedAt: "Updated 3 weeks ago",
    isPublic: true,
  },
]

export default function ChannelPage() {
  const params = useParams()
  const router = useRouter()
  const isMobile = useMediaQuery("(max-width: 768px)")
  const [activeTab, setActiveTab] = useState("videos")
  const [showSearch, setShowSearch] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [showFullDescription, setShowFullDescription] = useState(false)
  const [descriptionModalOpen, setDescriptionModalOpen] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const [showChannelNameInHeader, setShowChannelNameInHeader] = useState(false)

  const [loadingVideos, setLoadingVideos] = useState(true)
  const [videosList, setVideosList] = useState<typeof videos>([])
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)
  const observer = useRef<IntersectionObserver | null>(null)
  const loadingRef = useRef<HTMLDivElement>(null)

  const fetchVideos = useCallback(
    async (pageNum: number) => {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Use the existing videos array as a template and create variations
      const newVideos = videos.map((video) => ({
        ...video,
        id: `${video.id}-page-${pageNum}-${Math.random().toString(36).substring(7)}`,
        title: pageNum === 1 ? video.title : `${video.title} (variation ${pageNum})`,
        views: `${Math.floor(Math.random() * 1000)}K views`,
        timeAgo: `${Math.floor(Math.random() * 12) + 1} ${pageNum === 1 ? "days" : "weeks"} ago`,
      }))

      // Stop after 3 pages
      if (pageNum >= 3) {
        setHasMore(false)
      }

      return newVideos
    },
    [videos],
  )

  // Load initial videos
  useEffect(() => {
    const loadInitialVideos = async () => {
      setLoadingVideos(true)
      try {
        const initialVideos = await fetchVideos(1)
        setVideosList(initialVideos)
      } catch (error) {
        console.error("Error fetching videos:", error)
      } finally {
        setLoadingVideos(false)
      }
    }

    loadInitialVideos()
  }, [fetchVideos])

  // Set up intersection observer for infinite scrolling
  useEffect(() => {
    if (loadingVideos) return

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
  }, [loadingVideos, hasMore])

  // Load more videos when page changes
  useEffect(() => {
    if (page === 1) return

    const loadMoreVideos = async () => {
      setLoadingVideos(true)
      try {
        const newVideos = await fetchVideos(page)
        setVideosList((prev) => [...prev, ...newVideos])
      } catch (error) {
        console.error("Error fetching more videos:", error)
      } finally {
        setLoadingVideos(false)
      }
    }

    loadMoreVideos()
  }, [page, fetchVideos])

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
      setShowChannelNameInHeader(window.scrollY > 200)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Get channel data based on ID (in a real app, this would fetch from an API)
  const channel = channelData

  const handleBackClick = () => {
    router.back()
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <header className="flex items-center justify-between p-4 border-b md:hidden fixed top-0 left-0 right-0 bg-background z-20 h-[56px]">
        <div className="flex items-center gap-4 overflow-hidden">
          <Button variant="ghost" size="icon" className="rounded-full flex-shrink-0" onClick={handleBackClick}>
            <ArrowLeft className="h-6 w-6" />
          </Button>
          {showChannelNameInHeader && <h1 className="text-lg font-medium truncate max-w-[200px]">{channel.name}</h1>}
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="rounded-full">
            <Cast className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Search className="h-5 w-5" onClick={() => setShowSearch(!showSearch)} />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Desktop Header */}
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
        {/* Desktop Sidebar */}
        <DesktopSidebar className="hidden md:block" />

        <main className={cn("flex-1", isMobile ? "pt-[56px] pb-nav-safe" : "md:pl-[240px] md:pt-[56px]")}>
          {/* Channel Banner */}
          <div className="relative w-full">
            <div className="w-full aspect-[6/1.5] relative">
              <Image
                src={
                  channel.coverImage && channel.coverImage !== ""
                    ? channel.coverImage
                    : `/placeholder.svg?height=480&width=1920&query=channel+banner`
                }
                alt={`${channel.name} banner`}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* Channel Info */}
          <div className="p-4 flex flex-col border-b">
            <div className="flex gap-4">
              <Avatar className={cn(isMobile ? "h-16 w-16" : "h-20 w-20")}>
                <AvatarImage
                  src={
                    channel.avatar && channel.avatar !== ""
                      ? channel.avatar
                      : `/placeholder.svg?height=80&width=80&query=channel+avatar`
                  }
                  alt={channel.name}
                />
                <AvatarFallback>{channel.name.charAt(0)}</AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1">
                  <h1 className="text-xl md:text-2xl font-bold">{channel.name}</h1>
                  {channel.verified && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-5 h-5 text-gray-500"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </div>
                <div className="text-sm text-muted-foreground">
                  <p>{channel.handle}</p>
                  <p>
                    {channel.subscribers} • {channel.videos}
                  </p>
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  <p className="line-clamp-1">
                    {channel.description}
                    <button
                      onClick={(e) => {
                        e.preventDefault()
                        setDescriptionModalOpen(true)
                      }}
                      className="inline-block text-blue-600 ml-1 hover:underline"
                    >
                      ...more
                    </button>
                  </p>
                </div>
                <button
                  onClick={() => setDescriptionModalOpen(true)}
                  className="text-sm text-blue-600 hover:underline mt-1 block"
                >
                  Open Modal
                </button>
                <Link href={`https://${channel.website}`} className="text-sm text-blue-600 hover:underline mt-1">
                  {channel.website} and 7 more links
                </Link>
              </div>
            </div>

            <div className="flex gap-2 mt-4 md:ml-24">
              {isMobile ? (
                <Button className="w-full rounded-full bg-black text-white hover:bg-gray-800">
                  <Bell className="h-4 w-4 mr-2" />
                  Subscribed
                </Button>
              ) : (
                <>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button className="rounded-full bg-black text-white hover:bg-gray-800">
                        <Bell className="h-4 w-4 mr-2" />
                        Subscribed
                        <ChevronDown className="h-4 w-4 ml-2" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[240px]">
                      <DropdownMenuItem className="py-3 cursor-pointer flex items-center gap-3">
                        <Bell className="h-5 w-5" />
                        <span>All notifications</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="py-3 cursor-pointer flex items-center gap-3">
                        <div className="relative">
                          <Bell className="h-5 w-5" />
                          <div className="absolute -right-1 -top-1 h-2 w-2 bg-blue-500 rounded-full"></div>
                        </div>
                        <span>Personalized</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="py-3 cursor-pointer flex items-center gap-3">
                        <BellOff className="h-5 w-5" />
                        <span>None</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="py-3 cursor-pointer text-red-500 flex items-center gap-3">
                        <UserMinus className="h-5 w-5" />
                        <span>Unsubscribe</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button variant="outline" className="rounded-full">
                    <Share className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Channel Tabs */}
          <div className={`border-b md:relative ${isMobile ? "sticky top-[56px] bg-background z-20" : ""}`}>
            <div className="flex items-center">
              <Tabs
                defaultValue="videos"
                className={cn("w-full", showSearch && !isMobile ? "md:w-[70%]" : "")}
                onValueChange={setActiveTab}
              >
                <TabsList className="h-12 bg-background w-full justify-start overflow-x-auto scrollbar-hide">
                  <TabsTrigger
                    value="videos"
                    className="px-4 py-1 data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:rounded-none data-[state=active]:bg-transparent"
                  >
                    Videos
                  </TabsTrigger>
                  <TabsTrigger
                    value="shorts"
                    className="px-4 py-1 data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:rounded-none data-[state=active]:bg-transparent"
                  >
                    Shorts
                  </TabsTrigger>
                  <TabsTrigger
                    value="playlists"
                    className="px-4 py-1 data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:rounded-none data-[state=active]:bg-transparent"
                  >
                    Playlists
                  </TabsTrigger>
                  <TabsTrigger
                    value="posts"
                    className="px-4 py-1 data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:rounded-none data-[state=active]:bg-transparent"
                  >
                    Posts
                  </TabsTrigger>
                </TabsList>
              </Tabs>

              {/* Inline search field for web view */}
              {showSearch && !isMobile && (
                <div className="hidden md:flex flex-1 mx-2">
                  <div className="relative w-full">
                    <input
                      type="text"
                      placeholder="Search channel"
                      className="w-full h-10 py-2 px-4 rounded-full border focus:outline-none focus:border-blue-500"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full"
                      onClick={() => setSearchQuery("")}
                    >
                      {searchQuery ? "×" : <Search className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              )}

              <Button
                variant="ghost"
                size="icon"
                className="rounded-full mr-2"
                onClick={() => setShowSearch(!showSearch)}
              >
                <Search className="h-5 w-5" />
              </Button>
            </div>

            {/* Search field for mobile view */}
            {showSearch && isMobile && (
              <div className="p-2 border-t md:hidden">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search channel"
                    className="w-full h-10 py-2 px-4 rounded-full border focus:outline-none focus:border-blue-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-1 top-1/2 -translate-y-1/2 rounded-full"
                    onClick={() => setSearchQuery("")}
                  >
                    {searchQuery ? "×" : <Search className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Video Filters */}
          <div className={`p-4 flex gap-2 overflow-x-auto scrollbar-hide ${isMobile ? "mt-0" : ""}`}>
            <Button variant="outline" className="rounded-full bg-black text-white hover:bg-gray-800">
              Latest
            </Button>
            <Button variant="outline" className="rounded-full">
              Popular
            </Button>
            <Button variant="outline" className="rounded-full">
              Oldest
            </Button>
          </div>

          {/* Videos Grid/List */}
          {activeTab === "videos" && (
            <>
              {/* Desktop Video Grid */}
              <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
                {videosList.map((video) => (
                  <VideoCard key={video.id} isHorizontal={false} />
                ))}

                {loadingVideos && (
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
                {!hasMore && !loadingVideos && videosList.length > 0 && (
                  <div className="col-span-full text-center p-4 text-muted-foreground">
                    You've reached the end of the list
                  </div>
                )}
              </div>

              {/* Mobile Video List */}
              <div className="md:hidden">
                {videosList.map((video) => (
                  <ChannelVideoCard key={video.id} video={video} />
                ))}

                {loadingVideos && (
                  <>
                    {Array.from({ length: 3 }).map((_, index) => (
                      <div key={`skeleton-mobile-${index}`} className="flex gap-3 p-3 border-b">
                        <div className="relative w-40 h-24 flex-shrink-0">
                          <Skeleton className="h-full w-full rounded-lg" />
                        </div>
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-3 w-3/4" />
                          <Skeleton className="h-3 w-1/2" />
                        </div>
                      </div>
                    ))}
                  </>
                )}

                {/* Loading indicator for infinite scroll */}
                {hasMore && <div ref={loadingRef} className="flex justify-center p-4" />}

                {/* End of content message */}
                {!hasMore && !loadingVideos && videosList.length > 0 && (
                  <div className="text-center p-4 text-muted-foreground">You've reached the end of the list</div>
                )}
              </div>
            </>
          )}

          {/* Shorts Grid/List */}
          {activeTab === "shorts" && (
            <>
              {/* Desktop Shorts Grid */}
              <div className="hidden md:grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 p-4">
                {videosList.map((video) => (
                  <div key={`short-${video.id}`} className="flex flex-col group cursor-pointer relative">
                    <div className="relative aspect-[9/16] w-full">
                      <Image
                        src={`/placeholder-7zeab.png?height=480&width=270&query=shorts+${video.id}`}
                        alt={video.title}
                        fill
                        className="object-cover rounded-lg"
                      />
                      <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-1 py-0.5 rounded">
                        {video.duration}
                      </div>
                    </div>
                    <div className="mt-2 flex">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm line-clamp-2">{video.title}</h3>
                        <div className="text-muted-foreground text-xs mt-1">
                          <span>{video.views}</span>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full self-start flex-shrink-0"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreVertical className="h-5 w-5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[240px] p-0 rounded-xl">
                          <div className="flex items-center gap-3 px-4 py-3 hover:bg-muted cursor-pointer">
                            <Clock className="h-5 w-5" />
                            <span>Save to Watch later</span>
                          </div>
                          <div className="flex items-center gap-3 px-4 py-3 hover:bg-muted cursor-pointer">
                            <Bookmark className="h-5 w-5" />
                            <span>Save to playlist</span>
                          </div>
                          <div className="flex items-center gap-3 px-4 py-3 hover:bg-muted cursor-pointer">
                            <Share className="h-5 w-5" />
                            <span>Share</span>
                          </div>
                          <div className="flex items-center gap-3 px-4 py-3 hover:bg-muted cursor-pointer">
                            <Ban className="h-5 w-5" />
                            <span>Not interested</span>
                          </div>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                ))}

                {loadingVideos && (
                  <>
                    {Array.from({ length: 6 }).map((_, index) => (
                      <div key={`skeleton-short-${index}`} className="flex flex-col">
                        <div className="relative aspect-[9/16] w-full">
                          <Skeleton className="h-full w-full rounded-lg" />
                        </div>
                        <div className="mt-2 space-y-2">
                          <Skeleton className="h-4 w-full" />
                          <Skeleton className="h-3 w-1/2" />
                        </div>
                      </div>
                    ))}
                  </>
                )}

                {/* Loading indicator for infinite scroll */}
                {hasMore && <div ref={loadingRef} className="col-span-full flex justify-center p-4" />}

                {/* End of content message */}
                {!hasMore && !loadingVideos && videosList.length > 0 && (
                  <div className="col-span-full text-center p-4 text-muted-foreground">
                    You've reached the end of the list
                  </div>
                )}
              </div>

              {/* Mobile Shorts Grid */}
              <div className="md:hidden grid grid-cols-2 gap-2 p-2">
                {videosList.map((video) => (
                  <div key={`short-mobile-${video.id}`} className="flex flex-col group cursor-pointer relative">
                    <div className="relative aspect-[9/16] w-full">
                      <Image
                        src={`/placeholder-7zeab.png?height=480&width=270&query=shorts+${video.id}`}
                        alt={video.title}
                        fill
                        className="object-cover rounded-lg"
                      />
                      <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-1 py-0.5 rounded">
                        {video.duration}
                      </div>
                    </div>
                    <div className="mt-1 flex">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-xs line-clamp-2">{video.title}</h3>
                        <div className="text-muted-foreground text-xs">
                          <span>{video.views}</span>
                        </div>
                      </div>
                      <Drawer>
                        <DrawerTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 rounded-full self-start flex-shrink-0"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DrawerTrigger>
                        <DrawerContent className="px-0 max-h-[70vh]">
                          <div className="mt-2 pb-6">
                            <div className="flex items-center gap-3 px-4 py-3 hover:bg-muted cursor-pointer">
                              <Clock className="h-5 w-5" />
                              <span>Save to Watch later</span>
                            </div>
                            <div className="flex items-center gap-3 px-4 py-3 hover:bg-muted cursor-pointer">
                              <Bookmark className="h-5 w-5" />
                              <span>Save to playlist</span>
                            </div>
                            <div className="flex items-center gap-3 px-4 py-3 hover:bg-muted cursor-pointer">
                              <Share className="h-5 w-5" />
                              <span>Share</span>
                            </div>
                            <div className="flex items-center gap-3 px-4 py-3 hover:bg-muted cursor-pointer">
                              <Ban className="h-5 w-5" />
                              <span>Not interested</span>
                            </div>
                          </div>
                        </DrawerContent>
                      </Drawer>
                    </div>
                  </div>
                ))}

                {loadingVideos && (
                  <>
                    {Array.from({ length: 4 }).map((_, index) => (
                      <div key={`skeleton-short-mobile-${index}`} className="flex flex-col">
                        <div className="relative aspect-[9/16] w-full">
                          <Skeleton className="h-full w-full rounded-lg" />
                        </div>
                        <div className="mt-1 space-y-1">
                          <Skeleton className="h-3 w-full" />
                          <Skeleton className="h-2 w-1/2" />
                        </div>
                      </div>
                    ))}
                  </>
                )}

                {/* Loading indicator for infinite scroll */}
                {hasMore && <div ref={loadingRef} className="col-span-full flex justify-center p-4" />}

                {/* End of content message */}
                {!hasMore && !loadingVideos && videosList.length > 0 && (
                  <div className="col-span-full text-center p-4 text-muted-foreground">
                    You've reached the end of the list
                  </div>
                )}
              </div>
            </>
          )}

          {/* Playlists Grid/List */}
          {activeTab === "playlists" && (
            <>
              {/* Desktop Playlists Grid */}
              <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
                {playlists.map((playlist) => (
                  <Link href={`/playlist/${playlist.id}`} key={playlist.id} className="group cursor-pointer">
                    <div className="border rounded-lg p-4 h-full hover:bg-gray-50 transition-colors">
                      <div>
                        <h3 className="font-medium text-base line-clamp-2">{playlist.title}</h3>
                        <p className="text-muted-foreground text-xs mt-1">{playlist.updatedAt}</p>
                      </div>
                      <div className="mt-4 flex items-center">
                        <svg viewBox="0 0 24 24" width="16" height="16" className="text-muted-foreground">
                          <path
                            fill="currentColor"
                            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"
                          />
                        </svg>
                        <span className="text-sm text-muted-foreground ml-1">{playlist.videoCount} videos</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {/* Mobile Playlists List */}
              <div className="md:hidden">
                {playlists.map((playlist) => (
                  <Link
                    href={`/playlist/${playlist.id}`}
                    key={playlist.id}
                    className="block p-3 border-b hover:bg-gray-50"
                  >
                    <div>
                      <h3 className="font-medium text-base line-clamp-2">{playlist.title}</h3>
                      <p className="text-muted-foreground text-xs mt-1">{playlist.updatedAt}</p>
                    </div>
                    <div className="mt-2 flex items-center">
                      <svg viewBox="0 0 24 24" width="16" height="16" className="text-muted-foreground">
                        <path
                          fill="currentColor"
                          d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"
                        />
                      </svg>
                      <span className="text-sm text-muted-foreground ml-1">{playlist.videoCount} videos</span>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}

          {/* Posts Tab Content */}
          {activeTab === "posts" && <div className="p-8 text-center text-muted-foreground">No posts to display</div>}

          {/* Description Modal */}
          <Dialog open={descriptionModalOpen} onOpenChange={setDescriptionModalOpen}>
            <DialogContent
              className={cn(
                "sm:max-w-md overflow-auto",
                isMobile ? "w-full h-full max-w-full max-h-full p-0 rounded-none border-0" : "max-h-[85vh]",
              )}
            >
              <DialogHeader className={cn(isMobile && "px-4 pt-4")}>
                <DialogTitle className="text-xl font-bold">{channel.name}</DialogTitle>
              </DialogHeader>
              <div className={cn("space-y-6", isMobile && "px-4 pb-4")}>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Description</h3>
                  <p className="text-sm text-muted-foreground">{channel.description}</p>

                  <p className="text-sm text-muted-foreground mt-4">
                    His book, The Healthy Keto Plan describes specific strategies on doing the healthy version of the
                    ketogenic diet as well as intermittent fasting. He has conducted over 4800 seminars on
                    health-related topics and trained over 2500 doctors world-wide in his methods. Dr. Berg breaks down
                    confusing complex health topics into easy to understand, usable knowledge.
                  </p>

                  <p className="text-sm text-muted-foreground mt-4">
                    For more information, go to our website at www.drberg.com or call customer service at 703-354-7336.
                    Much of the details of Dr. Berg's program is in his exclusive membership site at:
                    https://www.drberg.com/exclusive-membership
                  </p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium">By:</span>
                    <br />
                    Dr. Eric Berg
                    <br />
                    4501 Ford Avenue
                    <br />
                    Alexandria, VA, 22302
                    <br />
                    703-354-7336
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Links</h3>
                  <div className="flex items-center gap-2">
                    <svg viewBox="0 0 24 24" width="20" height="20" className="text-muted-foreground">
                      <path
                        fill="currentColor"
                        d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"
                      ></path>
                    </svg>
                    <Link href={`https://${channel.website}`} className="text-blue-600 hover:underline">
                      {channel.website}
                    </Link>
                  </div>
                </div>

                {/* Social Media Links */}
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 flex items-center justify-center">
                      <svg viewBox="0 0 24 24" width="24" height="24" fill="#E60023">
                        <path d="M12 0a12 12 0 0 0-4.37 23.17c-.1-.94-.2-2.4.04-3.44.22-.94 1.4-6 1.4-6s-.35-.72-.35-1.78c0-1.67.97-2.92 2.17-2.92 1.02 0 1.52.77 1.52 1.7 0 1.02-.66 2.56-1 3.98-.28 1.2.6 2.17 1.78 2.17 2.13 0 3.77-2.25 3.77-5.5 0-2.87-2.06-4.88-5-4.88-3.4 0-5.4 2.55-5.4 5.18 0 1.03.4 2.13.9 2.73.1.12.1.22.08.34-.1.36-.3 1.15-.34 1.3-.05.22-.18.27-.4.16-1.5-.7-2.43-2.9-2.43-4.67 0-3.8 2.75-7.28 7.92-7.28 4.17 0 7.4 2.97 7.4 6.94 0 4.14-2.6 7.46-6.22 7.46-1.22 0-2.36-.63-2.75-1.37l-.75 2.85c-.27 1.04-1 2.35-1.5 3.15A12 12 0 1 0 12 0z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium">Pinterest</div>
                      <Link href="https://pinterest.com/drericberg" className="text-blue-600 hover:underline text-sm">
                        pinterest.com/drericberg
                      </Link>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 flex items-center justify-center">
                      <svg viewBox="0 0 24 24" width="24" height="24">
                        <path
                          d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"
                          fill="currentColor"
                        />
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium">X</div>
                      <Link href="https://x.com/dr_ericberg" className="text-blue-600 hover:underline text-sm">
                        x.com/dr_ericberg
                      </Link>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 flex items-center justify-center">
                      <svg viewBox="0 0 24 24" width="24" height="24" fill="#FF0000">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium">Growing Healthy Food</div>
                      <Link
                        href="https://youtube.com/@growinghealthyfood"
                        className="text-blue-600 hover:underline text-sm"
                      >
                        youtube.com/@growinghealthyfood
                      </Link>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 flex items-center justify-center">
                      <svg viewBox="0 0 24 24" width="24" height="24">
                        <path
                          d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"
                          fill="currentColor"
                        />
                      </svg>
                    </div>
                    <div>
                      <div className="font-medium">TikTok</div>
                      <Link href="https://tiktok.com/@drbergofficial" className="text-blue-600 hover:underline text-sm">
                        tiktok.com/@drbergofficial
                      </Link>
                    </div>
                  </div>
                </div>

                {/* More Info Section */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">More info</h3>

                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 flex items-center justify-center">
                        <svg viewBox="0 0 24 24" width="20" height="20" className="text-muted-foreground">
                          <path
                            fill="currentColor"
                            d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"
                          />
                        </svg>
                      </div>
                      <button className="bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full text-sm">
                        View email address
                      </button>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 flex items-center justify-center">
                        <svg viewBox="0 0 24 24" width="20" height="20" className="text-muted-foreground">
                          <path
                            fill="currentColor"
                            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-.45-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"
                          />
                        </svg>
                      </div>
                      <div className="text-sm">www.youtube.com/@Drberg</div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 flex items-center justify-center">
                        <svg viewBox="0 0 24 24" width="20" height="20" className="text-muted-foreground">
                          <path
                            fill="currentColor"
                            d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
                          />
                        </svg>
                      </div>
                      <div className="text-sm">United States</div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 flex items-center justify-center">
                        <svg viewBox="0 0 24 24" width="20" height="20" className="text-muted-foreground">
                          <path
                            fill="currentColor"
                            d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z"
                          />
                          <path fill="currentColor" d="M12.5 7H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
                        </svg>
                      </div>
                      <div className="text-sm">Joined Nov 24, 2008</div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 flex items-center justify-center">
                        <svg viewBox="0 0 24 24" width="20" height="20" className="text-muted-foreground">
                          <path
                            fill="currentColor"
                            d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"
                          />
                        </svg>
                      </div>
                      <div className="text-sm">13.3M subscribers</div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 flex items-center justify-center">
                        <svg viewBox="0 0 24 24" width="20" height="20" className="text-muted-foreground">
                          <path
                            fill="currentColor"
                            d="M18 3v2h-2V3H8v2H6V3H4v18h2v-2h2v2h8v-2h2v2h2V3h-2zM8 17H6v-2h2v2zm0-4H6v-2h2v2zm0-4H6V7h2v2zm10 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V7h2v2z"
                          />
                        </svg>
                      </div>
                      <div className="text-sm">5,510 videos</div>
                    </div>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Mobile navigation */}
          <MobileNav />
        </main>
      </div>
    </div>
  )
}
