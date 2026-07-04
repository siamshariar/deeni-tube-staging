// components/sidebar-expanded-content.tsx
// Shared expanded sidebar content used by both the desktop sidebar and the
// mobile sidenav drawer.  Pass onLinkClick to close the drawer on navigation.
"use client";

import type React from "react";
import Link from "next/link";
import {
  Home,
  History,
  PlaySquare,
  Settings,
  HelpCircle,
  Users,
  GraduationCap,
  FolderOpen,
  BookMarked,
  LayoutGrid,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  // Clock,    // Watch Later — hidden, keep for easy re-enable
  // ThumbsUp, // Liked Videos — hidden, keep for easy re-enable
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { channelData } from "@/lib/channel-data";
import { scholarData } from "@/lib/scholar-data";

// ─── SidebarItem ─────────────────────────────────────────────────────────────

interface SidebarItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  collapsed?: boolean;
  onClick?: () => void;
}

export function SidebarItem({ href, icon, label, active, collapsed, onClick }: SidebarItemProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "flex items-center gap-4 px-3 mx-1 py-2 rounded-lg text-sm hover:bg-muted transition-all duration-200",
        active && "font-semibold bg-muted",
        collapsed && "flex-col gap-1 px-2 py-3 justify-center mx-1"
      )}
      title={label}
    >
      <span className="flex-shrink-0">{icon}</span>
      <span
        className={cn(
          "transition-all duration-200 whitespace-nowrap truncate",
          collapsed ? "text-[10px] leading-tight w-full text-center" : "text-sm"
        )}
      >
        {label}
      </span>
    </Link>
  );
}

// ─── UserIcon SVG ─────────────────────────────────────────────────────────────

export function UserIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

// ─── SidebarExpandedContent ───────────────────────────────────────────────────

export interface SidebarExpandedContentProps {
  pathname: string | null;
  showMoreChannels: boolean;
  setShowMoreChannels: (v: boolean) => void;
  showMoreScholars: boolean;
  setShowMoreScholars: (v: boolean) => void;
  /** Called on every link/navigation click. Used by the mobile drawer to close itself. */
  onLinkClick?: () => void;
}

