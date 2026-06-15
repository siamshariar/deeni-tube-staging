"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ChevronRight,
  Globe,
  Tv,
  LogOut,
  Check,
  User,
  Settings,
  Clock,
  ThumbsUp,
  History,
  PlaySquare,
  Download,
  Film,
  Clapperboard,
  Music,
  Gamepad2,
  Newspaper,
  Trophy,
  ShoppingBag,
  Lightbulb,
  Podcast,
  ChevronDown,
  Plus,
  Shield,
  HelpCircle,
  MessageSquare,
  Moon,
  Sun,
  Monitor,
  X,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import AppHeader from "@/components/app-header";
import MobileNav from "@/components/mobile-nav";
import DesktopSidebar from "@/components/desktop-sidebar";

// ============= CONSTANTS =============
const languageOptions = [
  { code: "en", name: "English", short: "En" },
  { code: "ar", name: "Arabic", short: "Ar" },
  { code: "hi", name: "Hindi", short: "Hi" },
  { code: "bn", name: "Bengali", short: "Bn" },
  { code: "ur", name: "Urdu", short: "Ur" },
  { code: "tr", name: "Turkish", short: "Tr" },
  { code: "es", name: "Spanish", short: "Es" },
  { code: "fr", name: "French", short: "Fr" },
  { code: "id", name: "Indonesian", short: "Id" },
  { code: "ms", name: "Malay", short: "Ms" },
];

const preferredLanguageOptions = [
  { code: "ar", name: "Arabic" },
  { code: "hi", name: "Hindi" },
  { code: "bn", name: "Bengali" },
  { code: "ur", name: "Urdu" },
  { code: "tr", name: "Turkish" },
  { code: "id", name: "Indonesian" },
  { code: "ms", name: "Malay" },
  { code: "fr", name: "French" },
  { code: "es", name: "Spanish" },
];

const accountSections = [
  { icon: User, label: "Your channel", description: "View your channel", href: "/channel/me" },
  { icon: Clock, label: "History", description: "View your watch history", href: "/feed/history" },
  { icon: PlaySquare, label: "Your videos", description: "View your uploaded videos", href: "/channel/me/videos" },
  { icon: Download, label: "Downloads", description: "View downloaded videos", href: "/feed/downloads" },
  { icon: ThumbsUp, label: "Liked videos", description: "View your liked videos", href: "/playlist/liked" },
  { icon: Film, label: "Your movies", description: "View purchased movies", href: "/channel/me/movies" },
  { icon: Clock, label: "Watch later", description: "Videos you saved for later", href: "/playlist/watch-later" },
];

const subscriptionCategories = [
  { icon: Clapperboard, label: "All subscriptions", href: "/subscriptions-new" },
  { icon: Music, label: "Music", href: "/subscriptions/music" },
  { icon: Gamepad2, label: "Gaming", href: "/subscriptions/gaming" },
  { icon: Newspaper, label: "News", href: "/subscriptions/news" },
  { icon: Trophy, label: "Sports", href: "/subscriptions/sports" },
  { icon: ShoppingBag, label: "Fashion & Beauty", href: "/subscriptions/fashion" },
  { icon: Lightbulb, label: "Learning", href: "/subscriptions/learning" },
  { icon: Podcast, label: "Podcasts", href: "/subscriptions/podcasts" },
];

type ThemeMode = "light" | "dark" | "system";

function applyTheme(theme: ThemeMode) {
  const root = document.documentElement;
  const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  if (theme === "dark") root.classList.add("dark");
  else if (theme === "light") root.classList.remove("dark");
  else {
    if (systemDark) root.classList.add("dark");
    else root.classList.remove("dark");
  }
}

function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 2000);
    return () => clearTimeout(timer);
  }, [onClose]);
  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-2 fade-in duration-200">
      <div className="bg-foreground text-background px-4 py-2 rounded-full shadow-lg text-sm font-medium flex items-center gap-2">
        <Check className="h-4 w-4" />
        {message}
      </div>
    </div>
  );
}

