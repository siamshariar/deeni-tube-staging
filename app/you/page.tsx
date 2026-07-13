// app/you/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Globe, Tv, LogOut, Check, ChevronRight,
  History, ThumbsUp, Clock, ListVideo,
  Settings, HelpCircle, MoreHorizontal, Heart,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { mockLanguages } from "@/lib/mock-data";
import { toast } from "sonner";

const preferredLanguageOptions = mockLanguages.filter((l) => l.code !== "en");

export default function YouPage() {
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [userName, setUserName] = useState("User Name");
  const [userEmail, setUserEmail] = useState("user@example.com");
  const [userInitials, setUserInitials] = useState("UN");
  const [userAvatar, setUserAvatar] = useState("");
  const [defaultLanguage, setDefaultLanguage] = useState("en");
  const [preferredLanguages, setPreferredLanguages] = useState<string[]>(["ar", "bn", "hi"]);
  const [isLoading, setIsLoading] = useState(true);
  const [showSignOutDialog, setShowSignOutDialog] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const userData = localStorage.getItem("deeni-user-data");
    if (userData) {
      try {
        const parsed = JSON.parse(userData);
        setUserName(parsed.name || "User Name");
        setUserEmail(parsed.email || "user@example.com");
        setUserInitials(parsed.initials || "UN");
        setUserAvatar(parsed.avatar || "");
      } catch {}
    }
    const prefs = localStorage.getItem("deeni-lang-prefs");
    if (prefs) {
      try {
        const parsed = JSON.parse(prefs);
        if (parsed.languages) setPreferredLanguages(parsed.languages);
        if (parsed.default) setDefaultLanguage(parsed.default);
      } catch {}
    }
  }, []);

  const [prefSaved, setPrefSaved] = useState(false);
  const savePreferences = () => {
    localStorage.setItem(
      "deeni-lang-prefs",
      JSON.stringify({
        languages: preferredLanguages,
        default: defaultLanguage,
        hasSelected: true,
        isGuest: false,
      })
    );
    setPrefSaved(true);
    setTimeout(() => setPrefSaved(false), 2500);
    toast.success("Preferences saved successfully!");
  };

  const togglePreferredLanguage = (code: string) => {
    setPreferredLanguages((prev) =>
      prev.includes(code)
        ? prev.length > 1 ? prev.filter((l) => l !== code) : prev
        : [...prev, code]
    );
  };

  const handleSignOut = () => {
    localStorage.removeItem("deeni-user-data");
    localStorage.removeItem("deeni-lang-prefs");
    window.dispatchEvent(new Event("auth-changed"));
    router.push("/signin");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="px-3 md:px-6 py-4 md:py-6 mt-14 md:mt-16 max-w-3xl mx-auto">
          {/* Desktop title skeleton */}
          <div className="hidden md:block mb-6">
            <Skeleton className="h-8 w-20 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>

          {/* Profile card skeleton */}
          <div className="mb-6 rounded-xl border p-4 flex items-center gap-4">
            <Skeleton className="h-14 w-14 md:h-16 md:w-16 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>

          {/* Language card skeleton */}
          <div className="mb-6 rounded-xl border overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 bg-muted/30 border-b">
              <Skeleton className="h-4 w-4 rounded" />
              <Skeleton className="h-4 w-32" />
            </div>
            <div className="p-4 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="space-y-1">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-3 w-36" />
                </div>
                <Skeleton className="h-10 w-full sm:w-44 rounded-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-36" />
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full rounded-lg" />
                ))}
                <Skeleton className="h-4 w-48" />
              </div>
              <Skeleton className="h-10 w-full sm:w-auto rounded-full" />
            </div>
          </div>

          {/* Channel card skeleton */}
          <div className="rounded-xl border overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-3 bg-muted/30 border-b">
              <Skeleton className="h-4 w-4 rounded" />
              <Skeleton className="h-4 w-36" />
            </div>
            <div className="flex items-center justify-between px-4 py-3.5">
              <div className="space-y-1">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-40" />
              </div>
              <Skeleton className="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="px-3 md:px-6 py-4 md:py-6 mt-14 md:mt-16 max-w-3xl mx-auto">
        {/* Desktop title */}
        <div className="hidden md:block mb-6">
          <h1 className="text-2xl font-bold">You</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage your profile and preferences
          </p>
        </div>

        {/* User Profile Card */}
        <div className="mb-6 rounded-xl border shadow-sm overflow-hidden">
          <div className="p-4 md:p-5 flex items-center gap-4">
            <Avatar className="h-14 w-14 md:h-16 md:w-16 ring-2 ring-primary/10 flex-shrink-0">
              {userAvatar ? (
                <AvatarImage src={userAvatar} alt={userName} />
              ) : (
                <AvatarFallback className="text-lg font-semibold bg-primary/10 text-primary">
                  {userInitials}
                </AvatarFallback>
              )}
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-base truncate">{userName}</p>
              <p className="text-sm text-muted-foreground truncate">{userEmail}</p>
              <button
                onClick={() => setShowSignOutDialog(true)}
                className="mt-1.5 flex items-center gap-1.5 text-sm text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 transition-colors font-medium"
              >
                <LogOut className="h-4 w-4" /> Sign out
              </button>
            </div>
          </div>
        </div>

        {/* Library Section — visible on mobile only; web screen uses sidebar links */}
        <div className="mb-6 rounded-xl border shadow-sm overflow-hidden md:hidden">
          {[
            { href: "/history", icon: History, label: "History", desc: "Your watch history" },
            // { href: "/liked-videos", icon: ThumbsUp, label: "Liked Videos", desc: "Videos you've liked" },
            // { href: "/watch-later", icon: Clock, label: "Watch Later", desc: "Saved for later" },
            { href: "/playlists", icon: ListVideo, label: "Playlists", desc: "Your playlists" },
          ].map(({ href, icon: Icon, label, desc }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center justify-between px-4 py-3.5 hover:bg-muted/50 transition-colors group border-b last:border-0"
            >
              <div className="flex items-center gap-3">
                <Icon className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                <div>
                  <p className="text-sm font-medium">{label}</p>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all flex-shrink-0" />
            </Link>
          ))}
        </div>

        {/* Language Preference Card */}
        <div className="mb-6 rounded-xl border shadow-sm overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 bg-muted/30 border-b">
            <Globe className="h-4 w-4 text-primary" />
            <h2 className="font-semibold text-sm">Language preference</h2>
          </div>
          <div className="p-4 md:p-5 space-y-5">
            {/* Default language */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <p className="text-sm font-medium">Default language</p>
                <p className="text-xs text-muted-foreground">Used across the app</p>
              </div>
              <Select value={defaultLanguage} onValueChange={setDefaultLanguage}>
                <SelectTrigger className="w-full sm:w-44 h-10 rounded-full text-sm border bg-background hover:bg-muted/50 transition-colors [&>svg]:ml-auto [&>svg]:h-4 [&>svg]:w-4 [&>svg]:opacity-70">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border shadow-lg">
                  {mockLanguages.map((lang) => (
                    <SelectItem
                      key={lang.code}
                      value={lang.code}
                      className="cursor-pointer hover:bg-muted transition-colors focus:bg-muted"
                    >
                      {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Divider */}
            <div className="border-t" />

            {/* Preferred languages */}
            <div>
              <p className="text-sm font-medium mb-3">Preferred languages</p>
              <p className="text-xs text-muted-foreground mb-3">
                Select languages for content in your feed
              </p>
              <div className="border rounded-xl divide-y overflow-hidden">
                {preferredLanguageOptions.map((lang) => {
                  const isSelected = preferredLanguages.includes(lang.code);
                  return (
                    <button
                      key={lang.code}
                      onClick={() => togglePreferredLanguage(lang.code)}
                      className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted/50 transition-colors text-left"
                    >
                      <span className="text-sm">{lang.name}</span>
                      <span
                        className={cn(
                          "h-5 w-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all",
                          isSelected
                            ? "bg-primary border-primary text-primary-foreground"
                            : "border-muted-foreground/30"
                        )}
                      >
                        {isSelected && <Check className="h-3.5 w-3.5" />}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Save button */}
            <div className="flex justify-end items-center gap-3">
              <Button
                onClick={savePreferences}
                className="rounded-full px-8 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {prefSaved ? "Saved preferences" : "Save preferences"}
              </Button>
            </div>
          </div>
        </div>

        {/* Settings & More Section — visible on mobile only; web screen uses sidebar links */}
        <div className="mb-6 rounded-xl border shadow-sm overflow-hidden md:hidden">
          {[
            { href: "/settings", icon: Settings, label: "Settings", desc: "App preferences" },
            { href: "/donate", icon: Heart, label: "Donate", desc: "Support the platform" },
            { href: "/help", icon: HelpCircle, label: "Help & Support", desc: "Get help, guidelines" },
            { href: "/more", icon: MoreHorizontal, label: "More", desc: "About, feedback & more" },
          ].map(({ href, icon: Icon, label, desc }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center justify-between px-4 py-3.5 hover:bg-muted/50 transition-colors group border-b last:border-0"
            >
              <div className="flex items-center gap-3">
                <Icon className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                <div>
                  <p className="text-sm font-medium">{label}</p>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all flex-shrink-0" />
            </Link>
          ))}
        </div>

        {/* Channel Preference Card */}
        <div className="rounded-xl border shadow-sm overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-3 bg-muted/30 border-b">
            <Tv className="h-4 w-4 text-primary" />
            <h2 className="font-semibold text-sm">Channel preference</h2>
          </div>
          <Link
            href="/channels"
            className="flex items-center justify-between px-4 py-3.5 hover:bg-muted/50 transition-colors group"
          >
            <div>
              <p className="text-sm font-medium">Manage channels</p>
              <p className="text-xs text-muted-foreground">Customise your channel feed</p>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all flex-shrink-0" />
          </Link>
        </div>
      </div>

      {/* Sign Out Dialog */}
      <Dialog open={showSignOutDialog} onOpenChange={setShowSignOutDialog}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Sign out</DialogTitle>
            <DialogDescription>
              Are you sure you want to sign out? Your preferences will be saved.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 mt-2">
            <Button
              variant="outline"
              onClick={() => setShowSignOutDialog(false)}
              className="flex-1 rounded-full"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleSignOut}
              className="flex-1 rounded-full"
            >
              <LogOut className="h-4 w-4 mr-2" /> Sign out
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
