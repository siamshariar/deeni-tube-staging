// app/playlists/[slug]/[id]/page.tsx
"use client";

import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
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
  Trash2,
  Edit,
  ChevronDown,
  GripVertical,
  Repeat,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Send,
  Clock,
  Bookmark,
  UserX,
  Flag,
  MoreHorizontal,
  EyeOff,
  Heart,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { ShareModal } from "@/components/share-modal";
import { AddToPlaylistDialog } from "@/components/add-to-playlist-dialog";
import { ReportDialog } from "@/components/report-dialog";
import { useMediaQuery } from "@/hooks/use-media-query";
import { videoData, VideoItem } from "@/lib/video-data";
import { extendedPlaylists, PlaylistItem } from "@/lib/playlist-data";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// ─── Mock comments ─────────────────────────────────
const mockCommentsWithReplies = [
  {
    id: "c1",
    user: "Ahmad Khan",
    avatar: "/placeholder.svg?height=32&width=32",
    timeAgo: "2 days ago",
    content: "MashaAllah, very beneficial lecture! May Allah bless you.",
    likes: 245,
    dislikes: 12,
    replies: [
      {
        id: "r1",
        user: "Daily Dawah",
        avatar: "/placeholder.svg?height=32&width=32",
        timeAgo: "1 day ago",
        content: "JazakAllah khair for your kind words!",
        likes: 89,
        dislikes: 3,
        isChannel: true,
      },
      {
        id: "r2",
        user: "Mohammed Ali",
        avatar: "/placeholder.svg?height=32&width=32",
        timeAgo: "12 hours ago",
        content: "Couldn't agree more. May Allah accept our efforts.",
        likes: 34,
        dislikes: 1,
      },
    ],
  },
  {
    id: "c2",
    user: "Fatima Hassan",
    avatar: "/placeholder.svg?height=32&width=32",
    timeAgo: "1 week ago",
    content: "Beautiful reminder. SubhanAllah! This really touched my heart.",
    likes: 567,
    dislikes: 23,
    replies: [],
  },
  {
    id: "c3",
    user: "Omar Farooq",
    avatar: "/placeholder.svg?height=32&width=32",
    timeAgo: "3 days ago",
    content: "This changed my perspective. JazakAllah khair!",
    likes: 189,
    dislikes: 8,
    replies: [
      {
        id: "r3",
        user: "Zainab Mohammed",
        avatar: "/placeholder.svg?height=32&width=32",
        timeAgo: "2 days ago",
        content: "Same here brother. SubhanAllah!",
        likes: 45,
        dislikes: 2,
      },
    ],
  },
];

