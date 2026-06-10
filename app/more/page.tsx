"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Globe, Info, Star, Heart, AppWindow, BookOpen, HelpCircle, Shield, MessageSquare, ChevronRight, FileText } from "lucide-react"
import Link from "next/link"
import AppHeader from "@/components/app-header"
import MobileNav from "@/components/mobile-nav"
import DesktopSidebar from "@/components/desktop-sidebar"
import { Skeleton } from "@/components/ui/skeleton"
import { useMediaQuery } from "@/hooks/use-media-query"

const menuItems = [
  { icon: BookOpen, label: "Quran Translations", description: "Recitations and translations", href: "/quran-translations" },
  { icon: Shield, label: "Privacy Policy", description: "How we handle your data", href: "/help" },
  { icon: FileText, label: "Terms of Service", description: "Read our terms", href: "/help" },
  { icon: Star, label: "Rate & Review App", description: "Share your feedback", href: "#" },
  { icon: Heart, label: "Donate", description: "Support our mission", href: "#" },
  { icon: AppWindow, label: "More Apps", description: "Explore our other apps", href: "#" },
  { icon: Info, label: "About", description: "Version 1.0.0", href: "/help" },
]

export default function MorePage() {
  const router = useRouter()
  const isMobile = useMediaQuery("(max-width: 768px)")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 400)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <div className="flex">
        <DesktopSidebar className="hidden md:block" />
        <div className="flex-1 md:pl-[240px] pt-[56px] md:pt-[80px] pb-nav-safe md:pb-6">
          <div className="md:hidden flex items-center gap-3 px-4 py-3 border-b sticky top-[56px] bg-background z-10">
            <button onClick={() => router.back()} className="flex items-center justify-center h-9 w-9 rounded-full hover:bg-muted transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="font-semibold text-lg">More</h1>
          </div>

          <div className="max-w-[600px] mx-auto px-4 md:px-6">
            {!isMobile && (
              <div className="py-4 md:py-6">
                <h1 className="text-2xl font-bold">More</h1>
                <p className="text-sm text-muted-foreground mt-1">Additional features and information</p>
              </div>
            )}

            {isLoading ? (
              <div className="divide-y">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-4 px-1 py-4">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-48" />
                    </div>
                    <Skeleton className="h-4 w-4" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="divide-y">
                {menuItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="flex items-center gap-4 px-1 py-4 hover:bg-muted/50 transition-colors rounded-lg group"
                  >
                    <div className="h-10 w-10 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                      <item.icon className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium">{item.label}</p>
                      {item.description && (
                        <p className="text-xs text-muted-foreground">{item.description}</p>
                      )}
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  </Link>
                ))}
              </div>
            )}

            <div className="py-8 text-center">
              <p className="text-xs text-muted-foreground">Powered By - Deeni Info Tech</p>
            </div>
          </div>
        </div>
      </div>
      <MobileNav />
    </div>
  )
}