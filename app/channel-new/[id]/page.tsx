"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft, MoreVertical, Share, Clock, Bookmark, Ban, UserX, Flag,
  ListPlus, ThumbsUp, ThumbsDown, ChevronDown, MessageCircle,
  Send, SortDesc, MoreHorizontal, X, Pencil, Trash2, Check, Reply, Globe, LogIn, Search, Bell, BellOff, BellRing, UserMinus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import AppHeader from "@/components/app-header";
import VideoCard from "@/components/video-card";
import DesktopSidebar from "@/components/desktop-sidebar";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import MobileNav from "@/components/mobile-nav";
import { useLanguage } from "@/hooks/use-language";
import { useFeedPreferences } from "@/hooks/useFeedPreferences";
import { allChannels } from "@/lib/channels";

// Helper to get channel by slug
const getChannelBySlug = (slug: string) => {
  const channel = allChannels.find(ch => ch.slug === slug);
  if (!channel) {
    // Fallback to first channel
    return { ...allChannels[0], slug, id: allChannels[0].id };
  }
  return channel;
};

// Mock videos per channel (replace with real API later)
const getVideosForChannel = (channelId: string) => {
  if (channelId === "ch1") {
    return [
      { id: "v1", title: "The Purpose of Life - Powerful Islamic Reminder", thumbnail: "/diverse-group-exercising.png", views: 208000, timeAgo: "2 hours ago", duration: "18:28" },
      { id: "v2", title: "Tafsir of Surah Al-Fatiha - Complete Explanation", thumbnail: "/vibrant-health-drink.png", views: 150000, timeAgo: "2 days ago", duration: "25:15" },
      { id: "v3", title: "How to Pray Salah - Step by Step Guide", thumbnail: "/healthy-heart-motion.png", views: 500000, timeAgo: "5 days ago", duration: "12:40" },
      { id: "v4", title: "Stories of the Prophets - Prophet Musa (AS)", thumbnail: "/healthy-pancreas-infographic.png", views: 1200000, timeAgo: "1 week ago", duration: "45:00" },
    ];
  } else if (channelId === "ch2") {
    return [
      { id: "v5", title: "Daily Reminder: Patience", thumbnail: "/placeholder.svg?height=480&width=854", views: 89000, timeAgo: "1 day ago", duration: "5:20" },
      { id: "v6", title: "The Power of Dua", thumbnail: "/placeholder.svg?height=480&width=854", views: 120000, timeAgo: "3 days ago", duration: "10:30" },
    ];
  } else if (channelId === "ch3") {
    return [
      { id: "v7", title: "The Hereafter - A Reminder", thumbnail: "/placeholder.svg?height=480&width=854", views: 340000, timeAgo: "2 weeks ago", duration: "22:10" },
      { id: "v8", title: "Mercy of Allah", thumbnail: "/placeholder.svg?height=480&width=854", views: 210000, timeAgo: "1 week ago", duration: "15:45" },
    ];
  } else {
    return [
      { id: "v9", title: "Surah Al-Fatiha Recitation", thumbnail: "/placeholder.svg?height=480&width=854", views: 50000, timeAgo: "5 days ago", duration: "3:20" },
    ];
  }
};

const getAllShorts = (channelId: string) => [
  { id: "s1", title: "Quick Reminder #1", thumbnail: "/placeholder.svg?height=480&width=270", views: 45000, duration: "0:58" },
];

const playlists = [
  { id: "p1", title: "Quran Tafsir Series", videoCount: 24, updatedAt: "Updated 2 weeks ago" },
];

