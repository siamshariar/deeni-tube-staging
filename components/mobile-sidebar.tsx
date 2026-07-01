// components/mobile-sidebar.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Home,
  Menu,
  PlaySquare,
  BookMarked,
  History,
  Users,
  GraduationCap,
  FolderOpen,
  Settings,
  HelpCircle,
  Globe,
  Clock,
  ThumbsUp,
  Download,
  Film,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  LayoutGrid,
  ListVideo,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ShortsModal from "./shorts-modal";

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

// Mock channel data for sidebar
const sidebarChannels = [
  { id: "monzur", name: "Dr. Mohammad Monzur-E-Elahi", avatar: "https://yt3.googleusercontent.com/ytc/AIdro_lLp3SxQeehJxSmd_QCmSxpFBj4k-7X-brif7v9Jz0rBg=s160-c-k-c0x00ffffff-no-rj", slug: "monzur" },
  { id: "abdullah", name: "Dr. Khandaker Abdullah Jahangir Rh.", avatar: "https://yt3.googleusercontent.com/stJnVilfKhMtBiIq_hXTu-9DnanUT0GNtmsRePmQvLAi6c7bhXoIIHGlYL0HqUrdEjrL0KFs7Q=s160-c-k-c0x00ffffff-no-rj", slug: "abdullah-jahangir" },
  { id: "zakariya", name: "Prof. Dr. Abubakar Muhammad Zakaria", avatar: "https://yt3.googleusercontent.com/B5dEWmLpOG-j07FqzYJJW2snv2yep93R_AcnBx05lzn56r0CJdX8LtrEASS-FxW3r663GNzLHQ=s160-c-k-c0x00ffffff-no-rj", slug: "abu-bakar-zakariya" },
  { id: "imam", name: "Dr. Mohammad Imam Hossain", avatar: "/placeholder.svg?height=48&width=48", slug: "imam-hossain" },
  { id: "saifullah", name: "Dr. Muhammad Saifullah", avatar: "https://yt3.googleusercontent.com/A5R8WWONod1kMdbHn1IYpzBELTF3y6fA12F2t-ZORFbzQqFX08Hp-sm9KLwdYheHiSLu9Ltm=s160-c-k-c0x00ffffff-no-rj", slug: "saifullah-madani" },
  { id: "zakir", name: "Dr. Zakir Naik", avatar: "https://yt3.googleusercontent.com/ytc/AIdro_kgWD-o3akIt5SI_BWvWHc6mHyPRm3BA5t69TAZlqQcpIF6=s160-c-k-c0x00ffffff-no-rj", slug: "zakir-naik" },
  { id: "muftimenk", name: "Mufti Menk", avatar: "https://yt3.googleusercontent.com/ytc/AIdro_nFND09H6Vvk_P8L4djMdBusHPU8nIT6XuiRjL8M59hJsw=s160-c-k-c0x00ffffff-no-rj", slug: "mufti-menk" },
  { id: "assim", name: "Assim Al Hakeem", avatar: "https://yt3.googleusercontent.com/ytc/AIdro_nc1yIpeXxXdQ02ZRrAQr6HZU_gMrzljS5HFCRO4a95KH8=s160-c-k-c0x00ffffff-no-rj", slug: "assim-al-hakeem" },
  { id: "voice", name: "Voice of True TV", avatar: "https://yt3.googleusercontent.com/3NX3SAB15n6cmUFhRpPc5U2LPSUsdRpOmYEKh5EicP8oofnh8LlFUCNy5DM62-XUmWnprJqG=s160-c-k-c0x00ffffff-no-rj", slug: "voice-of-true-tv" },
  { id: "sahih", name: "Sahih Waz Tv", avatar: "https://yt3.googleusercontent.com/Jt6FStYvwOFIfW-OttS-7PZoEuGQ_IRrL7_CMMVadXzzEZLhuy0gf1u_fRzVrSvrNDIZoUSrMg=s160-c-k-c0x00ffffff-no-rj", slug: "sahih-waz-tv" },
  { id: "tafseer", name: "Tafseerul Quran", avatar: "https://yt3.googleusercontent.com/SJog0xycDSsFDAzbDqA3x2MIfNFLxMPjYrFLCltK1ZsvAPHRI_U8MvNUaEVo8NrOG3GuZUS6OA=s160-c-k-c0x00ffffff-no-rj", slug: "tafseerul-quran" },
];

