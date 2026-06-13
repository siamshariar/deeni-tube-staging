"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter, useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import {
  ArrowLeft, MoreVertical, Share, Clock, Bookmark, Ban, UserX, Flag,
  ListPlus, ThumbsUp, ThumbsDown, ChevronDown, MessageCircle,
  Send, SortDesc, MoreHorizontal, X, Pencil, Trash2, Check, Reply
} from "lucide-react"
import AppHeader from "@/components/app-header"
import MobileNav from "@/components/mobile-nav"
import DesktopSidebar from "@/components/desktop-sidebar"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { useMediaQuery } from "@/hooks/use-media-query"
import { cn } from "@/lib/utils"

// ============= Mock Data (with createdAt for sorting) =============
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

const now = Date.now()
const commentsByVideoData: Record<string, any[]> = {
  "v1": [
    {
      id: "c1", name: "Ahmad Khan", username: "ahmad_khan", avatar: "/placeholder.svg?height=32&width=32",
      timeAgo: "2 days ago", content: "MashaAllah, very beneficial lecture...",
      likes: 245, dislikes: 12, createdAt: now - 1000 * 60 * 60 * 24 * 2,
      replies: [
        { id: "cr1", name: "Daily Dawah", username: "daily_dawah", avatar: "/placeholder.svg?height=32&width=32", timeAgo: "1 day ago", content: "JazakAllah khair...", likes: 89, dislikes: 3, isChannel: true, createdAt: now - 1000 * 60 * 60 * 24 * 1, replies: [] },
        { id: "cr2", name: "Mohammed Ali", username: "mohammed_ali", avatar: "/placeholder.svg?height=32&width=32", timeAgo: "12 hours ago", content: "Couldn't agree more...", likes: 34, dislikes: 1, createdAt: now - 1000 * 60 * 60 * 12, replies: [] },
      ]
    },
    {
      id: "c2", name: "Fatima Hassan", username: "fatima_h", avatar: "/placeholder.svg?height=32&width=32",
      timeAgo: "1 week ago", content: "Beautiful reminder...", likes: 567, dislikes: 23, createdAt: now - 1000 * 60 * 60 * 24 * 7, replies: []
    },
    {
      id: "c3", name: "Omar Farooq", username: "omar_f", avatar: "/placeholder.svg?height=32&width=32",
      timeAgo: "3 days ago", content: "This changed my perspective...", likes: 189, dislikes: 8, createdAt: now - 1000 * 60 * 60 * 24 * 3,
      replies: [
        { id: "cr3", name: "Zainab Mohammed", username: "zainab_m", avatar: "/placeholder.svg?height=32&width=32", timeAgo: "2 days ago", content: "Same here brother...", likes: 45, dislikes: 2, createdAt: now - 1000 * 60 * 60 * 24 * 2, replies: [] },
      ]
    },
  ],
  "r1": [
    { id: "r1c1", name: "Salman Khan", username: "salman_k", avatar: "/placeholder.svg?height=32&width=32", timeAgo: "3 days ago", content: "Very informative video...", likes: 156, dislikes: 8, createdAt: now - 1000 * 60 * 60 * 24 * 3, replies: [] },
    { id: "r1c2", name: "Ayesha Siddiqua", username: "ayesha_s", avatar: "/placeholder.svg?height=32&width=32", timeAgo: "5 days ago", content: "This answered so many...", likes: 234, dislikes: 12, createdAt: now - 1000 * 60 * 60 * 24 * 5, replies: [
      { id: "r1cr1", name: "Daily Dawah", username: "daily_dawah", avatar: "/placeholder.svg?height=32&width=32", timeAgo: "4 days ago", content: "Ameen! Glad it was helpful.", likes: 45, dislikes: 1, isChannel: true, createdAt: now - 1000 * 60 * 60 * 24 * 4, replies: [] },
    ]},
  ],
  "r2": [
    { id: "r2c1", name: "Mariam Begum", username: "mariam_b", avatar: "/placeholder.svg?height=32&width=32", timeAgo: "2 days ago", content: "The signs are so clear...", likes: 345, dislikes: 15, createdAt: now - 1000 * 60 * 60 * 24 * 2, replies: [] },
    { id: "r2c2", name: "Abdullah Rahman", username: "abdullah_r", avatar: "/placeholder.svg?height=32&width=32", timeAgo: "4 days ago", content: "Excellent explanation...", likes: 567, dislikes: 21, createdAt: now - 1000 * 60 * 60 * 24 * 4, replies: [] },
  ],
}

// ============= Storage Helpers =============
const loadAllComments = (): Record<string, any[]> => {
  if (typeof window === 'undefined') return JSON.parse(JSON.stringify(commentsByVideoData))
  try {
    const raw = localStorage.getItem('video_comments_all')
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Object.keys(parsed).length > 0) return parsed
    }
  } catch {}
  const def = JSON.parse(JSON.stringify(commentsByVideoData))
  localStorage.setItem('video_comments_all', JSON.stringify(def))
  return def
}

const saveAllComments = (data: Record<string, any[]>) => {
  if (typeof window === 'undefined') return
  localStorage.setItem('video_comments_all', JSON.stringify(data))
}

const VID_LIKED_KEY = 'video_liked_ids'
const VID_DISLIKED_KEY = 'video_disliked_ids'

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

