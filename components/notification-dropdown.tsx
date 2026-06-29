// components/notification-dropdown.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Bell,
  Settings,
  MoreVertical,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  DropdownMenu as SubDropdownMenu,
  DropdownMenuContent as SubDropdownContent,
  DropdownMenuItem as SubDropdownItem,
  DropdownMenuTrigger as SubDropdownTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// ── Notification Data ──
interface Notification {
  id: string;
  channelName: string;
  channelAvatar: string;
  message: string;
  timeAgo: string;
  thumbnail?: string;
  link: string;
  isUnread: boolean;
  type: "upload" | "short" | "post" | "recommended" | "live";
}

const notifications: Notification[] = [
  {
    id: "n1",
    channelName: "Dr. Mohammad Monzur-E-Elahi",
    channelAvatar: "https://yt3.googleusercontent.com/ytc/AIdro_lLp3SxQeehJxSmd_QCmSxpFBj4k-7X-brif7v9Jz0rBg=s160-c-k-c0x00ffffff-no-rj",
    message: "uploaded: ইসলামিক হালাকা : শেষ জামানার ফিতনা",
    timeAgo: "2 hours ago",
    thumbnail: "https://img.youtube.com/vi/XVscS6piz9A/hqdefault.jpg",
    link: "/videos/Dr. Mohammad Monzur-E-Elahi/XVscS6piz9A",
    isUnread: true,
    type: "upload",
  },
  {
    id: "n2",
    channelName: "Dr. Khandaker Abdullah Jahangir Rh.",
    channelAvatar: "https://yt3.googleusercontent.com/stJnVilfKhMtBiIq_hXTu-9DnanUT0GNtmsRePmQvLAi6c7bhXoIIHGlYL0HqUrdEjrL0KFs7Q=s160-c-k-c0x00ffffff-no-rj",
    message: "uploaded: জীবন ঘনিষ্ঠ গুরুত্বপূর্ণ কিছু প্রশ্নোত্তর",
    timeAgo: "5 hours ago",
    thumbnail: "https://img.youtube.com/vi/908GzCFuysY/hqdefault.jpg",
    link: "/videos/Dr. Khandaker Abdullah Jahangir Rh./908GzCFuysY",
    isUnread: true,
    type: "upload",
  },
  {
    id: "n3",
    channelName: "Dr Zakir Naik",
    channelAvatar: "https://yt3.googleusercontent.com/ytc/AIdro_kgWD-o3akIt5SI_BWvWHc6mHyPRm3BA5t69TAZlqQcpIF6=s176-c-k-c0x00ffffff-no-rj-mo",
    message: "uploaded: How to Enter Paradise in the Eyes of Islam",
    timeAgo: "1 day ago",
    thumbnail: "https://img.youtube.com/vi/XNojvAddjL8/hqdefault.jpg",
    link: "/videos/Dr Zakir Naik/XNojvAddjL8",
    isUnread: true,
    type: "upload",
  },
  {
    id: "n4",
    channelName: "Dr. Mohammad Monzur-E-Elahi",
    channelAvatar: "https://yt3.googleusercontent.com/ytc/AIdro_lLp3SxQeehJxSmd_QCmSxpFBj4k-7X-brif7v9Jz0rBg=s160-c-k-c0x00ffffff-no-rj",
    message: "uploaded: তরুণদের জন্য কুরআন-সুন্নাহ নির্দেশনা (পর্ব-১)",
    timeAgo: "2 days ago",
    thumbnail: "https://img.youtube.com/vi/UugARckPloo/hqdefault.jpg",
    link: "/videos/Dr. Mohammad Monzur-E-Elahi/UugARckPloo",
    isUnread: false,
    type: "upload",
  },
  {
    id: "n5",
    channelName: "Dr. Khandaker Abdullah Jahangir Rh.",
    channelAvatar: "https://yt3.googleusercontent.com/stJnVilfKhMtBiIq_hXTu-9DnanUT0GNtmsRePmQvLAi6c7bhXoIIHGlYL0HqUrdEjrL0KFs7Q=s160-c-k-c0x00ffffff-no-rj",
    message: "uploaded: আত্মার তৃপ্তি কোথায়?",
    timeAgo: "3 days ago",
    thumbnail: "https://img.youtube.com/vi/rtVnA9EA0xg/hqdefault.jpg",
    link: "/videos/Dr. Khandaker Abdullah Jahangir Rh./rtVnA9EA0xg",
    isUnread: false,
    type: "upload",
  },
  {
    id: "n6",
    channelName: "Dr Zakir Naik",
    channelAvatar: "https://yt3.googleusercontent.com/ytc/AIdro_kgWD-o3akIt5SI_BWvWHc6mHyPRm3BA5t69TAZlqQcpIF6=s176-c-k-c0x00ffffff-no-rj-mo",
    message: "uploaded: খ্রিস্টান শিক্ষক VS ডাঃ জাকির নায়েক",
    timeAgo: "4 days ago",
    thumbnail: "https://img.youtube.com/vi/wli20ZZztF4/hqdefault.jpg",
    link: "/videos/Dr Zakir Naik/wli20ZZztF4",
    isUnread: false,
    type: "upload",
  },
  {
    id: "n7",
    channelName: "Dr. Mohammad Monzur-E-Elahi",
    channelAvatar: "https://yt3.googleusercontent.com/ytc/AIdro_lLp3SxQeehJxSmd_QCmSxpFBj4k-7X-brif7v9Jz0rBg=s160-c-k-c0x00ffffff-no-rj",
    message: "uploaded: প্রকৃত ঈমানদার ও তাকওয়াবান ব্যক্তির গুণাবলি",
    timeAgo: "5 days ago",
    thumbnail: "https://img.youtube.com/vi/gZ3C_UO_tZM/hqdefault.jpg",
    link: "/videos/Dr. Mohammad Monzur-E-Elahi/gZ3C_UO_tZM",
    isUnread: false,
    type: "upload",
  },
  {
    id: "n8",
    channelName: "Dr. Khandaker Abdullah Jahangir Rh.",
    channelAvatar: "https://yt3.googleusercontent.com/stJnVilfKhMtBiIq_hXTu-9DnanUT0GNtmsRePmQvLAi6c7bhXoIIHGlYL0HqUrdEjrL0KFs7Q=s160-c-k-c0x00ffffff-no-rj",
    message: "posted: একটি গুরুত্বপূর্ণ বার্তা",
    timeAgo: "6 days ago",
    thumbnail: undefined,
    link: "/channel-new/abdullah",
    isUnread: false,
    type: "post",
  },
  {
    id: "n9",
    channelName: "Dr. Mohammad Monzur-E-Elahi",
    channelAvatar: "https://yt3.googleusercontent.com/ytc/AIdro_lLp3SxQeehJxSmd_QCmSxpFBj4k-7X-brif7v9Jz0rBg=s160-c-k-c0x00ffffff-no-rj",
    message: "uploaded: জুমু'আর খুতবাহ : কুরআন মুখী জীবন",
    timeAgo: "1 week ago",
    thumbnail: "https://img.youtube.com/vi/EtlK09Ikq4o/hqdefault.jpg",
    link: "/videos/Dr. Mohammad Monzur-E-Elahi/EtlK09Ikq4o",
    isUnread: false,
    type: "upload",
  },
];

