// app/history/page.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
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

// Real shorts data (same as shorts page)
const shortsHistoryData = [
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
    timeAgo: "2 weeks ago",
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
    timeAgo: "3 days ago",
    type: "short",
  },
  {
    id: "sh3",
    videoId: "PUwTf64igQk",
    title: "এভাবে ঈমান নষ্ট করছেন নাতো?",
    channel: "Dr. Khandaker Abdullah Jahangir Rh.",
    channelId: "abdullah",
    channelAvatar: "https://yt3.googleusercontent.com/stJnVilfKhMtBiIq_hXTu-9DnanUT0GNtmsRePmQvLAi6c7bhXoIIHGlYL0HqUrdEjrL0KFs7Q=s160-c-k-c0x00ffffff-no-rj",
    thumbnail: "https://img.youtube.com/vi/PUwTf64igQk/hqdefault.jpg",
    duration: "0:52",
    views: "35K views",
    timeAgo: "4 days ago",
    type: "short",
  },
];

// Convert video data to history format
const videoHistoryData = videoData.slice(0, 8).map((v: VideoItem) => ({
  ...v,
  type: "video" as const,
  thumbnail: `https://img.youtube.com/vi/${v.videoId}/hqdefault.jpg`,
}));

// Combined history data
const allHistoryData = [...videoHistoryData, ...shortsHistoryData];

const categories = [
  { id: "all", label: "All", count: allHistoryData.length },
  { id: "videos", label: "Videos", count: allHistoryData.filter((v) => v.type === "video").length },
  { id: "shorts", label: "Shorts", count: allHistoryData.filter((v) => v.type === "short").length },
];