// ============= Comment Tree Helpers (immutable) =============
const findCommentAndAddReply = (comments: any[], targetId: string, newReply: any): any[] => {
  return comments.map(comment => {
    if (comment.id === targetId) {
      return { ...comment, replies: [...(comment.replies || []), newReply] }
    }
    if (comment.replies && comment.replies.length) {
      return { ...comment, replies: findCommentAndAddReply(comment.replies, targetId, newReply) }
    }
    return comment
  })
}

const findCommentAndUpdate = (comments: any[], targetId: string, updater: (item: any) => any): any[] => {
  return comments.map(comment => {
    if (comment.id === targetId) {
      return updater(comment)
    }
    if (comment.replies && comment.replies.length) {
      return { ...comment, replies: findCommentAndUpdate(comment.replies, targetId, updater) }
    }
    return comment
  })
}

const findCommentAndDelete = (comments: any[], targetId: string): any[] => {
  return comments.filter(comment => {
    if (comment.id === targetId) return false
    if (comment.replies && comment.replies.length) {
      comment.replies = findCommentAndDelete(comment.replies, targetId)
    }
    return true
  })
}

const countAllReplies = (replies: any[]): number => {
  let count = replies.length
  replies.forEach(reply => {
    if (reply.replies && reply.replies.length) {
      count += countAllReplies(reply.replies)
    }
  })
  return count
}

const getDisplayName = (item: any, isOwn: boolean): string => {
  if (isOwn) return "You"
  if (item.name && item.name !== "") return item.name
  if (item.user && item.user !== "") return item.user
  return "User"
}

const getAvatarChar = (displayName: string): string => {
  if (!displayName || displayName === "") return "?"
  return displayName.charAt(0)
}

// Component to render content with @mention styling (only the mention part is highlighted)
const FormattedContent = ({ text }: { text: string }) => {
  // Split by mentions that may contain a second word (e.g., @Aisha Begum)
  const parts = text.split(/(@\w+(?:\s\w+)?)/g)
  return (
    <span className="text-sm mt-0.5">
      {parts.map((part, i) => {
        if (part.startsWith('@')) {
          return <span key={i} className="text-blue-600 font-medium">{part}</span>
        }
        return part
      })}
    </span>
  )
}

// Sorting helper (recursive)
const sortComments = (comments: any[], mode: 'top' | 'newest'): any[] => {
  const sorted = [...comments]
  if (mode === 'top') {
    sorted.sort((a, b) => b.likes - a.likes)
  } else if (mode === 'newest') {
    sorted.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
  }
  return sorted.map(comment => ({
    ...comment,
    replies: comment.replies ? sortComments(comment.replies, mode) : []
  }))
}

// ============= Subcomponents =============
function CommentSkeleton() {
  return (
    <div className="mt-4 flex gap-3">
      <Skeleton className="h-8 w-8 md:h-10 md:w-10 rounded-full flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-12" />
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <div className="flex items-center gap-2 mt-2">
          <Skeleton className="h-7 w-14 rounded-full" />
          <Skeleton className="h-7 w-7 rounded-full" />
          <Skeleton className="h-7 w-16 rounded-full" />
        </div>
      </div>
    </div>
  )
}

