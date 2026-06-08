"use client"

import { useState } from "react"
import { useRouter, useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, MoreVertical, Share, Clock, Bookmark, Ban, UserX, Flag, ListPlus, ChevronDown } from "lucide-react"
import AppHeader from "@/components/app-header"
import MobileNav from "@/components/mobile-nav"
import DesktopSidebar from "@/components/desktop-sidebar"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const videoData = {
  id: "v1",
  title: "The Purpose of Life - Powerful Islamic Reminder",
  description: "A powerful reminder about the true purpose of life from an Islamic perspective. This lecture covers the fundamental questions that every human being asks: Why are we here? What is our purpose? Where are we going? Sheikh explains these concepts with references from the Quran and Sunnah.",
  channel: "Daily Dawah",
  channelAvatar: "/placeholder.svg?height=36&width=36",
  subscribers: "780K subscribers",
  views: "208K views",
  publishedAt: "6 days ago",
  likes: "15K",
  duration: "18:28",
  videoUrl: "https://www.youtube.com/embed/5qap5aO4i9A",
  isSubscribed: true,
}

const relatedVideos = [
  { id: "r1", title: "What Happens After Death? Islamic Perspective", channel: "Daily Dawah", views: "180K views", timeAgo: "1 week ago", duration: "22:15", thumbnail: "/placeholder.svg?height=480&width=854" },
  { id: "r2", title: "The Day of Judgment - Signs and Events", channel: "Islamic Guidance", views: "3.4M views", timeAgo: "2 weeks ago", duration: "32:10", thumbnail: "/placeholder.svg?height=480&width=854" },
  { id: "r3", title: "How to Find Peace in Difficult Times", channel: "Merciful Servant", views: "450K views", timeAgo: "3 days ago", duration: "15:40", thumbnail: "/placeholder.svg?height=480&width=854" },
  { id: "r4", title: "The Beauty of Islam - A Reminder for All", channel: "Daily Dawah", views: "890K views", timeAgo: "1 month ago", duration: "28:05", thumbnail: "/placeholder.svg?height=480&width=854" },
  { id: "r5", title: "Tafsir of Surah Al-Fatiha", channel: "Islamic Guidance", views: "150K views", timeAgo: "3 days ago", duration: "25:15", thumbnail: "/placeholder.svg?height=480&width=854" },
]

