// components/desktop-sidebar.tsx
"use client";

import type React from "react";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import {
  Home,
  Search,
  Clock,
  ThumbsUp,
  History,
  PlaySquare,
  Settings,
  HelpCircle,
  Users,
  GraduationCap,
  FolderOpen,
  Globe,
  BookMarked,
} from "lucide-react";
import { cn } from "@/lib/utils";
import ShortsModal from "./shorts-modal";

interface DesktopSidebarProps {
  className?: string;
  /** Only used on Home page to adjust top offset when header/chip bar hide */
  headerVisible?: boolean;
}

export default function DesktopSidebar({
  className,
  headerVisible = true,
}: DesktopSidebarProps) {
  const [shortsModalOpen, setShortsModalOpen] = useState(false);
  const pathname = usePathname();

  if (pathname?.startsWith("/videos/")) {
    return null;
  }

  const isHome = pathname === "/";

  // On home page, the header + chip bar are 104px high.
  // When visible, sidebar starts at 104px and height is 100vh-104px.
  // When hidden, sidebar slides to top (0px) and height becomes full screen.
  const top = isHome
    ? headerVisible
      ? "top-[104px]"
      : "top-0"                       // ⬅ slide completely to top
    : "top-[56px]";

  const height = isHome
    ? headerVisible
      ? "h-[calc(100vh-104px)]"
      : "h-screen"                    // ⬅ take full screen height
    : "h-[calc(100vh-56px)]";

  return (
    <>
      <aside
        className={cn(
          "fixed left-0 w-[240px] border-r bg-background overflow-y-auto flex-shrink-0 z-10 transition-all duration-300",
          top,
          height,
          className
        )}
      >
        <div className="py-2">
          <SidebarItem href="/" icon={<Home className="h-5 w-5" />} label="Home" active={pathname === "/"} />
          <SidebarItem href="/shorts" icon={<PlaySquare className="h-5 w-5" />} label="Shorts" active={pathname === "/shorts"} />
        </div>

        <div className="border-t py-2">
          <SidebarItem href="/you-new" icon={<UserIcon className="h-5 w-5" />} label="You" active={pathname === "/you-new"} />
          <SidebarItem href="/history" icon={<History className="h-5 w-5" />} label="History" />
          <SidebarItem href="/watch-later" icon={<Clock className="h-5 w-5" />} label="Watch later" />
          <SidebarItem href="/liked-videos" icon={<ThumbsUp className="h-5 w-5" />} label="Liked videos" />
          <SidebarItem href="/playlists" icon={<BookMarked className="h-5 w-5" />} label="Playlists" active={pathname === "/playlists"} />
        </div>

        <div className="border-t py-2">
          <h3 className="px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">Explore</h3>
          <SidebarItem href="/search-new" icon={<Search className="h-5 w-5" />} label="Search" active={pathname === "/search-new"} />
        </div>

        <div className="border-t py-2">
          <h3 className="px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">Deeni.tube</h3>
          <SidebarItem href="/channels" icon={<Users className="h-5 w-5" />} label="Channels" active={pathname === "/channels"} />
          <SidebarItem href="/scholars" icon={<GraduationCap className="h-5 w-5" />} label="Scholars" active={pathname === "/scholars"} />
          <SidebarItem href="/categories" icon={<FolderOpen className="h-5 w-5" />} label="Categories" active={pathname === "/categories"} />
        </div>

        <div className="border-t py-2">
          <h3 className="px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">More</h3>
          <SidebarItem href="/more" icon={<Globe className="h-5 w-5" />} label="More" active={pathname === "/more"} />
        </div>

        <div className="border-t py-2">
          <SidebarItem href="/settings" icon={<Settings className="h-5 w-5" />} label="Settings" />
          <SidebarItem href="/help" icon={<HelpCircle className="h-5 w-5" />} label="Help" />
        </div>
      </aside>

      <ShortsModal isOpen={shortsModalOpen} onClose={() => setShortsModalOpen(false)} />
    </>
  );
}

interface SidebarItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}

function SidebarItem({ href, icon, label, active }: SidebarItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-4 px-4 py-2 text-sm hover:bg-muted transition-colors",
        active && "font-medium",
      )}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}

function UserIcon({ className }: { className?: string }) {
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