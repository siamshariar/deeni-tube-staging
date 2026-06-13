"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, Share, Trash2, Play, Shuffle, MoreVertical, Search, X, Globe, Lock, Copy, Check, Pencil } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import AppHeader from "@/components/app-header"
import MobileNav from "@/components/mobile-nav"
import DesktopSidebar from "@/components/desktop-sidebar"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useMediaQuery } from "@/hooks/use-media-query"
import { cn } from "@/lib/utils"

// Sample video data (real implementation would fetch from API)
const defaultVideosByPlaylist: Record<string, any[]> = {
  "1": [
    { id: "v1", title: "Tafsir of Surah Al-Fatiha - Complete Explanation", channel: "Islamic Guidance", channelAvatar: "/placeholder.svg?height=36&width=36", views: "150K views", timeAgo: "3 days ago", duration: "25:15", thumbnail: "/placeholder.svg?height=480&width=854", addedAt: "2026-06-05T10:30:00Z" },
    { id: "v2", title: "The Purpose of Life - Powerful Islamic Reminder", channel: "Daily Dawah", channelAvatar: "/placeholder.svg?height=36&width=36", views: "208K views", timeAgo: "6 days ago", duration: "18:28", thumbnail: "/placeholder.svg?height=480&width=854", addedAt: "2026-06-01T14:20:00Z" },
    { id: "v3", title: "How to Pray Salah - Step by Step Guide", channel: "Digital Mimbar", channelAvatar: "/placeholder.svg?height=36&width=36", views: "500K views", timeAgo: "1 week ago", duration: "12:40", thumbnail: "/placeholder.svg?height=480&width=854", addedAt: "2026-05-28T09:15:00Z" },
    { id: "v4", title: "The Day of Judgment - Signs and Events", channel: "Peace TV", channelAvatar: "/placeholder.svg?height=36&width=36", views: "350K views", timeAgo: "2 weeks ago", duration: "32:10", thumbnail: "/placeholder.svg?height=480&width=854", addedAt: "2026-05-20T16:45:00Z" },
    { id: "v5", title: "Stories of the Prophets - Part 1", channel: "Merciful Servant", channelAvatar: "/placeholder.svg?height=36&width=36", views: "1.2M views", timeAgo: "1 month ago", duration: "45:00", thumbnail: "/placeholder.svg?height=480&width=854", addedAt: "2026-05-15T11:00:00Z" },
  ],
  "2": [
    { id: "v6", title: "Story of Prophet Adam (AS)", channel: "Islamic Guidance", channelAvatar: "/placeholder.svg?height=36&width=36", views: "320K views", timeAgo: "1 week ago", duration: "28:15", thumbnail: "/placeholder.svg?height=480&width=854", addedAt: "2026-06-02T08:00:00Z" },
    { id: "v7", title: "Story of Prophet Nuh (AS)", channel: "Daily Dawah", channelAvatar: "/placeholder.svg?height=36&width=36", views: "180K views", timeAgo: "2 weeks ago", duration: "22:40", thumbnail: "/placeholder.svg?height=480&width=854", addedAt: "2026-05-25T12:30:00Z" },
  ],
  "3": [
    { id: "v8", title: "The Importance of Knowledge in Islam", channel: "Digital Mimbar", channelAvatar: "/placeholder.svg?height=36&width=36", views: "250K views", timeAgo: "5 days ago", duration: "35:00", thumbnail: "/placeholder.svg?height=480&width=854", addedAt: "2026-06-03T15:00:00Z" },
    { id: "v9", title: "Patience and Gratitude", channel: "Peace TV", channelAvatar: "/placeholder.svg?height=36&width=36", views: "420K views", timeAgo: "1 week ago", duration: "30:20", thumbnail: "/placeholder.svg?height=480&width=854", addedAt: "2026-05-30T10:00:00Z" },
    { id: "v10", title: "The Power of Dua", channel: "Merciful Servant", channelAvatar: "/placeholder.svg?height=36&width=36", views: "550K views", timeAgo: "2 weeks ago", duration: "25:45", thumbnail: "/placeholder.svg?height=480&width=854", addedAt: "2026-05-22T18:00:00Z" },
  ],
}

// Storage helpers
const getVideosKey = (playlistId: string) => `playlist_videos_${playlistId}`
const getMetaKey = (playlistId: string) => `playlist_meta_${playlistId}`

const loadPlaylistMeta = (playlistId: string): { name: string; isPublic: boolean } => {
  if (typeof window === 'undefined') return { name: "Untitled Playlist", isPublic: false }
  try {
    const stored = localStorage.getItem(getMetaKey(playlistId))
    if (stored) {
      const parsed = JSON.parse(stored)
      if (parsed.name && parsed.name !== "Untitled Playlist") return parsed
    }
    // fallback to main playlists list
    const userId = "550e8400-e29b-41d4-a716-446655440000"
    const allPlaylists = localStorage.getItem(`playlists_${userId}`)
    if (allPlaylists) {
      const playlists = JSON.parse(allPlaylists)
      const found = playlists.find((p: any) => p.id === playlistId)
      if (found) {
        const meta = { name: found.name, isPublic: found.isPublic }
        localStorage.setItem(getMetaKey(playlistId), JSON.stringify(meta))
        return meta
      }
    }
  } catch {}
  return { name: "Untitled Playlist", isPublic: false }
}

