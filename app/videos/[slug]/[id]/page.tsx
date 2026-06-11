"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { 
  ArrowLeft, MoreVertical, Share, Clock, Bookmark, Ban, UserX, Flag, 
  ListPlus, ThumbsUp, ThumbsDown, ChevronDown, MessageCircle,
  Send, SortDesc, MoreHorizontal, X
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
  description: "A powerful reminder about the true purpose of life from an Islamic perspective. This lecture covers the fundamental questions that every human being asks: Why are we here? What is our purpose? Where are we going? Sheikh explains these concepts with references from the Quran and Sunnah.",
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

// Initial comments with numeric values
const initialCommentsData = [
  {
    id: "c1", user: "Ahmad Khan", avatar: "/placeholder.svg?height=32&width=32", timeAgo: "2 days ago",
    content: "MashaAllah, very beneficial lecture. The way the Sheikh explains the purpose of life is truly eye-opening. May Allah reward you for sharing this knowledge.",
    likes: 245, dislikes: 12, replies: [
      { id: "cr1", user: "Daily Dawah", avatar: "/placeholder.svg?height=32&width=32", timeAgo: "1 day ago", content: "JazakAllah khair for your kind words. May Allah guide us all.", likes: 89, dislikes: 3, isChannel: true },
      { id: "cr2", user: "Mohammed Ali", avatar: "/placeholder.svg?height=32&width=32", timeAgo: "12 hours ago", content: "Couldn't agree more. This channel has changed my life.", likes: 34, dislikes: 1 },
    ]
  },
  { id: "c2", user: "Fatima Hassan", avatar: "/placeholder.svg?height=32&width=32", timeAgo: "1 week ago", content: "Beautiful reminder. In a world full of distractions, we need to constantly remind ourselves of our true purpose.", likes: 567, dislikes: 23, replies: [] },
  { id: "c3", user: "Omar Farooq", avatar: "/placeholder.svg?height=32&width=32", timeAgo: "3 days ago", content: "This changed my perspective on life entirely. Thank you Sheikh for this beautiful reminder.", likes: 189, dislikes: 8, replies: [
      { id: "cr3", user: "Zainab Mohammed", avatar: "/placeholder.svg?height=32&width=32", timeAgo: "2 days ago", content: "Same here brother. May Allah make it easy for all of us.", likes: 45, dislikes: 2 },
    ]
  },
  { id: "c4", user: "Aisha Begum", avatar: "/placeholder.svg?height=32&width=32", timeAgo: "5 days ago", content: "SubhanAllah! Every time I listen to this lecture, I learn something new.", likes: 123, dislikes: 5, replies: [] },
  { id: "c5", user: "Ibrahim Malik", avatar: "/placeholder.svg?height=32&width=32", timeAgo: "1 day ago", content: "May Allah bless the Sheikh and everyone involved in spreading this knowledge.", likes: 78, dislikes: 2, replies: [] },
  { id: "c6", user: "Khadija Omar", avatar: "/placeholder.svg?height=32&width=32", timeAgo: "4 days ago", content: "This lecture always brings tears to my eyes. JazakAllah khair for this reminder.", likes: 312, dislikes: 15, replies: [] },
]

// Storage keys
const VID_COMMENTS_KEY = 'video_comments_data'
const VID_LIKED_KEY = 'video_liked_ids'
const VID_DISLIKED_KEY = 'video_disliked_ids'

function loadVideoComments(): any[] {
  if (typeof window === 'undefined') return JSON.parse(JSON.stringify(initialCommentsData))
  try {
    const raw = localStorage.getItem(VID_COMMENTS_KEY)
    if (raw) { const p = JSON.parse(raw); if (Array.isArray(p) && p.length > 0) return p }
  } catch {}
  const def = JSON.parse(JSON.stringify(initialCommentsData))
  localStorage.setItem(VID_COMMENTS_KEY, JSON.stringify(def))
  return def
}

