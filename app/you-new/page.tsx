// app/you-new/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Globe, Tv, LogOut, Check, ChevronRight } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from "@/components/ui/drawer";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import AppHeader from "@/components/app-header";
import Link from "next/link";
import MobileNav from "@/components/mobile-nav";
import DesktopSidebar from "@/components/desktop-sidebar";
import { mockLanguages } from "@/lib/mock-data";
import { toast } from "sonner";

const preferredLanguageOptions = mockLanguages.filter((l) => l.code !== "en");

export default function YouPage() {
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [userName, setUserName] = useState("User Name");
  const [userEmail, setUserEmail] = useState("user@example.com");
  const [userInitials, setUserInitials] = useState("UN");
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
    toast.success("Preferences saved successfully!");
  };

  const togglePreferredLanguage = (code: string) => {
    setPreferredLanguages((prev) =>
      prev.includes(code) ? prev.filter((l) => l !== code) : [...prev, code]
    );
  };

  const handleSignOut = () => {
    localStorage.removeItem("deeni-user-data");
    localStorage.removeItem("deeni-lang-prefs");
    router.push("/signin");
  };

  // ── Skeleton loading ─────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader />
        <div className="flex">
          <DesktopSidebar className="hidden md:block" />
          <main className="flex-1 md:pl-[240px] pt-[56px] md:pt-[80px] pb-nav-safe md:pb-6">
            <div className="md:hidden flex items-center gap-2 px-4 py-3 border-b sticky top-[56px] bg-background z-10">
              <Skeleton className="h-9 w-9 rounded-full" />
              <Skeleton className="h-6 w-16" />
            </div>
            <div className="px-4 md:px-6 py-4 md:py-6">
              <div className="hidden md:block mb-6">
                <Skeleton className="h-8 w-32 mb-2" />
                <Skeleton className="h-4 w-64" />
              </div>
              <div className="mb-6 rounded-xl border p-4 flex items-center gap-4">
                <Skeleton className="h-14 w-14 md:h-16 md:w-16 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <Skeleton className="h-9 w-28 rounded-full" />
              </div>
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
          </main>
        </div>
        <MobileNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <div className="flex">
        <DesktopSidebar className="hidden md:block" />
        <main className="flex-1 md:pl-[240px] pt-[56px] md:pt-[80px] pb-nav-safe md:pb-6">
          {/* Mobile header */}
          <div className="md:hidden flex items-center gap-2 px-4 py-3 border-b sticky top-[56px] bg-background z-10">
            <button
              onClick={() => router.back()}
              className="flex items-center justify-center h-9 w-9 rounded-full hover:bg-muted flex-shrink-0 -ml-1"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="font-semibold text-lg">You</h1>
          </div>

          <div className="px-4 md:px-6 py-4 md:py-6">
            {/* Page header – desktop only */}
            {!isMobile && (
              <div className="mb-6">
                <h1 className="text-2xl font-bold">You</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Manage your profile and preferences
                </p>
              </div>
            )}

            {/* User Profile Card */}
            <div className="mb-6 rounded-xl border shadow-sm overflow-hidden">
              <div className="p-4 flex items-center gap-4">
                <Avatar className="h-14 w-14 md:h-16 md:w-16 ring-2 ring-primary/10">
                  <AvatarFallback className="text-lg font-semibold bg-primary/10 text-primary">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-base">{userName}</p>
                  <p className="text-sm text-muted-foreground truncate">{userEmail}</p>
                  <button
                    onClick={() => setShowSignOutDialog(true)}
                    className="mt-1.5 flex items-center gap-1.5 text-sm text-red-500 dark:text-red-400 hover:text-red-600 dark:hover:text-red-300 transition-colors font-medium"
                  >
                    <LogOut className="h-4 w-4" /> Sign out
                  </button>
                </div>
                <Button variant="outline" size="sm" className="rounded-full flex-shrink-0" asChild>
                  <Link href={`/channel/${userName}`}>View channel</Link>
                </Button>
              </div>
            </div>

            {/* Language Preference Card */}
            <div className="mb-6 rounded-xl border shadow-sm overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 bg-muted/30 border-b">
                <Globe className="h-4 w-4 text-primary" />
                <h2 className="font-semibold text-sm">Language preference</h2>
              </div>
              <div className="p-4 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
                  <div>
                    <p className="text-sm font-medium">Default language</p>
                    <p className="text-xs text-muted-foreground">Used across the app</p>
                  </div>
                  <div className="w-full sm:w-auto">
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
                </div>

                {/* Preferred languages – always shown as checkbox list (no drawer) */}
                <div>
                  <p className="text-sm font-medium mb-3">Preferred languages</p>
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
                  <p className="text-xs text-muted-foreground mt-2">
                    Content shown in selected languages will appear in your feed
                  </p>
                </div>

                {/* Save button – larger on desktop, full width on mobile */}
                <div className="flex justify-center sm:justify-start">
                  <Button
                    onClick={savePreferences}
                    className="w-full sm:w-auto rounded-full px-8 py-2.5 text-sm sm:text-base"
                  >
                    Save preferences
                  </Button>
                </div>
              </div>
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
                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors flex-shrink-0" />
              </Link>
            </div>
          </div>
        </main>
      </div>
      <MobileNav />

      {/* Sign Out Dialog */}
      <Dialog open={showSignOutDialog} onOpenChange={setShowSignOutDialog}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Sign out</DialogTitle>
            <DialogDescription>Are you sure you want to sign out?</DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 mt-2">
            <Button variant="outline" onClick={() => setShowSignOutDialog(false)} className="flex-1 rounded-full">
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleSignOut} className="flex-1 rounded-full">
              Sign out
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}