const loadPlaylistVideos = (playlistId: string): any[] => {
  if (typeof window === 'undefined') return defaultVideosByPlaylist[playlistId] || []
  try {
    const stored = localStorage.getItem(getVideosKey(playlistId))
    if (stored) {
      const parsed = JSON.parse(stored)
      if (Array.isArray(parsed) && parsed.length) return parsed
    }
  } catch {}
  const defaults = defaultVideosByPlaylist[playlistId] || []
  if (defaults.length) localStorage.setItem(getVideosKey(playlistId), JSON.stringify(defaults))
  return defaults
}

const savePlaylistVideos = (playlistId: string, videos: any[]) => {
  if (typeof window === 'undefined') return
  localStorage.setItem(getVideosKey(playlistId), JSON.stringify(videos))
}

const savePlaylistMeta = (playlistId: string, meta: { name: string; isPublic: boolean }) => {
  if (typeof window === 'undefined') return
  localStorage.setItem(getMetaKey(playlistId), JSON.stringify(meta))
  // also update main playlist list
  const userId = "550e8400-e29b-41d4-a716-446655440000"
  const playlistsKey = `playlists_${userId}`
  try {
    const allPlaylists = localStorage.getItem(playlistsKey)
    if (allPlaylists) {
      const playlists = JSON.parse(allPlaylists)
      const updated = playlists.map((p: any) =>
        p.id === playlistId ? { ...p, name: meta.name, isPublic: meta.isPublic } : p
      )
      localStorage.setItem(playlistsKey, JSON.stringify(updated))
    }
  } catch {}
}

function VideoSkeleton() {
  return (
    <div className="flex gap-3 py-3">
      <Skeleton className="w-40 md:w-56 aspect-video rounded-lg flex-shrink-0" />
      <div className="flex-1 min-w-0 space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-3 w-32" />
      </div>
    </div>
  )
}