export function SidebarExpandedContent({
  pathname,
  showMoreChannels,
  setShowMoreChannels,
  showMoreScholars,
  setShowMoreScholars,
  onLinkClick,
}: SidebarExpandedContentProps) {
  const visibleChannels = channelData.slice(0, 7);
  const hiddenChannels  = channelData.slice(7);
  const visibleScholars = scholarData.slice(0, 7);
  const hiddenScholars  = scholarData.slice(7);
  const isChannelsActive = pathname === "/channels";
  const isScholarsActive = pathname === "/scholars";

  return (
    <>
      <SidebarItem href="/" icon={<Home className="h-5 w-5 flex-shrink-0" />} label="Home" active={pathname === "/"} collapsed={false} onClick={onLinkClick} />
      <SidebarItem href="/shorts" icon={<PlaySquare className="h-5 w-5 flex-shrink-0" />} label="Shorts" active={pathname === "/shorts"} collapsed={false} onClick={onLinkClick} />

      {/* Channels */}
      <div className="border-t pt-2 mt-2">
        <Link
          href="/channels"
          onClick={onLinkClick}
          className={cn(
            "flex items-center gap-4 px-3 mx-1 py-2 rounded-lg text-sm hover:bg-muted transition-all duration-200",
            isChannelsActive && "font-semibold bg-muted"
          )}
        >
          <Users className="h-5 w-5 flex-shrink-0" />
          <span className="text-sm flex">Channels</span>
          <ChevronRight className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
        </Link>
        <div className="mt-1">
          {visibleChannels.map((ch) => (
            <Link key={ch.id} href={`/channels/${ch.slug}`} onClick={onLinkClick}
              className="flex items-center gap-4 px-3 mx-1 py-1.5 rounded-lg text-sm hover:bg-muted transition-all duration-200">
              <Avatar className="h-6 w-6 flex-shrink-0">
                <AvatarImage src={ch.avatar} alt={ch.name} />
                <AvatarFallback className="text-[10px]">{ch.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="text-sm truncate flex-1">{ch.name}</span>
            </Link>
          ))}
          {hiddenChannels.length > 0 && (
            <>
              {showMoreChannels && hiddenChannels.map((ch) => (
                <Link key={ch.id} href={`/channels/${ch.slug}`} onClick={onLinkClick}
                  className="flex items-center gap-4 px-3 mx-1 py-1.5 rounded-lg text-sm hover:bg-muted transition-all duration-200">
                  <Avatar className="h-6 w-6 flex-shrink-0">
                    <AvatarImage src={ch.avatar} alt={ch.name} />
                    <AvatarFallback className="text-[10px]">{ch.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm truncate flex-1">{ch.name}</span>
                </Link>
              ))}
              <button
                onClick={() => setShowMoreChannels(!showMoreChannels)}
                className="flex items-center gap-4 px-3 mx-1 py-2 rounded-lg text-sm hover:bg-muted transition-colors w-[calc(100%-8px)]"
              >
                {showMoreChannels ? <ChevronUp className="h-5 w-5 flex-shrink-0" /> : <ChevronDown className="h-5 w-5 flex-shrink-0" />}
                <span>{showMoreChannels ? "Show less" : `Show ${hiddenChannels.length} more`}</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Scholars */}
      <div className="border-t pt-2 mt-2">
        <Link
          href="/scholars"
          onClick={onLinkClick}
          className={cn(
            "flex items-center gap-4 px-3 mx-1 py-2 rounded-lg text-sm hover:bg-muted transition-all duration-200",
            isScholarsActive && "font-semibold bg-muted"
          )}
        >
          <GraduationCap className="h-5 w-5 flex-shrink-0" />
          <span className="text-sm flex">Scholars</span>
          <ChevronRight className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
        </Link>
        <div className="mt-1">
          {visibleScholars.map((sc) => (
            <Link key={sc.id} href={`/scholars/${sc.slug}`} onClick={onLinkClick}
              className="flex items-center gap-4 px-3 mx-1 py-1.5 rounded-lg text-sm hover:bg-muted transition-all duration-200">
              <Avatar className="h-6 w-6 flex-shrink-0">
                <AvatarImage src={sc.avatar} alt={sc.name} />
                <AvatarFallback className="text-[10px]">{sc.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="text-sm truncate flex-1">{sc.name}</span>
            </Link>
          ))}
          {hiddenScholars.length > 0 && (
            <>
              {showMoreScholars && hiddenScholars.map((sc) => (
                <Link key={sc.id} href={`/scholars/${sc.slug}`} onClick={onLinkClick}
                  className="flex items-center gap-4 px-3 mx-1 py-1.5 rounded-lg text-sm hover:bg-muted transition-all duration-200">
                  <Avatar className="h-6 w-6 flex-shrink-0">
                    <AvatarImage src={sc.avatar} alt={sc.name} />
                    <AvatarFallback className="text-[10px]">{sc.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm truncate flex-1">{sc.name}</span>
                </Link>
              ))}
              <button
                onClick={() => setShowMoreScholars(!showMoreScholars)}
                className="flex items-center gap-4 px-3 mx-1 py-2 rounded-lg text-sm hover:bg-muted transition-colors w-[calc(100%-8px)]"
              >
                {showMoreScholars ? <ChevronUp className="h-5 w-5 flex-shrink-0" /> : <ChevronDown className="h-5 w-5 flex-shrink-0" />}
                <span>{showMoreScholars ? "Show less" : `Show ${hiddenScholars.length} more`}</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* You */}
      <div className="border-t py-2 mt-2">
        <div className="px-4 mb-2">
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider whitespace-nowrap">You</h3>
        </div>
        <SidebarItem href="/you" icon={<UserIcon className="h-5 w-5 flex-shrink-0" />} label="Your account" active={pathname === "/you"} collapsed={false} onClick={onLinkClick} />
        <SidebarItem href="/history" icon={<History className="h-5 w-5 flex-shrink-0" />} label="History" active={pathname === "/history"} collapsed={false} onClick={onLinkClick} />
        <SidebarItem href="/playlists" icon={<BookMarked className="h-5 w-5 flex-shrink-0" />} label="Playlists" active={pathname === "/playlists"} collapsed={false} onClick={onLinkClick} />
        {/* Watch Later — hidden; uncomment to re-enable */}
        {/* <SidebarItem href="/watch-later" icon={<Clock className="h-5 w-5 flex-shrink-0" />} label="Watch Later" active={pathname === "/watch-later"} collapsed={false} onClick={onLinkClick} /> */}
        {/* Liked Videos — hidden; uncomment to re-enable */}
        {/* <SidebarItem href="/liked-videos" icon={<ThumbsUp className="h-5 w-5 flex-shrink-0" />} label="Liked Videos" active={pathname === "/liked-videos"} collapsed={false} onClick={onLinkClick} /> */}
      </div>

      {/* Explore */}
      <div className="border-t py-2 mt-2">
        <div className="px-4 mb-2">
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider whitespace-nowrap">Explore</h3>
        </div>
        <SidebarItem href="/categories" icon={<FolderOpen className="h-5 w-5 flex-shrink-0" />} label="Categories" active={pathname === "/categories"} collapsed={false} onClick={onLinkClick} />
      </div>

      {/* More from Deeni.tube */}
      <div className="border-t py-2 mt-2">
        <div className="px-4 mb-2">
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider whitespace-nowrap">More from Deeni.tube</h3>
        </div>
        <SidebarItem href="/more" icon={<LayoutGrid className="h-5 w-5 flex-shrink-0" />} label="More" active={pathname === "/more"} collapsed={false} onClick={onLinkClick} />
      </div>

      {/* Settings */}
      <div className="border-t py-2 mt-2">
        <SidebarItem href="/settings" icon={<Settings className="h-5 w-5 flex-shrink-0" />} label="Settings" collapsed={false} onClick={onLinkClick} />
        <SidebarItem href="/help" icon={<HelpCircle className="h-5 w-5 flex-shrink-0" />} label="Help" collapsed={false} onClick={onLinkClick} />
      </div>

      {/* Footer */}
      <div className="px-4 py-3 mt-2">
        <p className="text-xs text-center leading-tight tracking-wide text-muted-foreground mt-3">
          © 2026 Deeni.tube All rights reserved.
        </p>
      </div>
    </>
  );
}
