"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, ThumbsUp, Search, X, MoreVertical, Play, Trash2 } from "lucide-react"
import AppHeader from "@/components/app-header"
import MobileNav from "@/components/mobile-nav"
import DesktopSidebar from "@/components/desktop-sidebar"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useMediaQuery } from "@/hooks/use-media-query"
import Image from "next/image"
import Link from "next/link"
import { useLikedVideos, LikedVideo } from "@/hooks/useLikedVideos"

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

export default function LikedVideosPage() {
  const router = useRouter()
  const isMobile = useMediaQuery("(max-width: 768px)")
  const { videos, addLike, removeLike } = useLikedVideos()
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [removedVideo, setRemovedVideo] = useState<LikedVideo | null>(null)
  const [undoTimer, setUndoTimer] = useState<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600)
    return () => {
      clearTimeout(timer)
      if (undoTimer) clearTimeout(undoTimer)
    }
  }, [])

  const handleUnlike = (video: LikedVideo) => {
    removeLike(video.id)
    setRemovedVideo(video)
    if (undoTimer) clearTimeout(undoTimer)
    const timer = setTimeout(() => setRemovedVideo(null), 5000)
    setUndoTimer(timer)
  }

  const handleUndo = () => {
    if (removedVideo) {
      addLike(removedVideo)
      setRemovedVideo(null)
      if (undoTimer) clearTimeout(undoTimer)
    }
  }

  const filteredVideos = videos.filter(v =>
    v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.channel.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <div className="flex">
        <DesktopSidebar className="hidden md:block" />
        <div className="flex-1 md:pl-[240px] pt-[56px] md:pt-[80px] pb-nav-safe md:pb-6">
          {/* Mobile Header */}
          <div className="md:hidden flex items-center gap-3 px-4 py-3 border-b sticky top-[56px] bg-background z-10">
            <button onClick={() => router.back()} className="flex items-center justify-center h-9 w-9 rounded-full hover:bg-muted">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="font-semibold text-lg">Liked Videos</h1>
          </div>

          <div className="max-w-[1096px] mx-auto px-4 md:px-6">
            <div className="py-4 md:py-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                  {!isMobile && (
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                        <ThumbsUp className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div>
                        <h1 className="text-2xl font-bold">Liked Videos</h1>
                        {!isLoading && (
                          <p className="text-sm text-muted-foreground">
                            {videos.length} video{videos.length !== 1 ? 's' : ''}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                  {isMobile && !isLoading && (
                    <span className="text-sm text-muted-foreground">
                      {videos.length} video{videos.length !== 1 ? 's' : ''}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {videos.length > 0 && (
              <div className="flex items-center gap-3 mb-6">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search liked videos"
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

            {/* Undo Snackbar */}
            {removedVideo && (
              <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-black/90 text-white px-4 py-3 rounded-full text-sm font-medium shadow-lg flex items-center gap-3 animate-fade-in-up">
                <span>Removed from Liked videos</span>
                <button onClick={handleUndo} className="text-blue-400 hover:text-blue-300 font-medium">
                  Undo
                </button>
                <button onClick={() => { setRemovedVideo(null); if (undoTimer) clearTimeout(undoTimer) }} className="text-white/60 hover:text-white">
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}

            {/* Content */}
            {isLoading ? (
              <div className="space-y-4">
                <VideoSkeleton /><VideoSkeleton /><VideoSkeleton /><VideoSkeleton /><VideoSkeleton />
              </div>
            ) : filteredVideos.length === 0 ? (
              <div className="text-center py-16">
                {searchQuery ? (
                  <>
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium mb-1">No results found</h3>
                    <p className="text-muted-foreground mb-4">Try different keywords</p>
                    <Button variant="outline" className="rounded-full" onClick={() => setSearchQuery("")}>
                      Clear search
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                      <ThumbsUp className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium mb-1">No liked videos yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Videos you like will appear here
                    </p>
                    <Button className="rounded-full" onClick={() => router.push('/')}>
                      Browse videos
                    </Button>
                  </>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredVideos.map((video) => (
                  <div key={video.id} className="flex gap-3 group">
                    <Link href={`/videos/${video.channel}/${video.id}`} className="relative w-40 md:w-56 aspect-video flex-shrink-0">
                      <Image src={video.thumbnail} alt={video.title} fill className="object-cover rounded-xl" />
                      <div className="absolute bottom-1.5 right-1.5 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded font-medium">
                        {video.duration}
                      </div>
                      <div className="absolute inset-0 bg-black/20 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="bg-black/60 rounded-full p-2">
                          <Play className="h-5 w-5 text-white fill-white" />
                        </div>
                      </div>
                    </Link>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <Link href={`/videos/${video.channel}/${video.id}`}>
                            <h3 className="font-medium text-sm md:text-base line-clamp-2 hover:text-primary transition-colors">
                              {video.title}
                            </h3>
                          </Link>
                          <div className="flex items-center gap-2 mt-1">
                            <Link href={`/channel/${video.channel}`} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
                              <Avatar className="h-5 w-5">
                                <AvatarImage src={video.channelAvatar} />
                                <AvatarFallback className="text-[10px]">{video.channel.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <span>{video.channel}</span>
                            </Link>
                          </div>
                          <p className="text-xs text-muted-foreground mt-0.5">{video.views} • {video.timeAgo}</p>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          <button onClick={() => handleUnlike(video)} className="p-2 rounded-full hover:bg-muted transition-colors" title="Unlike">
                            <ThumbsUp className="h-5 w-5 fill-current text-primary" />
                          </button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button className="p-1.5 rounded-full hover:bg-muted transition-colors">
                                <MoreVertical className="h-4 w-4 text-muted-foreground" />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                              <DropdownMenuItem onClick={() => router.push(`/videos/${video.channel}/${video.id}`)}>
                                <Play className="h-4 w-4 mr-3" /> Play now
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleUnlike(video)} className="text-destructive">
                                <Trash2 className="h-4 w-4 mr-3" /> Remove from Liked videos
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <MobileNav />

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}