function saveVideoComments(data: any[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem(VID_COMMENTS_KEY, JSON.stringify(data))
}

function loadIds(key: string): string[] {
  if (typeof window === 'undefined') return []
  try { const r = localStorage.getItem(key); return r ? JSON.parse(r) : [] } catch { return [] }
}

function saveIds(key: string, ids: string[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem(key, JSON.stringify(ids))
}

const saveWatchProgress = (videoId: string, progress: { watchedPercent: number; watchedTimestamp: number }) => {
  if (typeof window === 'undefined') return
  const watchData = JSON.parse(localStorage.getItem('watchProgress') || '{}')
  watchData[videoId] = progress
  localStorage.setItem('watchProgress', JSON.stringify(watchData))
}

const commentMenuItems = (
  <DropdownMenuItem className="flex items-center gap-3 px-4 py-3 cursor-pointer">
    <Flag className="h-5 w-5" /><span>Report</span>
  </DropdownMenuItem>
)

const videoMenuItems = (
  <>
    <DropdownMenuItem className="flex items-center gap-3 px-4 py-3 cursor-pointer"><ListPlus className="h-5 w-5" /><span>Add to queue</span></DropdownMenuItem>
    <DropdownMenuItem className="flex items-center gap-3 px-4 py-3 cursor-pointer"><Clock className="h-5 w-5" /><span>Save to Watch later</span></DropdownMenuItem>
    <DropdownMenuItem className="flex items-center gap-3 px-4 py-3 cursor-pointer"><Bookmark className="h-5 w-5" /><span>Save to playlist</span></DropdownMenuItem>
    <DropdownMenuItem className="flex items-center gap-3 px-4 py-3 cursor-pointer"><Share className="h-5 w-5" /><span>Share</span></DropdownMenuItem>
    <DropdownMenuItem className="flex items-center gap-3 px-4 py-3 cursor-pointer"><Ban className="h-5 w-5" /><span>Not interested</span></DropdownMenuItem>
    <DropdownMenuItem className="flex items-center gap-3 px-4 py-3 cursor-pointer"><UserX className="h-5 w-5" /><span>Don't recommend channel</span></DropdownMenuItem>
    <DropdownMenuItem className="flex items-center gap-3 px-4 py-3 cursor-pointer"><Flag className="h-5 w-5" /><span>Report</span></DropdownMenuItem>
  </>
)

// Reply Item
function ReplyItem({ reply, onLike, onDislike, onReplyNested, isLiked, isDisliked }: {
  reply: any
  onLike: (commentId: string, replyId: string) => void
  onDislike: (commentId: string, replyId: string) => void
  onReplyNested: (commentId: string, replyId: string, text: string) => void
  isLiked: boolean
  isDisliked: boolean
}) {
  const [showReplyInput, setShowReplyInput] = useState(false)
  const [replyText, setReplyText] = useState("")

  const handleSubmit = () => {
    if (!replyText.trim()) return
    onReplyNested(reply.parentId || '', reply.id, replyText.trim())
    setReplyText(""); setShowReplyInput(false)
  }

  const fmt = (n: number) => n > 999 ? `${(n/1000).toFixed(1)}K` : String(n)

  return (
    <div className="ml-10 mt-2">
      <div className="flex gap-2.5">
        <Avatar className="h-7 w-7 flex-shrink-0"><AvatarImage src={reply.avatar} /><AvatarFallback className="text-[10px]">{reply.user.charAt(0)}</AvatarFallback></Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2"><span className="text-xs font-medium">@{reply.user.split(' ')[0]}</span>{reply.isChannel && <span className="text-[10px] bg-foreground/10 px-1 py-0.5 rounded-full">Creator</span>}<span className="text-[10px] text-muted-foreground">{reply.timeAgo}</span></div>
          <p className="text-sm mt-0.5">{reply.content}</p>
          <div className="flex items-center gap-2 mt-1.5">
            <button onClick={() => onLike(reply.parentId || '', reply.id)} className={`flex items-center gap-1.5 hover:bg-muted rounded-full px-2.5 py-1 transition-colors ${isLiked ? 'text-blue-600' : 'text-muted-foreground'}`}>
              <ThumbsUp className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} /><span className="text-xs">{fmt(reply.likes)}</span>
            </button>
            <button onClick={() => onDislike(reply.parentId || '', reply.id)} className={`hover:bg-muted rounded-full p-1 transition-colors ${isDisliked ? 'text-red-500' : 'text-muted-foreground'}`}>
              <ThumbsDown className={`h-4 w-4 ${isDisliked ? 'fill-current' : ''}`} />
            </button>
            <button onClick={() => setShowReplyInput(!showReplyInput)} className="text-xs text-muted-foreground hover:bg-muted rounded-full px-2.5 py-1 transition-colors">Reply</button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild><button className="hover:bg-muted rounded-full p-1 transition-colors ml-auto"><MoreVertical className="h-3.5 w-3.5 text-muted-foreground" /></button></DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 rounded-xl py-2">{commentMenuItems}</DropdownMenuContent>
            </DropdownMenu>
          </div>
          {showReplyInput && (
            <div className="mt-2 flex gap-2">
              <Avatar className="h-6 w-6 flex-shrink-0"><AvatarFallback className="text-[10px]">Y</AvatarFallback></Avatar>
              <div className="flex-1 flex items-center gap-1.5">
                <input type="text" placeholder="Add a reply..." value={replyText} onChange={(e) => setReplyText(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") handleSubmit() }} className="flex-1 bg-transparent border-b border-border pb-1 text-xs focus:outline-none focus:border-foreground transition-colors" autoFocus />
                <button onClick={handleSubmit} disabled={!replyText.trim()} className="text-blue-600 hover:text-blue-700 disabled:opacity-30"><Send className="h-3.5 w-3.5" /></button>
                <button onClick={() => setShowReplyInput(false)} className="text-muted-foreground hover:text-foreground"><X className="h-3.5 w-3.5" /></button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// Comment Item
function CommentItem({ comment, onLike, onDislike, onReply, onLikeReply, onDislikeReply, onReplyNested, isLiked, isDisliked }: {
  comment: any
  onLike: (id: string) => void
  onDislike: (id: string) => void
  onReply: (id: string, text: string) => void
  onLikeReply: (cid: string, rid: string) => void
  onDislikeReply: (cid: string, rid: string) => void
  onReplyNested: (cid: string, rid: string, text: string) => void
  isLiked: boolean
  isDisliked: boolean
}) {
  const [showReplies, setShowReplies] = useState(false)
  const [showReplyInput, setShowReplyInput] = useState(false)
  const [replyText, setReplyText] = useState("")

  const handleReplySubmit = () => {
    if (!replyText.trim()) return
    onReply(comment.id, replyText.trim())
    setReplyText(""); setShowReplyInput(false); setShowReplies(true)
  }

  const fmt = (n: number) => n > 999 ? `${(n/1000).toFixed(1)}K` : String(n)
  const repliesWithParent = (comment.replies || []).map((r: any) => ({ ...r, parentId: comment.id }))

  return (
    <div className="mt-4">
      <div className="flex gap-3">
        <Avatar className="h-8 w-8 md:h-10 md:w-10 flex-shrink-0"><AvatarImage src={comment.avatar} /><AvatarFallback>{comment.user.charAt(0)}</AvatarFallback></Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2"><span className="text-[13px] font-medium">@{comment.user.split(' ')[0]}</span>{comment.isChannel && <span className="text-[10px] bg-foreground/10 px-1.5 py-0.5 rounded-full font-medium">Creator</span>}<span className="text-xs text-muted-foreground">{comment.timeAgo}</span></div>
          <p className="text-sm mt-1 leading-relaxed">{comment.content}</p>
          <div className="flex items-center gap-2 mt-1.5">
            <button onClick={() => onLike(comment.id)} className={`flex items-center gap-1.5 hover:bg-muted rounded-full px-3 py-1.5 transition-colors ${isLiked ? 'text-blue-600' : 'text-muted-foreground'}`}>
              <ThumbsUp className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} /><span className="text-xs">{fmt(comment.likes)}</span>
            </button>
            <button onClick={() => onDislike(comment.id)} className={`hover:bg-muted rounded-full p-1.5 transition-colors ${isDisliked ? 'text-red-500' : 'text-muted-foreground'}`}>
              <ThumbsDown className={`h-5 w-5 ${isDisliked ? 'fill-current' : ''}`} />
            </button>
            <button onClick={() => setShowReplyInput(!showReplyInput)} className="text-xs text-muted-foreground hover:bg-muted rounded-full px-3 py-1.5 transition-colors">Reply</button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild><button className="hover:bg-muted rounded-full p-1.5 transition-colors ml-auto"><MoreVertical className="h-4 w-4 text-muted-foreground" /></button></DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 rounded-xl py-2">{commentMenuItems}</DropdownMenuContent>
            </DropdownMenu>
          </div>
          {showReplyInput && (
            <div className="mt-3 flex gap-2">
              <Avatar className="h-7 w-7 flex-shrink-0"><AvatarFallback className="text-[10px]">Y</AvatarFallback></Avatar>
              <div className="flex-1 flex items-center gap-2">
                <input type="text" placeholder="Add a reply..." value={replyText} onChange={(e) => setReplyText(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") handleReplySubmit() }} className="flex-1 bg-transparent border-b border-border pb-1 text-sm focus:outline-none focus:border-foreground transition-colors" autoFocus />
                <button onClick={handleReplySubmit} disabled={!replyText.trim()} className="text-blue-600 hover:text-blue-700 disabled:opacity-30"><Send className="h-4 w-4" /></button>
                <button onClick={() => setShowReplyInput(false)} className="text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>
              </div>
            </div>
          )}
          {comment.replies && comment.replies.length > 0 && (
            <button onClick={() => setShowReplies(!showReplies)} className="flex items-center gap-1.5 mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium">
              <ChevronDown className={`h-4 w-4 transition-transform ${showReplies ? 'rotate-180' : ''}`} />
              {showReplies ? 'Hide' : comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
            </button>
          )}
        </div>
      </div>
      {showReplies && repliesWithParent.map((r: any) => (
        <ReplyItem key={r.id} reply={r} onLike={onLikeReply} onDislike={onDislikeReply} onReplyNested={onReplyNested} isLiked={likedIds.includes(r.id)} isDisliked={dislikedIds.includes(r.id)} />
      ))}
    </div>
  )
}

// Persistent data
let videoCommentsData = loadVideoComments()
let likedIds: string[] = loadIds(VID_LIKED_KEY)
let dislikedIds: string[] = loadIds(VID_DISLIKED_KEY)

export default function VideoPlayPage() {
  const router = useRouter()
  const params = useParams()
  const [showFullDescription, setShowFullDescription] = useState(false)
  const [showAllComments, setShowAllComments] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [isDisliked, setIsDisliked] = useState(false)
  const [commentText, setCommentText] = useState("")
  const [isSubscribed, setIsSubscribed] = useState(true)
  const [comments, setComments] = useState<any[]>(() => {
    return videoCommentsData.map((c: any) => ({
      ...c,
      replies: (c.replies || []).map((r: any) => ({ ...r, parentId: c.id }))
    }))
  })
  const [localLikedIds, setLocalLikedIds] = useState<string[]>(likedIds)
  const [localDislikedIds, setLocalDislikedIds] = useState<string[]>(dislikedIds)
  
  // Dynamic comment count
  const [totalCommentCount, setTotalCommentCount] = useState(0)

  const [currentVideo, setCurrentVideo] = useState({ ...videoData, videoUrl: videoData.videoUrl, comments: "1,234" })
  const [activeVideoId, setActiveVideoId] = useState("v1")

  // Calculate total comments (main comments + replies)
  const calculateCommentCount = (commentsList: any[]) => {
    let count = commentsList.length
    commentsList.forEach((c: any) => {
      if (c.replies) count += c.replies.length
    })
    return count
  }

  // Update comment count whenever comments change
  useEffect(() => {
    const count = calculateCommentCount(comments)
    setTotalCommentCount(count)
    // Also update the video's comment count display
    setCurrentVideo(prev => ({
      ...prev,
      comments: count > 999 ? `${(count/1000).toFixed(1)}K` : String(count)
    }))
  }, [comments])

  // Sync to module-level + localStorage
  useEffect(() => { likedIds = localLikedIds; saveIds(VID_LIKED_KEY, localLikedIds) }, [localLikedIds])
  useEffect(() => { dislikedIds = localDislikedIds; saveIds(VID_DISLIKED_KEY, localDislikedIds) }, [localDislikedIds])
  useEffect(() => { saveVideoComments(videoCommentsData) }, [comments])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      const timeParam = urlParams.get('t')
      if (timeParam) {
        const ts = parseInt(timeParam)
        if (ts > 0) setCurrentVideo(p => ({ ...p, videoUrl: `${p.videoUrl.split('?')[0]}?start=${ts}&autoplay=1` }))
      }
    }
  }, [])

  const handleRelatedVideoClick = (video: any) => {
    saveWatchProgress(currentVideo.id, { watchedPercent: 50, watchedTimestamp: 0 })
    setCurrentVideo({
      id: video.id,
      title: video.title,
      channel: video.channel,
      channelAvatar: "/placeholder.svg?height=36&width=36",
      subscribers: `${Math.floor(Math.random() * 900) + 100}K subscribers`,
      views: video.views,
      publishedAt: video.timeAgo,
      description: `Description for ${video.title}.`,
      videoUrl: video.videoUrl,
      isSubscribed: false,
      likes: `${Math.floor(Math.random() * 20) + 1}K`,
      dislikes: `${Math.floor(Math.random() * 500) + 10}`,
      comments: `${Math.floor(Math.random() * 2000) + 100}`,
      duration: video.duration || "0:00",
    })
    setActiveVideoId(video.id); setIsSubscribed(false); setShowFullDescription(false); setShowAllComments(false)
    setCommentText(""); setIsLiked(false); setIsDisliked(false)
    if (window.innerWidth < 1024) window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Like/Dislike handlers
  const handleLikeComment = (commentId: string) => {
    const src = videoCommentsData.find((c: any) => c.id === commentId)
    if (!src) return
    const wasLiked = localLikedIds.includes(commentId)
    const wasDisliked = localDislikedIds.includes(commentId)
    if (wasLiked) { src.likes--; setLocalLikedIds(p => p.filter(id => id !== commentId)) }
    else { src.likes++; setLocalLikedIds(p => [...p, commentId]); if (wasDisliked) { src.dislikes--; setLocalDislikedIds(p => p.filter(id => id !== commentId)) } }
    setComments(prev => prev.map(c => c.id === commentId ? { ...c, likes: src.likes, dislikes: wasDisliked ? c.dislikes - 1 : c.dislikes } : c))
    saveVideoComments(videoCommentsData)
  }

  const handleDislikeComment = (commentId: string) => {
    const src = videoCommentsData.find((c: any) => c.id === commentId)
    if (!src) return
    const wasDisliked = localDislikedIds.includes(commentId)
    const wasLiked = localLikedIds.includes(commentId)
    if (wasDisliked) { src.dislikes--; setLocalDislikedIds(p => p.filter(id => id !== commentId)) }
    else { src.dislikes++; setLocalDislikedIds(p => [...p, commentId]); if (wasLiked) { src.likes--; setLocalLikedIds(p => p.filter(id => id !== commentId)) } }
    setComments(prev => prev.map(c => c.id === commentId ? { ...c, dislikes: src.dislikes, likes: wasLiked ? c.likes - 1 : c.likes } : c))
    saveVideoComments(videoCommentsData)
  }

  const handleReplyComment = (commentId: string, text: string) => {
    const nr = { id: `r${Date.now()}`, user: "You", avatar: "/placeholder.svg?height=32&width=32", timeAgo: "Just now", content: text, likes: 0, dislikes: 0, parentId: commentId }
    setComments(prev => prev.map(c => c.id === commentId ? { ...c, replies: [...(c.replies || []), nr] } : c))
    const src = videoCommentsData.find((c: any) => c.id === commentId)
    if (src) { if (!src.replies) src.replies = []; src.replies.push(nr); saveVideoComments(videoCommentsData) }
  }

  const handleLikeReply = (commentId: string, replyId: string) => {
    const src = videoCommentsData.find((c: any) => c.id === commentId)
    if (!src?.replies) return
    const reply = src.replies.find((r: any) => r.id === replyId)
    if (!reply) return
    const wasLiked = localLikedIds.includes(replyId)
    const wasDisliked = localDislikedIds.includes(replyId)
    if (wasLiked) { reply.likes--; setLocalLikedIds(p => p.filter(id => id !== replyId)) }
    else { reply.likes++; setLocalLikedIds(p => [...p, replyId]); if (wasDisliked) { reply.dislikes--; setLocalDislikedIds(p => p.filter(id => id !== replyId)) } }
    setComments(prev => prev.map(c => c.id === commentId ? { ...c, replies: (c.replies || []).map((r: any) => r.id === replyId ? { ...r, likes: reply.likes, dislikes: wasDisliked ? r.dislikes - 1 : r.dislikes } : r) } : c))
    saveVideoComments(videoCommentsData)
  }

  const handleDislikeReply = (commentId: string, replyId: string) => {
    const src = videoCommentsData.find((c: any) => c.id === commentId)
    if (!src?.replies) return
    const reply = src.replies.find((r: any) => r.id === replyId)
    if (!reply) return
    const wasDisliked = localDislikedIds.includes(replyId)
    const wasLiked = localLikedIds.includes(replyId)
    if (wasDisliked) { reply.dislikes--; setLocalDislikedIds(p => p.filter(id => id !== replyId)) }
    else { reply.dislikes++; setLocalDislikedIds(p => [...p, replyId]); if (wasLiked) { reply.likes--; setLocalLikedIds(p => p.filter(id => id !== replyId)) } }
    setComments(prev => prev.map(c => c.id === commentId ? { ...c, replies: (c.replies || []).map((r: any) => r.id === replyId ? { ...r, dislikes: reply.dislikes, likes: wasLiked ? r.likes - 1 : r.likes } : r) } : c))
    saveVideoComments(videoCommentsData)
  }

  const handleReplyNested = (commentId: string, replyId: string, text: string) => {
    const nr = { id: `nr${Date.now()}`, user: "You", avatar: "/placeholder.svg?height=32&width=32", timeAgo: "Just now", content: text, likes: 0, dislikes: 0, parentId: replyId }
    setComments(prev => prev.map(c => c.id === commentId ? { ...c, replies: [...(c.replies || []), nr] } : c))
    const src = videoCommentsData.find((c: any) => c.id === commentId)
    if (src) { if (!src.replies) src.replies = []; src.replies.push(nr); saveVideoComments(videoCommentsData) }
  }

  const handleAddComment = () => {
    if (!commentText.trim()) return
    const nc = { id: `c${Date.now()}`, user: "You", avatar: "/placeholder.svg?height=32&width=32", timeAgo: "Just now", content: commentText.trim(), likes: 0, dislikes: 0, replies: [] }
    setComments(prev => [nc, ...prev]); setCommentText("")
    videoCommentsData.unshift(nc); saveVideoComments(videoCommentsData)
  }

  // Format the comment count for display
  const formatCommentCount = (count: number) => {
    if (count >= 1000000) return `${(count/1000000).toFixed(1)}M`
    if (count >= 1000) return `${(count/1000).toFixed(1)}K`
    return String(count)
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
                  <iframe key={currentVideo.id} src={currentVideo.videoUrl} title={currentVideo.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="absolute inset-0 w-full h-full" />
                </div>
              </div>
              <div className="mt-3">
                <h1 className="text-lg md:text-xl font-bold leading-tight">{currentVideo.title}</h1>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-2">
                  <div className="flex items-center gap-3">
                    <Link href={`/channel/islamic-guidance`} className="flex items-center gap-3 group flex-shrink-0">
                      <Avatar className="h-9 w-9 md:h-10 md:w-10"><AvatarImage src={currentVideo.channelAvatar} /><AvatarFallback>{currentVideo.channel.charAt(0)}</AvatarFallback></Avatar>
                      <div><p className="text-sm font-medium group-hover:text-primary">{currentVideo.channel}</p><p className="text-xs text-muted-foreground">{currentVideo.subscribers}</p></div>
                    </Link>
                    <Button onClick={() => setIsSubscribed(!isSubscribed)} className={`rounded-full h-9 text-sm px-4 font-medium ${isSubscribed ? 'bg-muted hover:bg-muted/80 text-foreground' : 'bg-foreground text-background hover:bg-foreground/90'}`}>{isSubscribed ? 'Subscribed' : 'Subscribe'}</Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center bg-muted rounded-full overflow-hidden">
                      <button onClick={() => { setIsLiked(!isLiked); if (isDisliked) setIsDisliked(false) }} className={`flex items-center gap-2 px-4 py-2 hover:bg-muted/80 transition-colors border-r border-border ${isLiked ? 'text-foreground' : ''}`}><ThumbsUp className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} /><span className="text-sm font-medium">{currentVideo.likes}</span></button>
                      <button onClick={() => { setIsDisliked(!isDisliked); if (isLiked) setIsLiked(false) }} className={`px-4 py-2 hover:bg-muted/80 transition-colors ${isDisliked ? 'text-foreground' : ''}`}><ThumbsDown className={`h-5 w-5 ${isDisliked ? 'fill-current' : ''}`} /></button>
                    </div>
                    <Button variant="ghost" size="icon" className="rounded-full hover:bg-muted"><Share className="h-5 w-5" /></Button>
                    <DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="rounded-full"><MoreHorizontal className="h-5 w-5" /></Button></DropdownMenuTrigger><DropdownMenuContent align="end" className="w-72 rounded-xl py-2">{videoMenuItems}</DropdownMenuContent></DropdownMenu>
                  </div>
                </div>
                <div onClick={() => setShowFullDescription(!showFullDescription)} className="mt-3 bg-muted/40 hover:bg-muted/60 rounded-xl p-3 md:p-4 cursor-pointer transition-colors">
                  <div className="flex items-center gap-2 text-sm"><span className="font-medium">{currentVideo.views}</span><span className="text-muted-foreground">•</span><span className="text-muted-foreground">{currentVideo.publishedAt}</span></div>
                  <div className={`text-sm mt-1 whitespace-pre-wrap ${showFullDescription ? '' : 'line-clamp-2'}`}>{currentVideo.description}</div>
                  <span className="text-sm font-medium text-foreground/70 mt-1 inline-block">{showFullDescription ? 'Show less' : '...more'}</span>
                </div>
                <div className="mt-6">
                  <div className="flex items-center gap-6 mb-6">
                    <div className="flex items-center gap-2">
                      <MessageCircle className="h-5 w-5" />
                      <span className="font-semibold text-base">{formatCommentCount(totalCommentCount)} Comments</span>
                    </div>
                    <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-full px-3 py-1 transition-colors"><SortDesc className="h-4 w-4" /><span>Sort by</span></button>
                  </div>
                  <div className="flex gap-3 mb-8">
                    <Avatar className="h-8 w-8 md:h-10 md:w-10 flex-shrink-0"><AvatarFallback>Y</AvatarFallback></Avatar>
                    <div className="flex-1">
                      <input type="text" placeholder="Add a comment..." value={commentText} onChange={(e) => setCommentText(e.target.value)} className="w-full bg-transparent border-b border-border pb-1.5 text-sm focus:outline-none focus:border-foreground transition-colors placeholder:text-muted-foreground" />
                      {commentText && (
                        <div className="flex items-center gap-2 mt-3 justify-end">
                          <button onClick={() => setCommentText("")} className="text-sm font-medium hover:bg-muted rounded-full px-4 py-2 transition-colors">Cancel</button>
                          <button onClick={handleAddComment} className="text-sm font-medium bg-foreground text-background rounded-full px-4 py-2 hover:bg-foreground/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed" disabled={!commentText.trim()}>Comment</button>
                        </div>
                      )}
                    </div>
                  </div>
                  <div id="comments-section">
                    {comments.slice(0, showAllComments ? comments.length : 3).map((comment) => (
                      <CommentItem key={comment.id} comment={comment} onLike={handleLikeComment} onDislike={handleDislikeComment} onReply={handleReplyComment} onLikeReply={handleLikeReply} onDislikeReply={handleDislikeReply} onReplyNested={handleReplyNested} isLiked={localLikedIds.includes(comment.id)} isDisliked={localDislikedIds.includes(comment.id)} />
                    ))}
                    {comments.length > 3 && !showAllComments && (
                      <button onClick={() => { setShowAllComments(true); setTimeout(() => document.getElementById('comments-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100) }} className="flex items-center gap-2 mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium">
                        <ChevronDown className="h-4 w-4" />Show {comments.length - 3} more comments
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
            <div className="hidden lg:block w-[400px] flex-shrink-0">
              <div className="space-y-3">
                {relatedVideos.map((video) => (
                  <button key={video.id} onClick={() => handleRelatedVideoClick(video)} className="flex gap-2 group text-left w-full hover:bg-muted/30 rounded-lg p-1 transition-colors">
                    <div className="relative w-[168px] h-[94px] flex-shrink-0"><Image src={video.thumbnail} alt={video.title} fill className="object-cover rounded-lg" /><div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 py-0.5 rounded font-medium">{video.duration}</div>{activeVideoId === video.id && <div className="absolute inset-0 bg-black/20 rounded-lg flex items-center justify-center"><div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" /></div>}</div>
                    <div className="flex-1 min-w-0 py-1"><h4 className={`font-medium text-sm line-clamp-2 leading-tight ${activeVideoId === video.id ? 'text-primary' : 'group-hover:text-primary'}`}>{video.title}</h4><p className="text-xs text-muted-foreground mt-1">{video.channel}</p><p className="text-xs text-muted-foreground">{video.views} • {video.timeAgo}</p></div>
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="lg:hidden px-4 pb-4">
            <h3 className="font-semibold text-base mb-4">Related Videos</h3>
            <div className="space-y-3">
              {relatedVideos.map((video) => (
                <button key={video.id} onClick={() => handleRelatedVideoClick(video)} className="flex gap-3 group text-left w-full">
                  <div className="relative w-40 md:w-56 aspect-video flex-shrink-0"><Image src={video.thumbnail} alt={video.title} fill className="object-cover rounded-lg" /><div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 py-0.5 rounded font-medium">{video.duration}</div>{activeVideoId === video.id && <div className="absolute inset-0 bg-black/20 rounded-lg flex items-center justify-center"><div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" /></div>}</div>
                  <div className="flex-1 min-w-0"><h4 className={`font-medium text-sm line-clamp-2 ${activeVideoId === video.id ? 'text-primary' : 'group-hover:text-primary'}`}>{video.title}</h4><p className="text-xs text-muted-foreground mt-1">{video.channel}</p><p className="text-xs text-muted-foreground">{video.views} • {video.timeAgo}</p></div>
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