// app/search-new/page.tsx
"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  X,
  ChevronDown,
  ArrowLeft,
  History,
  SlidersHorizontal,
  MoreVertical,
  Clock,
  Bookmark,
  Share,
  Play,
} from "lucide-react";
import AppHeader from "@/components/app-header";
import MobileNav from "@/components/mobile-nav";
import DesktopSidebar from "@/components/desktop-sidebar";
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
import { AddToPlaylistDialog } from "@/components/add-to-playlist-dialog";
import { ShareModal } from "@/components/share-modal";
import { useWatchLater } from "@/hooks/useWatchLater";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  mockSearchResults,
  mockCategories,
  mockScholars,
  mockChannels,
} from "@/lib/mock-data";

// ---------- CONSTANTS ----------
const languages = [
  { code: "en", label: "English" },
  { code: "ar", label: "Arabic" },
  { code: "hi", label: "Hindi" },
  { code: "bn", label: "Bengali" },
  { code: "ur", label: "Urdu" },
  { code: "tr", label: "Turkish" },
];

const categoryOptions = mockCategories.map((c) => c.name);
const scholarOptions = mockScholars.map((s) => s.name);
const channelOptions = mockChannels.map((c) => c.name);

const sampleResults = mockSearchResults;

// ---------- MULTI-SELECT COMPONENT ----------
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

