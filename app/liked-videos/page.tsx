// app/liked-videos/page.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Search,
  X,
  MoreVertical,
  ThumbsUp,
  Play,
  Trash2,
  Shuffle,
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
import { mockLikedVideos } from "@/lib/mock-data";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const islamicMockLiked = [
  {
    id: "1",
    title: "সূরা আল-ফাতিহা – হৃদয়স্পর্শী তিলাওয়াত",
    channel: "কুরআনিক সাউন্ড",
    duration: "2:34",
    views: "2.8M views",
    timeAgo: "1 month ago",
    thumbnail: "https://placehold.co/600x400/111/888?text=Video",
    channelAvatar: "https://placehold.co/100x100/333/fff?text=Q",
    type: "video",
  },
  {
    id: "2",
    title: "সবচেয়ে শক্তিশালী দোয়া – দুঃখ দূর করার আমল",
    channel: "ইসলামিক লেকচার",
    duration: "18:44",
    views: "1.2M views",
    timeAgo: "3 weeks ago",
    thumbnail: "https://placehold.co/600x400/111/888?text=Video",
    channelAvatar: "https://placehold.co/100x100/333/fff?text=I",
    type: "video",
  },
  {
    id: "3",
    title: "নামাজের নিয়ম – সহজ ও পরিপূর্ণ পদ্ধতি",
    channel: "দ্বীনের পথ",
    duration: "22:10",
    views: "980K views",
    timeAgo: "6 months ago",
    thumbnail: "https://placehold.co/600x400/111/888?text=Video",
    channelAvatar: "https://placehold.co/100x100/333/fff?text=D",
    type: "video",
  },
  {
    id: "4",
    title: "রমজানের প্রস্তুতি – করণীয় ও বর্জনীয়",
    channel: "শান্তির বার্তা",
    duration: "35:15",
    views: "4.5M views",
    timeAgo: "1 year ago",
    thumbnail: "https://placehold.co/600x400/111/888?text=Video",
    channelAvatar: "https://placehold.co/100x100/333/fff?text=S",
    type: "video",
  },
  {
    id: "5",
    title: "কিয়ামতের দিনের ১০টি ভয়ংকর অবস্থা",
    channel: "জান্নাতের পথিক",
    duration: "41:02",
    views: "7.3M views",
    timeAgo: "2 months ago",
    thumbnail: "https://placehold.co/600x400/111/888?text=Video",
    channelAvatar: "https://placehold.co/100x100/333/fff?text=J",
    type: "video",
  },
  {
    id: "101",
    title: "তাফসীর – সূরা ইয়াসিন সম্পূর্ণ অধ্যায়",
    channel: "কুরআনিক সাউন্ড",
    duration: "1:12:33",
    views: "1.8M views",
    timeAgo: "4 months ago",
    thumbnail: "https://placehold.co/600x400/111/888?text=Video",
    channelAvatar: "https://placehold.co/100x100/333/fff?text=Q",
    type: "video",
  },
  {
    id: "102",
    title: "সকালের দোয়া – আপনার দিন শুরু হবে ভালো",
    channel: "ইসলামিক লেকচার",
    duration: "8:45",
    views: "3.1M views",
    timeAgo: "2 weeks ago",
    thumbnail: "https://placehold.co/600x400/111/888?text=Video",
    channelAvatar: "https://placehold.co/100x100/333/fff?text=I",
    type: "video",
  },
  {
    id: "103",
    title: "মক্কা ও মদিনার সেরা মুহূর্ত – ২০২৫",
    channel: "জান্নাতের পথিক",
    duration: "14:20",
    views: "6.7M views",
    timeAgo: "5 days ago",
    thumbnail: "https://placehold.co/600x400/111/888?text=Video",
    channelAvatar: "https://placehold.co/100x100/333/fff?text=J",
    type: "video",
  },
  {
    id: "104",
    title: "হজের সম্পূর্ণ গাইড – ধাপে ধাপে",
    channel: "দ্বীনের পথ",
    duration: "55:10",
    views: "2.4M views",
    timeAgo: "8 months ago",
    thumbnail: "https://placehold.co/600x400/111/888?text=Video",
    channelAvatar: "https://placehold.co/100x100/333/fff?text=D",
    type: "video",
  },
  {
    id: "105",
    title: "ইসলাম ও বিজ্ঞান – আধুনিক বিস্ময়",
    channel: "শান্তির বার্তা",
    duration: "48:32",
    views: "4.9M views",
    timeAgo: "1 year ago",
    thumbnail: "https://placehold.co/600x400/111/888?text=Video",
    channelAvatar: "https://placehold.co/100x100/333/fff?text=S",
    type: "video",
  },
];