// Count unread notifications
const unreadCount = notifications.filter(n => n.isUnread).length;

const importantNotifications = notifications.filter(n => n.isUnread);
const moreNotifications = notifications.filter(n => !n.isUnread);

// ── Skeleton ──
function NotificationSkeleton() {
  return (
    <div className="flex gap-3 px-4 py-3">
      <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
      <div className="flex-1 min-w-0 space-y-2">
        <Skeleton className="h-3.5 w-full" />
        <Skeleton className="h-3 w-16" />
      </div>
      <Skeleton className="h-[52px] w-[86px] rounded-lg flex-shrink-0" />
      <Skeleton className="h-8 w-8 rounded-full flex-shrink-0" />
    </div>
  );
}

// ── Main Component ──
export default function NotificationDropdown() {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  const handleOpen = (isOpen: boolean) => {
    if (isOpen) {
      setIsLoading(true);
      setTimeout(() => setIsLoading(false), 400);
    }
    setOpen(isOpen);
  };

  return (
    <DropdownMenu open={open} onOpenChange={handleOpen} modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full relative">
          <Bell className="h-5 w-5" />
          {/* Notification count badge */}
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center leading-none">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[calc(100vw-2rem)] max-w-[480px] sm:w-[440px] md:w-[480px] p-0 overflow-hidden"
        align="end"
        sideOffset={isMobile ? 4 : 8}
        alignOffset={isMobile ? 8 : 0}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b bg-background">
          <h2 className="font-semibold text-base">Notifications</h2>
          <button
            className="p-1.5 rounded-full hover:bg-muted transition-colors"
            aria-label="Notification settings"
            onClick={() => toast.info("Notification settings (demo)")}
          >
            <Settings className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[550px] overflow-y-auto">
          {isLoading ? (
            <div>
              <NotificationSkeleton />
              <NotificationSkeleton />
              <NotificationSkeleton />
              <NotificationSkeleton />
            </div>
          ) : (
            <>
              {/* Important section */}
              {importantNotifications.length > 0 && (
                <div>
                  <div className="px-5 py-2">
                    <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Recent
                    </h3>
                  </div>
                  {importantNotifications.map((notif) => (
                    <NotificationItem key={notif.id} notification={notif} />
                  ))}
                </div>
              )}

              {/* More notifications section */}
              {moreNotifications.length > 0 && (
                <div>
                  <div className="px-5 py-2 border-t">
                    <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      More notifications
                    </h3>
                  </div>
                  {moreNotifications.map((notif) => (
                    <NotificationItem key={notif.id} notification={notif} />
                  ))}
                </div>
              )}

              {/* Empty state */}
              {notifications.length === 0 && (
                <div className="text-center py-14 px-4">
                  <Bell className="h-14 w-14 mx-auto text-muted-foreground/20 mb-3" />
                  <p className="text-sm text-muted-foreground">
                    No notifications yet
                  </p>
                  <p className="text-xs text-muted-foreground/60 mt-1">
                    New notifications will appear here
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// ── Notification Item (YouTube style) ──
function NotificationItem({ notification }: { notification: Notification }) {
  return (
    <div
      className={cn(
        "relative flex items-start gap-3 px-5 py-3 hover:bg-muted/40 transition-colors group cursor-pointer",
        notification.isUnread && "bg-primary/[0.04] dark:bg-primary/[0.08]"
      )}
    >
      {/* Unread dot */}
      {notification.isUnread && (
        <span className="absolute left-2 top-[36px] -translate-y-1/2 w-1.5 h-1.5 bg-primary rounded-full flex-shrink-0" />
      )}

      {/* Clickable link area */}
      <Link href={notification.link} className="flex gap-3 flex-1 min-w-0">
        {/* Channel Avatar */}
        <Avatar className="h-12 w-12 flex-shrink-0 ring-1 ring-border/50">
          <AvatarImage src={notification.channelAvatar} alt={notification.channelName} />
          <AvatarFallback className="text-xs bg-muted">
            {notification.channelName.charAt(0)}
          </AvatarFallback>
        </Avatar>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <p className="text-sm leading-snug line-clamp-2 text-foreground/90">
            <span className="font-medium text-foreground">{notification.channelName}</span>
            <span className="text-muted-foreground"> {notification.message}</span>
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {notification.timeAgo}
          </p>
        </div>

        {/* Thumbnail — always visible */}
        {notification.thumbnail ? (
          <div className="relative w-[86px] h-[52px] rounded-lg overflow-hidden flex-shrink-0 bg-muted">
            <Image
              src={notification.thumbnail}
              alt=""
              fill
              className="object-cover"
              sizes="86px"
            />
            {/* Play icon overlay for upload type */}
            {notification.type === "upload" && (
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/10">
                <div className="w-7 h-7 rounded-full bg-black/60 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 text-white fill-white">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Placeholder for non-video notifications */
          <div className="w-[86px] flex-shrink-0" />
        )}
      </Link>

      {/* Three-dot menu button — always visible */}
      <SubDropdownMenu>
        <SubDropdownTrigger asChild>
          <button
            className="p-1.5 rounded-full hover:bg-muted/80 transition-colors flex-shrink-0"
            onClick={(e) => e.stopPropagation()}
          >
            <MoreVertical className="h-4 w-4 text-muted-foreground" />
          </button>
        </SubDropdownTrigger>
        <SubDropdownContent align="end" className="w-48 rounded-xl">
          <SubDropdownItem
            className="cursor-pointer py-2.5"
            onClick={() => toast.success("Notification hidden (demo)")}
          >
            Hide this notification
          </SubDropdownItem>
          <SubDropdownItem
            className="cursor-pointer py-2.5"
            onClick={() => toast.success("Notifications muted (demo)")}
          >
            Mute from {notification.channelName}
          </SubDropdownItem>
        </SubDropdownContent>
      </SubDropdownMenu>
    </div>
  );
}