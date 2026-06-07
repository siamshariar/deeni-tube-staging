"use client"

import type React from "react"

import { MoreVertical, ListPlus, Clock, Bookmark, Download, Share, Ban, UserX, Flag } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useMediaQuery } from "@/hooks/use-media-query"

interface VideoCardProps {
  isHorizontal?: boolean
}

export default function VideoCard({ isHorizontal = false }: VideoCardProps) {
  const [open, setOpen] = useState(false)
  const isDesktop = useMediaQuery("(min-width: 768px)")

  const handleMoreClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!isDesktop) {
      setOpen(true)
    }
  }

  const menuItems = (
    <>
      <div className="flex items-center gap-3 px-4 py-3 hover:bg-muted cursor-pointer">
        <ListPlus className="h-5 w-5" />
        <span>{isDesktop ? "Add to queue" : "Play next in queue"}</span>
      </div>
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
        <span>Download{isDesktop ? "" : " video"}</span>
      </div>
      <div className="flex items-center gap-3 px-4 py-3 hover:bg-muted cursor-pointer">
        <Share className="h-5 w-5" />
        <span>Share</span>
      </div>
      <div className="flex items-center gap-3 px-4 py-3 hover:bg-muted cursor-pointer">
        <Ban className="h-5 w-5" />
        <span>Not interested</span>
      </div>
      <div className="flex items-center gap-3 px-4 py-3 hover:bg-muted cursor-pointer">
        <UserX className="h-5 w-5" />
        <span>Don't recommend channel</span>
      </div>
      <div className="flex items-center gap-3 px-4 py-3 hover:bg-muted cursor-pointer">
        <Flag className="h-5 w-5" />
        <span>Report</span>
      </div>
    </>
  )

if (isHorizontal) {
    return (
      <div className="flex flex-col p-3">
        <Link href="#" className="block">
          <div className="relative aspect-video w-full">
            <Image
              src="/placeholder.svg?height=480&width=854"
              alt="Thumbnail"
              fill
              className="object-cover rounded-lg"
            />
            <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-1 py-0.5 rounded">
              18:28
            </div>
          </div>
        </Link>
        <div className="flex mt-3 gap-3">
          <Link href="#" className="flex-shrink-0">
            <Avatar className="h-9 w-9">
              <AvatarImage src="/placeholder.svg?height=36&width=36" />
              <AvatarFallback>YT</AvatarFallback>
            </Avatar>
          </Link>
          <div className="flex-1 min-w-0">
            <Link href="#" className="line-clamp-2 font-medium text-sm">
              নাসিরুদ্দীন আলবানী (রাহিঃ) কি সারাবিশ্বে একই দিনে ঈদ পালন করার পক্ষে মত দিয়েছেন?
            </Link>
            <Link href="#" className="text-muted-foreground text-xs mt-1 block">
              SOHIH ISLAMER POTHE
            </Link>
            <div className="text-muted-foreground text-xs flex items-center gap-1">
              <span>33K views</span>
              <span>•</span>
              <span>8 days ago</span>
            </div>
          </div>
          {isDesktop ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-full self-start flex-shrink-0"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreVertical className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[240px] p-0 rounded-xl">
                {menuItems}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
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
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <Link href="#" className="block">
        <div className="relative aspect-video w-full">
          <Image src="/placeholder.svg?height=480&width=854" alt="Thumbnail" fill className="object-cover rounded-lg" />
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-1 py-0.5 rounded">
            4:47
          </div>
        </div>
      </Link>
      <div className="flex mt-2 gap-2">
        <Link href="#" className="flex-shrink-0">
          <Avatar className="h-9 w-9">
            <AvatarImage src="/placeholder.svg?height=36&width=36" />
            <AvatarFallback>YT</AvatarFallback>
          </Avatar>
        </Link>
        <div className="flex-1 min-w-0">
          <Link href="#" className="line-clamp-2 font-medium text-sm">
            Heated Debate: Dr. Zakir Naik Gets Angry at an Atheist
          </Link>
          <Link href="#" className="text-muted-foreground text-xs mt-1 block">
            Daily Dawah
          </Link>
          <div className="text-muted-foreground text-xs">
            <span>208K views</span>
            <span> • </span>
            <span>6 days ago</span>
          </div>
        </div>
        {isDesktop ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full self-start flex-shrink-0"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreVertical className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[240px] p-0 rounded-xl">
              {menuItems}
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
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
        )}
      </div>
    </div>
  )
}
