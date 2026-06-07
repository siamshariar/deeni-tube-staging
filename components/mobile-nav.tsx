"use client"

import Link from "next/link"
import { Home, PlaySquare, BookOpen, User, Search } from "lucide-react"
import { useState } from "react"
import { usePathname } from "next/navigation"
import ShortsModal from "./shorts-modal"

const navItems = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/search", icon: Search, label: "Search" },
  { href: "/subscriptions", icon: BookOpen, label: "Subscriptions" },
  { href: "/you", icon: User, label: "You" },
]

export default function MobileNav() {
  const [shortsModalOpen, setShortsModalOpen] = useState(false)
  const pathname = usePathname()

  return (
    <>
      {/* Spacer so page content isn't hidden behind the fixed nav */}
      <div
        className="md:hidden"
        style={{ height: "calc(56px + env(safe-area-inset-bottom, 0px))" }}
        aria-hidden="true"
      />

      <nav
        className="fixed bottom-0 left-0 right-0 md:hidden z-50"
        style={{
          background: "hsl(var(--background) / 0.92)",
          backdropFilter: "saturate(180%) blur(20px)",
          WebkitBackdropFilter: "saturate(180%) blur(20px)",
          borderTop: "1px solid hsl(var(--border))",
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
        }}
        aria-label="Mobile navigation"
      >
        <div className="flex items-stretch justify-around h-14">
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
                  {/* Active pill indicator above icon */}
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

          {/* Shorts button */}
          <button
            onClick={() => setShortsModalOpen(true)}
            className="flex flex-col items-center justify-center flex-1 gap-0.5 min-h-[44px] text-muted-foreground hover:text-foreground transition-colors duration-150"
            aria-label="Open Shorts"
          >
            <div className="relative flex items-center justify-center">
              <PlaySquare className="h-6 w-6" strokeWidth={1.75} />
            </div>
            <span className="text-[10px] leading-none font-medium tracking-tight opacity-70">
              Shorts
            </span>
          </button>
        </div>
      </nav>

      <ShortsModal isOpen={shortsModalOpen} onClose={() => setShortsModalOpen(false)} />
    </>
  )
}
