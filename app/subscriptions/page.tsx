"use client"

import { useState } from "react"
import { ArrowLeft, Bell, ChevronDown, MoreVertical, Search, Cast, UserMinus, Menu } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useMediaQuery } from "@/hooks/use-media-query"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer"
import { cn } from "@/lib/utils"

import MobileNav from "@/components/mobile-nav"
import DesktopSidebar from "@/components/desktop-sidebar"
import AccountDropdown from "@/components/account-dropdown"

// Sample subscription data
const subscriptions = [
  {
    id: 1,
    name: "5-Minute Smart Fit",
    handle: "@5-minutesmartfit",
    avatar: "/quick-workout-woman.png",
    subscribers: "79.8K subscribers",
    description:
      "Welcome to 5-Minute Smart Fit, where we believe that fitness should be fun, accessible, and tailored to fit your unique needs and goals. Whether you're a beginner just starting out on your fitness journey or a seasoned pro",
    verified: false,
    hasNewContent: false,
  },
  {
    id: 2,
    name: "ABASRC Cumilla",
    handle: "@abasrccumilla6117",
    avatar: "/letter-a-abstract.png",
    subscribers: "18 subscribers",
    description: "",
    verified: false,
    hasNewContent: false,
  },
  {
    id: 3,
    name: "Abdul Alim Ibne Kawsar Madani",
    handle: "@abdulalimibnekawsarmadani3427",
    avatar: "/portrait-of-abdul-alim.png",
    subscribers: "520 subscribers",
    description: "",
    verified: false,
    hasNewContent: false,
  },
  {
    id: 4,
    name: "Abdul Hi Muhammad Saifullah",
    handle: "@AbdulhiSaifullahofficial",
    avatar: "/friendly-greeting.png",
    subscribers: "387K subscribers",
    description: "",
    verified: true,
    hasNewContent: true,
  },
  {
    id: 5,
    name: "Aesthetics 71",
    handle: "@Aesthetics71Video",
    avatar: "/harmonious-still-life.png",
    subscribers: "45K subscribers",
    description: "",
    verified: false,
    hasNewContent: false,
  },
  {
    id: 6,
    name: "AGS Media",
    handle: "@AGSMedia",
    avatar: "/abstract-geometric-shapes.png",
    subscribers: "12K subscribers",
    description: "",
    verified: false,
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
    name: "Alor poth 1",
    handle: "@alorpoth1605",
    avatar: "/alor-island-coastline.png",
    subscribers: "35K subscribers",
    description: "",
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

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <header className="flex items-center justify-between p-4 border-b md:hidden fixed top-0 left-0 right-0 bg-background z-20">
        <div className="flex items-center gap-4">
          <Link href="/">
            <ArrowLeft className="h-6 w-6" />
          </Link>
          <h1 className="text-xl font-medium">All subscriptions</h1>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="rounded-full">
            <Cast className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="rounded-full">
            <Search className="h-5 w-5" />
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

        <main className={cn("flex-1", isMobile ? "pt-[72px] pb-nav-safe" : "md:pl-[240px] md:pt-[72px]")}>
          {/* Page Content */}
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
              {subscriptions.map((channel) => (
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
                          className="rounded-full"
                          onClick={() => handleNotificationClick(channel.id)}
                        >
                          <Bell className={cn("h-5 w-5", channel.hasNewContent ? "text-blue-500" : "")} />
                        </Button>
                      </DrawerTrigger>
                      <DrawerContent>
                        <DrawerHeader>
                          <DrawerTitle>Notifications</DrawerTitle>
                        </DrawerHeader>
                        <div className="p-4 space-y-4">
                          <div className="flex items-center justify-between py-3">
                            <div className="flex items-center gap-4">
                              <Bell className="h-6 w-6" />
                              <span>All</span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between py-3">
                            <div className="flex items-center gap-4">
                              <Bell className="h-6 w-6" />
                              <span>Personalized</span>
                            </div>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              className="w-6 h-6"
                            >
                              <path
                                fillRule="evenodd"
                                d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                          <div className="flex items-center justify-between py-3">
                            <div className="flex items-center gap-4">
                              <Bell className="h-6 w-6 line-through" />
                              <span>None</span>
                            </div>
                          </div>
                          <div className="border-t pt-4">
                            <div className="flex items-center justify-between py-3">
                              <div className="flex items-center gap-4">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="h-6 w-6"
                                >
                                  <path d="M10 16l-6-6 6-6" />
                                  <path d="M20 21v-7a4 4 0 0 0-4-4H5" />
                                </svg>
                                <span>Unsubscribe</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </DrawerContent>
                    </Drawer>
                  ) : (
                    <DropdownMenu modal={false}>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="rounded-full flex items-center gap-2 px-4">
                          <Bell className="h-4 w-4" />
                          <span>
                            {notificationSettings[channel.id] ? getNotificationLabel(channel.id) : "Subscribed"}
                          </span>
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[240px]">
                        <DropdownMenuItem
                          className="py-3 cursor-pointer flex items-center gap-3"
                          onClick={() => handleNotificationChange(channel.id, "all")}
                        >
                          <div className="flex items-center justify-center w-6 h-6">
                            <Bell className="h-5 w-5" />
                          </div>
                          <span>All</span>
                          {notificationSettings[channel.id] === "all" && (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              className="w-5 h-5 ml-auto"
                            >
                              <path
                                fillRule="evenodd"
                                d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="py-3 cursor-pointer flex items-center gap-3 bg-gray-100"
                          onClick={() => handleNotificationChange(channel.id, "personalized")}
                        >
                          <div className="flex items-center justify-center w-6 h-6">
                            <Bell className="h-5 w-5" />
                          </div>
                          <span>Personalized</span>
                          {(notificationSettings[channel.id] === "personalized" ||
                            !notificationSettings[channel.id]) && (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              className="w-5 h-5 ml-auto"
                            >
                              <path
                                fillRule="evenodd"
                                d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="py-3 cursor-pointer flex items-center gap-3"
                          onClick={() => handleNotificationChange(channel.id, "none")}
                        >
                          <div className="flex items-center justify-center w-6 h-6">
                            <Bell className="h-5 w-5 line-through" />
                          </div>
                          <span>None</span>
                          {notificationSettings[channel.id] === "none" && (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              className="w-5 h-5 ml-auto"
                            >
                              <path
                                fillRule="evenodd"
                                d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                        </DropdownMenuItem>
                        <div className="border-t my-1"></div>
                        <DropdownMenuItem className="py-3 cursor-pointer flex items-center gap-3 text-red-500">
                          <div className="flex items-center justify-center w-6 h-6">
                            <UserMinus className="h-5 w-5" />
                          </div>
                          <span>Unsubscribe</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* Mobile navigation */}
      <MobileNav />
    </div>
  )
}
