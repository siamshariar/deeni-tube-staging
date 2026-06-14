"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Search, X, Tv, SortAsc, LogIn, Eye, EyeOff } from "lucide-react";
import AppHeader from "@/components/app-header";
import MobileNav from "@/components/mobile-nav";
import DesktopSidebar from "@/components/desktop-sidebar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useLanguage } from "@/hooks/use-language";
import { useFeedPreferences } from "@/hooks/useFeedPreferences";
import { allChannels } from "@/lib/channels";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const languageOptions = [
  { code: "en", label: "English" },
  { code: "ar", label: "Arabic" },
];

function VerifiedIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={cn("w-4 h-4 text-blue-500", className)}>
      <path fillRule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307z" />
    </svg>
  );
}

function ChannelSkeleton() {
  return (
    <div className="flex items-center gap-4 px-2 py-3">
      <Skeleton className="h-14 w-14 md:h-16 md:w-16 rounded-full flex-shrink-0" />
      <div className="flex-1 min-w-0 space-y-2">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-3 w-24" />
      </div>
      <Skeleton className="h-9 w-28 rounded-full" />
    </div>
  );
}

export default function ChannelsPage() {
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { preferredLanguages, isGuest } = useLanguage();
  const { followedChannels, toggleFollowChannel } = useFeedPreferences();

  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(preferredLanguages.length ? preferredLanguages : ["en"]);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [showSignInDialog, setShowSignInDialog] = useState(false);
  const [pendingChannel, setPendingChannel] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const toggleLanguage = (code: string) => {
    setSelectedLanguages(prev =>
      prev.includes(code)
        ? prev.length > 1 ? prev.filter(l => l !== code) : prev
        : [...prev, code]
    );
  };

  const handleToggle = (channelId: string) => {
    if (isGuest) {
      setPendingChannel(channelId);
      setShowSignInDialog(true);
      return;
    }
    toggleFollowChannel(channelId);
  };

  const filteredChannels = allChannels
    .filter(ch => selectedLanguages.includes(ch.language))
    .filter(ch => !searchQuery || ch.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => sortOrder === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name));

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
        <div className="flex-1 md:pl-[240px] pt-[56px] md:pt-[80px] pb-nav-safe md:pb-6">
          {/* Mobile header */}
          <div className="md:hidden flex items-center gap-3 px-4 py-3 border-b sticky top-[56px] bg-background z-10">
            <button onClick={() => router.back()} className="flex items-center justify-center h-9 w-9 rounded-full hover:bg-muted"><ArrowLeft className="h-5 w-5" /></button>
            <h1 className="font-semibold text-lg">Channels</h1>
          </div>

          <div className="max-w-[1000px] mx-auto px-4 md:px-6">
            <div className="py-4 md:py-6">
              {!isMobile && (
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center"><Tv className="h-6 w-6 text-muted-foreground" /></div>
                  <div><h1 className="text-2xl font-bold">Channels</h1><p className="text-sm text-muted-foreground">Toggle channels ON/OFF to control your home feed</p></div>
                </div>
              )}

              {/* Language chips */}
              <div className="flex flex-wrap gap-2 mb-4">
                {languageOptions.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => toggleLanguage(lang.code)}
                    className={cn("px-4 py-1.5 rounded-full text-sm font-medium transition-colors", selectedLanguages.includes(lang.code) ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80 text-foreground")}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>

              {/* Search + sort */}
              <div className="flex items-center gap-2 mb-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input type="text" placeholder="Search channels" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-10 py-2 bg-muted/50 rounded-full text-sm outline-none focus:bg-muted" />
                  {searchQuery && <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>}
                </div>
                <Button variant="outline" size="icon" onClick={() => setSortOrder(prev => prev === "asc" ? "desc" : "asc")} className="rounded-full"><SortAsc className={cn("h-4 w-4 transition-transform", sortOrder === "desc" && "rotate-180")} /></Button>
              </div>
            </div>

            {isLoading ? (
              <div className="divide-y"><ChannelSkeleton /><ChannelSkeleton /><ChannelSkeleton /><ChannelSkeleton /></div>
            ) : filteredChannels.length === 0 ? (
              <div className="text-center py-16"><div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4"><Tv className="h-8 w-8 text-muted-foreground" /></div><h3 className="text-lg font-medium mb-1">No channels found</h3><p className="text-muted-foreground">Try different language or search</p></div>
            ) : (
              <div className="divide-y">
                {filteredChannels.map((channel) => {
                  const isOn = followedChannels.includes(channel.id);
                  return (
                    <div key={channel.id} className="flex items-center gap-3 md:gap-4 px-2 py-3 hover:bg-muted/50 transition-colors">
                      <Link href={`/channel-new/${channel.slug}`} className="flex-shrink-0">
                        <Avatar className="h-12 w-12 md:h-14 md:w-14"><AvatarImage src={channel.avatar} /><AvatarFallback>{channel.name.charAt(0)}</AvatarFallback></Avatar>
                      </Link>
                      <div className="flex-1 min-w-0">
                        <Link href={`/channel-new/${channel.slug}`} className="hover:underline">
                          <div className="flex items-center gap-1"><h3 className="font-medium text-sm md:text-base truncate">{channel.name}</h3>{channel.verified && <VerifiedIcon />}</div>
                        </Link>
                        <p className="text-xs md:text-sm text-muted-foreground">{formatSubscribers(channel.subscribers)}</p>
                      </div>
                      {/* Custom Toggle Pill */}
                      <button
                        onClick={() => handleToggle(channel.id)}
                        className={cn(
                          "relative inline-flex items-center h-9 px-4 rounded-full text-sm font-medium transition-all duration-200 border",
                          isOn
                            ? "bg-primary/10 border-primary text-primary hover:bg-primary/20"
                            : "bg-muted/50 border-muted-foreground/20 text-muted-foreground hover:bg-muted/80"
                        )}
                        aria-pressed={isOn}
                      >
                        {isOn ? (
                          <>
                            <Eye className="h-4 w-4 mr-1.5" />
                            Show in feed
                          </>
                        ) : (
                          <>
                            <EyeOff className="h-4 w-4 mr-1.5" />
                            Hidden
                          </>
                        )}
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

      <Dialog open={showSignInDialog} onOpenChange={setShowSignInDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle className="flex items-center gap-2"><LogIn className="h-5 w-5 text-primary" /> Sign in required</DialogTitle><DialogDescription>You need to sign in to manage channel feed preferences.</DialogDescription></DialogHeader>
          <div className="flex gap-3 mt-4"><Button variant="outline" onClick={() => setShowSignInDialog(false)} className="flex-1">Cancel</Button><Button onClick={() => router.push("/signin")} className="flex-1">Sign in</Button></div>
        </DialogContent>
      </Dialog>
    </div>
  );
}