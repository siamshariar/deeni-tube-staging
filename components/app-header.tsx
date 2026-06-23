// components/app-header.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  Search,
  Bell,
  Menu,
  Mic,
  ArrowLeft,
  X,
  UserCircle,
  History,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import AccountDropdown from "@/components/account-dropdown";
import MobileSidebar from "@/components/mobile-sidebar";
import { cn } from "@/lib/utils";
import { useHeader } from "@/app/contexts/header-context";

export default function AppHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [mobileSearchQuery, setMobileSearchQuery] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [authLoaded, setAuthLoaded] = useState(false);
  const { headerVisible } = useHeader();

  // Desktop search state
  const [desktopSearchQuery, setDesktopSearchQuery] = useState("");
  const [showDesktopRecent, setShowDesktopRecent] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const desktopSearchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkAuth = () => {
      try {
        const prefs = localStorage.getItem("deeni-lang-prefs");
        if (prefs) {
          const parsed = JSON.parse(prefs);
          setIsLoggedIn(!parsed.isGuest);
        } else {
          setIsLoggedIn(false);
        }
      } catch {
        setIsLoggedIn(false);
      }
      setAuthLoaded(true);
    };

    checkAuth();

    const handleStorage = () => checkAuth();
    window.addEventListener("storage", handleStorage);
    window.addEventListener("auth-changed", handleStorage);
    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("auth-changed", handleStorage);
    };
  }, []);

  // Load recent searches when search input is focused
  const loadRecentSearches = () => {
    try {
      const stored = localStorage.getItem("recentSearches");
      if (stored) {
        setRecentSearches(JSON.parse(stored));
      } else {
        setRecentSearches([]);
      }
    } catch {
      setRecentSearches([]);
    }
  };

  // Close desktop recent searches dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (desktopSearchRef.current && !desktopSearchRef.current.contains(e.target as Node)) {
        setShowDesktopRecent(false);
      }
    };
    if (showDesktopRecent) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showDesktopRecent]);

  const handleMobileSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mobileSearchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(mobileSearchQuery.trim())}`);
      setShowMobileSearch(false);
      setMobileSearchQuery("");
    }
  };

  const handleDesktopSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (desktopSearchQuery.trim()) {
      // Save to recent searches
      const stored = localStorage.getItem("recentSearches");
      let searches: string[] = stored ? JSON.parse(stored) : [];
      searches = [desktopSearchQuery.trim(), ...searches.filter(s => s !== desktopSearchQuery.trim())].slice(0, 8);
      localStorage.setItem("recentSearches", JSON.stringify(searches));

      router.push(`/search?q=${encodeURIComponent(desktopSearchQuery.trim())}`);
      setShowDesktopRecent(false);
    }
  };

  const handleRecentClick = (search: string) => {
    setDesktopSearchQuery(search);
    setShowDesktopRecent(false);
    // Move clicked search to top
    const stored = localStorage.getItem("recentSearches");
    let searches: string[] = stored ? JSON.parse(stored) : [];
    searches = [search, ...searches.filter(s => s !== search)].slice(0, 8);
    localStorage.setItem("recentSearches", JSON.stringify(searches));

    router.push(`/search?q=${encodeURIComponent(search)}`);
  };

  const removeRecent = (search: string) => {
    const updated = recentSearches.filter(s => s !== search);
    setRecentSearches(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));
  };

  const clearRecent = () => {
    setRecentSearches([]);
    localStorage.removeItem("recentSearches");
  };

  const showDesktopHamburger =
    pathname === "/shorts" ||
    pathname.startsWith("/videos/") ||
    (pathname.startsWith("/playlists/") && pathname.split("/").length > 3);

  const UserArea = () => (
    <div className="flex items-center gap-1 flex-shrink-0 min-w-[36px] justify-center">
      {!authLoaded ? (
        <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
      ) : isLoggedIn ? (
        <AccountDropdown />
      ) : (
        <Link href="/signin">
          <Button variant="ghost" size="icon" className="rounded-full">
            <UserCircle className="h-5 w-5" />
          </Button>
        </Link>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile Header */}
      <header
        className={cn(
          "md:hidden fixed top-0 left-0 right-0 bg-background z-30 w-full max-w-[100vw] transition-transform duration-300 ease-in-out",
          !headerVisible && "-translate-y-full"
        )}
      >
        {showMobileSearch ? (
          <div className="flex items-center gap-2 px-3 py-2 w-full">
            <button
              onClick={() => { setShowMobileSearch(false); setMobileSearchQuery("") }}
              className="flex items-center justify-center h-9 w-9 rounded-full hover:bg-muted transition-colors flex-shrink-0"
              type="button"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <form onSubmit={handleMobileSearchSubmit} className="flex-1 flex items-center gap-2 min-w-0">
              <div className="relative flex-1 min-w-0">
                <input
                  type="text"
                  value={mobileSearchQuery}
                  onChange={(e) => setMobileSearchQuery(e.target.value)}
                  placeholder="Search"
                  autoFocus
                  className="w-full h-9 pl-3 pr-8 text-sm rounded-full border bg-muted/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary"
                />
                {mobileSearchQuery && (
                  <button onClick={() => setMobileSearchQuery("")} className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" type="button">
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
              <Button variant="ghost" size="icon" className="rounded-full flex-shrink-0 bg-muted hover:bg-muted/80" type="button">
                <Mic className="h-5 w-5" />
              </Button>
            </form>
          </div>
        ) : (
          <div className="flex items-center justify-between px-2 py-2 w-full">
            <div className="flex items-center gap-3 min-w-0">
              <button onClick={() => setMobileSidebarOpen(true)} className="flex items-center justify-center h-9 w-9 rounded-full hover:bg-muted transition-colors flex-shrink-0" type="button">
                <Menu className="h-5 w-5" />
              </button>
              <Link href="/" className="flex-shrink-0">
                <Image src="/DeeniTubeLogo.png" alt="Deeni.tube" width={90} height={24} className="h-6 w-auto" priority />
              </Link>
            </div>

            <div className="flex items-center gap-1 flex-shrink-0">
              <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setShowMobileSearch(true)}>
                <Search className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Mic className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full">
                <Bell className="h-5 w-5" />
              </Button>
              <UserArea />
            </div>
          </div>
        )}
      </header>

      {/* Desktop Header */}
      <header
        className={cn(
          "hidden md:flex fixed top-0 left-0 right-0 bg-background z-30 w-full max-w-[100vw] flex-col transition-transform duration-300 ease-in-out",
          !headerVisible && "-translate-y-full"
        )}
      >
        <div className="flex items-center justify-between px-4 py-2 border-b">
          <div className="flex items-center gap-4 flex-shrink-0">
            {showDesktopHamburger && (
              <button onClick={() => setMobileSidebarOpen(true)} className="flex items-center justify-center h-9 w-9 rounded-full hover:bg-muted transition-colors" type="button" aria-label="Menu">
                <Menu className="h-5 w-5" />
              </button>
            )}
            <Link href="/">
              <Image src="/DeeniTubeLogo.png" alt="Deeni.tube" width={120} height={30} className="h-7 w-auto" priority />
            </Link>
          </div>

          <div className="flex-1 max-w-[720px] mx-4 min-w-0" ref={desktopSearchRef}>
            <form onSubmit={handleDesktopSearchSubmit} className="flex items-center">
              <div className="relative flex-1 min-w-0">
                <input
                  type="text"
                  placeholder="Search"
                  value={desktopSearchQuery}
                  onChange={(e) => setDesktopSearchQuery(e.target.value)}
                  onFocus={() => { loadRecentSearches(); setShowDesktopRecent(true); }}
                  onClick={() => { loadRecentSearches(); setShowDesktopRecent(true); }}
                  className="w-full h-10 py-2 px-4 rounded-l-full border border-r-0 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-background text-foreground"
                />
                {desktopSearchQuery && (
                  <button
                    onClick={() => setDesktopSearchQuery("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    type="button"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}

                {/* Recent searches dropdown */}
                {showDesktopRecent && recentSearches.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-popover border rounded-xl shadow-lg z-50 overflow-hidden">
                    <div className="flex items-center justify-between px-4 py-2 border-b">
                      <span className="text-xs font-medium text-muted-foreground">Recent searches</span>
                      <button
                        onClick={clearRecent}
                        className="text-xs text-primary hover:underline"
                      >
                        Clear all
                      </button>
                    </div>
                    <div className="max-h-64 overflow-y-auto">
                      {recentSearches.map((search) => (
                        <button
                          key={search}
                          onClick={() => handleRecentClick(search)}
                          className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-muted transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <History className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-left truncate">{search}</span>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeRecent(search);
                            }}
                            className="p-1 rounded-full hover:bg-muted/80 text-muted-foreground hover:text-foreground"
                          >
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <Button
                variant="secondary"
                size="icon"
                className="rounded-r-full h-10 border border-l-0 bg-muted hover:bg-muted/80 flex-shrink-0"
                type="submit"
              >
                <Search className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="rounded-full ml-2 bg-muted hover:bg-muted/80 flex-shrink-0">
                <Mic className="w-5 h-5" />
              </Button>
            </form>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <Button variant="ghost" size="icon" className="rounded-full">
              <Bell className="w-5 h-5" />
            </Button>
            <div className="flex items-center justify-end">
              {!authLoaded ? (
                <div className="h-9 w-9 rounded-full bg-muted animate-pulse" />
              ) : isLoggedIn ? (
                <AccountDropdown />
              ) : (
                <Link href="/signin">
                  <Button variant="outline" className="rounded-full flex items-center gap-2 h-9 text-sm px-4 text-primary border-primary/50 hover:bg-primary/10">
                    <UserCircle className="h-5 w-5" />
                    <span>Sign In</span>
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </header>

      <MobileSidebar isOpen={mobileSidebarOpen} onClose={() => setMobileSidebarOpen(false)} />
    </>
  );
}