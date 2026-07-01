// app/page.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import VideoCard from "@/components/video-card";
import LanguagePrompt from "@/components/language-prompt";
import { videoData, VideoItem } from "@/lib/video-data";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useHeader } from "@/app/contexts/header-context";
import { cn } from "@/lib/utils";

export default function Home() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { headerVisible, setHeaderVisible } = useHeader();
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
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const allCategories: string[] = videoData
    .map((v: VideoItem) => v.category)
    .filter(Boolean) as string[];
  const uniqueCategories: string[] = Array.from(new Set(allCategories));
  const extraCategories = [
    "Quran",
    "Hadith",
    "Fiqh",
    "Tafsir",
    "Seerah",
    "Dua",
    "Aqeedah",
    "Manners",
    "History",
    "Youth",
    "Family",
    "Society",
    "Science",
    "Spirituality",
    "Health",
  ];
  const chipItems: string[] = ["All", ...uniqueCategories, ...extraCategories];

  // Listen for sidebar class changes using MutationObserver
  useEffect(() => {
    const checkSidebarState = () => {
      const sidebar = document.querySelector('aside');
      if (sidebar) {
        setSidebarCollapsed(sidebar.classList.contains('w-[72px]'));
      }
    };

    // Initial check
    checkSidebarState();

    // Observe sidebar class changes
    const sidebar = document.querySelector('aside');
    if (sidebar) {
      const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
          if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
            checkSidebarState();
          }
        });
      });
      observer.observe(sidebar, { attributes: true });
      return () => observer.disconnect();
    }
  }, []);

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
    const savedVisible = localStorage.getItem("feed-visible-channels");
    if (savedVisible) {
      try {
        setVisibleChannelIds(JSON.parse(savedVisible));
      } catch {}
    } else {
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

  // Scroll handler — hide/show both header and chip bar
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY;
      const isScrollingDown = currentScrollPos > prevScrollPos;
      const isNearTop = currentScrollPos < 56;

      if (isNearTop) {
        setHeaderVisible(true);
      } else if (isScrollingDown && currentScrollPos > 100) {
        setHeaderVisible(false);
      } else if (!isScrollingDown) {
        setHeaderVisible(true);
      }

      setPrevScrollPos(currentScrollPos);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollPos, setHeaderVisible]);

  const filteredVideos = allVideos.filter(
    (v: VideoItem) =>
      preferredLanguages.includes(v.language) &&
      visibleChannelIds.includes(v.channelId)
  );
  const displayedVideos =
    activeChip === "All"
      ? filteredVideos
      : filteredVideos.filter((v: VideoItem) => v.category === activeChip);

  // Chip bar position: follows header visibility, starts right below header
  const chipBarTop = headerVisible ? "top-[56px]" : "top-0";
  const contentMarginTop = headerVisible ? "104px" : "48px";
  
  // Dynamic chip bar width based on sidebar state
  const chipBarLeft = sidebarCollapsed ? "md:left-[72px]" : "md:left-[240px]";
  const chipBarWidth = sidebarCollapsed ? "md:w-[calc(100%-72px)]" : "md:w-[calc(100%-240px)]";

  // Dynamic grid columns based on sidebar state
  const gridColumns = sidebarCollapsed 
    ? "md:grid-cols-1 lg:grid-cols-3 xl:grid-cols-4" 
    : "md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4";

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <LanguagePrompt
        open={showLanguagePrompt}
        onSave={(langs: string[]) => saveLanguagePrefs(langs, true)}
        onSkip={skipLanguage}
        initialSelected={["en"]}
      />

      {/* Category chip bar — hides/shows with header, starts right below header */}
      <div
        className={cn(
          "fixed z-20 h-12 border-b bg-background w-full transition-all duration-300",
          chipBarLeft,
          chipBarWidth,
          chipBarTop,
          !headerVisible && "-translate-y-full opacity-0 pointer-events-none"
        )}
      >
        <div
          ref={scrollContainerRef}
          className="h-full overflow-x-auto scrollbar-none px-4"
          style={{
            WebkitOverflowScrolling: "touch",
            overscrollBehaviorX: "contain",
            touchAction: "pan-x",
            scrollbarWidth: 'none', // Firefox
            msOverflowStyle: 'none', // IE/Edge
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

      {/* Content area */}
      <div
        style={{ marginTop: contentMarginTop }}
        className="transition-[margin-top] duration-300"
      >
        {hasSelected && preferredLanguages.length > 0 && (
          <div className="px-4 py-1.5 text-xs text-muted-foreground bg-muted/30 border-b hidden md:block">
            Content: {preferredLanguages.map((l: string) => l.toUpperCase()).join(", ")}
            {isGuest && " (Guest)"}
          </div>
        )}

        {initialLoading ? (
          <>
            <div className={cn(
              "hidden md:grid gap-4 p-4 transition-all duration-300",
              gridColumns
            )}>
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
            <div className="grid grid-cols-1 gap-4 p-4 md:hidden">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={`msk-${i}`} className="flex flex-col border rounded-xl overflow-hidden shadow-sm">
                  <Skeleton className="aspect-video w-full" />
                  <div className="p-3 space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className={cn(
              "hidden md:grid gap-4 p-4 transition-all duration-300",
              gridColumns
            )}>
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
            <div className="grid grid-cols-1 gap-4 p-4 md:hidden">
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
          </>
        )}
      </div>
    </div>
  );
}