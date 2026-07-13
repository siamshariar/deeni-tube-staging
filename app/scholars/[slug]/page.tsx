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
  Clock,
  Bookmark,
  ListVideo,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@/hooks/use-media-query";
import { scholarData, ScholarItem } from "@/lib/scholar-data";
import { videoData, VideoItem } from "@/lib/video-data";
import { extendedPlaylists } from "@/lib/playlist-data";
import { ShareModal } from "@/components/share-modal";
import { AddToPlaylistDialog } from "@/components/add-to-playlist-dialog";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { ReportDialog } from "@/components/report-dialog";
import { useWatchLater } from "@/hooks/useWatchLater";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const mockShortsByChannel: Record<string, any[]> = {
  "monzur": [
    { id: "sh1", videoId: "MBxDbbkk0gQ", title: "একমাত্র আল্লাহর রাজত্বই চিরস্থায়ী", views: "15K", timeAgo: "2 weeks ago", duration: "0:58" },
    { id: "sh2", videoId: "goHfO28fE-A", title: "যারা বলে আমাদের রব আল্লাহ", views: "25K", timeAgo: "3 days ago", duration: "0:45" },
    { id: "sh3", videoId: "8YfQCDjlQsc", title: "ইমামের দূর্ব্যবহারের কারণে কেউ ওই মাসজিদে না গেলে কি অন্যায় হবে?", views: "50K", timeAgo: "1 week ago", duration: "0:51" },
  ],
  "abdullah-jahangir": [
    { id: "sh6", videoId: "PUwTf64igQk", title: "এভাবে ঈমান নষ্ট করছেন নাতো?", views: "35K", timeAgo: "4 days ago", duration: "0:52" },
    { id: "sh7", videoId: "hHpoYE-v6og", title: "রোগ-ব্যাধিতে ধৈর্য ধারণ করা", views: "28K", timeAgo: "1 week ago", duration: "0:42" },
  ],
  "abu-bakar-zakariya": [
    { id: "sh9", videoId: "rTrh9VHgdwo", title: "ওজুতে ঘাড় মাসাহ করা সুন্নাহ নাকি বিদ'আত", views: "12K", timeAgo: "1 week ago", duration: "0:55" },
    { id: "sh10", videoId: "ihdO_G6Yk0E", title: "দুনিয়াতেই জান্নাত আছে আপনি কি জানেন? ✨", views: "28K", timeAgo: "3 days ago", duration: "0:50" },
  ],
  "zakir-naik": [
    { id: "sh12", videoId: "MBxDbbkk0gQ", title: "The Importance of Tawheed - Dr Zakir Naik", views: "45K", timeAgo: "1 week ago", duration: "0:55" },
  ],
  "mufti-menk": [
    { id: "sh13", videoId: "0m1Mc6dX8XY", title: "Seek The Forgiveness of Allah #muftimenk", views: "95K", timeAgo: "2 days ago", duration: "0:45" },
    { id: "sh14", videoId: "goHfO28fE-A", title: "Always Be Grateful - Mufti Menk", views: "78K", timeAgo: "5 days ago", duration: "0:52" },
  ],
  "assim-al-hakeem": [
    { id: "sh15", videoId: "Tnb74r4VZaY", title: "Is it not permissible 2 get married in Muharram?", views: "32K", timeAgo: "3 days ago", duration: "0:48" },
    { id: "sh16", videoId: "yLMQmr7qjcM", title: "Read all duas of morning & evening adhkar?", views: "25K", timeAgo: "1 week ago", duration: "0:50" },
  ],
  "saifullah-madani": [
    { id: "sh17", videoId: "oEWnPbRvOrY", title: "তাওহীদের আলোকে জীবন", views: "8K", timeAgo: "2 weeks ago", duration: "0:55" },
  ],
  "tafseerul-quran": [
    { id: "sh18", videoId: "_zCnmnCd7CU", title: "কুরআনের আলোকে জীবন গড়ুন", views: "18K", timeAgo: "5 days ago", duration: "0:58" },
  ],
};

