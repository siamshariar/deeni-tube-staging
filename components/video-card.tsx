// components/video-card.tsx
"use client";

import { MoreVertical, Clock, Bookmark, Share, UserX, Ban, Flag, BookmarkCheck, EyeOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useMediaQuery } from "@/hooks/use-media-query";
import { useWatchLater } from "@/hooks/useWatchLater";
import { useFeedPreferences } from "@/hooks/useFeedPreferences";
import { useLanguage } from "@/hooks/use-language";
import { AddToPlaylistDialog } from "@/components/add-to-playlist-dialog";
import { ShareModal } from "@/components/share-modal";
import { ReportDialog } from "@/components/report-dialog";
import { toast } from "sonner";

interface VideoCardProps {
  isHorizontal?: boolean;
  videoId: string;
  title: string;
  channel: string;
  channelId: string;
  channelAvatar: string;
  views: string;
  timestamp: string;
  duration: string;
  thumbnail: string;
}

export default function VideoCard({
  isHorizontal = false,
  videoId,
  title,
  channel,
  channelId,
  channelAvatar,
  views,
  timestamp,
  duration,
  thumbnail,
}: VideoCardProps) {
  const [open, setOpen] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [hidden, setHidden] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const { addToWatchLater, removeFromWatchLater, isInWatchLater } = useWatchLater();
  const { toggleFollowChannel, isFollowed } = useFeedPreferences();
  const { isGuest } = useLanguage();

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setSaved(isInWatchLater(videoId));
  }, [videoId, isInWatchLater]);

  const handleWatchLaterToggle = () => {
    if (saved) {
      removeFromWatchLater(videoId);
      toast.success("Removed from Watch Later");
      setSaved(false);
    } else {
      addToWatchLater({
        id: videoId,
        title,
        channel,
        channelAvatar,
        thumbnail,
        views,
        timeAgo: timestamp,
        duration,
        addedAt: Date.now(),
      });
      toast.success("Added to Watch Later");
      setSaved(true);
    }
  };

  const handleDontRecommend = () => {
    if (isGuest) {
      toast.error("Please sign in to manage channel feed", {
        action: {
          label: "Sign in",
          onClick: () => window.location.href = "/signin",
        },
      });
      return;
    }
    toggleFollowChannel(channelId);
    toast.success(`Channel ${isFollowed(channelId) ? "removed from" : "added to"} feed`);
  };

  const handleNotInterested = () => {
    setHidden(true);
    toast("Video removed", {
      description: "We won't show this video again",
      action: {
        label: "Undo",
        onClick: () => setHidden(false),
      },
      duration: 5000,
    });
  };

  const videoUrl = `${window.location.origin}/videos/${channel}/${videoId}`;

  if (hidden) return null;

  const menuItems = (
    <>
      <div className="flex items-center gap-3 px-4 py-3 hover:bg-muted cursor-pointer" onClick={() => setShowShareModal(true)}>
        <Share className="h-5 w-5" />
        <span>Share</span>
      </div>
      <div className="flex items-center gap-3 px-4 py-3 hover:bg-muted cursor-pointer" onClick={handleWatchLaterToggle}>
        {saved ? (
          <>
            <BookmarkCheck className="h-5 w-5 fill-current text-primary" />
            <span className="text-primary">Saved</span>
          </>
        ) : (
          <>
            <Clock className="h-5 w-5" />
            <span>Save to Watch later</span>
          </>
        )}
      </div>
      <AddToPlaylistDialog
        video={{ id: videoId, title, channel }}
        onAdded={() => toast.success("Added to playlist")}
      >
        <div className="flex items-center gap-3 px-4 py-3 hover:bg-muted cursor-pointer">
          <Bookmark className="h-5 w-5" />
          <span>Save to playlist</span>
        </div>
      </AddToPlaylistDialog>
      <div className="flex items-center gap-3 px-4 py-3 hover:bg-muted cursor-pointer" onClick={handleDontRecommend}>
        <UserX className="h-5 w-5" />
        <span>Don't recommend channel</span>
      </div>
      <div className="flex items-center gap-3 px-4 py-3 hover:bg-muted cursor-pointer" onClick={handleNotInterested}>
        <EyeOff className="h-5 w-5" />
        <span>Not interested</span>
      </div>
      <ReportDialog videoTitle={title} videoId={videoId}>
        <div className="flex items-center gap-3 px-4 py-3 hover:bg-muted cursor-pointer">
          <Flag className="h-5 w-5" />
          <span>Report</span>
        </div>
      </ReportDialog>
    </>
  );

  const videoLink = `/videos/${channel}/${videoId}`;
  const channelLink = `/channel-new/${channelId}`;

  if (isHorizontal) {
    // Mobile horizontal list – unchanged
    return (
      <div className="flex flex-col p-3">
        <Link href={videoLink} className="block">
          <div className="relative aspect-video w-full">
            <Image src={thumbnail} alt={title} fill className="object-cover rounded-lg" />
            <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1 py-0.5 rounded">{duration}</div>
          </div>
        </Link>
        <div className="flex mt-3 gap-3">
          <Link href={channelLink} className="flex-shrink-0">
            <Avatar className="h-9 w-9">
              <AvatarImage src={channelAvatar} />
              <AvatarFallback>{channel.charAt(0)}</AvatarFallback>
            </Avatar>
          </Link>
          <div className="flex-1 min-w-0">
            <Link href={videoLink} className="line-clamp-2 font-medium text-sm">{title}</Link>
            <Link href={channelLink} className="text-muted-foreground text-xs mt-1 block">{channel}</Link>
            <div className="text-muted-foreground text-xs flex items-center gap-1">
              <span>{views}</span><span>•</span><span>{timestamp}</span>
            </div>
          </div>
          {isDesktop ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full self-start" onClick={e => e.stopPropagation()}>
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[240px] p-0 rounded-xl">{menuItems}</DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Drawer open={open} onOpenChange={setOpen}>
              <DrawerTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full self-start" onClick={e => { e.stopPropagation(); setOpen(true); }}>
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </DrawerTrigger>
              <DrawerContent className="px-0 max-h-[70vh]">
                <div className="mt-2 pb-6">{menuItems}</div>
              </DrawerContent>
            </Drawer>
          )}
        </div>
        <ShareModal isOpen={showShareModal} onClose={() => setShowShareModal(false)} videoUrl={videoUrl} />
      </div>
    );
  }

  // Desktop grid card – new style matching playlist cards
  return (
    <div className="flex flex-col border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-card">
      <Link href={videoLink} className="block">
        <div className="relative aspect-video w-full">
          <Image src={thumbnail} alt={title} fill className="object-cover" />
          <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1 py-0.5 rounded">{duration}</div>
        </div>
      </Link>
      <div className="p-3 space-y-1">
        {/* Title + three‑dot menu */}
        <div className="flex items-start justify-between gap-1">
          <Link href={videoLink} className="line-clamp-2 font-medium text-sm hover:text-primary transition-colors flex-1">
            {title}
          </Link>
          {isDesktop ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full flex-shrink-0 -mr-1" onClick={e => e.stopPropagation()}>
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[240px] p-0 rounded-xl">{menuItems}</DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Drawer open={open} onOpenChange={setOpen}>
              <DrawerTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full flex-shrink-0 -mr-1" onClick={e => { e.stopPropagation(); setOpen(true); }}>
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </DrawerTrigger>
              <DrawerContent className="px-0 max-h-[70vh]">
                <div className="mt-2 pb-6">{menuItems}</div>
              </DrawerContent>
            </Drawer>
          )}
        </div>

        {/* Channel name */}
        <Link href={channelLink} className="text-muted-foreground text-xs block hover:text-foreground transition-colors">
          {channel}
        </Link>

        {/* Views and time */}
        <div className="text-muted-foreground text-xs flex items-center gap-1">
          <span>{views}</span><span>•</span><span>{timestamp}</span>
        </div>
      </div>
      <ShareModal isOpen={showShareModal} onClose={() => setShowShareModal(false)} videoUrl={videoUrl} />
    </div>
  );
}