function VideoSkeleton() {
  return (
    <div className="flex gap-3 py-3">
      <Skeleton className="w-44 md:w-60 aspect-video rounded-lg flex-shrink-0" />
      <div className="flex-1 min-w-0 space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-3 w-32" />
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
    let list = videos.filter(
      (v) =>
        v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.channel.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (activeCategory === "videos") {
      list = list.filter((v) => v.type === "video");
    } else if (activeCategory === "shorts") {
      list = list.filter((v) => v.type === "short");
    }
    return list;
  }, [videos, searchQuery, activeCategory]);

  const handlePlayAll = () => {
    const firstVideo = videos.find((v) => v.type === "video");
    if (firstVideo) {
      router.push(`/videos/${firstVideo.channel}/${firstVideo.videoId || firstVideo.id}`);
    }
  };

  const handleShare = (video: any) => {
    const url = video.type === "short"
      ? `${window.location.origin}/shorts`
      : `${window.location.origin}/videos/${video.channel}/${video.videoId || video.id}`;
    setShareUrl(url);
    setShareModalOpen(true);
  };

  // Update category counts dynamically
  const liveCategories = categories.map((cat) => ({
    ...cat,
    count:
      cat.id === "all"
        ? videos.length
        : cat.id === "videos"
        ? videos.filter((v) => v.type === "video").length
        : videos.filter((v) => v.type === "short").length,
  }));

  // Get first video for hero card (prefer video type)
  const heroVideo = videos.find((v) => v.type === "video") || videos[0];

  return (
    <div className="min-h-screen bg-background">
      <div className="px-4 md:px-4 py-2 md:py-6 max-w-full">
        {isLoading ? (
          <div className="flex flex-col md:flex-row gap-6 mt-16">
            <Skeleton className="w-full md:w-[340px] h-[60vh] rounded-xl" />
            <div className="flex-1 space-y-4">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-64" />
              <div className="flex gap-2">
                <Skeleton className="h-8 w-16 rounded-full" />
                <Skeleton className="h-8 w-16 rounded-full" />
                <Skeleton className="h-8 w-16 rounded-full" />
              </div>
              <Skeleton className="h-10 w-full rounded-full" />
              <VideoSkeleton />
              <VideoSkeleton />
              <VideoSkeleton />
            </div>
          </div>
        ) : videos.length === 0 ? (
          <div className="text-center py-16 mt-16">
            <History className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
            <h2 className="text-xl font-semibold mb-2">History is empty</h2>
            <p className="text-muted-foreground">
              Videos you watch will appear here
            </p>
            <Button
              className="mt-4 rounded-full"
              onClick={() => router.push("/")}
            >
              Browse videos
            </Button>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-0 md:gap-6 mt-16">
            {/* LEFT COLUMN – Fixed card with last watched video */}
            <div className="md:w-[340px] flex-shrink-0 md:sticky md:top-[80px] md:self-start md:h-[calc(100vh-80px)] md:overflow-hidden">
              <div className="relative h-full rounded-xl overflow-hidden bg-card border shadow-sm">
                {heroVideo && (
                  <>
                    <Image
                      src={heroVideo.thumbnail}
                      alt=""
                      fill
                      className="object-cover scale-110 blur-md opacity-40"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                    <div className="relative z-10 h-full flex flex-col justify-center p-8 text-white text-center">
                      <div className="mb-6">
                        <h2 className="text-2xl md:text-3xl font-bold drop-shadow-lg">History</h2>
                        <p className="text-sm text-white/80 mt-1">
                          {videos.length} videos
                        </p>
                      </div>
                      {!isMobile && heroVideo && (
                        <Link
                          href={`/videos/${heroVideo.channel}/${heroVideo.videoId || heroVideo.id}`}
                          className="block w-full mb-6 group"
                        >
                          <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black/20 backdrop-blur-sm border border-white/10">
                            <Image
                              src={heroVideo.thumbnail}
                              alt={heroVideo.title}
                              fill
                              className="object-cover transition-transform group-hover:scale-105"
                            />
                            <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded font-medium">
                              {heroVideo.duration}
                            </div>
                            <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <div className="bg-black/60 rounded-full p-3">
                                <Play className="h-7 w-7 text-white fill-white" />
                              </div>
                            </div>
                          </div>
                          <div className="mt-3 text-left">
                            <p className="text-sm font-medium line-clamp-2 group-hover:underline">
                              {heroVideo.title}
                            </p>
                            <p className="text-xs text-white/70 mt-0.5">
                              {heroVideo.channel}
                            </p>
                            <p className="text-xs text-white/50 mt-0.5">
                              {heroVideo.views} • {heroVideo.timeAgo}
                            </p>
                          </div>
                        </Link>
                      )}
                      <div className="space-y-2 w-full">
                        <Button
                          onClick={handlePlayAll}
                          className="rounded-full gap-2 bg-white/90 text-black hover:bg-white w-full"
                        >
                          <Play className="h-5 w-5 fill-current" /> Play all
                        </Button>
                      </div>
                    </div>
                  </>
                )}
                {!heroVideo && (
                  <div className="h-full bg-muted flex items-center justify-center">
                    <History className="h-12 w-12 text-muted-foreground/30" />
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT COLUMN – Scrollable list */}
            <div className="flex-1 min-w-0 mt-6 md:mt-0 overflow-y-auto">
              <div className="flex items-center gap-3 mb-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search History"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-10 py-2 bg-muted/50 rounded-full text-sm outline-none focus:bg-muted transition-colors"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              <div className="flex gap-2 mb-4 overflow-x-auto pb-1 scrollbar-none">
                {liveCategories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={cn(
                      "px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
                      activeCategory === cat.id
                        ? "bg-foreground text-background"
                        : "bg-muted hover:bg-muted/80 text-foreground"
                    )}
                  >
                    {cat.label} <span className="text-xs opacity-70">({cat.count})</span>
                  </button>
                ))}
              </div>

              {filteredVideos.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    {searchQuery ? "No results found" : "No videos in this list"}
                  </p>
                </div>
              ) : (
                <div className="space-y-1">
                  {filteredVideos.map((video) => (
                    <div
                      key={video.id}
                      className="flex gap-3 group py-2 hover:bg-muted/30 rounded-lg px-2 -mx-2 transition-colors w-full"
                    >
                      <Link
                        href={
                          video.type === "short"
                            ? "/shorts"
                            : `/videos/${video.channel}/${video.videoId || video.id}`
                        }
                        className={cn(
                          "relative flex-shrink-0 rounded-lg overflow-hidden",
                          video.type === "short"
                            ? "w-28 md:w-36 aspect-[9/16]"
                            : "w-44 md:w-60 aspect-video"
                        )}
                      >
                        <Image
                          src={video.thumbnail}
                          alt={video.title}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute bottom-1.5 right-1.5 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded font-medium">
                          {video.duration}
                        </div>
                        <div className="absolute inset-0 bg-black/20 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="bg-black/60 rounded-full p-2">
                            <Play className="h-5 w-5 text-white fill-white" />
                          </div>
                        </div>
                        {/* Short badge */}
                        {/* {video.type === "short" && (
                          <div className="absolute top-1.5 left-1.5 bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded font-medium">
                            SHORT
                          </div>
                        )} */}
                      </Link>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <Link
                              href={
                                video.type === "short"
                                  ? "/shorts"
                                  : `/videos/${video.channel}/${video.videoId || video.id}`
                              }
                            >
                              <h3 className="font-medium text-sm line-clamp-2 hover:text-primary transition-colors">
                                {video.title}
                              </h3>
                            </Link>
                            <div className="flex items-center gap-2 mt-1">
                              <Link
                                href={`/channel-new/${video.channelId}`}
                                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
                              >
                                <Avatar className="h-5 w-5">
                                  <AvatarImage src={video.channelAvatar} />
                                  <AvatarFallback className="text-[10px]">
                                    {video.channel.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <span>{video.channel}</span>
                              </Link>
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {video.views} • {video.timeAgo}
                            </p>
                          </div>
                          <div className="flex items-center gap-1 flex-shrink-0">
                            <button
                              onClick={() => handleRemove(video.id)}
                              className="p-2 rounded-full hover:bg-muted transition-colors"
                              title="Remove from History"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <button className="p-1.5 rounded-full hover:bg-muted transition-colors">
                                  <MoreVertical className="h-4 w-4 text-muted-foreground" />
                                </button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent
                                align="end"
                                className="w-56 rounded-xl"
                              >
                                <DropdownMenuItem
                                  onClick={() =>
                                    router.push(
                                      video.type === "short"
                                        ? "/shorts"
                                        : `/videos/${video.channel}/${video.videoId || video.id}`
                                    )
                                  }
                                >
                                  <Play className="h-4 w-4 mr-3" /> Play now
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="cursor-pointer"
                                  onClick={() => toast.success("Added to Watch Later (demo)")}
                                >
                                  <Clock className="h-4 w-4 mr-3" /> Save to Watch later
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="cursor-pointer"
                                  onClick={() => toast.success("Added to playlist (demo)")}
                                >
                                  <Bookmark className="h-4 w-4 mr-3" /> Save to playlist
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  className="cursor-pointer"
                                  onClick={() => handleShare(video)}
                                >
                                  <Share className="h-4 w-4 mr-3" /> Share
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleRemove(video.id)}
                                  className="text-red-600 dark:text-red-400"
                                >
                                  <Trash2 className="h-4 w-4 mr-3" /> Remove from History
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
        )}
      </div>

      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        videoUrl={shareUrl}
      />
    </div>
  );
}