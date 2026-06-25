// app/shorts/page.tsx
"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import {
  ChevronUp, ChevronDown, Heart, MessageCircle, Share2, Bookmark, Flag,
  Volume2, VolumeX, Pause, Play, List, Ban, MessageSquare, X,
  ThumbsUp, ThumbsDown, MoreVertical, Send, Eye, Clock, Copy, Check,
  ChevronLeft, ChevronRight,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { ReportDialog } from "@/components/report-dialog"
import { toast } from "sonner"

// ============ SHORTS DATA ============
const shortsData = [
  {
    id: "s1",
    videoId: "MBxDbbkk0gQ",
    title: "একমাত্র আল্লাহর রাজত্বই চিরস্থায়ী",
    channel: "Dr. Mohammad Monzur-E-Elahi",
    channelId: "monzur",
    channelAvatar: "https://yt3.googleusercontent.com/ytc/AIdro_lLp3SxQeehJxSmd_QCmSxpFBj4k-7X-brif7v9Jz0rBg=s160-c-k-c0x00ffffff-no-rj",
    thumbnail: "https://img.youtube.com/vi/MBxDbbkk0gQ/hqdefault.jpg",
    likes: "15K",
    comments: "1.2K",
    isSubscribed: false,
    description: `প্রফেসর ড. মোহাম্মদ মানজুরে ইলাহী
পিএইচডি, শারী'আহ অনুষদ, মদীনা ইসলামী বিশ্ববিদ্যালয়

অফিসিয়াল ইউটিউব চ্যানেল : https://www.youtube.com/@DrMohammadMonzurEElahi
অফিসিয়াল ওয়েবসাইট লিংক : https://www.monzureelahi.com/
অফিসিয়াল ফেসবুক পেইজ লিংক : https://www.facebook.com/drmonzureelahiofficial
অফিসিয়াল টেলিগ্রাম চ্যানেল লিংক : https://t.me/monzureelahi
গুরুত্বপূর্ণ আলোচনার অডিওসমূহ : https://drive.google.com/drive/u/8/folders/1MpmM1kponF81E8giNkkDPehprqk_Eflu
হোয়াটসঅ্যাপ চ্যানেল : https://whatsapp.com/channel/0029Vafrb5Q6rsQkw6IVV510

অর্গানাইজেশনসমূহ :
ইমাম বুখারী ট্রাস্ট : https://www.facebook.com/imambukharitrustbd
তাইবাহ একাডেমি : https://taibahacademy.com/
কুল্লিয়াতুল কুরআন : https://www.facebook.com/kulliyatulquran
তাইবাহ পাবলিসার্স : https://www.facebook.com/taibahpublishers`,
    views: "15,234",
    timeAgo: "2 weeks ago",
    hashtags: ["#monzureelahi", "#allah", "#islamicreminder"]
  },
  {
    id: "s2",
    videoId: "goHfO28fE-A",
    title: "যারা বলে আমাদের রব আল্লাহ",
    channel: "Dr. Mohammad Monzur-E-Elahi",
    channelId: "monzur",
    channelAvatar: "https://yt3.googleusercontent.com/ytc/AIdro_lLp3SxQeehJxSmd_QCmSxpFBj4k-7X-brif7v9Jz0rBg=s160-c-k-c0x00ffffff-no-rj",
    thumbnail: "https://img.youtube.com/vi/goHfO28fE-A/hqdefault.jpg",
    likes: "25K",
    comments: "2.1K",
    isSubscribed: true,
    description: `প্রফেসর ড. মোহাম্মদ মানজুরে ইলাহী
পিএইচডি, শারী'আহ অনুষদ, মদীনা ইসলামী বিশ্ববিদ্যালয়

অফিসিয়াল ইউটিউব চ্যানেল : https://www.youtube.com/@DrMohammadMonzurEElahi
অফিসিয়াল ওয়েবসাইট লিংক : https://www.monzureelahi.com/
অফিসিয়াল ফেসবুক পেইজ লিংক : https://www.facebook.com/drmonzureelahiofficial
অফিসিয়াল টেলিগ্রাম চ্যানেল লিংক : https://t.me/monzureelahi
গুরুত্বপূর্ণ আলোচনার অডিওসমূহ : https://drive.google.com/drive/u/8/folders/1MpmM1kponF81E8giNkkDPehprqk_Eflu
হোয়াটসঅ্যাপ চ্যানেল : https://whatsapp.com/channel/0029Vafrb5Q6rsQkw6IVV510

অর্গানাইজেশনসমূহ :
ইমাম বুখারী ট্রাস্ট : https://www.facebook.com/imambukharitrustbd
তাইবাহ একাডেমি : https://taibahacademy.com/
কুল্লিয়াতুল কুরআন : https://www.facebook.com/kulliyatulquran
তাইবাহ পাবলিসার্স : https://www.facebook.com/taibahpublishers`,
    views: "25,890",
    timeAgo: "3 days ago",
    hashtags: ["#monzureelahi", "#allah", "#islamiclecture"]
  },
  {
    id: "s3",
    videoId: "8YfQCDjlQsc",
    title: "ইমামের দূর্ব্যবহারের কারণে কেউ ওই মাসজিদে না গেলে কি অন্যায় হবে?",
    channel: "Dr. Mohammad Monzur-E-Elahi",
    channelId: "monzur",
    channelAvatar: "https://yt3.googleusercontent.com/ytc/AIdro_lLp3SxQeehJxSmd_QCmSxpFBj4k-7X-brif7v9Jz0rBg=s160-c-k-c0x00ffffff-no-rj",
    thumbnail: "https://img.youtube.com/vi/8YfQCDjlQsc/hqdefault.jpg",
    likes: "50K",
    comments: "3.5K",
    isSubscribed: false,
    description: "Dr. Mohammad Monzur-E-Elahi",
    views: "50,123",
    timeAgo: "1 week ago",
    hashtags: ["#monzureelahi", "#masjid", "#islamicqa"]
  },
  {
    id: "s4",
    videoId: "o38RKuY_AUU",
    title: "সিদ্দীকে আকবার রা.-এর দৃষ্টিতে প্রিয় নবী সা.",
    channel: "Dr. Mohammad Monzur-E-Elahi",
    channelId: "monzur",
    channelAvatar: "https://yt3.googleusercontent.com/ytc/AIdro_lLp3SxQeehJxSmd_QCmSxpFBj4k-7X-brif7v9Jz0rBg=s160-c-k-c0x00ffffff-no-rj",
    thumbnail: "https://img.youtube.com/vi/o38RKuY_AUU/hqdefault.jpg",
    likes: "18K",
    comments: "950",
    isSubscribed: false,
    description: "Dr. Mohammad Monzur-E-Elahi",
    views: "18,456",
    timeAgo: "5 days ago",
    hashtags: ["#monzureelahi", "#seerah", "#prophetmuhammad"]
  },
  {
    id: "s5",
    videoId: "oEWnPbRvOrY",
    title: "আল্লাহর পক্ষ থেকে তাওফীক প্রাপ্তি",
    channel: "Dr. Mohammad Monzur-E-Elahi",
    channelId: "monzur",
    channelAvatar: "https://yt3.googleusercontent.com/ytc/AIdro_lLp3SxQeehJxSmd_QCmSxpFBj4k-7X-brif7v9Jz0rBg=s160-c-k-c0x00ffffff-no-rj",
    thumbnail: "https://img.youtube.com/vi/oEWnPbRvOrY/hqdefault.jpg",
    likes: "22K",
    comments: "1.1K",
    isSubscribed: false,
    description: "Dr. Mohammad Monzur-E-Elahi",
    views: "22,789",
    timeAgo: "3 weeks ago",
    hashtags: ["#monzureelahi", "#tawfiq", "#islamicreminder"]
  },
  {
    id: "s6",
    videoId: "PUwTf64igQk",
    title: "এভাবে ঈমান নষ্ট করছেন নাতো?",
    channel: "Dr. Khandaker Abdullah Jahangir Rh.",
    channelId: "abdullah",
    channelAvatar: "https://yt3.googleusercontent.com/stJnVilfKhMtBiIq_hXTu-9DnanUT0GNtmsRePmQvLAi6c7bhXoIIHGlYL0HqUrdEjrL0KFs7Q=s160-c-k-c0x00ffffff-no-rj",
    thumbnail: "https://img.youtube.com/vi/PUwTf64igQk/hqdefault.jpg",
    likes: "35K",
    comments: "2.8K",
    isSubscribed: true,
    description: `SunnahTrust
আস-সুন্নাহ ট্রাস্ট
Assunnah trust
Dr. Khandaker Abdullah Jahangir Rh Official`,
    views: "35,678",
    timeAgo: "4 days ago",
    hashtags: ["#abdullahjahangir", "#iman", "#islamicreminder"]
  },
  {
    id: "s7",
    videoId: "hHpoYE-v6og",
    title: "রোগ-ব্যাধিতে ধৈর্য ধারণ করা",
    channel: "Dr. Khandaker Abdullah Jahangir Rh.",
    channelId: "abdullah",
    channelAvatar: "https://yt3.googleusercontent.com/stJnVilfKhMtBiIq_hXTu-9DnanUT0GNtmsRePmQvLAi6c7bhXoIIHGlYL0HqUrdEjrL0KFs7Q=s160-c-k-c0x00ffffff-no-rj",
    thumbnail: "https://img.youtube.com/vi/hHpoYE-v6og/hqdefault.jpg",
    likes: "28K",
    comments: "1.9K",
    isSubscribed: false,
    description: `SunnahTrust
আস-সুন্নাহ ট্রাস্ট
Assunnah trust
Dr. Khandaker Abdullah Jahangir Rh Official

ভিডিও লিংক: https://youtube.com/shorts/hHpoYE-v6og`,
    views: "28,901",
    timeAgo: "1 week ago",
    hashtags: ["#abdullahjahangir", "#sabr", "#patience"]
  },
  {
    id: "s8",
    videoId: "Kk1_-T-8MFU",
    title: "মহান আল্লাহ'র কাছে চাওয়ার নিয়ম",
    channel: "Dr. Khandaker Abdullah Jahangir Rh.",
    channelId: "abdullah",
    channelAvatar: "https://yt3.googleusercontent.com/stJnVilfKhMtBiIq_hXTu-9DnanUT0GNtmsRePmQvLAi6c7bhXoIIHGlYL0HqUrdEjrL0KFs7Q=s160-c-k-c0x00ffffff-no-rj",
    thumbnail: "https://img.youtube.com/vi/Kk1_-T-8MFU/hqdefault.jpg",
    likes: "42K",
    comments: "3.2K",
    isSubscribed: false,
    description: "ড.খন্দকার আব্দুল্লাহ জাহাঙ্গীর (রঃ)",
    views: "42,345",
    timeAgo: "2 weeks ago",
    hashtags: ["#abdullahjahangir", "#dua", "#islamicdua"]
  }
]

