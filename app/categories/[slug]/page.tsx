"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Search,
  X,
  MoreVertical,
  Play,
  Clock,
  Bookmark,
  Share,
  ChevronDown,
} from "lucide-react";
import AppHeader from "@/components/app-header";
import MobileNav from "@/components/mobile-nav";
import DesktopSidebar from "@/components/desktop-sidebar";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@/hooks/use-media-query";
import { mockCategories, mockVideos } from "@/lib/mock-data";
import { useWatchLater } from "@/hooks/useWatchLater";
import { ShareModal } from "@/components/share-modal";
import { AddToPlaylistDialog } from "@/components/add-to-playlist-dialog";
import { toast } from "sonner";

// Helper to generate more mock videos for each category
const generateCategoryVideos = (categoryName: string) => {
  let videos = mockVideos.filter((v) => v.category === categoryName);
  if (videos.length < 8) {
    const baseVideos = [...videos];
    while (videos.length < 8) {
      const base = baseVideos[videos.length % baseVideos.length];
      videos.push({
        ...base,
        id: `${base.id}-dup-${videos.length}`,
        title: `${base.title} (Part ${videos.length + 1})`,
        views: `${Math.floor(Math.random() * 500 + 100)}K views`,
        timeAgo: `${Math.floor(Math.random() * 30 + 1)} days ago`,
        duration: `${Math.floor(Math.random() * 20 + 5)}:${String(
          Math.floor(Math.random() * 60)
        ).padStart(2, "0")}`,
      });
    }
  }
  return videos;
};

function VideoSkeleton() {
  return (
    <div className="flex flex-col">
      <Skeleton className="aspect-video w-full rounded-xl" />
      <div className="flex mt-2 gap-2">
        <Skeleton className="h-9 w-9 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-3 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
    </div>
  );
}

function VideoSkeletonHorizontal() {
  return (
    <div className="flex gap-3 py-3">
      <Skeleton className="w-40 aspect-video rounded-lg flex-shrink-0" />
      <div className="flex-1 min-w-0 space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-3 w-32" />
      </div>
    </div>
  );
}

