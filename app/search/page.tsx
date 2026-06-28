// app/search/page.tsx
"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Search,
  X,
  ChevronDown,
  ArrowLeft,
  History,
  MoreVertical,
  Clock,
  Bookmark,
  Share,
  Play,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useMediaQuery } from "@/hooks/use-media-query";
import Image from "next/image";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ShareModal } from "@/components/share-modal";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { videoData, VideoItem } from "@/lib/video-data";
import { channelData, ChannelItem } from "@/lib/channel-data";
import { scholarData } from "@/lib/scholar-data";

// ---------- CONSTANTS ----------
const languages = [
  { code: "bn", name: "Bangla" },
  { code: "en", name: "English" },
  { code: "ar", name: "Arabic" },
  { code: "ur", name: "Urdu" },
  { code: "hi", name: "Hindi" },
  { code: "tr", name: "Turkish" },
];

const categoryOptions = Array.from(new Set(videoData.map(v => v.category).filter(Boolean)));
const scholarOptions = scholarData.map(s => s.name);

const channelNameToId = new Map<string, string>();
channelData.forEach((ch: ChannelItem) => {
  channelNameToId.set(ch.name, ch.id);
});
const channelOptions = channelData.map(c => c.name);

// Safe localStorage helpers
function getRecentSearches(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem("recentSearches");
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    if (Array.isArray(parsed)) {
      return parsed.filter((item): item is string => typeof item === "string");
    }
    return [];
  } catch {
    return [];
  }
}

function saveRecentSearches(searches: string[]) {
  if (typeof window === "undefined") return;
  try {
    const safe = searches.filter((s): s is string => typeof s === "string");
    localStorage.setItem("recentSearches", JSON.stringify(safe));
  } catch {
    // Silently fail for prototype
  }
}

// Safe trim helper
function safeTrim(value: unknown): string {
  if (typeof value === "string") return value.trim();
  return "";
}

