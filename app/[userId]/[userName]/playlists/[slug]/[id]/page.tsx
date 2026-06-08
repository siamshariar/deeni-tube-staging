"use client"

import { useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, Share, Trash2 } from "lucide-react"
import AppHeader from "@/components/app-header"
import MobileNav from "@/components/mobile-nav"
import DesktopSidebar from "@/components/desktop-sidebar"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Image from "next/image"
import Link from "next/link"

const sampleVideos = [
  { id: "v1", title: "Tafsir of Surah Al-Fatiha - Complete Explanation", channel: "Islamic Guidance", channelAvatar: "/placeholder.svg?height=36&width=36", views: "150K views", timeAgo: "3 days ago", duration: "25:15", thumbnail: "/placeholder.svg?height=480&width=854", addedAt: "2026-06-05" },
  { id: "v2", title: "The Purpose of Life - Powerful Islamic Reminder", channel: "Daily Dawah", channelAvatar: "/placeholder.svg?height=36&width=36", views: "208K views", timeAgo: "6 days ago", duration: "18:28", thumbnail: "/placeholder.svg?height=480&width=854", addedAt: "2026-06-01" },
  { id: "v3", title: "How to Pray Salah - Step by Step Guide", channel: "Digital Mimbar", channelAvatar: "/placeholder.svg?height=36&width=36", views: "500K views", timeAgo: "1 week ago", duration: "12:40", thumbnail: "/placeholder.svg?height=480&width=854", addedAt: "2026-05-28" },
]

const playlistData = {
  name: "Quran Tafsir Series",
  isPublic: true,
  videoCount: 3,
}

export default function PlaylistDetailPage() {
  const router = useRouter()
  const params = useParams()
  const [videos, setVideos] = useState(sampleVideos)
  const [playlist, setPlaylist] = useState(playlistData)

  const sortedVideos = [...videos].sort((a, b) => b.addedAt.localeCompare(a.addedAt))

  const handleRemoveVideo = (id: string) => {
    setVideos(videos.filter((v) => v.id !== id))
    setPlaylist({ ...playlist, videoCount: playlist.videoCount - 1 })
  }

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/${params.userId}/${params.userName}/playlists/${params.slug}/${params.id}`
    navigator.clipboard?.writeText(shareUrl)
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />

      <div className="flex">
        <DesktopSidebar className="hidden md:block" />

        <div className="flex-1 md:pl-[240px] pt-[56px] md:pt-[80px] pb-nav-safe md:pb-6">
          <div className="md:hidden flex items-center gap-3 px-4 py-2 border-b">
            <button onClick={() => router.back()} className="flex items-center justify-center h-9 w-9 rounded-full hover:bg-muted transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="font-semibold text-lg truncate">{playlist.name}</h1>
          </div>

          <div className="max-w-3xl mx-auto px-4">
            <div className="hidden md:flex items-center justify-between py-4">
              <div>
                <h1 className="text-2xl font-bold">{playlist.name}</h1>
                <p className="text-sm text-muted-foreground mt-1">{playlist.videoCount} videos • {playlist.isPublic ? "Public" : "Private"}</p>
              </div>
              {playlist.isPublic && (
                <Button variant="outline" size="sm" className="rounded-full" onClick={handleShare}>
                  <Share className="h-4 w-4 mr-2" />Share
                </Button>
              )}
            </div>

            {playlist.isPublic && (
              <div className="md:hidden py-3">
                <Button variant="outline" className="w-full rounded-full" onClick={handleShare}>
                  <Share className="h-4 w-4 mr-2" />Share Playlist
                </Button>
              </div>
            )}

            <p className="text-sm text-muted-foreground mb-4 md:hidden">{playlist.videoCount} videos • {playlist.isPublic ? "Public" : "Private"}</p>

            <div className="space-y-4">
              {sortedVideos.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground text-sm">No videos in this playlist</div>
              ) : (
                sortedVideos.map((video) => (
                  <div key={video.id} className="flex gap-3">
                    <Link href={`/videos/${video.id}`} className="relative w-40 h-24 flex-shrink-0">
                      <Image src={video.thumbnail} alt={video.title} fill className="object-cover rounded-lg" />
                      <div className="absolute bottom-1 right-1 bg-black bg-opacity-80 text-white text-xs px-1 py-0.5 rounded">{video.duration}</div>
                    </Link>
                    <div className="flex-1 min-w-0">
                      <Link href={`/videos/${video.id}`}>
                        <h3 className="font-medium text-sm line-clamp-2 hover:text-primary transition-colors">{video.title}</h3>
                      </Link>
                      <div className="flex items-center gap-2 mt-1">
                        <Avatar className="h-5 w-5"><AvatarImage src={video.channelAvatar} /><AvatarFallback>{video.channel.charAt(0)}</AvatarFallback></Avatar>
                        <span className="text-xs text-muted-foreground">{video.channel}</span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        <span>{video.views}</span><span className="mx-1">•</span><span>{video.timeAgo}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRemoveVideo(video.id)}
                      className="p-1.5 rounded-full hover:bg-muted transition-colors self-start flex-shrink-0"
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
      <MobileNav />
    </div>
  )
}