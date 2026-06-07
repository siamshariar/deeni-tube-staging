"use client"

import { X } from "lucide-react"
import { useEffect, useState } from "react"
import { useMediaQuery } from "@/hooks/use-media-query"

interface ShortsModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function ShortsModal({ isOpen, onClose }: ShortsModalProps) {
  const [mounted, setMounted] = useState(false)
  const isMobile = useMediaQuery("(max-width: 768px)")

  // Set mounted to true on client
  useEffect(() => {
    setMounted(true)
  }, [])

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  if (!mounted || !isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center"
      onClick={(e) => e.stopPropagation()}
    >
      <div
        className={`relative bg-background ${
          isMobile ? "w-full h-auto" : "w-full max-w-2xl rounded-md overflow-hidden shadow-lg"
        }`}
      >
        <div className="aspect-video w-full">
          <iframe
            src="https://www.youtube.com/embed/5qap5aO4i9A?autoplay=1"
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          ></iframe>
        </div>

        <div className="flex justify-between items-center p-3 border-t">
          <h3 className="font-medium line-clamp-1">Surah Al Baqarah Dengan Suara Indah Membuat Hati Tenang</h3>
          <button onClick={onClose} className="flex-shrink-0 ml-2 text-muted-foreground hover:text-foreground">
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
