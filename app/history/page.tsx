// app/history/page.tsx
"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  X,
  MoreVertical,
  History,
  Play,
  Trash2,
  Clock,
  Bookmark,
  Share,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMediaQuery } from "@/hooks/use-media-query";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { videoData, VideoItem } from "@/lib/video-data";
import { ShareModal } from "@/components/share-modal";

// Real shorts data - Today (15 shorts)
const shortsTodayData = [
  {
    id: "sh1",
    videoId: "MBxDbbkk0gQ",
    title: "একমাত্র আল্লাহর রাজত্বই চিরস্থায়ী",
    channel: "Dr. Mohammad Monzur-E-Elahi",
    channelId: "monzur",
    channelAvatar: "https://yt3.googleusercontent.com/ytc/AIdro_lLp3SxQeehJxSmd_QCmSxpFBj4k-7X-brif7v9Jz0rBg=s160-c-k-c0x00ffffff-no-rj",
    thumbnail: "https://img.youtube.com/vi/MBxDbbkk0gQ/hqdefault.jpg",
    duration: "0:58",
    views: "15K views",
    timeAgo: "1 hour ago",
    watchedDate: new Date(Date.now() - 1 * 60 * 60 * 1000),
    type: "short",
  },
  {
    id: "sh2",
    videoId: "goHfO28fE-A",
    title: "যারা বলে আমাদের রব আল্লাহ",
    channel: "Dr. Mohammad Monzur-E-Elahi",
    channelId: "monzur",
    channelAvatar: "https://yt3.googleusercontent.com/ytc/AIdro_lLp3SxQeehJxSmd_QCmSxpFBj4k-7X-brif7v9Jz0rBg=s160-c-k-c0x00ffffff-no-rj",
    thumbnail: "https://img.youtube.com/vi/goHfO28fE-A/hqdefault.jpg",
    duration: "0:45",
    views: "25K views",
    timeAgo: "2 hours ago",
    watchedDate: new Date(Date.now() - 2 * 60 * 60 * 1000),
    type: "short",
  },
  {
    id: "sh3",
    videoId: "PUwTf64igQk",
    title: "এভাবে ঈমান নষ্ট করছেন নাতো?",
    channel: "Dr. Khandaker Abdullah Jahangir Rh.",
    channelId: "abdullah-jahangir",
    channelAvatar: "https://yt3.googleusercontent.com/stJnVilfKhMtBiIq_hXTu-9DnanUT0GNtmsRePmQvLAi6c7bhXoIIHGlYL0HqUrdEjrL0KFs7Q=s160-c-k-c0x00ffffff-no-rj",
    thumbnail: "https://img.youtube.com/vi/PUwTf64igQk/hqdefault.jpg",
    duration: "0:52",
    views: "35K views",
    timeAgo: "3 hours ago",
    watchedDate: new Date(Date.now() - 3 * 60 * 60 * 1000),
    type: "short",
  },
  {
    id: "sh4",
    videoId: "oEWnPbRvOrY",
    title: "আল্লাহর পক্ষ থেকে তাওফীক প্রাপ্তি",
    channel: "Dr. Mohammad Monzur-E-Elahi",
    channelId: "monzur",
    channelAvatar: "https://yt3.googleusercontent.com/ytc/AIdro_lLp3SxQeehJxSmd_QCmSxpFBj4k-7X-brif7v9Jz0rBg=s160-c-k-c0x00ffffff-no-rj",
    thumbnail: "https://img.youtube.com/vi/oEWnPbRvOrY/hqdefault.jpg",
    duration: "0:50",
    views: "22K views",
    timeAgo: "4 hours ago",
    watchedDate: new Date(Date.now() - 4 * 60 * 60 * 1000),
    type: "short",
  },
  {
    id: "sh5",
    videoId: "o38RKuY_AUU",
    title: "সিদ্দীকে আকবার রা.-এর দৃষ্টিতে প্রিয় নবী সা.",
    channel: "Dr. Mohammad Monzur-E-Elahi",
    channelId: "monzur",
    channelAvatar: "https://yt3.googleusercontent.com/ytc/AIdro_lLp3SxQeehJxSmd_QCmSxpFBj4k-7X-brif7v9Jz0rBg=s160-c-k-c0x00ffffff-no-rj",
    thumbnail: "https://img.youtube.com/vi/o38RKuY_AUU/hqdefault.jpg",
    duration: "0:55",
    views: "18K views",
    timeAgo: "5 hours ago",
    watchedDate: new Date(Date.now() - 5 * 60 * 60 * 1000),
    type: "short",
  },
  {
    id: "sh6",
    videoId: "Kk1_-T-8MFU",
    title: "মহান আল্লাহ'র কাছে চাওয়ার নিয়ম",
    channel: "Dr. Khandaker Abdullah Jahangir Rh.",
    channelId: "abdullah-jahangir",
    channelAvatar: "https://yt3.googleusercontent.com/stJnVilfKhMtBiIq_hXTu-9DnanUT0GNtmsRePmQvLAi6c7bhXoIIHGlYL0HqUrdEjrL0KFs7Q=s160-c-k-c0x00ffffff-no-rj",
    thumbnail: "https://img.youtube.com/vi/Kk1_-T-8MFU/hqdefault.jpg",
    duration: "0:48",
    views: "42K views",
    timeAgo: "6 hours ago",
    watchedDate: new Date(Date.now() - 6 * 60 * 60 * 1000),
    type: "short",
  },
  {
    id: "sh7",
    videoId: "hHpoYE-v6og",
    title: "রোগ-ব্যাধিতে ধৈর্য ধারণ করা",
    channel: "Dr. Khandaker Abdullah Jahangir Rh.",
    channelId: "abdullah-jahangir",
    channelAvatar: "https://yt3.googleusercontent.com/stJnVilfKhMtBiIq_hXTu-9DnanUT0GNtmsRePmQvLAi6c7bhXoIIHGlYL0HqUrdEjrL0KFs7Q=s160-c-k-c0x00ffffff-no-rj",
    thumbnail: "https://img.youtube.com/vi/hHpoYE-v6og/hqdefault.jpg",
    duration: "0:42",
    views: "28K views",
    timeAgo: "7 hours ago",
    watchedDate: new Date(Date.now() - 7 * 60 * 60 * 1000),
    type: "short",
  },
  {
    id: "sh8",
    videoId: "8YfQCDjlQsc",
    title: "ইমামের দূর্ব্যবহারের কারণে কেউ ওই মাসজিদে না গেলে কি অন্যায় হবে?",
    channel: "Dr. Mohammad Monzur-E-Elahi",
    channelId: "monzur",
    channelAvatar: "https://yt3.googleusercontent.com/ytc/AIdro_lLp3SxQeehJxSmd_QCmSxpFBj4k-7X-brif7v9Jz0rBg=s160-c-k-c0x00ffffff-no-rj",
    thumbnail: "https://img.youtube.com/vi/8YfQCDjlQsc/hqdefault.jpg",
    duration: "0:51",
    views: "50K views",
    timeAgo: "8 hours ago",
    watchedDate: new Date(Date.now() - 8 * 60 * 60 * 1000),
    type: "short",
  },
  {
    id: "sh9",
    videoId: "MBxDbbkk0gQ",
    title: "তাওহীদের গুরুত্ব ও তাৎপর্য",
    channel: "Dr. Mohammad Monzur-E-Elahi",
    channelId: "monzur",
    channelAvatar: "https://yt3.googleusercontent.com/ytc/AIdro_lLp3SxQeehJxSmd_QCmSxpFBj4k-7X-brif7v9Jz0rBg=s160-c-k-c0x00ffffff-no-rj",
    thumbnail: "https://img.youtube.com/vi/MBxDbbkk0gQ/hqdefault.jpg",
    duration: "0:59",
    views: "12K views",
    timeAgo: "9 hours ago",
    watchedDate: new Date(Date.now() - 9 * 60 * 60 * 1000),
    type: "short",
  },
  {
    id: "sh10",
    videoId: "goHfO28fE-A",
    title: "সালাতের গুরুত্ব ও ফজিলত",
    channel: "Dr. Khandaker Abdullah Jahangir Rh.",
    channelId: "abdullah-jahangir",
    channelAvatar: "https://yt3.googleusercontent.com/stJnVilfKhMtBiIq_hXTu-9DnanUT0GNtmsRePmQvLAi6c7bhXoIIHGlYL0HqUrdEjrL0KFs7Q=s160-c-k-c0x00ffffff-no-rj",
    thumbnail: "https://img.youtube.com/vi/goHfO28fE-A/hqdefault.jpg",
    duration: "0:57",
    views: "30K views",
    timeAgo: "10 hours ago",
    watchedDate: new Date(Date.now() - 10 * 60 * 60 * 1000),
    type: "short",
  },
  {
    id: "sh19",
    videoId: "PUwTf64igQk",
    title: "ইসলামে দানের গুরুত্ব",
    channel: "Dr. Khandaker Abdullah Jahangir Rh.",
    channelId: "abdullah-jahangir",
    channelAvatar: "https://yt3.googleusercontent.com/stJnVilfKhMtBiIq_hXTu-9DnanUT0GNtmsRePmQvLAi6c7bhXoIIHGlYL0HqUrdEjrL0KFs7Q=s160-c-k-c0x00ffffff-no-rj",
    thumbnail: "https://img.youtube.com/vi/PUwTf64igQk/hqdefault.jpg",
    duration: "0:54",
    views: "20K views",
    timeAgo: "12 hours ago",
    watchedDate: new Date(Date.now() - 12 * 60 * 60 * 1000),
    type: "short",
  },
  {
    id: "sh20",
    videoId: "oEWnPbRvOrY",
    title: "ইবাদতের মূল বিষয়",
    channel: "Dr. Mohammad Monzur-E-Elahi",
    channelId: "monzur",
    channelAvatar: "https://yt3.googleusercontent.com/ytc/AIdro_lLp3SxQeehJxSmd_QCmSxpFBj4k-7X-brif7v9Jz0rBg=s160-c-k-c0x00ffffff-no-rj",
    thumbnail: "https://img.youtube.com/vi/oEWnPbRvOrY/hqdefault.jpg",
    duration: "0:56",
    views: "18K views",
    timeAgo: "14 hours ago",
    watchedDate: new Date(Date.now() - 14 * 60 * 60 * 1000),
    type: "short",
  },
  {
    id: "sh21",
    videoId: "o38RKuY_AUU",
    title: "আল্লাহর ভয় ও ভালোবাসা",
    channel: "Dr. Mohammad Monzur-E-Elahi",
    channelId: "monzur",
    channelAvatar: "https://yt3.googleusercontent.com/ytc/AIdro_lLp3SxQeehJxSmd_QCmSxpFBj4k-7X-brif7v9Jz0rBg=s160-c-k-c0x00ffffff-no-rj",
    thumbnail: "https://img.youtube.com/vi/o38RKuY_AUU/hqdefault.jpg",
    duration: "0:53",
    views: "16K views",
    timeAgo: "16 hours ago",
    watchedDate: new Date(Date.now() - 16 * 60 * 60 * 1000),
    type: "short",
  },
  {
    id: "sh22",
    videoId: "Kk1_-T-8MFU",
    title: "তাকওয়ার পথে চলা",
    channel: "Dr. Khandaker Abdullah Jahangir Rh.",
    channelId: "abdullah-jahangir",
    channelAvatar: "https://yt3.googleusercontent.com/stJnVilfKhMtBiIq_hXTu-9DnanUT0GNtmsRePmQvLAi6c7bhXoIIHGlYL0HqUrdEjrL0KFs7Q=s160-c-k-c0x00ffffff-no-rj",
    thumbnail: "https://img.youtube.com/vi/Kk1_-T-8MFU/hqdefault.jpg",
    duration: "0:49",
    views: "14K views",
    timeAgo: "18 hours ago",
    watchedDate: new Date(Date.now() - 18 * 60 * 60 * 1000),
    type: "short",
  },
  {
    id: "sh23",
    videoId: "hHpoYE-v6og",
    title: "মুসলিম ভাইয়ের হক",
    channel: "Dr. Khandaker Abdullah Jahangir Rh.",
    channelId: "abdullah-jahangir",
    channelAvatar: "https://yt3.googleusercontent.com/stJnVilfKhMtBiIq_hXTu-9DnanUT0GNtmsRePmQvLAi6c7bhXoIIHGlYL0HqUrdEjrL0KFs7Q=s160-c-k-c0x00ffffff-no-rj",
    thumbnail: "https://img.youtube.com/vi/hHpoYE-v6og/hqdefault.jpg",
    duration: "0:58",
    views: "19K views",
    timeAgo: "20 hours ago",
    watchedDate: new Date(Date.now() - 20 * 60 * 60 * 1000),
    type: "short",
  },
];

