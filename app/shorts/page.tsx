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
  X,
  ThumbsUp,
  ThumbsDown,
  MoreVertical,
  Send,
  Eye,
  Clock,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import AppHeader from "@/components/app-header"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const commentsByVideo: Record<string, any[]> = {
  s1: [
    { id: "s1c1", user: "Ahmad Khan", avatar: "/placeholder.svg?height=32&width=32", timeAgo: "2 hours ago", content: "MashaAllah, beautiful recitation! May Allah bless you.", likes: "245", dislikes: "12" },
    { id: "s1c2", user: "Fatima Hassan", avatar: "/placeholder.svg?height=32&width=32", timeAgo: "5 hours ago", content: "This brought tears to my eyes. SubhanAllah!", likes: "567", dislikes: "23" },
    { id: "s1c3", user: "Omar Farooq", avatar: "/placeholder.svg?height=32&width=32", timeAgo: "1 day ago", content: "The best recitation I've heard. JazakAllah khair!", likes: "189", dislikes: "8" },
    { id: "s1c4", user: "Aisha Begum", avatar: "/placeholder.svg?height=32&width=32", timeAgo: "2 days ago", content: "I listen to this every morning. So peaceful.", likes: "123", dislikes: "5" },
    { id: "s1c5", user: "Ibrahim Malik", avatar: "/placeholder.svg?height=32&width=32", timeAgo: "3 days ago", content: "May Allah reward you for sharing this beautiful recitation.", likes: "78", dislikes: "2" },
    { id: "s1c6", user: "Khadija Omar", avatar: "/placeholder.svg?height=32&width=32", timeAgo: "4 days ago", content: "This is exactly what I needed today. Thank you!", likes: "312", dislikes: "15" },
  ],
  s2: [
    { id: "s2c1", user: "Yusuf Ahmed", avatar: "/placeholder.svg?height=32&width=32", timeAgo: "1 hour ago", content: "Powerful message! Don't lose hope, Allah is always with us.", likes: "456", dislikes: "8" },
    { id: "s2c2", user: "Zainab Hassan", avatar: "/placeholder.svg?height=32&width=32", timeAgo: "3 hours ago", content: "JazakAllah khair for this reminder. I really needed this today.", likes: "234", dislikes: "5" },
    { id: "s2c3", user: "Mohammed Ali", avatar: "/placeholder.svg?height=32&width=32", timeAgo: "6 hours ago", content: "SubhanAllah! Such a beautiful message of hope.", likes: "678", dislikes: "12" },
  ],
  s3: [
    { id: "s3c1", user: "Hamza Yusuf", avatar: "/placeholder.svg?height=32&width=32", timeAgo: "30 minutes ago", content: "The adhan from Masjid Al-Haram is always so powerful.", likes: "567", dislikes: "3" },
    { id: "s3c2", user: "Noor Fatima", avatar: "/placeholder.svg?height=32&width=32", timeAgo: "2 hours ago", content: "Goosebumps every time I hear this beautiful adhan.", likes: "432", dislikes: "6" },
  ],
}

const descriptionsByVideo: Record<string, { title: string; views: string; timeAgo: string; description: string; hashtags: string[] }> = {
  s1: { title: "Surah Al Baqarah - Beautiful Recitation That Touches The Heart", views: "15,234", timeAgo: "2 weeks ago", description: "Experience the beautiful recitation of Surah Al Baqarah that touches the heart.", hashtags: ["#quran", "#surahalbaqarah", "#islamicrecitation"] },
  s2: { title: "Powerful Reminder - Don't Lose Hope in Allah's Mercy", views: "25,890", timeAgo: "3 days ago", description: "A powerful reminder for those who feel lost or hopeless.", hashtags: ["#islamicreminder", "#hope", "#mercyofallah"] },
  s3: { title: "Beautiful Adhan - Call to Prayer from Masjid Al-Haram", views: "50,123", timeAgo: "1 week ago", description: "Listen to the beautiful Adhan from Masjid Al-Haram in Makkah.", hashtags: ["#adhan", "#makkah", "#masjidalharam"] }
}

const shortsData = [
  { id: "s1", title: "Surah Al Baqarah - Beautiful Recitation That Touches The Heart", channel: "Islamic Recitation", channelAvatar: "/placeholder.svg?height=36&width=36", likes: "15K", comments: "1.2K", isSubscribed: false },
  { id: "s2", title: "Powerful Reminder - Don't Lose Hope in Allah's Mercy", channel: "Daily Dawah", channelAvatar: "/placeholder.svg?height=36&width=36", likes: "25K", comments: "2.1K", isSubscribed: true },
  { id: "s3", title: "Beautiful Adhan - Call to Prayer from Masjid Al-Haram", channel: "Islamic Sounds", channelAvatar: "/placeholder.svg?height=36&width=36", likes: "50K", comments: "3.5K", isSubscribed: false },
]

type PanelType = "comments" | "description" | null

function MoreIcon({ className }: { className?: string }) {
  return <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" className={className}><path d="M12 4a2 2 0 100 4 2 2 0 000-4Zm0 6a2 2 0 100 4 2 2 0 000-4Zm0 6a2 2 0 100 4 2 2 0 000-4Z" fill="currentColor" /></svg>
}

