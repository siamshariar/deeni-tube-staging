"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  Play,
  Shuffle,
  Search,
  X,
  Globe,
  Lock,
  MoreVertical,
  Share,
  Check,
  Trash2,
  Edit,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import AppHeader from "@/components/app-header";
import MobileNav from "@/components/mobile-nav";
import DesktopSidebar from "@/components/desktop-sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { ShareModal } from "@/components/share-modal";
import { useMediaQuery } from "@/hooks/use-media-query";
import { mockPlaylists, mockVideos } from "@/lib/mock-data";
import { toast } from "sonner";

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

export default function PlaylistDetailPage() {
  const router = useRouter();
  const params = useParams();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const playlistId = params.id as string;

  const [playlist, setPlaylist] = useState<any>(null);
  const [videos, setVideos] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      const found = mockPlaylists.find((p) => p.id === playlistId);
      if (found) {
        setPlaylist(found);
        const playlistVideos = mockVideos.filter((v) =>
          found.videoIds.includes(v.id)
        );
        setVideos(playlistVideos);
        // Build share URL
        setShareUrl(`${window.location.origin}/playlists/${found.slug}/${found.id}`);
      }
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [playlistId]);

  const filteredVideos = videos.filter(
    (v) =>
      v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.channel.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleShare = () => {
    if (playlist?.isPublic) {
      setShowShareModal(true);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader />
        <div className="flex">
          <DesktopSidebar className="hidden md:block" />
          <div className="flex-1 md:pl-[240px] pt-[56px] md:pt-[80px] pb-nav-safe md:pb-6">
            <div className="max-w-[1096px] mx-auto px-4 md:px-6">
              <div className="py-4 md:py-6">
                <div className="flex gap-4">
                  <Skeleton className="w-24 h-24 md:w-32 md:h-32 rounded-xl" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-4 w-32" />
                    <div className="flex gap-2">
                      <Skeleton className="h-9 w-24 rounded-full" />
                      <Skeleton className="h-9 w-24 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <VideoSkeleton />
                <VideoSkeleton />
                <VideoSkeleton />
              </div>
            </div>
          </div>
        </div>
        <MobileNav />
      </div>
    );
  }

  if (!playlist) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader />
        <div className="flex">
          <DesktopSidebar className="hidden md:block" />
          <div className="flex-1 md:pl-[240px] pt-[56px] md:pt-[80px] pb-nav-safe md:pb-6">
            <div className="text-center py-16">
              <h2 className="text-xl font-semibold">Playlist not found</h2>
              <Button
                variant="outline"
                className="mt-4 rounded-full"
                onClick={() => router.back()}
              >
                Go back
              </Button>
            </div>
          </div>
        </div>
        <MobileNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <div className="flex">
        <DesktopSidebar className="hidden md:block" />
        <div className="flex-1 md:pl-[240px] pt-[56px] md:pt-[80px] pb-nav-safe md:pb-6">
          <div className="md:hidden flex items-center gap-3 px-4 py-3 border-b sticky top-[56px] bg-background z-10">
            <button
              onClick={() => router.back()}
              className="flex items-center justify-center h-9 w-9 rounded-full hover:bg-muted"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="font-semibold text-lg truncate">{playlist.name}</h1>
          </div>

          <div className="max-w-[1096px] mx-auto px-4 md:px-6">
            <div className="py-4 md:py-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex gap-4">
                  <div className="w-24 h-24 md:w-32 md:h-32 bg-muted rounded-xl flex items-center justify-center flex-shrink-0">
                    <Play className="h-8 w-8 text-muted-foreground/50" />
                  </div>
                  <div>
                    <h1 className="text-xl md:text-2xl font-bold">{playlist.name}</h1>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                      {playlist.isPublic ? (
                        <Globe className="h-4 w-4" />
                      ) : (
                        <Lock className="h-4 w-4" />
                      )}
                      <span>{playlist.isPublic ? "Public" : "Private"}</span>
                      <span>•</span>
                      <span>{videos.length} videos</span>
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      <Button
                        className="rounded-full gap-2"
                        size="sm"
                        onClick={() => {
                          if (videos.length) {
                            router.push(`/videos/${videos[0].channel}/${videos[0].id}`);
                          }
                        }}
                      >
                        <Play className="h-4 w-4" /> Play all
                      </Button>
                      <Button
                        variant="outline"
                        className="rounded-full gap-2"
                        size="sm"
                        onClick={() => {
                          if (videos.length) {
                            const random = videos[Math.floor(Math.random() * videos.length)];
                            router.push(`/videos/${random.channel}/${random.id}`);
                          }
                        }}
                      >
                        <Shuffle className="h-4 w-4" /> Shuffle
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {playlist.isPublic && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-full gap-2"
                      onClick={handleShare}
                    >
                      <Share className="h-4 w-4" /> Share
                    </Button>
                  )}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="rounded-full">
                        <MoreVertical className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 rounded-xl">
                      <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={() => toast("Edit playlist (prototype)")}
                      >
                        <Edit className="h-4 w-4 mr-2" /> Edit playlist
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="cursor-pointer text-red-500 dark:text-red-400"
                        onClick={() => toast("Delete playlist (prototype)")}
                      >
                        <Trash2 className="h-4 w-4 mr-2" /> Delete playlist
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>

            {videos.length > 0 && (
              <div className="flex items-center gap-3 mb-6">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search in playlist"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-muted/50 rounded-full text-sm outline-none focus:bg-muted transition-colors"
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
            )}

            <div className="space-y-4">
              {filteredVideos.map((video) => (
                <div key={video.id} className="flex gap-3 group">
                  <Link
                    href={`/videos/${video.channel}/${video.id}`}
                    className="relative w-40 md:w-56 aspect-video flex-shrink-0"
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
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <Link href={`/videos/${video.channel}/${video.id}`}>
                          <h3 className="font-medium text-sm md:text-base line-clamp-2 hover:text-primary transition-colors">
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
                      {/* Three-dot menu always visible */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="p-1.5 rounded-full hover:bg-muted transition-colors flex-shrink-0">
                            <MoreVertical className="h-4 w-4 text-muted-foreground" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 rounded-xl">
                          <DropdownMenuItem
                            className="cursor-pointer"
                            onClick={() =>
                              router.push(`/videos/${video.channel}/${video.id}`)
                            }
                          >
                            <Play className="h-4 w-4 mr-3" /> Play now
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="cursor-pointer text-red-500 dark:text-red-400"
                            onClick={() => toast("Remove from playlist (prototype)")}
                          >
                            <Trash2 className="h-4 w-4 mr-3" /> Remove from playlist
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <MobileNav />

      {/* Share Modal */}
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        videoUrl={shareUrl}
      />
    </div>
  );
}