// ── MULTI‑SELECT COMPONENT ──
function MultiSelect({
  label,
  options,
  selected,
  onChange,
  searchable = false,
}: {
  label: string;
  options: string[];
  selected: string[];
  onChange: (values: string[]) => void;
  searchable?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setSearchText("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggle = (value: string) => {
    onChange(
      selected.includes(value)
        ? selected.filter((v) => v !== value)
        : [...selected, value]
    );
  };

  const remove = (value: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(selected.filter((v) => v !== value));
  };

  const filteredOptions = searchText
    ? options.filter((opt) =>
        opt.toLowerCase().includes(searchText.toLowerCase())
      )
    : options;

  return (
    <div ref={ref} className="relative">
      <label className="text-sm font-medium mb-1.5 block text-foreground">
        {label}
      </label>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={cn(
          "w-full min-h-10 px-3 py-2 flex items-center gap-2 flex-wrap rounded-xl border text-left transition-colors bg-background",
          open
            ? "border-primary ring-2 ring-primary/20"
            : "border-border hover:border-muted-foreground"
        )}
      >
        <div className="flex flex-wrap gap-1.5 flex-1">
          {selected.length === 0 ? (
            <span className="text-sm text-muted-foreground">
              Select {label.toLowerCase()}...
            </span>
          ) : (
            selected.map((val) => (
              <span
                key={val}
                className="flex items-center gap-1 bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full font-medium"
              >
                {val}
                <span
                  role="button"
                  tabIndex={0}
                  onClick={(e) => remove(val, e)}
                  className="cursor-pointer hover:opacity-70"
                >
                  <X className="h-3 w-3" />
                </span>
              </span>
            ))
          )}
        </div>
        <ChevronDown
          className={`h-4 w-4 text-muted-foreground flex-shrink-0 ml-auto transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full bg-popover border rounded-xl shadow-lg overflow-hidden">
          {searchable && (
            <div className="p-2 border-b">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <input
                  type="text"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  placeholder={`Search ${label.toLowerCase()}...`}
                  className="w-full h-8 pl-7 pr-2 text-sm rounded-lg border bg-muted/40 focus:outline-none focus:ring-1 focus:ring-primary/30"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>
          )}
          <div className="max-h-48 overflow-y-auto">
            {filteredOptions.length === 0 ? (
              <div className="px-4 py-3 text-sm text-muted-foreground text-center">
                No {label.toLowerCase()} found
              </div>
            ) : (
              filteredOptions.map((option) => {
                const isSelected = selected.includes(option);
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => toggle(option)}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-colors hover:bg-muted",
                      isSelected && "bg-muted/60 font-medium"
                    )}
                  >
                    <span
                      className={cn(
                        "h-4 w-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors",
                        isSelected
                          ? "bg-primary border-primary"
                          : "border-muted-foreground/30"
                      )}
                    >
                      {isSelected && (
                        <svg
                          viewBox="0 0 12 12"
                          className="h-3 w-3 text-primary-foreground"
                          fill="none"
                        >
                          <path
                            d="M2 6l3 3 5-5"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      )}
                    </span>
                    {option}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function VideoSkeleton() {
  return (
    <div className="flex gap-3 py-3">
      <Skeleton className="w-40 md:w-56 aspect-video rounded-lg flex-shrink-0" />
      <div className="flex-1 min-w-0 space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-3 w-32" />
      </div>
    </div>
  );
}

// ── FILTERS CONTENT ──
function FiltersContent({
  languages,
  activeLangs,
  toggleLang,
  categoryOptions,
  selectedCategories,
  setSelectedCategories,
  scholarOptions,
  selectedScholars,
  setSelectedScholars,
  channelOptions,
  selectedChannels,
  setSelectedChannels,
  hasFilters,
  resetAllFilters,
  performSearch,
  query,
}: {
  languages: { code: string; name: string }[];
  activeLangs: string[];
  toggleLang: (code: string) => void;
  categoryOptions: string[];
  selectedCategories: string[];
  setSelectedCategories: (values: string[]) => void;
  scholarOptions: string[];
  selectedScholars: string[];
  setSelectedScholars: (values: string[]) => void;
  channelOptions: string[];
  selectedChannels: string[];
  setSelectedChannels: (values: string[]) => void;
  hasFilters: boolean;
  resetAllFilters: () => void;
  performSearch: () => void;
  query: string;
}) {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-base">Filters</h2>
        {hasFilters && (
          <button
            onClick={resetAllFilters}
            className="text-sm text-primary hover:underline"
          >
            Clear all
          </button>
        )}
      </div>
      <div>
        <p className="text-sm font-medium mb-2">Languages</p>
        <div className="flex flex-wrap gap-2">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => toggleLang(lang.code)}
              className={cn(
                "px-4 py-2 rounded-full text-sm font-medium transition-colors",
                activeLangs.includes(lang.code)
                  ? "bg-foreground text-background"
                  : "bg-muted hover:bg-muted/80 text-foreground"
              )}
            >
              {lang.name}
            </button>
          ))}
        </div>
      </div>
      <MultiSelect
        label="Categories"
        options={categoryOptions}
        selected={selectedCategories}
        onChange={setSelectedCategories}
        searchable
      />
      <MultiSelect
        label="Scholars"
        options={scholarOptions}
        selected={selectedScholars}
        onChange={setSelectedScholars}
        searchable
      />
      <MultiSelect
        label="Channels"
        options={channelOptions}
        selected={selectedChannels}
        onChange={setSelectedChannels}
        searchable
      />
      <Button
        onClick={performSearch}
        className="w-full rounded-full"
        disabled={!query.trim() && !hasFilters}
      >
        <Search className="h-4 w-4 mr-2" /> Search
      </Button>
    </div>
  );
}

// ── MAIN PAGE ──
export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const mobileSearchRef = useRef<HTMLDivElement>(null);
  const desktopSearchRef = useRef<HTMLDivElement>(null);

  const initialQuery = searchParams?.get("q") || "";

  const [query, setQuery] = useState<string>(initialQuery);
  const [activeLangs, setActiveLangs] = useState<string[]>(["bn"]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedScholars, setSelectedScholars] = useState<string[]>([]);
  const [selectedChannels, setSelectedChannels] = useState<string[]>([]);

  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<VideoItem[]>([]);
  const [recentSearchesList, setRecentSearchesList] = useState<string[]>(getRecentSearches);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState("");

  const [showMobileRecent, setShowMobileRecent] = useState(false);
  const [showDesktopRecent, setShowDesktopRecent] = useState(false);

  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
      const timer = setTimeout(() => {
        performSearch(initialQuery);
      }, 200);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (mobileSearchRef.current && !mobileSearchRef.current.contains(e.target as Node)) {
        setShowMobileRecent(false);
      }
      if (desktopSearchRef.current && !desktopSearchRef.current.contains(e.target as Node)) {
        setShowDesktopRecent(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const hasFilters = useCallback(() => {
    return (
      selectedCategories.length > 0 ||
      selectedScholars.length > 0 ||
      selectedChannels.length > 0
    );
  }, [selectedCategories, selectedScholars, selectedChannels]);

  const toggleLang = (code: string) => {
    setActiveLangs((prev) =>
      prev.includes(code)
        ? prev.length > 1
          ? prev.filter((l) => l !== code)
          : prev
        : [...prev, code]
    );
  };

  const resetAllFilters = () => {
    setActiveLangs(["bn"]);
    setSelectedCategories([]);
    setSelectedScholars([]);
    setSelectedChannels([]);
    setHasSearched(false);
    setResults([]);
    setQuery("");
  };

  const addToRecent = (searchTerm: string) => {
    if (!searchTerm || typeof searchTerm !== "string") return;
    setRecentSearchesList((prev) => {
      const updated = [
        searchTerm,
        ...prev.filter((s) => s !== searchTerm),
      ].slice(0, 8);
      saveRecentSearches(updated);
      return updated;
    });
  };

  const performSearch = useCallback((searchQuery?: string) => {
    // Safely get the search term
    const term = typeof searchQuery === "string" ? searchQuery : query;
    const searchTerm = typeof term === "string" ? term.trim() : "";
    
    if (!searchTerm && !hasFilters()) return;

    if (searchTerm) {
      addToRecent(searchTerm);
    }

    setIsLoading(true);
    setHasSearched(true);
    setShowMobileRecent(false);
    setShowDesktopRecent(false);

    setTimeout(() => {
      let filtered = [...videoData];

      if (searchTerm) {
        const lowerQuery = searchTerm.toLowerCase();
        filtered = filtered.filter(
          (v) =>
            v.title.toLowerCase().includes(lowerQuery) ||
            v.channel.toLowerCase().includes(lowerQuery) ||
            v.description.toLowerCase().includes(lowerQuery)
        );
      }

      if (activeLangs.length > 0) {
        filtered = filtered.filter((v) => activeLangs.includes(v.language));
      }

      if (selectedCategories.length > 0) {
        filtered = filtered.filter((v) =>
          selectedCategories.includes(v.category)
        );
      }

      if (selectedScholars.length > 0) {
        filtered = filtered.filter((v) =>
          selectedScholars.some((sch) =>
            v.channel.toLowerCase().includes(sch.toLowerCase())
          )
        );
      }

      if (selectedChannels.length > 0) {
        const selectedChannelIds = selectedChannels
          .map((chName) => channelNameToId.get(chName))
          .filter(Boolean) as string[];
        filtered = filtered.filter((v) =>
          selectedChannelIds.includes(v.channelId)
        );
      }

      setResults(filtered);
      setIsLoading(false);
    }, 600);
  }, [
    query,
    hasFilters,
    activeLangs,
    selectedCategories,
    selectedScholars,
    selectedChannels,
  ]);

  const clearRecentSearches = () => {
    setRecentSearchesList([]);
    saveRecentSearches([]);
    setShowMobileRecent(false);
    setShowDesktopRecent(false);
  };

  const removeRecentSearch = (search: string) => {
    setRecentSearchesList((prev) => {
      const updated = prev.filter((s) => s !== search);
      saveRecentSearches(updated);
      return updated;
    });
  };

  const handleRecentSearchClick = (search: string) => {
    setQuery(search);
    setShowMobileRecent(false);
    setShowDesktopRecent(false);
    addToRecent(search);
    // Use setTimeout to ensure query state is updated before search
    setTimeout(() => performSearch(search), 50);
  };

  const handleClearSearch = () => {
    setQuery("");
    setHasSearched(false);
    setResults([]);
    searchInputRef.current?.focus();
  };

  const handleShare = (video: VideoItem) => {
    setShareUrl(
      `${window.location.origin}/videos/${video.channel}/${video.videoId}`
    );
    setShareModalOpen(true);
  };

  // Safe query for display
  const displayQuery = typeof query === "string" ? query : "";

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile header – integrated search bar */}
      <div className="md:hidden flex items-center gap-2 px-4 py-3 border-b sticky top-[56px] bg-background z-10">
        <button
          onClick={() => {
            if (hasSearched) {
              handleClearSearch();
            } else {
              router.back();
            }
          }}
          className="flex items-center justify-center h-9 w-9 rounded-full hover:bg-muted flex-shrink-0 -ml-1"
          aria-label="Go back"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div className="flex-1 relative" ref={mobileSearchRef}>
          <input
            ref={searchInputRef}
            type="text"
            value={displayQuery}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setShowMobileRecent(true)}
            onClick={() => setShowMobileRecent(true)}
            placeholder="Search"
            className="w-full h-10 pl-10 pr-10 rounded-full bg-muted/50 text-sm focus:bg-muted transition-colors"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                performSearch();
              }
            }}
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          {displayQuery && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}

          {/* Recent searches dropdown */}
          {showMobileRecent && !hasSearched && recentSearchesList.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-popover border rounded-xl shadow-lg z-50 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 border-b">
                <span className="text-xs font-medium text-muted-foreground">Recent searches</span>
                <button onClick={clearRecentSearches} className="text-xs text-primary hover:underline">Clear all</button>
              </div>
              <div className="max-h-64 overflow-y-auto">
                {recentSearchesList.map((search) => (
                  <button
                    key={search}
                    onClick={() => handleRecentSearchClick(search)}
                    className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <History className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <span className="text-sm text-left truncate">{search}</span>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); removeRecentSearch(search); }}
                      className="p-1 rounded-full hover:bg-muted/80 text-muted-foreground hover:text-foreground flex-shrink-0"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        <Button variant="ghost" size="icon" className="rounded-full" onClick={() => performSearch()}>
          <Search className="h-5 w-5" />
        </Button>
      </div>

      <div className="px-4 md:px-6 py-4 md:py-6 mt-12 max-w-4xl mx-auto">
        {/* Desktop search bar + filters layout */}
        <div className="hidden md:block mb-6">
          <h1 className="text-2xl font-bold mb-4">Search</h1>

          {/* Search input */}
          <div className="relative w-full mb-6" ref={desktopSearchRef}>
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input
              ref={searchInputRef}
              type="text"
              value={displayQuery}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setShowDesktopRecent(true)}
              onClick={() => setShowDesktopRecent(true)}
              placeholder="Search videos, scholars, channels..."
              className="w-full h-12 pl-12 pr-24 rounded-full bg-muted/50 text-sm focus:bg-muted transition-colors border focus:border-primary focus:ring-2 focus:ring-primary/20"
              onKeyDown={(e) => e.key === "Enter" && performSearch()}
            />
            {displayQuery && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-24 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            )}
            <Button
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full h-9 px-6"
              onClick={() => performSearch()}
            >
              <Search className="h-4 w-4 mr-1.5" /> Search
            </Button>

            {/* Recent searches dropdown */}
            {showDesktopRecent && !hasSearched && recentSearchesList.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-popover border rounded-xl shadow-lg z-50 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2 border-b">
                  <span className="text-xs font-medium text-muted-foreground">Recent searches</span>
                  <button onClick={clearRecentSearches} className="text-xs text-primary hover:underline">Clear all</button>
                </div>
                <div className="max-h-64 overflow-y-auto">
                  {recentSearchesList.map((search) => (
                    <button
                      key={search}
                      onClick={() => handleRecentSearchClick(search)}
                      className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-muted transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <History className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <span className="text-sm text-left truncate">{search}</span>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); removeRecentSearch(search); }}
                        className="p-1 rounded-full hover:bg-muted/80 text-muted-foreground hover:text-foreground flex-shrink-0"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Desktop: filters + results */}
          {!hasSearched ? (
            <div>
              {/* Filters card */}
              <div className="p-5 border rounded-xl bg-muted/10">
                <FiltersContent
                  languages={languages}
                  activeLangs={activeLangs}
                  toggleLang={toggleLang}
                  categoryOptions={categoryOptions}
                  selectedCategories={selectedCategories}
                  setSelectedCategories={setSelectedCategories}
                  scholarOptions={scholarOptions}
                  selectedScholars={selectedScholars}
                  setSelectedScholars={setSelectedScholars}
                  channelOptions={channelOptions}
                  selectedChannels={selectedChannels}
                  setSelectedChannels={setSelectedChannels}
                  hasFilters={hasFilters()}
                  resetAllFilters={resetAllFilters}
                  performSearch={performSearch}
                  query={displayQuery}
                />
              </div>

              {/* Empty state */}
              {recentSearchesList.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <Search className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p>Use the filters and search box to find Islamic content</p>
                </div>
              )}
            </div>
          ) : (
            <div>
              {/* Results header */}
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-muted-foreground">
                  {`${results.length} result${results.length !== 1 ? "s" : ""}${displayQuery ? ` for "${displayQuery}"` : ""}`}
                </p>
                <button onClick={handleClearSearch} className="text-sm text-primary hover:underline">
                  Clear results
                </button>
              </div>

              {isLoading ? (
                <div className="space-y-4">
                  <VideoSkeleton />
                  <VideoSkeleton />
                  <VideoSkeleton />
                  <VideoSkeleton />
                </div>
              ) : results.length > 0 ? (
                <div className="space-y-4">
                  {results.map((video) => (
                    <div key={video.id} className="flex gap-3 group">
                      <Link
                        href={`/videos/${video.channel}/${video.videoId}`}
                        className="relative w-40 md:w-56 aspect-video flex-shrink-0"
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
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <Link href={`/videos/${video.channel}/${video.videoId}`}>
                              <h3 className="font-medium text-sm md:text-base line-clamp-2 hover:text-primary transition-colors">
                                {video.title}
                              </h3>
                            </Link>
                            <div className="flex items-center gap-2 mt-1">
                              <Link
                                href={`/channel-new/${video.channelId}`}
                                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
                              >
                                <Avatar className="h-5 w-5">
                                  <AvatarImage src={video.channelAvatar} />
                                  <AvatarFallback className="text-[10px]">
                                    {video.channel.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <span>{video.channel}</span>
                              </Link>
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {video.views} • {video.timeAgo}
                            </p>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button className="p-1.5 rounded-full hover:bg-muted transition-colors flex-shrink-0">
                                <MoreVertical className="h-4 w-4 text-muted-foreground" />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56 rounded-xl">
                              <DropdownMenuItem
                                className="cursor-pointer"
                                onClick={() => toast.success("Added to Watch Later (demo)")}
                              >
                                <Clock className="h-4 w-4 mr-2" /> Save to Watch later
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="cursor-pointer"
                                onClick={() => toast.success("Added to playlist (demo)")}
                              >
                                <Bookmark className="h-4 w-4 mr-2" /> Save to playlist
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="cursor-pointer"
                                onClick={() => handleShare(video)}
                              >
                                <Share className="h-4 w-4 mr-2" /> Share
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-1">No results found</h3>
                  <p className="text-muted-foreground">Try different keywords or adjust your filters</p>
                  <Button variant="outline" className="mt-4 rounded-full" onClick={handleClearSearch}>
                    Clear search
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile: filters + results */}
        <div className="md:hidden">
          {!hasSearched ? (
            <div>
              {/* Mobile filters */}
              <div className="mb-6">
                <div className="p-4 border rounded-xl bg-muted/10">
                  <FiltersContent
                    languages={languages}
                    activeLangs={activeLangs}
                    toggleLang={toggleLang}
                    categoryOptions={categoryOptions}
                    selectedCategories={selectedCategories}
                    setSelectedCategories={setSelectedCategories}
                    scholarOptions={scholarOptions}
                    selectedScholars={selectedScholars}
                    setSelectedScholars={setSelectedScholars}
                    channelOptions={channelOptions}
                    selectedChannels={selectedChannels}
                    setSelectedChannels={setSelectedChannels}
                    hasFilters={hasFilters()}
                    resetAllFilters={resetAllFilters}
                    performSearch={performSearch}
                    query={displayQuery}
                  />
                </div>
              </div>

              {/* Empty state */}
              {recentSearchesList.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <Search className="h-12 w-12 mx-auto mb-3 opacity-30" />
                  <p>Use the filters and search box to find Islamic content</p>
                </div>
              )}
            </div>
          ) : (
            <div>
              {/* Results header */}
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-muted-foreground">
                  {`${results.length} result${results.length !== 1 ? "s" : ""}${displayQuery ? ` for "${displayQuery}"` : ""}`}
                </p>
                <button onClick={handleClearSearch} className="text-sm text-primary hover:underline">
                  Clear results
                </button>
              </div>

              {isLoading ? (
                <div className="space-y-4">
                  <VideoSkeleton />
                  <VideoSkeleton />
                  <VideoSkeleton />
                  <VideoSkeleton />
                </div>
              ) : results.length > 0 ? (
                <div className="space-y-4">
                  {results.map((video) => (
                    <div key={video.id} className="flex gap-3 group">
                      <Link
                        href={`/videos/${video.channel}/${video.videoId}`}
                        className="relative w-40 aspect-video flex-shrink-0"
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
                      </Link>
                      <div className="flex-1 min-w-0">
                        <Link href={`/videos/${video.channel}/${video.videoId}`}>
                          <h3 className="font-medium text-sm line-clamp-2 hover:text-primary transition-colors">
                            {video.title}
                          </h3>
                        </Link>
                        <div className="flex items-center gap-2 mt-1">
                          <Link
                            href={`/channel-new/${video.channelId}`}
                            className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
                          >
                            <Avatar className="h-4 w-4">
                              <AvatarImage src={video.channelAvatar} />
                              <AvatarFallback className="text-[8px]">
                                {video.channel.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <span>{video.channel}</span>
                          </Link>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {video.views} • {video.timeAgo}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <Search className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-1">No results found</h3>
                  <p className="text-muted-foreground">Try different keywords or adjust your filters</p>
                  <Button variant="outline" className="mt-4 rounded-full" onClick={handleClearSearch}>
                    Clear search
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <ShareModal isOpen={shareModalOpen} onClose={() => setShareModalOpen(false)} videoUrl={shareUrl} />
    </div>
  );
}