const islamicMockShorts = [
  {
    id: "sh1",
    title: "ছোট দোয়া বড় সওয়াব #শর্টস",
    channel: "দ্বীনের পথ",
    duration: "0:58",
    views: "1.2M views",
    timeAgo: "1 day ago",
    thumbnail: "https://placehold.co/400x711/111/888?text=Short",
    channelAvatar: "https://placehold.co/100x100/333/fff?text=D",
    type: "short",
  },
  {
    id: "sh2",
    title: "বিপদে পড়ে এই দোয়াটি পড়ুন #শর্টস",
    channel: "ইসলামিক লেকচার",
    duration: "0:45",
    views: "850K views",
    timeAgo: "3 days ago",
    thumbnail: "https://placehold.co/400x711/111/888?text=Short",
    channelAvatar: "https://placehold.co/100x100/333/fff?text=I",
    type: "short",
  },
  {
    id: "sh3",
    title: "আল-আকসার অজানা তথ্য #শর্টস",
    channel: "জান্নাতের পথিক",
    duration: "0:50",
    views: "2.3M views",
    timeAgo: "1 week ago",
    thumbnail: "https://placehold.co/400x711/111/888?text=Short",
    channelAvatar: "https://placehold.co/100x100/333/fff?text=J",
    type: "short",
  },
];

const allMockLiked = [...islamicMockLiked, ...islamicMockShorts];

