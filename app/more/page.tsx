"use client"

import { useRouter } from "next/navigation"
import { ArrowLeft, Globe, Info, Star, Heart, AppWindow } from "lucide-react"
import Link from "next/link"
import AppHeader from "@/components/app-header"
import MobileNav from "@/components/mobile-nav"
import DesktopSidebar from "@/components/desktop-sidebar"

const menuItems = [
  { icon: Globe, label: "Quran Translations", href: "/quran-translations" },
  { icon: Info, label: "About", href: "#" },
  { icon: Star, label: "Rate & Review App", href: "#" },
  { icon: Heart, label: "Donate", href: "#" },
  { icon: AppWindow, label: "More Apps", href: "#" },
]

export default function MorePage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <div className="flex">
        <DesktopSidebar className="hidden md:block" />
        <div className="flex-1 md:pl-[240px] pt-[56px] md:pt-[80px] pb-nav-safe md:pb-6">
          <div className="md:hidden flex items-center gap-3 px-4 py-2 border-b">
            <button onClick={() => router.back()} className="flex items-center justify-center h-9 w-9 rounded-full hover:bg-muted transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="font-semibold text-lg">More</h1>
          </div>
          <div className="max-w-lg mx-auto">
            <h1 className="hidden md:block text-2xl font-bold px-4 py-4">More</h1>
            <div className="divide-y">
              {menuItems.map((item) => (
                <Link key={item.label} href={item.href} className="flex items-center gap-4 px-4 py-4 hover:bg-muted/50 transition-colors">
                  <item.icon className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm">{item.label}</span>
                </Link>
              ))}
            </div>
            <div className="px-4 py-8 text-center">
              <p className="text-xs text-muted-foreground">Powered By - Deeni Info Tech</p>
            </div>
          </div>
        </div>
      </div>
      <MobileNav />
    </div>
  )
}