export default function YouPage() {
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 768px)");

  const [userName, setUserName] = useState("User Name");
  const [userEmail, setUserEmail] = useState("user@example.com");
  const [userInitials, setUserInitials] = useState("UN");
  const [userAvatar, setUserAvatar] = useState("");

  const [defaultLanguage, setDefaultLanguage] = useState("en");
  const [preferredLanguages, setPreferredLanguages] = useState<string[]>(["ar", "hi", "bn"]);
  const [theme, setTheme] = useState<ThemeMode>("system");
  const [hasSeenPopup, setHasSeenPopup] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [languageDrawerOpen, setLanguageDrawerOpen] = useState(false);
  const [showSignOutDialog, setShowSignOutDialog] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const userDataRaw = localStorage.getItem("deeni-user-data");
    if (userDataRaw) {
      try {
        const userData = JSON.parse(userDataRaw);
        setUserName(userData.name || "User Name");
        setUserEmail(userData.email || "user@example.com");
        setUserInitials(userData.initials || userData.name?.slice(0, 2).toUpperCase() || "UN");
        setUserAvatar(userData.avatar || "");
      } catch {}
    }

    const savedPrefs = localStorage.getItem("youPagePreferences");
    if (savedPrefs) {
      try {
        const prefs = JSON.parse(savedPrefs);
        if (prefs.defaultLanguage) setDefaultLanguage(prefs.defaultLanguage);
        if (prefs.preferredLanguages) setPreferredLanguages(prefs.preferredLanguages);
        if (prefs.theme) setTheme(prefs.theme);
        setHasSeenPopup(true);
      } catch {}
    }

    const mainLangPrefs = localStorage.getItem("deeni-language-prefs");
    if (mainLangPrefs) {
      try {
        const parsed = JSON.parse(mainLangPrefs);
        if (parsed.languages && parsed.languages.length) {
          setPreferredLanguages(parsed.languages);
        }
      } catch {}
    }

    applyTheme(theme);
  }, []);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  useEffect(() => {
    if (theme !== "system") return;
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => applyTheme("system");
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, [theme]);

  const savePreferences = useCallback(() => {
    const prefs = { defaultLanguage, preferredLanguages, theme };
    localStorage.setItem("youPagePreferences", JSON.stringify(prefs));
    localStorage.setItem("deeni-language-prefs", JSON.stringify({
      languages: preferredLanguages,
      hasSelected: true,
      isGuest: false,
    }));
    setToastMessage("Preferences saved");
  }, [defaultLanguage, preferredLanguages, theme]);

  const togglePreferredLanguage = useCallback((code: string) => {
    setPreferredLanguages((prev) =>
      prev.includes(code) ? prev.filter((l) => l !== code) : [...prev, code]
    );
  }, []);

  const handleSignOut = useCallback(() => {
    localStorage.removeItem("deeni-user-data");
    localStorage.removeItem("deeni-language-prefs");
    localStorage.removeItem("youPagePreferences");
    router.push("/signin");
  }, [router]);

  useEffect(() => {
    const hasPrefs = localStorage.getItem("youPagePreferences") !== null;
    if (!hasPrefs && !hasSeenPopup) {
      const timer = setTimeout(() => setHasSeenPopup(true), 100);
      return () => clearTimeout(timer);
    }
  }, [hasSeenPopup]);

  const closeFirstTimePopup = useCallback(() => {
    setHasSeenPopup(false);
    savePreferences();
  }, [savePreferences]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <AppHeader />
        <div className="flex">
          <DesktopSidebar className="hidden md:block" />
          <main className="flex-1 md:pl-[240px] pt-[56px] md:pt-[80px] pb-nav-safe md:pb-6">
            <div className="max-w-2xl mx-auto p-4 md:p-6">
              <Skeleton className="h-8 w-40 mb-6" />
              <Skeleton className="h-24 w-full rounded-xl mb-4" />
              <Skeleton className="h-48 w-full rounded-xl mb-4" />
              <Skeleton className="h-32 w-full rounded-xl mb-4" />
              <Skeleton className="h-40 w-full rounded-xl" />
            </div>
          </main>
        </div>
        <MobileNav />
      </div>
    );
  }

  const languageDrawerContent = (
    <div className="p-4 space-y-2 pb-8">
      <p className="text-sm text-muted-foreground mb-3">Select your preferred languages to personalise your content</p>
      <div className="border rounded-lg divide-y">
        {preferredLanguageOptions.map((lang) => {
          const isSelected = preferredLanguages.includes(lang.code);
          return (
            <button
              key={lang.code}
              onClick={() => togglePreferredLanguage(lang.code)}
              className="w-full flex items-center justify-between px-4 py-3.5 hover:bg-muted/50 transition-colors text-left"
              aria-pressed={isSelected}
            >
              <span className="text-sm font-medium">{lang.name}</span>
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
      <Button className="w-full mt-4" onClick={() => setLanguageDrawerOpen(false)}>Done</Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* First-time popup */}
      <Dialog open={!localStorage.getItem("youPagePreferences") && hasSeenPopup} onOpenChange={(open) => !open && closeFirstTimePopup()}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Globe className="h-5 w-5 text-primary" /> Language Preference</DialogTitle>
            <DialogDescription>Select your preferred languages to personalise your content feed</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="border rounded-lg divide-y max-h-96 overflow-y-auto">
              {preferredLanguageOptions.map((lang) => {
                const isSelected = preferredLanguages.includes(lang.code);
                return (
                  <button
                    key={lang.code}
                    onClick={() => togglePreferredLanguage(lang.code)}
                    className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted/50 transition-colors"
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
            <Button className="w-full" onClick={closeFirstTimePopup}>Continue</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Sign out confirmation */}
      <Dialog open={showSignOutDialog} onOpenChange={setShowSignOutDialog}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader><DialogTitle>Sign out</DialogTitle><DialogDescription>Are you sure you want to sign out? You will need to sign in again to access your preferences.</DialogDescription></DialogHeader>
          <div className="flex gap-3 mt-2"><Button variant="outline" onClick={() => setShowSignOutDialog(false)} className="flex-1">Cancel</Button><Button variant="destructive" onClick={handleSignOut} className="flex-1">Sign out</Button></div>
        </DialogContent>
      </Dialog>

      {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage("")} />}

      <AppHeader />
      <div className="flex">
        <DesktopSidebar className="hidden md:block" />
        <main className="flex-1 md:pl-[240px] pt-[56px] md:pt-[80px] pb-nav-safe md:pb-6">
          <div className="md:hidden flex items-center gap-3 px-4 py-3 border-b sticky top-[56px] bg-background z-10">
            <button onClick={() => router.back()} className="flex items-center justify-center h-9 w-9 rounded-full hover:bg-muted"><ArrowLeft className="h-5 w-5" /></button>
            <h1 className="font-semibold text-lg">You</h1>
          </div>

          <div className="max-w-2xl mx-auto p-4 md:p-6">
            {/* User Profile Section */}
            <div className="mb-4">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-card border shadow-sm">
                <Avatar className="h-14 w-14 md:h-16 md:w-16 ring-2 ring-primary/10"><AvatarImage src={userAvatar} /><AvatarFallback className="text-lg font-semibold bg-primary/10 text-primary">{userInitials}</AvatarFallback></Avatar>
                <div className="flex-1 min-w-0"><p className="font-semibold text-base">{userName}</p><p className="text-sm text-muted-foreground truncate">{userEmail}</p><button onClick={() => setShowSignOutDialog(true)} className="mt-1.5 flex items-center gap-1.5 text-sm text-destructive hover:text-destructive/80"><LogOut className="h-4 w-4" /> Sign out</button></div>
                <Link href="/channel/me"><Button variant="outline" size="sm" className="rounded-full">View channel</Button></Link>
              </div>
            </div>

            {/* Account Sections Grid */}
            <div className="mb-4 rounded-xl border overflow-hidden shadow-sm">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 divide-x divide-y">
                {accountSections.map((section, idx) => (
                  <Link key={idx} href={section.href} className="flex flex-col items-center justify-center gap-2 p-4 hover:bg-muted/50 transition-colors text-center group">
                    <section.icon className="h-6 w-6 text-muted-foreground group-hover:text-foreground transition-colors" />
                    <span className="text-xs font-medium">{section.label}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Subscriptions Categories */}
            <div className="mb-4 rounded-xl border overflow-hidden shadow-sm">
              <div className="px-4 py-3 bg-muted/30 border-b"><h2 className="font-semibold text-sm">Subscriptions</h2></div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 divide-x divide-y">
                {subscriptionCategories.map((category, idx) => (
                  <Link key={idx} href={category.href} className="flex flex-col items-center justify-center gap-2 p-4 hover:bg-muted/50 transition-colors text-center group">
                    <category.icon className="h-6 w-6 text-muted-foreground group-hover:text-foreground transition-colors" />
                    <span className="text-xs font-medium">{category.label}</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Language Preference Section */}
            <div className="mb-4 rounded-xl border overflow-hidden shadow-sm">
              <div className="flex items-center gap-2 px-4 py-3 bg-muted/30 border-b"><Globe className="h-4 w-4 text-primary" /><h2 className="font-semibold text-sm">Language preference</h2></div>
              <div className="p-4 space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <div><p className="text-sm font-medium">Default language</p><p className="text-xs text-muted-foreground">Used across the app</p></div>
                  <Select value={defaultLanguage} onValueChange={setDefaultLanguage}>
                    <SelectTrigger className="w-36 h-9 text-sm"><SelectValue /></SelectTrigger>
                    <SelectContent>{languageOptions.map((lang) => <SelectItem key={lang.code} value={lang.code}>{lang.short} - {lang.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div>
                  {isMobile ? (
                    <Drawer open={languageDrawerOpen} onOpenChange={setLanguageDrawerOpen}>
                      <DrawerTrigger asChild><button className="w-full flex items-center justify-between py-2 hover:bg-muted/50 rounded-lg px-2"><div><p className="text-sm font-medium">Preferred languages</p><p className="text-xs text-muted-foreground">{preferredLanguages.length} selected</p></div><ChevronRight className="h-4 w-4 text-muted-foreground" /></button></DrawerTrigger>
                      <DrawerContent><DrawerHeader><DrawerTitle>Preferred languages</DrawerTitle></DrawerHeader>{languageDrawerContent}</DrawerContent>
                    </Drawer>
                  ) : (
                    <>
                      <p className="text-sm font-medium mb-3">Preferred languages</p>
                      <div className="border rounded-lg divide-y">
                        {preferredLanguageOptions.map((lang) => {
                          const isSelected = preferredLanguages.includes(lang.code);
                          return (
                            <button key={lang.code} onClick={() => togglePreferredLanguage(lang.code)} className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted/50 transition-colors text-left" aria-pressed={isSelected}>
                              <span className="text-sm">{lang.name}</span>
                              <span className={cn("h-5 w-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all", isSelected ? "bg-primary border-primary text-primary-foreground" : "border-muted-foreground/30")}>
                                {isSelected && <Check className="h-3.5 w-3.5" />}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </>
                  )}
                  <p className="text-xs text-muted-foreground mt-2">Content shown in selected languages will appear in your feed</p>
                </div>
                <Button onClick={savePreferences} className="w-full">Save preferences</Button>
              </div>
            </div>

            {/* Appearance Section */}
            <div className="mb-4 rounded-xl border overflow-hidden shadow-sm">
              <div className="flex items-center gap-2 px-4 py-3 bg-muted/30 border-b"><Settings className="h-4 w-4 text-primary" /><h2 className="font-semibold text-sm">Appearance</h2></div>
              <div className="p-4">
                <div className="flex items-center gap-3">
                  {(["system", "light", "dark"] as ThemeMode[]).map((mode) => (
                    <button key={mode} onClick={() => setTheme(mode)} className={cn("flex-1 flex flex-col items-center gap-2 p-3 rounded-lg border-2 transition-all", theme === mode ? "border-primary bg-primary/5" : "border-transparent hover:bg-muted/50")} aria-pressed={theme === mode}>
                      {mode === "system" && <Monitor className="h-5 w-5" />}{mode === "light" && <Sun className="h-5 w-5" />}{mode === "dark" && <Moon className="h-5 w-5" />}
                      <span className="text-xs font-medium capitalize">{mode}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Channel Preference Section */}
            <div className="mb-4 rounded-xl border overflow-hidden shadow-sm">
              <div className="flex items-center gap-2 px-4 py-3 bg-muted/30 border-b"><Tv className="h-4 w-4 text-primary" /><h2 className="font-semibold text-sm">Channel preference</h2></div>
              <Link href="/channels" className="flex items-center justify-between px-4 py-3.5 hover:bg-muted/50 transition-colors group"><div><p className="text-sm font-medium">Manage channels</p><p className="text-xs text-muted-foreground">Customise your channel feed</p></div><ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" /></Link>
            </div>

            {/* Help & Feedback */}
            <div className="mb-4 rounded-xl border overflow-hidden shadow-sm">
              <div className="px-4 py-3 bg-muted/30 border-b"><h2 className="font-semibold text-sm">Help & feedback</h2></div>
              <Link href="/help" className="flex items-center justify-between px-4 py-3.5 hover:bg-muted/50 transition-colors group border-b"><div className="flex items-center gap-3"><HelpCircle className="h-5 w-5 text-muted-foreground" /><span className="text-sm">Help centre</span></div><ChevronRight className="h-4 w-4 text-muted-foreground" /></Link>
              <Link href="/feedback" className="flex items-center justify-between px-4 py-3.5 hover:bg-muted/50 transition-colors group"><div className="flex items-center gap-3"><MessageSquare className="h-5 w-5 text-muted-foreground" /><span className="text-sm">Send feedback</span></div><ChevronRight className="h-4 w-4 text-muted-foreground" /></Link>
            </div>

            <div className="text-center py-4"><p className="text-xs text-muted-foreground">Version 1.0.0</p></div>
          </div>
        </main>
      </div>
      <MobileNav />
    </div>
  );
}