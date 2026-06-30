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
  LayoutGrid,
  ListVideo,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useHeader } from "@/app/contexts/header-context";
import { useState, useEffect } from "react";

export default function DesktopSidebar() {
  const { headerVisible } = useHeader();
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Expose toggle function globally for header to call
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).__sidebarToggle = () => {
        setIsCollapsed(prev => !prev);
      };
      (window as any).__sidebarGetState = () => isCollapsed;
    }
    return () => {
      if (typeof window !== 'undefined') {
        delete (window as any).__sidebarToggle;
        delete (window as any).__sidebarGetState;
      }
    };
  }, [isCollapsed]);

  if (
    pathname?.startsWith("/videos/") ||
    pathname?.startsWith("/playlists/") ||
    pathname === "/shorts" ||
    pathname === "/signin"
  ) {
    return null;
  }

  const isHome = pathname === "/";

  // Sidebar starts right below the header (56px from top)
  const top = headerVisible ? "top-[56px]" : "top-0";
  
  // Height adjusts to fill remaining space below header
  const height = headerVisible 
    ? "h-[calc(100vh-56px)]" 
    : "h-screen";

  return (
    <aside
      className={cn(
        "hidden md:flex fixed left-0 border-r bg-background overflow-y-auto overflow-x-hidden flex-shrink-0 z-10 transition-all duration-300 ease-in-out",
        isCollapsed ? "w-[72px]" : "w-[240px]",
        top,
        height
      )}
    >
      <div className="w-full py-1.5">
        {/* Mini Sidebar Items - Only Home, Shorts, You and MobileNav items */}
        {isCollapsed ? (
          <>
            <SidebarItem 
              href="/" 
              icon={<Home className="h-5 w-5 flex-shrink-0" />} 
              label="Home" 
              active={pathname === "/"} 
              collapsed={true}
            />
            <SidebarItem 
              href="/shorts" 
              icon={<PlaySquare className="h-5 w-5 flex-shrink-0" />} 
              label="Shorts" 
              active={pathname === "/shorts"} 
              collapsed={true}
            />
            <SidebarItem 
              href="/you" 
              icon={<UserIcon className="h-5 w-5 flex-shrink-0" />} 
              label="You" 
              active={pathname === "/you"} 
              collapsed={true}
            />
            <SidebarItem 
              href="/channels" 
              icon={<Users className="h-5 w-5 flex-shrink-0" />} 
              label="Channels" 
              active={pathname === "/channels"} 
              collapsed={true}
            />
            <SidebarItem 
              href="/categories" 
              icon={<LayoutGrid className="h-5 w-5 flex-shrink-0" />} 
              label="Categories" 
              active={pathname === "/categories"} 
              collapsed={true}
            />
            <SidebarItem 
              href="/scholars" 
              icon={<GraduationCap className="h-5 w-5 flex-shrink-0" />} 
              label="Scholars" 
              active={pathname === "/scholars"} 
              collapsed={true}
            />
            <SidebarItem 
              href="/playlists" 
              icon={<ListVideo className="h-5 w-5 flex-shrink-0" />} 
              label="Playlists" 
              active={pathname === "/playlists"} 
              collapsed={true}
            />
          </>
        ) : (
          <>
            {/* Full Sidebar - All Items */}
            <SidebarItem 
              href="/" 
              icon={<Home className="h-5 w-5 flex-shrink-0" />} 
              label="Home" 
              active={pathname === "/"} 
              collapsed={false}
            />
            <SidebarItem 
              href="/shorts" 
              icon={<PlaySquare className="h-5 w-5 flex-shrink-0" />} 
              label="Shorts" 
              active={pathname === "/shorts"} 
              collapsed={false}
            />

            <div className="border-t py-2 mt-2">
              <div className="px-4 mb-2">
                <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                  You
                </h3>
              </div>
              <SidebarItem 
                href="/you" 
                icon={<UserIcon className="h-5 w-5 flex-shrink-0" />} 
                label="You" 
                active={pathname === "/you"} 
                collapsed={false}
              />
              <SidebarItem 
                href="/history" 
                icon={<History className="h-5 w-5 flex-shrink-0" />} 
                label="History" 
                collapsed={false}
              />
            </div>

            <div className="border-t py-2 mt-2">
              <SidebarItem 
                href="/playlists" 
                icon={<BookMarked className="h-5 w-5 flex-shrink-0" />} 
                label="Playlists" 
                active={pathname === "/playlists"} 
                collapsed={false}
              />
            </div>

            <div className="border-t py-2 mt-2">
              <div className="px-4 mb-2">
                <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                  Deeni.tube
                </h3>
              </div>
              <SidebarItem 
                href="/channels" 
                icon={<Users className="h-5 w-5 flex-shrink-0" />} 
                label="Channels" 
                active={pathname === "/channels"} 
                collapsed={false}
              />
              <SidebarItem 
                href="/scholars" 
                icon={<GraduationCap className="h-5 w-5 flex-shrink-0" />} 
                label="Scholars" 
                active={pathname === "/scholars"} 
                collapsed={false}
              />
              <SidebarItem 
                href="/categories" 
                icon={<FolderOpen className="h-5 w-5 flex-shrink-0" />} 
                label="Categories" 
                active={pathname === "/categories"} 
                collapsed={false}
              />
            </div>

            <div className="border-t py-2 mt-2">
              <div className="px-4 mb-2">
                <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                  More
                </h3>
              </div>
              <SidebarItem 
                href="/more" 
                icon={<Globe className="h-5 w-5 flex-shrink-0" />} 
                label="More" 
                active={pathname === "/more"} 
                collapsed={false}
              />
            </div>

            <div className="border-t py-2 mt-2">
              <SidebarItem 
                href="/settings" 
                icon={<Settings className="h-5 w-5 flex-shrink-0" />} 
                label="Settings" 
                collapsed={false}
              />
              <SidebarItem 
                href="/help" 
                icon={<HelpCircle className="h-5 w-5 flex-shrink-0" />} 
                label="Help" 
                collapsed={false}
              />
            </div>
          </>
        )}
      </div>
    </aside>
  );
}

interface SidebarItemProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  collapsed?: boolean;
}

function SidebarItem({ href, icon, label, active, collapsed }: SidebarItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-4 px-4 py-2 text-sm hover:bg-muted transition-all duration-300",
        active && "font-medium bg-muted/50",
        collapsed && "flex-col gap-1 px-2 py-3 justify-center"
      )}
      title={label}
    >
      <span className="flex-shrink-0">{icon}</span>
      <span className={cn(
        "transition-all duration-300 whitespace-nowrap",
        collapsed ? "text-[10px] leading-tight w-full text-center" : "text-sm"
      )}>
        {label}
      </span>
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