// Mock scholar data for sidebar
const sidebarScholars = [
  { id: "monzur", name: "Dr. Mohammad Monzur-E-Elahi", avatar: "https://yt3.googleusercontent.com/ytc/AIdro_lLp3SxQeehJxSmd_QCmSxpFBj4k-7X-brif7v9Jz0rBg=s160-c-k-c0x00ffffff-no-rj", slug: "monzur" },
  { id: "abdullah", name: "Dr. Khandaker Abdullah Jahangir", avatar: "https://yt3.googleusercontent.com/stJnVilfKhMtBiIq_hXTu-9DnanUT0GNtmsRePmQvLAi6c7bhXoIIHGlYL0HqUrdEjrL0KFs7Q=s160-c-k-c0x00ffffff-no-rj", slug: "abdullah-jahangir" },
  { id: "zakariya", name: "Prof. Dr. Abubakar Muhammad Zakaria", avatar: "https://yt3.googleusercontent.com/B5dEWmLpOG-j07FqzYJJW2snv2yep93R_AcnBx05lzn56r0CJdX8LtrEASS-FxW3r663GNzLHQ=s160-c-k-c0x00ffffff-no-rj", slug: "abu-bakar-zakariya" },
  { id: "zakir", name: "Dr. Zakir Naik", avatar: "https://yt3.googleusercontent.com/ytc/AIdro_kgWD-o3akIt5SI_BWvWHc6mHyPRm3BA5t69TAZlqQcpIF6=s160-c-k-c0x00ffffff-no-rj", slug: "zakir-naik" },
  { id: "muftimenk", name: "Mufti Menk", avatar: "https://yt3.googleusercontent.com/ytc/AIdro_nFND09H6Vvk_P8L4djMdBusHPU8nIT6XuiRjL8M59hJsw=s160-c-k-c0x00ffffff-no-rj", slug: "mufti-menk" },
  { id: "assim", name: "Sheikh Assim Al Hakeem", avatar: "https://yt3.googleusercontent.com/ytc/AIdro_nc1yIpeXxXdQ02ZRrAQr6HZU_gMrzljS5HFCRO4a95KH8=s160-c-k-c0x00ffffff-no-rj", slug: "assim-al-hakeem" },
  { id: "imam", name: "Dr. Mohammad Imam Hossain", avatar: "/placeholder.svg?height=48&width=48", slug: "imam-hossain" },
  { id: "saifullah", name: "Dr. Muhammad Saifullah", avatar: "https://yt3.googleusercontent.com/A5R8WWONod1kMdbHn1IYpzBELTF3y6fA12F2t-ZORFbzQqFX08Hp-sm9KLwdYheHiSLu9Ltm=s160-c-k-c0x00ffffff-no-rj", slug: "saifullah-madani" },
];

