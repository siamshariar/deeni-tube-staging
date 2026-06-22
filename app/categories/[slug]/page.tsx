// app/categories/[slug]/page.tsx
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
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMediaQuery } from "@/hooks/use-media-query";
import { mockCategories, mockVideos } from "@/lib/mock-data";
import { ShareModal } from "@/components/share-modal";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const generateCategoryVideos = (categoryName: string) => {
  let videos = mockVideos.filter((v) => v.category === categoryName);
  if (videos.length === 0) {
    for (let i = 1; i <= 8; i++) {
      videos.push({
        id: `mock-${categoryName}-${i}`,
        title: `${categoryName} Video ${i}`,
        channel: `${categoryName} Channel`,
        channelId: `channel-${i}`,
        channelAvatar: "/placeholder.svg?height=100&width=100",
        views: `${Math.floor(Math.random() * 500 + 100)}K views`,
        timeAgo: `${Math.floor(Math.random() * 30 + 1)} days ago`,
        duration: `${Math.floor(Math.random() * 20 + 5)}:${String(
          Math.floor(Math.random() * 60)
        ).padStart(2, "0")}`,
        thumbnail: `https://placehold.co/600x400/111/888?text=Video+${i}`,
        language: "en",
        category: categoryName,
        description: `Mock video for ${categoryName}`,
      });
    }
    return videos;
  }
  if (videos.length < 8) {
    const baseVideos = [...videos];
    while (videos.length < 8) {
      const index = (videos.length - baseVideos.length + baseVideos.length) % baseVideos.length;
      const base = baseVideos[index];
      if (!base) continue;
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
      {/* Mobile header – sticky back button */}
      <div className="md:hidden flex items-center gap-2 px-4 py-3 border-b sticky top-[56px] bg-background z-10">
        <button
          onClick={() => router.back()}
          className="flex items-center justify-center h-9 w-9 rounded-full hover:bg-muted flex-shrink-0 -ml-1"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="font-semibold text-lg truncate">{category.name}</h1>
      </div>

      <div className="px-4 md:px-6 py-4 md:py-6 mt-16">
        {isLoading ? (
          <>
            <div className="hidden md:block mb-4">
              <Skeleton className="h-8 w-48 mb-2" />
              <Skeleton className="h-4 w-64" />
            </div>
            <div className="mb-6">
              <Skeleton className="h-10 w-full md:w-64 rounded-full mb-4" />
              <div className="flex gap-2">
                <Skeleton className="h-9 w-16 rounded-full" />
                <Skeleton className="h-9 w-16 rounded-full" />
                <Skeleton className="h-9 w-16 rounded-full" />
              </div>
            </div>
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
          </>
        ) : (
          <>
            {!isMobile && (
              <div className="mb-6">
                <h1 className="text-2xl font-bold">{category.name}</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  {category.description}
                </p>
              </div>
            )}

            {/* Search + Sort chips */}
            <div className="mb-6">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div className="relative w-full md:max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder={`Search ${category.name} videos...`}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-10 h-10 text-sm rounded-full bg-muted/50 focus:bg-muted transition-colors"
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

                <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
                  {(["priority", "latest", "popular"] as const).map((mode) => (
                    <button
                      key={mode}
                      onClick={() => setSortMode(mode)}
                      className={cn(
                        "px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
                        sortMode === mode
                          ? "bg-foreground text-background"
                          : "bg-muted hover:bg-muted/80 text-foreground"
                      )}
                    >
                      {mode.charAt(0).toUpperCase() + mode.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Desktop grid */}
            <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
                          <DropdownMenuContent align="end" className="w-48 rounded-xl">
                            <DropdownMenuItem
                              className="cursor-pointer"
                              onClick={() => toast.success("Added to Watch Later (demo)")}
                            >
                              <Clock className="h-4 w-4 mr-2" /> Save to Watch later
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="cursor-pointer"
                              onClick={() => toast.success("Added to playlist (demo)")}
                            >
                              <Bookmark className="h-4 w-4 mr-2" /> Save to playlist
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="cursor-pointer"
                              onClick={() => handleShare(video)}
                            >
                              <Share className="h-4 w-4 mr-2" /> Share
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

            {/* Mobile list */}
            <div className="flex flex-col md:hidden">
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
                        <DropdownMenuContent align="end" className="w-48 rounded-xl">
                          <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => toast.success("Added to Watch Later (demo)")}
                          >
                            <Clock className="h-4 w-4 mr-2" /> Save to Watch later
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => toast.success("Added to playlist (demo)")}
                          >
                            <Bookmark className="h-4 w-4 mr-2" /> Save to playlist
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() => handleShare(video)}
                          >
                            <Share className="h-4 w-4 mr-2" /> Share
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

      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        videoUrl={shareUrl}
      />
    </div>
  );
}