function CCIconOff({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" className={className}>
      <path d="M21 3H3a2 2 0 00-2 2v14a2 2 0 002 2h18a2 2 0 002-2V5a2 2 0 00-2-2ZM3 19V5h18v14H3ZM6.972 8.346c-.631.336-1.131.881-1.466 1.526A4.6 4.6 0 005 12c-.004.74.17 1.47.506 2.128.336.645.835 1.191 1.466 1.526a2.86 2.86 0 002.066.257c.697-.178 1.294-.606 1.737-1.176a1 1 0 00-1.578-1.228c-.21.27-.444.413-.654.467a.86.86 0 01-.632-.085c-.222-.119-.453-.342-.631-.684A2.64 2.64 0 017 12a2.6 2.6 0 01.281-1.205c.177-.342.408-.565.63-.684a.86.86 0 01.632-.085c.209.054.444.197.654.467a1 1 0 001.578-1.228c-.443-.57-1.04-.998-1.737-1.176a2.86 2.86 0 00-2.066.257Zm8 0c-.631.336-1.131.881-1.466 1.526A4.6 4.6 0 0013 12c-.004.74.17 1.47.506 2.128.336.645.835 1.191 1.466 1.526a2.86 2.86 0 002.066.257c.697-.178 1.294-.606 1.737-1.176a1 1 0 00-1.578-1.228c-.21.27-.444.413-.654.467a.86.86 0 01-.632-.085c-.222-.119-.453-.342-.631-.684A2.64 2.64 0 0115 12a2.6 2.6 0 01.281-1.205c.177-.342.408-.565.63-.684a.86.86 0 01.632-.085c.209.054.444.197.654.467a1 1 0 001.578-1.228c-.443-.57-1.04-.998-1.737-1.176a2.86 2.86 0 00-2.066.257Z" fill="currentColor" />
    </svg>
  )
}

function CCIconOn({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" className={className}>
      <rect x="1" y="3" width="22" height="18" rx="2" fill="white" />
      <path d="M9.038 8.089c.697.178 1.294.606 1.737 1.176a1 1 0 01-1.578 1.228c-.21-.27-.444-.413-.654-.467a.86.86 0 00-.632.085c-.222.119-.453.342-.631.684A2.64 2.64 0 007 12a2.64 2.64 0 00.281 1.205c.177.342.408.565.63.684a.86.86 0 00.632.085c.209-.054.444-.197.654-.467a1 1 0 011.578 1.228c-.443.57-1.04.998-1.737 1.176a2.86 2.86 0 01-2.066-.257c-.631-.336-1.131-.881-1.466-1.526A4.6 4.6 0 015 12c-.004-.74.17-1.47.506-2.128.336-.645.835-1.19 1.466-1.526a2.86 2.86 0 012.066-.257Zm8 0c.697.178 1.294.606 1.737 1.176a1 1 0 01-1.578 1.228c-.21-.27-.444-.413-.654-.467a.86.86 0 00-.632.085c-.222.119-.453.342-.631.684A2.64 2.64 0 0015 12a2.64 2.64 0 00.281 1.205c.177.342.408.565.63.684a.86.86 0 00.632.085c.209-.054.444-.197.654-.467a1 1 0 011.578 1.228c-.443.57-1.04.998-1.737 1.176a2.86 2.86 0 01-2.066-.257c-.631-.336-1.131-.881-1.466-1.526A4.6 4.6 0 0113 12c-.004-.74.17-1.47.506-2.128.336-.645.835-1.19 1.466-1.526a2.86 2.86 0 012.066-.257Z" fill="black" />
    </svg>
  )
}

function FullscreenIcon({ className }: { className?: string }) {
  return <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" className={className}><path d="M10 3H3v7c0 .265.105.52.293.707.187.188.442.293.707.293.265 0 .52-.105.707-.293C4.895 10.52 5 10.265 5 10V6.414l4.293 4.293.076.068c.192.155.435.233.68.22.247-.014.48-.118.654-.292.174-.174.278-.407.291-.653.014-.246-.064-.489-.219-.681l-.068-.076L6.414 5H10c.265 0 .52-.105.707-.293C10.895 4.52 11 4.265 11 4c0-.265-.105-.52-.293-.707C10.52 3.105 10.265 3 10 3Zm10 10c-.265 0-.52.105-.707.293-.188.187-.293.442-.293.707v3.586l-4.293-4.293-.076-.068c-.192-.155-.435-.233-.68-.22-.247.014-.48.118-.654.292-.174.174-.278.407-.291.653-.014.246.064.489.219.681l.068.076L17.586 19H14c-.265 0-.52.105-.707.293-.188.187-.293.442-.293.707 0 .265.105.52.293.707.187.188.442.293.707.293h7v-7c0-.265-.105-.52-.293-.707C20.52 13.105 20.265 13 20 13Z" fill="currentColor" /></svg>
}

function CommentSkeleton() {
  return (
    <div className="flex gap-3 py-3">
      <Skeleton className="h-8 w-8 rounded-full bg-gray-700 flex-shrink-0" />
      <div className="flex-1 min-w-0 space-y-2">
        <div className="flex items-center gap-2"><Skeleton className="h-3 w-24 bg-gray-700 rounded" /><Skeleton className="h-3 w-14 bg-gray-700 rounded" /></div>
        <Skeleton className="h-4 w-full bg-gray-700 rounded" /><Skeleton className="h-4 w-3/4 bg-gray-700 rounded" />
        <div className="flex items-center gap-2 mt-2"><Skeleton className="h-7 w-14 rounded-full bg-gray-700" /><Skeleton className="h-7 w-7 rounded-full bg-gray-700" /><Skeleton className="h-7 w-16 rounded-full bg-gray-700" /></div>
      </div>
    </div>
  )
}

function DescriptionSkeleton() {
  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin">
      <div className="px-4 py-3 space-y-2"><Skeleton className="h-4 w-full bg-gray-700 rounded" /><Skeleton className="h-4 w-3/4 bg-gray-700 rounded" /></div>
      <div className="px-4 pb-3 flex items-center gap-4"><Skeleton className="h-4 w-24 bg-gray-700 rounded" /><Skeleton className="h-4 w-20 bg-gray-700 rounded" /></div>
      <div className="px-4 pb-4 space-y-2"><Skeleton className="h-4 w-full bg-gray-700 rounded" /><Skeleton className="h-4 w-full bg-gray-700 rounded" /><Skeleton className="h-4 w-5/6 bg-gray-700 rounded" /><Skeleton className="h-4 w-2/3 bg-gray-700 rounded" /></div>
      <div className="px-4 pb-4 flex flex-wrap gap-2"><Skeleton className="h-5 w-16 bg-gray-700 rounded" /><Skeleton className="h-5 w-20 bg-gray-700 rounded" /><Skeleton className="h-5 w-14 bg-gray-700 rounded" /><Skeleton className="h-5 w-24 bg-gray-700 rounded" /></div>
    </div>
  )
}

