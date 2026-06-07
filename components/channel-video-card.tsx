"use client"

import type React from "react"

import Image from "next/image"
import Link from "next/link"
import { MoreVertical, Clock, Bookmark, Download, Share, Ban } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer"
import { useState } from "react"

interface Video {
  id: string
  title: string
  thumbnail: string
  views: string
  timeAgo: string
  duration: string
}

interface ChannelVideoCardProps {
  video: Video
}

export default function ChannelVideoCard({ video }: ChannelVideoCardProps) {
  const [open, setOpen] = useState(false)

  const handleMoreClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setOpen(true)
  }

  const menuItems = (
    <>
      <div className="flex items-center gap-3 px-4 py-3 hover:bg-muted cursor-pointer">
        <Clock className="h-5 w-5" />
        <span>Save to Watch later</span>
      </div>
      <div className="flex items-center gap-3 px-4 py-3 hover:bg-muted cursor-pointer">
        <Bookmark className="h-5 w-5" />
        <span>Save to playlist</span>
      </div>
      <div className="flex items-center gap-3 px-4 py-3 hover:bg-muted cursor-pointer">
        <Download className="h-5 w-5" />
        <span>Download video</span>
      </div>
      <div className="flex items-center gap-3 px-4 py-3 hover:bg-muted cursor-pointer">
        <Share className="h-5 w-5" />
        <span>Share</span>
      </div>
      <div className="flex items-center gap-3 px-4 py-3 hover:bg-muted cursor-pointer">
        <Ban className="h-5 w-5" />
        <span>Not interested</span>
      </div>
    </>
  )

  return (
    <Link href={`/video/${video.id}`} className="flex gap-3 p-3 border-b">
      <div className="relative w-40 h-24 flex-shrink-0">
        <Image
          src={
            video.thumbnail && video.thumbnail !== ""
              ? video.thumbnail
              : `/placeholder.svg?height=480&width=854&query=video+thumbnail`
          }
          alt={video.title}
          fill
          className="object-cover rounded-lg"
        />
        <div className="absolute bottom-1 right-1 bg-black bg-opacity-80 text-white text-xs px-1 py-0.5 rounded">
          {video.duration}
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-sm line-clamp-2">{video.title}</h3>
        <div className="text-muted-foreground text-xs mt-1">
          <span>{video.views}</span>
          <span> • </span>
          <span>{video.timeAgo}</span>
        </div>
      </div>
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full self-start flex-shrink-0"
            onClick={handleMoreClick}
          >
            <MoreVertical className="h-5 w-5" />
          </Button>
        </DrawerTrigger>
        <DrawerContent className="px-0 max-h-[70vh]">
          <div className="mt-2 pb-6">{menuItems}</div>
        </DrawerContent>
      </Drawer>
    </Link>
  )
}
