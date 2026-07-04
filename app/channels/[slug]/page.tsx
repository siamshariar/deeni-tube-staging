// app/channels/[slug]/page.tsx
"use client";

import { useState, useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  MoreVertical,
  Share,
  Ban,
  Flag,
  Globe,
  Lock,
  ListVideo,
  Play,
  Edit,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import VideoCard from "@/components/video-card";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import { channelData, ChannelItem } from "@/lib/channel-data";
import { videoData, VideoItem } from "@/lib/video-data";
import { ShareModal } from "@/components/share-modal";
import { toast } from "sonner";
import { extendedPlaylists, PlaylistItem } from "@/lib/playlist-data";

// Mock shorts data - combine from shorts-data.ts and add more
const mockShortsByChannel: Record<string, any[]> = {
  "monzur": [
    { id: "sh1", videoId: "MBxDbbkk0gQ", title: "একমাত্র আল্লাহর রাজত্বই চিরস্থায়ী", views: "15K", timeAgo: "2 weeks ago", duration: "0:58" },
    { id: "sh2", videoId: "goHfO28fE-A", title: "যারা বলে আমাদের রব আল্লাহ", views: "25K", timeAgo: "3 days ago", duration: "0:45" },
    { id: "sh3", videoId: "8YfQCDjlQsc", title: "ইমামের দূর্ব্যবহারের কারণে কেউ ওই মাসজিদে না গেলে কি অন্যায় হবে?", views: "50K", timeAgo: "1 week ago", duration: "0:51" },
    { id: "sh4", videoId: "o38RKuY_AUU", title: "সিদ্দীকে আকবার রা.-এর দৃষ্টিতে প্রিয় নবী সা.", views: "18K", timeAgo: "5 days ago", duration: "0:55" },
    { id: "sh5", videoId: "oEWnPbRvOrY", title: "আল্লাহর পক্ষ থেকে তাওফীক প্রাপ্তি", views: "22K", timeAgo: "3 weeks ago", duration: "0:50" },
  ],
  "abdullah-jahangir": [
    { id: "sh6", videoId: "PUwTf64igQk", title: "এভাবে ঈমান নষ্ট করছেন নাতো?", views: "35K", timeAgo: "4 days ago", duration: "0:52" },
    { id: "sh7", videoId: "hHpoYE-v6og", title: "রোগ-ব্যাধিতে ধৈর্য ধারণ করা", views: "28K", timeAgo: "1 week ago", duration: "0:42" },
    { id: "sh8", videoId: "Kk1_-T-8MFU", title: "মহান আল্লাহ'র কাছে চাওয়ার নিয়ম", views: "42K", timeAgo: "2 weeks ago", duration: "0:48" },
  ],
  "abu-bakar-zakariya": [
    { id: "sh9", videoId: "rTrh9VHgdwo", title: "ওজুতে ঘাড় মাসাহ করা সুন্নাহ নাকি বিদ'আত", views: "12K", timeAgo: "1 week ago", duration: "0:55" },
    { id: "sh10", videoId: "ihdO_G6Yk0E", title: "দুনিয়াতেই জান্নাত আছে আপনি কি জানেন? ✨", views: "28K", timeAgo: "3 days ago", duration: "0:50" },
  ],
  "imam-hossain": [
    { id: "sh11", videoId: "_zCnmnCd7CU", title: "আদমসুমারির খাতায় মুসলমান, বাস্তবে ইমানের খাতায় নাম নাই", views: "18K", timeAgo: "5 days ago", duration: "0:58" },
  ],
  "zakir-naik": [
    { id: "sh12", videoId: "MBxDbbkk0gQ", title: "The Importance of Tawheed - Dr Zakir Naik", views: "45K", timeAgo: "1 week ago", duration: "0:55" },
  ],
  "mufti-menk": [
    { id: "sh13", videoId: "0m1Mc6dX8XY", title: "Seek The Forgiveness of Allah #muftimenk", views: "95K", timeAgo: "2 days ago", duration: "0:45" },
    { id: "sh14", videoId: "goHfO28fE-A", title: "Always Be Grateful - Mufti Menk", views: "78K", timeAgo: "5 days ago", duration: "0:52" },
  ],
  "assim-al-hakeem": [
    { id: "sh15", videoId: "Tnb74r4VZaY", title: "Is it not permissible 2 get married in Muharram?", views: "32K", timeAgo: "3 days ago", duration: "0:48" },
    { id: "sh16", videoId: "yLMQmr7qjcM", title: "Read all duas of morning & evening adhkar?", views: "25K", timeAgo: "1 week ago", duration: "0:50" },
  ],
  "saifullah-madani": [
    { id: "sh17", videoId: "oEWnPbRvOrY", title: "তাওহীদের আলোকে জীবন", views: "8K", timeAgo: "2 weeks ago", duration: "0:55" },
  ],
};

function ChannelSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <Skeleton className="w-full h-44 md:h-56 xl:h-64" />
      <div className="px-3 py-4 border-b">
        <div className="flex items-start gap-4">
          <Skeleton className="h-16 w-16 md:h-20 md:w-20 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-40" />
          </div>
        </div>
      </div>
      <div className="border-b px-3">
        <div className="flex gap-6 h-12 items-center">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-16" />
        </div>
      </div>
      <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex flex-col">
            <Skeleton className="aspect-video w-full rounded-lg" />
            <div className="flex mt-2 gap-2">
              <Skeleton className="h-9 w-9 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-3 w-3/4" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ChannelDetailPage() {
  const params = useParams();
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const channelSlug = params.slug as string;

  const channel: ChannelItem | undefined = channelData.find(
    (ch) => ch.slug === channelSlug
  );

  if (!channel) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center mt-14 md:mt-16">
        <div className="text-center px-3">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Play className="h-8 w-8 text-muted-foreground" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Channel not found</h2>
          <p className="text-sm text-muted-foreground mb-4">The channel you're looking for doesn't exist.</p>
          <Button onClick={() => router.push("/channels")} className="rounded-full">
            Back to Channels
          </Button>
        </div>
      </div>
    );
  }

  const channelVideos: VideoItem[] = videoData.filter(
    (v) => v.channelId === channel.id
  );

  const channelShorts = mockShortsByChannel[channel.id] || [];

  // Get playlists that contain videos from this channel
  const channelPlaylists = useMemo(() => {
    const channelVideoIds = channelVideos.map(v => v.id);
    return extendedPlaylists.filter((pl) =>
      pl.videoIds.some(vid => channelVideoIds.includes(vid))
    ).slice(0, 4);
  }, [channelVideos]);

  const [activeTab, setActiveTab] = useState("videos");
  const [isLoading, setIsLoading] = useState(true);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    setShareUrl(typeof window !== "undefined" ? window.location.href : "");
    return () => clearTimeout(timer);
  }, [channel.id]);

  const handleShare = () => {
    setShareModalOpen(true);
  };

  // Navigate to shorts page with specific video
  const handleShortClick = (videoId: string) => {
    router.push(`/shorts?v=${videoId}`);
  };

  const formatNumber = (num: number) => {
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
    if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
    return String(num);
  };

  const getPlaylistThumbnail = (playlist: PlaylistItem) => {
    if (!playlist.videoIds.length) return null;
    const firstVideoId = playlist.videoIds[0];
    const video = videoData.find((v) => v.id === firstVideoId);
    if (video) {
      return `https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`;
    }
    return null;
  };

  if (isLoading) {
    return <ChannelSkeleton />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile back button + channel name */}
      {isMobile && (
        <div className="sticky top-[56px] z-10 bg-background/95 backdrop-blur-sm border-b">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 px-4 py-2 w-full"
          >
            <ArrowLeft className="h-6 w-6 shrink-0" />
            <span className="text-sm font-medium line-clamp-1 text-left">
              {channel.name}
            </span>
          </button>
        </div>
      )}

      {/* Banner */}
      <div className="relative w-full h-44 md:h-56 xl:h-64 overflow-hidden bg-muted">
        <img
          src={channel.banner || "/vibrant-health-cover.png"}
          alt="Channel banner"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      </div>

      {/* Channel info header */}
      <div className="px-3 py-4 border-b">
        <div className="flex flex-col md:flex-row md:items-start md:gap-4">
          <Avatar className="flex-shrink-0 ring-4 ring-background -mt-10 md:-mt-16 relative z-10 h-16 w-16 md:h-20 md:w-20">
            <AvatarImage src={channel.avatar} />
            <AvatarFallback className="text-lg">
              {channel.name.charAt(0)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0 mt-3 md:mt-0 md:pt-1">
            <div className="flex items-start gap-1 flex-wrap">
              <h1 className="text-xl md:text-2xl font-bold">
                {channel.name}
              </h1>
              {channel.verified && (
                <svg
                  className="w-5 h-5 text-blue-500 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307z" />
                </svg>
              )}
            </div>
            <p className="text-sm text-muted-foreground">@{channel.slug}</p>
            <p className="text-sm text-muted-foreground">
              {formatNumber(channel.subscribers)} subscribers •{" "}
              {channelVideos.length} videos
            </p>

            {/* Action buttons */}
            <div className="flex items-center gap-2 mt-4 flex-wrap">
              <Button
                variant="outline"
                className="rounded-full h-9 flex-shrink-0"
                onClick={handleShare}
              >
                <Share className="h-4 w-4 mr-2" /> Share
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full"
                  >
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 rounded-xl">
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => toast("Channel reported")}
                  >
                    <Flag className="h-4 w-4 mr-3" /> Report
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => toast("Channel hidden")}
                  >
                    <Ban className="h-4 w-4 mr-3" /> Don't recommend channel
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div
        className={cn(
          "border-b",
          isMobile ? "sticky top-[96px] bg-background z-10" : ""
        )}
      >
        <Tabs
          defaultValue="videos"
          className="w-full"
          onValueChange={setActiveTab}
        >
          <TabsList className="h-12 bg-background w-full justify-start overflow-x-auto scrollbar-none px-3">
            <TabsTrigger
              value="videos"
              className="px-4 py-1 data-[state=active]:border-b-2 data-[state=active]:border-foreground data-[state=active]:rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              Videos
            </TabsTrigger>
            <TabsTrigger
              value="shorts"
              className="px-4 py-1 data-[state=active]:border-b-2 data-[state=active]:border-foreground data-[state=active]:rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              Shorts
            </TabsTrigger>
            <TabsTrigger
              value="playlists"
              className="px-4 py-1 data-[state=active]:border-b-2 data-[state=active]:border-foreground data-[state=active]:rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              Playlists
            </TabsTrigger>
            <TabsTrigger
              value="about"
              className="px-4 py-1 data-[state=active]:border-b-2 data-[state=active]:border-foreground data-[state=active]:rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            >
              About
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Tab content - Videos */}
      {activeTab === "videos" && (
        <>
          {channelVideos.length > 0 ? (
            <>
              <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
                {channelVideos.map((video) => (
                  <VideoCard
                    key={video.id}
                    videoId={video.videoId}
                    title={video.title}
                    channel={video.channel}
                    channelId={video.channelId}
                    channelAvatar={video.channelAvatar}
                    views={video.views}
                    timestamp={video.timeAgo}
                    duration={video.duration}
                    thumbnail={`https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`}
                    isHorizontal={false}
                  />
                ))}
              </div>
              <div className="flex flex-col md:hidden">
                {channelVideos.map((video) => (
                  <VideoCard
                    key={video.id}
                    videoId={video.videoId}
                    title={video.title}
                    channel={video.channel}
                    channelId={video.channelId}
                    channelAvatar={video.channelAvatar}
                    views={video.views}
                    timestamp={video.timeAgo}
                    duration={video.duration}
                    thumbnail={`https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`}
                    isHorizontal={true}
                  />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-16 px-3">
              <div className="w-14 h-14 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
                <Play className="h-7 w-7 text-muted-foreground" />
              </div>
              <h3 className="font-semibold mb-1">No videos yet</h3>
              <p className="text-sm text-muted-foreground">This channel hasn't uploaded any videos.</p>
            </div>
          )}
        </>
      )}

      {/* Tab content - Shorts */}
      {activeTab === "shorts" && (
        <>
          {channelShorts.length > 0 ? (
            <div className="grid gap-3 p-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {channelShorts.map((short) => (
                <button
                  key={short.id}
                  onClick={() => handleShortClick(short.videoId)}
                  className="flex flex-col group cursor-pointer text-left"
                >
                  <div className="relative aspect-[9/16] w-full rounded-xl overflow-hidden bg-muted shadow-sm hover:shadow-md transition-shadow">
                    <Image
                      src={`https://img.youtube.com/vi/${short.videoId}/hqdefault.jpg`}
                      alt={short.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute bottom-1.5 right-1.5 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded font-medium">
                      {short.duration}
                    </div>
                    <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="bg-black/60 rounded-full p-2">
                        <Play className="h-5 w-5 text-white fill-white" />
                      </div>
                    </div>
                  </div>
                  <h3 className="font-medium text-xs sm:text-sm line-clamp-2 mt-2 group-hover:text-primary transition-colors">
                    {short.title}
                  </h3>
                  <p className="text-muted-foreground text-[10px] sm:text-xs mt-0.5">
                    {short.views} views • {short.timeAgo}
                  </p>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 px-3">
              <div className="w-14 h-14 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
                <Play className="h-7 w-7 text-muted-foreground" />
              </div>
              <h3 className="font-semibold mb-1">No shorts yet</h3>
              <p className="text-sm text-muted-foreground">This channel hasn't uploaded any shorts.</p>
            </div>
          )}
        </>
      )}

      {/* Tab content - Playlists */}
      {activeTab === "playlists" && (
        <div className="p-4">
          {channelPlaylists.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {channelPlaylists.map((playlist) => (
                <div
                  key={playlist.id}
                  className="group cursor-pointer border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-card"
                  onClick={() =>
                    router.push(`/playlists/${playlist.slug}/${playlist.id}`)
                  }
                >
                  <div className="relative aspect-video w-full">
                    {getPlaylistThumbnail(playlist) ? (
                      <Image
                        src={getPlaylistThumbnail(playlist)!}
                        alt={playlist.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <>
                        <div
                          className="absolute inset-0 opacity-30"
                          style={{ backgroundColor: playlist.thumbnailColor }}
                        />
                        <div
                          className="absolute left-2 right-2 top-2 bottom-2 rounded-lg opacity-40"
                          style={{ backgroundColor: playlist.thumbnailColor }}
                        />
                        <div
                          className="absolute left-4 right-4 top-4 bottom-4 rounded-lg flex items-center justify-center"
                          style={{ backgroundColor: playlist.thumbnailColor }}
                        >
                          <ListVideo className="h-10 w-10 text-white/60" />
                        </div>
                      </>
                    )}
                    <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded font-medium flex items-center gap-1">
                      <ListVideo className="h-3 w-3" />
                      {playlist.videoIds.length}
                    </div>
                  </div>

                  <div className="p-4 space-y-1">
                    <div className="flex items-start justify-between gap-1">
                      <h3 className="text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors flex-1">
                        {playlist.name}
                      </h3>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            className="p-1 rounded-full hover:bg-muted transition-colors -mr-1 flex-shrink-0"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreVertical className="h-4 w-4 text-muted-foreground" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 rounded-xl">
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              router.push(
                                `/playlists/${playlist.slug}/${playlist.id}`
                              );
                            }}
                          >
                            <Play className="h-4 w-4 mr-2" /> Play all
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              toast("Edit playlist (prototype)");
                            }}
                          >
                            <Edit className="h-4 w-4 mr-2" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600 dark:text-red-400"
                            onClick={(e) => {
                              e.stopPropagation();
                              toast("Delete playlist (prototype)");
                            }}
                          >
                            <Trash2 className="h-4 w-4 mr-2" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      {playlist.isPublic ? (
                        <Globe className="h-3 w-3" />
                      ) : (
                        <Lock className="h-3 w-3" />
                      )}
                      <span>{playlist.isPublic ? "Public" : "Private"}</span>
                      <span>•</span>
                      <span>{playlist.videoIds.length} videos</span>
                      <span>•</span>
                      <span>Updated {playlist.updatedAt}</span>
                    </div>
                    <div className="pt-1">
                      <button
                        className="text-xs font-medium text-primary hover:underline"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(
                            `/playlists/${playlist.slug}/${playlist.id}`
                          );
                        }}
                      >
                        View full playlist
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 px-3">
              <div className="w-14 h-14 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
                <ListVideo className="h-7 w-7 text-muted-foreground" />
              </div>
              <h3 className="font-semibold mb-1">No playlists yet</h3>
              <p className="text-sm text-muted-foreground">This channel has no playlists available.</p>
            </div>
          )}
        </div>
      )}

      {/* Tab content - About */}
      {activeTab === "about" && (
        <div className="px-3 py-6 max-w-2xl space-y-4">
          <div className="p-4 border rounded-xl bg-card">
            <h2 className="text-base font-semibold mb-2">Description</h2>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
              {channel.description || "No description provided."}
            </p>
          </div>
          <div className="p-4 border rounded-xl bg-card">
            <h3 className="text-base font-semibold mb-3">Details</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Channel name</span>
                <span className="font-medium">{channel.name}</span>
              </div>
              <div className="flex items-center justify-between text-sm border-t pt-2">
                <span className="text-muted-foreground">Subscribers</span>
                <span className="font-medium">{formatNumber(channel.subscribers)}</span>
              </div>
              <div className="flex items-center justify-between text-sm border-t pt-2">
                <span className="text-muted-foreground">Videos</span>
                <span className="font-medium">{channelVideos.length}</span>
              </div>
              <div className="flex items-center justify-between text-sm border-t pt-2">
                <span className="text-muted-foreground">Language</span>
                <span className="font-medium">{channel.language.toUpperCase()}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        videoUrl={shareUrl}
      />
    </div>
  );
}