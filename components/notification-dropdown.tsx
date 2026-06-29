// components/notification-dropdown.tsx
"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Bell,
  Settings,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

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
  type: "upload" | "post" | "recommended" | "live";
}

const notifications: Notification[] = [
  {
    id: "n1",
    channelName: "Dr. Mohammad Monzur-E-Elahi",
    channelAvatar: "https://yt3.googleusercontent.com/ytc/AIdro_lLp3SxQeehJxSmd_QCmSxpFBj4k-7X-brif7v9Jz0rBg=s160-c-k-c0x00ffffff-no-rj",
    message: "uploaded: Islamic Halaka : শেষ জামানার ফিতনা",
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
];

// Count unread notifications
const unreadCount = notifications.filter(n => n.isUnread).length;

const importantNotifications = notifications.filter(n => n.isUnread).slice(0, 3);
const moreNotifications = notifications.filter(n => !n.isUnread).slice(0, 3);

// ── Skeleton ──
function NotificationSkeleton() {
  return (
    <div className="flex gap-3 px-4 py-3">
      <Skeleton className="h-12 w-12 rounded-full flex-shrink-0" />
      <div className="flex-1 min-w-0 space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-3 w-20" />
      </div>
      <Skeleton className="h-[52px] w-[86px] rounded-lg flex-shrink-0" />
    </div>
  );
}

// ── Main Component ──
export default function NotificationDropdown() {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
        className="w-[400px] p-0 mr-4"
        align="end"
        sideOffset={8}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h2 className="font-semibold text-base">Notifications</h2>
          <button
            className="p-1.5 rounded-full hover:bg-muted transition-colors"
            aria-label="Notification settings"
          >
            <Settings className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="max-h-[500px] overflow-y-auto">
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
                  <div className="px-4 py-2">
                    <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Important
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
                  <div className="px-4 py-2 border-t">
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
                <div className="text-center py-12 px-4">
                  <Bell className="h-12 w-12 mx-auto text-muted-foreground/30 mb-3" />
                  <p className="text-sm text-muted-foreground">
                    No notifications yet
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

// ── Notification Item ──
function NotificationItem({ notification }: { notification: Notification }) {
  return (
    <Link
      href={notification.link}
      className={cn(
        "relative flex gap-3 px-4 py-3 hover:bg-muted/50 transition-colors group",
        notification.isUnread && "bg-primary/5"
      )}
    >


      {/* Channel Avatar */}
      <Avatar className="h-12 w-12 flex-shrink-0">
        <AvatarImage src={notification.channelAvatar} alt={notification.channelName} />
        <AvatarFallback className="text-xs">
          {notification.channelName.charAt(0)}
        </AvatarFallback>
      </Avatar>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p className="text-sm leading-relaxed line-clamp-2">
          <span className="font-medium">{notification.channelName}</span>
          {" "}
          <span className="text-muted-foreground">{notification.message}</span>
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {notification.timeAgo}
        </p>
      </div>

      {/* Thumbnail */}
      {notification.thumbnail && (
        <div className="relative w-[86px] h-[52px] rounded-lg overflow-hidden flex-shrink-0 bg-muted">
          <Image
            src={notification.thumbnail}
            alt=""
            fill
            className="object-cover"
          />
        </div>
      )}
    </Link>
  );
}