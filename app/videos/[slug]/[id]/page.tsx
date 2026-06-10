"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { 
  ArrowLeft, MoreVertical, Share, Clock, Bookmark, Ban, UserX, Flag, 
  ListPlus, ThumbsUp, ThumbsDown, ChevronDown, MessageCircle,
  Send, SortDesc, MoreHorizontal
} from "lucide-react"
import AppHeader from "@/components/app-header"
import MobileNav from "@/components/mobile-nav"
import DesktopSidebar from "@/components/desktop-sidebar"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const videoData = {
  id: "v1",
  title: "The Purpose of Life - Powerful Islamic Reminder",
  description: "A powerful reminder about the true purpose of life from an Islamic perspective. This lecture covers the fundamental questions that every human being asks: Why are we here? What is our purpose? Where are we going? Sheikh explains these concepts with references from the Quran and Sunnah. The lecture delves deep into the meaning of existence and our relationship with our Creator.",
  channel: "Daily Dawah",
  channelAvatar: "/placeholder.svg?height=36&width=36",
  subscribers: "780K subscribers",
  views: "208K views",
  publishedAt: "6 days ago",
  likes: "15K",
  dislikes: "342",
  duration: "18:28",
  videoUrl: "https://www.youtube.com/embed/5qap5aO4i9A",
  isSubscribed: true,
  comments: "1,234",
}

const relatedVideos = [
  { id: "r1", title: "What Happens After Death? Islamic Perspective", channel: "Daily Dawah", views: "180K views", timeAgo: "1 week ago", duration: "22:15", thumbnail: "/placeholder.svg?height=480&width=854", videoUrl: "https://www.youtube.com/embed/5qap5aO4i9A" },
  { id: "r2", title: "The Day of Judgment - Signs and Events", channel: "Islamic Guidance", views: "3.4M views", timeAgo: "2 weeks ago", duration: "32:10", thumbnail: "/placeholder.svg?height=480&width=854", videoUrl: "https://www.youtube.com/embed/5qap5aO4i9A" },
  { id: "r3", title: "How to Find Peace in Difficult Times", channel: "Merciful Servant", views: "450K views", timeAgo: "3 days ago", duration: "15:40", thumbnail: "/placeholder.svg?height=480&width=854", videoUrl: "https://www.youtube.com/embed/5qap5aO4i9A" },
  { id: "r4", title: "The Beauty of Islam - A Reminder for All", channel: "Daily Dawah", views: "890K views", timeAgo: "1 month ago", duration: "28:05", thumbnail: "/placeholder.svg?height=480&width=854", videoUrl: "https://www.youtube.com/embed/5qap5aO4i9A" },
  { id: "r5", title: "Tafsir of Surah Al-Fatiha", channel: "Islamic Guidance", views: "150K views", timeAgo: "3 days ago", duration: "25:15", thumbnail: "/placeholder.svg?height=480&width=854", videoUrl: "https://www.youtube.com/embed/5qap5aO4i9A" },
  { id: "r6", title: "How to Increase Your Faith", channel: "Merciful Servant", views: "120K views", timeAgo: "4 days ago", duration: "19:30", thumbnail: "/placeholder.svg?height=480&width=854", videoUrl: "https://www.youtube.com/embed/5qap5aO4i9A" },
  { id: "r7", title: "The Stories of the Prophets", channel: "Daily Dawah", views: "2.1M views", timeAgo: "2 months ago", duration: "45:00", thumbnail: "/placeholder.svg?height=480&width=854", videoUrl: "https://www.youtube.com/embed/5qap5aO4i9A" },
  { id: "r8", title: "Dua for Guidance", channel: "Islamic Guidance", views: "95K views", timeAgo: "5 days ago", duration: "12:20", thumbnail: "/placeholder.svg?height=480&width=854", videoUrl: "https://www.youtube.com/embed/5qap5aO4i9A" },
]

