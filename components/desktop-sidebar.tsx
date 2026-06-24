// components/desktop-sidebar.tsx
"use client";

import type React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
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
import { useHeader } from "@/app/contexts/header-context";

export default function DesktopSidebar() {
  const { headerVisible } = useHeader();
  const pathname = usePathname();

  if (
    pathname?.startsWith("/videos/") ||
    pathname?.startsWith("/playlists/") ||
    pathname === "/shorts" ||
    pathname === "/signin"
  ) {
    return null;
  }

  const isHome = pathname === "/";

  const top = isHome
    ? headerVisible
      ? "top-[104px]"
      : "top-0"
    : headerVisible
      ? "top-[56px]"
      : "top-0";

  const height = isHome
    ? headerVisible
      ? "h-[calc(100vh-104px)]"
      : "h-screen"
    : headerVisible
      ? "h-[calc(100vh-56px)]"
      : "h-screen";

  return (
    <aside
      className={cn(
        "hidden md:flex fixed left-0 w-[240px] border-r bg-background overflow-y-auto flex-shrink-0 z-10 transition-all duration-300",
        top,
        height
      )}
    >
      <div className="w-full py-2">
        <SidebarItem href="/" icon={<Home className="h-5 w-5" />} label="Home" active={pathname === "/"} />
        <SidebarItem href="/shorts" icon={<PlaySquare className="h-5 w-5" />} label="Shorts" active={pathname === "/shorts"} />

        <div className="border-t py-2 mt-2">
          <SidebarItem href="/you" icon={<UserIcon className="h-5 w-5" />} label="You" active={pathname === "/you"} />
          <SidebarItem href="/history" icon={<History className="h-5 w-5" />} label="History" />
        </div>

        <div className="border-t py-2 mt-2">
          <SidebarItem href="/playlists" icon={<BookMarked className="h-5 w-5" />} label="Playlists" active={pathname === "/playlists"} />
        </div>

        <div className="border-t py-2 mt-2">
          <h3 className="px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">Deeni.tube</h3>
          <SidebarItem href="/channels" icon={<Users className="h-5 w-5" />} label="Channels" active={pathname === "/channels"} />
          <SidebarItem href="/scholars" icon={<GraduationCap className="h-5 w-5" />} label="Scholars" active={pathname === "/scholars"} />
          <SidebarItem href="/categories" icon={<FolderOpen className="h-5 w-5" />} label="Categories" active={pathname === "/categories"} />
        </div>

        <div className="border-t py-2 mt-2">
          <h3 className="px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">More</h3>
          <SidebarItem href="/more" icon={<Globe className="h-5 w-5" />} label="More" active={pathname === "/more"} />
        </div>

        <div className="border-t py-2 mt-2">
          <SidebarItem href="/settings" icon={<Settings className="h-5 w-5" />} label="Settings" />
          <SidebarItem href="/help" icon={<HelpCircle className="h-5 w-5" />} label="Help" />
        </div>
      </div>
    </aside>
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
        active && "font-medium"
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