export default function MobileSidebar({ isOpen, onClose }: MobileSidebarProps) {
  const pathname = usePathname();
  const [shortsModalOpen, setShortsModalOpen] = useState(false);
  const [showMoreChannels, setShowMoreChannels] = useState(false);
  const [showMoreScholars, setShowMoreScholars] = useState(false);
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isVisible, setIsVisible] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      requestAnimationFrame(() => setIsVisible(true));
      return;
    }

    setIsVisible(false);
    const timer = setTimeout(() => setShouldRender(false), 300);
    return () => clearTimeout(timer);
  }, [isOpen]);

  if (!shouldRender) return null;

  const isChannelsActive = pathname === "/channels";
  const isScholarsActive = pathname === "/scholars";

  const visibleChannels = sidebarChannels.slice(0, 5);
  const hiddenChannels = sidebarChannels.slice(5);
  const visibleScholars = sidebarScholars.slice(0, 5);
  const hiddenScholars = sidebarScholars.slice(5);

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ease-in-out",
          isVisible ? "opacity-100" : "opacity-0"
        )}
        onClick={onClose}
      />

      <div
        className={cn(
          "fixed top-0 left-0 bottom-0 w-[280px] bg-background z-50 overflow-hidden shadow-xl transform transition-transform duration-[400ms] ease-in-out flex flex-col",
          isVisible ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center gap-4 px-4 py-3 border-b bg-background">
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

        <div className="flex-1 overflow-y-auto overflow-x-hidden sidebar-scrollbar">

        <div className="py-2">
          <MobileSidebarItem href="/" icon={<Home className="h-5 w-5" />} label="Home" active={pathname === "/"} onClick={onClose} />
          <MobileSidebarItem href="/shorts" icon={<PlaySquare className="h-5 w-5" />} label="Shorts" active={pathname === "/shorts"} onClick={onClose} />
        </div>

        {/* <div className="border-t py-2">
          <Link 
            href="/channels"
            onClick={onClose}
            className={cn(
              "flex items-center gap-4 px-4 py-2.5 text-sm hover:bg-muted transition-colors",
              isChannelsActive && "font-medium bg-muted/50"
            )}
          >
            <Users className="h-5 w-5 flex-shrink-0" />
            <span className="flex">Channels</span>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </Link>
          
          {visibleChannels.map((channel) => (
            <Link
              key={channel.id}
              href={`/channels/${channel.slug}`}
              onClick={onClose}
              className="flex items-center gap-4 px-4 py-1.5 text-sm hover:bg-muted transition-colors"
            >
              <Avatar className="h-6 w-6 flex-shrink-0">
                <AvatarImage src={channel.avatar} alt={channel.name} />
                <AvatarFallback className="text-[10px]">{channel.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="text-sm truncate">{channel.name}</span>
            </Link>
          ))}

          {hiddenChannels.length > 0 && (
            <>
              {showMoreChannels && hiddenChannels.map((channel) => (
                <Link
                  key={channel.id}
                  href={`/channels/${channel.slug}`}
                  onClick={onClose}
                  className="flex items-center gap-4 px-4 py-1.5 text-sm hover:bg-muted transition-colors"
                >
                  <Avatar className="h-6 w-6 flex-shrink-0">
                    <AvatarImage src={channel.avatar} alt={channel.name} />
                    <AvatarFallback className="text-[10px]">{channel.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm truncate">{channel.name}</span>
                </Link>
              ))}
              <button
                onClick={() => setShowMoreChannels(!showMoreChannels)}
                className="flex items-center gap-4 px-4 py-2.5 text-sm hover:bg-muted transition-colors w-full"
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

        <div className="border-t py-2">
          <Link 
            href="/scholars"
            onClick={onClose}
            className={cn(
              "flex items-center gap-4 px-4 py-2.5 text-sm hover:bg-muted transition-colors",
              isScholarsActive && "font-medium bg-muted/50"
            )}
          >
            <GraduationCap className="h-5 w-5 flex-shrink-0" />
            <span className="flex">Scholars</span>
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </Link>
          
          {visibleScholars.map((scholar) => (
            <Link
              key={scholar.id}
              href={`/scholars/${scholar.slug}`}
              onClick={onClose}
              className="flex items-center gap-4 px-4 py-1.5 text-sm hover:bg-muted transition-colors"
            >
              <Avatar className="h-6 w-6 flex-shrink-0">
                <AvatarImage src={scholar.avatar} alt={scholar.name} />
                <AvatarFallback className="text-[10px]">{scholar.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="text-sm truncate">{scholar.name}</span>
            </Link>
          ))}

          {hiddenScholars.length > 0 && (
            <>
              {showMoreScholars && hiddenScholars.map((scholar) => (
                <Link
                  key={scholar.id}
                  href={`/scholars/${scholar.slug}`}
                  onClick={onClose}
                  className="flex items-center gap-4 px-4 py-1.5 text-sm hover:bg-muted transition-colors"
                >
                  <Avatar className="h-6 w-6 flex-shrink-0">
                    <AvatarImage src={scholar.avatar} alt={scholar.name} />
                    <AvatarFallback className="text-[10px]">{scholar.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm truncate">{scholar.name}</span>
                </Link>
              ))}
              <button
                onClick={() => setShowMoreScholars(!showMoreScholars)}
                className="flex items-center gap-4 px-4 py-2.5 text-sm hover:bg-muted transition-colors w-full"
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
        </div> */}

        {/* <div className="border-t py-2">
          <h3 className="px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">Explore</h3>
          <MobileSidebarItem href="/categories" icon={<FolderOpen className="h-5 w-5" />} label="Categories" active={pathname === "/categories"} onClick={onClose} />
        </div> */}

        {/* You Section */}
        <div className="border-t py-2">
          <h3 className="px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">You</h3>
          <MobileSidebarItem href="/you" icon={<UserIcon className="h-5 w-5" />} label="Your account" active={pathname === "/you"} onClick={onClose} />
          <MobileSidebarItem href="/history" icon={<History className="h-5 w-5" />} label="History" active={pathname === "/history"} onClick={onClose} />
          {/* <MobileSidebarItem href="/playlists" icon={<BookMarked className="h-5 w-5" />} label="Playlists" active={pathname === "/playlists"} onClick={onClose} /> */}
          {/* <MobileSidebarItem href="/playlist?list=WL" icon={<Clock className="h-5 w-5" />} label="Watch later" onClick={onClose} />
          <MobileSidebarItem href="/playlist?list=LL" icon={<ThumbsUp className="h-5 w-5" />} label="Liked videos" onClick={onClose} /> */}
        </div>

        {/* Explore Section */}
        {/* <div className="border-t py-2">
          <h3 className="px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">Explore</h3>
          <MobileSidebarItem href="/categories" icon={<FolderOpen className="h-5 w-5" />} label="Categories" active={pathname === "/categories"} onClick={onClose} />
        </div> */}

        {/* More from Deeni.tube */}
        <div className="border-t py-2">
          <h3 className="px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">More from Deeni.tube</h3>
          <MobileSidebarItem href="/more" icon={<LayoutGrid className="h-5 w-5" />} label="More" active={pathname === "/more"} onClick={onClose} />
        </div>

        {/* Settings & Help */}
        <div className="border-t py-2">
          <MobileSidebarItem href="/settings" icon={<Settings className="h-5 w-5" />} label="Settings" onClick={onClose} />
          <MobileSidebarItem href="/help" icon={<HelpCircle className="h-5 w-5" />} label="Help" onClick={onClose} />
        </div>

        </div>

        {/* Footer */}
        <div className="px-4 py-4 border-t mt-auto">
          <p className="text-xs text-center leading-tight tracking-wide text-muted-foreground">
            © 2026 Deeni.tube All rights reserved.
          </p>
        </div>
      </div>

      <ShortsModal isOpen={shortsModalOpen} onClose={() => setShortsModalOpen(false)} />
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
    <Link href={href} onClick={onClick} className={cn("flex items-center gap-4 px-4 py-2.5 text-sm hover:bg-muted transition-colors", active && "font-medium bg-muted/50")}>
      {icon}<span>{label}</span>
    </Link>
  );
}

function UserIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}