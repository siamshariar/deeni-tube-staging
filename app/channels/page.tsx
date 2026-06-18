// app/channels/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Search, X, Tv, SortAsc, Eye, EyeOff } from "lucide-react";
import AppHeader from "@/components/app-header";
import MobileNav from "@/components/mobile-nav";
import DesktopSidebar from "@/components/desktop-sidebar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { mockChannels, mockLanguages } from "@/lib/mock-data";
import { toast } from "sonner";

function ChannelSkeleton() {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <Skeleton className="h-12 w-12 md:h-14 md:w-14 rounded-full flex-shrink-0" />
      <div className="flex-1 min-w-0 space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-20" />
      </div>
      <Skeleton className="h-8 w-16 md:w-24 rounded-full" />
    </div>
  );
}

export default function ChannelsPage() {
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(["en"]);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [followedChannels, setFollowedChannels] = useState<string[]>(
    mockChannels.map((ch) => ch.id)
  );

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const toggleLanguage = (code: string) => {
    setSelectedLanguages((prev) =>
      prev.includes(code)
        ? prev.length > 1
          ? prev.filter((l) => l !== code)
          : prev
        : [...prev, code]
    );
  };

  const toggleFollow = (channelId: string) => {
    setFollowedChannels((prev) => {
      const newList = prev.includes(channelId)
        ? prev.filter((id) => id !== channelId)
        : [...prev, channelId];
      const channel = mockChannels.find((ch) => ch.id === channelId);
      if (channel) {
        toast.success(
          newList.includes(channelId)
            ? `Showing ${channel.name} in feed`
            : `Hidden ${channel.name} from feed`
        );
      }
      return newList;
    });
  };

  const filteredChannels = mockChannels
    .filter((ch) => selectedLanguages.includes(ch.language))
    .filter((ch) =>
      !searchQuery || ch.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) =>
      sortOrder === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name)
    );

  const formatSubscribers = (count: number) => {
    if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M subscribers`;
    if (count >= 1_000) return `${(count / 1_000).toFixed(1)}K subscribers`;
    return `${count} subscribers`;
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <div className="flex">
        <DesktopSidebar className="hidden md:block" />
        <div className="flex-1 md:pl-[240px] md:pt-[34px] pb-nav-safe md:pb-6 overflow-x-hidden">
          {/* Mobile header – back button + title */}
          <div className="md:hidden flex items-center gap-3 px-4 py-3 border-b sticky top-[56px] bg-background z-10">
            <button
              onClick={() => router.back()}
              className="flex items-center justify-center h-9 w-9 rounded-full hover:bg-muted flex-shrink-0"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="font-semibold text-lg">Channels</h1>
          </div>

          <div className="px-4 md:px-6 py-6 md:py-6">
            {/* Page header – search always visible */}
            <div className="flex flex-col mt-12 sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              {/* Channel count*/}
              <div className="hidden md:block">
                <h1 className="text-2xl font-bold">Channels</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  {filteredChannels.length} channel{filteredChannels.length !== 1 ? "s" : ""}
                </p>
              </div>

              {/* Search + Sort*/}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 min-w-0">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search channels"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-10 py-2 bg-muted/50 rounded-full text-sm outline-none focus:bg-muted transition-colors"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
                  }
                  className="rounded-full flex-shrink-0 h-9 w-9"
                  title={`Sort ${sortOrder === "asc" ? "Z-A" : "A-Z"}`}
                >
                  <SortAsc
                    className={cn(
                      "h-4 w-4 transition-transform",
                      sortOrder === "desc" && "rotate-180"
                    )}
                  />
                </Button>
              </div>
            </div>

            {/* Language filter chips */}
            <div className="flex gap-2 mb-4 overflow-x-auto pb-1 scrollbar-none">
              {mockLanguages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => toggleLanguage(lang.code)}
                  className={cn(
                    "px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
                    selectedLanguages.includes(lang.code)
                      ? "bg-foreground text-background"
                      : "bg-muted hover:bg-muted/80 text-foreground"
                  )}
                >
                  {lang.name}
                </button>
              ))}
            </div>

            {/* Channel list */}
            {isLoading ? (
              <div className="divide-y">
                {Array.from({ length: 5 }).map((_, i) => (
                  <ChannelSkeleton key={i} />
                ))}
              </div>
            ) : filteredChannels.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Tv className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-1">No channels found</h3>
                <p className="text-muted-foreground">
                  Try different language or search keywords
                </p>
              </div>
            ) : (
              <div className="divide-y">
                {filteredChannels.map((channel) => {
                  const isOn = followedChannels.includes(channel.id);
                  return (
                    <div
                      key={channel.id}
                      className="flex items-center gap-3 px-2 py-3 hover:bg-muted/30 transition-colors group"
                    >
                      <Link
                        href={`/channels/${channel.slug}`}
                        className="flex-shrink-0"
                      >
                        <Avatar className="h-12 w-12 md:h-14 md:w-14 ring-2 ring-transparent group-hover:ring-primary/20 transition-all">
                          <AvatarImage src={channel.avatar} />
                          <AvatarFallback>{channel.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                      </Link>

                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/channels/${channel.slug}`}
                          className="hover:underline"
                        >
                          <div className="flex items-center gap-1">
                            <h3 className="font-medium text-sm md:text-base truncate group-hover:text-primary transition-colors">
                              {channel.name}
                            </h3>
                            {channel.verified && (
                              <svg
                                className="w-4 h-4 text-blue-500 flex-shrink-0"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307z" />
                              </svg>
                            )}
                          </div>
                        </Link>
                        <p className="text-xs md:text-sm text-muted-foreground truncate">
                          {formatSubscribers(channel.subscribers)}
                        </p>
                      </div>

                      {/* Responsive toggle button */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFollow(channel.id);
                        }}
                        className={cn(
                          "flex items-center rounded-full border flex-shrink-0 transition-colors",
                          isMobile
                            ? "h-8 px-2 text-xs gap-1"
                            : "h-9 px-4 text-sm font-medium gap-1.5",
                          isOn
                            ? "bg-primary/10 border-primary text-primary hover:bg-primary/20"
                            : "bg-muted/50 border-muted-foreground/20 text-muted-foreground hover:bg-muted/80"
                        )}
                        title={isOn ? "Hide from feed" : "Show in feed"}
                      >
                        {isOn ? (
                          <Eye className="h-3.5 w-3.5 flex-shrink-0" />
                        ) : (
                          <EyeOff className="h-3.5 w-3.5 flex-shrink-0" />
                        )}
                        <span className={isMobile ? "truncate max-w-[60px]" : ""}>
                          {isMobile
                            ? isOn
                              ? "Show"
                              : "Hidden"
                            : isOn
                              ? "Show in feed"
                              : "Hidden"}
                        </span>
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
      <MobileNav />
    </div>
  );
}