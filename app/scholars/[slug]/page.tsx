// app/scholars/[slug]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  MoreVertical,
  Share,
  Flag,
  Ban,
  Play,
  X,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useMediaQuery } from "@/hooks/use-media-query";
import { scholarData, ScholarItem } from "@/lib/scholar-data";
import { videoData, VideoItem } from "@/lib/video-data";
import { ShareModal } from "@/components/share-modal";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

function ScholarSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <div className="px-4 py-6 mt-16 border-b flex items-start gap-4">
        <Skeleton className="h-20 w-20 md:h-24 md:w-24 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-4 w-64" />
          <Skeleton className="h-4 w-40" />
        </div>
      </div>
      <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex flex-col">
            <Skeleton className="aspect-video w-full rounded-xl" />
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

export default function ScholarDetailPage() {
  const router = useRouter();
  const params = useParams();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const slug = params.slug as string;

  const scholar: ScholarItem | undefined = scholarData.find(
    (s: ScholarItem) => s.slug === slug
  );
  if (!scholar) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        Scholar not found
      </div>
    );
  }

  const scholarVideos: VideoItem[] = videoData.filter(
    (v) => v.channelId === scholar.channelId
  );

  const [isLoading, setIsLoading] = useState(true);
  const [bioModalOpen, setBioModalOpen] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    setShareUrl(typeof window !== "undefined" ? window.location.href : "");
    return () => clearTimeout(timer);
  }, [slug]);

  const handleShare = () => {
    setShareModalOpen(true);
  };

  if (isLoading) {
    return <ScholarSkeleton />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile back button (sticky below global header) */}
      {isMobile && (
        <div className="sticky top-[56px] z-10 bg-background/95 backdrop-blur-sm border-b">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1.5 px-4 py-2 w-full"
          >
            <ArrowLeft className="h-6 w-6 shrink-0" />
            <span className="text-sm font-medium line-clamp-1 text-left">
              {scholar.name}
            </span>
          </button>
        </div>
      )}

      {/* Scholar Profile Section – mt-16 on mobile clears the sticky back button */}
      <div className="px-4 py-6 mt-16 border-b">
        <div className="flex items-start gap-4">
          <Avatar
            className={cn(
              "flex-shrink-0 ring-4 ring-background",
              isMobile ? "h-20 w-20" : "h-24 w-24"
            )}
          >
            <AvatarImage src={scholar.avatar} alt={scholar.name} className="object-cover" />
            <AvatarFallback className="text-2xl bg-muted">
              {scholar.name.charAt(0)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0 pt-1">
            <h1 className="text-xl md:text-2xl font-bold">{scholar.name}</h1>
            <p className="text-sm text-muted-foreground mt-1">{scholar.designation}</p>

            {/* Bio / Description */}
            <div className="mt-3 max-w-2xl">
              <p className="text-sm text-muted-foreground line-clamp-3">
                {scholar.description}
              </p>
              {scholar.description && scholar.description.length > 150 && (
                <button
                  onClick={() => setBioModalOpen(true)}
                  className="text-sm text-primary hover:underline font-medium mt-1"
                >
                  Read full bio
                </button>
              )}
            </div>

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
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 rounded-xl">
                  <DropdownMenuItem className="cursor-pointer" onClick={() => toast("Reported")}>
                    <Flag className="h-4 w-4 mr-3" /> Report
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer" onClick={() => toast("Hidden")}>
                    <Ban className="h-4 w-4 mr-3" /> Don't recommend
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      {/* Bio Modal */}
      <Dialog open={bioModalOpen} onOpenChange={setBioModalOpen}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto [&>button.absolute]:hidden">
          <button
            onClick={() => setBioModalOpen(false)}
            className="rounded-full p-1 hover:bg-muted transition-colors z-10"
            style={{ position: "absolute", top: "12px", right: "12px" }}
            aria-label="Close"
          >
            <X className="h-7 w-7" />
          </button>
          <DialogHeader>
            <DialogTitle>About {scholar.name}</DialogTitle>
          </DialogHeader>
          <div className="text-sm whitespace-pre-wrap leading-relaxed">
            {scholar.description}
          </div>
        </DialogContent>
      </Dialog>

      {/* Videos Section */}
      <div className="px-4 py-4">
        <h2 className="font-semibold text-lg mb-3">
          {scholarVideos.length} Videos
        </h2>
        <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {scholarVideos.map((video) => (
            <div key={video.id} className="flex flex-col group">
              <Link
                href={`/videos/${video.channel}/${video.videoId}`}
                className="relative aspect-video w-full"
              >
                <Image
                  src={`https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`}
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
                <Avatar className="h-9 w-9 flex-shrink-0">
                  <AvatarImage src={video.channelAvatar} />
                  <AvatarFallback>{video.channel.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <Link href={`/videos/${video.channel}/${video.videoId}`}>
                    <h3 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
                      {video.title}
                    </h3>
                  </Link>
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

        {/* Mobile video list */}
        <div className="flex flex-col md:hidden">
          {scholarVideos.map((video) => (
            <div key={video.id} className="flex gap-3 py-3 border-b last:border-0 group">
              <Link
                href={`/videos/${video.channel}/${video.videoId}`}
                className="relative w-40 aspect-video flex-shrink-0"
              >
                <Image
                  src={`https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`}
                  alt={video.title}
                  fill
                  className="object-cover rounded-lg"
                />
                <div className="absolute bottom-1 right-1 bg-black/80 text-white text-[10px] px-1 py-0.5 rounded font-medium">
                  {video.duration}
                </div>
              </Link>
              <div className="flex-1 min-w-0">
                <Link href={`/videos/${video.channel}/${video.videoId}`}>
                  <h3 className="font-medium text-sm line-clamp-2">
                    {video.title}
                  </h3>
                </Link>
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
      </div>

      {/* Share Modal */}
      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        videoUrl={shareUrl}
      />
    </div>
  );
}