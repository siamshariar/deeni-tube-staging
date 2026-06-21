// app/channels/[slug]/page.tsx
"use client";

import { useState, useEffect } from "react";
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
import { Switch } from "@/components/ui/switch";
import VideoCard from "@/components/video-card";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import { channelData, ChannelItem } from "@/lib/channel-data";
import { videoData, VideoItem } from "@/lib/video-data";
import { ShareModal } from "@/components/share-modal";
import { toast } from "sonner";
import { extendedPlaylists, PlaylistItem } from "@/lib/playlist-data";

function ChannelSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <Skeleton className="w-full h-44 md:h-56 xl:h-64" />
      <div className="px-4 py-4 border-b">
        <div className="flex items-start gap-4">
          <Skeleton className="h-16 w-16 md:h-20 md:w-20 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-40" />
          </div>
        </div>
      </div>
      <div className="border-b px-4">
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
      <div className="min-h-screen bg-background flex items-center justify-center">
        Channel not found
      </div>
    );
  }

  const channelVideos: VideoItem[] = videoData.filter(
    (v) => v.channelId === channel.id
  );

  const channelPlaylist: PlaylistItem | undefined = extendedPlaylists.find(
    (pl) =>
      pl.videoIds.length > 0 &&
      videoData.find((v) => v.id === pl.videoIds[0])?.channelId === channel.id
  );

  const [activeTab, setActiveTab] = useState("videos");
  const [isLoading, setIsLoading] = useState(true);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [localOn, setLocalOn] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    setShareUrl(typeof window !== "undefined" ? window.location.href : "");

    const saved = localStorage.getItem("feed-visible-channels");
    if (saved) {
      try {
        const visibleIds: string[] = JSON.parse(saved);
        setLocalOn(visibleIds.includes(channel.id));
      } catch {
        setLocalOn(true);
      }
    } else {
      setLocalOn(true);
    }

    return () => clearTimeout(timer);
  }, [channel.id]);

  const handleToggleFeed = (checked: boolean) => {
    setLocalOn(checked);
    const saved = localStorage.getItem("feed-visible-channels");
    let visibleIds: string[] = [];
    if (saved) {
      try {
        visibleIds = JSON.parse(saved);
      } catch {
        visibleIds = channelData.map((ch) => ch.id);
      }
    } else {
      visibleIds = channelData.map((ch) => ch.id);
    }

    if (checked) {
      if (!visibleIds.includes(channel.id)) {
        visibleIds.push(channel.id);
      }
    } else {
      visibleIds = visibleIds.filter((id) => id !== channel.id);
    }

    localStorage.setItem("feed-visible-channels", JSON.stringify(visibleIds));
    toast(
      checked
        ? "Channel will appear in your feed"
        : "Channel hidden from your feed"
    );
  };

  const handleShare = () => {
    setShareModalOpen(true);
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

      {/* Banner – object-cover ensures image fills the container */}
      <div className="relative w-full h-44 md:h-56 xl:h-64 overflow-hidden bg-muted">
        <img
          src={channel.banner || "/vibrant-health-cover.png"}
          alt="Channel banner"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
      </div>

      {/* Channel info header */}
      <div className="px-4 py-4 border-b">
        <div className="flex items-start gap-4">
          <Avatar
            className={cn(
              "flex-shrink-0 ring-4 ring-background -mt-10 md:-mt-12 relative z-10",
              isMobile ? "h-16 w-16" : "h-20 w-20"
            )}
          >
            <AvatarImage src={channel.avatar} />
            <AvatarFallback className="text-lg">
              {channel.name.charAt(0)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0 pt-1">
            <div className="flex items-center gap-1 flex-wrap">
              <h1 className="text-xl md:text-2xl font-bold truncate">
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
              {/* <div className="flex items-center gap-2 bg-muted rounded-full px-3 py-1.5">
                <span className="text-sm font-medium">
                  {localOn ? "Visible" : "Hidden"}
                </span>
                <Switch
                  checked={localOn}
                  onCheckedChange={handleToggleFeed}
                />
                <span className="text-xs text-muted-foreground hidden sm:inline">
                  In feed
                </span>
              </div> */}

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
          <TabsList className="h-12 bg-background w-full justify-start overflow-x-auto scrollbar-none px-4">
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

      {/* Tab content */}
      {activeTab === "videos" && (
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
      )}

      {activeTab === "shorts" && (
        <div className="grid gap-4 p-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex flex-col group cursor-pointer">
              <div className="relative aspect-[9/16] w-full rounded-lg overflow-hidden bg-muted">
                <Image
                  src={`/placeholder.svg?height=480&width=270&text=Short+${i + 1}`}
                  alt={`Short ${i + 1}`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <h3 className="font-medium text-sm line-clamp-2 mt-2 group-hover:text-primary transition-colors">
                {channel.name} Short #{i + 1}
              </h3>
              <p className="text-muted-foreground text-xs">
                {Math.floor(Math.random() * 100)}K views
              </p>
            </div>
          ))}
        </div>
      )}

      {activeTab === "playlists" && (
        <div className="p-4">
          {channelPlaylist ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              <div
                className="group cursor-pointer border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-card"
                onClick={() =>
                  router.push(`/playlists/${channelPlaylist.slug}/${channelPlaylist.id}`)
                }
              >
                <div className="relative aspect-video w-full">
                  {getPlaylistThumbnail(channelPlaylist) ? (
                    <Image
                      src={getPlaylistThumbnail(channelPlaylist)!}
                      alt={channelPlaylist.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <>
                      <div
                        className="absolute inset-0 opacity-30"
                        style={{ backgroundColor: channelPlaylist.thumbnailColor }}
                      />
                      <div
                        className="absolute left-2 right-2 top-2 bottom-2 rounded-lg opacity-40"
                        style={{ backgroundColor: channelPlaylist.thumbnailColor }}
                      />
                      <div
                        className="absolute left-4 right-4 top-4 bottom-4 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: channelPlaylist.thumbnailColor }}
                      >
                        <ListVideo className="h-10 w-10 text-white/60" />
                      </div>
                    </>
                  )}
                  <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded font-medium flex items-center gap-1">
                    <ListVideo className="h-3 w-3" />
                    {channelPlaylist.videoIds.length}
                  </div>
                </div>

                <div className="p-4 space-y-1">
                  <div className="flex items-start justify-between gap-1">
                    <h3 className="text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors flex-1">
                      {channelPlaylist.name}
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
                              `/playlists/${channelPlaylist.slug}/${channelPlaylist.id}`
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
                    {channelPlaylist.isPublic ? (
                      <Globe className="h-3 w-3" />
                    ) : (
                      <Lock className="h-3 w-3" />
                    )}
                    <span>{channelPlaylist.isPublic ? "Public" : "Private"}</span>
                    <span>•</span>
                    <span>{channelPlaylist.videoIds.length} videos</span>
                    <span>•</span>
                    <span>Updated {channelPlaylist.updatedAt}</span>
                  </div>
                  <div className="pt-1">
                    <button
                      className="text-xs font-medium text-primary hover:underline"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(
                          `/playlists/${channelPlaylist.slug}/${channelPlaylist.id}`
                        );
                      }}
                    >
                      View full playlist
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground">
                No playlists available for this channel.
              </p>
            </div>
          )}
        </div>
      )}

      {activeTab === "about" && (
        <div className="px-4 py-6 max-w-2xl">
          <h2 className="text-xl font-bold mb-2">Description</h2>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
            {channel.description || "No description provided."}
          </p>
          <div className="mt-6 space-y-3">
            <h3 className="font-semibold text-sm">Details</h3>
            <div className="text-xs text-muted-foreground space-y-1">
              <p><span className="font-medium">Channel name:</span> {channel.name}</p>
              <p><span className="font-medium">Subscribers:</span> {formatNumber(channel.subscribers)}</p>
              <p><span className="font-medium">Videos:</span> {channelVideos.length}</p>
              <p><span className="font-medium">Language:</span> {channel.language.toUpperCase()}</p>
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