// Shorts for Yesterday (5 shorts)
const shortsYesterdayData = [
  {
    id: "sh11",
    videoId: "PUwTf64igQk",
    title: "ইসলামে ভ্রাতৃত্বের শিক্ষা",
    channel: "Dr. Khandaker Abdullah Jahangir Rh.",
    channelId: "abdullah-jahangir",
    channelAvatar: "https://yt3.googleusercontent.com/stJnVilfKhMtBiIq_hXTu-9DnanUT0GNtmsRePmQvLAi6c7bhXoIIHGlYL0HqUrdEjrL0KFs7Q=s160-c-k-c0x00ffffff-no-rj",
    thumbnail: "https://img.youtube.com/vi/PUwTf64igQk/hqdefault.jpg",
    duration: "0:52",
    views: "35K views",
    timeAgo: "1 day ago",
    watchedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    type: "short",
  },
  {
    id: "sh12",
    videoId: "oEWnPbRvOrY",
    title: "কুরআন তিলাওয়াতের ফজিলত",
    channel: "Dr. Mohammad Monzur-E-Elahi",
    channelId: "monzur",
    channelAvatar: "https://yt3.googleusercontent.com/ytc/AIdro_lLp3SxQeehJxSmd_QCmSxpFBj4k-7X-brif7v9Jz0rBg=s160-c-k-c0x00ffffff-no-rj",
    thumbnail: "https://img.youtube.com/vi/oEWnPbRvOrY/hqdefault.jpg",
    duration: "0:50",
    views: "22K views",
    timeAgo: "1 day ago",
    watchedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    type: "short",
  },
  {
    id: "sh13",
    videoId: "o38RKuY_AUU",
    title: "রাসূল (সা.) এর জীবনাদর্শ",
    channel: "Dr. Mohammad Monzur-E-Elahi",
    channelId: "monzur",
    channelAvatar: "https://yt3.googleusercontent.com/ytc/AIdro_lLp3SxQeehJxSmd_QCmSxpFBj4k-7X-brif7v9Jz0rBg=s160-c-k-c0x00ffffff-no-rj",
    thumbnail: "https://img.youtube.com/vi/o38RKuY_AUU/hqdefault.jpg",
    duration: "0:55",
    views: "18K views",
    timeAgo: "1 day ago",
    watchedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    type: "short",
  },
  {
    id: "sh14",
    videoId: "Kk1_-T-8MFU",
    title: "দোয়া কবুলের সময়সমূহ",
    channel: "Dr. Khandaker Abdullah Jahangir Rh.",
    channelId: "abdullah-jahangir",
    channelAvatar: "https://yt3.googleusercontent.com/stJnVilfKhMtBiIq_hXTu-9DnanUT0GNtmsRePmQvLAi6c7bhXoIIHGlYL0HqUrdEjrL0KFs7Q=s160-c-k-c0x00ffffff-no-rj",
    thumbnail: "https://img.youtube.com/vi/Kk1_-T-8MFU/hqdefault.jpg",
    duration: "0:48",
    views: "42K views",
    timeAgo: "1 day ago",
    watchedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    type: "short",
  },
  {
    id: "sh15",
    videoId: "hHpoYE-v6og",
    title: "সবর ও শোকরের গুরুত্ব",
    channel: "Dr. Khandaker Abdullah Jahangir Rh.",
    channelId: "abdullah-jahangir",
    channelAvatar: "https://yt3.googleusercontent.com/stJnVilfKhMtBiIq_hXTu-9DnanUT0GNtmsRePmQvLAi6c7bhXoIIHGlYL0HqUrdEjrL0KFs7Q=s160-c-k-c0x00ffffff-no-rj",
    thumbnail: "https://img.youtube.com/vi/hHpoYE-v6og/hqdefault.jpg",
    duration: "0:42",
    views: "28K views",
    timeAgo: "1 day ago",
    watchedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    type: "short",
  },
];

