"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import {
  Home,
  Search,
  PlaySquare,
  BookOpen,
  BookMarked,
  Clock,
  ThumbsUp,
  History,
  Users,
  GraduationCap,
  FolderOpen,
  Settings,
  Flag,
  HelpCircle,
  Flame,
  Music,
  Gamepad2,
  Trophy,
  Globe,
  Heart,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useState } from "react"
import ShortsModal from "./shorts-modal"

interface MobileSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export default function MobileSidebar({ isOpen, onClose }: MobileSidebarProps) {
  const pathname = usePathname()
  const [shortsModalOpen, setShortsModalOpen] = useState(false)

  if (!isOpen) return null

  return (
    <>
      {/* Overlay – covers whole screen, closes sidebar when clicked */}
      <div className="fixed inset-0 bg-black/50 z-40" onClick={onClose} />

      {/* Sidebar drawer – now visible on all screen sizes (removed md:hidden) */}
      <div className="fixed top-0 left-0 bottom-0 w-[280px] bg-background z-50 overflow-y-auto shadow-xl">
        <div className="flex items-center px-4 py-3 border-b sticky top-0 bg-background">
          <Link href="/" onClick={onClose}>
            <Image 
              src="/DeeniTubeLogo.png" 
              alt="Deeni.tube" 
              width={100} 
              height={24} 
              className="h-6 w-auto" 
            />
          </Link>
        </div>

        <div className="py-2">
          <MobileSidebarItem href="/" icon={<Home className="h-5 w-5" />} label="Home" active={pathname === "/"} onClick={onClose} />
          <MobileSidebarItem href="/shorts" icon={<PlaySquare className="h-5 w-5" />} label="Shorts" active={pathname === "/shorts"} onClick={onClose} />
          <MobileSidebarItem href="/subscriptions-new" icon={<BookOpen className="h-5 w-5" />} label="Subscriptions" active={pathname === "/subscriptions-new"} onClick={onClose} />
        </div>

        <div className="border-t py-2">
          <MobileSidebarItem href="/you-new" icon={<UserIcon className="h-5 w-5" />} label="You" active={pathname === "/you-new"} onClick={onClose} />
          <MobileSidebarItem href="/history" icon={<History className="h-5 w-5" />} label="History" onClick={onClose} />
          <MobileSidebarItem href="/watch-later" icon={<Clock className="h-5 w-5" />} label="Watch later" onClick={onClose} />
          <MobileSidebarItem href="/liked-videos" icon={<ThumbsUp className="h-5 w-5" />} label="Liked videos" onClick={onClose} />
          <MobileSidebarItem href="/playlists" icon={<BookMarked className="h-5 w-5" />} label="Playlists" active={pathname === "/playlists"} onClick={onClose} />
        </div>

        <div className="border-t py-2">
          <h3 className="px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">Explore</h3>
          <MobileSidebarItem href="/search-new" icon={<Search className="h-5 w-5" />} label="Search" active={pathname === "/search-new"} onClick={onClose} />
          <MobileSidebarItem href="/trending" icon={<Flame className="h-5 w-5" />} label="Trending" onClick={onClose} />
          <MobileSidebarItem href="/music" icon={<Music className="h-5 w-5" />} label="Music" onClick={onClose} />
          <MobileSidebarItem href="/gaming" icon={<Gamepad2 className="h-5 w-5" />} label="Gaming" onClick={onClose} />
          <MobileSidebarItem href="/sports" icon={<Trophy className="h-5 w-5" />} label="Sports" onClick={onClose} />
        </div>

        <div className="border-t py-2">
          <h3 className="px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">Deeni.tube</h3>
          <MobileSidebarItem href="/channels" icon={<Users className="h-5 w-5" />} label="Channels" active={pathname === "/channels"} onClick={onClose} />
          <MobileSidebarItem href="/scholars" icon={<GraduationCap className="h-5 w-5" />} label="Scholars" active={pathname === "/scholars"} onClick={onClose} />
          <MobileSidebarItem href="/categories" icon={<FolderOpen className="h-5 w-5" />} label="Categories" active={pathname === "/categories"} onClick={onClose} />
          <MobileSidebarItem href="/quran-translations" icon={<BookOpen className="h-5 w-5" />} label="Quran Translations" onClick={onClose} />
        </div>

        <div className="border-t py-2">
          <h3 className="px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">More</h3>
          <MobileSidebarItem href="/more" icon={<Globe className="h-5 w-5" />} label="More" onClick={onClose} />
        </div>

        <div className="border-t py-2">
          <MobileSidebarItem href="/settings" icon={<Settings className="h-5 w-5" />} label="Settings" onClick={onClose} />
          <MobileSidebarItem href="/report" icon={<Flag className="h-5 w-5" />} label="Report history" onClick={onClose} />
          <MobileSidebarItem href="/help" icon={<HelpCircle className="h-5 w-5" />} label="Help" onClick={onClose} />
        </div>

        <div className="pb-12" />
      </div>

      <ShortsModal isOpen={shortsModalOpen} onClose={() => setShortsModalOpen(false)} />
    </>
  )
}

interface MobileSidebarItemProps {
  href: string
  icon: React.ReactNode
  label: string
  active?: boolean
  onClick: () => void
}

function MobileSidebarItem({ href, icon, label, active, onClick }: MobileSidebarItemProps) {
  return (
    <Link href={href} onClick={onClick} className={cn("flex items-center gap-4 px-4 py-2.5 text-sm hover:bg-muted transition-colors", active && "font-medium bg-muted/50")}>
      {icon}<span>{label}</span>
    </Link>
  )
}

function UserIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}