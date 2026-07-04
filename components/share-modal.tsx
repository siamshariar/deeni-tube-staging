"use client"

import { useState, useEffect, useRef } from "react"
import { X, Copy, Check, ChevronLeft, ChevronRight } from "lucide-react"

const sharePlatforms = [
  {
    name: "Facebook",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48">
        <linearGradient id="fb5" x1="9.993%" x2="89.993%" y1="0%" y2="100%">
          <stop offset="0%" stopColor="#18B5FE" />
          <stop offset="100%" stopColor="#1277F2" />
        </linearGradient>
        <path fill="url(#fb5)" d="M24 4C12.954 4 4 12.954 4 24s8.954 20 20 20 20-8.954 20-20S35.046 4 24 4z" />
        <path fill="#fff" d="M26.707 36.301V25.5h3.613l.543-4.215h-4.156v-2.699c0-1.227.336-2.054 2.082-2.054h2.227V12.66c-.387-.047-1.707-.16-3.25-.16-3.207 0-5.41 1.957-5.41 5.559v3.102H19v4.215h3.656V36.3h4.051z" />
      </svg>
    ),
  },
  {
    name: "WhatsApp",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48">
        <path fill="#fff" d="M4.9 43.3l2.7-9.8C5.5 30.3 4.5 26.7 4.5 23 4.5 12.3 13.3 3.5 24 3.5S43.5 12.3 43.5 23 34.7 42.5 24 42.5c-3.5 0-6.9-.9-9.9-2.7l-9.2 3.5z" />
        <path fill="#25D366" d="M24 5c9.9 0 18 8.1 18 18s-8.1 18-18 18c-3.2 0-6.2-.8-8.9-2.4l-1-.6-5.5 2.1 1.5-5.3-.7-1.1C5.7 31.1 5 28.6 5 26 5 16.1 13.1 8 23 8h1v-3z" />
        <path fill="#fff" d="M35.5 26.8c-.4-.2-2.6-1.3-3-1.4-.4-.2-.7-.3-1 .2-.3.4-1.1 1.4-1.4 1.7-.3.3-.5.3-1 .1-.4-.2-1.9-.7-3.6-2.3-1.3-1.2-2.2-2.7-2.5-3.1-.3-.4 0-.7.2-.9.2-.2.4-.5.7-.8.2-.3.3-.5.5-.8.2-.3.1-.6 0-.8-.1-.2-.9-2.4-1.2-3.3-.3-.9-.7-.8-1-.8-.3 0-.6 0-.9 0-.3 0-.8.1-1.2.6-.4.5-1.6 1.5-1.6 3.7s1.6 4.3 1.8 4.6c.2.3 3.2 4.9 7.7 6.9 1.1.5 1.9.8 2.6 1 1.1.3 2.1.3 2.9.2.9-.1 2.6-1.1 3-2.1.4-1 .4-1.9.3-2.1-.2-.2-.4-.3-.8-.5z" />
      </svg>
    ),
  },
  {
    name: "X",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48">
        <path fill="#000" d="M24 4C12.954 4 4 12.954 4 24s8.954 20 20 20 20-8.954 20-20S35.046 4 24 4z" />
        <path fill="#fff" d="M13 14h7.5l5.6 8 8.9-8h3.5l-10.3 9.3L38 34h-7.5l-6.3-9-9.2 9H11l10.8-9.8L13 14zm5 2.5h3l13 15h-3l-13-15z" />
      </svg>
    ),
  },
]

interface ShareModalProps {
  isOpen: boolean
  onClose: () => void
  videoUrl: string
}

export function ShareModal({ isOpen, onClose, videoUrl }: ShareModalProps) {
  const [copied, setCopied] = useState(false)
  const shareContainerRef = useRef<HTMLDivElement>(null)
  const [showLeftArrow, setShowLeftArrow] = useState(false)
  const [showRightArrow, setShowRightArrow] = useState(true)

  const handleCopy = () => {
    navigator.clipboard.writeText(videoUrl).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  const checkScroll = () => {
    const el = shareContainerRef.current
    if (!el) return
    setShowLeftArrow(el.scrollLeft > 10)
    setShowRightArrow(el.scrollLeft < el.scrollWidth - el.clientWidth - 10)
  }

  useEffect(() => {
    const el = shareContainerRef.current
    if (el) {
      el.addEventListener("scroll", checkScroll)
      checkScroll()
      return () => el.removeEventListener("scroll", checkScroll)
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />

      {/* Sheet (mobile) / Dialog (desktop) */}
      <div
        className="
          share-modal-sheet md:share-modal-dialog
          relative bg-card w-full md:w-[90vw] md:max-w-[540px]
          rounded-t-2xl md:rounded-2xl
          overflow-hidden shadow-2xl
        "
      >
        {/* Drag handle — mobile only */}
        <div className="flex justify-center pt-3 pb-1 md:hidden">
          <div className="w-10 h-1 rounded-full bg-muted-foreground/30" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <h2 className="text-foreground text-lg font-semibold">Share</h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground p-1.5 rounded-full hover:bg-muted transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Share platform icons */}
        <div className="relative px-3 py-4">
          {showLeftArrow && (
            <button
              onClick={() => shareContainerRef.current?.scrollBy({ left: -250, behavior: "smooth" })}
              className="absolute left-1 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-background/90 hover:bg-background flex items-center justify-center shadow-md"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          )}
          {showRightArrow && (
            <button
              onClick={() => shareContainerRef.current?.scrollBy({ left: 250, behavior: "smooth" })}
              className="absolute right-1 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-background/90 hover:bg-background flex items-center justify-center shadow-md"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          )}
          <div
            ref={shareContainerRef}
            className="flex gap-3 overflow-x-auto scrollbar-none px-2 py-1"
          >
            {sharePlatforms.map((p) => (
              <button
                key={p.name}
                className="flex flex-col items-center gap-2 flex-shrink-0 w-[68px] group"
              >
                <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                  {p.icon}
                </div>
                <span className="text-[11px] text-muted-foreground group-hover:text-foreground text-center leading-tight truncate w-full">
                  {p.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* URL copy row */}
        <div
          className="px-4 pb-5"
          style={{ paddingBottom: "calc(1.25rem + env(safe-area-inset-bottom, 0px))" }}
        >
          <div className="flex items-center gap-2 bg-muted rounded-xl px-4 py-2.5 border border-border">
            <input
              type="text"
              value={videoUrl}
              readOnly
              className="flex-1 min-w-0 bg-transparent text-sm text-foreground outline-none truncate"
            />
            <button
              onClick={handleCopy}
              className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                copied
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
