// app/scholars/[slug]/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Globe,
  MoreVertical,
  Play,
  Flag,
  Ban,
  Share,
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
import { useMediaQuery } from "@/hooks/use-media-query";
import { mockScholars, mockVideos } from "@/lib/mock-data";
import { ShareModal } from "@/components/share-modal";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const BANNER_IMAGE = "/vibrant-health-cover.png";

const languages = [
  { code: "en", label: "English" },
  { code: "ar", label: "Arabic" },
  { code: "hi", label: "Hindi" },
  { code: "bn", label: "Bengali" },
  { code: "ur", label: "Urdu" },
];

function ScholarSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <Skeleton className="w-full aspect-[3/1] md:aspect-[6/1.5]" />
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
        <div className="flex gap-2 py-3">
          <Skeleton className="h-8 w-16 rounded-full" />
          <Skeleton className="h-8 w-16 rounded-full" />
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
  const scholar = mockScholars.find((s) => s.slug === slug) || mockScholars[0];
  const scholarVideos = mockVideos
    .filter((v) => v.title.toLowerCase().includes(scholar.name.toLowerCase()))
    .slice(0, 6);
  const [activeLang, setActiveLang] = useState("en");
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showAllLinks, setShowAllLinks] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
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
      {/* Banner */}
      <div className="relative w-full">
        <div className="w-full aspect-[3/1] md:aspect-[6/1.5] relative bg-muted">
          <Image
            src={BANNER_IMAGE}
            alt="Scholar banner"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>

      <div className="px-4 py-4 border-b">
        <div className="flex items-start gap-4">
          <Avatar
            className={cn(
              "flex-shrink-0 ring-4 ring-background -mt-8 relative z-10 overflow-hidden",
              isMobile ? "h-16 w-16" : "h-20 w-20"
            )}
          >
            <AvatarImage 
              src="/medical-professional-profile.png" 
              alt={scholar.name}
              className="object-cover"
            />
            <AvatarFallback className="text-lg bg-muted">
              {scholar.name.charAt(0)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0 pt-1">
            <h1 className="text-xl md:text-2xl font-bold truncate">
              {scholar.name}
            </h1>
            <p className="text-sm text-muted-foreground">
              {scholar.designation}
            </p>

            <div className="mt-2 max-w-2xl">
              <p className="text-sm text-muted-foreground">
                {showFullDescription ? (
                  <>
                    {scholar.description}
                    <button
                      onClick={() => setShowFullDescription(false)}
                      className="text-primary ml-1 hover:underline font-medium"
                    >
                      Show less
                    </button>
                  </>
                ) : (
                  <>
                    {scholar.description.slice(0, 150)}
                    {scholar.description.length > 150 && (
                      <button
                        onClick={() => setShowFullDescription(true)}
                        className="text-primary ml-1 hover:underline font-medium"
                      >
                        ...more
                      </button>
                    )}
                  </>
                )}
              </p>
            </div>

            {scholar.website && (
              <div className="mt-2 space-y-1">
                <Link
                  href={`https://${scholar.website}`}
                  target="_blank"
                  className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                >
                  <Globe className="h-3 w-3" />
                  {scholar.website}
                </Link>
                {showAllLinks ? (
                  <>
                    {scholar.facebook && (
                      <Link
                        href={`https://${scholar.facebook}`}
                        target="_blank"
                        className="text-sm text-blue-600 hover:underline block"
                      >
                        Facebook
                      </Link>
                    )}
                    {scholar.twitter && (
                      <Link
                        href={`https://${scholar.twitter}`}
                        target="_blank"
                        className="text-sm text-blue-600 hover:underline block"
                      >
                        Twitter
                      </Link>
                    )}
                    {scholar.youtube && (
                      <Link
                        href={`https://${scholar.youtube}`}
                        target="_blank"
                        className="text-sm text-blue-600 hover:underline block"
                      >
                        YouTube
                      </Link>
                    )}
                    <button
                      onClick={() => setShowAllLinks(false)}
                      className="text-xs text-blue-600 hover:underline"
                    >
                      Show less
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setShowAllLinks(true)}
                    className="text-xs text-blue-600 hover:underline"
                  >
                    Show more links
                  </button>
                )}
              </div>
            )}

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

      {/* Language tabs */}
      <div className="border-b">
        <div className="flex gap-2 px-4 py-3 overflow-x-auto scrollbar-none">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => setActiveLang(lang.code)}
              className={cn(
                "px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
                activeLang === lang.code
                  ? "bg-foreground text-background"
                  : "bg-muted hover:bg-muted/80 text-foreground"
              )}
            >
              {lang.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 py-3">
        <p className="text-sm text-muted-foreground">
          {scholarVideos.length} videos in{" "}
          {languages.find((l) => l.code === activeLang)?.label}
        </p>
      </div>

      <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 px-4 pb-6">
        {scholarVideos.map((video) => (
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
              <Avatar className="h-9 w-9 flex-shrink-0">
                <AvatarImage src={video.channelAvatar} />
                <AvatarFallback>{video.channel.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <Link href={`/videos/${video.channel}/${video.id}`}>
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

      <div className="flex flex-col md:hidden px-4 pb-6">
        {scholarVideos.map((video) => (
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
              <Link href={`/videos/${video.channel}/${video.id}`}>
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

      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        videoUrl={shareUrl}
      />
    </div>
  );
}