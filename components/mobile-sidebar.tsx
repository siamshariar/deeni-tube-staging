// components/mobile-sidebar.tsx
"use client";

import type React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Menu,
  Home,
  PlaySquare,
  LayoutGrid,
  ListVideo,
  User,
  Users,
  GraduationCap,
  History,
  Settings,
  HelpCircle,
  MoreHorizontal,
  Heart,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
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

  // true  → bottom nav is showing  → show simplified nav
  // false → bottom nav is hidden   → show full desktop-identical sidebar
  const showingBottomNav = bottomNavIsVisible(pathname);

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
              <SidebarExpandedContent pathname={pathname} onLinkClick={onClose} />
            </div>
          ) : (
            // ── BOTTOM NAV VISIBLE ─────────────────────────────────────────────
            // Mirror the bottom nav items + extra nav as simple links (no avatar lists)
            <>
              {/* Main nav — same as bottom bar */}
              <div className="py-2">
                {[
                  { href: "/",           icon: <Home className="h-5 w-5" />,      label: "Home" },
                  { href: "/shorts",     icon: <PlaySquare className="h-5 w-5" />, label: "Shorts" },
                  { href: "/categories", icon: <LayoutGrid className="h-5 w-5" />, label: "Categories" },
                  { href: "/playlists",  icon: <ListVideo className="h-5 w-5" />,  label: "Playlists" },
                  { href: "/you",        icon: <User className="h-5 w-5" />,       label: "You" },
                ].map(({ href, icon, label }) => (
                  <MobileSidebarItem
                    key={href}
                    href={href}
                    icon={icon}
                    label={label}
                    active={pathname === href}
                    onClick={onClose}
                  />
                ))}
              </div>

              {/* Browse */}
              <div className="border-t py-2">
                <MobileSidebarItem href="/channels"  icon={<Users className="h-5 w-5" />}         label="Channels"  active={pathname === "/channels"}  onClick={onClose} />
                <MobileSidebarItem href="/scholars"  icon={<GraduationCap className="h-5 w-5" />} label="Scholars"  active={pathname === "/scholars"}  onClick={onClose} />
              </div>

              {/* Library */}
              <div className="border-t py-2">
                <MobileSidebarItem href="/history"     icon={<History className="h-5 w-5" />}        label="History"     active={pathname === "/history"}     onClick={onClose} />
                <MobileSidebarItem href="/donate"      icon={<Heart className="h-5 w-5" />}          label="Donate"      active={pathname === "/donate"}      onClick={onClose} />
                <MobileSidebarItem href="/more"        icon={<MoreHorizontal className="h-5 w-5" />} label="More"        active={pathname === "/more"}        onClick={onClose} />
              </div>

              {/* Settings & Help */}
              <div className="border-t py-2">
                <MobileSidebarItem href="/settings" icon={<Settings className="h-5 w-5" />}  label="Settings" active={pathname === "/settings"} onClick={onClose} />
                <MobileSidebarItem href="/help"     icon={<HelpCircle className="h-5 w-5" />} label="Help"     active={!!pathname?.startsWith("/help")} onClick={onClose} />
              </div>

              <div className="px-4 py-4 border-t">
                <p className="text-xs text-center text-muted-foreground">© 2026 Deeni.tube</p>
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