export default function ChannelPage() {
  const params = useParams();
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { isGuest } = useLanguage();
  const { followedChannels, toggleFollowChannel } = useFeedPreferences();

  const [activeTab, setActiveTab] = useState("videos");
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showAllLinks, setShowAllLinks] = useState(false);
  const [videoSort, setVideoSort] = useState<"latest" | "popular" | "oldest">("latest");
  const [showChannelNameInHeader, setShowChannelNameInHeader] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [showSignInDialog, setShowSignInDialog] = useState(false);
  const [pendingAction, setPendingAction] = useState<"subscribe" | null>(null);

  const [loadingVideos, setLoadingVideos] = useState(true);
  const [videosList, setVideosList] = useState<any[]>([]);
  const [shortsList, setShortsList] = useState<any[]>([]);
  const [hasMoreVideos, setHasMoreVideos] = useState(true);
  const [page, setPage] = useState(1);
  const observer = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef<HTMLDivElement>(null);

  const channelSlug = params.id as string;
  const channel = getChannelBySlug(channelSlug);
  const isSubscribed = followedChannels.includes(channel.id); // ON/OFF status

  const fetchVideos = useCallback(async (pageNum: number, sort: typeof videoSort) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    let allVideos = getVideosForChannel(channel.id);
    if (sort === "latest") allVideos = [...allVideos].sort((a, b) => new Date(b.timeAgo).getTime() - new Date(a.timeAgo).getTime());
    else if (sort === "popular") allVideos = [...allVideos].sort((a, b) => b.views - a.views);
    else if (sort === "oldest") allVideos = [...allVideos].sort((a, b) => new Date(a.timeAgo).getTime() - new Date(b.timeAgo).getTime());
    const pageSize = 6;
    const start = (pageNum - 1) * pageSize;
    const paginated = allVideos.slice(start, start + pageSize);
    if (pageNum >= 3) setHasMoreVideos(false);
    return paginated;
  }, [channel.id]);

  const fetchShorts = useCallback(async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    return getAllShorts(channel.id);
  }, [channel.id]);

  useEffect(() => {
    fetchVideos(1, videoSort).then(setVideosList).finally(() => setLoadingVideos(false));
    fetchShorts().then(setShortsList);
  }, [fetchVideos, fetchShorts, videoSort]);

  useEffect(() => {
    if (loadingVideos || activeTab !== "videos") return;
    observer.current = new IntersectionObserver(([target]) => {
      if (target.isIntersecting && hasMoreVideos) setPage(p => p + 1);
    }, { rootMargin: "0px 0px 200px 0px" });
    if (loadingRef.current) observer.current.observe(loadingRef.current);
    return () => observer.current?.disconnect();
  }, [loadingVideos, hasMoreVideos, activeTab]);

  useEffect(() => {
    if (page === 1) return;
    setLoadingVideos(true);
    fetchVideos(page, videoSort).then(newVideos => {
      setVideosList(prev => [...prev, ...newVideos]);
      setLoadingVideos(false);
    });
  }, [page, fetchVideos, videoSort]);

  useEffect(() => {
    const handleScroll = () => setShowChannelNameInHeader(window.scrollY > 200);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleToggleFeed = () => {
    if (isGuest) {
      setPendingAction("subscribe");
      setShowSignInDialog(true);
      return;
    }
    toggleFollowChannel(channel.id);
  };

  const handleShare = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const formatNumber = (num: number) => {
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
    if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
    return String(num);
  };

  const getVideoCardProps = (video: any) => ({
    videoId: video.id,
    title: video.title,
    channelName: channel.name,
    channelAvatar: channel.avatar,
    views: formatNumber(video.views) + " views",
    timestamp: video.timeAgo,
    duration: video.duration,
    isHorizontal: false,
  });

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      {isMobile && (
        <div className={cn("fixed top-[56px] left-0 right-0 bg-background z-20 transition-all duration-300 border-b", showChannelNameInHeader ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0")}>
          <div className="flex items-center gap-3 px-4 py-2">
            <button onClick={() => router.back()} className="flex items-center justify-center h-9 w-9 rounded-full hover:bg-muted"><ArrowLeft className="h-5 w-5" /></button>
            <h1 className="text-base font-medium truncate">{channel.name}</h1>
          </div>
        </div>
      )}
      <div className="flex">
        <DesktopSidebar className="hidden md:block" />
        <main className={cn("flex-1", isMobile ? "pb-nav-safe" : "md:pl-[240px] md:pt-[80px]")}>
          {/* Banner */}
          <div className="relative w-full">
            <div className="w-full aspect-[3/1] md:aspect-[6/1.5] relative">
              <Image src={channel.coverImage || "/vibrant-health-cover.png"} alt="banner" fill className="object-cover" priority />
            </div>
          </div>
          {/* Channel info */}
          <div className="px-4 py-4 border-b">
            <div className="flex items-start gap-4">
              <Avatar className={cn("flex-shrink-0", isMobile ? "h-16 w-16" : "h-20 w-20")}>
                <AvatarImage src={channel.avatar} />
                <AvatarFallback>{channel.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1 flex-wrap">
                  <h1 className="text-xl md:text-2xl font-bold truncate">{channel.name}</h1>
                  {channel.verified && (
                    <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307z" />
                    </svg>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{channel.handle || `@${channel.slug}`}</p>
                <p className="text-sm text-muted-foreground">{formatNumber(channel.subscribers)} subscribers • {formatNumber(channel.videosCount)} videos</p>
                <div className="mt-2 max-w-2xl">
                  <p className="text-sm text-muted-foreground">
                    {showFullDescription ? channel.description : channel.description.slice(0, 150)}
                    {channel.description.length > 150 && (
                      <button onClick={() => setShowFullDescription(!showFullDescription)} className="text-blue-600 ml-1 hover:underline">
                        {showFullDescription ? "Show less" : "...more"}
                      </button>
                    )}
                  </p>
                </div>
                <div className="mt-2 space-y-1">
                  {channel.website && (
                    <Link href={`https://${channel.website}`} target="_blank" className="text-sm text-blue-600 hover:underline flex items-center gap-1">
                      <Globe className="h-3 w-3" />{channel.website}
                    </Link>
                  )}
                  {showAllLinks ? (
                    <>
                      {channel.facebook && <Link href={`https://${channel.facebook}`} target="_blank" className="text-sm text-blue-600 hover:underline block">Facebook</Link>}
                      {channel.twitter && <Link href={`https://${channel.twitter}`} target="_blank" className="text-sm text-blue-600 hover:underline block">Twitter</Link>}
                      {channel.youtube && <Link href={`https://${channel.youtube}`} target="_blank" className="text-sm text-blue-600 hover:underline block">YouTube</Link>}
                      <button onClick={() => setShowAllLinks(false)} className="text-xs text-blue-600 hover:underline">Show less</button>
                    </>
                  ) : (
                    (channel.facebook || channel.twitter || channel.youtube) && (
                      <button onClick={() => setShowAllLinks(true)} className="text-xs text-blue-600 hover:underline">Show more links</button>
                    )
                  )}
                </div>
                <div className="flex items-center gap-2 mt-4 flex-wrap">
                  <div className="flex items-center gap-2 bg-muted rounded-full px-3 py-1.5">
                    <span className="text-sm font-medium">{isSubscribed ? "On" : "Off"}</span>
                    <Switch checked={isSubscribed} onCheckedChange={handleToggleFeed} />
                    <span className="text-xs text-muted-foreground">Feed preference</span>
                  </div>
                  <Button variant="outline" className="rounded-full h-9 flex-shrink-0" onClick={handleShare}>
                    {copiedLink ? <Check className="h-4 w-4 mr-2" /> : <Share className="h-4 w-4 mr-2" />}
                    {copiedLink ? "Copied!" : "Share"}
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="rounded-full">
                        <MoreVertical className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-56">
                      <DropdownMenuItem className="cursor-pointer"><Flag className="h-4 w-4 mr-3" /> Report</DropdownMenuItem>
                      <DropdownMenuItem className="cursor-pointer"><Ban className="h-4 w-4 mr-3" /> Don't recommend channel</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          </div>
          {/* Tabs */}
          <div className={`border-b ${isMobile ? "sticky top-[56px] bg-background z-20" : ""}`}>
            <Tabs defaultValue="videos" className="w-full" onValueChange={setActiveTab}>
              <TabsList className="h-12 bg-background w-full justify-start overflow-x-auto scrollbar-hide px-4">
                <TabsTrigger value="videos" className="px-4 py-1 data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:rounded-none data-[state=active]:bg-transparent">Videos</TabsTrigger>
                <TabsTrigger value="shorts" className="px-4 py-1 data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:rounded-none data-[state=active]:bg-transparent">Shorts</TabsTrigger>
                <TabsTrigger value="playlists" className="px-4 py-1 data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:rounded-none data-[state=active]:bg-transparent">Playlists</TabsTrigger>
                <TabsTrigger value="posts" className="px-4 py-1 data-[state=active]:border-b-2 data-[state=active]:border-black data-[state=active]:rounded-none data-[state=active]:bg-transparent">Posts</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          {/* Videos Tab */}
          {activeTab === "videos" && (
            <>
              <div className="px-4 py-3 flex items-center justify-between gap-2">
                <div className="flex gap-2">
                  <Button variant={videoSort === "latest" ? "default" : "outline"} className="rounded-full h-8 text-xs px-3" onClick={() => { setVideoSort("latest"); setPage(1); setHasMoreVideos(true); setLoadingVideos(true); }}>Latest</Button>
                  <Button variant={videoSort === "popular" ? "default" : "outline"} className="rounded-full h-8 text-xs px-3" onClick={() => { setVideoSort("popular"); setPage(1); setHasMoreVideos(true); setLoadingVideos(true); }}>Popular</Button>
                  <Button variant={videoSort === "oldest" ? "default" : "outline"} className="rounded-full h-8 text-xs px-3" onClick={() => { setVideoSort("oldest"); setPage(1); setHasMoreVideos(true); setLoadingVideos(true); }}>Oldest</Button>
                </div>
                <Button variant="ghost" size="icon" onClick={() => setShowSearch(!showSearch)} className="rounded-full"><Search className="h-5 w-5" /></Button>
              </div>
              {showSearch && (
                <div className="px-4 pb-3">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input type="text" placeholder="Search in this channel" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-10 py-2 rounded-full border focus:outline-none focus:border-primary text-sm" />
                    {searchQuery && <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2"><X className="h-4 w-4 text-muted-foreground" /></button>}
                  </div>
                </div>
              )}
              <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
                {videosList.map(video => <VideoCard key={video.id} {...getVideoCardProps(video)} isHorizontal={false} />)}
                {loadingVideos && page === 1 && Array.from({ length: 4 }).map((_, i) => (
                  <div key={`sk-${i}`} className="flex flex-col">
                    <Skeleton className="aspect-video w-full rounded-lg" />
                    <div className="flex mt-2 gap-2">
                      <Skeleton className="h-9 w-9 rounded-full flex-shrink-0" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-full" /><Skeleton className="h-3 w-3/4" />
                      </div>
                    </div>
                  </div>
                ))}
                {hasMoreVideos && <div ref={loadingRef} className="col-span-full flex justify-center p-4" />}
              </div>
              <div className="flex flex-col md:hidden">
                {videosList.map(video => <VideoCard key={video.id} {...getVideoCardProps(video)} isHorizontal={true} />)}
                {loadingVideos && page === 1 && Array.from({ length: 3 }).map((_, i) => (
                  <div key={`skm-${i}`} className="flex gap-3 p-3">
                    <Skeleton className="w-40 h-24 rounded-lg flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-full" /><Skeleton className="h-3 w-3/4" />
                    </div>
                  </div>
                ))}
                {hasMoreVideos && <div ref={loadingRef} className="flex justify-center p-4" />}
              </div>
            </>
          )}
          {/* Shorts Tab */}
          {activeTab === "shorts" && (
            <div className={cn("grid gap-4 p-4", isMobile ? "grid-cols-2 gap-2 p-2" : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5")}>
              {shortsList.map(short => (
                <Link key={short.id} href={`/shorts/${short.id}`} className="flex flex-col group">
                  <div className="relative aspect-[9/16] w-full rounded-lg overflow-hidden bg-muted">
                    <Image src={short.thumbnail} alt={short.title} fill className="object-cover" />
                    <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1 py-0.5 rounded">{short.duration}</div>
                  </div>
                  <h3 className="font-medium text-sm line-clamp-2 mt-2">{short.title}</h3>
                  <p className="text-muted-foreground text-xs mt-0.5">{formatNumber(short.views)} views</p>
                </Link>
              ))}
            </div>
          )}
          {/* Playlists Tab */}
          {activeTab === "playlists" && (
            <>
              <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
                {playlists.map(pl => (
                  <Link key={pl.id} href={`/playlist/${pl.id}`} className="border rounded-xl p-4 hover:bg-muted/50">
                    <h3 className="font-medium text-base line-clamp-2">{pl.title}</h3>
                    <p className="text-muted-foreground text-xs mt-1">{pl.updatedAt}</p>
                    <div className="mt-3 flex items-center gap-1 text-sm text-muted-foreground">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/></svg>
                      {pl.videoCount} videos
                    </div>
                  </Link>
                ))}
              </div>
              <div className="md:hidden">
                {playlists.map(pl => (
                  <Link key={pl.id} href={`/playlist/${pl.id}`} className="block p-4 border-b hover:bg-muted/50">
                    <h3 className="font-medium text-base line-clamp-2">{pl.title}</h3>
                    <p className="text-muted-foreground text-xs mt-1">{pl.updatedAt}</p>
                    <p className="text-muted-foreground text-xs mt-1">{pl.videoCount} videos</p>
                  </Link>
                ))}
              </div>
            </>
          )}
          {/* Posts Tab */}
          {activeTab === "posts" && (
            <div className="p-8 text-center text-muted-foreground">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>
              </div>
              <h3 className="text-lg font-medium mb-1">No posts yet</h3>
              <p className="text-sm">This channel hasn't posted anything yet.</p>
            </div>
          )}
          <MobileNav />
        </main>
      </div>
      <Dialog open={showSignInDialog} onOpenChange={setShowSignInDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><LogIn className="h-5 w-5 text-primary" /> Sign in required</DialogTitle>
            <DialogDescription>You need to sign in to change feed preference for this channel.</DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 mt-4">
            <Button variant="outline" onClick={() => setShowSignInDialog(false)} className="flex-1">Cancel</Button>
            <Button onClick={() => router.push("/signin")} className="flex-1">Sign in</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}