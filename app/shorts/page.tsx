"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  ChevronUp,
  ChevronDown,
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
  Bookmark,
  ThumbsDown,
  Flag,
  Volume2,
  VolumeX,
  Pause,
  Play,
  Maximize,
  Minimize,
  Subtitles,
} from "lucide-react"
import AppHeader from "@/components/app-header"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

const shortsData = [
  {
    id: "s1",
    title: "Surah Al Baqarah - Beautiful Recitation That Touches The Heart",
    channel: "Islamic Recitation",
    channelAvatar: "/placeholder.svg?height=36&width=36",
    likes: "15K",
    comments: "1.2K",
    isSubscribed: false,
  },
  {
    id: "s2",
    title: "Powerful Reminder - Don't Lose Hope in Allah's Mercy",
    channel: "Daily Dawah",
    channelAvatar: "/placeholder.svg?height=36&width=36",
    likes: "25K",
    comments: "2.1K",
    isSubscribed: true,
  },
  {
    id: "s3",
    title: "Beautiful Adhan - Call to Prayer from Masjid Al-Haram",
    channel: "Islamic Sounds",
    channelAvatar: "/placeholder.svg?height=36&width=36",
    likes: "50K",
    comments: "3.5K",
    isSubscribed: false,
  },
]

export default function ShortsPage() {
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isLiked, setIsLiked] = useState<Record<string, boolean>>({})
  const [subscribeState, setSubscribeState] = useState<Record<string, boolean>>({})
  const [showVolumeSlider, setShowVolumeSlider] = useState(false)
  const [volume, setVolume] = useState(75)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showMoreMenu, setShowMoreMenu] = useState(false)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const handleScroll = () => {
      const containerHeight = container.clientHeight
      const index = Math.round(container.scrollTop / containerHeight)
      setCurrentIndex(Math.min(index, shortsData.length - 1))
    }
    container.addEventListener("scroll", handleScroll, { passive: true })
    return () => container.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToVideo = (index: number) => {
    const container = containerRef.current
    if (!container) return
    const targetIndex = Math.max(0, Math.min(index, shortsData.length - 1))
    const containerHeight = container.clientHeight
    container.scrollTo({ top: targetIndex * containerHeight, behavior: "smooth" })
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") { e.preventDefault(); scrollToVideo(currentIndex + 1) }
      if (e.key === "ArrowUp") { e.preventDefault(); scrollToVideo(currentIndex - 1) }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [currentIndex])

  const toggleLike = (id: string) => setIsLiked(prev => ({ ...prev, [id]: !prev[id] }))
  const toggleSubscribe = (id: string) => setSubscribeState(prev => ({ ...prev, [id]: !prev[id] }))
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="relative z-50">
        <AppHeader />
      </div>

      {/* Shorts Container */}
      <div
        ref={containerRef}
        className="h-[calc(100vh-56px)] md:h-screen overflow-y-auto snap-y snap-mandatory scrollbar-none"
        style={{ scrollSnapType: "y mandatory" }}
      >
        {shortsData.map((short, index) => (
          <section
            key={short.id}
            className="relative h-[calc(100vh-56px)] md:h-screen w-full snap-start flex items-center justify-center bg-black"
          >
            {/* Desktop Navigation Arrows */}
            <div className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-30 flex-col gap-1 bg-black/50 backdrop-blur-sm rounded-full p-1">
              <button
                onClick={() => scrollToVideo(index - 1)}
                disabled={index === 0}
                className="w-10 h-10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronUp className="h-6 w-6" />
              </button>
              <button
                onClick={() => scrollToVideo(index + 1)}
                disabled={index === shortsData.length - 1}
                className="w-10 h-10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <ChevronDown className="h-6 w-6" />
              </button>
            </div>

            {/* Video Area */}
            <div className="relative w-full h-full md:w-[480px] md:h-[88vh] md:rounded-xl overflow-hidden">

              {/* Video Placeholder */}
              <div className="w-full h-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
                <div className="text-center text-white/30">
                  <svg width="64" height="64" viewBox="0 0 24 24" fill="currentColor" className="mx-auto mb-4 opacity-40">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
                  </svg>
                  <p className="text-xs opacity-50">Short Video</p>
                </div>
              </div>

              {/* Bottom Gradient */}
              <div className="absolute bottom-0 left-0 right-0 h-72 bg-gradient-to-t from-black/90 via-black/50 to-transparent pointer-events-none" />

              {/* Top Gradient */}
              <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/70 via-black/40 to-transparent pointer-events-none" />

              {/* === TOP CONTROLS === */}
              <div className="absolute top-0 left-0 right-0 z-30 px-3 pt-[4.75rem] md:pt-3 pb-12">
                <div className="flex items-center justify-between">
                  {/* Left: Play/Pause + Sound */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="w-9 h-9 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                    >
                      {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                    </button>

                    <div
                      className="relative flex items-center"
                      onMouseEnter={() => setShowVolumeSlider(true)}
                      onMouseLeave={() => setShowVolumeSlider(false)}
                    >
                      <button
                        onClick={() => setIsMuted(!isMuted)}
                        className="w-9 h-9 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                      >
                        {isMuted || volume === 0 ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                      </button>

                      {showVolumeSlider && (
                        <div className="hidden md:flex items-center bg-black/60 backdrop-blur-sm rounded-full px-3 py-1.5 ml-1">
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={isMuted ? 0 : volume}
                            onChange={(e) => { setVolume(Number(e.target.value)); setIsMuted(false) }}
                            className="w-20 h-1 accent-white cursor-pointer"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: CC + 3-dot + Fullscreen */}
                  <div className="flex items-center gap-1">
                    <button className="w-9 h-9 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors">
                      <Subtitles className="h-5 w-5" />
                    </button>

                    <button
                      onClick={toggleFullscreen}
                      className="w-9 h-9 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                    >
                      {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
                    </button>
                                        <div className="relative">
                      <button
                        onClick={() => setShowMoreMenu(!showMoreMenu)}
                        className="w-9 h-9 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                      >
                        <MoreHorizontal className="h-5 w-5" />
                      </button>

                      {showMoreMenu && (
                        <div className="absolute top-full right-0 mt-2 bg-[#212121] rounded-xl py-2 w-[240px] shadow-2xl z-40">
                          <button className="w-full flex items-center gap-3 px-4 py-3 text-white text-sm hover:bg-white/10 transition-colors">
                            <Bookmark className="h-5 w-5" /> Save to playlist
                          </button>
                          <button className="w-full flex items-center gap-3 px-4 py-3 text-white text-sm hover:bg-white/10 transition-colors">
                            <ThumbsDown className="h-5 w-5" /> Not interested
                          </button>
                          <button className="w-full flex items-center gap-3 px-4 py-3 text-white text-sm hover:bg-white/10 transition-colors">
                            <Flag className="h-5 w-5" /> Report
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom-Left Info */}
              <div className="absolute bottom-4 left-4 right-16 z-20">
                <div className="flex items-center gap-3 mb-2">
                  <Avatar className="h-10 w-10 border border-white/30 flex-shrink-0">
                    <AvatarImage src={short.channelAvatar} />
                    <AvatarFallback className="bg-gray-700 text-white text-xs">{short.channel.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="text-white font-medium text-sm truncate">{short.channel}</span>
                  <Button
                    size="sm"
                    className={`rounded-full h-8 text-xs px-4 flex-shrink-0 ${
                      subscribeState[short.id]
                        ? "bg-white/20 text-white hover:bg-white/30"
                        : "bg-white text-black hover:bg-gray-200"
                    }`}
                    onClick={() => toggleSubscribe(short.id)}
                  >
                    {subscribeState[short.id] ? "Subscribed" : "Subscribe"}
                  </Button>
                </div>
                <p className="text-white/90 text-sm line-clamp-2">{short.title}</p>
              </div>

              {/* Right Side Actions */}
              <div className="absolute right-3 bottom-24 flex flex-col gap-5 items-center z-20">
                <button onClick={() => toggleLike(short.id)} className="flex flex-col items-center gap-1 group">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${isLiked[short.id] ? "bg-white/20" : "bg-white/10"} group-hover:bg-white/20`}>
                    <Heart className={`h-6 w-6 ${isLiked[short.id] ? "text-white fill-white" : "text-white"}`} />
                  </div>
                  <span className="text-white text-xs font-medium">{short.likes}</span>
                </button>
                <button className="flex flex-col items-center gap-1 group">
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                    <MessageCircle className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-white text-xs font-medium">{short.comments}</span>
                </button>
                <button className="flex flex-col items-center gap-1 group">
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                    <Share2 className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-white text-xs font-medium">Share</span>
                </button>
                <button className="flex flex-col items-center gap-1 group">
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                    <Bookmark className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-white text-xs font-medium">Save</span>
                </button>
                <button className="flex flex-col items-center gap-1 group">
                  <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                    <Flag className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-white text-xs font-medium">Report</span>
                </button>
              </div>
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}