const categories = [
  { id: "all", label: "All", count: allMockLiked.length },
  { id: "videos", label: "Videos", count: allMockLiked.filter((v) => v.type !== "short").length },
  { id: "shorts", label: "Shorts", count: allMockLiked.filter((v) => v.type === "short").length },
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

export default function LikedVideosPage() {
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [videos, setVideos] = useState(allMockLiked);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("all");

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const handleUnlike = (videoId: string) => {
    setVideos((prev) => prev.filter((v) => v.id !== videoId));
    toast.success("Removed from Liked videos");
  };

  const filteredVideos = useMemo(() => {
    let list = videos.filter(
      (v) =>
        v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.channel.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (activeCategory === "videos") {
      list = list.filter((v) => v.type !== "short");
    } else if (activeCategory === "shorts") {
      list = list.filter((v) => v.type === "short");
    }
    return list;
  }, [videos, searchQuery, activeCategory]);

  const lastLikedVideo = videos.length > 0 ? videos[0] : null;
  const videoCount = videos.length;

  const handlePlayAll = () => {
    if (videos.length) {
      router.push(`/videos/${videos[0].channel}/${videos[0].id}`);
    }
  };

  const handleShuffle = () => {
    if (videos.length) {
      const random = videos[Math.floor(Math.random() * videos.length)];
      router.push(`/videos/${random.channel}/${random.id}`);
    }
  };

  const updatedDate = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const liveCategories = categories.map((cat) => ({
    ...cat,
    count:
      cat.id === "all"
        ? videos.length
        : cat.id === "videos"
        ? videos.filter((v) => v.type !== "short").length
        : videos.filter((v) => v.type === "short").length,
  }));

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile header */}
      <div className="md:hidden flex items-center gap-3 px-4 py-3 border-b sticky top-[56px] bg-background z-10">
        <button
          onClick={() => router.back()}
          className="flex items-center justify-center h-9 w-9 rounded-full hover:bg-muted"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="font-semibold text-lg">Liked videos</h1>
      </div>

      <div className="px-4 md:px-6 py-4 md:py-6 max-w-full">
        {isLoading ? (
          <div className="flex flex-col md:flex-row gap-6 mt-14 md:mt-16">
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
          <div className="text-center py-16 mt-14 md:mt-16">
            <ThumbsUp className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
            <h2 className="text-xl font-semibold mb-2">No liked videos</h2>
            <p className="text-muted-foreground">
              Videos you like will appear here
            </p>
            <Button
              className="mt-4 rounded-full"
              onClick={() => router.push("/")}
            >
              Browse videos
            </Button>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-0 md:gap-6 mt-14 md:mt-16">
            {/* LEFT COLUMN */}
            <div className="md:w-[340px] flex-shrink-0 md:sticky md:top-[80px] md:self-start md:h-[calc(100vh-80px)] md:overflow-hidden">
              <div className="relative h-full rounded-xl overflow-hidden bg-card border shadow-sm">
                {lastLikedVideo ? (
                  <>
                    <Image
                      src={lastLikedVideo.thumbnail}
                      alt=""
                      fill
                      className="object-cover scale-110 blur-md opacity-40"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                    <div className="relative z-10 h-full flex flex-col justify-center p-8 text-white text-center">
                      <div className="mb-6">
                        <h2 className="text-2xl md:text-3xl font-bold drop-shadow-lg">Liked videos</h2>
                        <p className="text-sm text-white/80 mt-1">
                          {videoCount} videos • Updated {updatedDate}
                        </p>
                      </div>
                      {!isMobile && lastLikedVideo && (
                        <Link
                          href={`/videos/${lastLikedVideo.channel}/${lastLikedVideo.id}`}
                          className="block w-full mb-6 group"
                        >
                          <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black/20 backdrop-blur-sm border border-white/10">
                            <Image
                              src={lastLikedVideo.thumbnail}
                              alt={lastLikedVideo.title}
                              fill
                              className="object-cover transition-transform group-hover:scale-105"
                            />
                            <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded font-medium">
                              {lastLikedVideo.duration}
                            </div>
                            <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <div className="bg-black/60 rounded-full p-3">
                                <Play className="h-7 w-7 text-white fill-white" />
                              </div>
                            </div>
                          </div>
                          <div className="mt-3 text-left">
                            <p className="text-sm font-medium line-clamp-2 group-hover:underline">
                              {lastLikedVideo.title}
                            </p>
                            <p className="text-xs text-white/70 mt-0.5">
                              {lastLikedVideo.channel}
                            </p>
                            <p className="text-xs text-white/50 mt-0.5">
                              {lastLikedVideo.views} • {lastLikedVideo.timeAgo}
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
                        <Button
                          onClick={handleShuffle}
                          variant="outline"
                          className="rounded-full gap-2 bg-white/20 text-white border-white/30 hover:bg-white/30 w-full"
                        >
                          <Shuffle className="h-5 w-5" /> Shuffle
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="h-full bg-muted flex items-center justify-center">
                    <ThumbsUp className="h-12 w-12 text-muted-foreground/30" />
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="flex-1 min-w-0 mt-6 md:mt-0 overflow-y-auto">
              <div className="flex items-center gap-3 mb-4">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search liked videos"
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
                        href={`/videos/${video.channel}/${video.id}`}
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
                              <Link
                                href={`/channel/${video.channel}`}
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
                              onClick={() => handleUnlike(video.id)}
                              className="p-2 rounded-full hover:bg-muted transition-colors"
                              title="Unlike"
                            >
                              <ThumbsUp className="h-5 w-5 fill-current text-primary" />
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
                                      `/videos/${video.channel}/${video.id}`
                                    )
                                  }
                                >
                                  <Play className="h-4 w-4 mr-3" /> Play now
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handleUnlike(video.id)}
                                  className="text-red-600 dark:text-red-400"
                                >
                                  <Trash2 className="h-4 w-4 mr-3" /> Remove from Liked
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
    </div>
  );
}