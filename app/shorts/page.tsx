"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  ChevronUp,
  ChevronDown,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Flag,
  Volume2,
  VolumeX,
  Pause,
  Play,
  List,
  Ban,
  MessageSquare,
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

function MoreIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" className={className}>
      <path d="M12 4a2 2 0 100 4 2 2 0 000-4Zm0 6a2 2 0 100 4 2 2 0 000-4Zm0 6a2 2 0 100 4 2 2 0 000-4Z" fill="currentColor" />
    </svg>
  )
}

// CC OFF - white outline
function CCIconOff({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" className={className}>
      <path d="M21 3H3a2 2 0 00-2 2v14a2 2 0 002 2h18a2 2 0 002-2V5a2 2 0 00-2-2ZM3 19V5h18v14H3ZM6.972 8.346c-.631.336-1.131.881-1.466 1.526A4.6 4.6 0 005 12c-.004.74.17 1.47.506 2.128.336.645.835 1.191 1.466 1.526a2.86 2.86 0 002.066.257c.697-.178 1.294-.606 1.737-1.176a1 1 0 00-1.578-1.228c-.21.27-.444.413-.654.467a.86.86 0 01-.632-.085c-.222-.119-.453-.342-.631-.684A2.64 2.64 0 017 12a2.6 2.6 0 01.281-1.205c.177-.342.408-.565.63-.684a.86.86 0 01.632-.085c.209.054.444.197.654.467a1 1 0 001.578-1.228c-.443-.57-1.04-.998-1.737-1.176a2.86 2.86 0 00-2.066.257Zm8 0c-.631.336-1.131.881-1.466 1.526A4.6 4.6 0 0013 12c-.004.74.17 1.47.506 2.128.336.645.835 1.191 1.466 1.526a2.86 2.86 0 002.066.257c.697-.178 1.294-.606 1.737-1.176a1 1 0 00-1.578-1.228c-.21.27-.444.413-.654.467a.86.86 0 01-.632-.085c-.222-.119-.453-.342-.631-.684A2.64 2.64 0 0115 12a2.6 2.6 0 01.281-1.205c.177-.342.408-.565.63-.684a.86.86 0 01.632-.085c.209.054.444.197.654.467a1 1 0 001.578-1.228c-.443-.57-1.04-.998-1.737-1.176a2.86 2.86 0 00-2.066.257Z" fill="currentColor" />
    </svg>
  )
}

// CC ON - white background box, black CC text
function CCIconOn({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" className={className}>
      <rect x="1" y="3" width="22" height="18" rx="2" fill="white" />
      <path d="M9.038 8.089c.697.178 1.294.606 1.737 1.176a1 1 0 01-1.578 1.228c-.21-.27-.444-.413-.654-.467a.86.86 0 00-.632.085c-.222.119-.453.342-.631.684A2.64 2.64 0 007 12a2.64 2.64 0 00.281 1.205c.177.342.408.565.63.684a.86.86 0 00.632.085c.209-.054.444-.197.654-.467a1 1 0 011.578 1.228c-.443.57-1.04.998-1.737 1.176a2.86 2.86 0 01-2.066-.257c-.631-.336-1.131-.881-1.466-1.526A4.6 4.6 0 015 12c-.004-.74.17-1.47.506-2.128.336-.645.835-1.19 1.466-1.526a2.86 2.86 0 012.066-.257Zm8 0c.697.178 1.294.606 1.737 1.176a1 1 0 01-1.578 1.228c-.21-.27-.444-.413-.654-.467a.86.86 0 00-.632.085c-.222.119-.453.342-.631.684A2.64 2.64 0 0015 12a2.64 2.64 0 00.281 1.205c.177.342.408.565.63.684a.86.86 0 00.632.085c.209-.054.444-.197.654-.467a1 1 0 011.578 1.228c-.443.57-1.04.998-1.737 1.176a2.86 2.86 0 01-2.066-.257c-.631-.336-1.131-.881-1.466-1.526A4.6 4.6 0 0113 12c-.004-.74.17-1.47.506-2.128.336-.645.835-1.19 1.466-1.526a2.86 2.86 0 012.066-.257Z" fill="black" />
    </svg>
  )
}

function FullscreenIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" className={className}>
      <path d="M10 3H3v7c0 .265.105.52.293.707.187.188.442.293.707.293.265 0 .52-.105.707-.293C4.895 10.52 5 10.265 5 10V6.414l4.293 4.293.076.068c.192.155.435.233.68.22.247-.014.48-.118.654-.292.174-.174.278-.407.291-.653.014-.246-.064-.489-.219-.681l-.068-.076L6.414 5H10c.265 0 .52-.105.707-.293C10.895 4.52 11 4.265 11 4c0-.265-.105-.52-.293-.707C10.52 3.105 10.265 3 10 3Zm10 10c-.265 0-.52.105-.707.293-.188.187-.293.442-.293.707v3.586l-4.293-4.293-.076-.068c-.192-.155-.435-.233-.68-.22-.247.014-.48.118-.654.292-.174.174-.278.407-.291.653-.014.246.064.489.219.681l.068.076L17.586 19H14c-.265 0-.52.105-.707.293-.188.187-.293.442-.293.707 0 .265.105.52.293.707.187.188.442.293.707.293h7v-7c0-.265-.105-.52-.293-.707C20.52 13.105 20.265 13 20 13Z" fill="currentColor" />
    </svg>
  )
}

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
  const [hoveredVideoId, setHoveredVideoId] = useState<string | null>(null)
  const [isScrolling, setIsScrolling] = useState(false)
  const [showCenterPlayPause, setShowCenterPlayPause] = useState(false)
  const [captionsEnabled, setCaptionsEnabled] = useState(false)
  const centerPlayTimeout = useRef<NodeJS.Timeout | null>(null)
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const handleScroll = () => {
      setIsScrolling(true)
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current)
      scrollTimeout.current = setTimeout(() => setIsScrolling(false), 400)
      const containerHeight = container.clientHeight
      const index = Math.round(container.scrollTop / containerHeight)
      setCurrentIndex(Math.min(index, shortsData.length - 1))
    }
    container.addEventListener("scroll", handleScroll, { passive: true })
    return () => {
      container.removeEventListener("scroll", handleScroll)
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current)
    }
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
      document.documentElement.requestFullscreen().catch(() => {})
      setIsFullscreen(true)
    } else {
      document.exitFullscreen().catch(() => {})
      setIsFullscreen(false)
    }
  }

  const handleTogglePlay = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsPlaying(!isPlaying)
    setShowCenterPlayPause(true)
    if (centerPlayTimeout.current) clearTimeout(centerPlayTimeout.current)
    centerPlayTimeout.current = setTimeout(() => setShowCenterPlayPause(false), 600)
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="relative z-50">
        <AppHeader />
      </div>
      <div className="hidden md:flex fixed right-6 top-1/2 -translate-y-1/2 z-40 flex-col gap-1 bg-white/10 backdrop-blur-sm rounded-full p-1.5">
        <button onClick={() => scrollToVideo(currentIndex - 1)} disabled={currentIndex === 0} className="w-10 h-10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
          <ChevronUp className="h-6 w-6" />
        </button>
        <button onClick={() => scrollToVideo(currentIndex + 1)} disabled={currentIndex === shortsData.length - 1} className="w-10 h-10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
          <ChevronDown className="h-6 w-6" />
        </button>
      </div>
      <div ref={containerRef} className="fixed inset-0 top-[56px] overflow-y-auto snap-y snap-mandatory scrollbar-none" style={{ scrollSnapType: "y mandatory" }}>
        {shortsData.map((short, index) => {
          const isActive = index === currentIndex
          const isHovered = hoveredVideoId === short.id
          return (
            <section key={short.id} className="relative h-[calc(100vh-56px)] w-full snap-start snap-always flex items-center justify-center bg-black">
              <div className="relative w-full h-full md:w-[400px] md:h-[85vh] md:rounded-2xl overflow-hidden mx-auto"
                onMouseEnter={() => setHoveredVideoId(short.id)}
                onMouseLeave={() => { setHoveredVideoId(null); setShowVolumeSlider(false); setShowMoreMenu(false) }}>
                <div className="w-full h-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center cursor-pointer" onClick={handleTogglePlay}>
                  <div className="text-center text-white/20">
                    <svg width="80" height="80" viewBox="0 0 24 24" fill="currentColor" className="mx-auto mb-4 opacity-30">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/>
                    </svg>
                    <p className="text-sm opacity-40">Short Video</p>
                  </div>
                </div>
                <div className={`absolute inset-0 flex items-center justify-center z-25 pointer-events-none transition-opacity duration-200 ${showCenterPlayPause ? "opacity-100" : "opacity-0"}`}>
                  <div className="w-16 h-16 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center">
                    {isPlaying ? <Pause className="h-8 w-8 text-white fill-white" /> : <Play className="h-8 w-8 text-white fill-white ml-1" />}
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-[40%] bg-gradient-to-t from-black/90 via-black/50 to-transparent pointer-events-none" />
                <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/60 via-black/20 to-transparent pointer-events-none" />
                
                <div className={`absolute top-0 left-0 right-0 z-30 px-4 pt-4 pb-16 transition-opacity duration-200 ${isHovered && !isScrolling ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button onClick={handleTogglePlay} className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors">
                        {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                      </button>
                      <div className="relative flex items-center" onMouseEnter={() => setShowVolumeSlider(true)} onMouseLeave={() => setShowVolumeSlider(false)}>
                        <button onClick={() => setIsMuted(!isMuted)} className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors">
                          {isMuted || volume === 0 ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                        </button>
                        {showVolumeSlider && (
                          <div className="hidden md:flex items-center bg-black/60 backdrop-blur-sm rounded-full px-3 py-2 ml-1">
                            <input type="range" min="0" max="100" value={isMuted ? 0 : volume} onChange={(e) => { setVolume(Number(e.target.value)); setIsMuted(false) }} className="w-20 h-1 accent-white cursor-pointer" />
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setCaptionsEnabled(!captionsEnabled)}
                        className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors"
                        title={captionsEnabled ? "Subtitles/CC turned on" : "Subtitles/CC turned off"}
                        aria-label={captionsEnabled ? "Subtitles/CC turned on" : "Subtitles/CC turned off"}
                        aria-pressed={captionsEnabled}
                      >
                        {captionsEnabled ? <CCIconOn className="h-5 w-5" /> : <CCIconOff className="h-5 w-5 text-white" />}
                      </button>
                      <button onClick={toggleFullscreen} className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors">
                        <FullscreenIcon className="h-5 w-5" />
                      </button>
                      <div className="relative">
                        <button onClick={() => setShowMoreMenu(!showMoreMenu)} className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors">
                          <MoreIcon className="h-5 w-5" />
                        </button>
                        {showMoreMenu && (
                          <>
                            <div className="fixed inset-0 z-40 md:hidden" onClick={() => setShowMoreMenu(false)} />
                            <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#212121] rounded-t-2xl py-2 shadow-2xl md:absolute md:top-full md:bottom-auto md:left-auto md:right-0 md:mt-2 md:rounded-xl md:w-[280px]">
                              <div className="w-10 h-1 bg-white/30 rounded-full mx-auto my-3 md:hidden" />
                              <button className="w-full flex items-center gap-4 px-4 py-3 text-white text-sm hover:bg-white/10 transition-colors" onClick={() => setShowMoreMenu(false)}>
                                <List className="h-5 w-5" /> Description
                              </button>
                              <button className="w-full flex items-center gap-4 px-4 py-3 text-white text-sm hover:bg-white/10 transition-colors" onClick={() => setShowMoreMenu(false)}>
                                <Bookmark className="h-5 w-5" /> Save to playlist
                              </button>
                              <button className="w-full flex items-center justify-between px-4 py-3 text-white text-sm hover:bg-white/10 transition-colors" onClick={() => { setCaptionsEnabled(!captionsEnabled); setShowMoreMenu(false) }}>
                                <div className="flex items-center gap-4">
                                  {captionsEnabled ? <CCIconOn className="h-5 w-5" /> : <CCIconOff className="h-5 w-5 text-white" />}
                                  Captions
                                </div>
                                <span className="text-white/60 text-xs">{captionsEnabled ? "On" : "Off"}</span>
                              </button>
                              <button className="w-full flex items-center gap-4 px-4 py-3 text-white text-sm hover:bg-white/10 transition-colors" onClick={() => setShowMoreMenu(false)}>
                                <Ban className="h-5 w-5" /> Don't recommend this channel
                              </button>
                              <button className="w-full flex items-center gap-4 px-4 py-3 text-white text-sm hover:bg-white/10 transition-colors" onClick={() => setShowMoreMenu(false)}>
                                <Flag className="h-5 w-5" /> Report
                              </button>
                              <button className="w-full flex items-center gap-4 px-4 py-3 text-white text-sm hover:bg-white/10 transition-colors" onClick={() => setShowMoreMenu(false)}>
                                <MessageSquare className="h-5 w-5" /> Send feedback
                              </button>
                              <div className="h-4 md:hidden" />
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className={`absolute bottom-6 left-4 right-20 z-20 transition-all duration-300 ${isActive && !isScrolling ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`}>
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar className="h-10 w-10 border-2 border-white/20 flex-shrink-0">
                      <AvatarImage src={short.channelAvatar} />
                      <AvatarFallback className="bg-gray-700 text-white text-xs">{short.channel.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="text-white font-semibold text-sm truncate">{short.channel}</span>
                    <Button size="sm" className={`rounded-full h-8 text-xs px-4 flex-shrink-0 ${subscribeState[short.id] ? "bg-white/10 text-white hover:bg-white/20 border border-white/20" : "bg-white text-black hover:bg-gray-200"}`} onClick={() => toggleSubscribe(short.id)}>
                      {subscribeState[short.id] ? "Subscribed" : "Subscribe"}
                    </Button>
                  </div>
                  <p className="text-white/90 text-sm leading-relaxed line-clamp-2">{short.title}</p>
                </div>
                <div className={`absolute right-3 bottom-28 flex flex-col gap-6 items-center z-20 transition-all duration-300 ${isActive && !isScrolling ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4 pointer-events-none"}`}>
                  <button onClick={() => toggleLike(short.id)} className="flex flex-col items-center gap-1 group">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isLiked[short.id] ? "bg-white/20 scale-110" : "bg-white/10"} group-hover:bg-white/20 group-active:scale-95`}>
                      <Heart className={`h-6 w-6 ${isLiked[short.id] ? "text-red-500 fill-red-500" : "text-white"}`} />
                    </div>
                    <span className="text-white text-xs font-medium">{short.likes}</span>
                  </button>
                  <button className="flex flex-col items-center gap-1 group">
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-all group-active:scale-95">
                      <MessageCircle className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-white text-xs font-medium">{short.comments}</span>
                  </button>
                  <button className="flex flex-col items-center gap-1 group">
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-all group-active:scale-95">
                      <Share2 className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-white text-xs font-medium">Share</span>
                  </button>
                  <button className="flex flex-col items-center gap-1 group">
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-all group-active:scale-95">
                      <Bookmark className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-white text-xs font-medium">Save</span>
                  </button>
                  <button className="flex flex-col items-center gap-1 group">
                    <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-all group-active:scale-95">
                      <Flag className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-white text-xs font-medium">Report</span>
                  </button>
                </div>
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}