function CommentItem({ comment }: { comment: any }) {
  const [isLiked, setIsLiked] = useState(false)
  const [isDisliked, setIsDisliked] = useState(false)
  return (
    <div className="flex gap-3 py-3">
      <Avatar className="h-8 w-8 flex-shrink-0"><AvatarImage src={comment.avatar} /><AvatarFallback className="bg-gray-700 text-white text-xs">{comment.user.charAt(0)}</AvatarFallback></Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2"><span className="text-[13px] font-medium text-white">@{comment.user.split(' ')[0]}</span><span className="text-xs text-gray-400">{comment.timeAgo}</span></div>
        <p className="text-sm text-gray-200 mt-1">{comment.content}</p>
        <div className="flex items-center gap-2 mt-2">
          <button onClick={() => setIsLiked(!isLiked)} className={`flex items-center gap-1.5 hover:bg-white/10 rounded-full px-3 py-1 transition-colors ${isLiked ? 'text-blue-400' : 'text-gray-400'}`}><ThumbsUp className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} /><span className="text-xs">{comment.likes}</span></button>
          <button onClick={() => setIsDisliked(!isDisliked)} className="hover:bg-white/10 rounded-full p-1.5 transition-colors text-gray-400"><ThumbsDown className="h-4 w-4" /></button>
          <button className="text-xs text-gray-400 hover:bg-white/10 rounded-full px-3 py-1 transition-colors">Reply</button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild><button className="hover:bg-white/10 rounded-full p-1 transition-colors text-gray-400 ml-auto"><MoreVertical className="h-4 w-4" /></button></DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-[#212121] border-gray-700 text-white rounded-xl py-2"><DropdownMenuItem className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-white/10 text-white"><Flag className="h-5 w-5" /><span>Report</span></DropdownMenuItem></DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  )
}

// Share platform icons using simple Lucide-style SVGs
// Replace the sharePlatforms array with this updated version:

const sharePlatforms = [
  { 
    name: "Facebook", 
    color: "#1877F2",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48">
        <linearGradient id="fb1" x1="9.993%" x2="89.993%" y1="0%" y2="100%">
          <stop offset="0%" stopColor="#18B5FE"/>
          <stop offset="100%" stopColor="#1277F2"/>
        </linearGradient>
        <path fill="url(#fb1)" d="M24 4C12.954 4 4 12.954 4 24s8.954 20 20 20 20-8.954 20-20S35.046 4 24 4z"/>
        <path fill="#fff" d="M26.707 36.301V25.5h3.613l.543-4.215h-4.156v-2.699c0-1.227.336-2.054 2.082-2.054h2.227V12.66c-.387-.047-1.707-.16-3.25-.16-3.207 0-5.41 1.957-5.41 5.559v3.102H19v4.215h3.656V36.3h4.051z"/>
      </svg>
    )
  },
  { 
    name: "WhatsApp", 
    color: "#25D366",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48">
        <path fill="#fff" d="M4.9 43.3l2.7-9.8C5.5 30.3 4.5 26.7 4.5 23 4.5 12.3 13.3 3.5 24 3.5S43.5 12.3 43.5 23 34.7 42.5 24 42.5c-3.5 0-6.9-.9-9.9-2.7l-9.2 3.5z"/>
        <path fill="#25D366" d="M24 5c9.9 0 18 8.1 18 18s-8.1 18-18 18c-3.2 0-6.2-.8-8.9-2.4l-1-.6-5.5 2.1 1.5-5.3-.7-1.1C5.7 31.1 5 28.6 5 26 5 16.1 13.1 8 23 8h1v-3z"/>
        <path fill="#fff" d="M35.5 26.8c-.4-.2-2.6-1.3-3-1.4-.4-.2-.7-.3-1 .2-.3.4-1.1 1.4-1.4 1.7-.3.3-.5.3-1 .1-.4-.2-1.9-.7-3.6-2.3-1.3-1.2-2.2-2.7-2.5-3.1-.3-.4 0-.7.2-.9.2-.2.4-.5.7-.8.2-.3.3-.5.5-.8.2-.3.1-.6 0-.8-.1-.2-.9-2.4-1.2-3.3-.3-.9-.7-.8-1-.8-.3 0-.6 0-.9 0-.3 0-.8.1-1.2.6-.4.5-1.6 1.5-1.6 3.7s1.6 4.3 1.8 4.6c.2.3 3.2 4.9 7.7 6.9 1.1.5 1.9.8 2.6 1 1.1.3 2.1.3 2.9.2.9-.1 2.6-1.1 3-2.1.4-1 .4-1.9.3-2.1-.2-.2-.4-.3-.8-.5z"/>
      </svg>
    )
  },
  { 
    name: "X", 
    color: "#000000",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48">
        <path fill="#000" d="M24 4C12.954 4 4 12.954 4 24s8.954 20 20 20 20-8.954 20-20S35.046 4 24 4z"/>
        <path fill="#fff" d="M13 14h7.5l5.6 8 8.9-8h3.5l-10.3 9.3L38 34h-7.5l-6.3-9-9.2 9H11l10.8-9.8L13 14zm5 2.5h3l13 15h-3l-13-15z"/>
      </svg>
    )
  },
  { 
    name: "Email", 
    color: "#EA4335",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48">
        <path fill="#E75A4D" d="M44 36V14L24 28 4 14v22c0 2.2 1.8 4 4 4h32c2.2 0 4-1.8 4-4z"/>
        <path fill="#F5C2B8" d="M24 28L44 14H4l20 14z"/>
        <path fill="#E75A4D" d="M4 14l20 14L44 14H4z"/>
        <path fill="#fff" d="M24 24L4 14h40L24 24z"/>
      </svg>
    )
  },
  { 
    name: "Reddit", 
    color: "#FF4500",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48">
        <circle cx="24" cy="24" r="20" fill="#FF4500"/>
        <ellipse cx="17" cy="24" rx="4.5" ry="5.5" fill="#fff"/>
        <ellipse cx="31" cy="24" rx="4.5" ry="5.5" fill="#fff"/>
        <circle cx="17" cy="24" r="2.5" fill="#FF4500"/>
        <circle cx="31" cy="24" r="2.5" fill="#FF4500"/>
        <path d="M16.5 28.5c1 2.5 3.5 4 7.5 4s6.5-1.5 7.5-4" stroke="#fff" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      </svg>
    )
  },
  { 
    name: "Pinterest", 
    color: "#BD081C",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48">
        <circle cx="24" cy="24" r="20" fill="#BD081C"/>
        <path fill="#fff" d="M24 8c-7.7 0-14 6.3-14 14 0 5.9 3.7 11 8.9 13.1-.1-1-.1-2.3.3-3.4l1.9-7.7s-.5-.9-.5-2.3c0-2.2 1.3-3.8 2.9-3.8 1.4 0 2 1 2 2.2 0 1.4-.9 3.3-1.3 5.2-.4 1.5.8 2.8 2.3 2.8 2.7 0 4.8-3.5 4.8-7.7 0-3.2-2.2-5.6-6.2-5.6-4.2 0-6.8 3.1-6.8 6.6 0 1.2.5 2.5 1 3.3.1.1.1.3.1.5-.1.3-.3 1.2-.3 1.4-.1.3-.2.4-.5.3-2.1-1-3.4-4-3.4-6.5 0-4.8 4.1-10.6 12.2-10.6 6.5 0 10.8 4.7 10.8 9.8 0 6.7-3.7 11.7-9.2 11.7-1.8 0-3.5-1-4.1-2.1l-1.1 4.3c-.4 1.5-1.5 3.4-2.2 4.5 1.4.4 2.9.6 4.5.6 7.7 0 14-6.3 14-14S31.7 8 24 8z"/>
      </svg>
    )
  },
  { 
    name: "LinkedIn", 
    color: "#0077B5",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48">
        <path fill="#0288D1" d="M42 37c0 2.762-2.238 5-5 5H11c-2.761 0-5-2.238-5-5V11c0-2.762 2.239-5 5-5h26c2.762 0 5 2.238 5 5v26z"/>
        <path fill="#fff" d="M12 19h5v17h-5V19zm2.485-2h-.028C12.965 17 12 15.888 12 14.499 12 13.08 12.995 12 14.514 12c1.521 0 2.458 1.08 2.486 2.499C17 15.887 16.035 17 14.485 17zM36 36h-5v-9.099c0-2.198-1.225-3.698-3.192-3.698-1.501 0-2.313 1.012-2.707 1.99-.144.35-.101 1.318-.101 1.807v9h-5V19h5v2.616C25.721 20.5 27.009 19 29.738 19c3.578 0 6.261 2.25 6.261 7.274L36 36z"/>
      </svg>
    )
  },
  { 
    name: "Telegram", 
    color: "#0088cc",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48">
        <circle cx="24" cy="24" r="20" fill="#29B6F6"/>
        <path fill="#fff" d="M32.5 15.5L14.5 23l5.8 2.5 3.5-2.5 7.5-6.5-6 8-3.5 5.5v4.5l4-3 4.5 4.5 2-18.5z"/>
        <path fill="#B0BEC5" d="M20.3 28.5l-1.3 6 3-2.5 5.5 5-2-17-15.5 6 10.3 2.5z"/>
      </svg>
    )
  },
  { 
    name: "Messenger", 
    color: "#0084FF",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48">
        <radialGradient id="msg1" cx="20%" cy="20%" r="70%">
          <stop offset="0%" stopColor="#09F"/>
          <stop offset="100%" stopColor="#006AFF"/>
        </radialGradient>
        <path fill="url(#msg1)" d="M24 4C12.4 4 3 12.5 3 23c0 6 2.8 11.4 7.2 15v6l6.6-3.6c2.2.6 4.6 1 7.2 1 11.6 0 21-8.5 21-19S35.6 4 24 4z"/>
        <path fill="#fff" d="M13.8 27.5l5.4-8.6 5.3 3 8-4.4-5.4 8.6-5.3-3-8 4.4z"/>
      </svg>
    )
  },
]

function ShareModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [copied, setCopied] = useState(false)
  const shareContainerRef = useRef<HTMLDivElement>(null)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(true)

  const videoUrl = typeof window !== 'undefined' ? window.location.href : "https://youtube.com/shorts/example"

  const handleCopy = () => {
    navigator.clipboard.writeText(videoUrl).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const checkScroll = () => {
    const el = shareContainerRef.current
    if (!el) return
    setShowLeftArrow(el.scrollLeft > 10)
    setShowRightArrow(el.scrollLeft < el.scrollWidth - el.clientWidth - 10)
  }

  useEffect(() => {
    const el = shareContainerRef.current
    if (el) {
      el.addEventListener('scroll', checkScroll)
      checkScroll()
      return () => el.removeEventListener('scroll', checkScroll)
    }
  }, [isOpen])

  const scrollShare = (direction: 'left' | 'right') => {
    const el = shareContainerRef.current
    if (!el) return
    el.scrollBy({ left: direction === 'left' ? -250 : 250, behavior: 'smooth' })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-[#212121] rounded-2xl w-[90vw] max-w-[540px] max-h-[85vh] overflow-hidden shadow-2xl animate-fade-in-left">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-700">
          <h2 className="text-white text-lg font-semibold">Share</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-white/10">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="relative px-5 py-5">
          {showLeftArrow && (
            <button onClick={() => scrollShare('left')} className="absolute left-1 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white shadow-lg">
              <ChevronLeft className="h-5 w-5" />
            </button>
          )}
          {showRightArrow && (
            <button onClick={() => scrollShare('right')} className="absolute right-1 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center text-white shadow-lg">
              <ChevronRight className="h-5 w-5" />
            </button>
          )}
          
          <div ref={shareContainerRef} className="flex gap-4 overflow-x-auto scrollbar-none py-2 px-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {sharePlatforms.map((platform) => (
              <button key={platform.name} className="flex flex-col items-center gap-2 flex-shrink-0 w-[72px] group">
                <div className="w-14 h-14 rounded-full overflow-hidden flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                  {platform.icon}
                </div>
                <span className="text-xs text-gray-400 group-hover:text-white text-center leading-tight truncate w-full">{platform.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="px-5 pb-5">
          <div className="flex items-center gap-3 bg-[#121212] rounded-xl p-3 border border-gray-700">
            <input
              type="text"
              value={videoUrl}
              readOnly
              className="flex-1 bg-transparent text-sm text-gray-300 outline-none truncate"
            />
            <button
              onClick={handleCopy}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all ${
                copied ? 'bg-green-600 text-white' : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ShortsPage() {
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)
  const commentInputRef = useRef<HTMLInputElement>(null)
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
  const [activePanel, setActivePanel] = useState<PanelType>(null)
  const [commentText, setCommentText] = useState("")
  const [comments, setComments] = useState<any[]>([])
  const [commentsLoading, setCommentsLoading] = useState(false)
  const [descLoading, setDescLoading] = useState(false)
  const [descExpanded, setDescExpanded] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const centerPlayTimeout = useRef<NodeJS.Timeout | null>(null)
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null)
  const commentsTimerRef = useRef<NodeJS.Timeout | null>(null)
  const descTimerRef = useRef<NodeJS.Timeout | null>(null)
  const switchTimerRef = useRef<NodeJS.Timeout | null>(null)

  const currentShort = shortsData[currentIndex]
  const currentComments = commentsByVideo[currentShort?.id] || []
  const currentDesc = descriptionsByVideo[currentShort?.id]
  const totalCommentsCount = currentComments.length

  useEffect(() => {
    return () => {
      if (commentsTimerRef.current) clearTimeout(commentsTimerRef.current)
      if (descTimerRef.current) clearTimeout(descTimerRef.current)
      if (switchTimerRef.current) clearTimeout(switchTimerRef.current)
    }
  }, [])

  const loadCommentsForCurrentShort = () => {
    setCommentsLoading(true); setComments([])
    if (commentsTimerRef.current) clearTimeout(commentsTimerRef.current)
    commentsTimerRef.current = setTimeout(() => { setComments(currentComments); setCommentsLoading(false) }, 800)
  }

  const loadDescriptionForCurrentShort = () => {
    setDescLoading(true)
    if (descTimerRef.current) clearTimeout(descTimerRef.current)
    descTimerRef.current = setTimeout(() => { setDescLoading(false) }, 500)
  }

  useEffect(() => {
    if (activePanel === "comments") loadCommentsForCurrentShort()
    else if (activePanel === "description") loadDescriptionForCurrentShort()
  }, [currentIndex])

  useEffect(() => {
    const container = containerRef.current; if (!container) return
    const handleScroll = () => {
      setIsScrolling(true)
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current)
      scrollTimeout.current = setTimeout(() => setIsScrolling(false), 400)
      const containerHeight = container.clientHeight
      const index = Math.round(container.scrollTop / containerHeight)
      const newIndex = Math.min(index, shortsData.length - 1)
      if (newIndex !== currentIndex) { setIsTransitioning(true); if (switchTimerRef.current) clearTimeout(switchTimerRef.current); switchTimerRef.current = setTimeout(() => setIsTransitioning(false), 600) }
      setCurrentIndex(newIndex)
    }
    container.addEventListener("scroll", handleScroll, { passive: true })
    return () => { container.removeEventListener("scroll", handleScroll); if (scrollTimeout.current) clearTimeout(scrollTimeout.current) }
  }, [currentIndex])

  const scrollToVideo = (index: number) => {
    const container = containerRef.current; if (!container) return
    const targetIndex = Math.max(0, Math.min(index, shortsData.length - 1))
    if (targetIndex !== currentIndex) { setIsTransitioning(true); if (switchTimerRef.current) clearTimeout(switchTimerRef.current); switchTimerRef.current = setTimeout(() => setIsTransitioning(false), 600) }
    container.scrollTo({ top: targetIndex * container.clientHeight, behavior: "smooth" })
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => { if (activePanel && e.key === "Escape") { setActivePanel(null); return }; if (showShareModal && e.key === "Escape") { setShowShareModal(false); return }; if (activePanel || showShareModal) return; if (e.key === "ArrowDown") { e.preventDefault(); scrollToVideo(currentIndex + 1) }; if (e.key === "ArrowUp") { e.preventDefault(); scrollToVideo(currentIndex - 1) } }
    window.addEventListener("keydown", handleKeyDown); return () => window.removeEventListener("keydown", handleKeyDown)
  }, [currentIndex, activePanel, showShareModal])

  const toggleLike = (id: string) => setIsLiked(prev => ({ ...prev, [id]: !prev[id] }))
  const toggleSubscribe = (id: string) => setSubscribeState(prev => ({ ...prev, [id]: !prev[id] }))
  const toggleFullscreen = () => { if (!document.fullscreenElement) { document.documentElement.requestFullscreen().catch(() => {}); setIsFullscreen(true) } else { document.exitFullscreen().catch(() => {}); setIsFullscreen(false) } }
  const handleTogglePlay = (e: React.MouseEvent) => { e.stopPropagation(); setIsPlaying(!isPlaying); setShowCenterPlayPause(true); if (centerPlayTimeout.current) clearTimeout(centerPlayTimeout.current); centerPlayTimeout.current = setTimeout(() => setShowCenterPlayPause(false), 600) }

  const handleAddComment = () => {
    if (!commentText.trim()) return
    const newComment = { id: `${currentShort.id}c${Date.now()}`, user: "You", avatar: "/placeholder.svg?height=32&width=32", timeAgo: "Just now", content: commentText.trim(), likes: "0", dislikes: "0" }
    setComments(prev => [newComment, ...prev]); setCommentText("")
    if (commentsByVideo[currentShort.id]) commentsByVideo[currentShort.id] = [newComment, ...commentsByVideo[currentShort.id]]
  }

  const handleKeyPress = (e: React.KeyboardEvent) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleAddComment() } }

  const openPanel = (type: PanelType) => { if (activePanel === type) { setActivePanel(null); return }; setActivePanel(type); setDescExpanded(false); if (type === "comments") { loadCommentsForCurrentShort(); setTimeout(() => commentInputRef.current?.focus(), 400) } else if (type === "description") { loadDescriptionForCurrentShort() } }

  const panelTitle = activePanel === "comments" ? "Comments" : activePanel === "description" ? "Description" : ""
  const panelWidth = 380; const panelRight = 96; const iframeShiftRight = panelWidth + 20 + panelRight

  return (
    <div className="min-h-screen bg-black">
      <style>{`
        @keyframes fadeInLeft { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
        @keyframes fadeInRight { from { opacity: 0; transform: translateX(-10px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in-left { animation: fadeInLeft 0.3s ease-out forwards; }
        .animate-slide-up { animation: slideUp 0.3s ease-out forwards; }
        .animate-fade-in-right { animation: fadeInRight 0.4s ease-out forwards; }
        .animate-fade-in-up { animation: fadeInUp 0.4s ease-out forwards; }
        .scrollbar-thin::-webkit-scrollbar { width: 6px; }
        .scrollbar-thin::-webkit-scrollbar-track { background: transparent; }
        .scrollbar-thin::-webkit-scrollbar-thumb { background-color: #4b5563; border-radius: 3px; }
        .scrollbar-none::-webkit-scrollbar { display: none; }
        .scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      <div className="relative z-50"><AppHeader /></div>

      <ShareModal isOpen={showShareModal} onClose={() => setShowShareModal(false)} />

      <div className="hidden md:flex fixed right-6 top-1/2 -translate-y-1/2 z-50 flex-col gap-1 bg-white/10 backdrop-blur-sm rounded-full p-1.5">
        <button onClick={() => scrollToVideo(currentIndex - 1)} disabled={currentIndex === 0} className="w-10 h-10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"><ChevronUp className="h-6 w-6" /></button>
        <button onClick={() => scrollToVideo(currentIndex + 1)} disabled={currentIndex === shortsData.length - 1} className="w-10 h-10 rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"><ChevronDown className="h-6 w-6" /></button>
      </div>

      {activePanel && (
        <div className="hidden md:flex fixed top-[56px] bottom-0 z-40 items-center" style={{ right: `${panelRight}px` }}>
          <div className="w-[380px] h-[85vh] bg-[#212121] rounded-2xl overflow-hidden flex flex-col shadow-2xl animate-fade-in-left">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-700 flex-shrink-0"><div className="flex items-center gap-2"><h3 className="text-white font-semibold">{panelTitle}</h3>{activePanel === "comments" && <span className="text-gray-400 text-sm">{totalCommentsCount}</span>}</div><button onClick={() => setActivePanel(null)} className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-white/10"><X className="h-5 w-5" /></button></div>
            {activePanel === "comments" && (<><div className="flex-1 overflow-y-auto px-4 scrollbar-thin">{commentsLoading ? <><CommentSkeleton /><CommentSkeleton /><CommentSkeleton /><CommentSkeleton /><CommentSkeleton /></> : comments.length > 0 ? comments.map((c) => <CommentItem key={c.id} comment={c} />) : <div className="flex items-center justify-center h-full"><p className="text-gray-400 text-sm">No comments yet</p></div>}</div><div className="border-t border-gray-700 px-4 py-3 flex-shrink-0"><div className="flex items-center gap-3"><Avatar className="h-8 w-8 flex-shrink-0"><AvatarFallback className="bg-gray-700 text-white text-xs">Y</AvatarFallback></Avatar><div className="flex-1 flex items-center gap-2"><input ref={commentInputRef} type="text" placeholder="Add a comment..." value={commentText} onChange={(e) => setCommentText(e.target.value)} onKeyDown={handleKeyPress} className="flex-1 bg-transparent border-b border-gray-600 pb-1 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-colors" /><button onClick={handleAddComment} disabled={!commentText.trim()} className="text-blue-400 hover:text-blue-300 disabled:opacity-30 disabled:cursor-not-allowed p-1"><Send className="h-5 w-5" /></button></div></div></div></>)}
            {activePanel === "description" && (<>{descLoading ? <DescriptionSkeleton /> : currentDesc ? <div className="flex-1 overflow-y-auto scrollbar-thin"><div className="px-4 py-3"><h4 className="text-white text-sm font-medium leading-relaxed">{currentDesc.title}</h4></div><div className="px-4 pb-3 flex items-center gap-4"><div className="flex items-center gap-1.5 text-gray-400 text-xs"><Eye className="h-4 w-4" /><span>{currentDesc.views} views</span></div><div className="flex items-center gap-1.5 text-gray-400 text-xs"><Clock className="h-4 w-4" /><span>{currentDesc.timeAgo}</span></div></div><div className="px-4 pb-4"><div className={`text-sm text-gray-200 whitespace-pre-wrap leading-relaxed ${!descExpanded ? 'line-clamp-4' : ''}`}>{currentDesc.description}</div>{currentDesc.description.length > 200 && <button onClick={() => setDescExpanded(!descExpanded)} className="text-gray-400 hover:text-white text-xs mt-1 font-medium">{descExpanded ? 'Show less' : '...more'}</button>}</div><div className="px-4 pb-4 flex flex-wrap gap-2">{currentDesc.hashtags.map((tag: string) => <span key={tag} className="text-blue-400 text-xs hover:text-blue-300 cursor-pointer">{tag}</span>)}</div></div> : <div className="flex items-center justify-center h-full"><p className="text-gray-400 text-sm">No description available</p></div>}</>)}
          </div>
        </div>
      )}

      {activePanel && (
        <div className="md:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/60" onClick={() => setActivePanel(null)} />
          <div className="absolute bottom-0 left-0 right-0 bg-[#212121] rounded-t-2xl max-h-[70vh] flex flex-col animate-slide-up">
            <div className="w-10 h-1 bg-white/30 rounded-full mx-auto mt-3 mb-2 flex-shrink-0" />
            <div className="flex items-center justify-between px-4 py-2 border-b border-gray-700 flex-shrink-0"><div className="flex items-center gap-2"><h3 className="text-white font-semibold">{panelTitle}</h3>{activePanel === "comments" && <span className="text-gray-400 text-sm">{totalCommentsCount}</span>}</div><button onClick={() => setActivePanel(null)} className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-white/10"><X className="h-5 w-5" /></button></div>
            {activePanel === "comments" && (<><div className="flex-1 overflow-y-auto px-4 scrollbar-thin">{commentsLoading ? <><CommentSkeleton /><CommentSkeleton /><CommentSkeleton /></> : comments.length > 0 ? comments.map((c) => <CommentItem key={c.id} comment={c} />) : <div className="flex items-center justify-center h-32"><p className="text-gray-400 text-sm">No comments yet</p></div>}</div><div className="border-t border-gray-700 px-4 py-3 flex-shrink-0"><div className="flex items-center gap-3"><Avatar className="h-8 w-8 flex-shrink-0"><AvatarFallback className="bg-gray-700 text-white text-xs">Y</AvatarFallback></Avatar><div className="flex-1 flex items-center gap-2"><input type="text" placeholder="Add a comment..." value={commentText} onChange={(e) => setCommentText(e.target.value)} onKeyDown={handleKeyPress} className="flex-1 bg-transparent border-b border-gray-600 pb-1 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-colors" /><button onClick={handleAddComment} disabled={!commentText.trim()} className="text-blue-400 hover:text-blue-300 disabled:opacity-30 disabled:cursor-not-allowed p-1"><Send className="h-5 w-5" /></button></div></div></div></>)}
            {activePanel === "description" && (<>{descLoading ? <DescriptionSkeleton /> : currentDesc ? <div className="flex-1 overflow-y-auto scrollbar-thin"><div className="px-4 py-3"><h4 className="text-white text-sm font-medium leading-relaxed">{currentDesc.title}</h4></div><div className="px-4 pb-3 flex items-center gap-4"><div className="flex items-center gap-1.5 text-gray-400 text-xs"><Eye className="h-4 w-4" /><span>{currentDesc.views} views</span></div><div className="flex items-center gap-1.5 text-gray-400 text-xs"><Clock className="h-4 w-4" /><span>{currentDesc.timeAgo}</span></div></div><div className="px-4 pb-4"><div className={`text-sm text-gray-200 whitespace-pre-wrap leading-relaxed ${!descExpanded ? 'line-clamp-4' : ''}`}>{currentDesc.description}</div>{currentDesc.description.length > 200 && <button onClick={() => setDescExpanded(!descExpanded)} className="text-gray-400 hover:text-white text-xs mt-1 font-medium">{descExpanded ? 'Show less' : '...more'}</button>}</div><div className="px-4 pb-4 flex flex-wrap gap-2">{currentDesc.hashtags.map((tag: string) => <span key={tag} className="text-blue-400 text-xs hover:text-blue-300 cursor-pointer">{tag}</span>)}</div></div> : <div className="flex items-center justify-center h-32"><p className="text-gray-400 text-sm">No description available</p></div>}</>)}
          </div>
        </div>
      )}

      <div ref={containerRef} className="fixed inset-0 top-[56px] overflow-y-auto snap-y snap-mandatory scrollbar-none transition-all duration-300 ease-in-out" style={{ scrollSnapType: "y mandatory", right: typeof window !== 'undefined' && window.innerWidth >= 768 && activePanel ? `${iframeShiftRight}px` : "0px" }}>
        {shortsData.map((short, index) => {
          const isActive = index === currentIndex
          const isHovered = hoveredVideoId === short.id
          return (
            <section key={short.id} className="relative h-[calc(100vh-56px)] w-full snap-start snap-always flex items-center justify-center bg-black">
              <div className="relative w-full h-full md:w-[400px] md:h-[85vh] md:rounded-2xl overflow-hidden mx-auto" onMouseEnter={() => setHoveredVideoId(short.id)} onMouseLeave={() => { setHoveredVideoId(null); setShowVolumeSlider(false); setShowMoreMenu(false) }}>
                <div className="w-full h-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center cursor-pointer" onClick={handleTogglePlay}><div className="text-center text-white/20"><svg width="80" height="80" viewBox="0 0 24 24" fill="currentColor" className="mx-auto mb-4 opacity-30"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/></svg><p className="text-sm opacity-40">Short Video</p></div></div>
                <div className={`absolute inset-0 flex items-center justify-center z-25 pointer-events-none transition-opacity duration-200 ${showCenterPlayPause ? "opacity-100" : "opacity-0"}`}><div className="w-16 h-16 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center">{isPlaying ? <Pause className="h-8 w-8 text-white fill-white" /> : <Play className="h-8 w-8 text-white fill-white ml-1" />}</div></div>
                <div className="absolute bottom-0 left-0 right-0 h-[40%] bg-gradient-to-t from-black/90 via-black/50 to-transparent pointer-events-none" />
                <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/60 via-black/20 to-transparent pointer-events-none" />
                
                <div className={`absolute top-0 left-0 right-0 z-30 px-4 pt-4 pb-16 transition-opacity duration-200 ${isHovered && !isScrolling && !isTransitioning ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button onClick={handleTogglePlay} className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors">{isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}</button>
                      <div className="relative flex items-center" onMouseEnter={() => setShowVolumeSlider(true)} onMouseLeave={() => setShowVolumeSlider(false)}>
                        <button onClick={() => setIsMuted(!isMuted)} className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors">{isMuted || volume === 0 ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}</button>
                        {showVolumeSlider && <div className="hidden md:flex items-center bg-black/60 backdrop-blur-sm rounded-full px-3 py-2 ml-1"><input type="range" min="0" max="100" value={isMuted ? 0 : volume} onChange={(e) => { setVolume(Number(e.target.value)); setIsMuted(false) }} className="w-20 h-1 accent-white cursor-pointer" /></div>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setCaptionsEnabled(!captionsEnabled)} className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors" title={captionsEnabled ? "Subtitles/CC turned on" : "Subtitles/CC turned off"} aria-label={captionsEnabled ? "Subtitles/CC turned on" : "Subtitles/CC turned off"} aria-pressed={captionsEnabled}>
                        {captionsEnabled ? <CCIconOn className="h-5 w-5" /> : <CCIconOff className="h-5 w-5 text-white" />}
                      </button>
                      <button onClick={toggleFullscreen} className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors"><FullscreenIcon className="h-5 w-5" /></button>
                      <div className="relative">
                        <button onClick={() => setShowMoreMenu(!showMoreMenu)} className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center text-white hover:bg-white/20 transition-colors"><MoreIcon className="h-5 w-5" /></button>
                        {showMoreMenu && (<><div className="fixed inset-0 z-40 md:hidden" onClick={() => setShowMoreMenu(false)} /><div className="fixed bottom-0 left-0 right-0 z-50 bg-[#212121] rounded-t-2xl py-2 shadow-2xl md:absolute md:top-full md:bottom-auto md:left-auto md:right-0 md:mt-2 md:rounded-xl md:w-[280px]"><div className="w-10 h-1 bg-white/30 rounded-full mx-auto my-3 md:hidden" /><button className="w-full flex items-center gap-4 px-4 py-3 text-white text-sm hover:bg-white/10 transition-colors" onClick={() => { openPanel("description"); setShowMoreMenu(false) }}><List className="h-5 w-5" /> Description</button><button className="w-full flex items-center gap-4 px-4 py-3 text-white text-sm hover:bg-white/10 transition-colors" onClick={() => setShowMoreMenu(false)}><Bookmark className="h-5 w-5" /> Save to playlist</button><button className="w-full flex items-center justify-between px-4 py-3 text-white text-sm hover:bg-white/10 transition-colors" onClick={() => { setCaptionsEnabled(!captionsEnabled); setShowMoreMenu(false) }}><div className="flex items-center gap-4">{captionsEnabled ? <CCIconOn className="h-5 w-5" /> : <CCIconOff className="h-5 w-5 text-white" />} Captions</div><span className="text-white/60 text-xs">{captionsEnabled ? "On" : "Off"}</span></button><button className="w-full flex items-center gap-4 px-4 py-3 text-white text-sm hover:bg-white/10 transition-colors" onClick={() => setShowMoreMenu(false)}><Ban className="h-5 w-5" /> Don't recommend this channel</button><button className="w-full flex items-center gap-4 px-4 py-3 text-white text-sm hover:bg-white/10 transition-colors" onClick={() => setShowMoreMenu(false)}><Flag className="h-5 w-5" /> Report</button><button className="w-full flex items-center gap-4 px-4 py-3 text-white text-sm hover:bg-white/10 transition-colors" onClick={() => setShowMoreMenu(false)}><MessageSquare className="h-5 w-5" /> Send feedback</button><div className="h-4 md:hidden" /></div></>)}
                      </div>
                    </div>
                  </div>
                </div>

                <div className={`absolute bottom-6 left-4 right-20 z-20 transition-all duration-500 ${isActive && !isScrolling && !isTransitioning ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`}>
                  <div className="flex items-center gap-3 mb-3"><Avatar className="h-10 w-10 border-2 border-white/20 flex-shrink-0"><AvatarImage src={short.channelAvatar} /><AvatarFallback className="bg-gray-700 text-white text-xs">{short.channel.charAt(0)}</AvatarFallback></Avatar><span className="text-white font-semibold text-sm truncate">{short.channel}</span><Button size="sm" className={`rounded-full h-8 text-xs px-4 flex-shrink-0 ${subscribeState[short.id] ? "bg-white/10 text-white hover:bg-white/20 border border-white/20" : "bg-white text-black hover:bg-gray-200"}`} onClick={() => toggleSubscribe(short.id)}>{subscribeState[short.id] ? "Subscribed" : "Subscribe"}</Button></div>
                  <button onClick={() => openPanel("description")} className="text-left w-full"><p className="text-white/90 text-sm leading-relaxed line-clamp-2 hover:text-white transition-colors">{short.title}</p></button>
                </div>
                <div className={`absolute right-3 bottom-28 flex flex-col gap-6 items-center z-20 transition-all duration-500 ${isActive && !isScrolling && !isTransitioning ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4 pointer-events-none"}`}>
                  <button onClick={() => toggleLike(short.id)} className="flex flex-col items-center gap-1 group"><div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isLiked[short.id] ? "bg-white/20 scale-110" : "bg-white/10"} group-hover:bg-white/20 group-active:scale-95`}><Heart className={`h-6 w-6 ${isLiked[short.id] ? "text-red-500 fill-red-500" : "text-white"}`} /></div><span className="text-white text-xs font-medium">{short.likes}</span></button>
                  <button onClick={() => openPanel("comments")} className="flex flex-col items-center gap-1 group"><div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-all group-active:scale-95"><MessageCircle className="h-6 w-6 text-white" /></div><span className="text-white text-xs font-medium">{short.comments}</span></button>
                  <button onClick={() => setShowShareModal(true)} className="flex flex-col items-center gap-1 group"><div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-all group-active:scale-95"><Share2 className="h-6 w-6 text-white" /></div><span className="text-white text-xs font-medium">Share</span></button>
                  <button className="flex flex-col items-center gap-1 group"><div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-all group-active:scale-95"><Bookmark className="h-6 w-6 text-white" /></div><span className="text-white text-xs font-medium">Save</span></button>
                  <button className="flex flex-col items-center gap-1 group"><div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-all group-active:scale-95"><Flag className="h-6 w-6 text-white" /></div><span className="text-white text-xs font-medium">Report</span></button>
                </div>
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}