// ─── Reply component (recursive) ─────────────────────
function ReplyItem({
  reply,
  onLike,
  onDislike,
  onReply,
  isLiked,
  isDisliked,
  depth = 0,
}: {
  reply: any;
  onLike: (id: string) => void;
  onDislike: (id: string) => void;
  onReply: (id: string) => void;
  isLiked: boolean;
  isDisliked: boolean;
  depth?: number;
}) {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replyText, setReplyText] = useState("");

  const handleReplySubmit = () => {
    if (!replyText.trim()) return;
    setReplyText("");
    setShowReplyInput(false);
    toast.success("Reply added (demo)");
  };

  const displayName = reply.isChannel ? (
    <span className="flex items-center gap-1">
      {reply.user}
      <span className="text-[10px] bg-foreground/10 px-1.5 py-0.5 rounded-full font-medium text-muted-foreground">
        Creator
      </span>
    </span>
  ) : (
    reply.user
  );

  return (
    <div className={`mt-2 ${depth > 0 ? "ml-8" : ""}`}>
      <div className="flex gap-2.5">
        <Avatar className="h-7 w-7 flex-shrink-0">
          <AvatarImage src={reply.avatar} />
          <AvatarFallback className="text-[10px]">
            {reply.user.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-medium">{displayName}</span>
            <span className="text-[10px] text-muted-foreground">
              {reply.timeAgo}
            </span>
          </div>
          <p className="text-sm mt-0.5">{reply.content}</p>
          <div className="flex items-center gap-2 mt-1.5">
            <button
              onClick={() => onLike(reply.id)}
              className={`flex items-center gap-1.5 hover:bg-muted rounded-full px-2.5 py-1 transition-colors ${
                isLiked ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <ThumbsUp
                className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`}
              />
              <span className="text-xs">{reply.likes}</span>
            </button>
            <button
              onClick={() => onDislike(reply.id)}
              className={`hover:bg-muted rounded-full p-1 transition-colors ${
                isDisliked ? "text-destructive" : "text-muted-foreground"
              }`}
            >
              <ThumbsDown
                className={`h-4 w-4 ${isDisliked ? "fill-current" : ""}`}
              />
            </button>
            <button
              onClick={() => setShowReplyInput(!showReplyInput)}
              className="text-xs text-muted-foreground hover:bg-muted rounded-full px-2.5 py-1 transition-colors"
            >
              Reply
            </button>
          </div>
          {showReplyInput && (
            <div className="mt-2 flex gap-2">
              <Avatar className="h-6 w-6 flex-shrink-0">
                <AvatarFallback className="text-[10px]">Y</AvatarFallback>
              </Avatar>
              <div className="flex-1 flex items-center gap-1.5">
                <input
                  type="text"
                  placeholder="Add a reply..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleReplySubmit()}
                  className="flex-1 bg-transparent border-b border-border pb-1 text-xs focus:outline-none focus:ring-0 placeholder:text-muted-foreground"
                  autoFocus
                />
                <button
                  onClick={handleReplySubmit}
                  disabled={!replyText.trim()}
                  className="text-primary hover:text-primary/80 disabled:opacity-30"
                >
                  <Send className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => setShowReplyInput(false)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}
          {reply.replies &&
            reply.replies.map((nestedReply: any) => (
              <ReplyItem
                key={nestedReply.id}
                reply={nestedReply}
                onLike={onLike}
                onDislike={onDislike}
                onReply={onReply}
                isLiked={false}
                isDisliked={false}
                depth={depth + 1}
              />
            ))}
        </div>
      </div>
    </div>
  );
}

// ─── Skeleton for playlist video card ───────────────
function VideoSkeleton() {
  return (
    <div className="flex gap-3 py-2">
      <Skeleton className="w-24 h-14 rounded-lg flex-shrink-0" />
      <div className="flex-1 space-y-1">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3" />
      </div>
    </div>
  );
}

export default function PlaylistDetailPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const playlistId = params.id as string;
  // When opened from a channel page, the playlist is read-only (channel-owned)
  const isChannelPlaylist = searchParams.get("source") === "channel";

  const [playlist, setPlaylist] = useState<PlaylistItem | null>(null);
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [collapsed, setCollapsed] = useState(false);
  const [descriptionModalOpen, setDescriptionModalOpen] = useState(false);   // ✅ added

  const [dragItem, setDragItem] = useState<number | null>(null);

  const [comments, setComments] = useState(mockCommentsWithReplies);
  const [commentText, setCommentText] = useState("");
  const [likedComments, setLikedComments] = useState<Set<string>>(new Set());
  const [dislikedComments, setDislikedComments] = useState<Set<string>>(new Set());
  const [commentsDrawerOpen, setCommentsDrawerOpen] = useState(false);
  const [menuDrawerOpen, setMenuDrawerOpen] = useState(false);
  const [showPlaylistDialog, setShowPlaylistDialog] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);

  const [isLoved, setIsLoved] = useState(false);
  const [autoPlay, setAutoPlay] = useState(true);
  const mobileIframeRef = useRef<HTMLIFrameElement>(null);
  const desktopIframeRef = useRef<HTMLIFrameElement>(null);

  const registerListener = useCallback((iframe: HTMLIFrameElement | null) => {
    if (!iframe?.contentWindow) return;
    setTimeout(() => {
      iframe.contentWindow?.postMessage(JSON.stringify({ event: "listening", id: 1 }), "https://www.youtube.com");
    }, 800);
  }, []);

  // Auto-advance on video end via YouTube postMessage
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.origin !== "https://www.youtube.com") return;
      try {
        const data = typeof e.data === "string" ? JSON.parse(e.data) : e.data;
        if (data?.event === "infoDelivery" && data?.info?.playerState === 0) {
          if (autoPlay) {
            setCurrentVideoIndex((prev) => {
              if (prev < videos.length - 1) return prev + 1;
              return prev;
            });
          }
        }
      } catch {}
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [autoPlay, videos.length]);

  useEffect(() => {
    const timer = setTimeout(() => {
      const found = extendedPlaylists.find((p) => p.id === playlistId);
      if (found) {
        setPlaylist(found);
        const playlistVideos = found.videoIds
          .map(id => videoData.find(v => v.id === id))
          .filter(Boolean) as VideoItem[];
        setVideos(playlistVideos.length > 0 ? playlistVideos : videoData);
        setShareUrl(`${window.location.origin}/playlists/${found.slug}/${found.id}`);
      }
      setIsLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [playlistId]);

  const filteredVideos = useMemo(() => {
    if (!searchQuery) return videos;
    return videos.filter(
      (v) =>
        v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.channel.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [videos, searchQuery]);

  const currentVideo = videos[currentVideoIndex];

  const handleSelectVideo = (index: number) => {
    setCurrentVideoIndex(index);
  };

  const handleDragStart = (index: number) => setDragItem(index);
  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (dragItem === null || dragItem === index) return;
    const items = [...videos];
    const draggedItem = items[dragItem];
    items.splice(dragItem, 1);
    items.splice(index, 0, draggedItem);
    setVideos(items);
    setDragItem(index);
  };
  const handleDragEnd = () => setDragItem(null);

  const handleAddComment = () => {
    if (!commentText.trim()) return;
    const newComment = {
      id: `c${Date.now()}`,
      user: "You",
      avatar: "/placeholder.svg?height=32&width=32",
      timeAgo: "Just now",
      content: commentText.trim(),
      likes: 0,
      dislikes: 0,
      replies: [],
    };
    setComments((prev) => [newComment, ...prev]);
    setCommentText("");
    toast.success("Comment added (demo)");
  };

  const handleLikeComment = (commentId: string) => {
    setLikedComments((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
        setDislikedComments((d) => {
          const dSet = new Set(d);
          dSet.delete(commentId);
          return dSet;
        });
      }
      return newSet;
    });
    setComments((prev) =>
      prev.map((c) => {
        if (c.id === commentId) {
          const isLikedNow = !likedComments.has(commentId);
          return { ...c, likes: isLikedNow ? c.likes + 1 : c.likes - 1 };
        }
        if (c.replies) {
          const updatedReplies = c.replies.map((r) => {
            if (r.id === commentId) {
              const isLikedNow = !likedComments.has(commentId);
              return { ...r, likes: isLikedNow ? r.likes + 1 : r.likes - 1 };
            }
            return r;
          });
          return { ...c, replies: updatedReplies };
        }
        return c;
      })
    );
  };

  const handleDislikeComment = (commentId: string) => {
    setDislikedComments((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(commentId)) {
        newSet.delete(commentId);
      } else {
        newSet.add(commentId);
        setLikedComments((l) => {
          const lSet = new Set(l);
          lSet.delete(commentId);
          return lSet;
        });
      }
      return newSet;
    });
    setComments((prev) =>
      prev.map((c) => {
        if (c.id === commentId) {
          const isDislikedNow = !dislikedComments.has(commentId);
          return { ...c, dislikes: isDislikedNow ? c.dislikes + 1 : c.dislikes - 1 };
        }
        if (c.replies) {
          const updatedReplies = c.replies.map((r) => {
            if (r.id === commentId) {
              const isDislikedNow = !dislikedComments.has(commentId);
              return { ...r, dislikes: isDislikedNow ? r.dislikes + 1 : r.dislikes - 1 };
            }
            return r;
          });
          return { ...c, replies: updatedReplies };
        }
        return c;
      })
    );
  };

  const handleReply = (commentId: string) => toast("Reply input opened (demo)");

  const handleLove = () => {
    setIsLoved(!isLoved);
  };

  const handleShare = () => {
    if (playlist?.isPublic) setShowShareModal(true);
  };

  const toggleCollapse = () => setCollapsed(!collapsed);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pt-14">
        {/* Mobile: sticky back bar */}
        <div className="md:hidden sticky top-14 z-10 bg-background/95 border-b h-11 flex items-center px-4 gap-2">
          <Skeleton className="h-5 w-5 rounded" />
          <Skeleton className="h-4 w-40 rounded" />
        </div>

        {/* Mobile: full-width video */}
        <div className="md:hidden w-full bg-black">
          <Skeleton className="w-full aspect-video" />
        </div>

        <div className="px-3 pt-4 md:px-4 pb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Left: video + info */}
            <div className="flex-1 min-w-0 space-y-3">
              {/* Desktop video */}
              <Skeleton className="hidden md:block w-full aspect-video rounded-xl" />
              {/* Title + channel row */}
              <div className="flex gap-2 items-start">
                <Skeleton className="h-9 w-9 rounded-full flex-shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-4 w-full rounded" />
                  <Skeleton className="h-3 w-32 rounded" />
                  <Skeleton className="h-3 w-24 rounded" />
                </div>
              </div>
              {/* Action buttons */}
              <div className="flex gap-2">
                <Skeleton className="h-8 w-16 rounded-full" />
                <Skeleton className="h-8 w-16 rounded-full" />
                <Skeleton className="h-8 w-16 rounded-full" />
              </div>
            </div>

            {/* Right: playlist panel */}
            <div className="lg:w-[450px] flex-shrink-0 rounded-xl border bg-card overflow-hidden">
              {/* Panel header */}
              <div className="p-4 border-b space-y-2">
                <Skeleton className="h-5 w-36 rounded" />
                <Skeleton className="h-3 w-24 rounded" />
                <div className="flex gap-2 mt-2">
                  <Skeleton className="h-8 w-8 rounded-full" />
                  <Skeleton className="h-8 w-8 rounded-full" />
                </div>
              </div>
              {/* Search */}
              <div className="p-3 border-b">
                <Skeleton className="h-9 w-full rounded-full" />
              </div>
              {/* Video rows */}
              <div className="divide-y">
                {Array.from({ length: 5 }).map((_, i) => (
                  <VideoSkeleton key={i} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!playlist) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center py-16">
          <h2 className="text-xl font-semibold">Playlist not found</h2>
          <Button variant="outline" className="mt-4 rounded-full" onClick={() => router.back()}>
            Go back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-14">
      {/* Mobile back button + title */}
      {isMobile && (
        <div className="sticky top-14 z-10 bg-background/95 backdrop-blur-sm border-b">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 px-4 py-2 w-full min-h-[44px]"
          >
            <ArrowLeft className="h-5 w-5 shrink-0" />
            <span className="text-sm font-medium line-clamp-1 text-left">
              {currentVideo?.title || playlist.name}
            </span>
          </button>
        </div>
      )}

      {/* Mobile: full-width video (edge-to-edge) */}
      {isMobile && (
        <div className="w-full bg-black">
          <div className="relative w-full aspect-video">
            <iframe
              ref={mobileIframeRef}
              key={`mobile-${currentVideoIndex}`}
              src={`https://www.youtube.com/embed/${currentVideo?.videoId || "5qap5aO4i9A"}?autoplay=1&enablejsapi=1`}
              title={currentVideo?.title || "Video"}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
              onLoad={() => registerListener(mobileIframeRef.current)}
            />
          </div>
        </div>
      )}

      <div className="pb-6">
        <div className="px-3 pt-4 md:pt-4 md:px-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 min-w-0">
              {/* Desktop video player */}
              {!isMobile && (
                <div className="w-full bg-black rounded-xl overflow-hidden">
                  <div className="relative w-full aspect-video md:max-h-[75vh] md:mx-auto">
                    <iframe
                      ref={desktopIframeRef}
                      key={`desktop-${currentVideoIndex}`}
                      src={`https://www.youtube.com/embed/${currentVideo?.videoId || "5qap5aO4i9A"}?autoplay=1&enablejsapi=1`}
                      title={currentVideo?.title || "Video"}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="absolute inset-0 w-full h-full"
                      onLoad={() => registerListener(desktopIframeRef.current)}
                    />
                  </div>
                </div>
              )}

              {currentVideo && (
                <div className="mt-2">
                  {/* ── Mobile: avatar left, then title/channel/actions stacked ── */}
                  <div className="flex md:hidden items-start gap-2">
                    <Avatar className="h-9 w-9 flex-shrink-0 mt-0.5">
                      <AvatarImage src={currentVideo.channelAvatar} />
                      <AvatarFallback>{currentVideo.channel?.charAt(0) || "C"}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold leading-snug line-clamp-2">{currentVideo.title}</p>
                      <p className="text-xs font-medium mt-1 leading-tight">{currentVideo.channel}</p>
                      <p className="text-xs text-muted-foreground leading-tight">780K subscribers</p>
                      <div className="flex items-center gap-0.5 mt-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => setShowShareModal(true)}>
                          <Share className="h-4 w-4" />
                        </Button>
                        <Drawer open={menuDrawerOpen} onOpenChange={setMenuDrawerOpen}>
                          <DrawerTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DrawerTrigger>
                          <DrawerContent className="px-0 max-h-[70vh]">
                            <div className="mt-2 pb-6">
                              <div className="flex items-center gap-3 px-4 py-3 hover:bg-muted cursor-pointer"><Clock className="h-5 w-5" /> Save to Watch later</div>
                              <div className="flex items-center gap-3 px-4 py-3 hover:bg-muted cursor-pointer" onClick={() => { setMenuDrawerOpen(false); setTimeout(() => setShowPlaylistDialog(true), 150); }}><Bookmark className="h-5 w-5" /> Save to playlist</div>
                              <div className="flex items-center gap-3 px-4 py-3 hover:bg-muted cursor-pointer" onClick={() => { setMenuDrawerOpen(false); toast("Channel removed from feed"); }}><UserX className="h-5 w-5" /> Don't recommend channel</div>
                              <div className="flex items-center gap-3 px-4 py-3 hover:bg-muted cursor-pointer" onClick={() => { setMenuDrawerOpen(false); toast("Video removed"); setTimeout(() => router.back(), 1000); }}><EyeOff className="h-5 w-5" /> Not interested</div>
                              <div className="flex items-center gap-3 px-4 py-3 hover:bg-muted cursor-pointer" onClick={() => { setMenuDrawerOpen(false); setTimeout(() => setShowReportDialog(true), 150); }}><Flag className="h-5 w-5" /> Report</div>
                            </div>
                          </DrawerContent>
                        </Drawer>
                      </div>
                    </div>
                  </div>

                  {/* ── Desktop: title above, channel row with actions ── */}
                  <div className="hidden md:block">
                    <h1 className="text-xl font-bold leading-tight">{currentVideo.title}</h1>
                    <div className="flex md:items-center md:justify-between gap-2 mt-2">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={currentVideo.channelAvatar} />
                          <AvatarFallback>{currentVideo.channel?.charAt(0) || "C"}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{currentVideo.channel}</p>
                          <p className="text-xs text-muted-foreground">780K subscribers</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {/* Love/Heart button — commented out; uncomment to re-enable
                        <button
                          onClick={handleLove}
                          className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
                            isLoved
                              ? "bg-red-500/10 text-red-500 hover:bg-red-500/20"
                              : "bg-muted hover:bg-muted/80"
                          }`}
                        >
                          <Heart className={`h-5 w-5 ${isLoved ? "fill-current" : ""}`} />
                        </button>
                        */}
                        <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setShowShareModal(true)}>
                          <Share className="h-5 w-5" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="rounded-full">
                              <MoreHorizontal className="h-5 w-5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-72">
                            <DropdownMenuItem className="flex items-center gap-3 px-4 py-3 cursor-pointer"><Clock className="h-5 w-5" /> Save to Watch later</DropdownMenuItem>
                            <DropdownMenuItem className="flex items-center gap-3 px-4 py-3 cursor-pointer" onSelect={(e) => { e.preventDefault(); setShowPlaylistDialog(true); }}><Bookmark className="h-5 w-5" /> Save to playlist</DropdownMenuItem>
                            <DropdownMenuItem className="flex items-center gap-3 px-4 py-3 cursor-pointer" onSelect={() => toast("Channel removed from feed")}><UserX className="h-5 w-5" /> Don't recommend channel</DropdownMenuItem>
                            <DropdownMenuItem className="flex items-center gap-3 px-4 py-3 cursor-pointer" onSelect={() => { toast("Video removed"); setTimeout(() => router.back(), 1000); }}><EyeOff className="h-5 w-5" /> Not interested</DropdownMenuItem>
                            <DropdownMenuItem className="flex items-center gap-3 px-4 py-3 cursor-pointer" onSelect={(e) => { e.preventDefault(); setShowReportDialog(true); }}><Flag className="h-5 w-5" /> Report</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>

                  {/* Description – modal on mobile, inline on desktop */}
                  <div className="mt-2 bg-muted/40 rounded-xl p-3 md:p-4">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-medium">{currentVideo.views}</span>
                      <span className="text-muted-foreground">•</span>
                      <span className="text-muted-foreground">{currentVideo.timeAgo}</span>
                    </div>
                    {isMobile ? (
                      <>
                        <p className="text-sm mt-1 line-clamp-2">
                          {currentVideo.description}
                        </p>
                        <button
                          onClick={() => setDescriptionModalOpen(true)}
                          className="text-sm text-primary hover:underline font-medium mt-1"
                        >
                          Read more
                        </button>
                      </>
                    ) : (
                      <p className="text-sm mt-1 whitespace-pre-wrap">
                        {currentVideo.description}
                      </p>
                    )}
                  </div>

                  {/* Description Modal for Mobile */}
                  <Dialog open={descriptionModalOpen} onOpenChange={setDescriptionModalOpen}>
                    <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto [&>button.absolute]:hidden">
                      <button
                        onClick={() => setDescriptionModalOpen(false)}
                        className="rounded-full p-1 hover:bg-muted transition-colors z-10"
                        style={{ position: "absolute", top: "10px", right: "10px" }}
                        aria-label="Close"
                      >
                        <X className="h-6 w-6" />
                      </button>
                      <DialogHeader>
                        <DialogTitle>Description</DialogTitle>
                      </DialogHeader>
                      <div className="text-sm whitespace-pre-wrap leading-relaxed">
                        {currentVideo.description}
                      </div>
                    </DialogContent>
                  </Dialog>

                  {/* Comments section — commented out; remove the false && wrapper to re-enable */}
                  {false && (<div className="mt-4">
                    {!isMobile ? (
                      <div>
                        <div className="flex items-center gap-6 mb-4">
                          <MessageCircle className="h-5 w-5" />
                          <span className="font-semibold text-base">{comments.length} Comments</span>
                        </div>
                        <div className="flex gap-3 mb-6">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback>Y</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <input
                              type="text"
                              placeholder="Add a comment..."
                              value={commentText}
                              onChange={(e) => setCommentText(e.target.value)}
                              onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
                              className="w-full bg-transparent border-b border-border pb-1.5 text-sm focus:outline-none focus:ring-0 placeholder:text-muted-foreground"
                            />
                            {commentText && (
                              <div className="flex items-center gap-2 mt-3 justify-end">
                                <button onClick={() => setCommentText("")} className="text-sm font-medium hover:bg-muted rounded-full px-4 py-2">Cancel</button>
                                <button onClick={handleAddComment} className="text-sm font-medium bg-foreground text-background rounded-full px-4 py-2 hover:bg-foreground/90 disabled:opacity-50" disabled={!commentText.trim()}>Comment</button>
                              </div>
                            )}
                          </div>
                        </div>
                        {comments.map((comment) => (
                          <div key={comment.id} className="py-3 border-b last:border-0">
                            <div className="flex gap-3">
                              <Avatar className="h-8 w-8">
                                <AvatarImage src={comment.avatar} />
                                <AvatarFallback>{comment.user.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium">{comment.user}</span>
                                  <span className="text-xs text-muted-foreground">{comment.timeAgo}</span>
                                </div>
                                <p className="text-sm mt-0.5">{comment.content}</p>
                                <div className="flex items-center gap-2 mt-1.5">
                                  <button onClick={() => handleLikeComment(comment.id)} className={`flex items-center gap-1.5 hover:bg-muted rounded-full px-2.5 py-1 transition-colors ${likedComments.has(comment.id) ? "text-primary" : "text-muted-foreground"}`}>
                                    <ThumbsUp className={`h-4 w-4 ${likedComments.has(comment.id) ? "fill-current" : ""}`} />
                                    <span className="text-xs">{comment.likes}</span>
                                  </button>
                                  <button onClick={() => handleDislikeComment(comment.id)} className={`hover:bg-muted rounded-full p-1 transition-colors ${dislikedComments.has(comment.id) ? "text-destructive" : "text-muted-foreground"}`}>
                                    <ThumbsDown className={`h-4 w-4 ${dislikedComments.has(comment.id) ? "fill-current" : ""}`} />
                                  </button>
                                  <button onClick={() => handleReply(comment.id)} className="text-xs text-muted-foreground hover:bg-muted rounded-full px-2.5 py-1 transition-colors">Reply</button>
                                </div>
                                {comment.replies && comment.replies.length > 0 && (
                                  <div className="mt-2">
                                    {comment.replies.map((reply: any) => (
                                      <ReplyItem
                                        key={reply.id}
                                        reply={reply}
                                        onLike={handleLikeComment}
                                        onDislike={handleDislikeComment}
                                        onReply={handleReply}
                                        isLiked={likedComments.has(reply.id)}
                                        isDisliked={dislikedComments.has(reply.id)}
                                      />
                                    ))}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <Drawer open={commentsDrawerOpen} onOpenChange={setCommentsDrawerOpen}>
                        <DrawerTrigger asChild>
                          <Button variant="outline" className="w-full rounded-full flex items-center gap-2">
                            <MessageCircle className="h-4 w-4" /> {comments.length} Comments
                        </Button>
                        </DrawerTrigger>
                        <DrawerContent className="h-[80vh]">
                          <DrawerHeader>
                            <DrawerTitle className="text-lg">Comments</DrawerTitle>
                          </DrawerHeader>
                          <div className="px-3 overflow-y-auto">
                            <div className="flex gap-3 mb-6">
                              <Avatar className="h-8 w-8"><AvatarFallback>Y</AvatarFallback></Avatar>
                              <div className="flex-1">
                                <input type="text" placeholder="Add a comment..." value={commentText} onChange={(e) => setCommentText(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleAddComment()} className="w-full bg-transparent border-b border-border pb-1.5 text-sm focus:outline-none focus:ring-0" />
                                {commentText && (
                                  <div className="flex items-center gap-2 mt-2 justify-end">
                                    <button onClick={() => setCommentText("")} className="text-sm font-medium hover:bg-muted rounded-full px-3 py-1">Cancel</button>
                                    <button onClick={handleAddComment} className="text-sm font-medium bg-foreground text-background rounded-full px-3 py-1 disabled:opacity-50" disabled={!commentText.trim()}>Comment</button>
                                  </div>
                                )}
                              </div>
                            </div>
                            {comments.map((comment) => (
                              <div key={comment.id} className="py-3 border-b last:border-0">
                                <div className="flex gap-3">
                                  <Avatar className="h-8 w-8">
                                    <AvatarImage src={comment.avatar} />
                                    <AvatarFallback>{comment.user.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                  <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                      <span className="text-sm font-medium">{comment.user}</span>
                                      <span className="text-xs text-muted-foreground">{comment.timeAgo}</span>
                                    </div>
                                    <p className="text-sm mt-0.5">{comment.content}</p>
                                    <div className="flex items-center gap-2 mt-1.5">
                                      <button onClick={() => handleLikeComment(comment.id)} className={`flex items-center gap-1.5 hover:bg-muted rounded-full px-2.5 py-1 transition-colors ${likedComments.has(comment.id) ? "text-primary" : "text-muted-foreground"}`}>
                                        <ThumbsUp className={`h-4 w-4 ${likedComments.has(comment.id) ? "fill-current" : ""}`} />
                                        <span className="text-xs">{comment.likes}</span>
                                      </button>
                                      <button onClick={() => handleDislikeComment(comment.id)} className={`hover:bg-muted rounded-full p-1 transition-colors ${dislikedComments.has(comment.id) ? "text-destructive" : "text-muted-foreground"}`}>
                                        <ThumbsDown className={`h-4 w-4 ${dislikedComments.has(comment.id) ? "fill-current" : ""}`} />
                                      </button>
                                      <button onClick={() => handleReply(comment.id)} className="text-xs text-muted-foreground hover:bg-muted rounded-full px-2.5 py-1 transition-colors">Reply</button>
                                    </div>
                                    {comment.replies && comment.replies.length > 0 && (
                                      <div className="mt-2">
                                        {comment.replies.map((reply: any) => (
                                          <ReplyItem
                                            key={reply.id}
                                            reply={reply}
                                            onLike={handleLikeComment}
                                            onDislike={handleDislikeComment}
                                            onReply={handleReply}
                                            isLiked={likedComments.has(reply.id)}
                                            isDisliked={dislikedComments.has(reply.id)}
                                          />
                                        ))}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </DrawerContent>
                      </Drawer>
                    )}
                  </div>
                  )}
                </div>
              )}
            </div>

            {/* Right: Playlist panel */}
            <div
              className={cn(
                "rounded-xl border bg-card overflow-hidden",
                isMobile
                  ? "flex-1 min-h-0 flex flex-col"
                  : "lg:w-[450px] flex-shrink-0"
              )}
            >
              <div className="p-4 border-b flex-shrink-0">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-lg">
                      <Link href={`/playlists/${playlist.slug}/${playlist.id}`} className="hover:text-primary">
                        {playlist.name}
                      </Link>
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                      <span className="flex items-center gap-1">
                        {playlist.isPublic ? <Globe className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
                        {playlist.isPublic ? "Public" : "Private"}
                      </span>
                      <span>•</span>
                      <span>{videos.length} videos</span>
                    </div>
                  </div>
                  <button onClick={toggleCollapse} className="p-1 rounded-full hover:bg-muted">
                    <ChevronDown className={cn("h-5 w-5 transition-transform", collapsed ? "rotate-180" : "")} />
                  </button>
                </div>
                {!collapsed && (
                  <div className="flex items-center gap-2 mt-3">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setAutoPlay((v) => !v)}
                        className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors", autoPlay ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")}
                        title={autoPlay ? "Autoplay on" : "Autoplay off"}
                      >
                        <Repeat className="h-3.5 w-3.5" />
                        Autoplay
                      </button>
                      <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full" onClick={() => {
                        if (videos.length) {
                          const random = videos[Math.floor(Math.random() * videos.length)];
                          handleSelectVideo(videos.indexOf(random));
                        }
                      }}>
                        <Shuffle className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex-1" />
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="rounded-full">
                          <MoreVertical className="h-5 w-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48 rounded-xl">
                        {playlist.isPublic && (
                          <DropdownMenuItem className="cursor-pointer" onClick={handleShare}>
                            <Share className="h-4 w-4 mr-2" /> Share
                          </DropdownMenuItem>
                        )}
                        {!isChannelPlaylist && (
                          <>
                            <DropdownMenuItem className="cursor-pointer" onClick={() => toast("Edit playlist (prototype)")}>
                              <Edit className="h-4 w-4 mr-2" /> Edit playlist
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer text-red-500 dark:text-red-400" onClick={() => toast("Delete playlist (prototype)")}>
                              <Trash2 className="h-4 w-4 mr-2" /> Delete playlist
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}
              </div>

              {!collapsed && (
                <div className="p-3 border-b flex-shrink-0">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search in playlist"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-8 py-1.5 bg-muted/50 rounded-full text-sm outline-none focus:bg-muted transition-colors"
                    />
                    {searchQuery && (
                      <button onClick={() => setSearchQuery("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </div>
              )}

              {!collapsed && (
                <div
                  className={cn(
                    "divide-y",
                    isMobile
                      ? "flex-1 overflow-y-auto"
                      : "max-h-[calc(100vh-10rem)] overflow-y-auto"
                  )}
                >
                  {filteredVideos.map((video, index) => (
                    <button
                      key={video.id}
                      onClick={() => handleSelectVideo(index)}
                      className={cn(
                        "w-full flex items-center gap-2 px-2 py-2.5 transition-colors group cursor-pointer",
                        index === currentVideoIndex
                          ? "bg-muted/60 hover:bg-muted/70"
                          : "hover:bg-muted/40"
                      )}
                      draggable={!isChannelPlaylist}
                      onDragStart={!isChannelPlaylist ? () => handleDragStart(index) : undefined}
                      onDragOver={!isChannelPlaylist ? (e) => handleDragOver(e, index) : undefined}
                      onDragEnd={!isChannelPlaylist ? handleDragEnd : undefined}
                    >
                      {/* Mobile indicator: ▶ for active, grip for others (user playlist only) */}
                      <div className="flex md:hidden items-center justify-center w-5 flex-shrink-0">
                        {index === currentVideoIndex ? (
                          <Play className="h-3 w-3 text-primary fill-primary flex-shrink-0" />
                        ) : isChannelPlaylist ? (
                          <span className="text-[10px] font-mono text-muted-foreground">{index + 1}</span>
                        ) : (
                          <GripVertical className="h-4 w-4 text-muted-foreground/50 flex-shrink-0 cursor-grab" />
                        )}
                      </div>

                      {/* Desktop indicator: number / play icon; grip on hover for user playlists only */}
                      <div className="hidden md:flex items-center justify-center w-5 flex-shrink-0 relative">
                        <span className={cn(
                          "text-[10px] font-mono leading-none transition-opacity",
                          !isChannelPlaylist && "group-hover:opacity-0",
                          index === currentVideoIndex ? "text-primary font-semibold" : "text-muted-foreground"
                        )}>
                          {index === currentVideoIndex ? "▶" : index + 1}
                        </span>
                        {!isChannelPlaylist && (
                          <GripVertical className="absolute inset-0 m-auto h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity cursor-grab" />
                        )}
                      </div>

                      {/* Thumbnail — 16:9, slightly larger on mobile: 106×60; sm: 120×68 */}
                      <div className="relative w-[106px] h-[60px] sm:w-[120px] sm:h-[68px] rounded-md overflow-hidden flex-shrink-0 bg-black">
                        <Image
                          src={`https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`}
                          alt={video.title}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute bottom-0.5 right-0.5 bg-black/80 text-white text-[9px] px-1 py-px rounded font-medium leading-none">
                          {video.duration}
                        </div>
                        {index === currentVideoIndex && (
                          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/30">
                            <div className="h-full bg-red-600" style={{ width: "60%" }} />
                          </div>
                        )}
                      </div>

                      {/* Text: title → channel → timeAgo, left-aligned, centred in row */}
                      <div className="flex-1 min-w-0 text-left">
                        <h4 className="text-[13px] font-medium line-clamp-2 group-hover:text-primary leading-[1.35]">
                          {video.title}
                        </h4>
                        {video.channel && (
                          <p className="text-[11px] text-muted-foreground truncate mt-1 leading-tight">
                            {video.channel}
                          </p>
                        )}
                        <p className="text-[11px] text-muted-foreground truncate leading-tight mt-0.5">
                          {video.timeAgo}
                        </p>
                      </div>

                      {/* Three-dot — always visible on mobile, hover-only on desktop */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button
                            className="flex-shrink-0 p-1 rounded-full hover:bg-muted transition-opacity opacity-100 md:opacity-0 md:group-hover:opacity-100"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreVertical className="h-4 w-4 text-muted-foreground" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 rounded-xl">
                          <DropdownMenuItem onClick={() => handleSelectVideo(index)}>
                            <Play className="h-4 w-4 mr-2" /> Play now
                          </DropdownMenuItem>
                          {!isChannelPlaylist && (
                            <DropdownMenuItem className="text-red-500 dark:text-red-400" onClick={() => toast("Remove from playlist (demo)")}>
                              <Trash2 className="h-4 w-4 mr-2" /> Remove
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <ShareModal isOpen={showShareModal} onClose={() => setShowShareModal(false)} videoUrl={shareUrl} />
      {currentVideo && (
        <>
          <AddToPlaylistDialog
            video={{ id: currentVideo.id, title: currentVideo.title, channel: currentVideo.channel }}
            open={showPlaylistDialog}
            onOpenChange={setShowPlaylistDialog}
          />
          <ReportDialog
            videoTitle={currentVideo.title}
            videoId={currentVideo.id}
            open={showReportDialog}
            onOpenChange={setShowReportDialog}
          />
        </>
      )}
    </div>
  );
}