export default function VideoPlayPage() {
  const router = useRouter()
  const params = useParams()
  const [showDescription, setShowDescription] = useState(false)
  const [showComments, setShowComments] = useState(false)

  const video = videoData

  const menuItems = (
    <>
      <div className="flex items-center gap-3 px-4 py-3 hover:bg-muted cursor-pointer">
        <ListPlus className="h-5 w-5" /><span>Add to queue</span>
      </div>
      <div className="flex items-center gap-3 px-4 py-3 hover:bg-muted cursor-pointer">
        <Clock className="h-5 w-5" /><span>Save to Watch later</span>
      </div>
      <div className="flex items-center gap-3 px-4 py-3 hover:bg-muted cursor-pointer">
        <Bookmark className="h-5 w-5" /><span>Save to playlist</span>
      </div>
      <div className="flex items-center gap-3 px-4 py-3 hover:bg-muted cursor-pointer">
        <Share className="h-5 w-5" /><span>Share</span>
      </div>
      <div className="flex items-center gap-3 px-4 py-3 hover:bg-muted cursor-pointer">
        <Ban className="h-5 w-5" /><span>Not interested</span>
      </div>
      <div className="flex items-center gap-3 px-4 py-3 hover:bg-muted cursor-pointer">
        <UserX className="h-5 w-5" /><span>Don't recommend channel</span>
      </div>
      <div className="flex items-center gap-3 px-4 py-3 hover:bg-muted cursor-pointer">
        <Flag className="h-5 w-5" /><span>Report</span>
      </div>
    </>
  )

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <div className="flex">
        <DesktopSidebar className="hidden md:block" />
        <div className="flex-1 md:pl-[240px] pt-[56px] md:pt-[80px] pb-nav-safe md:pb-6">
          {/* Mobile Back */}
          <div className="md:hidden flex items-center gap-3 px-4 py-2">
            <button onClick={() => router.back()} className="flex items-center justify-center h-9 w-9 rounded-full hover:bg-muted transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="font-semibold text-sm line-clamp-1">{video.title}</h1>
          </div>

          <div className="max-w-[1280px] mx-auto flex flex-col lg:flex-row gap-4 p-2 md:p-4">
            {/* Video Player */}
            <div className="flex-1 min-w-0">
              <div className="relative aspect-video w-full bg-black rounded-lg overflow-hidden">
                <iframe
                  src={video.videoUrl}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>

              {/* Video Info */}
              <div className="mt-3">
                <h1 className="text-lg md:text-xl font-bold">{video.title}</h1>
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-4">
                    <Link href={`/channel/islamic-guidance`} className="flex items-center gap-3 group">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={video.channelAvatar} /><AvatarFallback>{video.channel.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium group-hover:text-primary">{video.channel}</p>
                        <p className="text-xs text-muted-foreground">{video.subscribers}</p>
                      </div>
                    </Link>
                    <Button className="rounded-full bg-black text-white hover:bg-gray-800 h-9 text-sm px-4">
                      Subscribed
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="rounded-full"><MoreVertical className="h-5 w-5" /></Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-[240px] p-0 rounded-xl">{menuItems}</DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {/* Description */}
                <div className="mt-3 bg-muted/40 rounded-lg p-3">
                  <div className="flex items-center gap-2 text-sm">
                    <span>{video.views}</span><span>{video.publishedAt}</span>
                  </div>
                  <p className="text-sm mt-2">
                    {showDescription ? video.description : video.description.substring(0, 100) + "..."}
                    <button onClick={() => setShowDescription(!showDescription)} className="text-blue-600 ml-1 hover:underline font-medium">
                      {showDescription ? "Show less" : "...more"}
                    </button>
                  </p>
                </div>

                {/* Comments */}
                <div className="mt-3">
                  <button onClick={() => setShowComments(!showComments)} className="text-sm font-medium hover:underline">
                    See Comments
                  </button>
                </div>

                {/* Comments Drawer */}
                <Drawer open={showComments} onOpenChange={setShowComments}>
                  <DrawerContent className="px-4 max-h-[70vh] overflow-y-auto">
                    <h3 className="font-semibold text-lg py-4 border-b">Comments</h3>
                    <div className="py-4 space-y-4">
                      <div className="flex gap-3">
                        <Avatar className="h-8 w-8"><AvatarFallback>A</AvatarFallback></Avatar>
                        <div><p className="text-sm font-medium">Ahmad</p><p className="text-sm text-muted-foreground">MashaAllah, very beneficial lecture. JazakAllah khair!</p></div>
                      </div>
                      <div className="flex gap-3">
                        <Avatar className="h-8 w-8"><AvatarFallback>F</AvatarFallback></Avatar>
                        <div><p className="text-sm font-medium">Fatima</p><p className="text-sm text-muted-foreground">Beautiful reminder. May Allah guide us all.</p></div>
                      </div>
                      <div className="flex gap-3">
                        <Avatar className="h-8 w-8"><AvatarFallback>O</AvatarFallback></Avatar>
                        <div><p className="text-sm font-medium">Omar</p><p className="text-sm text-muted-foreground">This changed my perspective on life. Thank you!</p></div>
                      </div>
                    </div>
                  </DrawerContent>
                </Drawer>
              </div>

              {/* Related Videos - Mobile */}
              <div className="mt-6 lg:hidden">
                <h3 className="font-semibold text-sm mb-3">Related Videos</h3>
                <div className="space-y-4">
                  {relatedVideos.map((video) => (
                    <Link key={video.id} href={`/videos/${video.id}`} className="flex gap-3">
                      <div className="relative w-40 h-24 flex-shrink-0">
                        <Image src={video.thumbnail} alt={video.title} fill className="object-cover rounded-lg" />
                        <div className="absolute bottom-1 right-1 bg-black bg-opacity-80 text-white text-xs px-1 py-0.5 rounded">{video.duration}</div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm line-clamp-2">{video.title}</h4>
                        <p className="text-xs text-muted-foreground mt-1">{video.channel}</p>
                        <p className="text-xs text-muted-foreground">{video.views} • {video.timeAgo}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>

            {/* Related Videos - Desktop Sidebar */}
            <div className="hidden lg:block w-[360px] flex-shrink-0">
              <h3 className="font-semibold text-sm mb-3">Related Videos</h3>
              <div className="space-y-3">
                {relatedVideos.map((video) => (
                  <Link key={video.id} href={`/videos/${video.id}`} className="flex gap-2 group">
                    <div className="relative w-[168px] h-[94px] flex-shrink-0">
                      <Image src={video.thumbnail} alt={video.title} fill className="object-cover rounded-lg" />
                      <div className="absolute bottom-1 right-1 bg-black bg-opacity-80 text-white text-xs px-1 py-0.5 rounded">{video.duration}</div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-xs line-clamp-2 group-hover:text-primary">{video.title}</h4>
                      <p className="text-[11px] text-muted-foreground mt-1">{video.channel}</p>
                      <p className="text-[11px] text-muted-foreground">{video.views} • {video.timeAgo}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <MobileNav />
    </div>
  )
}