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
  BookMarked,
  LayoutGrid,
  ListVideo,
  ChevronDown,
  ChevronUp,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useHeader } from "@/app/contexts/header-context";
import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { channelData } from "@/lib/channel-data";
import { scholarData } from "@/lib/scholar-data";

export default function DesktopSidebar() {
  const { headerVisible } = useHeader();
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [showMoreChannels, setShowMoreChannels] = useState(false);
  const [showMoreScholars, setShowMoreScholars] = useState(false);

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

  // Sidebar starts right below the header (56px from top)
  const top = headerVisible ? "top-[56px]" : "top-0";
  
  // Height adjusts to fill remaining space below header
  const height = headerVisible 
    ? "h-[calc(100vh-56px)]" 
    : "h-screen";

  // Use data from lib files - show first 7 items, rest in expandable
  const visibleChannels = channelData.slice(0, 7);
  const hiddenChannels = channelData.slice(7);
  const visibleScholars = scholarData.slice(0, 7);
  const hiddenScholars = scholarData.slice(7);

  // Check active state
  const isChannelsActive = pathname === "/channels";
  const isScholarsActive = pathname === "/scholars";

  return (
    <aside
      className={cn(
        "hidden md:flex fixed left-0 border-r bg-background overflow-y-auto overflow-x-hidden flex-shrink-0 z-10 transition-all duration-300 ease-in-out sidebar-scrollbar",
        isCollapsed ? "w-[72px]" : "w-[240px]",
        top,
        height
      )}
    >
      <div className="w-full py-1.5">
        {/* Mini Sidebar Items */}
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
              active={isChannelsActive} 
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
              active={isScholarsActive} 
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
            {/* Full Sidebar */}
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

            {/* Channels Section - YouTube Style Header */}
            <div className="border-t pt-2 mt-2">
              <Link 
                href="/channels"
                className={cn(
                  "flex items-center gap-4 px-4 py-2 text-sm hover:bg-muted transition-all duration-300",
                  isChannelsActive && "font-medium bg-muted/50"
                )}
              >
                <Users className="h-5 w-5 flex-shrink-0" />
                <span className="text-sm flex-1">Channels</span>
                <ChevronRight className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
              </Link>
              
              {/* Channel List - from lib/channel-data.ts */}
              <div className="mt-1">
                {visibleChannels.map((channel) => (
                  <Link
                    key={channel.id}
                    href={`/channels/${channel.slug}`}
                    className="flex items-center gap-4 px-4 py-1.5 text-sm hover:bg-muted transition-all duration-300"
                  >
                    <Avatar className="h-6 w-6 flex-shrink-0">
                      <AvatarImage src={channel.avatar} alt={channel.name} />
                      <AvatarFallback className="text-[10px]">{channel.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm truncate flex-1">{channel.name}</span>
                  </Link>
                ))}

                {/* Show More Channels */}
                {hiddenChannels.length > 0 && (
                  <>
                    {showMoreChannels && hiddenChannels.map((channel) => (
                      <Link
                        key={channel.id}
                        href={`/channels/${channel.slug}`}
                        className="flex items-center gap-4 px-4 py-1.5 text-sm hover:bg-muted transition-all duration-300"
                      >
                        <Avatar className="h-6 w-6 flex-shrink-0">
                          <AvatarImage src={channel.avatar} alt={channel.name} />
                          <AvatarFallback className="text-[10px]">{channel.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm truncate flex-1">{channel.name}</span>
                      </Link>
                    ))}
                    
                    <button
                      onClick={() => setShowMoreChannels(!showMoreChannels)}
                      className="flex items-center gap-4 px-4 py-2 text-sm hover:bg-muted transition-colors w-full"
                    >
                      {showMoreChannels ? (
                        <ChevronUp className="h-5 w-5 flex-shrink-0" />
                      ) : (
                        <ChevronDown className="h-5 w-5 flex-shrink-0" />
                      )}
                      <span>{showMoreChannels ? "Show less" : `Show ${hiddenChannels.length} more`}</span>
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Scholars Section - YouTube Style Header */}
            <div className="border-t pt-2 mt-2">
              <Link 
                href="/scholars"
                className={cn(
                  "flex items-center gap-4 px-4 py-2 text-sm hover:bg-muted transition-all duration-300",
                  isScholarsActive && "font-medium bg-muted/50"
                )}
              >
                <GraduationCap className="h-5 w-5 flex-shrink-0" />
                <span className="text-sm flex-1">Scholars</span>
                <ChevronRight className="h-5 w-5 flex-shrink-0 text-muted-foreground" />
              </Link>
              
              {/* Scholar List - from lib/scholar-data.ts */}
              <div className="mt-1">
                {visibleScholars.map((scholar) => (
                  <Link
                    key={scholar.id}
                    href={`/scholars/${scholar.slug}`}
                    className="flex items-center gap-4 px-4 py-1.5 text-sm hover:bg-muted transition-all duration-300"
                  >
                    <Avatar className="h-6 w-6 flex-shrink-0">
                      <AvatarImage src={scholar.avatar} alt={scholar.name} />
                      <AvatarFallback className="text-[10px]">{scholar.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm truncate flex-1">{scholar.name}</span>
                  </Link>
                ))}

                {/* Show More Scholars */}
                {hiddenScholars.length > 0 && (
                  <>
                    {showMoreScholars && hiddenScholars.map((scholar) => (
                      <Link
                        key={scholar.id}
                        href={`/scholars/${scholar.slug}`}
                        className="flex items-center gap-4 px-4 py-1.5 text-sm hover:bg-muted transition-all duration-300"
                      >
                        <Avatar className="h-6 w-6 flex-shrink-0">
                          <AvatarImage src={scholar.avatar} alt={scholar.name} />
                          <AvatarFallback className="text-[10px]">{scholar.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm truncate flex-1">{scholar.name}</span>
                      </Link>
                    ))}
                    
                    <button
                      onClick={() => setShowMoreScholars(!showMoreScholars)}
                      className="flex items-center gap-4 px-4 py-2 text-sm hover:bg-muted transition-colors w-full"
                    >
                      {showMoreScholars ? (
                        <ChevronUp className="h-5 w-5 flex-shrink-0" />
                      ) : (
                        <ChevronDown className="h-5 w-5 flex-shrink-0" />
                      )}
                      <span>{showMoreScholars ? "Show less" : `Show ${hiddenScholars.length} more`}</span>
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* You Section */}
            <div className="border-t py-2 mt-2">
              <div className="px-4 mb-2">
                <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                  You
                </h3>
              </div>
              <SidebarItem 
                href="/you" 
                icon={<UserIcon className="h-5 w-5 flex-shrink-0" />} 
                label="Your account" 
                active={pathname === "/you"} 
                collapsed={false}
              />
              <SidebarItem 
                href="/history" 
                icon={<History className="h-5 w-5 flex-shrink-0" />} 
                label="History" 
                active={pathname === "/history"} 
                collapsed={false}
              />
              <SidebarItem 
                href="/playlists" 
                icon={<BookMarked className="h-5 w-5 flex-shrink-0" />} 
                label="Playlists" 
                active={pathname === "/playlists"} 
                collapsed={false}
              />
            </div>

            {/* Explore Section */}
            <div className="border-t py-2 mt-2">
              <div className="px-4 mb-2">
                <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                  Explore
                </h3>
              </div>
              <SidebarItem 
                href="/categories" 
                icon={<FolderOpen className="h-5 w-5 flex-shrink-0" />} 
                label="Categories" 
                active={pathname === "/categories"} 
                collapsed={false}
              />
            </div>

            {/* More from Deeni.tube */}
            <div className="border-t py-2 mt-2">
              <div className="px-4 mb-2">
                <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider whitespace-nowrap">
                  More from Deeni.tube
                </h3>
              </div>
              <SidebarItem 
                href="/more" 
                icon={<LayoutGrid className="h-5 w-5 flex-shrink-0" />} 
                label="More" 
                active={pathname === "/more"} 
                collapsed={false}
              />
            </div>

            {/* Settings */}
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

            {/* Footer */}
            <div className="px-4 py-3 mt-2">
              <p className="text-xs text-center leading-tight tracking-wide text-muted-foreground mt-3">© 2026 Deeni.tube All rights reserved.</p>
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
        "transition-all duration-300 whitespace-nowrap truncate",
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