// Shorts for This Week (3 shorts)
const shortsWeekData = [
  {
    id: "sh16",
    videoId: "8YfQCDjlQsc",
    title: "ইসলামে জ্ঞানের গুরুত্ব",
    channel: "Dr. Mohammad Monzur-E-Elahi",
    channelId: "monzur",
    channelAvatar: "https://yt3.googleusercontent.com/ytc/AIdro_lLp3SxQeehJxSmd_QCmSxpFBj4k-7X-brif7v9Jz0rBg=s160-c-k-c0x00ffffff-no-rj",
    thumbnail: "https://img.youtube.com/vi/8YfQCDjlQsc/hqdefault.jpg",
    duration: "0:51",
    views: "50K views",
    timeAgo: "3 days ago",
    watchedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    type: "short",
  },
  {
    id: "sh17",
    videoId: "MBxDbbkk0gQ",
    title: "ঈমানের শাখা প্রশাখা",
    channel: "Dr. Khandaker Abdullah Jahangir Rh.",
    channelId: "abdullah-jahangir",
    channelAvatar: "https://yt3.googleusercontent.com/stJnVilfKhMtBiIq_hXTu-9DnanUT0GNtmsRePmQvLAi6c7bhXoIIHGlYL0HqUrdEjrL0KFs7Q=s160-c-k-c0x00ffffff-no-rj",
    thumbnail: "https://img.youtube.com/vi/MBxDbbkk0gQ/hqdefault.jpg",
    duration: "0:58",
    views: "15K views",
    timeAgo: "5 days ago",
    watchedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    type: "short",
  },
  {
    id: "sh18",
    videoId: "goHfO28fE-A",
    title: "হালাল রিজিকের গুরুত্ব",
    channel: "Dr. Mohammad Monzur-E-Elahi",
    channelId: "monzur",
    channelAvatar: "https://yt3.googleusercontent.com/ytc/AIdro_lLp3SxQeehJxSmd_QCmSxpFBj4k-7X-brif7v9Jz0rBg=s160-c-k-c0x00ffffff-no-rj",
    thumbnail: "https://img.youtube.com/vi/goHfO28fE-A/hqdefault.jpg",
    duration: "0:45",
    views: "25K views",
    timeAgo: "6 days ago",
    watchedDate: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
    type: "short",
  },
];

