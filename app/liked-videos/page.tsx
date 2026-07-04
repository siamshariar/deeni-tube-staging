// app/liked-videos/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  MoreVertical,
  ThumbsUp,
  Play,
  Shuffle,
  Trash2,
  ListPlus,
  BookmarkPlus,
  Share2,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { videoData, VideoItem } from "@/lib/video-data";
import { shortsVideos, ShortVideo } from "@/lib/shorts-data";

type FilterOption = "all" | "videos" | "shorts";

const INITIAL_VIDEOS: VideoItem[] = videoData.slice(2, 10);
const INITIAL_SHORTS: ShortVideo[] = shortsVideos.slice(2, 6);

export default function LikedVideosPage() {
  const router = useRouter();
  const [videos, setVideos] = useState<VideoItem[]>(INITIAL_VIDEOS);
  const [shorts, setShorts] = useState<ShortVideo[]>(INITIAL_SHORTS);
  const [activeFilter, setActiveFilter] = useState<FilterOption>("all");

  const removeVideo = (id: string) => {
    setVideos((prev) => prev.filter((v) => v.id !== id));
    toast.success("Removed from Liked videos");
  };

  const removeShort = (id: string) => {
    setShorts((prev) => prev.filter((s) => s.id !== id));
    toast.success("Removed from Liked videos");
  };

  const firstVideo = videos[0];
  const firstThumb = firstVideo
    ? `https://img.youtube.com/vi/${firstVideo.videoId}/hqdefault.jpg`
    : null;

  const showVideos = activeFilter === "all" || activeFilter === "videos";
  const showShorts = activeFilter === "all" || activeFilter === "shorts";
  const isEmpty = videos.length === 0 && shorts.length === 0;

  return (
    <div className="min-h-screen bg-background mt-14 md:mt-16">
      {/* Mobile sticky header */}
      <div className="md:hidden flex items-center gap-3 px-4 py-3 border-b sticky top-14 bg-background z-10">
        <button
          onClick={() => router.back()}
          className="flex items-center justify-center h-9 w-9 rounded-full hover:bg-muted"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="font-semibold text-lg">Liked videos</h1>
        <span className="text-sm text-muted-foreground">
          ({videos.length + shorts.length})
        </span>
      </div>

      <div className="px-3 md:px-6 py-4 md:py-6">
        {isEmpty ? (
          <div className="text-center py-20">
            <ThumbsUp className="h-16 w-16 mx-auto text-muted-foreground/20 mb-4" />
            <h2 className="text-xl font-semibold mb-2">No liked videos</h2>
            <p className="text-muted-foreground mb-5">
              Videos you like will appear here
            </p>
            <Button className="rounded-full" onClick={() => router.push("/")}>
              Browse videos
            </Button>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-6">
            {/* ── Left panel (desktop only) ── */}
            <div className="hidden md:flex md:w-[300px] xl:w-[340px] flex-shrink-0 sticky top-[80px] self-start h-[calc(100vh-80px)] flex-col">
              <div className="relative flex-1 rounded-2xl overflow-hidden bg-card border shadow-sm flex flex-col">
                {/* Blurred background */}
                {firstThumb && (
                  <>
                    <Image
                      src={firstThumb}
                      alt=""
                      fill
                      className="object-cover scale-110 blur-md opacity-30"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/90" />
                  </>
                )}

                <div className="relative z-10 flex flex-col h-full p-6 text-white">
                  {/* Top: icon + title + count */}
                  <div className="mb-5">
                    <ThumbsUp className="h-7 w-7 mb-2 opacity-70" />
                    <h2 className="text-xl font-bold leading-tight">
                      Liked videos
                    </h2>
                    <p className="text-sm text-white/60 mt-1">
                      {videos.length} videos · {shorts.length} shorts
                    </p>
                  </div>

                  {/* First video preview */}
                  {firstVideo && (
                    <Link
                      href={`/videos/${firstVideo.channel}/${firstVideo.videoId}`}
                      className="block mb-5 group flex-shrink-0"
                    >
                      <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-white/10">
                        <Image
                          src={firstThumb!}
                          alt={firstVideo.title}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        <div className="absolute bottom-1.5 right-1.5 bg-black/80 text-white text-[10px] px-1.5 py-0.5 rounded font-medium">
                          {firstVideo.duration}
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="bg-black/60 rounded-full p-3">
                            <Play className="h-6 w-6 fill-white text-white" />
                          </div>
                        </div>
                      </div>
                      <p className="text-xs font-medium line-clamp-2 mt-2 text-white/70 group-hover:text-white transition-colors">
                        {firstVideo.title}
                      </p>
                    </Link>
                  )}

                  <div className="flex-1" />

                  {/* Action buttons */}
                  <div className="space-y-2">
                    <Button
                      onClick={() =>
                        firstVideo &&
                        router.push(
                          `/videos/${firstVideo.channel}/${firstVideo.videoId}`
                        )
                      }
                      className="rounded-full gap-2 bg-white text-black hover:bg-white/90 w-full font-semibold"
                    >
                      <Play className="h-4 w-4 fill-current" /> Play all
                    </Button>
                    <Button
                      onClick={() => {
                        const r =
                          videos[Math.floor(Math.random() * videos.length)];
                        if (r)
                          router.push(`/videos/${r.channel}/${r.videoId}`);
                      }}
                      variant="outline"
                      className="rounded-full gap-2 bg-white/10 text-white border-white/20 hover:bg-white/20 w-full"
                    >
                      <Shuffle className="h-4 w-4" /> Shuffle
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Right column ── */}
            <div className="flex-1 min-w-0">
              {/* Filter chips */}
              <div className="flex items-center gap-2 mb-5 overflow-x-auto scrollbar-none pb-0.5">
                {(["all", "videos", "shorts"] as FilterOption[]).map(
                  (filter) => {
                    const count =
                      filter === "all"
                        ? videos.length + shorts.length
                        : filter === "videos"
                        ? videos.length
                        : shorts.length;
                    return (
                      <button
                        key={filter}
                        onClick={() => setActiveFilter(filter)}
                        className={cn(
                          "px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors flex-shrink-0",
                          activeFilter === filter
                            ? "bg-foreground text-background"
                            : "bg-muted hover:bg-muted/80 text-foreground"
                        )}
                      >
                        {filter === "all"
                          ? "All"
                          : filter === "videos"
                          ? "Videos"
                          : "Shorts"}{" "}
                        <span className="text-xs opacity-60">({count})</span>
                      </button>
                    );
                  }
                )}
              </div>

              {/* ── Videos list ── */}
              {showVideos && videos.length > 0 && (
                <section className="mb-8">
                  {activeFilter === "all" && (
                    <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest mb-3">
                      Videos — {videos.length}
                    </p>
                  )}
                  <div className="space-y-0.5">
                    {videos.map((video) => {
                      const thumb = `https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`;
                      return (
                        <div
                          key={video.id}
                          className="group flex items-center gap-3 py-2 px-2 rounded-xl hover:bg-muted/60 transition-colors"
                        >
                          {/* Thumbnail */}
                          <Link
                            href={`/videos/${video.channel}/${video.videoId}`}
                            className="relative flex-shrink-0 w-28 sm:w-32 md:w-36 aspect-video rounded-lg overflow-hidden bg-black"
                          >
                            <Image
                              src={thumb}
                              alt={video.title}
                              fill
                              className="object-cover"
                            />
                            <div className="absolute bottom-1 right-1 bg-black/80 text-white text-[10px] px-1 rounded font-medium">
                              {video.duration}
                            </div>
                          </Link>

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <Link
                              href={`/videos/${video.channel}/${video.videoId}`}
                            >
                              <h3 className="text-sm font-medium line-clamp-2 hover:text-primary transition-colors leading-snug">
                                {video.title}
                              </h3>
                            </Link>
                            <div className="flex items-center gap-1.5 mt-1.5">
                              <Avatar className="h-4 w-4 flex-shrink-0">
                                <AvatarImage src={video.channelAvatar} />
                                <AvatarFallback className="text-[8px]">
                                  {video.channel.charAt(0)}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-xs text-muted-foreground truncate">
                                {video.channel}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {video.views} · {video.timeAgo}
                            </p>
                          </div>

                          {/* Three-dot menu — always visible */}
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button className="p-1.5 rounded-full hover:bg-muted transition-colors flex-shrink-0">
                                <MoreVertical className="h-4 w-4 text-muted-foreground" />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="w-56 rounded-xl"
                            >
                              <DropdownMenuItem
                                onClick={() => toast("Added to queue")}
                              >
                                <ListPlus className="h-4 w-4 mr-3" /> Add to
                                queue
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => toast("Saved to Watch Later")}
                              >
                                <Clock className="h-4 w-4 mr-3" /> Save to
                                Watch Later
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => toast("Saved to playlist")}
                              >
                                <BookmarkPlus className="h-4 w-4 mr-3" /> Save
                                to playlist
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() =>
                                  toast("Link copied to clipboard")
                                }
                              >
                                <Share2 className="h-4 w-4 mr-3" /> Share
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-600 dark:text-red-400"
                                onClick={() => removeVideo(video.id)}
                              >
                                <Trash2 className="h-4 w-4 mr-3" /> Remove
                                from Liked Videos
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}

              {/* ── Shorts grid ── */}
              {showShorts && shorts.length > 0 && (
                <section>
                  {activeFilter === "all" && (
                    <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-widest mb-3">
                      Shorts — {shorts.length}
                    </p>
                  )}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3">
                    {shorts.map((short) => {
                      const thumb = `https://img.youtube.com/vi/${short.youtubeId}/hqdefault.jpg`;
                      return (
                        <div key={short.id} className="relative">
                          <Link href="/shorts" className="block group">
                            <div className="relative aspect-[9/16] rounded-xl overflow-hidden bg-black">
                              <Image
                                src={thumb}
                                alt={short.title}
                                fill
                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                              <div className="absolute bottom-10 left-3 right-10">
                                <p className="text-white text-xs font-medium line-clamp-2">
                                  {short.title}
                                </p>
                                <p className="text-white/60 text-[10px] mt-0.5">
                                  {short.views} views
                                </p>
                              </div>
                            </div>
                          </Link>

                          {/* Always-visible three-dot — overlaid on card */}
                          <div className="absolute bottom-[38px] right-2 z-10">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <button className="p-1 rounded-full bg-black/50 hover:bg-black/70 transition-colors">
                                  <MoreVertical className="h-3.5 w-3.5 text-white" />
                                </button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent
                                align="end"
                                className="w-52 rounded-xl"
                              >
                                <DropdownMenuItem
                                  onClick={() => toast("Added to queue")}
                                >
                                  <ListPlus className="h-4 w-4 mr-3" /> Add to
                                  queue
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => toast("Saved to Watch Later")}
                                >
                                  <Clock className="h-4 w-4 mr-3" /> Save to
                                  Watch Later
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => toast("Saved to playlist")}
                                >
                                  <BookmarkPlus className="h-4 w-4 mr-3" />{" "}
                                  Save to playlist
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() =>
                                    toast("Link copied to clipboard")
                                  }
                                >
                                  <Share2 className="h-4 w-4 mr-3" /> Share
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-red-600 dark:text-red-400"
                                  onClick={() => removeShort(short.id)}
                                >
                                  <Trash2 className="h-4 w-4 mr-3" /> Remove
                                  from Liked Videos
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>

                          {/* Channel info below card */}
                          <div className="mt-2 flex items-center gap-1.5 px-1">
                            <Avatar className="h-5 w-5 flex-shrink-0">
                              <AvatarImage src={short.channelAvatar} />
                              <AvatarFallback className="text-[8px]">
                                {short.channel.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-xs text-muted-foreground truncate">
                              {short.channel}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}

              {/* Empty state for active filter */}
              {((activeFilter === "videos" && videos.length === 0) ||
                (activeFilter === "shorts" && shorts.length === 0)) && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground text-sm">
                    No {activeFilter} liked yet
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
