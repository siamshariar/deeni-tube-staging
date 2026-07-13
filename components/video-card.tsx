// components/video-card.tsx
"use client";

import { MoreVertical, Clock, Bookmark, Share, UserX, Flag, BookmarkCheck, EyeOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
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
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [open, setOpen] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showPlaylistDialog, setShowPlaylistDialog] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [hidden, setHidden] = useState(false);
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

  // Drawer items (mobile)
  const drawerItems = (
    <>
      <div className="flex items-center gap-3 px-4 py-3 hover:bg-muted cursor-pointer" onClick={() => { setOpen(false); setTimeout(() => setShowShareModal(true), 150); }}>
        <Share className="h-5 w-5" /><span>Share</span>
      </div>
      <div className="flex items-center gap-3 px-4 py-3 hover:bg-muted cursor-pointer" onClick={() => { setOpen(false); handleWatchLaterToggle(); }}>
        {saved ? <><BookmarkCheck className="h-5 w-5 fill-current text-primary" /><span className="text-primary">Saved</span></> : <><Clock className="h-5 w-5" /><span>Save to Watch later</span></>}
      </div>
      <div className="flex items-center gap-3 px-4 py-3 hover:bg-muted cursor-pointer" onClick={() => { setOpen(false); setTimeout(() => setShowPlaylistDialog(true), 150); }}>
        <Bookmark className="h-5 w-5" /><span>Save to playlist</span>
      </div>
      <div className="flex items-center gap-3 px-4 py-3 hover:bg-muted cursor-pointer" onClick={() => { setOpen(false); handleDontRecommend(); }}>
        <UserX className="h-5 w-5" /><span>Don't recommend channel</span>
      </div>
      <div className="flex items-center gap-3 px-4 py-3 hover:bg-muted cursor-pointer" onClick={() => { setOpen(false); handleNotInterested(); }}>
        <EyeOff className="h-5 w-5" /><span>Not interested</span>
      </div>
      <div className="flex items-center gap-3 px-4 py-3 hover:bg-muted cursor-pointer" onClick={() => { setOpen(false); setTimeout(() => setShowReportDialog(true), 150); }}>
        <Flag className="h-5 w-5" /><span>Report</span>
      </div>
    </>
  );

  // Dropdown items (desktop) — use onSelect+preventDefault for items that open modals
  const dropdownItems = (
    <>
      <DropdownMenuItem className="flex items-center gap-3 px-4 py-3 cursor-pointer" onSelect={(e) => { e.preventDefault(); setShowShareModal(true); }}>
        <Share className="h-5 w-5" /><span>Share</span>
      </DropdownMenuItem>
      <DropdownMenuItem className="flex items-center gap-3 px-4 py-3 cursor-pointer" onSelect={handleWatchLaterToggle}>
        {saved ? <><BookmarkCheck className="h-5 w-5 fill-current text-primary" /><span className="text-primary">Saved</span></> : <><Clock className="h-5 w-5" /><span>Save to Watch later</span></>}
      </DropdownMenuItem>
      <DropdownMenuItem className="flex items-center gap-3 px-4 py-3 cursor-pointer" onSelect={(e) => { e.preventDefault(); setShowPlaylistDialog(true); }}>
        <Bookmark className="h-5 w-5" /><span>Save to playlist</span>
      </DropdownMenuItem>
      <DropdownMenuItem className="flex items-center gap-3 px-4 py-3 cursor-pointer" onSelect={handleDontRecommend}>
        <UserX className="h-5 w-5" /><span>Don't recommend channel</span>
      </DropdownMenuItem>
      <DropdownMenuItem className="flex items-center gap-3 px-4 py-3 cursor-pointer" onSelect={handleNotInterested}>
        <EyeOff className="h-5 w-5" /><span>Not interested</span>
      </DropdownMenuItem>
      <DropdownMenuItem className="flex items-center gap-3 px-4 py-3 cursor-pointer" onSelect={(e) => { e.preventDefault(); setShowReportDialog(true); }}>
        <Flag className="h-5 w-5" /><span>Report</span>
      </DropdownMenuItem>
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
          {isMobile ? (
            <Drawer open={open} onOpenChange={setOpen}>
              <DrawerTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full self-start" onClick={e => e.stopPropagation()}>
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </DrawerTrigger>
              <DrawerContent className="px-0 max-h-[70vh]">
                <div className="mt-2 pb-6">{drawerItems}</div>
              </DrawerContent>
            </Drawer>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full self-start" onClick={e => e.stopPropagation()}>
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-60 p-0 rounded-xl">{dropdownItems}</DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
        <ShareModal isOpen={showShareModal} onClose={() => setShowShareModal(false)} videoUrl={videoUrl} />
        <AddToPlaylistDialog video={{ id: videoId, title, channel }} open={showPlaylistDialog} onOpenChange={setShowPlaylistDialog} />
        <ReportDialog videoTitle={title} videoId={videoId} open={showReportDialog} onOpenChange={setShowReportDialog} />
      </div>
    );
  }

  // Desktop grid card
  return (
    <div className="group/card flex flex-col border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 bg-card">
      <Link href={videoLink} className="block relative overflow-hidden">
        <div className="relative aspect-video w-full">
          <Image src={thumbnail} alt={title} fill className="object-cover transition-transform duration-300 group-hover/card:scale-105" />
          <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-1 py-0.5 rounded font-medium">{duration}</div>
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover/card:opacity-100 transition-opacity flex items-center justify-center">
            <div className="bg-black/60 rounded-full p-2.5">
              <svg viewBox="0 0 24 24" className="h-5 w-5 text-white fill-white"><path d="M8 5v14l11-7z"/></svg>
            </div>
          </div>
        </div>
      </Link>
      <div className="p-3 flex-1 flex flex-col gap-1">
        {/* Title + three‑dot menu */}
        <div className="flex items-start justify-between gap-1">
          <Link href={videoLink} className="line-clamp-2 font-medium text-sm hover:text-primary transition-colors flex-1 leading-snug">
            {title}
          </Link>
          {isMobile ? (
            <Drawer open={open} onOpenChange={setOpen}>
              <DrawerTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full flex-shrink-0 -mr-1" onClick={e => e.stopPropagation()}>
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DrawerTrigger>
              <DrawerContent className="px-0 max-h-[70vh]">
                <div className="mt-2 pb-6">{drawerItems}</div>
              </DrawerContent>
            </Drawer>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full flex-shrink-0 -mr-1" onClick={e => e.stopPropagation()}>
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-60 p-0 rounded-xl">{dropdownItems}</DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Channel row with avatar */}
        <Link href={channelLink} className="flex items-center gap-1.5 mt-0.5 group/ch">
          <Avatar className="h-5 w-5 flex-shrink-0">
            <AvatarImage src={channelAvatar} />
            <AvatarFallback className="text-[9px]">{channel.charAt(0)}</AvatarFallback>
          </Avatar>
          <span className="text-xs text-muted-foreground group-hover/ch:text-foreground transition-colors truncate">{channel}</span>
        </Link>

        {/* Views and time */}
        <div className="text-muted-foreground text-xs flex items-center gap-1">
          <span>{views}</span><span>•</span><span>{timestamp}</span>
        </div>
      </div>
      <ShareModal isOpen={showShareModal} onClose={() => setShowShareModal(false)} videoUrl={videoUrl} />
      <AddToPlaylistDialog video={{ id: videoId, title, channel }} open={showPlaylistDialog} onOpenChange={setShowPlaylistDialog} />
      <ReportDialog videoTitle={title} videoId={videoId} open={showReportDialog} onOpenChange={setShowReportDialog} />
    </div>
  );
}