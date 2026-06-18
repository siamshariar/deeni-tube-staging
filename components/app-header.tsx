"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Search, Bell, Menu, Mic, ArrowLeft, X, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import AccountDropdown from "@/components/account-dropdown";
import MobileSidebar from "@/components/mobile-sidebar";

export default function AppHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [showMobileSearch, setShowMobileSearch] = useState(false);
  const [mobileSearchQuery, setMobileSearchQuery] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [authLoaded, setAuthLoaded] = useState(false);

  useEffect(() => {
    try {
      const prefs = localStorage.getItem("deeni-language-prefs");
      if (prefs) {
        const parsed = JSON.parse(prefs);
        setIsLoggedIn(!parsed.isGuest);
      } else {
        setIsLoggedIn(false);
      }
    } catch {
      setIsLoggedIn(false);
    }
    const timer = setTimeout(() => setAuthLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleMobileSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mobileSearchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(mobileSearchQuery.trim())}`);
      setShowMobileSearch(false);
      setMobileSearchQuery("");
    }
  };

  // ✅ Now also show hamburger on playlist pages
  const showDesktopHamburger =
    pathname === "/shorts" ||
    pathname.startsWith("/videos/") ||
    pathname.startsWith("/playlists");

  return (
    <>
      {/* Mobile Header */}
      <header className="md:hidden fixed top-0 left-0 right-0 bg-background z-30 border-b w-full max-w-[100vw]">
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
          <div className="flex items-center justify-between px-4 py-2 w-full">
            <div className="flex items-center gap-3 min-w-0">
              <button onClick={() => setMobileSidebarOpen(true)} className="flex items-center justify-center h-9 w-9 rounded-full hover:bg-muted transition-colors flex-shrink-0" type="button">
                <Menu className="h-5 w-5" />
              </button>
              <Link href="/" className="flex-shrink-0">
                <Image 
                  src="/DeeniTubeLogo.png" 
                  alt="Deeni.tube" 
                  width={90} 
                  height={24} 
                  className="h-6 w-auto" 
                  priority
                />
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
          </div>
        )}
      </header>

      {/* Desktop Header */}
      <header className="hidden md:flex fixed top-0 left-0 right-0 items-center justify-between px-4 py-2 border-b bg-background z-30 w-full max-w-[100vw]">
        <div className="flex items-center gap-4 flex-shrink-0">
          {showDesktopHamburger && (
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="flex items-center justify-center h-9 w-9 rounded-full hover:bg-muted transition-colors"
              type="button"
              aria-label="Menu"
            >
              <Menu className="h-5 w-5" />
            </button>
          )}
          <Link href="/">
            <Image 
              src="/DeeniTubeLogo.png" 
              alt="Deeni.tube" 
              width={120} 
              height={30} 
              className="h-7 w-auto" 
              priority
            />
          </Link>
        </div>

        <div className="flex-1 max-w-[720px] mx-4 min-w-0">
          <form onSubmit={(e) => e.preventDefault()} className="flex items-center">
            <div className="relative flex-1 min-w-0">
              <input 
                type="text" 
                placeholder="Search" 
                className="w-full h-10 py-2 px-4 rounded-l-full border border-r-0 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-background text-foreground" 
              />
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

        <div className="flex items-center gap-4 flex-shrink-0">
          <Button variant="ghost" size="icon" className="rounded-full">
            <Bell className="w-5 h-5" />
          </Button>
          {!authLoaded ? (
            <div className="h-9 w-9 rounded-full bg-muted animate-pulse" />
          ) : isLoggedIn ? (
            <AccountDropdown />
          ) : (
            <Link href="/signin">
              <Button variant="outline" className="rounded-full flex items-center gap-2 h-9 text-sm px-4 text-primary border-primary/50 hover:bg-primary/10">
                <UserCircle className="h-5 w-5" />
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </header>

      <MobileSidebar isOpen={mobileSidebarOpen} onClose={() => setMobileSidebarOpen(false)} />
    </>
  );
}