// ============ COMMENTS DATA ============
const initialCommentsByVideo: Record<string, any[]> = {
  s1: [
    { id: "s1c1", user: "Ahmad Khan", avatar: "/placeholder.svg?height=32&width=32", timeAgo: "2 hours ago", content: "MashaAllah, beautiful reminder! May Allah bless you.", likes: 245, dislikes: 12, replies: [] },
    { id: "s1c2", user: "Fatima Hassan", avatar: "/placeholder.svg?height=32&width=32", timeAgo: "5 hours ago", content: "SubhanAllah! This is so true.", likes: 567, dislikes: 23, replies: [] },
    { id: "s1c3", user: "Omar Farooq", avatar: "/placeholder.svg?height=32&width=32", timeAgo: "1 day ago", content: "JazakAllah khair! Very important reminder.", likes: 189, dislikes: 8, replies: [] },
  ],
  s2: [
    { id: "s2c1", user: "Yusuf Ahmed", avatar: "/placeholder.svg?height=32&width=32", timeAgo: "1 hour ago", content: "Allahu Akbar! Beautiful reminder.", likes: 456, dislikes: 8, replies: [] },
    { id: "s2c2", user: "Zainab Hassan", avatar: "/placeholder.svg?height=32&width=32", timeAgo: "3 hours ago", content: "JazakAllah khair. I really needed this today.", likes: 234, dislikes: 5, replies: [] },
  ],
  s3: [
    { id: "s3c1", user: "Hamza Yusuf", avatar: "/placeholder.svg?height=32&width=32", timeAgo: "30 minutes ago", content: "Very important ruling. May Allah guide us all.", likes: 567, dislikes: 3, replies: [] },
    { id: "s3c2", user: "Noor Fatima", avatar: "/placeholder.svg?height=32&width=32", timeAgo: "2 hours ago", content: "MashaAllah, clear explanation.", likes: 432, dislikes: 6, replies: [] },
  ],
  s4: [
    { id: "s4c1", user: "Abdullah Rahman", avatar: "/placeholder.svg?height=32&width=32", timeAgo: "1 day ago", content: "Beautiful seerah reminder. May Allah bless our Prophet.", likes: 312, dislikes: 4, replies: [] },
  ],
  s5: [
    { id: "s5c1", user: "Khadija Omar", avatar: "/placeholder.svg?height=32&width=32", timeAgo: "3 days ago", content: "MashaAllah, this is so beneficial. May Allah give us tawfiq.", likes: 278, dislikes: 2, replies: [] },
  ],
  s6: [
    { id: "s6c1", user: "Ibrahim Malik", avatar: "/placeholder.svg?height=32&width=32", timeAgo: "2 hours ago", content: "SubhanAllah, such a powerful reminder about faith.", likes: 523, dislikes: 7, replies: [] },
    { id: "s6c2", user: "Aisha Begum", avatar: "/placeholder.svg?height=32&width=32", timeAgo: "5 hours ago", content: "May Allah protect our faith. JazakAllah khair.", likes: 345, dislikes: 3, replies: [] },
  ],
  s7: [
    { id: "s7c1", user: "Mohammed Ali", avatar: "/placeholder.svg?height=32&width=32", timeAgo: "1 day ago", content: "SubhanAllah, patience is the key. May Allah grant us sabr.", likes: 456, dislikes: 5, replies: [] },
  ],
  s8: [
    { id: "s8c1", user: "Yasmin Khan", avatar: "/placeholder.svg?height=32&width=32", timeAgo: "3 hours ago", content: "Beautiful reminder about dua. May Allah accept our prayers.", likes: 678, dislikes: 9, replies: [] },
    { id: "s8c2", user: "Bilal Ahmed", avatar: "/placeholder.svg?height=32&width=32", timeAgo: "6 hours ago", content: "JazakAllah khair for this important reminder.", likes: 234, dislikes: 2, replies: [] },
  ],
}

const STORAGE_COMMENTS = 'shorts_comments'
const STORAGE_LIKED = 'shorts_liked_ids'
const STORAGE_DISLIKED = 'shorts_disliked_ids'

function loadComments(): Record<string, any[]> {
  if (typeof window === 'undefined') return JSON.parse(JSON.stringify(initialCommentsByVideo))
  try {
    const raw = localStorage.getItem(STORAGE_COMMENTS)
    if (raw) { const parsed = JSON.parse(raw); if (Object.keys(parsed).length > 0) return parsed }
  } catch {}
  const def = JSON.parse(JSON.stringify(initialCommentsByVideo))
  localStorage.setItem(STORAGE_COMMENTS, JSON.stringify(def))
  return def
}

function saveComments(data: Record<string, any[]>) {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_COMMENTS, JSON.stringify(data))
}

function loadIds(key: string): string[] {
  if (typeof window === 'undefined') return []
  try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) : [] } catch { return [] }
}

