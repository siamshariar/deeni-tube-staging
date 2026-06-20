// app/page.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import VideoCard from "@/components/video-card";
import MobileNav from "@/components/mobile-nav";
import DesktopSidebar from "@/components/desktop-sidebar";
import AppHeader from "@/components/app-header";
import LanguagePrompt from "@/components/language-prompt";
import { videoData, VideoItem } from "@/lib/video-data";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";

export default function Home() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [headerVisible, setHeaderVisible] = useState(true);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [activeChip, setActiveChip] = useState("All");
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [allVideos] = useState<VideoItem[]>(videoData);
  const [preferredLanguages, setPreferredLanguages] = useState<string[]>(["en"]);
  const [hasSelected, setHasSelected] = useState(false);
  const [isGuest, setIsGuest] = useState(true);
  const [showLanguagePrompt, setShowLanguagePrompt] = useState(false);
  const [visibleChannelIds, setVisibleChannelIds] = useState<string[]>([]);

  const allCategories: string[] = videoData
    .map((v: VideoItem) => v.category)
    .filter(Boolean) as string[];
  const uniqueCategories: string[] = Array.from(new Set(allCategories));
  const chipItems: string[] = ["All", ...uniqueCategories];

  useEffect(() => {
    const timer = setTimeout(() => setInitialLoading(false), 800);
    const hasSelectedPref = localStorage.getItem("deeni-lang-prefs");
    if (!hasSelectedPref) {
      setShowLanguagePrompt(true);
    } else {
      try {
        const parsed = JSON.parse(hasSelectedPref);
        setPreferredLanguages(parsed.languages || ["en"]);
        setHasSelected(true);
        setIsGuest(parsed.isGuest !== false);
      } catch {}
    }
    // Load visible channel IDs from localStorage
    const savedVisible = localStorage.getItem("feed-visible-channels");
    if (savedVisible) {
      try {
        setVisibleChannelIds(JSON.parse(savedVisible));
      } catch {}
    } else {
      // Default: all channels visible
      const allIds = videoData.map((v: VideoItem) => v.channelId);
      setVisibleChannelIds(Array.from(new Set(allIds)));
    }
    return () => clearTimeout(timer);
  }, []);

  const saveLanguagePrefs = (languages: string[], guest: boolean = true) => {
    setPreferredLanguages(languages);
    setHasSelected(true);
    setIsGuest(guest);
    localStorage.setItem(
      "deeni-lang-prefs",
      JSON.stringify({ languages, hasSelected: true, isGuest: guest })
    );
    setShowLanguagePrompt(false);
  };

  const skipLanguage = () => {
    saveLanguagePrefs(["en"], true);
  };

  const filteredVideos = allVideos.filter(
    (v: VideoItem) =>
      preferredLanguages.includes(v.language) &&
      visibleChannelIds.includes(v.channelId)
  );
  const displayedVideos =
    activeChip === "All"
      ? filteredVideos
      : filteredVideos.filter((v: VideoItem) => v.category === activeChip);

  // Scroll detection for header
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      const isScrollingDown = currentScrollPos > prevScrollPos;
      if (isScrollingDown && currentScrollPos > 150) setHeaderVisible(false);
      else setHeaderVisible(true);
      setPrevScrollPos(currentScrollPos);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollPos]);

  const headerHeight = isMobile ? 56 + 48 : 72 + 48;
  const marginTop = headerHeight;
  const mobileNavHeight = `calc(56px + env(safe-area-inset-bottom, 0px))`;

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <LanguagePrompt
        open={showLanguagePrompt}
        onSave={(langs: string[]) => saveLanguagePrefs(langs, true)}
        onSkip={skipLanguage}
        initialSelected={["en"]}
      />

      <AppHeader visible={headerVisible}>
        <div className="h-12 border-b bg-background">
          <div
            ref={scrollContainerRef}
            className="h-full overflow-x-auto scrollbar-none px-4"
            style={{
              WebkitOverflowScrolling: "touch",
              overscrollBehaviorX: "contain",
              touchAction: "pan-x",
            }}
          >
            <div className="flex gap-2 py-2 w-max items-center h-full">
              {chipItems.map((chip: string) => (
                <button
                  key={chip}
                  onClick={() => setActiveChip(chip)}
                  className={cn(
                    "px-3.5 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 select-none",
                    activeChip === chip
                      ? "bg-foreground text-background"
                      : "bg-muted hover:bg-muted/80 text-foreground"
                  )}
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>
        </div>
      </AppHeader>

      <div className="flex">
        <DesktopSidebar className="hidden md:block" headerVisible={headerVisible} />
        <main
          className="flex-1 md:pl-[240px] w-full max-w-[100vw]"
          style={{
            marginTop: marginTop,
            paddingBottom: isMobile ? mobileNavHeight : "0",
          }}
        >
          {hasSelected && preferredLanguages.length > 0 && (
            <div className="px-4 py-1.5 text-xs text-muted-foreground bg-muted/30 border-b hidden md:block">
              Content: {preferredLanguages.map((l: string) => l.toUpperCase()).join(", ")}
              {isGuest && " (Guest)"}
            </div>
          )}

          {initialLoading ? (
            <>
              <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={`dsk-${i}`} className="flex flex-col">
                    <Skeleton className="aspect-video w-full rounded-lg" />
                    <div className="flex mt-2 gap-2">
                      <Skeleton className="h-9 w-9 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-3 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex flex-col md:hidden">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={`msk-${i}`} className="flex flex-col p-3">
                    <Skeleton className="aspect-video w-full rounded-lg" />
                    <div className="flex mt-3 gap-3">
                      <Skeleton className="h-9 w-9 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-3 w-3/4" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <>
              <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 p-4">
                {displayedVideos.map((video: VideoItem) => (
                  <VideoCard
                    key={video.id}
                    videoId={video.videoId}
                    title={video.title}
                    channel={video.channel}
                    channelId={video.channelId}
                    channelAvatar={video.channelAvatar}
                    views={video.views}
                    timestamp={video.timeAgo}
                    duration={video.duration}
                    thumbnail={`https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`}
                    isHorizontal={false}
                  />
                ))}
              </div>
              <div className="flex flex-col md:hidden">
                {displayedVideos.map((video: VideoItem) => (
                  <VideoCard
                    key={video.id}
                    videoId={video.videoId}
                    title={video.title}
                    channel={video.channel}
                    channelId={video.channelId}
                    channelAvatar={video.channelAvatar}
                    views={video.views}
                    timestamp={video.timeAgo}
                    duration={video.duration}
                    thumbnail={`https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`}
                    isHorizontal={true}
                  />
                ))}
              </div>
            </>
          )}
        </main>
      </div>
      <MobileNav />
    </div>
  );
}