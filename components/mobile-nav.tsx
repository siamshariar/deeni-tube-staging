// components/mobile-nav.tsx
"use client"

import Link from "next/link"
import { Home, Tv, GraduationCap, LayoutGrid, ListVideo } from "lucide-react"
import { usePathname } from "next/navigation"
import { useMediaQuery } from "@/hooks/use-media-query"

const navItems = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/channels", icon: Tv, label: "Channels" },
  { href: "/categories", icon: LayoutGrid, label: "Categories" },
  { href: "/scholars", icon: GraduationCap, label: "Scholars" },
  { href: "/playlists", icon: ListVideo, label: "Playlists" },
]

export default function MobileNav() {
  const pathname = usePathname()
  const isMobile = useMediaQuery("(max-width: 768px)")

  // Hide on desktop
  if (!isMobile) return null

  // Hide on all detail pages:
  //   /videos/... , /channels/[slug] , /scholars/[slug] ,
  //   /categories/[slug] , /playlists/[slug]/[id]  (anything deeper than list)
  const hideDetailPatterns = [
    "/videos/",
    "/channels/",
    "/scholars/",
    "/categories/",
    "/playlists/",
  ]

  // But keep navigation on exact list pages: /channels, /scholars, /categories, /playlists
  const showListPages = ["/channels", "/scholars", "/categories", "/playlists"]

  if (showListPages.includes(pathname)) {
    // Show mobile nav on list pages
  } else if (hideDetailPatterns.some(prefix => pathname?.startsWith(prefix))) {
    // Hide on any sub‑route of those patterns (detail pages)
    return null
  }

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50"
      style={{
        background: "hsl(var(--background) / 0.92)",
        backdropFilter: "saturate(180%) blur(20px)",
        WebkitBackdropFilter: "saturate(180%) blur(20px)",
        borderTop: "1px solid hsl(var(--border))",
        height: "calc(56px + env(safe-area-inset-bottom, 0px))",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
        display: "flex",
        alignItems: "center",
      }}
      aria-label="Mobile navigation"
    >
      <div className="flex items-stretch justify-around w-full h-14">
        {navItems.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center justify-center flex-1 gap-0.5 min-h-[44px] transition-colors duration-150 ${
                isActive
                  ? "text-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              aria-current={isActive ? "page" : undefined}
            >
              <div className="relative flex items-center justify-center">
                {isActive && (
                  <span
                    className="absolute -top-2 left-1/2 -translate-x-1/2 h-0.5 w-6 rounded-full bg-foreground"
                    aria-hidden="true"
                  />
                )}
                <Icon
                  className="h-6 w-6"
                  strokeWidth={isActive ? 2.25 : 1.75}
                />
              </div>
              <span
                className={`text-[10px] leading-none font-medium tracking-tight ${
                  isActive ? "opacity-100" : "opacity-70"
                }`}
              >
                {label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}