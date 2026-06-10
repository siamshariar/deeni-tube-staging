"use client"

import { useState, useEffect } from "react"
import { ArrowLeft, Bell, ChevronDown, BellRing, BellOff, UserMinus, Search, Filter, UserPlus } from "lucide-react"
import Link from "next/link"
import { useMediaQuery } from "@/hooks/use-media-query"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

import AppHeader from "@/components/app-header"
import MobileNav from "@/components/mobile-nav"
import DesktopSidebar from "@/components/desktop-sidebar"

const initialSubscriptions = [
  {
    id: 1,
    name: "Islamic Guidance",
    handle: "@islamicguidance",
    avatar: "/medical-professional-profile.png",
    subscribers: "2.5M subscribers",
    description: "Spreading authentic Islamic knowledge through high quality videos.",
    verified: true,
    hasNewContent: true,
  },
  {
    id: 2,
    name: "Merciful Servant",
    handle: "@mercifulservant",
    avatar: "/placeholder.svg?height=48&width=48",
    subscribers: "1.8M subscribers",
    description: "Islamic reminders and lectures for the soul.",
    verified: true,
    hasNewContent: true,
  },
  {
    id: 3,
    name: "Abdul Alim Ibne Kawsar Madani",
    handle: "@abdulalimibnekawsarmadani3427",
    avatar: "/portrait-of-abdul-alim.png",
    subscribers: "520K subscribers",
    description: "",
    verified: false,
    hasNewContent: false,
  },
  {
    id: 4,
    name: "Digital Mimbar",
    handle: "@digitalmimbar",
    avatar: "/placeholder.svg?height=48&width=48",
    subscribers: "950K subscribers",
    description: "High quality Islamic content for the global Muslim community.",
    verified: true,
    hasNewContent: true,
  },
  {
    id: 5,
    name: "Huda TV",
    handle: "@hudatv",
    avatar: "/placeholder.svg?height=48&width=48",
    subscribers: "3.2M subscribers",
    description: "",
    verified: true,
    hasNewContent: false,
  },
  {
    id: 6,
    name: "Peace TV",
    handle: "@peacetv",
    avatar: "/placeholder.svg?height=48&width=48",
    subscribers: "5.1M subscribers",
    description: "",
    verified: true,
    hasNewContent: false,
  },
  {
    id: 7,
    name: "Ahmadullah",
    handle: "@sheikhahmadullahofficial",
    avatar: "/Scholar in Reflection.png",
    subscribers: "250K subscribers",
    description: "",
    verified: false,
    hasNewContent: true,
  },
  {
    id: 8,
    name: "Daily Dawah",
    handle: "@dailydawah",
    avatar: "/placeholder.svg?height=48&width=48",
    subscribers: "780K subscribers",
    description: "Daily Islamic reminders and dawah content.",
    verified: false,
    hasNewContent: true,
  },
]

type NotificationType = "all" | "personalized" | "none"

function VerifiedIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={cn("w-4 h-4 text-gray-500", className)}>
      <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
    </svg>
  )
}

function ChannelSkeleton() {
  return (
    <div className="flex items-start gap-4 pb-6 border-b border-gray-100">
      <Skeleton className="h-16 w-16 rounded-full flex-shrink-0" />
      <div className="flex-1 min-w-0 space-y-2">
        <Skeleton className="h-5 w-48" />
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-full" />
      </div>
      <Skeleton className="h-10 w-32 rounded-full flex-shrink-0" />
    </div>
  )
}

// Toast notification component
function Toast({ message, isVisible, onClose }: { message: string; isVisible: boolean; onClose: () => void }) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(onClose, 3000)
      return () => clearTimeout(timer)
    }
  }, [isVisible, onClose])

  if (!isVisible) return null

  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-black/90 text-white px-6 py-3 rounded-full text-sm font-medium shadow-lg animate-fade-in-up">
      {message}
    </div>
  )
}

