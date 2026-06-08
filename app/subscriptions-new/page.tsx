"use client"

import { useState } from "react"
import { ArrowLeft, Bell, ChevronDown, BellRing, BellOff, UserMinus } from "lucide-react"
import Link from "next/link"
import { useMediaQuery } from "@/hooks/use-media-query"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"
import { cn } from "@/lib/utils"

import AppHeader from "@/components/app-header"
import MobileNav from "@/components/mobile-nav"
import DesktopSidebar from "@/components/desktop-sidebar"

const subscriptions = [
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

export default function SubscriptionsPage() {
  const [notificationDrawerOpen, setNotificationDrawerOpen] = useState(false)
  const [selectedChannel, setSelectedChannel] = useState<number | null>(null)
  const [notificationSettings, setNotificationSettings] = useState<Record<number, NotificationType>>({})
  const isMobile = useMediaQuery("(max-width: 768px)")
  const [selectedFilter, setSelectedFilter] = useState<string>("A-Z")

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
  }

  const getNotificationLabel = (channelId: number): string => {
    const setting = notificationSettings[channelId] || "personalized"
    if (setting === "all") return "All notifications"
    if (setting === "personalized") return "Personalized"
    if (setting === "none") return "No notifications"
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

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      {/* Mobile Back + Title */}
      <div className="md:hidden flex items-center gap-4 px-4 py-2 pt-[64px] border-b bg-background">
        <Link href="/">
          <ArrowLeft className="h-6 w-6" />
        </Link>
        <h1 className="font-semibold text-lg">All subscriptions</h1>
      </div>

      <div className="flex">
        <DesktopSidebar className="hidden md:block" />

        <main className={cn("flex-1", isMobile ? "pb-nav-safe" : "md:pl-[240px] md:pt-[80px]")}>
          <div className="p-4">
            {!isMobile && <h1 className="text-2xl font-bold mb-4">All subscriptions</h1>}

            {/* Filter Dropdown */}
            <div className="mb-6">
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="rounded-full bg-gray-100 hover:bg-gray-200">
                    {selectedFilter} <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-[240px]">
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

            {/* Subscriptions List */}
            <div className="space-y-6">
              {subscriptions.map((channel) => {
                const currentSetting = notificationSettings[channel.id] || "personalized"
                return (
                  <div
                    key={channel.id}
                    className={cn(
                      "flex items-start gap-4",
                      isMobile ? "pb-4 border-b border-gray-100" : "pb-6 border-b border-gray-100",
                    )}
                  >
                    <Avatar className={cn(isMobile ? "h-12 w-12" : "h-16 w-16")}>
                      <AvatarImage src={channel.avatar || "/placeholder.svg"} />
                      <AvatarFallback>{channel.name.charAt(0)}</AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1">
                        <Link href={`/channel/${channel.id}`} className="font-medium hover:underline">
                          <h3>{channel.name}</h3>
                        </Link>
                        {channel.verified && (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-4 h-4 text-gray-500"
                          >
                            <path
                              fillRule="evenodd"
                              d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z"
                              clipRule="evenodd"
                            />
                          </svg>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{channel.handle}</p>
                      {!isMobile && channel.subscribers && (
                        <p className="text-sm text-muted-foreground mt-1">{channel.subscribers}</p>
                      )}
                      {!isMobile && channel.description && (
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{channel.description}</p>
                      )}
                    </div>

                    {isMobile ? (
                      <Drawer
                        open={notificationDrawerOpen && selectedChannel === channel.id}
                        onOpenChange={setNotificationDrawerOpen}
                      >
                        <DrawerTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-full flex-shrink-0"
                            onClick={() => handleNotificationClick(channel.id)}
                          >
                            <Bell className={cn("h-5 w-5", channel.hasNewContent ? "text-blue-500" : "")} />
                          </Button>
                        </DrawerTrigger>
                        <DrawerContent>
                          <DrawerHeader>
                            <DrawerTitle>Notifications</DrawerTitle>
                          </DrawerHeader>
                          <div className="p-4 space-y-2">
                            <button
                              onClick={() => handleNotificationChange(channel.id, "all")}
                              className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg ${currentSetting === "all" ? "bg-muted" : ""}`}
                            >
                              <Bell className="h-5 w-5" />
                              <span>All</span>
                            </button>
                            <button
                              onClick={() => handleNotificationChange(channel.id, "personalized")}
                              className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg ${currentSetting === "personalized" ? "bg-muted" : ""}`}
                            >
                              <BellRing className="h-5 w-5" />
                              <span>Personalized</span>
                            </button>
                            <button
                              onClick={() => handleNotificationChange(channel.id, "none")}
                              className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg ${currentSetting === "none" ? "bg-muted" : ""}`}
                            >
                              <BellOff className="h-5 w-5" />
                              <span>None</span>
                            </button>
                          </div>
                        </DrawerContent>
                      </Drawer>
                    ) : (
                      <DropdownMenu modal={false}>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" className="rounded-full flex items-center gap-2 px-4 flex-shrink-0">
                            {getNotificationIcon(currentSetting)}
                            <span className="text-sm">{getNotificationLabel(channel.id)}</span>
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[240px] p-0">
                          <DropdownMenuItem
                            className={`py-3 cursor-pointer flex items-center gap-3 px-4 ${currentSetting === "all" ? "bg-muted" : ""}`}
                            onClick={() => handleNotificationChange(channel.id, "all")}
                          >
                            <Bell className="h-5 w-5" />
                            <span>All</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className={`py-3 cursor-pointer flex items-center gap-3 px-4 ${currentSetting === "personalized" ? "bg-muted" : ""}`}
                            onClick={() => handleNotificationChange(channel.id, "personalized")}
                          >
                            <BellRing className="h-5 w-5" />
                            <span>Personalized</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className={`py-3 cursor-pointer flex items-center gap-3 px-4 ${currentSetting === "none" ? "bg-muted" : ""}`}
                            onClick={() => handleNotificationChange(channel.id, "none")}
                          >
                            <BellOff className="h-5 w-5" />
                            <span>None</span>
                          </DropdownMenuItem>
                          <div className="border-t">
                            <DropdownMenuItem className="py-3 cursor-pointer flex items-center gap-3 px-4 text-red-500">
                              <UserMinus className="h-5 w-5" />
                              <span>Unsubscribe</span>
                            </DropdownMenuItem>
                          </div>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </main>
      </div>

      <MobileNav />
    </div>
  )
}