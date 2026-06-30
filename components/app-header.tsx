// components/app-header.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  Search,
  Mic,
  ArrowLeft,
  X,
  UserCircle,
  History,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import AccountDropdown from "@/components/account-dropdown";
import NotificationDropdown from "@/components/notification-dropdown";
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
        const parsed = JSON.parse(stored);
        setRecentSearches(Array.isArray(parsed) ? parsed : []);
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

  const handleMobileSearchClick = () => {
    router.push("/search");
  };

  const handleDesktopSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (desktopSearchQuery.trim()) {
      // Save to recent searches
      try {
        const stored = localStorage.getItem("recentSearches");
        let searches: string[] = stored ? JSON.parse(stored) : [];
        if (!Array.isArray(searches)) searches = [];
        searches = [desktopSearchQuery.trim(), ...searches.filter(s => s !== desktopSearchQuery.trim())].slice(0, 8);
        localStorage.setItem("recentSearches", JSON.stringify(searches));
      } catch {}

      router.push(`/search?q=${encodeURIComponent(desktopSearchQuery.trim())}`);
      setShowDesktopRecent(false);
    }
  };

  const handleRecentClick = (search: string) => {
    setDesktopSearchQuery(search);
    setShowDesktopRecent(false);
    // Move clicked search to top
    try {
      const stored = localStorage.getItem("recentSearches");
      let searches: string[] = stored ? JSON.parse(stored) : [];
      if (!Array.isArray(searches)) searches = [];
      searches = [search, ...searches.filter(s => s !== search)].slice(0, 8);
      localStorage.setItem("recentSearches", JSON.stringify(searches));
    } catch {}

    router.push(`/search?q=${encodeURIComponent(search)}`);
  };

  const removeRecent = (search: string) => {
    const updated = recentSearches.filter(s => s !== search);
    setRecentSearches(updated);
    try {
      localStorage.setItem("recentSearches", JSON.stringify(updated));
    } catch {}
  };

  const clearRecent = () => {
    setRecentSearches([]);
    try {
      localStorage.removeItem("recentSearches");
    } catch {}
  };

  // Toggle sidebar collapse/expand - ONLY called by hamburger click
  const toggleSidebar = () => {
    // Call the sidebar's internal toggle function
    if (typeof window !== 'undefined' && (window as any).__sidebarToggle) {
      (window as any).__sidebarToggle();
      
      // Update main content margin after a small delay to let sidebar update
      setTimeout(() => {
        const sidebar = document.querySelector('aside');
        const main = document.querySelector('main');
        if (sidebar && main) {
          if (sidebar.classList.contains('w-[72px]')) {
            main.classList.remove('md:pl-[240px]');
            main.classList.add('md:pl-[72px]');
          } else {
            main.classList.remove('md:pl-[72px]');
            main.classList.add('md:pl-[240px]');
          }
        }
      }, 50);
    }
  };

  // Open mobile sidebar (used for pages where desktop sidebar is hidden)
  const openMobileSidebar = () => {
    setMobileSidebarOpen(true);
  };

  // Check if current page has desktop sidebar
  const hasDesktopSidebar = !(
    pathname?.startsWith("/videos/") ||
    pathname?.startsWith("/playlists/") ||
    pathname === "/shorts" ||
    pathname === "/signin"
  );

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
      {/* Mobile Header - z-40 to stay above mobile sidebar (z-30) */}
      <header
        className={cn(
          "md:hidden fixed top-0 left-0 right-0 bg-background z-40 w-full max-w-[100vw] transition-transform duration-300 ease-in-out",
          !headerVisible && "-translate-y-full"
        )}
      >
        <div className="flex items-center justify-between px-2 py-2 w-full">
          <div className="flex items-center gap-3 min-w-0">
            <button onClick={() => setMobileSidebarOpen(true)} className="flex items-center justify-center h-9 w-9 rounded-full hover:bg-muted transition-colors flex-shrink-0" type="button">
              <Menu className="h-5 w-5" />
            </button>
            <Link href="/" className="flex-shrink-0">
              <Image src="/DeeniTubeLogo.png" alt="Deeni.tube" width={90} height={24} className="h-6 w-auto" priority />
            </Link>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <Button variant="ghost" size="icon" className="rounded-full" onClick={handleMobileSearchClick}>
              <Search className="h-5 w-5" />
            </Button>
            <NotificationDropdown />
            <UserArea />
          </div>
        </div>
      </header>

      {/* Desktop Header */}
      <header
        className={cn(
          "hidden md:flex fixed top-0 left-0 right-0 bg-background z-40 w-full max-w-[100vw] flex-col transition-transform duration-300 ease-in-out",
          !headerVisible && "-translate-y-full"
        )}
      >
        <div className="flex items-center justify-between px-4 py-2 border-b">
          <div className="flex items-center gap-4 flex-shrink-0">
            {/* Hamburger button - behavior changes based on page */}
            <button 
              onClick={hasDesktopSidebar ? toggleSidebar : openMobileSidebar} 
              className="flex items-center justify-center h-9 w-9 rounded-full hover:bg-muted transition-colors" 
              type="button" 
              aria-label={hasDesktopSidebar ? "Toggle sidebar" : "Open menu"}
            >
              <Menu className="h-5 w-5" />
            </button>
            
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

          <div className="flex items-center gap-8 flex-shrink-0">
            <NotificationDropdown />
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