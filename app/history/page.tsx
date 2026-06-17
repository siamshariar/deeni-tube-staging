"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Trash2, Search, X, MoreVertical, History, Play, PauseCircle, Settings } from "lucide-react";
import AppHeader from "@/components/app-header";
import MobileNav from "@/components/mobile-nav";
import DesktopSidebar from "@/components/desktop-sidebar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useMediaQuery } from "@/hooks/use-media-query";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// ─────────── Islamic mock history (no real YouTube) ───────────
const islamicHistoryVideos = [
  {
    id: "hv1",
    title: "সূরা আল-ফাতিহা – তিলাওয়াত ও তাফসীর",
    channel: "কুরআনিক সাউন্ড",
    duration: "12:34",
    views: "3.2M views",
    timeAgo: "Today",
    thumbnail: "https://placehold.co/600x400/111/888?text=Video",
    channelAvatar: "https://placehold.co/100x100/333/fff?text=Q",
    type: "video",
    watchedPercent: 45,
    category: "video",
  },
  {
    id: "hv2",
    title: "সকাল সন্ধ্যার দোয়া – ফজিলত ও আমল",
    channel: "ইসলামিক লেকচার",
    duration: "18:22",
    views: "1.1M views",
    timeAgo: "Today",
    thumbnail: "https://placehold.co/600x400/111/888?text=Video",
    channelAvatar: "https://placehold.co/100x100/333/fff?text=I",
    type: "video",
    watchedPercent: 78,
    category: "video",
  },
  {
    id: "hv3",
    title: "নামাজের নিয়ম – পূর্ণাঙ্গ গাইডলাইন",
    channel: "দ্বীনের পথ",
    duration: "28:10",
    views: "980K views",
    timeAgo: "Yesterday",
    thumbnail: "https://placehold.co/600x400/111/888?text=Video",
    channelAvatar: "https://placehold.co/100x100/333/fff?text=D",
    type: "video",
    watchedPercent: 100,
    category: "video",
  },
  {
    id: "hv4",
    title: "রমজানের প্রস্তুতি – যা কিছু জানা দরকার",
    channel: "শান্তির বার্তা",
    duration: "35:15",
    views: "2.5M views",
    timeAgo: "Last week",
    thumbnail: "https://placehold.co/600x400/111/888?text=Video",
    channelAvatar: "https://placehold.co/100x100/333/fff?text=S",
    type: "video",
    watchedPercent: 100,
    category: "video",
  },
];

const islamicHistoryShorts = [
  {
    id: "hs1",
    title: "ছোট দোয়া বড় সওয়াব #শর্টস",
    channel: "দ্বীনের পথ",
    duration: "0:58",
    views: "1.2M views",
    timeAgo: "Today",
    thumbnail: "https://placehold.co/400x711/111/888?text=Short",
    channelAvatar: "https://placehold.co/100x100/333/fff?text=D",
    type: "short",
    watchedPercent: 100,
    category: "short",
  },
  {
    id: "hs2",
    title: "বিপদে পড়লে এই দোয়াটি পড়ুন #শর্টস",
    channel: "ইসলামিক লেকচার",
    duration: "0:45",
    views: "850K views",
    timeAgo: "Yesterday",
    thumbnail: "https://placehold.co/400x711/111/888?text=Short",
    channelAvatar: "https://placehold.co/100x100/333/fff?text=I",
    type: "short",
    watchedPercent: 100,
    category: "short",
  },
];

const islamicHistoryPodcasts = [
  {
    id: "hp1",
    title: "কুরআনের গল্প – পর্ব ১ (পডকাস্ট)",
    channel: "শান্তির বার্তা",
    duration: "45:12",
    views: "500K views",
    timeAgo: "This week",
    thumbnail: "https://placehold.co/400x400/111/888?text=Podcast",
    channelAvatar: "https://placehold.co/100x100/333/fff?text=S",
    type: "podcast",
    watchedPercent: 90,
    category: "podcast",
  },
  {
    id: "hp2",
    title: "হজের স্মৃতি – অডিও ডায়েরি",
    channel: "জান্নাতের পথিক",
    duration: "1:05:22",
    views: "200K views",
    timeAgo: "Last month",
    thumbnail: "https://placehold.co/400x400/111/888?text=Podcast",
    channelAvatar: "https://placehold.co/100x100/333/fff?text=J",
    type: "podcast",
    watchedPercent: 30,
    category: "podcast",
  },
];

