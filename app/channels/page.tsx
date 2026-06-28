// app/channels/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Search, X, Users, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { channelData, ChannelItem } from "@/lib/channel-data";
import { toast } from "sonner";
import { SortDropdown, SortOption } from "@/components/sort-dropdown";

function ChannelSkeleton() {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <Skeleton className="h-12 w-12 md:h-14 md:w-14 rounded-full flex-shrink-0" />
      <div className="flex-1 min-w-0 space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-20" />
      </div>
      <Skeleton className="h-9 w-20 md:w-24 rounded-full" />
    </div>
  );
}

const sortOptions: SortOption[] = [
  { label: "Default", value: "default" },
  { label: "Name (A-Z)", value: "name-asc" },
  { label: "Name (Z-A)", value: "name-desc" },
];

export default function ChannelsPage() {
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(["bn"]);
  const [sortValue, setSortValue] = useState("default");
  const [followedChannels, setFollowedChannels] = useState<string[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    const saved = localStorage.getItem("feed-visible-channels");
    if (saved) {
      try {
        setFollowedChannels(JSON.parse(saved));
        return () => clearTimeout(timer);
      } catch {}
    }
    const allIds = channelData.map((ch: ChannelItem) => ch.id);
    setFollowedChannels(allIds);
    return () => clearTimeout(timer);
  }, []);

  const persistVisibility = (newList: string[]) => {
    localStorage.setItem("feed-visible-channels", JSON.stringify(newList));
    setFollowedChannels(newList);
  };

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
      const channel = channelData.find((ch) => ch.id === channelId);
      if (channel) {
        toast.success(
          newList.includes(channelId)
            ? `Showing ${channel.name} in feed`
            : `Hidden ${channel.name} from feed`
        );
      }
      persistVisibility(newList);
      return newList;
    });
  };

  const sortChannels = (channels: ChannelItem[]) => {
    switch (sortValue) {
      case "name-asc":
        return [...channels].sort((a, b) => a.name.localeCompare(b.name));
      case "name-desc":
        return [...channels].sort((a, b) => b.name.localeCompare(a.name));
      default:
        return channels;
    }
  };

  const filteredChannels = sortChannels(
    channelData
      .filter((ch) => selectedLanguages.includes(ch.language))
      .filter(
        (ch) =>
          !searchQuery || ch.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
  );

  const formatSubscribers = (count: number) => {
    if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M subscribers`;
    if (count >= 1_000) return `${(count / 1_000).toFixed(1)}K subscribers`;
    return `${count} subscribers`;
  };

  const mockLanguages = [
    { code: "bn", name: "Bangla" },
    { code: "en", name: "English" },
    { code: "ar", name: "Arabic" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="px-4 md:px-6 py-2 md:py-6 mt-16">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="md:block">
            <h1 className="text-2xl font-bold">Channels</h1>
          </div>

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

            <SortDropdown
              options={sortOptions}
              currentValue={sortValue}
              onSelect={setSortValue}
            />
          </div>
        </div>

        {/* Language chips */}
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
              <Users className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-1">No channels found</h3>
            <p className="text-muted-foreground">
              Try different language or search keywords
            </p>
          </div>
        ) : (
          <div className="divide-y">
            {filteredChannels.map((channel) => {
              const isVisible = followedChannels.includes(channel.id);
              return (
                <div
                  key={channel.id}
                  className="flex items-center gap-2 md:gap-3 px-2 py-3 hover:bg-muted/30 transition-colors group"
                >
                  <Link
                    href={`/channels/${channel.slug}`}
                    className="flex-shrink-0"
                  >
                    <Avatar className="h-10 w-10 md:h-14 md:w-14 ring-2 ring-transparent group-hover:ring-primary/20 transition-all">
                      <AvatarImage src={channel.avatar} />
                      <AvatarFallback>
                        {channel.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </Link>

                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/channels/${channel.slug}`}
                      className="hover:underline"
                    >
                      <div className="flex items-center gap-1">
                        <h3 className="font-medium text-xs md:text-base truncate group-hover:text-primary transition-colors">
                          {channel.name}
                        </h3>
                        {channel.verified && (
                          <svg
                            className="w-3.5 h-3.5 md:w-4 md:h-4 text-blue-500 flex-shrink-0"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307z" />
                          </svg>
                        )}
                      </div>
                    </Link>
                    <p className="text-[10px] md:text-sm text-muted-foreground truncate">
                      {formatSubscribers(channel.subscribers)}
                    </p>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFollow(channel.id);
                    }}
                    className={cn(
                      "flex items-center gap-1 rounded-full transition-colors",
                      "h-8 md:h-9 px-2.5 md:px-3",
                      isVisible
                        ? "bg-primary/10 text-primary hover:bg-primary/20"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    )}
                    title={
                      isVisible
                        ? "Visible in feed – click to hide"
                        : "Hidden from feed – click to show"
                    }
                  >
                    {isVisible ? (
                      <Eye className="h-3.5 w-3.5 md:h-4 md:w-4 flex-shrink-0" />
                    ) : (
                      <EyeOff className="h-3.5 w-3.5 md:h-4 md:w-4 flex-shrink-0" />
                    )}
                    <span className="text-xs font-medium whitespace-nowrap">
                      {isVisible ? "Visible" : "Hidden"}
                    </span>
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}