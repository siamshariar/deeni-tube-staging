// app/videos/[slug]/[id]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  MoreVertical,
  Share,
  Clock,
  Bookmark,
  UserX,
  Flag,
  ThumbsUp,
  ThumbsDown,
  MoreHorizontal,
  MessageCircle,
  EyeOff,
  Send,
  Reply,
  X,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
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
import { ShareModal } from "@/components/share-modal";
import { useMediaQuery } from "@/hooks/use-media-query";
import { toast } from "sonner";
import { videoData, VideoItem } from "@/lib/video-data"; // ✅ shared data

// ─── Mock comments (unchanged) ─────────────────────────────────────
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

// ─── Skeletons ─────────────────────────────────────────────────────
function CommentSkeleton() {
  return (
    <div className="flex gap-3 py-3">
      <Skeleton className="h-8 w-8 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </div>
    </div>
  );
}

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
                  <XIcon className="h-3.5 w-3.5" />
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

function XIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

// ─── Main Component ─────────────────────────────────────────────────
export default function VideoPlayPage() {
  const router = useRouter();
  const params = useParams();
  const isMobile = useMediaQuery("(max-width: 768px)");

  const [mainVideo, setMainVideo] = useState<VideoItem>(videoData[0]);
  const [relatedVideos, setRelatedVideos] = useState<VideoItem[]>(videoData.slice(1));

  const [comments, setComments] = useState(mockCommentsWithReplies);
  const [isLiked, setIsLiked] = useState(false);
  const [isDisliked, setIsDisliked] = useState(false);
  const [isLoved, setIsLoved] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [descriptionModalOpen, setDescriptionModalOpen] = useState(false);
  const [commentsDrawerOpen, setCommentsDrawerOpen] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [likedComments, setLikedComments] = useState<Set<string>>(new Set());
  const [dislikedComments, setDislikedComments] = useState<Set<string>>(new Set());

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  // Switch main video when route changes
  useEffect(() => {
    const slug = params?.slug as string;
    const videoId = params?.id as string;
    const found = videoData.find(
      (v) => v.videoId === videoId || (slug && v.channel.toLowerCase().includes(slug.toLowerCase()))
    );
    if (found) {
      setMainVideo(found);
      setRelatedVideos(videoData.filter((v) => v.id !== found.id));
      setShowFullDescription(false);
    }
  }, [params]);

  const handleLike = () => {
    setIsLiked(!isLiked);
    if (isDisliked) setIsDisliked(false);
  };

  const handleDislike = () => {
    setIsDisliked(!isDisliked);
    if (isLiked) setIsLiked(false);
  };

  const handleLove = () => {
    setIsLoved(!isLoved);
  };

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

  const handleReply = (commentId: string) => {
    toast("Reply input opened (demo)");
  };

  // Auto-play URL – standard YouTube controls visible
  const videoSrc = `https://www.youtube.com/embed/${mainVideo.videoId}?autoplay=1`;

  return (
    <div className="min-h-screen bg-background pt-14">
      {/* Mobile back button – sits naturally below the fixed header */}
      {isMobile && (
        <div className="sticky top-14 z-10 bg-background/95 backdrop-blur-sm border-b">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 px-4 py-2 w-full min-h-[44px]"
          >
            <ArrowLeft className="h-5 w-5 shrink-0" />
            <span className="text-sm font-medium line-clamp-1 text-left">
              {mainVideo.title}
            </span>
          </button>
        </div>
      )}

      {/* Main content */}
      <div className="md:pt-4 pb-6">
        {/* Mobile: full-width video */}
        {isMobile && (
          <div className="w-full bg-black">
            <div className="relative w-full aspect-video">
              <iframe
                src={videoSrc}
                title={mainVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full"
              />
            </div>
          </div>
        )}

        {/* Content */}
        <div className="px-3 md:px-4">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 min-w-0">
              {/* Desktop video player */}
              {!isMobile && (
                <div className="w-full bg-black rounded-xl overflow-hidden">
                  <div className="relative w-full aspect-video md:max-h-[75vh] md:mx-auto">
                    <iframe
                      src={videoSrc}
                      title={mainVideo.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="absolute inset-0 w-full h-full"
                    />
                  </div>
                </div>
              )}

              {/* Video info */}
              <div className="mt-2">
                {/* ── Mobile: single row — avatar | title+channel | share+3-dot ── */}
                <div className="flex md:hidden items-center gap-2">
                  <Avatar className="h-9 w-9 flex-shrink-0">
                    <AvatarImage src={mainVideo.channelAvatar} />
                    <AvatarFallback>{mainVideo.channel.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold leading-snug line-clamp-2">{mainVideo.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{mainVideo.channel} • 780K subscribers</p>
                  </div>
                  <div className="flex items-center gap-0.5 flex-shrink-0">
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => setShowShareModal(true)}>
                      <Share className="h-4 w-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                          <MoreVertical className="h-4 w-4" />
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

                {/* ── Desktop: title above, channel row with actions ── */}
                <div className="hidden md:block">
                  <h1 className="text-xl font-bold leading-tight">{mainVideo.title}</h1>
                  <div className="flex md:items-center md:justify-between gap-2 mt-2">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={mainVideo.channelAvatar} />
                        <AvatarFallback>{mainVideo.channel.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium">{mainVideo.channel}</p>
                        <p className="text-xs text-muted-foreground">780K subscribers</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center bg-muted rounded-full overflow-hidden">
                        {/* <button
                          onClick={handleLike}
                          className={`flex items-center gap-2 px-4 py-2 hover:bg-muted/80 transition-colors border-r border-border ${
                            isLiked ? "text-foreground" : ""
                          }`}
                        >
                          <ThumbsUp className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`} />
                          <span className="text-sm font-medium">15K</span>
                        </button> */}
                        {/* <button
                          onClick={handleDislike}
                          className={`px-4 py-2 hover:bg-muted/80 transition-colors ${
                            isDisliked ? "text-foreground" : ""
                          }`}
                        >
                          <ThumbsDown className={`h-5 w-5 ${isDisliked ? "fill-current" : ""}`} />
                        </button> */}
                      </div>
                      {/* Love/Heart button — commented out; uncomment to re-enable
                      <button
                        onClick={handleLove}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${
                          isLoved
                            ? "bg-red-500/10 text-red-500 hover:bg-red-500/20"
                            : "bg-muted hover:bg-muted/80"
                        }`}
                      >
                        <Heart
                          className={`h-5 w-5 ${isLoved ? "fill-current" : ""}`}
                        />
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
                </div>

                {/* Description – inline expand on desktop, modal on mobile */}
                <div className="mt-2 bg-muted/40 rounded-xl p-3 md:p-4">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="font-medium">{mainVideo.views}</span>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-muted-foreground">{mainVideo.timeAgo}</span>
                  </div>
                  {isMobile ? (
                    <>
                      <p className="text-sm mt-1 line-clamp-2">
                        {mainVideo.description}
                      </p>
                      <button
                        onClick={() => setDescriptionModalOpen(true)}
                        className="text-sm text-primary hover:underline font-medium mt-1"
                      >
                        Read more
                      </button>
                    </>
                  ) : (
                    <>
                      {showFullDescription ? (
                        <p className="text-sm mt-1 whitespace-pre-wrap">
                          {mainVideo.description}
                          <button
                            onClick={() => setShowFullDescription(false)}
                            className="text-primary ml-1 hover:underline font-medium text-sm"
                          >
                            Show less
                          </button>
                        </p>
                      ) : (
                        <>
                          <p className="text-sm mt-1 line-clamp-2">
                            {mainVideo.description?.slice(0, 150)}
                            {mainVideo.description && mainVideo.description.length > 150 && "..."}
                          </p>
                          {mainVideo.description && mainVideo.description.length > 150 && (
                            <button
                              onClick={() => setShowFullDescription(true)}
                              className="text-sm text-primary hover:underline font-medium mt-1"
                            >
                              Read more
                            </button>
                          )}
                        </>
                      )}
                    </>
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
                      {mainVideo.description}
                    </div>
                  </DialogContent>
                </Dialog>

                {/* Comments section — commented out; remove the false && wrapper to re-enable */}
                {false && (<div className="mt-4">
                  {!isMobile ? (
                    <div>
                      <div className="flex items-center gap-6 mb-4">
                        <MessageCircle className="h-5 w-5" />
                        <span className="font-semibold text-base">
                          {comments.length} Comments
                        </span>
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
                              <button onClick={() => setCommentText("")} className="text-sm font-medium hover:bg-muted rounded-full px-4 py-2">
                                Cancel
                              </button>
                              <button
                                onClick={handleAddComment}
                                className="text-sm font-medium bg-foreground text-background rounded-full px-4 py-2 hover:bg-foreground/90 disabled:opacity-50"
                                disabled={!commentText.trim()}
                              >
                                Comment
                              </button>
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
                                <button
                                  onClick={() => handleLikeComment(comment.id)}
                                  className={`flex items-center gap-1.5 hover:bg-muted rounded-full px-2.5 py-1 transition-colors ${
                                    likedComments.has(comment.id) ? "text-primary" : "text-muted-foreground"
                                  }`}
                                >
                                  <ThumbsUp className={`h-4 w-4 ${likedComments.has(comment.id) ? "fill-current" : ""}`} />
                                  <span className="text-xs">{comment.likes}</span>
                                </button>
                                <button
                                  onClick={() => handleDislikeComment(comment.id)}
                                  className={`hover:bg-muted rounded-full p-1 transition-colors ${
                                    dislikedComments.has(comment.id) ? "text-destructive" : "text-muted-foreground"
                                  }`}
                                >
                                  <ThumbsDown className={`h-4 w-4 ${dislikedComments.has(comment.id) ? "fill-current" : ""}`} />
                                </button>
                                <button
                                  onClick={() => handleReply(comment.id)}
                                  className="text-xs text-muted-foreground hover:bg-muted rounded-full px-2.5 py-1 transition-colors"
                                >
                                  Reply
                                </button>
                              </div>
                              {comment.replies?.length > 0 && (
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
                              <input
                                type="text"
                                placeholder="Add a comment..."
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleAddComment()}
                                className="w-full bg-transparent border-b border-border pb-1.5 text-sm focus:outline-none focus:ring-0"
                              />
                              {commentText && (
                                <div className="flex items-center gap-2 mt-2 justify-end">
                                  <button onClick={() => setCommentText("")} className="text-sm font-medium hover:bg-muted rounded-full px-3 py-1">
                                    Cancel
                                  </button>
                                  <button
                                    onClick={handleAddComment}
                                    className="text-sm font-medium bg-foreground text-background rounded-full px-3 py-1 disabled:opacity-50"
                                    disabled={!commentText.trim()}
                                  >
                                    Comment
                                  </button>
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
                                    <button
                                      onClick={() => handleLikeComment(comment.id)}
                                      className={`flex items-center gap-1.5 hover:bg-muted rounded-full px-2.5 py-1 transition-colors ${
                                        likedComments.has(comment.id) ? "text-primary" : "text-muted-foreground"
                                      }`}
                                    >
                                      <ThumbsUp className={`h-4 w-4 ${likedComments.has(comment.id) ? "fill-current" : ""}`} />
                                      <span className="text-xs">{comment.likes}</span>
                                    </button>
                                    <button
                                      onClick={() => handleDislikeComment(comment.id)}
                                      className={`hover:bg-muted rounded-full p-1 transition-colors ${
                                        dislikedComments.has(comment.id) ? "text-destructive" : "text-muted-foreground"
                                      }`}
                                    >
                                      <ThumbsDown className={`h-4 w-4 ${dislikedComments.has(comment.id) ? "fill-current" : ""}`} />
                                    </button>
                                    <button
                                      onClick={() => handleReply(comment.id)}
                                      className="text-xs text-muted-foreground hover:bg-muted rounded-full px-2.5 py-1 transition-colors"
                                    >
                                      Reply
                                    </button>
                                  </div>
                                  {comment.replies?.length > 0 && (
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
            </div>

            {/* Related Videos – Desktop */}
            {!isMobile && (
              <div className="lg:w-[450px] flex-shrink-0">
                <h3 className="font-semibold text-base mb-2">Related Videos</h3>
                <div className="space-y-3">
                  {relatedVideos.map((v) => (
                    <Link
                      key={v.id}
                      href={`/videos/${v.channel}/${v.videoId}`}
                      className="flex gap-2 group hover:bg-muted/30 rounded-lg p-1 transition-colors"
                    >
                      <div className="relative w-[168px] h-[94px] flex-shrink-0">
                        <Image
                          src={`https://img.youtube.com/vi/${v.videoId}/hqdefault.jpg`}
                          alt={v.title}
                          fill
                          className="object-cover rounded-lg"
                        />
                        <div className="absolute bottom-1 right-1 bg-black/80 text-white text-xs px-1 py-0.5 rounded font-medium">
                          {v.duration}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0 py-1">
                        <h4 className="font-medium text-sm line-clamp-2 group-hover:text-primary">
                          {v.title}
                        </h4>
                        <p className="text-xs text-muted-foreground mt-1">
                          {v.channel}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {v.views} • {v.timeAgo}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Videos – Mobile */}
        {isMobile && (
          <div className="px-3 mt-6">
            <h3 className="font-semibold text-base mb-4">Related Videos</h3>
            <div className="space-y-3">
              {relatedVideos.map((v) => (
                <Link
                  key={v.id}
                  href={`/videos/${v.channel}/${v.videoId}`}
                  className="flex gap-3 group py-2 border-b last:border-0"
                >
                  <div className="relative w-40 aspect-video flex-shrink-0">
                    <Image
                      src={`https://img.youtube.com/vi/${v.videoId}/hqdefault.jpg`}
                      alt={v.title}
                      fill
                      className="object-cover rounded-lg"
                    />
                    <div className="absolute bottom-1 right-1 bg-black/80 text-white text-[10px] px-1 py-0.5 rounded font-medium">
                      {v.duration}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm line-clamp-2 group-hover:text-primary">
                      {v.title}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      {v.channel}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {v.views} • {v.timeAgo}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Share Modal */}
      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        videoUrl={typeof window !== "undefined" ? window.location.href : ""}
      />
    </div>
  );
}