// Recursive Reply Item
function ReplyItem({
  reply,
  onLike,
  onDislike,
  onReply,
  onEdit,
  onDelete,
  isLiked,
  isDisliked,
  likedIds,
  dislikedIds,
  depth = 1
}: {
  reply: any
  onLike: (id: string) => void
  onDislike: (id: string) => void
  onReply: (parentId: string, parentUsername: string, text: string) => void
  onEdit: (id: string, newText: string) => void
  onDelete: (id: string) => void
  isLiked: boolean
  isDisliked: boolean
  likedIds: string[]
  dislikedIds: string[]
  depth?: number
}) {
  const [showReplyInput, setShowReplyInput] = useState(false)
  const [replyText, setReplyText] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(reply.content)
  const replyInputRef = useRef<HTMLInputElement>(null)

  const isOwnReply = reply.name === "You" || reply.user === "You"
  const displayName = getDisplayName(reply, isOwnReply)
  const avatarChar = getAvatarChar(displayName)

  const handleReplyClick = () => {
    setShowReplyInput(true)
    const mention = `@${reply.username || displayName} `
    setReplyText(mention)
    setTimeout(() => {
      if (replyInputRef.current) {
        replyInputRef.current.focus()
        replyInputRef.current.setSelectionRange(mention.length, mention.length)
      }
    }, 50)
  }

  const handleSubmitReply = () => {
    if (!replyText.trim()) return
    onReply(reply.id, reply.username || displayName, replyText.trim())
    setReplyText("")
    if (replyInputRef.current) replyInputRef.current.focus()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmitReply()
    }
  }

  const handleSaveEdit = () => {
    if (!editText.trim()) return
    onEdit(reply.id, editText.trim())
    setIsEditing(false)
  }

  const fmt = (n: number) => n > 999 ? `${(n/1000).toFixed(1)}K` : String(n)

  return (
    <div className={`mt-2`} style={{ marginLeft: depth > 0 ? `${Math.min(depth, 4) * 8}px` : 0 }}>
      <div className="flex gap-2.5">
        <Avatar className="h-7 w-7 flex-shrink-0"><AvatarImage src={reply.avatar} /><AvatarFallback className="text-[10px]">{avatarChar}</AvatarFallback></Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-medium">{displayName}</span>
            {reply.isChannel && <span className="text-[10px] bg-foreground/10 px-1 py-0.5 rounded-full">Creator</span>}
            <span className="text-[10px] text-muted-foreground">{reply.timeAgo}</span>
          </div>
          {isEditing ? (
            <div className="mt-1 flex flex-col gap-2">
              <input
                type="text"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSaveEdit()}
                className="w-full bg-muted/30 border border-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-0"
                autoFocus
              />
              <div className="flex gap-2">
                <button onClick={handleSaveEdit} className="text-xs font-medium text-blue-600"><Check className="h-4 w-4" /></button>
                <button onClick={() => setIsEditing(false)} className="text-xs font-medium text-muted-foreground"><X className="h-4 w-4" /></button>
              </div>
            </div>
          ) : (
            <FormattedContent text={reply.content} />
          )}
          {!isEditing && (
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <button onClick={() => onLike(reply.id)} className={`flex items-center gap-1.5 hover:bg-muted rounded-full px-2.5 py-1 transition-colors ${isLiked ? 'text-blue-600' : 'text-muted-foreground'}`}>
                <ThumbsUp className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} /><span className="text-xs">{fmt(reply.likes)}</span>
              </button>
              <button onClick={() => onDislike(reply.id)} className={`hover:bg-muted rounded-full p-1 transition-colors ${isDisliked ? 'text-red-500' : 'text-muted-foreground'}`}>
                <ThumbsDown className={`h-4 w-4 ${isDisliked ? 'fill-current' : ''}`} />
              </button>
              <button onClick={handleReplyClick} className="flex items-center gap-1 text-xs text-muted-foreground hover:bg-muted rounded-full px-2.5 py-1 transition-colors">
                <Reply className="h-3 w-3" /> Reply
              </button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild><button className="hover:bg-muted rounded-full p-1 transition-colors ml-auto"><MoreVertical className="h-3.5 w-3.5 text-muted-foreground" /></button></DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 rounded-xl py-2">
                  {isOwnReply && (
                    <>
                      <DropdownMenuItem onClick={() => setIsEditing(true)}><Pencil className="mr-2 h-4 w-4" />Edit</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onDelete(reply.id)} className="text-red-500"><Trash2 className="mr-2 h-4 w-4" />Delete</DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuItem><Flag className="mr-2 h-4 w-4" />Report</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
          {showReplyInput && !isEditing && (
            <div className="mt-2 flex gap-2">
              <Avatar className="h-6 w-6 flex-shrink-0"><AvatarFallback className="text-[10px]">Y</AvatarFallback></Avatar>
              <div className="flex-1 flex items-center gap-1.5">
                <input
                  ref={replyInputRef}
                  type="text"
                  placeholder={`Reply to @${reply.username || displayName}...`}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 bg-transparent border-b border-border pb-1 text-xs focus:outline-none focus:ring-0 placeholder:text-muted-foreground"
                  autoFocus
                />
                <button onClick={handleSubmitReply} disabled={!replyText.trim()} className="text-blue-600 hover:text-blue-700 disabled:opacity-30"><Send className="h-3.5 w-3.5" /></button>
                <button onClick={() => setShowReplyInput(false)} className="text-muted-foreground hover:text-foreground"><X className="h-3.5 w-3.5" /></button>
              </div>
            </div>
          )}
        </div>
      </div>
      {reply.replies && reply.replies.length > 0 && (
        <div className="mt-1">
          {reply.replies.map((nestedReply: any) => (
            <ReplyItem
              key={nestedReply.id}
              reply={nestedReply}
              onLike={onLike}
              onDislike={onDislike}
              onReply={onReply}
              onEdit={onEdit}
              onDelete={onDelete}
              isLiked={likedIds.includes(nestedReply.id)}
              isDisliked={dislikedIds.includes(nestedReply.id)}
              likedIds={likedIds}
              dislikedIds={dislikedIds}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// Top-level Comment Item
function CommentItem({
  comment,
  onLike,
  onDislike,
  onReply,
  onEdit,
  onDelete,
  isLiked,
  isDisliked,
  likedIds,
  dislikedIds
}: {
  comment: any
  onLike: (id: string) => void
  onDislike: (id: string) => void
  onReply: (parentId: string, parentUsername: string, text: string) => void
  onEdit: (id: string, newText: string) => void
  onDelete: (id: string) => void
  isLiked: boolean
  isDisliked: boolean
  likedIds: string[]
  dislikedIds: string[]
}) {
  const [showReplies, setShowReplies] = useState(false)
  const [showReplyInput, setShowReplyInput] = useState(false)
  const [replyText, setReplyText] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(comment.content)
  const replyInputRef = useRef<HTMLInputElement>(null)

  const isOwnComment = comment.name === "You" || comment.user === "You"
  const displayName = getDisplayName(comment, isOwnComment)
  const avatarChar = getAvatarChar(displayName)

  const handleReplyClick = () => {
    setShowReplyInput(true)
    const mention = `@${comment.username || displayName} `
    setReplyText(mention)
    setTimeout(() => {
      if (replyInputRef.current) {
        replyInputRef.current.focus()
        replyInputRef.current.setSelectionRange(mention.length, mention.length)
      }
    }, 50)
  }

  const handleReplySubmit = () => {
    if (!replyText.trim()) return
    onReply(comment.id, comment.username || displayName, replyText.trim())
    setReplyText("")
    if (replyInputRef.current) replyInputRef.current.focus()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleReplySubmit()
    }
  }

  const handleSaveEdit = () => {
    if (!editText.trim()) return
    onEdit(comment.id, editText.trim())
    setIsEditing(false)
  }

  const fmt = (n: number) => n > 999 ? `${(n/1000).toFixed(1)}K` : String(n)
  const totalRepliesCount = comment.replies ? countAllReplies(comment.replies) : 0

  return (
    <div className="mt-4">
      <div className="flex gap-3">
        <Avatar className="h-8 w-8 md:h-10 md:w-10 flex-shrink-0"><AvatarImage src={comment.avatar} /><AvatarFallback>{avatarChar}</AvatarFallback></Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[13px] font-medium">{displayName}</span>
            {comment.isChannel && <span className="text-[10px] bg-foreground/10 px-1.5 py-0.5 rounded-full font-medium">Creator</span>}
            <span className="text-xs text-muted-foreground">{comment.timeAgo}</span>
          </div>
          {isEditing ? (
            <div className="mt-1 flex flex-col gap-2">
              <textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSaveEdit()}
                className="w-full bg-muted/30 border border-border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-0 resize-none"
                rows={2}
                autoFocus
              />
              <div className="flex gap-2">
                <button onClick={handleSaveEdit} className="text-xs font-medium text-blue-600"><Check className="h-4 w-4" /></button>
                <button onClick={() => setIsEditing(false)} className="text-xs font-medium text-muted-foreground"><X className="h-4 w-4" /></button>
              </div>
            </div>
          ) : (
            <FormattedContent text={comment.content} />
          )}
          {!isEditing && (
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <button onClick={() => onLike(comment.id)} className={`flex items-center gap-1.5 hover:bg-muted rounded-full px-3 py-1.5 transition-colors ${isLiked ? 'text-blue-600' : 'text-muted-foreground'}`}>
                <ThumbsUp className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} /><span className="text-xs">{fmt(comment.likes)}</span>
              </button>
              <button onClick={() => onDislike(comment.id)} className={`hover:bg-muted rounded-full p-1.5 transition-colors ${isDisliked ? 'text-red-500' : 'text-muted-foreground'}`}>
                <ThumbsDown className={`h-5 w-5 ${isDisliked ? 'fill-current' : ''}`} />
              </button>
              <button onClick={handleReplyClick} className="flex items-center gap-1 text-xs text-muted-foreground hover:bg-muted rounded-full px-3 py-1.5 transition-colors">
                <Reply className="h-3.5 w-3.5" /> Reply
              </button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild><button className="hover:bg-muted rounded-full p-1.5 transition-colors ml-auto"><MoreVertical className="h-4 w-4 text-muted-foreground" /></button></DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 rounded-xl py-2">
                  {isOwnComment && (
                    <>
                      <DropdownMenuItem onClick={() => setIsEditing(true)}><Pencil className="mr-2 h-4 w-4" />Edit</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onDelete(comment.id)} className="text-red-500"><Trash2 className="mr-2 h-4 w-4" />Delete</DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuItem><Flag className="mr-2 h-4 w-4" />Report</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
          {showReplyInput && !isEditing && (
            <div className="mt-3 flex gap-2">
              <Avatar className="h-7 w-7 flex-shrink-0"><AvatarFallback className="text-[10px]">Y</AvatarFallback></Avatar>
              <div className="flex-1 flex items-center gap-2">
                <input
                  ref={replyInputRef}
                  type="text"
                  placeholder={`Reply to @${comment.username || displayName}...`}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 bg-transparent border-b border-border pb-1 text-sm focus:outline-none focus:ring-0 placeholder:text-muted-foreground"
                  autoFocus
                />
                <button onClick={handleReplySubmit} disabled={!replyText.trim()} className="text-blue-600 hover:text-blue-700 disabled:opacity-30"><Send className="h-4 w-4" /></button>
                <button onClick={() => setShowReplyInput(false)} className="text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>
              </div>
            </div>
          )}
        </div>
      </div>
      {comment.replies && comment.replies.length > 0 && (
        <button onClick={() => setShowReplies(!showReplies)} className="flex items-center gap-1.5 mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium">
          <ChevronDown className={`h-4 w-4 transition-transform ${showReplies ? 'rotate-180' : ''}`} />
          {showReplies ? 'Hide' : totalRepliesCount} {totalRepliesCount === 1 ? 'reply' : 'replies'}
        </button>
      )}
      {showReplies && comment.replies.map((reply: any) => (
        <ReplyItem
          key={reply.id}
          reply={reply}
          onLike={onLike}
          onDislike={onDislike}
          onReply={onReply}
          onEdit={onEdit}
          onDelete={onDelete}
          isLiked={likedIds.includes(reply.id)}
          isDisliked={dislikedIds.includes(reply.id)}
          likedIds={likedIds}
          dislikedIds={dislikedIds}
          depth={1}
        />
      ))}
    </div>
  )
}

// ============= Main Page =============
export default function VideoPlayPage() {
  const router = useRouter()
  const params = useParams()
  const isMobile = useMediaQuery("(max-width: 768px)")
  const [showFullDescription, setShowFullDescription] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [isDisliked, setIsDisliked] = useState(false)
  const [commentText, setCommentText] = useState("")
  const [isSubscribed, setIsSubscribed] = useState(true)
  const [comments, setComments] = useState<any[]>([])
  const [commentsLoading, setCommentsLoading] = useState(false)
  const [localLikedIds, setLocalLikedIds] = useState<string[]>(() => loadIds(VID_LIKED_KEY))
  const [localDislikedIds, setLocalDislikedIds] = useState<string[]>(() => loadIds(VID_DISLIKED_KEY))
  const [totalCommentCount, setTotalCommentCount] = useState(0)
  const [commentsDrawerOpen, setCommentsDrawerOpen] = useState(false)
  const [allCommentsData, setAllCommentsData] = useState<Record<string, any[]>>(() => loadAllComments())
  const [sortMode, setSortMode] = useState<'top' | 'newest'>('top')

  const [currentVideo, setCurrentVideo] = useState({ ...videoData, videoUrl: videoData.videoUrl, comments: "1,234" })
  const [activeVideoId, setActiveVideoId] = useState("v1")

  useEffect(() => { saveIds(VID_LIKED_KEY, localLikedIds) }, [localLikedIds])
  useEffect(() => { saveIds(VID_DISLIKED_KEY, localDislikedIds) }, [localDislikedIds])
  useEffect(() => { saveAllComments(allCommentsData) }, [allCommentsData])

  const calculateTotalComments = (commentsList: any[]): number => {
    let count = commentsList.length
    commentsList.forEach(c => {
      if (c.replies && c.replies.length) count += calculateTotalComments(c.replies)
    })
    return count
  }

  const loadCommentsForVideo = (videoId: string) => {
    setCommentsLoading(true)
    setComments([])
    setTimeout(() => {
      const rawComments = allCommentsData[videoId] || []
      const sorted = sortComments(rawComments, sortMode)
      setComments(sorted)
      setTotalCommentCount(calculateTotalComments(rawComments))
      setCommentsLoading(false)
    }, 600)
  }

  useEffect(() => {
    loadCommentsForVideo(activeVideoId)
  }, [activeVideoId, sortMode])

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
      id: video.id, title: video.title, channel: video.channel, channelAvatar: "/placeholder.svg?height=36&width=36",
      subscribers: `${Math.floor(Math.random() * 900) + 100}K subscribers`, views: video.views, publishedAt: video.timeAgo,
      description: `Description for ${video.title}.`, videoUrl: video.videoUrl, isSubscribed: false,
      likes: `${Math.floor(Math.random() * 20) + 1}K`, dislikes: `${Math.floor(Math.random() * 500) + 10}`,
      comments: `${Math.floor(Math.random() * 2000) + 100}`, duration: video.duration || "0:00",
    })
    setActiveVideoId(video.id)
    setIsSubscribed(false)
    setShowFullDescription(false)
    setCommentText("")
    setIsLiked(false)
    setIsDisliked(false)
    if (isMobile) window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // ============= Comment CRUD =============
  const handleLikeComment = (commentId: string) => {
    const wasLiked = localLikedIds.includes(commentId)
    const wasDisliked = localDislikedIds.includes(commentId)

    const updater = (item: any) => {
      let newLikes = item.likes
      let newDislikes = item.dislikes
      if (wasLiked) {
        newLikes--
      } else {
        newLikes++
        if (wasDisliked) newDislikes--
      }
      return { ...item, likes: newLikes, dislikes: newDislikes }
    }

    if (wasLiked) {
      setLocalLikedIds(prev => prev.filter(id => id !== commentId))
    } else {
      setLocalLikedIds(prev => [...prev, commentId])
      if (wasDisliked) {
        setLocalDislikedIds(prev => prev.filter(id => id !== commentId))
      }
    }

    const newComments = findCommentAndUpdate([...comments], commentId, updater)
    setComments(newComments)

    const videoComments = [...(allCommentsData[activeVideoId] || [])]
    const updatedVideoComments = findCommentAndUpdate(videoComments, commentId, updater)
    setAllCommentsData(prev => ({ ...prev, [activeVideoId]: updatedVideoComments }))
  }

  const handleDislikeComment = (commentId: string) => {
    const wasDisliked = localDislikedIds.includes(commentId)
    const wasLiked = localLikedIds.includes(commentId)

    const updater = (item: any) => {
      let newLikes = item.likes
      let newDislikes = item.dislikes
      if (wasDisliked) {
        newDislikes--
      } else {
        newDislikes++
        if (wasLiked) newLikes--
      }
      return { ...item, likes: newLikes, dislikes: newDislikes }
    }

    if (wasDisliked) {
      setLocalDislikedIds(prev => prev.filter(id => id !== commentId))
    } else {
      setLocalDislikedIds(prev => [...prev, commentId])
      if (wasLiked) {
        setLocalLikedIds(prev => prev.filter(id => id !== commentId))
      }
    }

    const newComments = findCommentAndUpdate([...comments], commentId, updater)
    setComments(newComments)

    const videoComments = [...(allCommentsData[activeVideoId] || [])]
    const updatedVideoComments = findCommentAndUpdate(videoComments, commentId, updater)
    setAllCommentsData(prev => ({ ...prev, [activeVideoId]: updatedVideoComments }))
  }

  const handleAddReply = (parentId: string, parentUsername: string, text: string) => {
    let finalText = text
    if (!text.includes(`@${parentUsername}`)) {
      finalText = `@${parentUsername} ${text}`
    }
    const newReply = {
      id: `r${Date.now()}`,
      name: "You",
      user: "You",
      username: "you",
      avatar: "/placeholder.svg?height=32&width=32",
      timeAgo: "Just now",
      content: finalText,
      likes: 0,
      dislikes: 0,
      createdAt: Date.now(),
      replies: [],
    }
    const updatedComments = findCommentAndAddReply([...comments], parentId, newReply)
    setComments(updatedComments)
    setTotalCommentCount(calculateTotalComments(updatedComments))

    const videoComments = [...(allCommentsData[activeVideoId] || [])]
    const updatedVideoComments = findCommentAndAddReply(videoComments, parentId, newReply)
    setAllCommentsData(prev => ({ ...prev, [activeVideoId]: updatedVideoComments }))
  }

  const handleEditComment = (commentId: string, newText: string) => {
    const updater = (item: any) => (item.name === "You" ? { ...item, content: newText } : item)

    const newComments = findCommentAndUpdate([...comments], commentId, updater)
    setComments(newComments)

    const videoComments = [...(allCommentsData[activeVideoId] || [])]
    const updatedVideoComments = findCommentAndUpdate(videoComments, commentId, updater)
    setAllCommentsData(prev => ({ ...prev, [activeVideoId]: updatedVideoComments }))
  }

  const handleDeleteComment = (commentId: string) => {
    const newComments = findCommentAndDelete([...comments], commentId)
    setComments(newComments)
    setTotalCommentCount(calculateTotalComments(newComments))

    const videoComments = [...(allCommentsData[activeVideoId] || [])]
    const updatedVideoComments = findCommentAndDelete(videoComments, commentId)
    setAllCommentsData(prev => ({ ...prev, [activeVideoId]: updatedVideoComments }))
  }

  const handleAddTopLevelComment = () => {
    if (!commentText.trim()) return
    const newComment = {
      id: `c${Date.now()}`,
      name: "You",
      user: "You",
      username: "you",
      avatar: "/placeholder.svg?height=32&width=32",
      timeAgo: "Just now",
      content: commentText.trim(),
      likes: 0,
      dislikes: 0,
      createdAt: Date.now(),
      replies: [],
    }
    const updatedComments = [newComment, ...comments]
    setComments(updatedComments)
    setTotalCommentCount(calculateTotalComments(updatedComments))
    setCommentText("")

    const videoComments = [newComment, ...(allCommentsData[activeVideoId] || [])]
    setAllCommentsData(prev => ({ ...prev, [activeVideoId]: videoComments }))
  }

  const formatCommentCount = (count: number) => {
    if (count >= 1000000) return `${(count/1000000).toFixed(1)}M`
    if (count >= 1000) return `${(count/1000).toFixed(1)}K`
    return String(count)
  }

  // ---------- Sort Dropdown ----------
  const SortDropdown = () => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-full px-3 py-1 transition-colors">
          <SortDesc className="h-4 w-4" />
          <span>Sort by</span>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40">
        <DropdownMenuItem onClick={() => setSortMode('top')} className="flex items-center justify-between">
          Top comments
          {sortMode === 'top' && <Check className="h-4 w-4" />}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setSortMode('newest')} className="flex items-center justify-between">
          Newest first
          {sortMode === 'newest' && <Check className="h-4 w-4" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )

  // ---------- Comments Section UI ----------
  const CommentsContentDesktop = () => (
    <div className="focus:outline-none ring-0">
      <div className="flex items-center gap-6 mb-6">
        <div className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5" />
          <span className="font-semibold text-base">{formatCommentCount(totalCommentCount)} Comments</span>
        </div>
        <SortDropdown />
      </div>
      <div className="flex gap-3 mb-8">
        <Avatar className="h-8 w-8 md:h-10 md:w-10 flex-shrink-0"><AvatarFallback>Y</AvatarFallback></Avatar>
        <div className="flex-1">
          <input
            type="text"
            placeholder="Add a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleAddTopLevelComment()
              }
            }}
            className="w-full bg-transparent border-b border-border pb-1.5 text-sm focus:outline-none focus:ring-0 placeholder:text-muted-foreground"
          />
          {commentText && (
            <div className="flex items-center gap-2 mt-3 justify-end">
              <button onClick={() => setCommentText("")} className="text-sm font-medium hover:bg-muted rounded-full px-4 py-2 transition-colors">Cancel</button>
              <button onClick={handleAddTopLevelComment} className="text-sm font-medium bg-foreground text-background rounded-full px-4 py-2 hover:bg-foreground/90 transition-colors disabled:opacity-50" disabled={!commentText.trim()}>Comment</button>
            </div>
          )}
        </div>
      </div>
      <div id="comments-section">
        {commentsLoading ? (
          <><CommentSkeleton /><CommentSkeleton /><CommentSkeleton /><CommentSkeleton /><CommentSkeleton /></>
        ) : comments.length > 0 ? (
          comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onLike={handleLikeComment}
              onDislike={handleDislikeComment}
              onReply={handleAddReply}
              onEdit={handleEditComment}
              onDelete={handleDeleteComment}
              isLiked={localLikedIds.includes(comment.id)}
              isDisliked={localDislikedIds.includes(comment.id)}
              likedIds={localLikedIds}
              dislikedIds={localDislikedIds}
            />
          ))
        ) : (
          <div className="text-center py-8 text-muted-foreground text-sm">No comments yet. Be the first to comment!</div>
        )}
      </div>
    </div>
  )

  const CommentsContentMobile = () => (
    <div className="flex flex-col h-full focus:outline-none ring-0">
      {/* Sticky header with count and sort */}
      <div className="sticky top-0 bg-background z-10 pb-2 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            <span className="font-semibold text-base">{formatCommentCount(totalCommentCount)} Comments</span>
          </div>
          <SortDropdown />
        </div>
      </div>

      {/* Scrollable comments list */}
      <div className="flex-1 overflow-y-auto py-4 space-y-2" id="comments-list-mobile">
        {commentsLoading ? (
          <><CommentSkeleton /><CommentSkeleton /><CommentSkeleton /><CommentSkeleton /><CommentSkeleton /></>
        ) : comments.length > 0 ? (
          comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onLike={handleLikeComment}
              onDislike={handleDislikeComment}
              onReply={handleAddReply}
              onEdit={handleEditComment}
              onDelete={handleDeleteComment}
              isLiked={localLikedIds.includes(comment.id)}
              isDisliked={localDislikedIds.includes(comment.id)}
              likedIds={localLikedIds}
              dislikedIds={localDislikedIds}
            />
          ))
        ) : (
          <div className="text-center py-8 text-muted-foreground text-sm">No comments yet. Be the first to comment!</div>
        )}
      </div>

      {/* Sticky input at bottom */}
      <div className="sticky bottom-0 bg-background pt-3 pb-2 border-t">
        <div className="flex gap-3">
          <Avatar className="h-8 w-8 flex-shrink-0"><AvatarFallback>Y</AvatarFallback></Avatar>
          <div className="flex-1">
            <input
              type="text"
              placeholder="Add a comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleAddTopLevelComment()
                }
              }}
              className="w-full bg-transparent border-b border-border pb-1.5 text-sm focus:outline-none focus:ring-0 placeholder:text-muted-foreground"
            />
            {commentText && (
              <div className="flex items-center gap-2 mt-2 justify-end">
                <button onClick={() => setCommentText("")} className="text-sm font-medium hover:bg-muted rounded-full px-3 py-1 transition-colors">Cancel</button>
                <button onClick={handleAddTopLevelComment} className="text-sm font-medium bg-foreground text-background rounded-full px-3 py-1 hover:bg-foreground/90 transition-colors disabled:opacity-50" disabled={!commentText.trim()}>Comment</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )

  // ---------- Main Return ----------
  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <div className="flex">
        <DesktopSidebar className="hidden md:block" />
        <div className="flex-1 md:pl-[240px] pt-[56px] pb-nav-safe md:pb-6">
          <div className="flex flex-col lg:flex-row p-4 gap-4">
            {/* Main video column */}
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
                      <Avatar className="h-9 w-9 md:h-10 md:w-10"><AvatarImage src={currentVideo.channelAvatar} /><AvatarFallback>{currentVideo.channel.charAt(0)}</AvatarFallback></Avatar>
                      <div><p className="text-sm font-medium group-hover:text-primary">{currentVideo.channel}</p><p className="text-xs text-muted-foreground">{currentVideo.subscribers}</p></div>
                    </Link>
                    <Button onClick={() => setIsSubscribed(!isSubscribed)} className={`rounded-full h-9 text-sm px-4 font-medium ${isSubscribed ? 'bg-muted hover:bg-muted/80 text-foreground' : 'bg-foreground text-background hover:bg-foreground/90'}`}>
                      {isSubscribed ? 'Subscribed' : 'Subscribe'}
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center bg-muted rounded-full overflow-hidden">
                      <button onClick={() => { setIsLiked(!isLiked); if (isDisliked) setIsDisliked(false) }} className={`flex items-center gap-2 px-4 py-2 hover:bg-muted/80 transition-colors border-r border-border ${isLiked ? 'text-foreground' : ''}`}>
                        <ThumbsUp className={`h-5 w-5 ${isLiked ? 'fill-current' : ''}`} /><span className="text-sm font-medium">{currentVideo.likes}</span>
                      </button>
                      <button onClick={() => { setIsDisliked(!isDisliked); if (isLiked) setIsLiked(false) }} className={`px-4 py-2 hover:bg-muted/80 transition-colors ${isDisliked ? 'text-foreground' : ''}`}>
                        <ThumbsDown className={`h-5 w-5 ${isDisliked ? 'fill-current' : ''}`} />
                      </button>
                    </div>
                    <Button variant="ghost" size="icon" className="rounded-full hover:bg-muted"><Share className="h-5 w-5" /></Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="rounded-full"><MoreHorizontal className="h-5 w-5" /></Button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-72 rounded-xl py-2">
                        <DropdownMenuItem><ListPlus className="mr-2 h-5 w-5" />Add to queue</DropdownMenuItem>
                        <DropdownMenuItem><Clock className="mr-2 h-5 w-5" />Save to Watch later</DropdownMenuItem>
                        <DropdownMenuItem><Bookmark className="mr-2 h-5 w-5" />Save to playlist</DropdownMenuItem>
                        <DropdownMenuItem><Share className="mr-2 h-5 w-5" />Share</DropdownMenuItem>
                        <DropdownMenuItem><Ban className="mr-2 h-5 w-5" />Not interested</DropdownMenuItem>
                        <DropdownMenuItem><UserX className="mr-2 h-5 w-5" />Don't recommend channel</DropdownMenuItem>
                        <DropdownMenuItem><Flag className="mr-2 h-5 w-5" />Report</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
                <div onClick={() => setShowFullDescription(!showFullDescription)} className="mt-3 bg-muted/40 hover:bg-muted/60 rounded-xl p-3 md:p-4 cursor-pointer transition-colors">
                  <div className="flex items-center gap-2 text-sm"><span className="font-medium">{currentVideo.views}</span><span className="text-muted-foreground">•</span><span className="text-muted-foreground">{currentVideo.publishedAt}</span></div>
                  <div className={`text-sm mt-1 whitespace-pre-wrap ${showFullDescription ? '' : 'line-clamp-2'}`}>{currentVideo.description}</div>
                  <span className="text-sm font-medium text-foreground/70 mt-1 inline-block">{showFullDescription ? 'Show less' : '...more'}</span>
                </div>

                {/* Comments: inline on desktop, drawer on mobile */}
                {!isMobile ? (
                  <div className="mt-6">
                    <CommentsContentDesktop />
                  </div>
                ) : (
                  <div className="mt-6">
                    <Drawer open={commentsDrawerOpen} onOpenChange={setCommentsDrawerOpen}>
                      <DrawerTrigger asChild>
                        <Button variant="outline" className="w-full rounded-full flex items-center gap-2 focus:outline-none focus:ring-0">
                          <MessageCircle className="h-4 w-4" />
                          {formatCommentCount(totalCommentCount)} Comments
                        </Button>
                      </DrawerTrigger>
                      <DrawerContent className="h-[80vh] max-h-[80vh] focus:outline-none ring-0 border-0">
                        <div className="flex flex-col h-full overflow-hidden">
                          <DrawerHeader className="border-b pb-2 flex-shrink-0">
                            <DrawerTitle className="text-lg">Comments</DrawerTitle>
                          </DrawerHeader>
                          <div className="flex-1 overflow-y-auto px-4">
                            <CommentsContentMobile />
                          </div>
                        </div>
                      </DrawerContent>
                    </Drawer>
                  </div>
                )}
              </div>
            </div>

            {/* Related videos sidebar (desktop) */}
            <div className="hidden lg:block w-[400px] flex-shrink-0">
              <h3 className="font-semibold text-base mb-4">Related Videos</h3>
              <div className="space-y-3">
                {relatedVideos.map((video) => (
                  <button key={video.id} onClick={() => handleRelatedVideoClick(video)} className="flex gap-2 group text-left w-full hover:bg-muted/30 rounded-lg p-1 transition-colors">
                    <div className="relative w-[168px] h-[94px] flex-shrink-0">
                      <Image src={video.thumbnail} alt={video.title} fill className="object-cover rounded-lg" />
                      <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 py-0.5 rounded font-medium">{video.duration}</div>
                      {activeVideoId === video.id && <div className="absolute inset-0 bg-black/20 rounded-lg flex items-center justify-center"><div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" /></div>}
                    </div>
                    <div className="flex-1 min-w-0 py-1">
                      <h4 className={`font-medium text-sm line-clamp-2 leading-tight ${activeVideoId === video.id ? 'text-primary' : 'group-hover:text-primary'}`}>{video.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{video.channel}</p>
                      <p className="text-xs text-muted-foreground">{video.views} • {video.timeAgo}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Related videos for mobile */}
          {isMobile && (
            <div className="px-4 pb-4">
              <h3 className="font-semibold text-base mb-4">Related Videos</h3>
              <div className="space-y-3">
                {relatedVideos.map((video) => (
                  <button key={video.id} onClick={() => handleRelatedVideoClick(video)} className="flex gap-3 group text-left w-full">
                    <div className="relative w-40 md:w-56 aspect-video flex-shrink-0">
                      <Image src={video.thumbnail} alt={video.title} fill className="object-cover rounded-lg" />
                      <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 py-0.5 rounded font-medium">{video.duration}</div>
                      {activeVideoId === video.id && <div className="absolute inset-0 bg-black/20 rounded-lg flex items-center justify-center"><div className="w-2 h-2 bg-red-600 rounded-full animate-pulse" /></div>}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className={`font-medium text-sm line-clamp-2 ${activeVideoId === video.id ? 'text-primary' : 'group-hover:text-primary'}`}>{video.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{video.channel}</p>
                      <p className="text-xs text-muted-foreground">{video.views} • {video.timeAgo}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <MobileNav />
    </div>
  )
}