// All shorts combined
const allShortsData = [...shortsTodayData, ...shortsYesterdayData, ...shortsWeekData];

// Convert video data to history format with dates
const videoHistoryData = [
  ...videoData.slice(0, 5).map((v: VideoItem, index: number) => ({
    ...v,
    type: "video" as const,
    thumbnail: `https://img.youtube.com/vi/${v.videoId}/hqdefault.jpg`,
    watchedDate: new Date(Date.now() - (index + 1) * 2 * 60 * 60 * 1000),
  })),
  ...videoData.slice(5, 8).map((v: VideoItem, index: number) => ({
    ...v,
    type: "video" as const,
    thumbnail: `https://img.youtube.com/vi/${v.videoId}/hqdefault.jpg`,
    watchedDate: new Date(Date.now() - (1 * 24 * 60 * 60 * 1000) - index * 3 * 60 * 60 * 1000),
  })),
  ...videoData.slice(8, 12).map((v: VideoItem, index: number) => ({
    ...v,
    type: "video" as const,
    thumbnail: `https://img.youtube.com/vi/${v.videoId}/hqdefault.jpg`,
    watchedDate: new Date(Date.now() - (3 + index) * 24 * 60 * 60 * 1000),
  })),
  ...videoData.slice(12, 14).map((v: VideoItem) => ({
    ...v,
    type: "video" as const,
    thumbnail: `https://img.youtube.com/vi/${v.videoId}/hqdefault.jpg`,
    watchedDate: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000),
  })),
];

