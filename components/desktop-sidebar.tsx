"use client"

import type React from "react"
import Link from "next/link"
import { useState } from "react"
import { usePathname } from "next/navigation"
import {
  Home,
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
          <button
            className="flex w-full items-center gap-4 px-4 py-2 text-sm hover:bg-muted transition-colors"
            onClick={() => setShortsModalOpen(true)}
          >
            <PlaySquare className="h-5 w-5" />
            <span>Shorts</span>
          </button>
          <SidebarItem
            href="/subscriptions"
            icon={<BookOpen className="h-5 w-5" />}
            label="Subscriptions"
            active={pathname === "/subscriptions"}
          />
        </div>

        <div className="border-t py-2">
          <SidebarItem href="/you" icon={<User className="h-5 w-5" />} label="You" active={pathname === "/you"} />
          <SidebarItem href="/history" icon={<History className="h-5 w-5" />} label="History" />
          <SidebarItem href="/watch-later" icon={<Clock className="h-5 w-5" />} label="Watch later" />
          <SidebarItem href="/liked-videos" icon={<ThumbsUp className="h-5 w-5" />} label="Liked videos" />
        </div>

        <div className="border-t py-2">
          <h3 className="px-4 py-2 text-sm font-medium">Explore</h3>
          <SidebarItem href="/trending" icon={<Flame className="h-5 w-5" />} label="Trending" />
          <SidebarItem href="/music" icon={<Music className="h-5 w-5" />} label="Music" />
          <SidebarItem href="/gaming" icon={<Gamepad2 className="h-5 w-5" />} label="Gaming" />
          <SidebarItem href="/sports" icon={<Trophy className="h-5 w-5" />} label="Sports" />
        </div>

        <div className="border-t py-2">
          <h3 className="px-4 py-2 text-sm font-medium">More from YouTube</h3>
          <SidebarItem href="/premium" icon={<Youtube className="h-5 w-5" />} label="YouTube Premium" />
          <SidebarItem href="/music-app" icon={<Youtube className="h-5 w-5" />} label="YouTube Music" />
          <SidebarItem href="/kids" icon={<Youtube className="h-5 w-5" />} label="YouTube Kids" />
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
  )
}

function Youtube({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z" />
    </svg>
  )
}
