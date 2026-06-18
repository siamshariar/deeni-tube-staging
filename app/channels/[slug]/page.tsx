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
  Clock,
  Bookmark,
  Ban,
  UserX,
  Flag,
  ThumbsUp,
  ThumbsDown,
  ChevronDown,
  MessageCircle,
  Send,
  SortDesc,
  MoreHorizontal,
  X,
  Pencil,
  Trash2,
  Check,
  Reply,
  Globe,
  LogIn,
  Search,
  Bell,
  BellOff,
  BellRing,
  UserMinus,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import AppHeader from "@/components/app-header";
import VideoCard from "@/components/video-card";
import DesktopSidebar from "@/components/desktop-sidebar";
import MobileNav from "@/components/mobile-nav";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import { mockChannels, mockVideos } from "@/lib/mock-data";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { ShareModal } from "@/components/share-modal";
import { toast } from "sonner";

function ChannelSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <div className="flex">
        <DesktopSidebar className="hidden md:block" />
        <div className="flex-1 md:pl-[240px] pt-[56px] pb-nav-safe">
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
            <div className="flex gap-6 h-12 items-center">
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
      </div>
      <MobileNav />
    </div>
  );
}

export default function ChannelDetailPage() {
  const params = useParams();
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const channelSlug = params.slug as string;

  const channel =
    mockChannels.find((ch) => ch.slug === channelSlug) || mockChannels[0];
  const channelVideos = mockVideos
    .filter((v) => v.channelId === channel.id)
    .slice(0, 8);

  const [activeTab, setActiveTab] = useState("videos");
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showAllLinks, setShowAllLinks] = useState(false);
  const [descriptionDrawerOpen, setDescriptionDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [localOn, setLocalOn] = useState(true);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState("");

  // Mock prototype images (hardcoded)
  const bannerImage = "/vibrant-health-cover.png";
  const avatarImage = "/medical-professional-profile.png";

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    setShareUrl(typeof window !== "undefined" ? window.location.href : "");
    return () => clearTimeout(timer);
  }, []);

  const handleToggleFeed = (checked: boolean) => {
    setLocalOn(checked);
    toast(
      checked ? "Channel added to your feed" : "Channel removed from your feed"
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

  if (isLoading) {
    return <ChannelSkeleton />;
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <div className="flex">
        <DesktopSidebar className="hidden md:block" />
        <main className="flex-1 md:pl-[240px] pt-[56px] pb-nav-safe">
          {/* Mobile header */}
          {/* <div className="md:hidden flex items-center gap-3 px-4 py-3 border-b sticky top-[56px] bg-background z-20">
            <button
              onClick={() => router.back()}
              className="flex items-center justify-center h-9 w-9 rounded-full hover:bg-muted"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="font-semibold text-lg truncate">{channel.name}</h1>
          </div> */}

          {/* Banner – using prototype mock image */}
          <div className="relative w-full">
            <div className="w-full aspect-[3/1] md:aspect-[6/1.5] relative bg-muted">
              <Image
                src={bannerImage}
                alt="Channel banner"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* Channel info */}
          <div className="px-4 py-4 border-b">
            <div className="flex items-start gap-4">
              {/* Avatar – using prototype mock image */}
              <Avatar
                className={cn(
                  "flex-shrink-0 ring-4 ring-background -mt-8 relative z-10",
                  isMobile ? "h-16 w-16" : "h-20 w-20"
                )}
              >
                <AvatarImage src={avatarImage} />
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
                  {formatNumber(channel.videosCount)} videos
                </p>

                {/* Description */}
                <div className="mt-2 max-w-2xl">
                  {!isMobile ? (
                    <p className="text-sm text-muted-foreground">
                      {showFullDescription ? (
                        <>
                          {channel.description}
                          <button
                            onClick={() => setShowFullDescription(false)}
                            className="text-primary ml-1 hover:underline font-medium"
                          >
                            Show less
                          </button>
                        </>
                      ) : (
                        <>
                          {channel.description.slice(0, 150)}
                          {channel.description.length > 150 && (
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
                  ) : (
                    <>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {channel.description}
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

                <Drawer
                  open={descriptionDrawerOpen}
                  onOpenChange={setDescriptionDrawerOpen}
                >
                  <DrawerContent className="max-h-[80vh]">
                    <DrawerHeader>
                      <DrawerTitle className="text-lg">
                        About {channel.name}
                      </DrawerTitle>
                    </DrawerHeader>
                    <div className="p-4 overflow-y-auto">
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {channel.description}
                      </p>
                    </div>
                  </DrawerContent>
                </Drawer>

                {/* Links */}
                <div className="mt-2 space-y-1">
                  {channel.website && (
                    <Link
                      href={`https://${channel.website}`}
                      target="_blank"
                      className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                    >
                      <Globe className="h-3 w-3" />
                      {channel.website}
                    </Link>
                  )}
                  {showAllLinks ? (
                    <>
                      {channel.facebook && (
                        <Link
                          href={`https://${channel.facebook}`}
                          target="_blank"
                          className="text-sm text-blue-600 hover:underline block"
                        >
                          Facebook
                        </Link>
                      )}
                      {channel.twitter && (
                        <Link
                          href={`https://${channel.twitter}`}
                          target="_blank"
                          className="text-sm text-blue-600 hover:underline block"
                        >
                          Twitter
                        </Link>
                      )}
                      {channel.youtube && (
                        <Link
                          href={`https://${channel.youtube}`}
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
                    (channel.facebook ||
                      channel.twitter ||
                      channel.youtube) && (
                      <button
                        onClick={() => setShowAllLinks(true)}
                        className="text-xs text-blue-600 hover:underline"
                      >
                        Show more links
                      </button>
                    )
                  )}
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-2 mt-4 flex-wrap">
                  <div className="flex items-center gap-2 bg-muted rounded-full px-3 py-1.5">
                    <span className="text-sm font-medium">
                      {localOn ? "On" : "Off"}
                    </span>
                    <Switch
                      checked={localOn}
                      onCheckedChange={handleToggleFeed}
                    />
                    <span className="text-xs text-muted-foreground hidden sm:inline">
                      Feed preference
                    </span>
                  </div>

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
                        <Ban className="h-4 w-4 mr-3" /> Don't recommend
                        channel
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
              isMobile ? "sticky top-[56px] bg-background z-10" : ""
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
                    videoId={video.id}
                    title={video.title}
                    channel={video.channel}
                    channelId={video.channelId}
                    channelAvatar={video.channelAvatar}
                    views={video.views}
                    timestamp={video.timeAgo}
                    duration={video.duration}
                    thumbnail={video.thumbnail}
                    isHorizontal={false}
                  />
                ))}
              </div>
              <div className="flex flex-col md:hidden">
                {channelVideos.map((video) => (
                  <VideoCard
                    key={video.id}
                    videoId={video.id}
                    title={video.title}
                    channel={video.channel}
                    channelId={video.channelId}
                    channelAvatar={video.channelAvatar}
                    views={video.views}
                    timestamp={video.timeAgo}
                    duration={video.duration}
                    thumbnail={video.thumbnail}
                    isHorizontal={true}
                  />
                ))}
              </div>
            </>
          )}

          {activeTab === "shorts" && (
            <div className="grid gap-4 p-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex flex-col group cursor-pointer">
                  <div className="relative aspect-[9/16] w-full rounded-lg overflow-hidden bg-muted">
                    <Image
                      src="/placeholder.svg?height=480&width=270"
                      alt={`Short ${i + 1}`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <h3 className="font-medium text-sm line-clamp-2 mt-2 group-hover:text-primary transition-colors">
                    Short #{i + 1}
                  </h3>
                  <p className="text-muted-foreground text-xs">
                    {Math.floor(Math.random() * 50)}K views
                  </p>
                </div>
              ))}
            </div>
          )}

          {activeTab === "playlists" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="border rounded-xl p-4 hover:bg-muted/30 transition-colors cursor-pointer group"
                >
                  <h3 className="font-medium text-base group-hover:text-primary transition-colors">
                    Playlist #{i + 1}
                  </h3>
                  <p className="text-muted-foreground text-xs mt-1">
                    Updated 2 weeks ago
                  </p>
                  <p className="text-muted-foreground text-xs mt-1">
                    {Math.floor(Math.random() * 20)} videos
                  </p>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Share Modal */}
      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        videoUrl={shareUrl}
      />

      <MobileNav />
    </div>
  );
}