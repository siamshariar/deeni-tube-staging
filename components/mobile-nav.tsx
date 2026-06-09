"use client"

import Link from "next/link"
import { Home, Users, GraduationCap, BookOpen, PlaySquare } from "lucide-react"
import { usePathname } from "next/navigation"

const navItems = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/channels", icon: Users, label: "Channels" },
  { href: "/scholars", icon: GraduationCap, label: "Scholars" },
  { href: "/playlists", icon: BookOpen, label: "Playlists" },
]

export default function MobileNav() {
  const pathname = usePathname()

  return (
    <>
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
    </>
  )
}