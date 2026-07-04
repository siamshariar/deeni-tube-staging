// components/mobile-sidebar.tsx
"use client";

import type React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Menu,
  Users,
  GraduationCap,
  History,
  // Clock,    // Watch Later — hidden, keep for easy re-enable
  // ThumbsUp, // Liked Videos — hidden, keep for easy re-enable
  Settings,
  HelpCircle,
  LayoutGrid,
  ChevronDown,
  ChevronUp,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { channelData } from "@/lib/channel-data";
import { scholarData } from "@/lib/scholar-data";
import { SidebarExpandedContent } from "@/components/sidebar-expanded-content";

// Mirrors mobile-nav.tsx visibility logic so the drawer knows whether
// the bottom bar is currently rendered on this page.
const DETAIL_PATTERNS = ["/videos/", "/shorts", "/channels/", "/scholars/", "/categories/", "/playlists/", "/more/", "/help/"];
const LIST_PAGES      = ["/channels", "/scholars", "/categories", "/playlists"];

function bottomNavIsVisible(pathname: string | null): boolean {
  if (!pathname) return true;
  return !DETAIL_PATTERNS.some((p) => pathname.startsWith(p) && !LIST_PAGES.includes(pathname));
}

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function MobileSidebar({ isOpen, onClose }: MobileSidebarProps) {
  const pathname = usePathname();
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isVisible, setIsVisible] = useState(isOpen);
  // State for the expandable channel/scholar lists used in the "bottom nav
  // visible" mode.  The shared SidebarExpandedContent manages its own
  // equivalent state internally via the props below.
  const [showMoreChannels, setShowMoreChannels] = useState(false);
  const [showMoreScholars, setShowMoreScholars] = useState(false);

  // true  → bottom nav is showing  → avoid duplicating its items here
  // false → bottom nav is hidden   → show full desktop-identical sidebar
  const showingBottomNav = bottomNavIsVisible(pathname);

  const visibleChannels = channelData.slice(0, 7);
  const hiddenChannels  = channelData.slice(7);
  const visibleScholars = scholarData.slice(0, 7);
  const hiddenScholars  = scholarData.slice(7);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      requestAnimationFrame(() => setIsVisible(true));
      return;
    }
    setIsVisible(false);
    const t = setTimeout(() => setShouldRender(false), 300);
    return () => clearTimeout(t);
  }, [isOpen]);

  if (!shouldRender) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ease-in-out",
          isVisible ? "opacity-100" : "opacity-0"
        )}
        onClick={onClose}
      />

      {/* Drawer panel */}
      <div
        className={cn(
          "fixed top-0 left-0 bottom-0 w-[280px] bg-background z-50 shadow-xl",
          "transform transition-transform duration-[400ms] ease-in-out flex flex-col overflow-hidden",
          isVisible ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* ── Header ────────────────────────────────────────────────── */}
        <div className="flex items-center gap-4 px-4 py-3 border-b bg-background flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="flex items-center justify-center h-9 w-9 rounded-full hover:bg-muted transition-colors"
            aria-label="Close sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>
          <Link href="/" onClick={onClose}>
            <Image src="/DeeniTubeLogo.png" alt="Deeni.tube" width={100} height={24} className="h-6 w-auto" />
          </Link>
        </div>

        {/* ── Scrollable content ─────────────────────────────────────── */}
        <div
          className="flex-1 overflow-y-auto overflow-x-hidden sidebar-scrollbar"
          // When the bottom bar is showing, pad enough so the footer clears it.
          style={showingBottomNav
            ? { paddingBottom: "calc(56px + env(safe-area-inset-bottom, 0px))" }
            : undefined}
        >

          {!showingBottomNav ? (
            // ── BOTTOM NAV HIDDEN ──────────────────────────────────────────────
            // Render the exact same content as the desktop full sidebar.
            // SidebarExpandedContent is the single source of truth for this tree.
            <div className="py-1.5">
              <SidebarExpandedContent
                pathname={pathname}
                showMoreChannels={showMoreChannels}
                setShowMoreChannels={setShowMoreChannels}
                showMoreScholars={showMoreScholars}
                setShowMoreScholars={setShowMoreScholars}
                onLinkClick={onClose}
              />
            </div>
          ) : (
            // ── BOTTOM NAV VISIBLE ─────────────────────────────────────────────
            // Show only items that are NOT already in the bottom navigation to
            // avoid duplicating Home, Shorts, Categories, Playlists, Your Account.
            <>
              {/* Channels — full avatar list */}
              <div className="py-2">
                <Link
                  href="/channels"
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-4 px-4 py-2 text-sm hover:bg-muted transition-colors",
                    (pathname === "/channels" || pathname?.startsWith("/channels/")) && "font-semibold bg-muted"
                  )}
                >
                  <Users className="h-5 w-5 flex-shrink-0" />
                  <span className="flex-1">Channels</span>
                  <ChevronRight className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
                </Link>
                <div className="mt-1">
                  {visibleChannels.map((ch) => (
                    <Link key={ch.id} href={`/channels/${ch.slug}`} onClick={onClose}
                      className="flex items-center gap-4 px-4 py-1.5 text-sm hover:bg-muted transition-colors">
                      <Avatar className="h-6 w-6 flex-shrink-0">
                        <AvatarImage src={ch.avatar} alt={ch.name} />
                        <AvatarFallback className="text-[10px]">{ch.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="truncate flex-1">{ch.name}</span>
                    </Link>
                  ))}
                  {hiddenChannels.length > 0 && (
                    <>
                      {showMoreChannels && hiddenChannels.map((ch) => (
                        <Link key={ch.id} href={`/channels/${ch.slug}`} onClick={onClose}
                          className="flex items-center gap-4 px-4 py-1.5 text-sm hover:bg-muted transition-colors">
                          <Avatar className="h-6 w-6 flex-shrink-0">
                            <AvatarImage src={ch.avatar} alt={ch.name} />
                            <AvatarFallback className="text-[10px]">{ch.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span className="truncate flex-1">{ch.name}</span>
                        </Link>
                      ))}
                      <button onClick={() => setShowMoreChannels(!showMoreChannels)}
                        className="flex items-center gap-4 px-4 py-2 text-sm hover:bg-muted transition-colors w-full">
                        {showMoreChannels ? <ChevronUp className="h-5 w-5 flex-shrink-0" /> : <ChevronDown className="h-5 w-5 flex-shrink-0" />}
                        <span>{showMoreChannels ? "Show less" : `Show ${hiddenChannels.length} more`}</span>
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Scholars — full avatar list */}
              <div className="border-t py-2">
                <Link
                  href="/scholars"
                  onClick={onClose}
                  className={cn(
                    "flex items-center gap-4 px-4 py-2 text-sm hover:bg-muted transition-colors",
                    (pathname === "/scholars" || pathname?.startsWith("/scholars/")) && "font-semibold bg-muted"
                  )}
                >
                  <GraduationCap className="h-5 w-5 flex-shrink-0" />
                  <span className="flex-1">Scholars</span>
                  <ChevronRight className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
                </Link>
                <div className="mt-1">
                  {visibleScholars.map((sc) => (
                    <Link key={sc.id} href={`/scholars/${sc.slug}`} onClick={onClose}
                      className="flex items-center gap-4 px-4 py-1.5 text-sm hover:bg-muted transition-colors">
                      <Avatar className="h-6 w-6 flex-shrink-0">
                        <AvatarImage src={sc.avatar} alt={sc.name} />
                        <AvatarFallback className="text-[10px]">{sc.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="truncate flex-1">{sc.name}</span>
                    </Link>
                  ))}
                  {hiddenScholars.length > 0 && (
                    <>
                      {showMoreScholars && hiddenScholars.map((sc) => (
                        <Link key={sc.id} href={`/scholars/${sc.slug}`} onClick={onClose}
                          className="flex items-center gap-4 px-4 py-1.5 text-sm hover:bg-muted transition-colors">
                          <Avatar className="h-6 w-6 flex-shrink-0">
                            <AvatarImage src={sc.avatar} alt={sc.name} />
                            <AvatarFallback className="text-[10px]">{sc.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <span className="truncate flex-1">{sc.name}</span>
                        </Link>
                      ))}
                      <button onClick={() => setShowMoreScholars(!showMoreScholars)}
                        className="flex items-center gap-4 px-4 py-2 text-sm hover:bg-muted transition-colors w-full">
                        {showMoreScholars ? <ChevronUp className="h-5 w-5 flex-shrink-0" /> : <ChevronDown className="h-5 w-5 flex-shrink-0" />}
                        <span>{showMoreScholars ? "Show less" : `Show ${hiddenScholars.length} more`}</span>
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* You — History only (Playlists & Your Account are in bottom nav) */}
              <div className="border-t py-2">
                <h3 className="px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">You</h3>
                <MobileSidebarItem href="/history" icon={<History className="h-5 w-5" />} label="History" active={pathname === "/history"} onClick={onClose} />
                {/* Watch Later — hidden; uncomment to re-enable */}
                {/* <MobileSidebarItem href="/watch-later" icon={<Clock className="h-5 w-5" />} label="Watch Later" active={pathname === "/watch-later"} onClick={onClose} /> */}
                {/* Liked Videos — hidden; uncomment to re-enable */}
                {/* <MobileSidebarItem href="/liked-videos" icon={<ThumbsUp className="h-5 w-5" />} label="Liked Videos" active={pathname === "/liked-videos"} onClick={onClose} /> */}
              </div>

              {/* More from Deeni.tube */}
              <div className="border-t py-2">
                <h3 className="px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">More from Deeni.tube</h3>
                <MobileSidebarItem href="/more" icon={<LayoutGrid className="h-5 w-5" />} label="More" active={pathname === "/more"} onClick={onClose} />
              </div>

              {/* Settings & Help */}
              <div className="border-t py-2">
                <MobileSidebarItem href="/settings" icon={<Settings className="h-5 w-5" />} label="Settings" active={pathname === "/settings"} onClick={onClose} />
                <MobileSidebarItem href="/help" icon={<HelpCircle className="h-5 w-5" />} label="Help" active={!!pathname?.startsWith("/help")} onClick={onClose} />
              </div>

              {/* Footer */}
              <div className="px-4 py-3 mt-2">
                <p className="text-xs text-center leading-tight tracking-wide text-muted-foreground mt-3">
                  © 2026 Deeni.tube All rights reserved.
                </p>
              </div>
            </>
          )}

        </div>
      </div>
    </>
  );
}

interface MobileSidebarItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
}

function MobileSidebarItem({ href, icon, label, active, onClick }: MobileSidebarItemProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-4 px-4 py-2.5 text-sm hover:bg-muted transition-colors",
        active && "font-medium bg-muted/50"
      )}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}