function saveIds(key: string, ids: string[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem(key, JSON.stringify(ids))
}

let commentsByVideo = loadComments()

// ============ ICON COMPONENTS ============

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
  return (
    <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24" className={className}>
      <path d="M10 3H3v7c0 .265.105.52.293.707.187.188.442.293.707.293.265 0 .52-.105.707-.293C4.895 10.52 5 10.265 5 10V6.414l4.293 4.293.076.068c.192.155.435.233.68.22.247-.014.48-.118.654-.292.174-.174.278-.407.291-.653.014-.246-.064-.489-.219-.681l-.068-.076L6.414 5H10c.265 0 .52-.105.707-.293C10.895 4.52 11 4.265 11 4c0-.265-.105-.52-.293-.707C10.52 3.105 10.265 3 10 3Zm10 10c-.265 0-.52.105-.707.293-.188.187-.293.442-.293.707v3.586l-4.293-4.293-.076-.068c-.192-.155-.435-.233-.68-.22-.247.014-.48.118-.654.292-.174.174-.278.407-.291.653-.014.246.064.489.219.681l.068.076L17.586 19H14c-.265 0-.52.105-.707.293-.188.187-.293.442-.293.707 0 .265.105.52.293.707.187.188.442.293.707.293h7v-7c0-.265-.105-.52-.293-.707C20.52 13.105 20.265 13 20 13Z" fill="currentColor" />
    </svg>
  )
}

// ============ SKELETONS ============