const commentsData = [
  {
    id: "c1",
    user: "Ahmad Khan",
    avatar: "/placeholder.svg?height=32&width=32",
    timeAgo: "2 days ago",
    content: "MashaAllah, very beneficial lecture. The way the Sheikh explains the purpose of life is truly eye-opening. May Allah reward you for sharing this knowledge. These reminders are exactly what we need in these times.",
    likes: "245",
    dislikes: "12",
    replies: [
      {
        id: "cr1",
        user: "Daily Dawah",
        avatar: "/placeholder.svg?height=32&width=32",
        timeAgo: "1 day ago",
        content: "JazakAllah khair for your kind words. May Allah guide us all to the straight path.",
        likes: "89",
        dislikes: "3",
        isChannel: true,
      },
      {
        id: "cr2",
        user: "Mohammed Ali",
        avatar: "/placeholder.svg?height=32&width=32",
        timeAgo: "12 hours ago",
        content: "Couldn't agree more. This channel has changed my life.",
        likes: "34",
        dislikes: "1",
      }
    ]
  },
  {
    id: "c2",
    user: "Fatima Hassan",
    avatar: "/placeholder.svg?height=32&width=32",
    timeAgo: "1 week ago",
    content: "Beautiful reminder. In a world full of distractions, we need to constantly remind ourselves of our true purpose. May Allah guide us all and keep us steadfast on the deen. Ameen.",
    likes: "567",
    dislikes: "23",
    replies: []
  },
  {
    id: "c3",
    user: "Omar Farooq",
    avatar: "/placeholder.svg?height=32&width=32",
    timeAgo: "3 days ago",
    content: "This changed my perspective on life entirely. I've been struggling with finding meaning and this lecture came at the perfect time. Thank you Sheikh for this beautiful reminder.",
    likes: "189",
    dislikes: "8",
    replies: [
      {
        id: "cr3",
        user: "Zainab Mohammed",
        avatar: "/placeholder.svg?height=32&width=32",
        timeAgo: "2 days ago",
        content: "Same here brother. May Allah make it easy for all of us.",
        likes: "45",
        dislikes: "2",
      }
    ]
  },
  {
    id: "c4",
    user: "Aisha Begum",
    avatar: "/placeholder.svg?height=32&width=32",
    timeAgo: "5 days ago",
    content: "SubhanAllah! Every time I listen to this lecture, I learn something new. The Quranic references are so powerful and relevant to our daily lives.",
    likes: "123",
    dislikes: "5",
    replies: []
  },
  {
    id: "c5",
    user: "Ibrahim Malik",
    avatar: "/placeholder.svg?height=32&width=32",
    timeAgo: "1 day ago",
    content: "May Allah bless the Sheikh and everyone involved in spreading this knowledge. We need more content like this on the platform.",
    likes: "78",
    dislikes: "2",
    replies: []
  },
  {
    id: "c6",
    user: "Khadija Omar",
    avatar: "/placeholder.svg?height=32&width=32",
    timeAgo: "4 days ago",
    content: "This lecture always brings tears to my eyes. The way he explains our purpose is so beautiful. JazakAllah khair for this reminder.",
    likes: "312",
    dislikes: "15",
    replies: []
  }
]

// Save watch progress to localStorage
const saveWatchProgress = (videoId: string, progress: { watchedPercent: number; watchedTimestamp: number }) => {
  if (typeof window === 'undefined') return
  const watchData = JSON.parse(localStorage.getItem('watchProgress') || '{}')
  watchData[videoId] = progress
  localStorage.setItem('watchProgress', JSON.stringify(watchData))
}

const commentMenuItems = (
  <>
    <DropdownMenuItem className="flex items-center gap-3 px-4 py-3 cursor-pointer">
      <Flag className="h-5 w-5" /><span>Report</span>
    </DropdownMenuItem>
  </>
)

const videoMenuItems = (
  <>
    <DropdownMenuItem className="flex items-center gap-3 px-4 py-3 cursor-pointer">
      <ListPlus className="h-5 w-5" /><span>Add to queue</span>
    </DropdownMenuItem>
    <DropdownMenuItem className="flex items-center gap-3 px-4 py-3 cursor-pointer">
      <Clock className="h-5 w-5" /><span>Save to Watch later</span>
    </DropdownMenuItem>
    <DropdownMenuItem className="flex items-center gap-3 px-4 py-3 cursor-pointer">
      <Bookmark className="h-5 w-5" /><span>Save to playlist</span>
    </DropdownMenuItem>
    <DropdownMenuItem className="flex items-center gap-3 px-4 py-3 cursor-pointer">
      <Share className="h-5 w-5" /><span>Share</span>
    </DropdownMenuItem>
    <DropdownMenuItem className="flex items-center gap-3 px-4 py-3 cursor-pointer">
      <Ban className="h-5 w-5" /><span>Not interested</span>
    </DropdownMenuItem>
    <DropdownMenuItem className="flex items-center gap-3 px-4 py-3 cursor-pointer">
      <UserX className="h-5 w-5" /><span>Don't recommend channel</span>
    </DropdownMenuItem>
    <DropdownMenuItem className="flex items-center gap-3 px-4 py-3 cursor-pointer">
      <Flag className="h-5 w-5" /><span>Report</span>
    </DropdownMenuItem>
  </>
)

