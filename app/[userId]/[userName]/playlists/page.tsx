"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Search,
  X,
  ChevronDown,
  ListVideo,
  Globe,
  Lock,
  Plus,
  Edit,
  Trash2,
  Share,
  Check,
} from "lucide-react";
import AppHeader from "@/components/app-header";
import MobileNav from "@/components/mobile-nav";
import DesktopSidebar from "@/components/desktop-sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useMediaQuery } from "@/hooks/use-media-query";
import { mockPlaylists } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export default function PlaylistsPage() {
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"recent" | "asc" | "desc">("recent");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredPlaylists = mockPlaylists
    .filter((p) => p.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortOrder === "asc") return a.name.localeCompare(b.name);
      if (sortOrder === "desc") return b.name.localeCompare(a.name);
      return 0;
    });

  const handleShare = (playlistId: string) => {
    setCopiedId(playlistId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <div className="flex">
        <DesktopSidebar className="hidden md:block" />
        <div className="flex-1 md:pl-[240px] pt-[56px] md:pt-[80px] pb-nav-safe md:pb-6">
          <div className="md:hidden flex items-center gap-3 px-4 py-3 border-b sticky top-[56px] bg-background z-10">
            <button
              onClick={() => router.back()}
              className="flex items-center justify-center h-9 w-9 rounded-full hover:bg-muted"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="font-semibold text-lg">Playlists</h1>
          </div>

          <div className="max-w-[1096px] mx-auto px-4 md:px-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 py-4 md:py-6">
              <div className="flex items-center gap-3">
                {!isMobile && (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                      <ListVideo className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold">Playlists</h1>
                      <p className="text-sm text-muted-foreground">
                        {mockPlaylists.length} playlist{mockPlaylists.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                )}
                {isMobile && (
                  <span className="text-sm text-muted-foreground">
                    {mockPlaylists.length} playlist{mockPlaylists.length !== 1 ? "s" : ""}
                  </span>
                )}
              </div>
              <Button
                className="rounded-full gap-2 w-full sm:w-auto"
                size="sm"
                onClick={() => {
                  // Prototype: just show a toast or modal placeholder
                  alert("Create new playlist (prototype)");
                }}
              >
                <Plus className="h-4 w-4" />
                <span>New playlist</span>
              </Button>
            </div>

            <div className="flex items-center gap-3 mb-6">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search playlists"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-9 h-9 text-sm rounded-full bg-muted/50 focus:bg-muted transition-colors"
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
                className="rounded-full gap-2 flex-shrink-0"
                size="sm"
                onClick={() =>
                  setSortOrder((prev) =>
                    prev === "recent" ? "asc" : prev === "asc" ? "desc" : "recent"
                  )
                }
              >
                {sortOrder === "recent" ? "Recent" : sortOrder === "asc" ? "A-Z" : "Z-A"}
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>

            <div className="divide-y">
              {filteredPlaylists.map((playlist) => (
                <div
                  key={playlist.id}
                  className="flex items-center gap-3 md:gap-4 px-2 py-3 hover:bg-muted/50 transition-colors cursor-pointer group"
                  onClick={() =>
                    router.push(
                      `/userId/userName/playlists/${playlist.slug}/${playlist.id}`
                    )
                  }
                >
                  <div className="relative w-24 h-16 bg-muted rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                    <ListVideo className="h-6 w-6 text-muted-foreground/50" />
                    <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[10px] px-1 py-0.5 rounded font-medium">
                      {playlist.videoIds.length}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm md:text-base font-medium truncate group-hover:text-primary transition-colors">
                      {playlist.name}
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground mt-0.5">
                      {playlist.isPublic ? (
                        <span className="flex items-center gap-1">
                          <Globe className="h-3 w-3" /> Public
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <Lock className="h-3 w-3" /> Private
                        </span>
                      )}
                      <span>•</span>
                      <span>{playlist.videoIds.length} videos</span>
                      <span>•</span>
                      <span>Updated {playlist.updatedAt}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        alert("Edit playlist (prototype)");
                      }}
                      className="p-1.5 rounded-full hover:bg-muted transition-colors"
                    >
                      <Edit className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        alert("Delete playlist (prototype)");
                      }}
                      className="p-1.5 rounded-full hover:bg-muted transition-colors"
                    >
                      <Trash2 className="h-4 w-4 text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300" />
                    </button>
                    {playlist.isPublic ? (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShare(playlist.id);
                        }}
                        className="p-1.5 rounded-full hover:bg-muted transition-colors"
                      >
                        {copiedId === playlist.id ? (
                          <Check className="h-4 w-4 text-green-500" />
                        ) : (
                          <Share className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                        )}
                      </button>
                    ) : (
                      <button
                        disabled
                        className="p-1.5 rounded-full opacity-50 cursor-not-allowed"
                      >
                        <Share className="h-4 w-4 text-muted-foreground/50" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <MobileNav />
    </div>
  );
}