export default function SubscriptionsPage() {
  const router = useRouter()
  const [subscriptions, setSubscriptions] = useState(() => {
    // Load from localStorage or use initial data
    if (typeof window !== 'undefined') {
      const unsubscribedIds = JSON.parse(localStorage.getItem('unsubscribedChannels') || '[]')
      return initialSubscriptions.filter(sub => !unsubscribedIds.includes(sub.id))
    }
    return initialSubscriptions
  })
  const [unsubscribedIds, setUnsubscribedIds] = useState<number[]>(() => {
    if (typeof window !== 'undefined') {
      return JSON.parse(localStorage.getItem('unsubscribedChannels') || '[]')
    }
    return []
  })
  const [pendingUnsubscribes, setPendingUnsubscribes] = useState<number[]>([])
  const [notificationDrawerOpen, setNotificationDrawerOpen] = useState(false)
  const [selectedChannel, setSelectedChannel] = useState<number | null>(null)
  const [notificationSettings, setNotificationSettings] = useState<Record<number, NotificationType>>({})
  const [selectedFilter, setSelectedFilter] = useState<string>("A-Z")
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [toastVisible, setToastVisible] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const isMobile = useMediaQuery("(max-width: 768px)")

  // Simulate loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  const handleUnsubscribe = (channelId: number, channelName: string) => {
    // Add to pending unsubscribes (show Subscribe button immediately)
    setPendingUnsubscribes(prev => [...prev, channelId])
    
    // Add to localStorage for persistence on page reload
    const updatedUnsubscribedIds = [...unsubscribedIds, channelId]
    setUnsubscribedIds(updatedUnsubscribedIds)
    localStorage.setItem('unsubscribedChannels', JSON.stringify(updatedUnsubscribedIds))
    
    // Show toast
    setToastMessage(`Unsubscribed from ${channelName}`)
    setToastVisible(true)
  }

  const handleResubscribe = (channelId: number, channelName: string) => {
    // Remove from pending unsubscribes
    setPendingUnsubscribes(prev => prev.filter(id => id !== channelId))
    
    // Remove from localStorage
    const updatedUnsubscribedIds = unsubscribedIds.filter(id => id !== channelId)
    setUnsubscribedIds(updatedUnsubscribedIds)
    localStorage.setItem('unsubscribedChannels', JSON.stringify(updatedUnsubscribedIds))
    
    // Show toast
    setToastMessage(`Resubscribed to ${channelName}`)
    setToastVisible(true)
  }

  const handleNotificationClick = (channelId: number) => {
    setSelectedChannel(channelId)
    if (isMobile) {
      setNotificationDrawerOpen(true)
    }
  }

  const handleNotificationChange = (channelId: number, type: NotificationType) => {
    setNotificationSettings((prev) => ({
      ...prev,
      [channelId]: type,
    }))
    if (isMobile) {
      setNotificationDrawerOpen(false)
    }
  }

  const getNotificationLabel = (channelId: number): string => {
    const setting = notificationSettings[channelId] || "personalized"
    if (setting === "all") return "All"
    if (setting === "personalized") return "Personalized"
    if (setting === "none") return "None"
    return "Subscribed"
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "all": return <Bell className="h-5 w-5" />
      case "personalized": return <BellRing className="h-5 w-5" />
      case "none": return <BellOff className="h-5 w-5" />
      default: return <Bell className="h-5 w-5" />
    }
  }

  // Filter and sort subscriptions
  const filteredSubscriptions = subscriptions
    .filter((channel) => {
      if (!searchQuery) return true
      const query = searchQuery.toLowerCase()
      return (
        channel.name.toLowerCase().includes(query) ||
        channel.handle.toLowerCase().includes(query) ||
        channel.description.toLowerCase().includes(query)
      )
    })
    .sort((a, b) => {
      switch (selectedFilter) {
        case "A-Z":
          return a.name.localeCompare(b.name)
        case "Most relevant":
          if (a.hasNewContent && !b.hasNewContent) return -1
          if (!a.hasNewContent && b.hasNewContent) return 1
          return a.name.localeCompare(b.name)
        case "New activity":
          if (a.hasNewContent && !b.hasNewContent) return -1
          if (!a.hasNewContent && b.hasNewContent) return 1
          return 0
        default:
          return 0
      }
    })

  return (
    <div className="min-h-screen bg-background">
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.3s ease-out;
        }
      `}</style>

      <AppHeader />

      {/* Toast Notification */}
      <Toast 
        message={toastMessage} 
        isVisible={toastVisible} 
        onClose={() => setToastVisible(false)} 
      />

      {/* Mobile Header */}
      <div className="md:hidden flex items-center gap-4 px-4 py-3  border-b bg-background sticky top-[56px] z-10">
        <button onClick={() => router.back()} className="flex items-center justify-center h-9 w-9 rounded-full hover:bg-muted transition-colors">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="font-semibold text-lg">All subscriptions</h1>
      </div>

      <div className="flex">
        <DesktopSidebar className="hidden md:block" />

        <main className={cn("flex-1", isMobile ? "pb-nav-safe" : "md:pl-[240px] md:pt-[80px]")}>
          <div className="max-w-[1096px] mx-auto p-4 md:p-6">
            {/* Desktop Title */}
            {!isMobile && (
              <div className="mb-6">
                <h1 className="text-2xl font-bold">All subscriptions</h1>
              </div>
            )}

            {/* Search and Filter Bar */}
            <div className="flex items-center gap-3 mb-6">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search subscriptions"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-muted/50 rounded-full text-sm outline-none focus:bg-muted transition-colors"
                />
              </div>

              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="rounded-full gap-2">
                    <Filter className="h-4 w-4" />
                    <span className="hidden sm:inline">{selectedFilter}</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px]">
                  <DropdownMenuItem className="py-3 cursor-pointer" onClick={() => setSelectedFilter("Most relevant")}>
                    Most relevant
                  </DropdownMenuItem>
                  <DropdownMenuItem className="py-3 cursor-pointer" onClick={() => setSelectedFilter("New activity")}>
                    New activity
                  </DropdownMenuItem>
                  <DropdownMenuItem className="py-3 cursor-pointer" onClick={() => setSelectedFilter("A-Z")}>
                    A-Z
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Subscriptions Count */}
            <div className="text-sm text-muted-foreground mb-4">
              {filteredSubscriptions.length} subscription{filteredSubscriptions.length !== 1 ? 's' : ''}
            </div>

            {/* Subscriptions List */}
            {isLoading ? (
              <div className="space-y-6">
                <ChannelSkeleton />
                <ChannelSkeleton />
                <ChannelSkeleton />
                <ChannelSkeleton />
                <ChannelSkeleton />
              </div>
            ) : filteredSubscriptions.length > 0 ? (
              <div className="space-y-6">
                {filteredSubscriptions.map((channel) => {
                  const currentSetting = notificationSettings[channel.id] || "personalized"
                  const isUnsubscribed = pendingUnsubscribes.includes(channel.id)

                  return (
                    <div key={channel.id} className="flex items-start gap-3 md:gap-4 pb-4 md:pb-6 border-b border-gray-100 last:border-0">
                      {/* Avatar */}
                      <Link href={`/channel/${channel.id}`} className="flex-shrink-0">
                        <Avatar className={cn("h-12 w-12 md:h-16 md:w-16 hover:opacity-80 transition-opacity", channel.hasNewContent && !isUnsubscribed && "ring-2 ring-blue-500 ring-offset-2")}>
                          <AvatarImage src={channel.avatar || "/placeholder.svg"} />
                          <AvatarFallback>{channel.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                      </Link>

                      {/* Channel Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1 flex-wrap">
                          <Link href={`/channel/${channel.id}`} className="font-medium hover:underline line-clamp-1">
                            <h3 className="text-sm md:text-base">{channel.name}</h3>
                          </Link>
                          {channel.verified && <VerifiedIcon />}
                          {channel.hasNewContent && !isUnsubscribed && (
                            <span className="inline-flex items-center gap-1 text-xs text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded-full font-medium ml-1">
                              <span className="w-1.5 h-1.5 bg-blue-600 rounded-full" />
                              New
                            </span>
                          )}
                          {isUnsubscribed && (
                            <span className="inline-flex items-center gap-1 text-xs text-red-600 bg-red-50 px-1.5 py-0.5 rounded-full font-medium ml-1">
                              Unsubscribed
                            </span>
                          )}
                        </div>
                        <p className="text-xs md:text-sm text-muted-foreground">{channel.handle}</p>
                        {!isMobile && channel.subscribers && (
                          <p className="text-xs md:text-sm text-muted-foreground mt-1">{channel.subscribers}</p>
                        )}
                        {!isMobile && channel.description && (
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{channel.description}</p>
                        )}
                      </div>

                      {/* Action Button */}
                      <div className="flex-shrink-0">
                        {isUnsubscribed ? (
                          <Button
                            variant="outline"
                            className="rounded-full flex items-center gap-2 px-4 h-9"
                            onClick={() => handleResubscribe(channel.id, channel.name)}
                          >
                            <UserPlus className="h-4 w-4" />
                            <span className="text-sm">Subscribe</span>
                          </Button>
                        ) : isMobile ? (
                          <Drawer open={notificationDrawerOpen && selectedChannel === channel.id} onOpenChange={setNotificationDrawerOpen}>
                            <DrawerTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="rounded-full"
                                onClick={() => handleNotificationClick(channel.id)}
                              >
                                <Bell className={cn("h-5 w-5", channel.hasNewContent ? "text-blue-500" : "text-muted-foreground")} />
                              </Button>
                            </DrawerTrigger>
                            <DrawerContent>
                              <DrawerHeader>
                                <DrawerTitle className="text-center">Notifications for {channel.name}</DrawerTitle>
                              </DrawerHeader>
                              <div className="p-4 space-y-2 pb-8">
                                <button
                                  onClick={() => handleNotificationChange(channel.id, "all")}
                                  className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-left transition-colors ${currentSetting === "all" ? "bg-muted" : "hover:bg-muted/50"}`}
                                >
                                  <Bell className="h-5 w-5" />
                                  <div>
                                    <p className="font-medium">All</p>
                                    <p className="text-sm text-muted-foreground">Get all notifications from this channel</p>
                                  </div>
                                </button>
                                <button
                                  onClick={() => handleNotificationChange(channel.id, "personalized")}
                                  className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-left transition-colors ${currentSetting === "personalized" ? "bg-muted" : "hover:bg-muted/50"}`}
                                >
                                  <BellRing className="h-5 w-5" />
                                  <div>
                                    <p className="font-medium">Personalized</p>
                                    <p className="text-sm text-muted-foreground">Get notifications based on your activity</p>
                                  </div>
                                </button>
                                <button
                                  onClick={() => handleNotificationChange(channel.id, "none")}
                                  className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-left transition-colors ${currentSetting === "none" ? "bg-muted" : "hover:bg-muted/50"}`}
                                >
                                  <BellOff className="h-5 w-5" />
                                  <div>
                                    <p className="font-medium">None</p>
                                    <p className="text-sm text-muted-foreground">Don't receive notifications</p>
                                  </div>
                                </button>
                                <div className="border-t pt-2 mt-2">
                                  <button
                                    onClick={() => {
                                      handleUnsubscribe(channel.id, channel.name)
                                      setNotificationDrawerOpen(false)
                                    }}
                                    className="w-full flex items-center gap-4 px-4 py-3.5 rounded-xl text-left text-red-500 hover:bg-red-50 transition-colors"
                                  >
                                    <UserMinus className="h-5 w-5" />
                                    <div>
                                      <p className="font-medium">Unsubscribe</p>
                                      <p className="text-sm">Remove from subscriptions</p>
                                    </div>
                                  </button>
                                </div>
                              </div>
                            </DrawerContent>
                          </Drawer>
                        ) : (
                          <DropdownMenu modal={false}>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" className="rounded-full flex items-center gap-2 px-4 h-9">
                                {getNotificationIcon(currentSetting)}
                                <span className="text-sm hidden sm:inline">{getNotificationLabel(channel.id)}</span>
                                <ChevronDown className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-[240px] p-0">
                              <div className="py-1">
                                <DropdownMenuItem
                                  className={`py-3 cursor-pointer flex items-center gap-3 px-4 ${currentSetting === "all" ? "bg-muted" : ""}`}
                                  onClick={() => handleNotificationChange(channel.id, "all")}
                                >
                                  <Bell className="h-5 w-5" />
                                  <div>
                                    <p className="font-medium text-sm">All</p>
                                    <p className="text-xs text-muted-foreground">All notifications</p>
                                  </div>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className={`py-3 cursor-pointer flex items-center gap-3 px-4 ${currentSetting === "personalized" ? "bg-muted" : ""}`}
                                  onClick={() => handleNotificationChange(channel.id, "personalized")}
                                >
                                  <BellRing className="h-5 w-5" />
                                  <div>
                                    <p className="font-medium text-sm">Personalized</p>
                                    <p className="text-xs text-muted-foreground">Based on activity</p>
                                  </div>
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className={`py-3 cursor-pointer flex items-center gap-3 px-4 ${currentSetting === "none" ? "bg-muted" : ""}`}
                                  onClick={() => handleNotificationChange(channel.id, "none")}
                                >
                                  <BellOff className="h-5 w-5" />
                                  <div>
                                    <p className="font-medium text-sm">None</p>
                                    <p className="text-xs text-muted-foreground">No notifications</p>
                                  </div>
                                </DropdownMenuItem>
                              </div>
                              <div className="border-t py-1">
                                <DropdownMenuItem 
                                  className="py-3 cursor-pointer flex items-center gap-3 px-4 text-red-500 hover:text-red-600"
                                  onClick={() => handleUnsubscribe(channel.id, channel.name)}
                                >
                                  <UserMinus className="h-5 w-5" />
                                  <div>
                                    <p className="font-medium text-sm">Unsubscribe</p>
                                  </div>
                                </DropdownMenuItem>
                              </div>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-1">No subscriptions found</h3>
                <p className="text-muted-foreground">Try adjusting your search or filter</p>
              </div>
            )}
          </div>
        </main>
      </div>

      <MobileNav />
    </div>
  )
}