function CommentSkeleton() {
  return (
    <div className="flex gap-3 py-3">
      <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
      <div className="flex-1 min-w-0 space-y-2">
        <div className="flex items-center gap-2">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-14" />
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

function DescriptionSkeleton() {
  return (
    <div className="flex-1 overflow-y-auto scrollbar-thin">
      <div className="px-4 py-3 space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
      <div className="px-4 pb-3 flex items-center gap-4">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-20" />
      </div>
      <div className="px-4 pb-4 space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-2/3" />
      </div>
      <div className="px-4 pb-4 flex flex-wrap gap-2">
        <Skeleton className="h-5 w-16 rounded-full" />
        <Skeleton className="h-5 w-20 rounded-full" />
        <Skeleton className="h-5 w-14 rounded-full" />
        <Skeleton className="h-5 w-24 rounded-full" />
      </div>
    </div>
  )
}

// ============ REPLY ITEM ============

function ReplyItem({ reply, onLike, onDislike, onReplyNested }: {
  reply: any
  onLike: (commentId: string, replyId: string) => void
  onDislike: (commentId: string, replyId: string) => void
  onReplyNested: (commentId: string, replyId: string, text: string) => void
}) {
  const [showReplyInput, setShowReplyInput] = useState(false)
  const [replyText, setReplyText] = useState("")
  const isLiked = reply._isLiked || false
  const isDisliked = reply._isDisliked || false

  const handleReplySubmit = () => {
    if (!replyText.trim()) return
    onReplyNested(reply.parentId || '', reply.id, replyText.trim())
    setReplyText(""); setShowReplyInput(false)
  }

  const formatCount = (n: number) => n > 999 ? `${(n/1000).toFixed(1)}K` : String(n)

  return (
    <div className="ml-10 mt-2">
      <div className="flex gap-2.5">
        <Avatar className="h-7 w-7 flex-shrink-0"><AvatarImage src={reply.avatar} /><AvatarFallback className="bg-muted text-foreground text-[10px]">{reply.user.charAt(0)}</AvatarFallback></Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-foreground">@{reply.user.split(' ')[0]}</span>
            <span className="text-[10px] text-muted-foreground">{reply.timeAgo}</span>
          </div>
          <p className="text-sm text-foreground mt-0.5">{reply.content}</p>
          <div className="flex items-center gap-2 mt-1.5">
            <button onClick={() => onLike(reply.parentId || '', reply.id)} className={cn("flex items-center gap-1.5 hover:bg-muted rounded-full px-2.5 py-1 transition-colors", isLiked ? "text-primary" : "text-muted-foreground")}>
              <ThumbsUp className={cn("h-4 w-4", isLiked && "fill-current")} />
              <span className="text-xs">{formatCount(reply.likes)}</span>
            </button>
            <button onClick={() => onDislike(reply.parentId || '', reply.id)} className={cn("hover:bg-muted rounded-full p-1 transition-colors", isDisliked ? "text-destructive" : "text-muted-foreground")}>
              <ThumbsDown className={cn("h-4 w-4", isDisliked && "fill-current")} />
            </button>
            <button onClick={() => setShowReplyInput(!showReplyInput)} className="text-xs text-muted-foreground hover:bg-muted rounded-full px-2.5 py-1 transition-colors">Reply</button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="hover:bg-muted rounded-full p-1 transition-colors text-muted-foreground ml-auto">
                  <MoreVertical className="h-3.5 w-3.5" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem className="flex items-center gap-3 px-4 py-3 cursor-pointer">
                  <Flag className="h-5 w-5" /><span>Report</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          {showReplyInput && (
            <div className="mt-2 flex gap-2">
              <Avatar className="h-6 w-6 flex-shrink-0"><AvatarFallback className="bg-muted text-foreground text-[10px]">Y</AvatarFallback></Avatar>
              <div className="flex-1 flex items-center gap-1.5">
                <input
                  type="text"
                  placeholder="Add a reply..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") handleReplySubmit() }}
                  className="flex-1 bg-transparent border-b border-border pb-1 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground transition-colors"
                  autoFocus
                />
                <button onClick={handleReplySubmit} disabled={!replyText.trim()} className="text-primary hover:text-primary/80 disabled:opacity-30">
                  <Send className="h-3.5 w-3.5" />
                </button>
                <button onClick={() => setShowReplyInput(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ============ COMMENT ITEM ============

function CommentItem({ comment, onLikeComment, onDislikeComment, onReplyComment, onLikeReply, onDislikeReply, onReplyNested }: {
  comment: any
  onLikeComment: (id: string) => void
  onDislikeComment: (id: string) => void
  onReplyComment: (id: string, text: string) => void
  onLikeReply: (cid: string, rid: string) => void
  onDislikeReply: (cid: string, rid: string) => void
  onReplyNested: (cid: string, rid: string, text: string) => void
}) {
  const [showReplyInput, setShowReplyInput] = useState(false)
  const [replyText, setReplyText] = useState("")
  const [showReplies, setShowReplies] = useState(false)
  const isLiked = comment._isLiked || false
  const isDisliked = comment._isDisliked || false

  const handleReplySubmit = () => {
    if (!replyText.trim()) return
    onReplyComment(comment.id, replyText.trim())
    setReplyText(""); setShowReplyInput(false); setShowReplies(true)
  }

  const formatCount = (n: number) => n > 999 ? `${(n/1000).toFixed(1)}K` : String(n)
  const repliesWithParent = (comment.replies || []).map((r: any) => ({ ...r, parentId: comment.id }))

  return (
    <div className="py-3">
      <div className="flex gap-3">
        <Avatar className="h-8 w-8 md:h-10 md:w-10 flex-shrink-0"><AvatarImage src={comment.avatar} /><AvatarFallback className="bg-muted text-foreground text-xs">{comment.user.charAt(0)}</AvatarFallback></Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[13px] font-medium text-foreground">@{comment.user.split(' ')[0]}</span>
            <span className="text-xs text-muted-foreground">{comment.timeAgo}</span>
          </div>
          <p className="text-sm text-foreground mt-1">{comment.content}</p>
          <div className="flex items-center gap-2 mt-2">
            <button onClick={() => onLikeComment(comment.id)} className={cn("flex items-center gap-1.5 hover:bg-muted rounded-full px-3 py-1.5 transition-colors", isLiked ? "text-primary" : "text-muted-foreground")}>
              <ThumbsUp className={cn("h-5 w-5", isLiked && "fill-current")} />
              <span className="text-xs">{formatCount(comment.likes)}</span>
            </button>
            <button onClick={() => onDislikeComment(comment.id)} className={cn("hover:bg-muted rounded-full p-1.5 transition-colors", isDisliked ? "text-destructive" : "text-muted-foreground")}>
              <ThumbsDown className={cn("h-5 w-5", isDisliked && "fill-current")} />
            </button>
            <button onClick={() => setShowReplyInput(!showReplyInput)} className="text-xs text-muted-foreground hover:bg-muted rounded-full px-3 py-1.5 transition-colors">Reply</button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="hover:bg-muted rounded-full p-1.5 transition-colors text-muted-foreground ml-auto">
                  <MoreVertical className="h-4 w-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem className="flex items-center gap-3 px-4 py-3 cursor-pointer">
                  <Flag className="h-5 w-5" /><span>Report</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          {showReplyInput && (
            <div className="mt-3 flex gap-2">
              <Avatar className="h-7 w-7 flex-shrink-0"><AvatarFallback className="bg-muted text-foreground text-[10px]">Y</AvatarFallback></Avatar>
              <div className="flex-1 flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Add a reply..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") handleReplySubmit() }}
                  className="flex-1 bg-transparent border-b border-border pb-1 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground transition-colors"
                  autoFocus
                />
                <button onClick={handleReplySubmit} disabled={!replyText.trim()} className="text-primary hover:text-primary/80 disabled:opacity-30">
                  <Send className="h-4 w-4" />
                </button>
                <button onClick={() => setShowReplyInput(false)} className="text-muted-foreground hover:text-foreground">
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
          {comment.replies && comment.replies.length > 0 && (
            <button onClick={() => setShowReplies(!showReplies)} className="flex items-center gap-1.5 mt-2 text-sm text-primary hover:text-primary/80 font-medium">
              <ChevronDown className={`h-4 w-4 transition-transform ${showReplies ? 'rotate-180' : ''}`} />
              {showReplies ? 'Hide' : comment.replies.length} {comment.replies.length === 1 ? 'reply' : 'replies'}
            </button>
          )}
        </div>
      </div>
      {showReplies && repliesWithParent.map((r: any) => (
        <ReplyItem key={r.id} reply={r} onLike={onLikeReply} onDislike={onDislikeReply} onReplyNested={onReplyNested} />
      ))}
    </div>
  )
}

// ============ SHARE MODAL ============

const sharePlatforms = [
  { name: "Facebook", icon: (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48"><linearGradient id="fb5" x1="9.993%" x2="89.993%" y1="0%" y2="100%"><stop offset="0%" stopColor="#18B5FE"/><stop offset="100%" stopColor="#1277F2"/></linearGradient><path fill="url(#fb5)" d="M24 4C12.954 4 4 12.954 4 24s8.954 20 20 20 20-8.954 20-20S35.046 4 24 4z"/><path fill="#fff" d="M26.707 36.301V25.5h3.613l.543-4.215h-4.156v-2.699c0-1.227.336-2.054 2.082-2.054h2.227V12.66c-.387-.047-1.707-.16-3.25-.16-3.207 0-5.41 1.957-5.41 5.559v3.102H19v4.215h3.656V36.3h4.051z"/></svg>) },
  { name: "WhatsApp", icon: (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48"><path fill="#fff" d="M4.9 43.3l2.7-9.8C5.5 30.3 4.5 26.7 4.5 23 4.5 12.3 13.3 3.5 24 3.5S43.5 12.3 43.5 23 34.7 42.5 24 42.5c-3.5 0-6.9-.9-9.9-2.7l-9.2 3.5z"/><path fill="#25D366" d="M24 5c9.9 0 18 8.1 18 18s-8.1 18-18 18c-3.2 0-6.2-.8-8.9-2.4l-1-.6-5.5 2.1 1.5-5.3-.7-1.1C5.7 31.1 5 28.6 5 26 5 16.1 13.1 8 23 8h1v-3z"/><path fill="#fff" d="M35.5 26.8c-.4-.2-2.6-1.3-3-1.4-.4-.2-.7-.3-1 .2-.3.4-1.1 1.4-1.4 1.7-.3.3-.5.3-1 .1-.4-.2-1.9-.7-3.6-2.3-1.3-1.2-2.2-2.7-2.5-3.1-.3-.4 0-.7.2-.9.2-.2.4-.5.7-.8.2-.3.3-.5.5-.8.2-.3.1-.6 0-.8-.1-.2-.9-2.4-1.2-3.3-.3-.9-.7-.8-1-.8-.3 0-.6 0-.9 0-.3 0-.8.1-1.2.6-.4.5-1.6 1.5-1.6 3.7s1.6 4.3 1.8 4.6c.2.3 3.2 4.9 7.7 6.9 1.1.5 1.9.8 2.6 1 1.1.3 2.1.3 2.9.2.9-.1 2.6-1.1 3-2.1.4-1 .4-1.9.3-2.1-.2-.2-.4-.3-.8-.5z"/></svg>) },
  { name: "X", icon: (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48"><path fill="#000" d="M24 4C12.954 4 4 12.954 4 24s8.954 20 20 20 20-8.954 20-20S35.046 4 24 4z"/><path fill="#fff" d="M13 14h7.5l5.6 8 8.9-8h3.5l-10.3 9.3L38 34h-7.5l-6.3-9-9.2 9H11l10.8-9.8L13 14zm5 2.5h3l13 15h-3l-13-15z"/></svg>) },
]

function ShareModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const [copied, setCopied] = useState(false)
  const shareContainerRef = useRef<HTMLDivElement>(null)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(true)
  const videoUrl = typeof window !== 'undefined' ? window.location.href : "https://youtube.com/shorts/example"
  const handleCopy = () => { navigator.clipboard.writeText(videoUrl).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000) }) }
  const checkScroll = () => { const el = shareContainerRef.current; if (!el) return; setShowLeftArrow(el.scrollLeft > 10); setShowRightArrow(el.scrollLeft < el.scrollWidth - el.clientWidth - 10) }
  useEffect(() => { const el = shareContainerRef.current; if (el) { el.addEventListener('scroll', checkScroll); checkScroll(); return () => el.removeEventListener('scroll', checkScroll) } }, [isOpen])
  const scrollShare = (d: 'left' | 'right') => { const el = shareContainerRef.current; if (!el) return; el.scrollBy({ left: d === 'left' ? -250 : 250, behavior: 'smooth' }) }
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-card rounded-2xl w-[90vw] max-w-[540px] max-h-[85vh] overflow-hidden shadow-2xl animate-fade-in-left">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border"><h2 className="text-foreground text-lg font-semibold">Share</h2><button onClick={onClose} className="text-muted-foreground hover:text-foreground p-1 rounded-full hover:bg-muted"><X className="h-5 w-5" /></button></div>
        <div className="relative px-5 py-5">
          {showLeftArrow && <button onClick={() => scrollShare('left')} className="absolute left-1 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-background/80 hover:bg-background flex items-center justify-center text-foreground shadow-lg"><ChevronLeft className="h-5 w-5" /></button>}
          {showRightArrow && <button onClick={() => scrollShare('right')} className="absolute right-1 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-background/80 hover:bg-background flex items-center justify-center text-foreground shadow-lg"><ChevronRight className="h-5 w-5" /></button>}
          <div ref={shareContainerRef} className="flex gap-4 overflow-x-auto scrollbar-none py-2 px-2" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {sharePlatforms.map((p) => (<button key={p.name} className="flex flex-col items-center gap-2 flex-shrink-0 w-[72px] group"><div className="w-14 h-14 rounded-full overflow-hidden flex items-center justify-center group-hover:scale-110 transition-transform duration-200">{p.icon}</div><span className="text-xs text-muted-foreground group-hover:text-foreground text-center leading-tight truncate w-full">{p.name}</span></button>))}
          </div>
        </div>
        <div className="px-5 pb-5"><div className="flex items-center gap-3 bg-muted rounded-xl p-3 border border-border"><input type="text" value={videoUrl} readOnly className="flex-1 bg-transparent text-sm text-foreground outline-none truncate" /><button onClick={handleCopy} className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all ${copied ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'}`}>{copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}{copied ? 'Copied' : 'Copy'}</button></div></div>
      </div>
    </div>
  )
}

// ============ MAIN COMPONENT ============

export default function ShortsPage() {
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)
  const commentInputRef = useRef<HTMLInputElement>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isLiked, setIsLiked] = useState<Record<string, boolean>>({})
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
  const [likedIds, setLikedIds] = useState<string[]>(() => loadIds(STORAGE_LIKED))
  const [dislikedIds, setDislikedIds] = useState<string[]>(() => loadIds(STORAGE_DISLIKED))
  const centerPlayTimeout = useRef<NodeJS.Timeout | null>(null)
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null)
  const commentsTimerRef = useRef<NodeJS.Timeout | null>(null)
  const descTimerRef = useRef<NodeJS.Timeout | null>(null)
  const switchTimerRef = useRef<NodeJS.Timeout | null>(null)
  const videoRefs = useRef<Map<string, HTMLIFrameElement>>(new Map())

  // Feedback dialog state
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false)
  const [feedbackText, setFeedbackText] = useState("")
  const [feedbackSent, setFeedbackSent] = useState(false)

  const currentShort = shortsData[currentIndex]

  // Sync liked/disliked to localStorage
  useEffect(() => { saveIds(STORAGE_LIKED, likedIds) }, [likedIds])
  useEffect(() => { saveIds(STORAGE_DISLIKED, dislikedIds) }, [dislikedIds])

  useEffect(() => { return () => { if (commentsTimerRef.current) clearTimeout(commentsTimerRef.current); if (descTimerRef.current) clearTimeout(descTimerRef.current); if (switchTimerRef.current) clearTimeout(switchTimerRef.current) } }, [])

  const loadCommentsForCurrentShort = () => {
    setCommentsLoading(true)
    setComments([])
    if (commentsTimerRef.current) clearTimeout(commentsTimerRef.current)
    commentsTimerRef.current = setTimeout(() => {
      const src = commentsByVideo[currentShort?.id] || []
      const loaded = src.map((c: any) => ({
        ...c,
        _isLiked: likedIds.includes(c.id),
        _isDisliked: dislikedIds.includes(c.id),
        replies: (c.replies || []).map((r: any) => ({
          ...r,
          _isLiked: likedIds.includes(r.id),
          _isDisliked: dislikedIds.includes(r.id),
        }))
      }))
      setComments(loaded)
      setCommentsLoading(false)
    }, 600)
  }

  const loadDescriptionForCurrentShort = () => {
    setDescLoading(true)
    if (descTimerRef.current) clearTimeout(descTimerRef.current)
    descTimerRef.current = setTimeout(() => setDescLoading(false), 400)
  }

  useEffect(() => { if (activePanel === "comments") loadCommentsForCurrentShort(); else if (activePanel === "description") loadDescriptionForCurrentShort() }, [currentIndex])

  // Handle scroll to update current index and control video playback
  useEffect(() => {
    const container = containerRef.current; if (!container) return
    const handleScroll = () => {
      setIsScrolling(true)
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current)
      scrollTimeout.current = setTimeout(() => setIsScrolling(false), 400)
      const idx = Math.round(container.scrollTop / container.clientHeight)
      const newIdx = Math.min(idx, shortsData.length - 1)
      if (newIdx !== currentIndex) { 
        setIsTransitioning(true); 
        if (switchTimerRef.current) clearTimeout(switchTimerRef.current); 
        switchTimerRef.current = setTimeout(() => setIsTransitioning(false), 600)
        // Pause all videos except the active one
        videoRefs.current.forEach((iframe, id) => {
          if (id !== shortsData[newIdx]?.id) {
            // Stop video by reloading with mute and autoplay off
            iframe.src = iframe.src.replace('autoplay=1', 'autoplay=0')
          }
        })
      }
      setCurrentIndex(newIdx)
    }
    container.addEventListener("scroll", handleScroll, { passive: true })
    return () => { container.removeEventListener("scroll", handleScroll); if (scrollTimeout.current) clearTimeout(scrollTimeout.current) }
  }, [currentIndex])

  // Auto-play active video when index changes
  useEffect(() => {
    const activeShort = shortsData[currentIndex]
    if (activeShort) {
      const iframe = videoRefs.current.get(activeShort.id)
      if (iframe) {
        // Ensure autoplay is enabled for active video
        if (!iframe.src.includes('autoplay=1')) {
          iframe.src = iframe.src.replace('autoplay=0', 'autoplay=1')
        }
      }
    }
  }, [currentIndex])

  const scrollToVideo = (i: number) => {
    const c = containerRef.current; if (!c) return
    const t = Math.max(0, Math.min(i, shortsData.length - 1))
    if (t !== currentIndex) { 
      setIsTransitioning(true); 
      if (switchTimerRef.current) clearTimeout(switchTimerRef.current); 
      switchTimerRef.current = setTimeout(() => setIsTransitioning(false), 600)
    }
    c.scrollTo({ top: t * c.clientHeight, behavior: "smooth" })
  }

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (activePanel && e.key === "Escape") { setActivePanel(null); return }
      if (showShareModal && e.key === "Escape") { setShowShareModal(false); return }
      if (activePanel || showShareModal) return
      if (e.key === "ArrowDown") { e.preventDefault(); scrollToVideo(currentIndex + 1) }
      if (e.key === "ArrowUp") { e.preventDefault(); scrollToVideo(currentIndex - 1) }
    }
    window.addEventListener("keydown", h); return () => window.removeEventListener("keydown", h)
  }, [currentIndex, activePanel, showShareModal])

  const toggleLike = (id: string) => setIsLiked(p => ({ ...p, [id]: !p[id] }))
  const toggleFullscreen = () => { if (!document.fullscreenElement) { document.documentElement.requestFullscreen().catch(() => {}); setIsFullscreen(true) } else { document.exitFullscreen().catch(() => {}); setIsFullscreen(false) } }
  const handleTogglePlay = (e: React.MouseEvent) => { e.stopPropagation(); setIsPlaying(!isPlaying); setShowCenterPlayPause(true); if (centerPlayTimeout.current) clearTimeout(centerPlayTimeout.current); centerPlayTimeout.current = setTimeout(() => setShowCenterPlayPause(false), 600) }

  // ---- COMMENT ACTIONS ----
  const persistComments = () => saveComments(commentsByVideo)

  const handleAddComment = () => {
    if (!commentText.trim()) return
    const nc = { id: `${currentShort.id}c${Date.now()}`, user: "You", avatar: "/placeholder.svg?height=32&width=32", timeAgo: "Just now", content: commentText.trim(), likes: 0, dislikes: 0, replies: [] }
    setComments(p => [nc, ...p]); setCommentText("")
    if (commentsByVideo[currentShort.id]) commentsByVideo[currentShort.id].unshift(nc)
    else commentsByVideo[currentShort.id] = [nc]
    persistComments()
  }

  const handleLikeComment = (commentId: string) => {
    const src = commentsByVideo[currentShort.id]?.find((c: any) => c.id === commentId)
    if (!src) return
    const wasLiked = likedIds.includes(commentId)
    const wasDisliked = dislikedIds.includes(commentId)

    if (wasLiked) src.likes--
    else { src.likes++; if (wasDisliked) { src.dislikes--; setDislikedIds(p => p.filter(id => id !== commentId)) } }

    if (wasLiked) setLikedIds(p => p.filter(id => id !== commentId))
    else setLikedIds(p => [...p, commentId])

    setComments(p => p.map(c => c.id === commentId ? { ...c, likes: src.likes, _isLiked: !wasLiked, _isDisliked: false, dislikes: wasDisliked ? c.dislikes - 1 : c.dislikes } : c))
    persistComments()
  }

  const handleDislikeComment = (commentId: string) => {
    const src = commentsByVideo[currentShort.id]?.find((c: any) => c.id === commentId)
    if (!src) return
    const wasDisliked = dislikedIds.includes(commentId)
    const wasLiked = likedIds.includes(commentId)

    if (wasDisliked) src.dislikes--
    else { src.dislikes++; if (wasLiked) { src.likes--; setLikedIds(p => p.filter(id => id !== commentId)) } }

    if (wasDisliked) setDislikedIds(p => p.filter(id => id !== commentId))
    else setDislikedIds(p => [...p, commentId])

    setComments(p => p.map(c => c.id === commentId ? { ...c, dislikes: src.dislikes, _isDisliked: !wasDisliked, _isLiked: false, likes: wasLiked ? c.likes - 1 : c.likes } : c))
    persistComments()
  }

  const handleReplyComment = (commentId: string, text: string) => {
    const nr = { id: `r${Date.now()}`, user: "You", avatar: "/placeholder.svg?height=32&width=32", timeAgo: "Just now", content: text, likes: 0, dislikes: 0, replies: [], parentId: commentId }
    setComments(p => p.map(c => c.id === commentId ? { ...c, replies: [...(c.replies || []), nr] } : c))
    const src = commentsByVideo[currentShort.id]?.find((c: any) => c.id === commentId)
    if (src) { if (!src.replies) src.replies = []; src.replies.push(nr); persistComments() }
  }

  const handleLikeReply = (commentId: string, replyId: string) => {
    const src = commentsByVideo[currentShort.id]?.find((c: any) => c.id === commentId)
    if (!src?.replies) return
    const reply = src.replies.find((r: any) => r.id === replyId)
    if (!reply) return
    const wasLiked = likedIds.includes(replyId)
    const wasDisliked = dislikedIds.includes(replyId)

    if (wasLiked) reply.likes--
    else { reply.likes++; if (wasDisliked) { reply.dislikes--; setDislikedIds(p => p.filter(id => id !== replyId)) } }

    if (wasLiked) setLikedIds(p => p.filter(id => id !== replyId))
    else setLikedIds(p => [...p, replyId])

    setComments(p => p.map(c => c.id === commentId ? { ...c, replies: (c.replies || []).map((r: any) => r.id === replyId ? { ...r, likes: reply.likes, _isLiked: !wasLiked, _isDisliked: false, dislikes: wasDisliked ? r.dislikes - 1 : r.dislikes } : r) } : c))
    persistComments()
  }

  const handleDislikeReply = (commentId: string, replyId: string) => {
    const src = commentsByVideo[currentShort.id]?.find((c: any) => c.id === commentId)
    if (!src?.replies) return
    const reply = src.replies.find((r: any) => r.id === replyId)
    if (!reply) return
    const wasDisliked = dislikedIds.includes(replyId)
    const wasLiked = likedIds.includes(replyId)

    if (wasDisliked) reply.dislikes--
    else { reply.dislikes++; if (wasLiked) { reply.likes--; setLikedIds(p => p.filter(id => id !== replyId)) } }

    if (wasDisliked) setDislikedIds(p => p.filter(id => id !== replyId))
    else setDislikedIds(p => [...p, replyId])

    setComments(p => p.map(c => c.id === commentId ? { ...c, replies: (c.replies || []).map((r: any) => r.id === replyId ? { ...r, dislikes: reply.dislikes, _isDisliked: !wasDisliked, _isLiked: false, likes: wasLiked ? r.likes - 1 : r.likes } : r) } : c))
    persistComments()
  }

  const handleReplyNested = (commentId: string, replyId: string, text: string) => {
    const nr = { id: `nr${Date.now()}`, user: "You", avatar: "/placeholder.svg?height=32&width=32", timeAgo: "Just now", content: text, likes: 0, dislikes: 0, parentId: replyId }
    setComments(p => p.map(c => c.id === commentId ? { ...c, replies: [...(c.replies || []), nr] } : c))
    const src = commentsByVideo[currentShort.id]?.find((c: any) => c.id === commentId)
    if (src) { if (!src.replies) src.replies = []; src.replies.push(nr); persistComments() }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleAddComment() } }
  const openPanel = (type: PanelType) => { if (activePanel === type) { setActivePanel(null); return }; setActivePanel(type); setDescExpanded(false); if (type === "comments") { loadCommentsForCurrentShort(); setTimeout(() => commentInputRef.current?.focus(), 400) } else if (type === "description") loadDescriptionForCurrentShort() }
  type PanelType = "comments" | "description" | null
  const panelTitle = activePanel === "comments" ? "Comments" : activePanel === "description" ? "Description" : ""
  const panelWidth = typeof window !== 'undefined' && window.innerWidth >= 1440 ? 480 : 380
  const panelRight = 96
  const iframeShiftRight = panelWidth + 20 + panelRight

  const currentComments2 = commentsByVideo[currentShort?.id] || []
  const totalCommentsCount = currentComments2.length + currentComments2.reduce((acc: number, c: any) => acc + (c.replies?.length || 0), 0)

  // ---- FEEDBACK HANDLING ----
  const handleSendFeedback = () => {
    if (!feedbackText.trim()) return
    setFeedbackSent(true)
    setTimeout(() => {
      setFeedbackSent(false)
      setFeedbackText("")
      setShowFeedbackDialog(false)
      toast.success("Feedback sent! Thank you.")
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-background">
      <style>{`
        @keyframes fadeInLeft { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
        .animate-fade-in-left { animation: fadeInLeft 0.3s ease-out forwards; }
        .animate-slide-up { animation: slideUp 0.3s ease-out forwards; }
        .scrollbar-thin::-webkit-scrollbar { width: 6px; }
        .scrollbar-thin::-webkit-scrollbar-track { background: transparent; }
        .scrollbar-thin::-webkit-scrollbar-thumb { background-color: var(--border); border-radius: 3px; }
        .scrollbar-none::-webkit-scrollbar { display: none; }
        .scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Share Modal */}
      <ShareModal isOpen={showShareModal} onClose={() => setShowShareModal(false)} />

      {/* Feedback Dialog */}
      <Dialog open={showFeedbackDialog} onOpenChange={setShowFeedbackDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Send className="h-5 w-5 text-primary" /> Send Feedback</DialogTitle>
            <DialogDescription>Help us improve Deeni.tube. Share your thoughts, suggestions, or report issues.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {feedbackSent ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="h-8 w-8 text-green-500" />
                </div>
                <h3 className="text-lg font-semibold mb-1">Thank You!</h3>
                <p className="text-sm text-muted-foreground">Your feedback has been sent successfully.</p>
              </div>
            ) : (
              <>
                <Textarea
                  placeholder="Write your feedback here..."
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  className="min-h-[120px] resize-none"
                />
                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1" onClick={() => setShowFeedbackDialog(false)}>Cancel</Button>
                  <Button className="flex-1" onClick={handleSendFeedback} disabled={!feedbackText.trim()}>
                    <Send className="h-4 w-4 mr-2" /> Send
                  </Button>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Desktop navigation arrows */}
      <div className="hidden md:flex fixed right-6 top-1/2 -translate-y-1/2 z-50 flex-col gap-1 bg-background/80 dark:bg-[#b5abab66] rounded-full p-1.5 shadow-md">
        <button onClick={() => scrollToVideo(currentIndex - 1)} disabled={currentIndex === 0} className="w-10 h-10 rounded-full flex items-center justify-center text-foreground hover:bg-muted transition-colors disabled:opacity-30 disabled:cursor-not-allowed"><ChevronUp className="h-6 w-6" /></button>
        <button onClick={() => scrollToVideo(currentIndex + 1)} disabled={currentIndex === shortsData.length - 1} className="w-10 h-10 rounded-full flex items-center justify-center text-foreground hover:bg-muted transition-colors disabled:opacity-30 disabled:cursor-not-allowed"><ChevronDown className="h-6 w-6" /></button>
      </div>

      {/* Desktop Panel */}
      {activePanel && (
        <div className="hidden md:flex fixed top-[56px] bottom-0 z-40 items-center" style={{ right: `${panelRight}px` }}>
          <div className="bg-card dark:bg-[#212121] rounded-2xl overflow-hidden flex flex-col shadow-2xl animate-fade-in-left h-[85vh]" style={{ width: `${panelWidth}px` }}>
            <div className="flex items-center justify-between px-4 py-3 border-b border-border flex-shrink-0">
              <div className="flex items-center gap-2">
                <h3 className="text-foreground font-semibold">{panelTitle}</h3>
                {activePanel === "comments" && <span className="text-muted-foreground text-sm">{totalCommentsCount}</span>}
              </div>
              <button onClick={() => setActivePanel(null)} className="text-muted-foreground hover:text-foreground p-1 rounded-full hover:bg-muted">
                <X className="h-5 w-5" />
              </button>
            </div>
            {activePanel === "comments" && (
              <>
                <div className="flex-1 overflow-y-auto px-4 scrollbar-thin">
                  {commentsLoading ? (
                    <><CommentSkeleton /><CommentSkeleton /><CommentSkeleton /><CommentSkeleton /><CommentSkeleton /></>
                  ) : comments.length > 0 ? (
                    comments.map((c) => (
                      <CommentItem
                        key={c.id}
                        comment={c}
                        onLikeComment={handleLikeComment}
                        onDislikeComment={handleDislikeComment}
                        onReplyComment={handleReplyComment}
                        onLikeReply={handleLikeReply}
                        onDislikeReply={handleDislikeReply}
                        onReplyNested={handleReplyNested}
                      />
                    ))
                  ) : (
                    <div className="flex items-center justify-center h-full"><p className="text-muted-foreground text-sm">No comments yet</p></div>
                  )}
                </div>
                <div className="border-t border-border px-4 py-3 flex-shrink-0">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8 flex-shrink-0"><AvatarFallback className="bg-muted text-foreground text-xs">Y</AvatarFallback></Avatar>
                    <div className="flex-1 flex items-center gap-2">
                      <input
                        ref={commentInputRef}
                        type="text"
                        placeholder="Add a comment..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        onKeyDown={handleKeyPress}
                        className="flex-1 bg-transparent border-b border-border pb-1 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground transition-colors"
                      />
                      <button onClick={handleAddComment} disabled={!commentText.trim()} className="text-primary hover:text-primary/80 disabled:opacity-30 disabled:cursor-not-allowed p-1">
                        <Send className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
            {activePanel === "description" && (
              <>
                {descLoading ? (
                  <DescriptionSkeleton />
                ) : currentShort ? (
                  <div className="flex-1 overflow-y-auto scrollbar-thin">
                    <div className="px-4 py-3"><h4 className="text-foreground text-sm font-medium leading-relaxed">{currentShort.title}</h4></div>
                    <div className="px-4 pb-3 flex items-center gap-4">
                      <div className="flex items-center gap-1.5 text-muted-foreground text-xs"><Eye className="h-4 w-4" /><span>{currentShort.views} views</span></div>
                      <div className="flex items-center gap-1.5 text-muted-foreground text-xs"><Clock className="h-4 w-4" /><span>{currentShort.timeAgo}</span></div>
                    </div>
                    <div className="px-4 pb-4">
                      <div className={`text-sm text-foreground whitespace-pre-wrap leading-relaxed ${!descExpanded ? 'line-clamp-4' : ''}`}>{currentShort.description}</div>
                      {currentShort.description && currentShort.description.length > 200 && <button onClick={() => setDescExpanded(!descExpanded)} className="text-muted-foreground hover:text-foreground text-xs mt-1 font-medium">{descExpanded ? 'Show less' : '...more'}</button>}
                    </div>
                    <div className="px-4 pb-4 flex flex-wrap gap-2">{currentShort.hashtags.map((tag: string) => <span key={tag} className="text-primary text-xs hover:text-primary/80 cursor-pointer">{tag}</span>)}</div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full"><p className="text-muted-foreground text-sm">No description available</p></div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* Mobile Panel */}
      {activePanel && (
        <div className="md:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/60" onClick={() => setActivePanel(null)} />
          <div className="absolute bottom-0 left-0 right-0 bg-card dark:bg-[#212121] rounded-t-2xl max-h-[70vh] flex flex-col animate-slide-up">
            <div className="w-10 h-1 bg-muted rounded-full mx-auto mt-3 mb-2 flex-shrink-0" />
            <div className="flex items-center justify-between px-4 py-2 border-b border-border flex-shrink-0">
              <div className="flex items-center gap-2"><h3 className="text-foreground font-semibold">{panelTitle}</h3>{activePanel === "comments" && <span className="text-muted-foreground text-sm">{totalCommentsCount}</span>}</div>
              <button onClick={() => setActivePanel(null)} className="text-muted-foreground hover:text-foreground p-1 rounded-full hover:bg-muted"><X className="h-5 w-5" /></button>
            </div>
            {activePanel === "comments" && (
              <>
                <div className="flex-1 overflow-y-auto px-4 scrollbar-thin">
                  {commentsLoading ? (
                    <><CommentSkeleton /><CommentSkeleton /><CommentSkeleton /></>
                  ) : comments.length > 0 ? (
                    comments.map((c) => (
                      <CommentItem
                        key={c.id}
                        comment={c}
                        onLikeComment={handleLikeComment}
                        onDislikeComment={handleDislikeComment}
                        onReplyComment={handleReplyComment}
                        onLikeReply={handleLikeReply}
                        onDislikeReply={handleDislikeReply}
                        onReplyNested={handleReplyNested}
                      />
                    ))
                  ) : (
                    <div className="flex items-center justify-center h-32"><p className="text-muted-foreground text-sm">No comments yet</p></div>
                  )}
                </div>
                <div className="border-t border-border px-4 py-3 flex-shrink-0">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8 flex-shrink-0"><AvatarFallback className="bg-muted text-foreground text-xs">Y</AvatarFallback></Avatar>
                    <div className="flex-1 flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Add a comment..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        onKeyDown={handleKeyPress}
                        className="flex-1 bg-transparent border-b border-border pb-1 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground transition-colors"
                      />
                      <button onClick={handleAddComment} disabled={!commentText.trim()} className="text-primary hover:text-primary/80 disabled:opacity-30 disabled:cursor-not-allowed p-1">
                        <Send className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
            {activePanel === "description" && (
              <>
                {descLoading ? (
                  <DescriptionSkeleton />
                ) : currentShort ? (
                  <div className="flex-1 overflow-y-auto scrollbar-thin">
                    <div className="px-4 py-3"><h4 className="text-foreground text-sm font-medium leading-relaxed">{currentShort.title}</h4></div>
                    <div className="px-4 pb-3 flex items-center gap-4">
                      <div className="flex items-center gap-1.5 text-muted-foreground text-xs"><Eye className="h-4 w-4" /><span>{currentShort.views} views</span></div>
                      <div className="flex items-center gap-1.5 text-muted-foreground text-xs"><Clock className="h-4 w-4" /><span>{currentShort.timeAgo}</span></div>
                    </div>
                    <div className="px-4 pb-4">
                      <div className={`text-sm text-foreground whitespace-pre-wrap leading-relaxed ${!descExpanded ? 'line-clamp-4' : ''}`}>{currentShort.description}</div>
                      {currentShort.description && currentShort.description.length > 200 && <button onClick={() => setDescExpanded(!descExpanded)} className="text-muted-foreground hover:text-foreground text-xs mt-1 font-medium">{descExpanded ? 'Show less' : '...more'}</button>}
                    </div>
                    <div className="px-4 pb-4 flex flex-wrap gap-2">{currentShort.hashtags.map((tag: string) => <span key={tag} className="text-primary text-xs hover:text-primary/80 cursor-pointer">{tag}</span>)}</div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-32"><p className="text-muted-foreground text-sm">No description available</p></div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* Main Shorts Content */}
      <div
        ref={containerRef}
        className="fixed inset-0 top-[56px] overflow-y-auto snap-y snap-mandatory scrollbar-none transition-all duration-300 ease-in-out"
        style={{ scrollSnapType: "y mandatory", right: typeof window !== 'undefined' && window.innerWidth >= 768 && activePanel ? `${iframeShiftRight}px` : "0px" }}
      >
        {shortsData.map((short, index) => {
          const isActive = index === currentIndex
          const isHovered = hoveredVideoId === short.id
          return (
            <section key={short.id} className="relative h-[calc(100vh-56px)] w-full snap-start snap-always flex items-center justify-center bg-background">
              <div
                className="relative w-full h-full md:max-h-[85vh] md:w-auto md:aspect-[9/16] md:rounded-2xl overflow-hidden mx-auto bg-black"
                onMouseEnter={() => setHoveredVideoId(short.id)}
                onMouseLeave={() => { setHoveredVideoId(null); setShowVolumeSlider(false); setShowMoreMenu(false) }}
              >
                {/* Video Player - Only the active video plays, full screen on mobile */}
                <div className="w-full h-full bg-black" onClick={handleTogglePlay}>
                  {isActive ? (
                    <iframe
                      ref={(el) => {
                        if (el) videoRefs.current.set(short.id, el)
                      }}
                      src={`https://www.youtube.com/embed/${short.videoId}?autoplay=1&mute=${isMuted ? 1 : 0}&controls=0&loop=1&playlist=${short.videoId}&modestbranding=1&rel=0&fs=1&playsinline=1`}
                      title={short.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                      style={{ 
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                    />
                  ) : (
                    // Thumbnail for non-active videos
                    <div className="relative w-full h-full">
                      <Image
                        src={short.thumbnail}
                        alt={short.title}
                        fill
                        className="object-cover"
                        priority={index < 2}
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center">
                          <Play className="h-8 w-8 text-white" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Center play/pause overlay - only for active video */}
                {isActive && (
                  <div className={`absolute inset-0 flex items-center justify-center z-25 pointer-events-none transition-opacity duration-200 ${showCenterPlayPause ? "opacity-100" : "opacity-0"}`}>
                    <div className="w-16 h-16 rounded-full bg-background/60 backdrop-blur-sm flex items-center justify-center">
                      {isPlaying ? <Pause className="h-8 w-8 text-foreground" /> : <Play className="h-8 w-8 text-foreground" />}
                    </div>
                  </div>
                )}

                {/* Gradient overlays */}
                <div className="absolute bottom-0 left-0 right-0 h-[40%] bg-gradient-to-t from-black/90 via-black/50 to-transparent pointer-events-none" />
                <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/60 via-black/20 to-transparent pointer-events-none" />

                {/* Top controls (hover only) */}
                <div className={`absolute top-0 left-0 right-0 z-30 px-4 pt-4 pb-16 transition-opacity duration-200 ${(isHovered || isActive) && !isScrolling && !isTransitioning ? "opacity-100" : "opacity-0 pointer-events-none"}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button onClick={handleTogglePlay} className="w-10 h-10 rounded-full flex items-center justify-center text-white hover:bg-white/10 transition-colors" style={{ backgroundColor: "rgba(0,0,0,0.4)" }}>
                        {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                      </button>
                      <div className="relative flex items-center" onMouseEnter={() => setShowVolumeSlider(true)} onMouseLeave={() => setShowVolumeSlider(false)}>
                        <button onClick={() => setIsMuted(!isMuted)} className="w-10 h-10 rounded-full flex items-center justify-center text-white hover:bg-white/10 transition-colors" style={{ backgroundColor: "rgba(0,0,0,0.4)" }}>
                          {isMuted || volume === 0 ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                        </button>
                        {showVolumeSlider && (
                          <div className="hidden md:flex items-center rounded-full px-3 py-2 ml-1 shadow-lg" style={{ backgroundColor: "rgba(0,0,0,0.6)" }}>
                            <input type="range" min="0" max="100" value={isMuted ? 0 : volume} onChange={(e) => { setVolume(Number(e.target.value)); setIsMuted(false) }} className="w-20 h-1 accent-white cursor-pointer" />
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => setCaptionsEnabled(!captionsEnabled)} className="w-10 h-10 rounded-full flex items-center justify-center text-white hover:bg-white/10 transition-colors" style={{ backgroundColor: "rgba(0,0,0,0.4)" }}>
                        {captionsEnabled ? <CCIconOn className="h-5 w-5" /> : <CCIconOff className="h-5 w-5" />}
                      </button>
                      <button onClick={toggleFullscreen} className="w-10 h-10 rounded-full flex items-center justify-center text-white hover:bg-white/10 transition-colors" style={{ backgroundColor: "rgba(0,0,0,0.4)" }}>
                        <FullscreenIcon className="h-5 w-5" />
                      </button>
                      <div className="relative">
                        <button onClick={() => setShowMoreMenu(!showMoreMenu)} className="w-10 h-10 rounded-full flex items-center justify-center text-white hover:bg-white/10 transition-colors" style={{ backgroundColor: "rgba(0,0,0,0.4)" }}>
                          <MoreIcon className="h-5 w-5" />
                        </button>
                        {showMoreMenu && (
                          <>
                            <div className="fixed inset-0 z-40 md:hidden" onClick={() => setShowMoreMenu(false)} />
                            <div className="fixed bottom-0 left-0 right-0 z-50 bg-card rounded-t-2xl py-2 shadow-2xl md:absolute md:top-full md:bottom-auto md:left-auto md:right-0 md:mt-2 md:rounded-xl md:w-[280px]">
                              <div className="w-10 h-1 bg-muted rounded-full mx-auto my-3 md:hidden" />
                              <button className="w-full flex items-center gap-4 px-4 py-3 text-foreground text-sm hover:bg-muted transition-colors" onClick={() => { openPanel("description"); setShowMoreMenu(false) }}>
                                <List className="h-5 w-5" /> Description
                              </button>
                              <button className="w-full flex items-center gap-4 px-4 py-3 text-foreground text-sm hover:bg-muted transition-colors" onClick={() => setShowMoreMenu(false)}>
                                <Bookmark className="h-5 w-5" /> Save to playlist
                              </button>
                              <button className="w-full flex items-center justify-between px-4 py-3 text-foreground text-sm hover:bg-muted transition-colors" onClick={() => { setCaptionsEnabled(!captionsEnabled); setShowMoreMenu(false) }}>
                                <div className="flex items-center gap-4">{captionsEnabled ? <CCIconOn className="h-5 w-5" /> : <CCIconOff className="h-5 w-5" />} Captions</div>
                                <span className="text-muted-foreground text-xs">{captionsEnabled ? "On" : "Off"}</span>
                              </button>
                              <ReportDialog videoTitle={short.title} videoId={short.id}>
                                <button className="w-full flex items-center gap-4 px-4 py-3 text-foreground text-sm hover:bg-muted transition-colors">
                                  <Flag className="h-5 w-5" />
                                  <span>Report</span>
                                </button>
                              </ReportDialog>
                              <button className="w-full flex items-center gap-4 px-4 py-3 text-foreground text-sm hover:bg-muted transition-colors" onClick={() => { setShowMoreMenu(false); setShowFeedbackDialog(true); }}>
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

                {/* Bottom info & actions */}
                <div className={`absolute bottom-6 left-4 right-20 z-20 transition-all duration-500 ${isActive && !isScrolling && !isTransitioning ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`}>
                  <div className="flex items-center gap-3 mb-3">
                    <Avatar className="h-10 w-10 border-2 border-white/20 flex-shrink-0">
                      <AvatarImage src={short.channelAvatar} />
                      <AvatarFallback className="bg-muted text-black dark:text-white text-xs">{short.channel.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="text-white font-semibold text-sm truncate">{short.channel}</span>
                  </div>
                  <button onClick={() => openPanel("description")} className="text-left w-full">
                    <p className="text-white/90 text-sm leading-relaxed line-clamp-2 hover:text-white transition-colors">{short.title}</p>
                  </button>
                </div>

                <div className={`absolute right-3 bottom-28 flex flex-col gap-6 items-center z-20 transition-all duration-500 ${isActive && !isScrolling && !isTransitioning ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4 pointer-events-none"}`}>
                  <button onClick={() => toggleLike(short.id)} className="flex flex-col items-center gap-1 group">
                    <div className={cn("w-12 h-12 rounded-full flex items-center justify-center transition-all", isLiked[short.id] ? "scale-110" : "", "group-hover:bg-white/10 group-active:scale-95")} style={{ backgroundColor: isLiked[short.id] ? "rgba(255, 0, 0, 0.2)" : "rgba(0,0,0,0.4)" }}>
                      <Heart className={cn("h-6 w-6", isLiked[short.id] ? "text-red-500 fill-red-500" : "text-white")} />
                    </div>
                    <span className="text-white text-xs font-medium">{short.likes}</span>
                  </button>
                  <button onClick={() => openPanel("comments")} className="flex flex-col items-center gap-1 group">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center group-hover:bg-white/10 group-active:scale-95" style={{ backgroundColor: "rgba(0,0,0,0.4)" }}>
                      <MessageCircle className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-white text-xs font-medium">{short.comments}</span>
                  </button>
                  <button onClick={() => setShowShareModal(true)} className="flex flex-col items-center gap-1 group">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center group-hover:bg-white/10 group-active:scale-95" style={{ backgroundColor: "rgba(0,0,0,0.4)" }}>
                      <Share2 className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-white text-xs font-medium">Share</span>
                  </button>
                  <button className="flex flex-col items-center gap-1 group">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center group-hover:bg-white/10 group-active:scale-95" style={{ backgroundColor: "rgba(0,0,0,0.4)" }}>
                      <Bookmark className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-white text-xs font-medium">Save</span>
                  </button>
                  <ReportDialog videoTitle={short.title} videoId={short.id}>
                    <button className="flex flex-col items-center gap-1 group">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center group-hover:bg-white/10 group-active:scale-95" style={{ backgroundColor: "rgba(0,0,0,0.4)" }}>
                        <Flag className="h-6 w-6 text-white" />
                      </div>
                      <span className="text-white text-xs font-medium">Report</span>
                    </button>
                  </ReportDialog>
                </div>
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}