const allHistoryData = [...videoHistoryData, ...allShortsData];

const categories = [
  { id: "all", label: "All", count: allHistoryData.length },
  { id: "shorts", label: "Shorts", count: allShortsData.length },
  { id: "videos", label: "Videos", count: videoHistoryData.length },
];

function VideoSkeleton() {
  return (
    <div className="flex gap-3 py-3">
      <Skeleton className="w-36 sm:w-44 md:w-60 aspect-video rounded-lg flex-shrink-0" />
      <div className="flex-1 min-w-0 space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-3 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  );
}

function getDateGroup(date: Date): string {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
  const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
  const videoDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  if (videoDate.getTime() === today.getTime()) return "Today";
  if (videoDate.getTime() === yesterday.getTime()) return "Yesterday";
  if (videoDate >= weekAgo) return "This Week";
  if (videoDate >= monthAgo) return "This Month";
  return "Older";
}

function ShortsRow({ shorts }: { shorts: any[] }) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const checkScroll = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    setShowLeftArrow(el.scrollLeft > 10);
    setShowRightArrow(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (el) {
      el.addEventListener('scroll', checkScroll);
      checkScroll();
      return () => el.removeEventListener('scroll', checkScroll);
    }
  }, [shorts]);

  const scroll = (direction: 'left' | 'right') => {
    const el = scrollContainerRef.current;
    if (!el) return;
    el.scrollBy({ left: direction === 'left' ? -200 : 200, behavior: 'smooth' });
  };

  if (!shorts.length) return null;

  return (
    <div className="relative group/shorts">
      {/* Arrow buttons - only visible on desktop (md and up) */}
      {!isMobile && showLeftArrow && (
        <button onClick={() => scroll('left')} className="absolute -left-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-background shadow-md hidden md:flex items-center justify-center hover:bg-muted transition-colors border border-border">
          <ChevronLeft className="h-6 w-6" />
        </button>
      )}
      {!isMobile && showRightArrow && (
        <button onClick={() => scroll('right')} className="absolute -right-5 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-background shadow-md hidden md:flex items-center justify-center hover:bg-muted transition-colors border border-border">
          <ChevronRight className="h-6 w-6" />
        </button>
      )}

      {/* Shorts Container - draggable on mobile */}
      <div 
        ref={scrollContainerRef} 
        className="flex gap-2 overflow-x-auto scrollbar-none pb-2 px-0.5 touch-pan-x" 
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
      >
        {shorts.map((short) => (
          <Link key={short.id} href={`/shorts?v=${short.videoId}`} className="flex-shrink-0 group/card w-[140px] sm:w-[150px] md:w-[170px]">
            <div className="relative w-full aspect-[9/16] rounded-xl overflow-hidden">
              <Image src={short.thumbnail} alt={short.title} fill className="object-cover" />
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity">
                <div className="bg-black/60 rounded-full p-2"><Play className="h-5 w-5 text-white fill-white" /></div>
              </div>
              <div className="absolute bottom-1.5 right-1.5 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded font-medium">{short.duration}</div>
            </div>
            <h4 className="text-xs sm:text-sm font-medium line-clamp-2 mt-1.5 group-hover/card:text-primary transition-colors">{short.title}</h4>
            <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">{short.views} • {short.timeAgo}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default function HistoryPage() {
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [videos, setVideos] = useState(allHistoryData);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const handleRemove = (videoId: string) => {
    setVideos((prev) => prev.filter((v) => v.id !== videoId));
    toast.success("Removed from History");
  };

  const filteredVideos = useMemo(() => {
    let list = videos.filter((v) =>
      v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.channel.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (activeCategory === "videos") list = list.filter((v) => v.type === "video");
    else if (activeCategory === "shorts") list = list.filter((v) => v.type === "short");

    list.sort((a, b) => {
      const dateA = a.watchedDate ? new Date(a.watchedDate).getTime() : 0;
      const dateB = b.watchedDate ? new Date(b.watchedDate).getTime() : 0;
      return dateB - dateA;
    });

    return list;
  }, [videos, searchQuery, activeCategory]);

  const groupedVideos = useMemo(() => {
    const groups: { [key: string]: { shorts: any[]; videos: any[] } } = {};
    ["Today", "Yesterday", "This Week", "This Month", "Older"].forEach(date => {
      groups[date] = { shorts: [], videos: [] };
    });

    filteredVideos.forEach((video) => {
      const group = video.watchedDate ? getDateGroup(new Date(video.watchedDate)) : "Older";
      if (!groups[group]) groups[group] = { shorts: [], videos: [] };
      if (video.type === "short") groups[group].shorts.push(video);
      else groups[group].videos.push(video);
    });

    Object.keys(groups).forEach(key => {
      if (groups[key].shorts.length === 0 && groups[key].videos.length === 0) delete groups[key];
    });

    return groups;
  }, [filteredVideos]);

  const handleShare = (video: any) => {
    const url = video.type === "short"
      ? `${window.location.origin}/shorts?v=${video.videoId}`
      : `${window.location.origin}/videos/${video.channel}/${video.videoId || video.id}`;
    setShareUrl(url);
    setShareModalOpen(true);
  };

  const liveCategories = categories.map((cat) => ({
    ...cat,
    count: cat.id === "all" ? videos.length : cat.id === "shorts" ? videos.filter((v) => v.type === "short").length : videos.filter((v) => v.type === "video").length,
  }));

  const renderVideoItem = (video: any) => (
    <div key={video.id} className="flex gap-2 sm:gap-3 group py-2 hover:bg-muted/30 rounded-lg px-2 -mx-2 transition-colors w-full">
      <Link href={video.type === "short" ? `/shorts?v=${video.videoId}` : `/videos/${video.channel}/${video.videoId || video.id}`} className="relative w-36 sm:w-44 md:w-48 lg:w-60 aspect-video flex-shrink-0 rounded-lg overflow-hidden">
        <Image src={video.thumbnail} alt={video.title} fill className="object-cover" />
        <div className="absolute bottom-1.5 right-1.5 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded font-medium">{video.duration}</div>
        <div className="absolute inset-0 bg-black/20 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="bg-black/60 rounded-full p-2"><Play className="h-5 w-5 text-white fill-white" /></div>
        </div>
      </Link>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <Link href={video.type === "short" ? `/shorts?v=${video.videoId}` : `/videos/${video.channel}/${video.videoId || video.id}`}>
              <h3 className="font-medium text-xs sm:text-sm line-clamp-2 hover:text-primary transition-colors break-words">{video.title}</h3>
            </Link>
            <div className="flex items-center gap-2 mt-1">
              <Link href={`/channel-new/${video.channelId}`} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground min-w-0">
                <Avatar className="h-4 w-4 sm:h-5 sm:w-5 flex-shrink-0">
                  <AvatarImage src={video.channelAvatar} />
                  <AvatarFallback className="text-[10px]">{video.channel.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="text-[10px] sm:text-xs truncate">{video.channel}</span>
              </Link>
            </div>
            <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5">{video.views} • {video.timeAgo}</p>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="p-1.5 rounded-full hover:bg-muted transition-colors">
                  <MoreVertical className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 sm:w-56 rounded-xl">
                <DropdownMenuItem onClick={() => router.push(video.type === "short" ? `/shorts?v=${video.videoId}` : `/videos/${video.channel}/${video.videoId || video.id}`)} className="text-xs sm:text-sm">
                  <Play className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-2 sm:mr-3" /> Play now
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer text-xs sm:text-sm" onClick={() => toast.success("Added to Watch Later (demo)")}>
                  <Clock className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-2 sm:mr-3" /> Save to Watch later
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer text-xs sm:text-sm" onClick={() => toast.success("Added to playlist (demo)")}>
                  <Bookmark className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-2 sm:mr-3" /> Save to playlist
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer text-xs sm:text-sm" onClick={() => handleShare(video)}>
                  <Share className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-2 sm:mr-3" /> Share
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleRemove(video.id)} className="text-red-600 dark:text-red-400 text-xs sm:text-sm">
                  <Trash2 className="h-3.5 w-3.5 sm:h-4 sm:w-4 mr-2 sm:mr-3" /> Remove from History
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="px-3 sm:px-4 md:px-6 py-4 md:py-6 max-w-4xl">
        {isLoading ? (
          <div className="mt-14 sm:mt-16">
            <Skeleton className="h-8 w-48 mb-4" />
            <div className="flex gap-2 mb-4">
              <Skeleton className="h-8 w-16 rounded-full" />
              <Skeleton className="h-8 w-16 rounded-full" />
              <Skeleton className="h-8 w-16 rounded-full" />
            </div>
            <Skeleton className="h-10 w-full max-w-md rounded-full mb-4" />
            <VideoSkeleton />
            <VideoSkeleton />
            <VideoSkeleton />
          </div>
        ) : videos.length === 0 ? (
          <div className="text-center py-16 mt-14 sm:mt-16">
            <History className="h-12 sm:h-16 w-12 sm:w-16 mx-auto text-muted-foreground/30 mb-4" />
            <h2 className="text-lg sm:text-xl font-semibold mb-2">History is empty</h2>
            <p className="text-sm text-muted-foreground">Videos you watch will appear here</p>
            <Button className="mt-4 rounded-full text-sm" onClick={() => router.push("/")}>Browse videos</Button>
          </div>
        ) : (
          <div className="mt-14 sm:mt-16">
            {/* Header */}
            <h1 className="text-2xl sm:text-2xl font-bold mb-4">Watch history</h1>

            {/* Category chips */}
            <div className="flex gap-1.5 sm:gap-2 mb-3 sm:mb-4 overflow-x-auto pb-1 scrollbar-none">
              {liveCategories.map((cat) => (
                <button key={cat.id} onClick={() => setActiveCategory(cat.id)} className={cn(
                  "px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-colors",
                  activeCategory === cat.id ? "bg-foreground text-background" : "bg-muted hover:bg-muted/80 text-foreground"
                )}>
                  {cat.label} <span className="text-xs opacity-70">({cat.count})</span>
                </button>
              ))}
            </div>

            {/* Search bar */}
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-5">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
                <input type="text" placeholder="Search watch history" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 sm:pl-10 pr-8 sm:pr-10 py-1.5 sm:py-2 bg-muted/50 rounded-full text-xs sm:text-sm outline-none focus:bg-muted transition-colors" />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    <X className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Content */}
            {filteredVideos.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-sm text-muted-foreground">{searchQuery ? "No results found" : "No videos in this list"}</p>
              </div>
            ) : (
              <div className="space-y-5 sm:space-y-6">
                {Object.entries(groupedVideos).map(([dateGroup, { shorts, videos: dateVideos }]) => (
                  <div key={dateGroup}>
                    <h3 className="text-xs sm:text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2 sm:mb-3 px-2">{dateGroup}</h3>
                    <ShortsRow shorts={shorts} />
                    {dateVideos.length > 0 && (
                      <div className={`space-y-0.5 sm:space-y-1 ${shorts.length > 0 ? 'mt-3 sm:mt-4' : ''}`}>
                        {dateVideos.map((video) => renderVideoItem(video))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <ShareModal isOpen={shareModalOpen} onClose={() => setShareModalOpen(false)} videoUrl={shareUrl} />
    </div>
  );
}