const allHistory = [...islamicHistoryVideos, ...islamicHistoryShorts, ...islamicHistoryPodcasts];

const contentCategories = [
  { id: "all", label: "All" },
  { id: "videos", label: "Videos" },
  { id: "shorts", label: "Shorts" },
  // { id: "podcasts", label: "Podcasts" },
];

// const interactionFilters = [
//   { id: "comments", label: "Comments" },
//   { id: "posts", label: "Posts" },
//   { id: "live_chat", label: "Live chat" },
// ];

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
  );
}

export default function HistoryPage() {
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [videos, setVideos] = useState(allHistory);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleRemoveVideo = (videoId: string) => {
    setVideos(prev => prev.filter(v => v.id !== videoId));
  };

  const handleClearAll = () => {
    setVideos([]);
    setShowClearConfirm(false);
    toast.success("Watch history cleared");
  };

  const togglePauseHistory = () => {
    setIsPaused(!isPaused);
    toast.success(isPaused ? "Watch history resumed" : "Watch history paused");
  };

  const filteredVideos = useMemo(() => {
    let list = videos.filter(v =>
      !searchQuery ||
      v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.channel.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (activeCategory === "videos") {
      list = list.filter(v => v.type === "video");
    } else if (activeCategory === "shorts") {
      list = list.filter(v => v.type === "short");
    } else if (activeCategory === "podcasts") {
      list = list.filter(v => v.type === "podcast");
    }

    return list;
  }, [videos, searchQuery, activeCategory]);

  const groupedVideos = useMemo(() => {
    const groups: Record<string, typeof filteredVideos> = {};
    filteredVideos.forEach(video => {
      const time = video.timeAgo;
      if (!groups[time]) groups[time] = [];
      groups[time].push(video);
    });
    return groups;
  }, [filteredVideos]);

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <div className="flex">
        {/* ─── Desktop Sidebar ─── */}
        <DesktopSidebar className="hidden md:block" />

        {/* ─── Main Content Area (full width after sidebar) ─── */}
        <div className="flex-1 md:pl-[240px] pt-[56px] md:pt-[80px] pb-nav-safe md:pb-6">
          {/* Mobile header */}
          <div className="md:hidden flex items-center gap-3 px-4 py-3 border-b sticky top-[56px] bg-background z-10">
            <button onClick={() => router.back()} className="flex items-center justify-center h-9 w-9 rounded-full hover:bg-muted">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="font-semibold text-lg">Watch History</h1>
          </div>

          {/* Page content */}
          <div className="px-4 md:px-6 py-4 md:py-6">
            {/* Top bar: heading, search, actions */}
            <div className="flex flex-col gap-4 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-3">
                  {!isMobile && <h1 className="text-2xl font-bold">Watch History</h1>}
                  {!isLoading && videos.length > 0 && (
                    <span className="text-sm text-muted-foreground">{videos.length} video{videos.length !== 1 ? 's' : ''}</span>
                  )}
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="relative flex-1 sm:flex-none min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search watch history"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full sm:w-64 pl-10 pr-10 py-2 bg-muted/50 rounded-full text-sm outline-none focus:bg-muted transition-colors"
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
                  {videos.length > 0 && (
                    <>
                      {showClearConfirm ? (
                        <div className="flex items-center gap-2">
                          <Button variant="destructive" size="sm" onClick={handleClearAll} className="rounded-full">Confirm</Button>
                          <Button variant="outline" size="sm" onClick={() => setShowClearConfirm(false)} className="rounded-full">Cancel</Button>
                        </div>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-full transition-colors"
                          onClick={() => setShowClearConfirm(true)}
                        >
                          <Trash2 className="h-4 w-4 mr-1.5" />
                          <span className="hidden sm:inline">Clear all watch history</span>
                          <span className="sm:hidden">Clear all</span>
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </div>

              {/* Extra controls row */}
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className={cn("rounded-full gap-1.5", isPaused && "bg-primary/10 text-primary border-primary/30")}
                  onClick={togglePauseHistory}
                >
                  <PauseCircle className="h-4 w-4" />
                  {isPaused ? "Resume watch history" : "Pause watch history"}
                </Button>
                <Button variant="ghost" size="sm" className="rounded-full gap-1.5" onClick={() => toast.info("Manage history coming soon")}>
                  <Settings className="h-4 w-4" />
                  Manage all history
                </Button>
                {/* {interactionFilters.map(f => (
                  <Button
                    key={f.id}
                    variant="ghost"
                    size="sm"
                    className="rounded-full text-xs"
                    onClick={() => toast.info(`${f.label} filter not active in demo`)}
                  >
                    {f.label}
                  </Button>
                ))} */}
              </div>
            </div>

            {/* Category chips */}
            <div className="flex gap-2 mb-4 overflow-x-auto pb-1 scrollbar-none">
              {contentCategories.map(cat => (
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
                  {cat.label}
                  <span className="text-xs ml-1 opacity-70">
                    ({cat.id === "all"
                      ? videos.length
                      : videos.filter(v => v.type === (cat.id === "videos" ? "video" : cat.id === "shorts" ? "short" : "podcast")).length})
                  </span>
                </button>
              ))}
            </div>

            {/* Video list grouped by time */}
            {isLoading ? (
              <div className="space-y-6">
                <VideoSkeleton />
                <VideoSkeleton />
                <VideoSkeleton />
              </div>
            ) : filteredVideos.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  {searchQuery ? <Search className="h-8 w-8 text-muted-foreground" /> : <History className="h-8 w-8 text-muted-foreground" />}
                </div>
                <h3 className="text-lg font-medium mb-1">{searchQuery ? "No results found" : "Watch history is empty"}</h3>
                <p className="text-muted-foreground mb-4">
                  {searchQuery ? "Try different keywords" : "Videos you watch will appear here"}
                </p>
                {searchQuery ? (
                  <Button variant="outline" className="rounded-full" onClick={() => setSearchQuery("")}>Clear search</Button>
                ) : (
                  <Button className="rounded-full" onClick={() => router.push('/')}>Browse videos</Button>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                {Object.entries(groupedVideos).map(([date, dateVideos]) => (
                  <div key={date}>
                    <h2 className="text-sm font-semibold text-muted-foreground mb-3 px-1">{date}</h2>
                    <div className="space-y-4">
                      {dateVideos.map((video) => (
                        <div key={video.id} className="flex gap-3 group">
                          <Link
                            href={`/videos/${video.channel}/${video.id}`}
                            className={cn(
                              "relative flex-shrink-0 rounded-lg overflow-hidden",
                              video.type === "short" ? "w-28 md:w-36 aspect-[9/16]" :
                              video.type === "podcast" ? "w-40 md:w-48 aspect-square" :
                              "w-40 md:w-56 aspect-video"
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
                            {video.watchedPercent !== undefined && video.watchedPercent < 100 && (
                              <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/30 rounded-full mx-1.5 mb-1.5 overflow-hidden">
                                <div className="h-full bg-red-600 rounded-full" style={{ width: `${video.watchedPercent}%` }} />
                              </div>
                            )}
                          </Link>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <Link href={`/videos/${video.channel}/${video.id}`}>
                                  <h3 className="font-medium text-sm line-clamp-2 hover:text-primary transition-colors">
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
                                <p className="text-xs text-muted-foreground mt-0.5">
                                  {video.views} • {video.timeAgo}
                                </p>
                                {video.watchedPercent !== undefined && video.watchedPercent < 100 && (
                                  <p className="text-xs text-muted-foreground mt-0.5">
                                    {video.watchedPercent}% watched
                                  </p>
                                )}
                              </div>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <button className="p-1.5 rounded-full hover:bg-muted transition-colors flex-shrink-0">
                                    <MoreVertical className="h-4 w-4 text-muted-foreground" />
                                  </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56 rounded-xl">
                                  <DropdownMenuItem
                                    onClick={() => router.push(`/videos/${video.channel}/${video.id}`)}
                                    className="cursor-pointer"
                                  >
                                    <Play className="h-4 w-4 mr-3" /> {video.watchedPercent === 100 ? "Watch again" : "Resume playback"}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() => handleRemoveVideo(video.id)}
                                    className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-950/30 cursor-pointer"
                                  >
                                    <Trash2 className="h-4 w-4 mr-3" /> Remove from watch history
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <MobileNav />
    </div>
  );
}