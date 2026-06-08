"use client"

import type React from "react"
import Link from "next/link"
import { useState } from "react"
import { usePathname } from "next/navigation"
import {
  Home,
  Search,
  Clock,
  ThumbsUp,
  History,
  PlaySquare,
  Flame,
  Music,
  Gamepad2,
  Trophy,
  Settings,
  Flag,
  HelpCircle,
  BookOpen,
  Users,
  GraduationCap,
  FolderOpen,
  Globe,
  Heart,
  BookMarked,
} from "lucide-react"
import { cn } from "@/lib/utils"
import ShortsModal from "./shorts-modal"

interface DesktopSidebarProps {
  className?: string
}

export default function DesktopSidebar({ className }: DesktopSidebarProps) {
  const [shortsModalOpen, setShortsModalOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
      <aside
        className={cn(
          "fixed top-[56px] left-0 w-[240px] border-r bg-background overflow-y-auto h-[calc(100vh-56px)] flex-shrink-0 z-10",
          className,
        )}
      >
        <div className="py-2">
          <SidebarItem href="/" icon={<Home className="h-5 w-5" />} label="Home" active={pathname === "/"} />
          <SidebarItem href="/shorts" icon={<PlaySquare className="h-5 w-5" />} label="Shorts" active={pathname === "/shorts"} />
          <SidebarItem href="/subscriptions-new" icon={<BookOpen className="h-5 w-5" />} label="Subscriptions" active={pathname === "/subscriptions"} />
        </div>

        <div className="border-t py-2">
          <SidebarItem href="/you-new" icon={<User className="h-5 w-5" />} label="You" active={pathname === "/you"} />
          <SidebarItem href="/history" icon={<History className="h-5 w-5" />} label="History" />
          <SidebarItem href="/watch-later" icon={<Clock className="h-5 w-5" />} label="Watch later" />
          <SidebarItem href="/liked-videos" icon={<ThumbsUp className="h-5 w-5" />} label="Liked videos" />
          <SidebarItem href="/playlists" icon={<BookMarked className="h-5 w-5" />} label="Playlists" active={pathname === "/playlists"} />
        </div>

        <div className="border-t py-2">
          <h3 className="px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">Explore</h3>
          <SidebarItem href="/search-new" icon={<Search className="h-5 w-5" />} label="Search" active={pathname === "/search-new"} />
          <SidebarItem href="/trending" icon={<Flame className="h-5 w-5" />} label="Trending" />
          <SidebarItem href="/music" icon={<Music className="h-5 w-5" />} label="Music" />
          <SidebarItem href="/gaming" icon={<Gamepad2 className="h-5 w-5" />} label="Gaming" />
          <SidebarItem href="/sports" icon={<Trophy className="h-5 w-5" />} label="Sports" />
        </div>

        <div className="border-t py-2">
          <h3 className="px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">Deeni.tube</h3>
          <SidebarItem href="/channels" icon={<Users className="h-5 w-5" />} label="Channels" active={pathname === "/channels"} />
          <SidebarItem href="/scholars" icon={<GraduationCap className="h-5 w-5" />} label="Scholars" active={pathname === "/scholars"} />
          <SidebarItem href="/categories" icon={<FolderOpen className="h-5 w-5" />} label="Categories" active={pathname === "/categories"} />
          <SidebarItem href="/quran-translations" icon={<BookOpen className="h-5 w-5" />} label="Quran Translations" active={pathname === "/quran-translations"} />
          {/* <SidebarItem href="/ruqyah" icon={<Heart className="h-5 w-5" />} label="Ruqyah" active={pathname === "/ruqyah"} /> */}
        </div>

        <div className="border-t py-2">
          <h3 className="px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">More</h3>
          <SidebarItem href="/more" icon={<Globe className="h-5 w-5" />} label="More" active={pathname === "/more"} />
        </div>

        <div className="border-t py-2">
          <SidebarItem href="/settings" icon={<Settings className="h-5 w-5" />} label="Settings" />
          <SidebarItem href="/report" icon={<Flag className="h-5 w-5" />} label="Report history" />
          <SidebarItem href="/help" icon={<HelpCircle className="h-5 w-5" />} label="Help" />
        </div>
      </aside>

      <ShortsModal isOpen={shortsModalOpen} onClose={() => setShortsModalOpen(false)} />
    </>
  )
}

interface SidebarItemProps {
  href: string
  icon: React.ReactNode
  label: string
  active?: boolean
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
  )
}

function User({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}