function CommentItem({ comment, isReply = false }: { comment: any, isReply?: boolean }) {
  const [showReplies, setShowReplies] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [isDisliked, setIsDisliked] = useState(false)

  return (
    <div className={`${isReply ? "ml-8 md:ml-14 mt-3" : "mt-4"}`}>
      <div className="flex gap-3">
        <Avatar className="h-8 w-8 md:h-10 md:w-10 flex-shrink-0">
          <AvatarImage src={comment.avatar} />
          <AvatarFallback>{comment.user.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[13px] font-medium">@{comment.user.split(' ')[0]}</span>
            {comment.isChannel && (
              <span className="text-[10px] bg-foreground/10 text-foreground/70 px-1.5 py-0.5 rounded-full font-medium">Creator</span>
            )}
            <span className="text-xs text-muted-foreground">{comment.timeAgo}</span>
          </div>
          <p className="text-sm mt-1 leading-relaxed">{comment.content}</p>
          <div className="flex items-center gap-2 mt-1.5">
            <button 
              onClick={() => {
                setIsLiked(!isLiked)
                if (isDisliked) setIsDisliked(false)
              }}
              className={`flex items-center gap-1.5 hover:bg-muted rounded-full px-3 py-1.5 transition-colors ${
                isLiked ? 'text-blue-600' : 'text-muted-foreground'
              }`}
            >
              <ThumbsUp className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
              <span className="text-xs">{comment.likes}</span>
            </button>
            <button 
              onClick={() => {
                setIsDisliked(!isDisliked)
                if (isLiked) setIsLiked(false)
              }}
              className="hover:bg-muted rounded-full p-1.5 transition-colors text-muted-foreground"
            >
              <ThumbsDown className="h-4 w-4" />
            </button>
            <button className="text-xs text-muted-foreground hover:bg-muted rounded-full px-3 py-1.5 transition-colors">
              Reply
            </button>
          </div>
          
          {comment.replies && comment.replies.length > 0 && (
            <button 
              onClick={() => setShowReplies(!showReplies)}
              className="flex items-center gap-1.5 mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              <ChevronDown className={`h-4 w-4 transition-transform ${showReplies ? 'rotate-180' : ''}`} />
              {showReplies ? 'Hide' : comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
            </button>
          )}
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex-shrink-0 hover:bg-muted rounded-full p-1.5 transition-colors h-fit">
              <MoreVertical className="h-4 w-4 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48 rounded-xl py-2">
            {commentMenuItems}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      {showReplies && comment.replies && comment.replies.map((reply: any) => (
        <CommentItem key={reply.id} comment={reply} isReply={true} />
      ))}
    </div>
  )
}

export default function VideoPlayPage() {
  const router = useRouter()
  const params = useParams()
  const [showFullDescription, setShowFullDescription] = useState(false)
  const [showAllComments, setShowAllComments] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [isDisliked, setIsDisliked] = useState(false)
  const [commentText, setCommentText] = useState("")
  const [isSubscribed, setIsSubscribed] = useState(true)
  
  const [currentVideo, setCurrentVideo] = useState({
    id: videoData.id,
    title: videoData.title,
    channel: videoData.channel,
    channelAvatar: videoData.channelAvatar,
    subscribers: videoData.subscribers,
    views: videoData.views,
    publishedAt: videoData.publishedAt,
    description: videoData.description,
    videoUrl: videoData.videoUrl,
    isSubscribed: videoData.isSubscribed,
    likes: videoData.likes,
    dislikes: videoData.dislikes,
    comments: videoData.comments,
  })
  
  const [activeVideoId, setActiveVideoId] = useState("v1")

  // Read timestamp from URL on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      const timeParam = urlParams.get('t')
      if (timeParam) {
        const timestamp = parseInt(timeParam)
        if (timestamp > 0) {
          setCurrentVideo(prev => ({
            ...prev,
            videoUrl: `${prev.videoUrl.split('?')[0]}?start=${timestamp}&autoplay=1`
          }))
        }
      }
    }
  }, [])

  const handleRelatedVideoClick = (video: any) => {
    // Save current video watch progress before switching
    saveWatchProgress(currentVideo.id, {
      watchedPercent: 50,
      watchedTimestamp: 0
    })

    setCurrentVideo({
      id: video.id,
      title: video.title,
      channel: video.channel,
      channelAvatar: "/placeholder.svg?height=36&width=36",
      subscribers: `${Math.floor(Math.random() * 900) + 100}K subscribers`,
      views: video.views,
      publishedAt: video.timeAgo,
      description: `Description for ${video.title}. This is a sample description that would contain details about the video content.`,
      videoUrl: video.videoUrl,
      isSubscribed: false,
      likes: `${Math.floor(Math.random() * 20) + 1}K`,
      dislikes: `${Math.floor(Math.random() * 500) + 10}`,
      comments: `${Math.floor(Math.random() * 2000) + 100}`,
    })
    setActiveVideoId(video.id)
    setIsSubscribed(false)
    setShowFullDescription(false)
    setShowAllComments(false)
    setCommentText("")
    setIsLiked(false)
    setIsDisliked(false)
    
    if (window.innerWidth < 1024) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <div className="flex">
        <DesktopSidebar className="hidden md:block" />
        <div className="flex-1 md:pl-[240px] pt-[56px] pb-nav-safe md:pb-6">
          <div className="flex flex-col lg:flex-row p-4 gap-4">
            <div className="flex-1 min-w-0">
              <div className="w-full">
                <div className="relative w-full bg-black rounded-xl overflow-hidden" style={{ paddingBottom: "56.25%" }}>
                  <iframe
                    key={currentVideo.id}
                    src={currentVideo.videoUrl}
                    title={currentVideo.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                  />
                </div>
              </div>

              <div className="mt-3">
                <h1 className="text-lg md:text-xl font-bold leading-tight">{currentVideo.title}</h1>
                
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-2">
                  <div className="flex items-center gap-3">
                    <Link href={`/channel/islamic-guidance`} className="flex items-center gap-3 group flex-shrink-0">
                      <Avatar className="h-9 w-9 md:h-10 md:w-10">
                        <AvatarImage src={currentVideo.channelAvatar} />
                        <AvatarFallback>{currentVideo.channel.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium group-hover:text-primary">{currentVideo.channel}</p>
                        <p className="text-xs text-muted-foreground">{currentVideo.subscribers}</p>
                      </div>
                    </Link>
                    <Button 
                      onClick={() => setIsSubscribed(!isSubscribed)}
                      className={`rounded-full h-9 text-sm px-4 font-medium ${
                        isSubscribed 
                          ? 'bg-muted hover:bg-muted/80 text-foreground' 
                          : 'bg-foreground text-background hover:bg-foreground/90'
                      }`}
                    >
                      {isSubscribed ? 'Subscribed' : 'Subscribe'}
                    </Button>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="flex items-center bg-muted rounded-full overflow-hidden">
                      <button 
                        onClick={() => {
                          setIsLiked(!isLiked)
                          if (isDisliked) setIsDisliked(false)
                        }}
                        className={`flex items-center gap-2 px-4 py-2 hover:bg-muted/80 transition-colors border-r border-border ${
                          isLiked ? 'text-foreground' : ''
                        }`}
                      >
                        <ThumbsUp className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} />
                        <span className="text-sm font-medium">{currentVideo.likes}</span>
                      </button>
                      <button 
                        onClick={() => {
                          setIsDisliked(!isDisliked)
                          if (isLiked) setIsLiked(false)
                        }}
                        className={`px-4 py-2 hover:bg-muted/80 transition-colors ${
                          isDisliked ? 'text-foreground' : ''
                        }`}
                      >
                        <ThumbsDown className={`h-5 w-5 ${isDisliked ? 'fill-current' : ''}`} />
                      </button>
                    </div>
                    
                    <Button variant="ghost" size="icon" className="rounded-full hover:bg-muted">
                      <Share className="h-5 w-5" />
                    </Button>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="rounded-full">
                          <MoreHorizontal className="h-5 w-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-72 rounded-xl py-2">
                        {videoMenuItems}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                <div 
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  className="mt-3 bg-muted/40 hover:bg-muted/60 rounded-xl p-3 md:p-4 cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium">{currentVideo.views}</span>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-muted-foreground">{currentVideo.publishedAt}</span>
                  </div>
                  <div className={`text-sm mt-1 whitespace-pre-wrap ${showFullDescription ? '' : 'line-clamp-2'}`}>
                    {currentVideo.description}
                  </div>
                  <span className="text-sm font-medium text-foreground/70 mt-1 inline-block">
                    {showFullDescription ? 'Show less' : '...more'}
                  </span>
                </div>

                <div className="mt-6">
                  <div className="flex items-center gap-6 mb-6">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-base">{currentVideo.comments} Comments</span>
                    </div>
                    <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-full px-3 py-1 transition-colors">
                      <SortDesc className="h-4 w-4" />
                      <span>Sort by</span>
                    </button>
                  </div>

                  <div className="flex gap-3 mb-8">
                    <Avatar className="h-8 w-8 md:h-10 md:w-10 flex-shrink-0">
                      <AvatarFallback>Y</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <input
                        type="text"
                        placeholder="Add a comment..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        className="w-full bg-transparent border-b border-border pb-1.5 text-sm focus:outline-none focus:border-foreground transition-colors placeholder:text-muted-foreground"
                      />
                      {commentText && (
                        <div className="flex items-center gap-2 mt-3 justify-end">
                          <button 
                            onClick={() => setCommentText("")}
                            className="text-sm font-medium hover:bg-muted rounded-full px-4 py-2 transition-colors"
                          >
                            Cancel
                          </button>
                          <button 
                            className="text-sm font-medium bg-foreground text-background rounded-full px-4 py-2 hover:bg-foreground/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={!commentText.trim()}
                          >
                            Comment
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  <div id="comments-section">
                    {commentsData.slice(0, showAllComments ? commentsData.length : 3).map((comment) => (
                      <CommentItem key={comment.id} comment={comment} />
                    ))}

                    {commentsData.length > 3 && !showAllComments && (
                      <button 
                        onClick={() => {
                          setShowAllComments(true)
                          setTimeout(() => {
                            document.getElementById('comments-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                          }, 100)
                        }}
                        className="flex items-center gap-2 mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium"
                      >
                        <ChevronDown className="h-4 w-4" />
                        Show {commentsData.length - 3} more comments
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="hidden lg:block w-[400px] flex-shrink-0">
              <div className="space-y-3">
                {relatedVideos.map((video) => (
                  <button
                    key={video.id}
                    onClick={() => handleRelatedVideoClick(video)}
                    className="flex gap-2 group text-left w-full hover:bg-muted/30 rounded-lg p-1 transition-colors"
                  >
                    <div className="relative w-[168px] h-[94px] flex-shrink-0">
                      <Image src={video.thumbnail} alt={video.title} fill className="object-cover rounded-lg" />
                      <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 py-0.5 rounded font-medium">{video.duration}</div>
                      {activeVideoId === video.id && (
                        <div className="absolute inset-0 bg-black/20 rounded-lg flex items-center justify-center">
                          <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0 py-1">
                      <h4 className={`font-medium text-sm line-clamp-2 leading-tight ${activeVideoId === video.id ? 'text-primary' : 'group-hover:text-primary'}`}>
                        {video.title}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1">{video.channel}</p>
                      <p className="text-xs text-muted-foreground">{video.views} • {video.timeAgo}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:hidden px-4 pb-4">
            <h3 className="font-semibold text-base mb-4">Related Videos</h3>
            <div className="space-y-3">
              {relatedVideos.map((video) => (
                <button
                  key={video.id}
                  onClick={() => handleRelatedVideoClick(video)}
                  className="flex gap-3 group text-left w-full"
                >
                  <div className="relative w-40 md:w-56 aspect-video flex-shrink-0">
                    <Image src={video.thumbnail} alt={video.title} fill className="object-cover rounded-lg" />
                    <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 py-0.5 rounded font-medium">{video.duration}</div>
                    {activeVideoId === video.id && (
                      <div className="absolute inset-0 bg-black/20 rounded-lg flex items-center justify-center">
                        <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className={`font-medium text-sm line-clamp-2 ${activeVideoId === video.id ? 'text-primary' : 'group-hover:text-primary'}`}>
                      {video.title}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1">{video.channel}</p>
                    <p className="text-xs text-muted-foreground">{video.views} • {video.timeAgo}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      <MobileNav />
    </div>
  )
}