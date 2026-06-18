"use client";

import { useState, useEffect, useMemo } from "react";
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
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import AppHeader from "@/components/app-header";
import MobileNav from "@/components/mobile-nav";
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
import { Skeleton } from "@/components/ui/skeleton";
import { ShareModal } from "@/components/share-modal";
import { useMediaQuery } from "@/hooks/use-media-query";
import { mockPlaylists, mockVideos } from "@/lib/mock-data";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// ─── Mock comments (unchanged) ─────────────────────────────────
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

// ─── Reply component (recursive) ────────────────────────────────────────
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

// ─── Skeleton for video card in playlist ───────────────────────────────
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

// ─── Generate extended mock videos for playlist ────────────────────────
const extendedMockVideos = (playlist: any) => {
  if (!playlist) return [];
  const videos = playlist.videoIds
    .map((id: string) => mockVideos.find((v) => v.id === id))
    .filter(Boolean);
  while (videos.length < 15) {
    const idx = videos.length + 1;
    videos.push({
      id: `gen-${idx}`,
      title: `Mock Video ${idx} - ${playlist.name}`,
      channel: playlist.isPublic ? "Mock Channel" : "Private Channel",
      duration: `${Math.floor(Math.random() * 10)}:${String(
        Math.floor(Math.random() * 60)
      ).padStart(2, "0")}`,
      views: `${Math.floor(Math.random() * 1000)}K views`,
      timeAgo: "1 month ago",
      thumbnail: `https://placehold.co/600x400/111/888?text=Video+${idx}`,
      channelAvatar: `https://placehold.co/32x32/333/fff?text=C`,
      videoUrl: "https://www.youtube.com/embed/5qap5aO4i9A",
      description: "This is a mock video description for the playlist.",
    });
  }
  return videos.slice(0, 15);
};

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
  const [collapsed, setCollapsed] = useState(false);

  const [dragItem, setDragItem] = useState<number | null>(null);

  const [comments, setComments] = useState(mockCommentsWithReplies);
  const [commentText, setCommentText] = useState("");
  const [likedComments, setLikedComments] = useState<Set<string>>(new Set());
  const [dislikedComments, setDislikedComments] = useState<Set<string>>(new Set());
  const [descriptionDrawerOpen, setDescriptionDrawerOpen] = useState(false);
  const [commentsDrawerOpen, setCommentsDrawerOpen] = useState(false);

  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      const found = mockPlaylists.find((p) => p.id === playlistId);
      if (found) {
        setPlaylist(found);
        const playlistVideos = extendedMockVideos(found);
        setVideos(playlistVideos);
        setShareUrl(
          `${window.location.origin}/playlists/${found.slug}/${found.id}`
        );
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

  const currentVideo = videos[0];

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

  const handleLikeVideo = () => {
    setIsLiked(!isLiked);
    if (isDisliked) setIsDisliked(false);
  };

  const handleDislikeVideo = () => {
    setIsDisliked(!isDisliked);
    if (isLiked) setIsLiked(false);
  };

  const handleShare = () => {
    if (playlist?.isPublic) setShowShareModal(true);
  };

  const toggleCollapse = () => setCollapsed(!collapsed);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader />
        <div className="pt-[56px] md:pt-[72px] pb-nav-safe md:pb-6">
          <div className="flex flex-col lg:flex-row gap-4 px-4">
            <div className="flex-1 min-w-0">
              <Skeleton className="aspect-[4/3] md:aspect-video w-full rounded-xl" />
            </div>
            <div className="lg:w-[450px] space-y-3">
              <Skeleton className="h-8 w-48" />
              <div className="space-y-2">
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
        <div className="flex-1 pt-[56px] md:pt-[72px] pb-nav-safe md:pb-6">
          <div className="text-center py-16">
            <h2 className="text-xl font-semibold">Playlist not found</h2>
            <Button variant="outline" className="mt-4 rounded-full" onClick={() => router.back()}>
              Go back
            </Button>
          </div>
        </div>
        <MobileNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <div className="pt-[56px] md:pt-[72px] pb-nav-safe md:pb-6 px-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* ===================== LEFT SIDE: Player + Details + Comments ===================== */}
          <div className="flex-1 min-w-0">
            {/* Video player – shorter on desktop to reveal comments */}
              {/* Video player – responsive aspect ratio like video details page */}
              <div className="w-full bg-black rounded-xl overflow-hidden">
                <div className="relative w-full aspect-[4/3] md:aspect-video md:max-h-[75vh] md:mx-auto">
                  <iframe
                    src={currentVideo?.videoUrl || "https://www.youtube.com/embed/5qap5aO4i9A"}
                    title={currentVideo?.title || "Video"}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full"
                  />
                </div>
              </div>

            {/* Video info */}
            {currentVideo && (
              <div className="mt-2">
                <h1 className="text-lg md:text-xl font-bold leading-tight">
                  {currentVideo.title}
                </h1>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-2">
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
                    <div className="flex items-center bg-muted rounded-full overflow-hidden">
                      <button
                        onClick={handleLikeVideo}
                        className={`flex items-center gap-2 px-4 py-2 hover:bg-muted/80 transition-colors border-r border-border ${
                          isLiked ? "text-foreground" : ""
                        }`}
                      >
                        <ThumbsUp className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`} />
                        <span className="text-sm font-medium">15K</span>
                      </button>
                      <button
                        onClick={handleDislikeVideo}
                        className={`px-4 py-2 hover:bg-muted/80 transition-colors ${
                          isDisliked ? "text-foreground" : ""
                        }`}
                      >
                        <ThumbsDown className={`h-5 w-5 ${isDisliked ? "fill-current" : ""}`} />
                      </button>
                    </div>
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
                        <DropdownMenuItem className="flex items-center gap-3 px-4 py-3 cursor-pointer">
                          <Clock className="h-5 w-5" /> Save to Watch later
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex items-center gap-3 px-4 py-3 cursor-pointer">
                          <Bookmark className="h-5 w-5" /> Save to playlist
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toast("Channel removed from feed")} className="flex items-center gap-3 px-4 py-3 cursor-pointer">
                          <UserX className="h-5 w-5" /> Don't recommend channel
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => { toast("Video removed"); setTimeout(() => router.back(), 1000); }} className="flex items-center gap-3 px-4 py-3 cursor-pointer">
                          <EyeOff className="h-5 w-5" /> Not interested
                        </DropdownMenuItem>
                        <DropdownMenuItem className="flex items-center gap-3 px-4 py-3 cursor-pointer">
                          <Flag className="h-5 w-5" /> Report
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {/* Description */}
                <div className="mt-2 bg-muted/40 rounded-xl p-3 md:p-4">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium">{currentVideo.views}</span>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-muted-foreground">{currentVideo.timeAgo}</span>
                  </div>
                  {!isMobile ? (
                    <p className="text-sm mt-1 whitespace-pre-wrap">
                      {currentVideo.description || "This is a mock video description. The actual content will appear here."}
                    </p>
                  ) : (
                    <>
                      <p className="text-sm mt-1 line-clamp-2">
                        {currentVideo.description || "Mock description..."}
                      </p>
                      <button
                        onClick={() => setDescriptionDrawerOpen(true)}
                        className="text-sm text-primary hover:underline font-medium mt-1"
                      >
                        Read more
                      </button>
                    </>
                  )}
                </div>

                {/* Mobile description drawer */}
                <Drawer open={descriptionDrawerOpen} onOpenChange={setDescriptionDrawerOpen}>
                  <DrawerContent className="max-h-[80vh]">
                    <DrawerHeader>
                      <DrawerTitle className="text-lg">About this video</DrawerTitle>
                    </DrawerHeader>
                    <div className="p-4 overflow-y-auto">
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {currentVideo.description || "Full description (mock)."}
                      </p>
                    </div>
                  </DrawerContent>
                </Drawer>

                {/* Comments */}
                <div className="mt-4">
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
                        <div className="px-4 overflow-y-auto">
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
              </div>
            )}
          </div>

          {/* ===================== RIGHT SIDE: Playlist Panel (draggable) ===================== */}
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
                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full" title="Loop playlist" onClick={() => toast.info("Loop toggled (demo)")}>
                      <Repeat className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full" title="Shuffle playlist" onClick={() => {
                      if (videos.length) {
                        const random = videos[Math.floor(Math.random() * videos.length)];
                        router.push(`/videos/${random.channel}/${random.id}`);
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
                      <DropdownMenuItem className="cursor-pointer" onClick={() => toast("Edit playlist (prototype)")}>
                        <Edit className="h-4 w-4 mr-2" /> Edit playlist
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer text-red-500 dark:text-red-400" onClick={() => toast("Delete playlist (prototype)")}>
                        <Trash2 className="h-4 w-4 mr-2" /> Delete playlist
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}
            </div>

            {/* Search inside playlist */}
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

            {/* Scrollable video list */}
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
                  <Link
                    key={video.id}
                    href={`/videos/${video.channel}/${video.id}`}
                    className="flex items-center gap-2 px-3 py-2 hover:bg-muted/30 transition-colors group"
                    draggable
                    onDragStart={() => handleDragStart(index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragEnd={handleDragEnd}
                  >
                    {/* Combined index & drag handle */}
                    <div className="flex items-center justify-center w-8 text-center relative cursor-grab">
                      <span className="text-xs text-muted-foreground font-mono group-hover:opacity-0 transition-opacity">
                        {index === 0 ? "▶" : index + 1}
                      </span>
                      <GripVertical className="absolute inset-0 m-auto h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>

                    <div className="relative w-24 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-black">
                      <Image src={video.thumbnail} alt={video.title} fill className="object-cover" />
                      <div className="absolute bottom-0.5 right-0.5 bg-black/80 text-white text-[10px] px-1 rounded font-medium">
                        {video.duration}
                      </div>
                      {index === 0 && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/30">
                          <div className="h-full bg-red-600" style={{ width: "60%" }} />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium line-clamp-2 group-hover:text-primary">{video.title}</h4>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <Avatar className="h-4 w-4">
                          <AvatarImage src={video.channelAvatar} />
                          <AvatarFallback className="text-[8px]">{video.channel?.charAt(0) || "C"}</AvatarFallback>
                        </Avatar>
                        <span className="text-xs text-muted-foreground">{video.channel}</span>
                        <span className="text-xs text-muted-foreground">•</span>
                        <span className="text-xs text-muted-foreground">{video.timeAgo}</span>
                      </div>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="p-1 rounded-full hover:bg-muted opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.preventDefault()}>
                          <MoreVertical className="h-4 w-4 text-muted-foreground" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48 rounded-xl">
                        <DropdownMenuItem onClick={() => router.push(`/videos/${video.channel}/${video.id}`)}>
                          <Play className="h-4 w-4 mr-2" /> Play now
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-500 dark:text-red-400" onClick={() => toast("Remove from playlist (demo)")}>
                          <Trash2 className="h-4 w-4 mr-2" /> Remove
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Share Modal */}
      <ShareModal isOpen={showShareModal} onClose={() => setShowShareModal(false)} videoUrl={shareUrl} />

      <MobileNav />
    </div>
  );
}