function ScholarSkeleton() {
  return (
    <div className="min-h-screen bg-background pt-14">
      <div className="px-3 py-4 border-b">
        <div className="flex items-start gap-4">
          <Skeleton className="h-16 w-16 md:h-20 md:w-20 rounded-full" />
          <div className="flex-1 space-y-2 mt-2">
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>
      </div>
      <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i}>
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

  const scholar: ScholarItem | undefined = scholarData.find((s) => s.slug === slug);

  const [activeTab, setActiveTab] = useState("videos");
  const [isLoading, setIsLoading] = useState(true);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);
  const [showPlaylistDialog, setShowPlaylistDialog] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [selectedShort, setSelectedShort] = useState<any>(null);
  const [shortDrawerOpen, setShortDrawerOpen] = useState(false);
  const [showShortPlaylistDialog, setShowShortPlaylistDialog] = useState(false);
  const { addToWatchLater, removeFromWatchLater, isInWatchLater } = useWatchLater();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    setShareUrl(typeof window !== "undefined" ? window.location.href : "");
    return () => clearTimeout(timer);
  }, [slug]);

  if (!scholar) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Scholar not found</h2>
          <Button onClick={() => router.push("/scholars")} className="rounded-full mt-4">
            Back to Scholars
          </Button>
        </div>
      </div>
    );
  }

  const allVideos: VideoItem[] = videoData.filter((v) => v.channelId === scholar.channelId);
  const shorts = mockShortsByChannel[scholar.channelId] || [];
  const playlists = extendedPlaylists.filter((pl) =>
    pl.videoIds.some((vid) => allVideos.some((v) => v.id === vid))
  );

  if (isLoading) return <ScholarSkeleton />;

  return (
    <div className="min-h-screen bg-background pt-14">
      {isMobile && (
        <div className="sticky top-[56px] z-10 bg-background/95 backdrop-blur-sm border-b">
          <button onClick={() => router.back()} className="flex items-center gap-1.5 px-4 py-2 w-full">
            <ArrowLeft className="h-6 w-6 shrink-0" />
            <span className="text-sm font-medium line-clamp-1 text-left">{scholar.name}</span>
          </button>
        </div>
      )}

      {/* Profile section — no banner, avatar sits at top */}
      <div className="px-3 py-4 border-b">
        <div className="flex flex-col md:flex-row md:items-start md:gap-4">
          <Avatar className="flex-shrink-0 ring-4 ring-background relative z-10 h-16 w-16 md:h-20 md:w-20">
            <AvatarImage src={scholar.avatar} alt={scholar.name} className="object-cover" />
            <AvatarFallback className="text-lg">{scholar.name.charAt(0)}</AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0 mt-3 md:mt-0 md:pt-1">
            <h1 className="text-xl md:text-2xl font-bold">{scholar.name}</h1>
            <p className="text-sm text-muted-foreground mt-0.5">{scholar.designation}</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              {allVideos.length} videos · {shorts.length} shorts
            </p>

            <div className="flex items-center gap-2 mt-3">
              <Button variant="outline" className="rounded-full h-9" onClick={() => setShareModalOpen(true)}>
                <Share className="h-4 w-4 mr-2" /> Share
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-52 rounded-xl">
                  <DropdownMenuItem onSelect={(e) => { e.preventDefault(); setShowReportDialog(true); }}><Flag className="h-4 w-4 mr-3" /> Report</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => toast("Hidden")}><Ban className="h-4 w-4 mr-3" /> Don't recommend</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="h-12 bg-background w-full justify-start overflow-x-auto scrollbar-none px-3 border-b rounded-none">
          <TabsTrigger value="videos" className="px-4 py-1 data-[state=active]:border-b-2 data-[state=active]:border-foreground data-[state=active]:rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none">
            Videos
          </TabsTrigger>
          <TabsTrigger value="shorts" className="px-4 py-1 data-[state=active]:border-b-2 data-[state=active]:border-foreground data-[state=active]:rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none">
            Shorts
          </TabsTrigger>
          <TabsTrigger value="playlists" className="px-4 py-1 data-[state=active]:border-b-2 data-[state=active]:border-foreground data-[state=active]:rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none">
            Playlists
          </TabsTrigger>
          <TabsTrigger
            value="about"
            className="px-4 py-1 data-[state=active]:border-b-2 data-[state=active]:border-foreground data-[state=active]:rounded-none data-[state=active]:bg-transparent data-[state=active]:shadow-none"
            onClick={(e) => { e.preventDefault(); router.push(`/scholars/${slug}/about`); }}
          >
            About
          </TabsTrigger>
        </TabsList>

        {/* ── Videos tab ── */}
        {activeTab === "videos" && (
          <div className="px-3 py-4">
            {allVideos.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-14 h-14 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
                  <Play className="h-7 w-7 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">No videos found</p>
              </div>
            ) : (
              <>
                {/* Desktop grid */}
                <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {allVideos.map((video) => (
                    <div key={video.id} className="flex flex-col group">
                      <Link href={`/videos/${video.channel}/${video.videoId}`} className="relative aspect-video w-full rounded-xl overflow-hidden">
                        <Image src={`https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`} alt={video.title} fill className="object-cover" />
                        <div className="absolute bottom-1.5 right-1.5 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded font-medium">{video.duration}</div>
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-xl">
                          <div className="bg-black/60 rounded-full p-2"><Play className="h-5 w-5 text-white fill-white" /></div>
                        </div>
                      </Link>
                      <div className="flex mt-2 gap-2">
                        <Avatar className="h-8 w-8 flex-shrink-0">
                          <AvatarImage src={video.channelAvatar} />
                          <AvatarFallback>{video.channel.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-1">
                            <Link href={`/videos/${video.channel}/${video.videoId}`}>
                              <h3 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">{video.title}</h3>
                            </Link>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <button className="p-1 rounded-full hover:bg-muted flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                                  <MoreVertical className="h-4 w-4 text-muted-foreground" />
                                </button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-48 rounded-xl">
                                <DropdownMenuItem className="cursor-pointer" onSelect={() => {
                                  if (isInWatchLater(video.id)) { removeFromWatchLater(video.id); toast.success("Removed from Watch Later"); }
                                  else { addToWatchLater({ id: video.id, title: video.title, channel: video.channel, channelAvatar: video.channelAvatar, thumbnail: `https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`, views: video.views, timeAgo: video.timeAgo, duration: video.duration, addedAt: Date.now() }); toast.success("Added to Watch Later"); }
                                }}><Clock className="h-4 w-4 mr-2" /> {isInWatchLater(video.id) ? "Saved to Watch Later" : "Save to Watch later"}</DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer" onSelect={(e) => { e.preventDefault(); setSelectedVideo(video); setShowPlaylistDialog(true); }}><Bookmark className="h-4 w-4 mr-2" /> Save to playlist</DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer" onSelect={(e) => { e.preventDefault(); setSelectedVideo(video); setShowReportDialog(true); }}><Flag className="h-4 w-4 mr-2" /> Report</DropdownMenuItem>
                                <DropdownMenuItem className="cursor-pointer" onSelect={() => { setShareUrl(`${window.location.origin}/videos/${video.channel}/${video.videoId}`); setShareModalOpen(true); }}><Share className="h-4 w-4 mr-2" /> Share</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                          <p className="text-xs text-muted-foreground">{video.views} · {video.timeAgo}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Mobile list */}
                <div className="flex flex-col md:hidden">
                  {allVideos.map((video) => (
                    <div key={video.id} className="flex gap-3 py-2.5 group">
                      <Link href={`/videos/${video.channel}/${video.videoId}`} className="relative w-36 aspect-video flex-shrink-0 rounded-lg overflow-hidden">
                        <Image src={`https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`} alt={video.title} fill className="object-cover" />
                        <div className="absolute bottom-1 right-1 bg-black/80 text-white text-[10px] px-1 py-0.5 rounded">{video.duration}</div>
                      </Link>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-1">
                          <Link href={`/videos/${video.channel}/${video.videoId}`}>
                            <h3 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">{video.title}</h3>
                          </Link>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button className="p-1 rounded-full hover:bg-muted flex-shrink-0"><MoreVertical className="h-4 w-4 text-muted-foreground" /></button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48 rounded-xl">
                              <DropdownMenuItem className="cursor-pointer" onSelect={() => {
                                if (isInWatchLater(video.id)) { removeFromWatchLater(video.id); toast.success("Removed from Watch Later"); }
                                else { addToWatchLater({ id: video.id, title: video.title, channel: video.channel, channelAvatar: video.channelAvatar, thumbnail: `https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`, views: video.views, timeAgo: video.timeAgo, duration: video.duration, addedAt: Date.now() }); toast.success("Added to Watch Later"); }
                              }}><Clock className="h-4 w-4 mr-2" /> {isInWatchLater(video.id) ? "Saved to Watch Later" : "Save to Watch later"}</DropdownMenuItem>
                              <DropdownMenuItem className="cursor-pointer" onSelect={(e) => { e.preventDefault(); setSelectedVideo(video); setShowPlaylistDialog(true); }}><Bookmark className="h-4 w-4 mr-2" /> Save to playlist</DropdownMenuItem>
                              <DropdownMenuItem className="cursor-pointer" onSelect={(e) => { e.preventDefault(); setSelectedVideo(video); setShowReportDialog(true); }}><Flag className="h-4 w-4 mr-2" /> Report</DropdownMenuItem>
                              <DropdownMenuItem className="cursor-pointer" onSelect={() => { setShareUrl(`${window.location.origin}/videos/${video.channel}/${video.videoId}`); setShareModalOpen(true); }}><Share className="h-4 w-4 mr-2" /> Share</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">{video.views} · {video.timeAgo}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* ── Shorts tab ── */}
        {activeTab === "shorts" && (
          <div className="px-3 py-4">
            {shorts.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-14 h-14 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
                  <Play className="h-7 w-7 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">No shorts available</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
                  {shorts.map((short: any) => (
                    <div key={short.id} className="group">
                      <div className="relative aspect-[9/16] rounded-xl overflow-hidden bg-muted">
                        <Link href={`/shorts?v=${short.videoId}`} className="block w-full h-full">
                          <Image src={`https://img.youtube.com/vi/${short.videoId}/hqdefault.jpg`} alt={short.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                          <div className="absolute bottom-1.5 right-1.5 bg-black/80 text-white text-[10px] px-1.5 py-0.5 rounded">{short.duration}</div>
                          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors rounded-xl" />
                        </Link>
                      </div>
                      {/* Title row with 3-dot aligned to the right */}
                      <div className="flex items-start justify-between mt-1.5 gap-1">
                        <Link href={`/shorts?v=${short.videoId}`} className="flex-1 min-w-0">
                          <p className="text-xs font-medium line-clamp-2 group-hover:text-primary transition-colors">{short.title}</p>
                          <p className="text-[10px] text-muted-foreground mt-0.5">{short.views} · {short.timeAgo}</p>
                        </Link>
                        {isMobile ? (
                          <button
                            className="flex-shrink-0 p-1 rounded-full hover:bg-muted transition-colors mt-0.5"
                            onClick={(e) => { e.stopPropagation(); setSelectedShort(short); setShortDrawerOpen(true); }}
                          >
                            <MoreVertical className="h-3.5 w-3.5 text-muted-foreground" />
                          </button>
                        ) : (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button className="flex-shrink-0 p-1 rounded-full hover:bg-muted transition-colors mt-0.5">
                                <MoreVertical className="h-3.5 w-3.5 text-muted-foreground" />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56 rounded-xl">
                              <DropdownMenuItem className="cursor-pointer" onSelect={() => {
                                if (isInWatchLater(short.id)) { toast.success("Already in Watch Later"); }
                                else { addToWatchLater({ id: short.id, title: short.title, channel: scholar.name, channelAvatar: scholar.avatar || "", thumbnail: `https://img.youtube.com/vi/${short.videoId}/hqdefault.jpg`, views: short.views, timeAgo: short.timeAgo, duration: short.duration, addedAt: Date.now() }); toast.success("Added to Watch Later"); }
                              }}>
                                <Clock className="h-4 w-4 mr-2" /> {isInWatchLater(short.id) ? "Saved to Watch Later" : "Save to Watch Later"}
                              </DropdownMenuItem>
                              <DropdownMenuItem className="cursor-pointer" onSelect={(e) => { e.preventDefault(); setSelectedShort(short); setShowShortPlaylistDialog(true); }}>
                                <Bookmark className="h-4 w-4 mr-2" /> Save to Playlist
                              </DropdownMenuItem>
                              <DropdownMenuItem className="cursor-pointer" onSelect={() => { setShareUrl(`${window.location.origin}/shorts?v=${short.videoId}`); setShareModalOpen(true); }}>
                                <Share className="h-4 w-4 mr-2" /> Share
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Mobile Drawer - single instance outside map */}
                <Drawer open={shortDrawerOpen} onOpenChange={setShortDrawerOpen}>
                  <DrawerContent>
                    <div className="p-4 pb-8 space-y-1">
                      <button
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted transition-colors text-sm text-left"
                        onClick={() => {
                          if (selectedShort) {
                            if (isInWatchLater(selectedShort.id)) { toast.success("Already in Watch Later"); }
                            else { addToWatchLater({ id: selectedShort.id, title: selectedShort.title, channel: scholar.name, channelAvatar: scholar.avatar || "", thumbnail: `https://img.youtube.com/vi/${selectedShort.videoId}/hqdefault.jpg`, views: selectedShort.views, timeAgo: selectedShort.timeAgo, duration: selectedShort.duration, addedAt: Date.now() }); toast.success("Added to Watch Later"); }
                          }
                          setShortDrawerOpen(false);
                        }}
                      >
                        <Clock className="h-4 w-4 flex-shrink-0" /> {selectedShort && isInWatchLater(selectedShort.id) ? "Saved to Watch Later" : "Save to Watch Later"}
                      </button>
                      <button
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted transition-colors text-sm text-left"
                        onClick={() => { setShowShortPlaylistDialog(true); setShortDrawerOpen(false); }}
                      >
                        <Bookmark className="h-4 w-4 flex-shrink-0" /> Save to Playlist
                      </button>
                      <button
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted transition-colors text-sm text-left"
                        onClick={() => { if (selectedShort) { setShareUrl(`${window.location.origin}/shorts?v=${selectedShort.videoId}`); setShareModalOpen(true); } setShortDrawerOpen(false); }}
                      >
                        <Share className="h-4 w-4 flex-shrink-0" /> Share
                      </button>
                    </div>
                  </DrawerContent>
                </Drawer>
              </>
            )}
          </div>
        )}

        {/* ── Playlists tab ── */}
        {activeTab === "playlists" && (
          <div className="px-3 py-4">
            {playlists.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-14 h-14 bg-muted rounded-full flex items-center justify-center mx-auto mb-3">
                  <ListVideo className="h-7 w-7 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">No playlists available</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {playlists.map((pl) => {
                  const thumbs = pl.videoIds
                    .slice(0, 4)
                    .map((id) => {
                      const v = videoData.find((v) => v.id === id);
                      return v ? `https://img.youtube.com/vi/${v.videoId}/hqdefault.jpg` : null;
                    })
                    .filter(Boolean) as string[];
                  return (
                    <Link key={pl.id} href={`/playlists/${pl.slug}/${pl.id}?source=channel`} className="group block border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-card">
                      <div className="relative aspect-video w-full bg-muted overflow-hidden">
                        {thumbs.length >= 2 ? (
                          <div className="grid grid-cols-2 gap-0.5 w-full h-full">
                            {[0, 1, 2, 3].map((i) => (
                              <div key={i} className="relative bg-muted overflow-hidden">
                                {thumbs[i] ? (
                                  <Image src={thumbs[i]} alt="" fill className="object-cover" />
                                ) : (
                                  <div className="absolute inset-0 bg-muted" />
                                )}
                              </div>
                            ))}
                          </div>
                        ) : thumbs.length === 1 ? (
                          <Image src={thumbs[0]} alt={pl.name} fill className="object-cover" />
                        ) : (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <ListVideo className="h-10 w-10 text-muted-foreground/40" />
                          </div>
                        )}
                        <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1.5 py-0.5 rounded font-medium flex items-center gap-1">
                          <ListVideo className="h-3 w-3" />
                          {pl.videoIds.length}
                        </div>
                      </div>
                      <div className="p-3">
                        <div className="flex items-start justify-between gap-1">
                          <h3 className="text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors flex-1 min-w-0">{pl.name}</h3>
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
                              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); router.push(`/playlists/${pl.slug}/${pl.id}?source=channel`); }}>
                                <Play className="h-4 w-4 mr-2" /> Play all
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); setShareUrl(`${window.location.origin}/playlists/${pl.slug}/${pl.id}`); setShareModalOpen(true); }}>
                                <Share className="h-4 w-4 mr-2" /> Share
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </Tabs>

      {/* About tab navigates to /scholars/[slug]/about, so no tab content needed */}

      <ShareModal isOpen={shareModalOpen} onClose={() => setShareModalOpen(false)} videoUrl={shareUrl} />
      {selectedVideo && (
        <>
          <AddToPlaylistDialog video={{ id: selectedVideo.id, title: selectedVideo.title, channel: selectedVideo.channel }} open={showPlaylistDialog} onOpenChange={setShowPlaylistDialog} />
          <ReportDialog videoTitle={selectedVideo.title} videoId={selectedVideo.id} open={showReportDialog} onOpenChange={setShowReportDialog} />
        </>
      )}
      {selectedShort && (
        <AddToPlaylistDialog
          video={{ id: selectedShort.id, title: selectedShort.title, channel: scholar.name }}
          open={showShortPlaylistDialog}
          onOpenChange={setShowShortPlaylistDialog}
        />
      )}
    </div>
  );
}