export default function PlaylistDetailPage() {
  const router = useRouter()
  const params = useParams()
  const isMobile = useMediaQuery("(max-width: 768px)")
  const playlistId = params.id as string

  const [videos, setVideos] = useState<any[]>([])
  const [playlistName, setPlaylistName] = useState("Loading...")
  const [isPublic, setIsPublic] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [editName, setEditName] = useState("")
  const [editPublic, setEditPublic] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const loadedVideos = loadPlaylistVideos(playlistId)
    const meta = loadPlaylistMeta(playlistId)
    setVideos(loadedVideos)
    setPlaylistName(meta.name)
    setIsPublic(meta.isPublic)
    setEditName(meta.name)
    setEditPublic(meta.isPublic)
    setIsLoading(false)
  }, [playlistId])

  useEffect(() => {
    if (mounted && playlistId) savePlaylistVideos(playlistId, videos)
  }, [videos, playlistId, mounted])

  useEffect(() => {
    if (mounted && playlistId) savePlaylistMeta(playlistId, { name: playlistName, isPublic })
  }, [playlistName, isPublic, playlistId, mounted])

  const sortedVideos = [...videos].sort((a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime())
  const filteredVideos = sortedVideos.filter(v =>
    v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.channel.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleRemoveVideo = (id: string) => setVideos(videos.filter(v => v.id !== id))

  const handleShare = () => {
    if (!isPublic) return
    const shareUrl = `${window.location.origin}/${params.userId}/${params.userName}/playlists/${params.slug}/${params.id}`
    navigator.clipboard?.writeText(shareUrl).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const handlePlayAll = () => {
    if (videos.length) router.push(`/videos/${videos[0].channel}/${videos[0].id}`)
  }

  const handleShuffle = () => {
    if (videos.length) {
      const randomIndex = Math.floor(Math.random() * videos.length)
      router.push(`/videos/${videos[randomIndex].channel}/${videos[randomIndex].id}`)
    }
  }

  const handleSaveEdit = () => {
    if (editName.trim()) {
      setPlaylistName(editName.trim())
      setIsPublic(editPublic)
      setShowEditDialog(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <div className="flex">
        <DesktopSidebar className="hidden md:block" />
        <div className="flex-1 md:pl-[240px] pt-[56px] md:pt-[80px] pb-nav-safe md:pb-6">
          {/* Mobile header */}
          <div className="md:hidden flex items-center gap-3 px-4 py-3 border-b sticky top-[56px] bg-background z-10">
            <button onClick={() => router.back()} className="flex items-center justify-center h-9 w-9 rounded-full hover:bg-muted transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="font-semibold text-lg truncate">{playlistName}</h1>
          </div>

          <div className="max-w-[1096px] mx-auto px-4 md:px-6">
            {/* Playlist header */}
            <div className="py-4 md:py-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex gap-4">
                  <div className="w-24 h-24 md:w-32 md:h-32 bg-muted rounded-xl flex items-center justify-center flex-shrink-0">
                    <Play className="h-8 w-8 text-muted-foreground/50" />
                  </div>
                  <div>
                    <h1 className="text-xl md:text-2xl font-bold">{playlistName}</h1>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                      {isPublic ? <Globe className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                      <span>{isPublic ? "Public" : "Private"}</span>
                      <span>•</span>
                      <span>{videos.length} video{videos.length !== 1 ? 's' : ''}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      <Button onClick={handlePlayAll} className="rounded-full gap-2" size="sm" disabled={!videos.length}>
                        <Play className="h-4 w-4 fill-current" /> Play all
                      </Button>
                      <Button onClick={handleShuffle} variant="outline" className="rounded-full gap-2" size="sm" disabled={!videos.length}>
                        <Shuffle className="h-4 w-4" /> Shuffle
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-2">
                  {isPublic && (
                    <Button variant="outline" size="sm" className="rounded-full gap-2" onClick={handleShare}>
                      {copied ? <Check className="h-4 w-4" /> : <Share className="h-4 w-4" />}
                      {copied ? 'Copied' : 'Share'}
                    </Button>
                  )}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="rounded-full">
                        <MoreVertical className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem className="py-3 cursor-pointer flex items-center gap-3" onClick={() => setShowEditDialog(true)}>
                        <Pencil className="h-4 w-4" />
                        <span>Edit playlist</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>

            {/* Search */}
            {videos.length > 0 && (
              <div className="flex items-center gap-3 mb-6">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search in playlist"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-muted/50 rounded-full text-sm outline-none focus:bg-muted transition-colors"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Video list */}
            {isLoading ? (
              <div className="space-y-4">
                {Array.from({ length: 4 }).map((_, i) => <VideoSkeleton key={i} />)}
              </div>
            ) : filteredVideos.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Play className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-1">
                  {searchQuery ? "No results found" : "No videos in this playlist"}
                </h3>
                <p className="text-muted-foreground">
                  {searchQuery ? "Try different keywords" : "Add videos to this playlist"}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredVideos.map((video) => (
                  <div key={video.id} className="flex gap-3 group">
                    <Link href={`/videos/${video.channel}/${video.id}`} className="relative w-40 md:w-56 aspect-video flex-shrink-0">
                      <Image src={video.thumbnail} alt={video.title} fill className="object-cover rounded-xl" />
                      <div className="absolute bottom-1.5 right-1.5 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded font-medium">{video.duration}</div>
                      <div className="absolute inset-0 bg-black/20 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="bg-black/60 rounded-full p-2"><Play className="h-5 w-5 text-white fill-white" /></div>
                      </div>
                    </Link>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <Link href={`/videos/${video.channel}/${video.id}`}>
                            <h3 className="font-medium text-sm md:text-base line-clamp-2 hover:text-primary transition-colors">{video.title}</h3>
                          </Link>
                          <div className="flex items-center gap-2 mt-1">
                            <Link href={`/channel/${video.channel}`} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
                              <Avatar className="h-5 w-5"><AvatarImage src={video.channelAvatar} /><AvatarFallback className="text-[10px]">{video.channel.charAt(0)}</AvatarFallback></Avatar>
                              <span>{video.channel}</span>
                            </Link>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">{video.views} • {video.timeAgo}</p>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="p-1.5 rounded-full hover:bg-muted transition-colors flex-shrink-0">
                              <MoreVertical className="h-4 w-4 text-muted-foreground" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuItem onClick={() => router.push(`/videos/${video.channel}/${video.id}`)} className="py-3 cursor-pointer flex items-center gap-3">
                              <Play className="h-4 w-4" />
                              <span>Play now</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleRemoveVideo(video.id)} className="py-3 cursor-pointer flex items-center gap-3 text-destructive">
                              <Trash2 className="h-4 w-4" />
                              <span>Remove from playlist</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Edit dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit playlist</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Input
              placeholder="Playlist name"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="h-10"
              autoFocus
            />
            <div className="flex items-center gap-2">
              <button
                onClick={() => setEditPublic(!editPublic)}
                className={cn(
                  "flex items-center gap-2 px-3 py-1.5 rounded-full text-xs border transition-colors",
                  editPublic ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-muted"
                )}
              >
                {editPublic ? <Globe className="h-3.5 w-3.5" /> : <Lock className="h-3.5 w-3.5" />}
                {editPublic ? "Public" : "Private"}
              </button>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setShowEditDialog(false)}>Cancel</Button>
              <Button className="flex-1" onClick={handleSaveEdit} disabled={!editName.trim()}>Save</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <MobileNav />
    </div>
  )
}