// ---------- MAIN PAGE ----------
export default function SearchNewPage() {
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { addToWatchLater } = useWatchLater();

  const [query, setQuery] = useState("");
  const [activeLangs, setActiveLangs] = useState<string[]>(["en"]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedScholars, setSelectedScholars] = useState<string[]>([]);
  const [selectedChannels, setSelectedChannels] = useState<string[]>([]);

  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<typeof sampleResults>([]);
  const [recentSearchesList, setRecentSearchesList] = useState<string[]>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("recentSearches");
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  });
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState("");

  // Removed mobileFiltersOpen state as filters are always open on mobile

  useEffect(() => {
    searchInputRef.current?.focus();
  }, []);

  const hasFilters = useCallback(() => {
    return (
      selectedCategories.length > 0 ||
      selectedScholars.length > 0 ||
      selectedChannels.length > 0 ||
      activeLangs.filter((l) => l !== "en").length > 0
    );
  }, [selectedCategories, selectedScholars, selectedChannels, activeLangs]);

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
    setActiveLangs(["en"]);
    setSelectedCategories([]);
    setSelectedScholars([]);
    setSelectedChannels([]);
    setHasSearched(false);
    setResults([]);
    setQuery("");
  };

  const performSearch = useCallback(() => {
    if (!query.trim() && !hasFilters()) return;

    if (query.trim()) {
      const updated = [
        query.trim(),
        ...recentSearchesList.filter((s) => s !== query.trim()),
      ].slice(0, 8);
      setRecentSearchesList(updated);
      localStorage.setItem("recentSearches", JSON.stringify(updated));
    }

    setIsLoading(true);
    setHasSearched(true);

    setTimeout(() => {
      let filtered = [...sampleResults];

      if (query.trim()) {
        const lowerQuery = query.toLowerCase();
        filtered = filtered.filter(
          (v) =>
            v.title.toLowerCase().includes(lowerQuery) ||
            v.channel.toLowerCase().includes(lowerQuery) ||
            v.description.toLowerCase().includes(lowerQuery)
        );
      }

      const nonEnglishLangs = activeLangs.filter((l) => l !== "en");
      if (nonEnglishLangs.length > 0) {
        filtered = filtered.filter((v) =>
          nonEnglishLangs.includes(v.language)
        );
      }

      if (selectedCategories.length > 0) {
        filtered = filtered.filter((v) =>
          selectedCategories.some((cat) =>
            v.category?.toLowerCase().includes(cat.toLowerCase())
          )
        );
      }

      if (selectedScholars.length > 0) {
        filtered = filtered.filter((v) =>
          selectedScholars.some((sch) =>
            v.scholar?.toLowerCase().includes(sch.toLowerCase())
          )
        );
      }

      if (selectedChannels.length > 0) {
        filtered = filtered.filter((v) =>
          selectedChannels.some((ch) =>
            v.channel.toLowerCase().includes(ch.toLowerCase())
          )
        );
      }

      setResults(filtered);
      setIsLoading(false);
    }, 800);
  }, [
    query,
    hasFilters,
    recentSearchesList,
    activeLangs,
    selectedCategories,
    selectedScholars,
    selectedChannels,
  ]);

  const clearRecentSearches = () => {
    setRecentSearchesList([]);
    localStorage.removeItem("recentSearches");
  };

  const removeRecentSearch = (search: string) => {
    const updated = recentSearchesList.filter((s) => s !== search);
    setRecentSearchesList(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));
  };

  const handleRecentSearchClick = (search: string) => {
    setQuery(search);
    setTimeout(() => {
      const updated = [
        search,
        ...recentSearchesList.filter((s) => s !== search),
      ].slice(0, 8);
      setRecentSearchesList(updated);
      localStorage.setItem("recentSearches", JSON.stringify(updated));
      performSearch();
    }, 100);
  };

  const handleClearSearch = () => {
    setQuery("");
    setHasSearched(false);
    setResults([]);
    searchInputRef.current?.focus();
  };

  const handleShare = (video: any) => {
    setShareUrl(
      `${window.location.origin}/videos/${video.channel}/${video.id}`
    );
    setShareModalOpen(true);
  };

  const FilterChips = () => {
    const activeLanguageChips = activeLangs
      .filter((l) => l !== "en")
      .map((lang) => ({
        label: languages.find((l) => l.code === lang)?.label || lang,
        onRemove: () => toggleLang(lang),
      }));
    const categoryChips = selectedCategories.map((cat) => ({
      label: cat,
      onRemove: () =>
        setSelectedCategories((prev) => prev.filter((c) => c !== cat)),
    }));
    const scholarChips = selectedScholars.map((s) => ({
      label: s,
      onRemove: () =>
        setSelectedScholars((prev) => prev.filter((sc) => sc !== s)),
    }));
    const channelChips = selectedChannels.map((ch) => ({
      label: ch,
      onRemove: () =>
        setSelectedChannels((prev) => prev.filter((c) => c !== ch)),
    }));
    const allChips = [
      ...activeLanguageChips,
      ...categoryChips,
      ...scholarChips,
      ...channelChips,
    ];
    if (allChips.length === 0) return null;
    return (
      <div className="flex flex-wrap gap-2 mb-4">
        {allChips.map((chip, idx) => (
          <span
            key={idx}
            className="flex items-center gap-1 bg-primary/10 text-primary text-xs px-3 py-1 rounded-full font-medium"
          >
            {chip.label}
            <button onClick={chip.onRemove} className="hover:opacity-70">
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
        <button
          onClick={resetAllFilters}
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          Clear all
        </button>
      </div>
    );
  };

  const FiltersContent = () => (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-base">Filters</h2>
        {hasFilters() && (
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
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80 text-foreground"
              )}
            >
              {lang.label}
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
        disabled={!query.trim() && !hasFilters()}
      >
        <Search className="h-4 w-4 mr-2" /> Search
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <div className="flex">
        <DesktopSidebar className="hidden md:block" />
        <div className="flex-1 md:pl-[240px] pt-[56px] md:pt-[80px] pb-nav-safe md:pb-6">
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
            <div className="flex-1 relative">
              <input
                ref={searchInputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search"
                className="w-full h-10 pl-10 pr-10 rounded-full bg-muted/50 text-sm focus:bg-muted transition-colors"
                onKeyDown={(e) => e.key === "Enter" && performSearch()}
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={performSearch}
            >
              <Search className="h-5 w-5" />
            </Button>
          </div>

          <div className="px-4 md:px-6 py-4 md:py-6">
            {/* Desktop search bar – smaller width */}
            <div className="hidden md:flex items-center gap-3 mb-6">
              <div className="relative w-full max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search videos, scholars, channels..."
                  className="w-full h-10 pl-10 pr-10 rounded-full bg-muted/50 text-sm focus:bg-muted transition-colors"
                  onKeyDown={(e) => e.key === "Enter" && performSearch()}
                />
                {query && (
                  <button
                    onClick={() => setQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              <Button
                variant="default"
                className="rounded-full h-10"
                onClick={performSearch}
              >
                Search
              </Button>
            </div>

            {/* Main content */}
            {!hasSearched ? (
              <div>
                {/* Filters – desktop: always visible, mobile: always visible (no toggle) */}
                <div className="hidden md:block mb-6">
                  <div className="p-4 border rounded-xl bg-muted/10 max-w-md">
                    <FiltersContent />
                  </div>
                </div>

                {/* Mobile filters – always open */}
                <div className="md:hidden mb-6">
                  <div className="p-4 border rounded-xl bg-muted/10">
                    <FiltersContent />
                  </div>
                </div>

                {/* Recent searches */}
                {recentSearchesList.length > 0 && (
                  <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                      <h2 className="font-semibold text-sm">
                        Recent searches
                      </h2>
                      <button
                        onClick={clearRecentSearches}
                        className="text-xs text-muted-foreground hover:text-foreground"
                      >
                        Clear all
                      </button>
                    </div>
                    <div className="space-y-1">
                      {recentSearchesList.map((search) => (
                        <div
                          key={search}
                          className="flex items-center justify-between group"
                        >
                          <button
                            onClick={() => handleRecentSearchClick(search)}
                            className="flex items-center gap-3 py-2 px-2 rounded-lg hover:bg-muted/50 flex-1 text-left"
                          >
                            <History className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm">{search}</span>
                          </button>
                          <button
                            onClick={() => removeRecentSearch(search)}
                            className="p-1.5 rounded-full hover:bg-muted opacity-0 group-hover:opacity-100"
                          >
                            <X className="h-4 w-4 text-muted-foreground" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {recentSearchesList.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    <Search className="h-12 w-12 mx-auto mb-3 opacity-30" />
                    <p>
                      Use the filters and search box to find Islamic content
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <FilterChips />

                {isLoading ? (
                  <div className="space-y-4">
                    <VideoSkeleton />
                    <VideoSkeleton />
                    <VideoSkeleton />
                    <VideoSkeleton />
                  </div>
                ) : results.length > 0 ? (
                  <>
                    <div className="flex items-center justify-between mb-4">
                      <p className="text-sm text-muted-foreground">
                        {`${results.length} result${
                          results.length !== 1 ? "s" : ""
                        } for "${query || "filtered search"}"`}
                      </p>
                      <button
                        onClick={handleClearSearch}
                        className="text-sm text-primary hover:underline"
                      >
                        Clear results
                      </button>
                    </div>
                    <div className="space-y-4">
                      {results.map((video) => (
                        <div key={video.id} className="flex gap-3 group">
                          <Link
                            href={`/videos/${video.channel}/${video.id}`}
                            className="relative w-40 md:w-56 aspect-video flex-shrink-0"
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
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1 min-w-0">
                                <Link
                                  href={`/videos/${video.channel}/${video.id}`}
                                >
                                  <h3 className="font-medium text-sm md:text-base line-clamp-2 hover:text-primary transition-colors">
                                    {video.title}
                                  </h3>
                                </Link>
                                <div className="flex items-center gap-2 mt-1">
                                  <Link
                                    href={`/channel/${video.channel}`}
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
                                <DropdownMenuContent
                                  align="end"
                                  className="w-56 rounded-xl"
                                >
                                  <DropdownMenuItem
                                    className="cursor-pointer"
                                    onClick={() => {
                                      addToWatchLater({
                                        id: video.id,
                                        title: video.title,
                                        channel: video.channel,
                                        channelAvatar: video.channelAvatar,
                                        thumbnail: video.thumbnail,
                                        views: video.views,
                                        timeAgo: video.timeAgo,
                                        duration: video.duration,
                                        addedAt: Date.now(),
                                      });
                                      toast.success("Added to Watch Later");
                                    }}
                                  >
                                    <Clock className="h-4 w-4 mr-2" /> Save to
                                    Watch later
                                  </DropdownMenuItem>
                                  <AddToPlaylistDialog
                                    video={{
                                      id: video.id,
                                      title: video.title,
                                      channel: video.channel,
                                    }}
                                    onAdded={() =>
                                      toast.success("Added to playlist")
                                    }
                                  >
                                    <DropdownMenuItem className="cursor-pointer w-full">
                                      <Bookmark className="h-4 w-4 mr-2" /> Save
                                      to playlist
                                    </DropdownMenuItem>
                                  </AddToPlaylistDialog>
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
                  </>
                ) : (
                  <div className="text-center py-16">
                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium mb-1">
                      No results found
                    </h3>
                    <p className="text-muted-foreground">
                      Try different keywords or adjust your filters
                    </p>
                    <Button
                      variant="outline"
                      className="mt-4 rounded-full"
                      onClick={handleClearSearch}
                    >
                      Clear search
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      <MobileNav />

      {/* Share Modal */}
      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        videoUrl={shareUrl}
      />
    </div>
  );
}