export default function CategoryVideosPage() {
  const router = useRouter();
  const params = useParams();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const slug = params.slug as string;
  const category = mockCategories.find((c) => c.slug === slug) || mockCategories[0];
  const categoryVideos = generateCategoryVideos(category.name);
  const { addToWatchLater } = useWatchLater();

  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [sortMode, setSortMode] = useState<"priority" | "latest" | "popular">("priority");
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    setShareUrl(typeof window !== "undefined" ? window.location.href : "");
    return () => clearTimeout(timer);
  }, [slug]);

  const filteredVideos = categoryVideos
    .filter(
      (v) =>
        !searchQuery ||
        v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.channel.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortMode === "latest") {
        const getDate = (time: string) => {
          if (time.includes("day")) return parseInt(time);
          if (time.includes("week")) return parseInt(time) * 7;
          if (time.includes("month")) return parseInt(time) * 30;
          return 0;
        };
        return getDate(b.timeAgo) - getDate(a.timeAgo);
      }
      if (sortMode === "popular") {
        const parseView = (v: string) => {
          const num = parseFloat(v.replace("K", "").replace("M", ""));
          return v.includes("M") ? num * 1000000 : v.includes("K") ? num * 1000 : num;
        };
        return parseView(b.views) - parseView(a.views);
      }
      return 0;
    });

  const handleShare = (video: any) => {
    setShareUrl(`${window.location.origin}/videos/${video.channel}/${video.id}`);
    setShareModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <div className="md:hidden flex items-center gap-3 px-4 py-3 border-b sticky top-[56px] bg-background z-10">
        <button
          onClick={() => router.back()}
          className="flex items-center justify-center h-9 w-9 rounded-full hover:bg-muted"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="font-semibold text-lg truncate">{category.name}</h1>
      </div>
      <div className="flex">
        <DesktopSidebar className="hidden md:block" />
        <div className="flex-1 md:pl-[240px] md:pt-[80px] pb-nav-safe">
          <div className="max-w-[1096px] mx-auto">
            {isLoading ? (
              <div className="px-4 md:px-6 py-4 md:py-6">
                <div className="hidden md:block mb-4">
                  <Skeleton className="h-8 w-48 mb-2" />
                  <Skeleton className="h-4 w-64" />
                </div>
                <Skeleton className="h-10 w-full rounded-full mb-4" />
                <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <VideoSkeleton key={i} />
                  ))}
                </div>
                <div className="flex flex-col md:hidden">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <VideoSkeletonHorizontal key={i} />
                  ))}
                </div>
              </div>
            ) : (
              <>
                <div className="px-4 md:px-6 pt-14 pb-3 md:py-6 border-b">
                  <div className="hidden md:block">
                    <h1 className="text-2xl font-bold">{category.name}</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                      {category.description}
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-4">
                    <div className="relative flex-1 max-w-md">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        type="text"
                        placeholder={`Search ${category.name} videos...`}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 pr-10 h-10 text-sm rounded-full bg-muted/50 focus:bg-muted transition-colors"
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
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="rounded-full gap-1"
                        >
                          {isMobile ? (
                            <>
                              <span className="text-xs">
                                {sortMode === "priority"
                                  ? "Priority"
                                  : sortMode === "latest"
                                  ? "Latest"
                                  : "Popular"}
                              </span>
                              <ChevronDown className="h-3 w-3" />
                            </>
                          ) : (
                            <>
                              Sort by:{" "}
                              {sortMode === "priority"
                                ? "Priority"
                                : sortMode === "latest"
                                ? "Latest"
                                : "Popular"}
                              <ChevronDown className="h-4 w-4" />
                            </>
                          )}
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem onClick={() => setSortMode("priority")}>
                          Priority
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSortMode("latest")}>
                          Latest
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setSortMode("popular")}>
                          Popular
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {/* Desktop Grid */}
                <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 px-4 md:px-6 pb-6">
                  {filteredVideos.map((video) => (
                    <div key={video.id} className="flex flex-col group">
                      <Link
                        href={`/videos/${video.channel}/${video.id}`}
                        className="relative aspect-video w-full"
                      >
                        <Image
                          src={video.thumbnail}
                          alt={video.title}
                          fill
                          className="object-cover rounded-xl"
                        />
                        <div className="absolute bottom-1.5 right-1.5 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded font-medium">
                          {video.duration}
                        </div>
                        <div className="absolute inset-0 bg-black/20 rounded-xl flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="bg-black/60 rounded-full p-2">
                            <Play className="h-5 w-5 text-white fill-white" />
                          </div>
                        </div>
                      </Link>
                      <div className="flex mt-3 gap-2">
                        <Link href={`/channel/${video.channel}`}>
                          <Avatar className="h-9 w-9 flex-shrink-0">
                            <AvatarImage src={video.channelAvatar} />
                            <AvatarFallback>{video.channel.charAt(0)}</AvatarFallback>
                          </Avatar>
                        </Link>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-1">
                            <Link href={`/videos/${video.channel}/${video.id}`}>
                              <h3 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
                                {video.title}
                              </h3>
                            </Link>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <button className="p-1 rounded-full hover:bg-muted transition-colors flex-shrink-0">
                                  <MoreVertical className="h-4 w-4 text-muted-foreground" />
                                </button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-56 rounded-xl">
                                <DropdownMenuItem
                                  className="cursor-pointer"
                                  onClick={() => {
                                    addToWatchLater({
                                      id: video.id,
                                      title: video.title,
                                      channel: video.channel,
                                      channelAvatar: video.channelAvatar,
                                      thumbnail: video.thumbnail,
                                      views: video.views,
                                      timeAgo: video.timeAgo,
                                      duration: video.duration,
                                      addedAt: Date.now(),
                                    });
                                    toast.success("Added to Watch Later");
                                  }}
                                >
                                  <Clock className="h-4 w-4 mr-3" /> Save to Watch later
                                </DropdownMenuItem>
                                <AddToPlaylistDialog
                                  video={{
                                    id: video.id,
                                    title: video.title,
                                    channel: video.channel,
                                  }}
                                  onAdded={() => toast.success("Added to playlist")}
                                >
                                  <DropdownMenuItem className="cursor-pointer w-full">
                                    <Bookmark className="h-4 w-4 mr-3" /> Save to playlist
                                  </DropdownMenuItem>
                                </AddToPlaylistDialog>
                                <DropdownMenuItem
                                  className="cursor-pointer"
                                  onClick={() => handleShare(video)}
                                >
                                  <Share className="h-4 w-4 mr-3" /> Share
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {video.channel}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {video.views} • {video.timeAgo}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Mobile List */}
                <div className="flex flex-col md:hidden px-4 pb-6">
                  {filteredVideos.map((video) => (
                    <div key={video.id} className="flex gap-3 py-3 border-b last:border-0 group">
                      <Link
                        href={`/videos/${video.channel}/${video.id}`}
                        className="relative w-40 aspect-video flex-shrink-0"
                      >
                        <Image
                          src={video.thumbnail}
                          alt={video.title}
                          fill
                          className="object-cover rounded-lg"
                        />
                        <div className="absolute bottom-1 right-1 bg-black/80 text-white text-[10px] px-1 py-0.5 rounded font-medium">
                          {video.duration}
                        </div>
                      </Link>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-1">
                          <Link href={`/videos/${video.channel}/${video.id}`}>
                            <h3 className="font-medium text-sm line-clamp-2">
                              {video.title}
                            </h3>
                          </Link>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button className="p-1 rounded-full hover:bg-muted transition-colors flex-shrink-0">
                                <MoreVertical className="h-4 w-4 text-muted-foreground" />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56 rounded-xl">
                              <DropdownMenuItem
                                className="cursor-pointer"
                                onClick={() => {
                                  addToWatchLater({
                                    id: video.id,
                                    title: video.title,
                                    channel: video.channel,
                                    channelAvatar: video.channelAvatar,
                                    thumbnail: video.thumbnail,
                                    views: video.views,
                                    timeAgo: video.timeAgo,
                                    duration: video.duration,
                                    addedAt: Date.now(),
                                  });
                                  toast.success("Added to Watch Later");
                                }}
                              >
                                <Clock className="h-4 w-4 mr-3" /> Save to Watch later
                              </DropdownMenuItem>
                              <AddToPlaylistDialog
                                video={{
                                  id: video.id,
                                  title: video.title,
                                  channel: video.channel,
                                }}
                                onAdded={() => toast.success("Added to playlist")}
                              >
                                <DropdownMenuItem className="cursor-pointer w-full">
                                  <Bookmark className="h-4 w-4 mr-3" /> Save to playlist
                                </DropdownMenuItem>
                              </AddToPlaylistDialog>
                              <DropdownMenuItem
                                className="cursor-pointer"
                                onClick={() => handleShare(video)}
                              >
                                <Share className="h-4 w-4 mr-3" /> Share
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <div className="flex items-center gap-1.5 mt-1">
                          <Avatar className="h-4 w-4">
                            <AvatarImage src={video.channelAvatar} />
                            <AvatarFallback className="text-[8px]">
                              {video.channel.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-[11px] text-muted-foreground">
                            {video.channel}
                          </span>
                        </div>
                        <p className="text-[11px] text-muted-foreground mt-0.5">
                          {video.views} • {video.timeAgo}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      <MobileNav />

      {/* Share Modal */}
      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        videoUrl={shareUrl}
      />
    </div>
  );
}