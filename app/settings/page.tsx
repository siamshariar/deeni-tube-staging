"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Settings, Moon, Globe, Shield, Bell, Users, HelpCircle, Info, ChevronRight } from "lucide-react"
import AppHeader from "@/components/app-header"
import MobileNav from "@/components/mobile-nav"
import DesktopSidebar from "@/components/desktop-sidebar"

const settingsSections = [
  { icon: Users, label: "Account", description: "Manage your account settings", href: "/you-new" },
  { icon: Bell, label: "Notifications", description: "Notification preferences", href: "#" },
  { icon: Shield, label: "Privacy", description: "Privacy and safety settings", href: "#" },
  { icon: Globe, label: "Language", description: "English", href: "#" },
  { icon: Moon, label: "Appearance", description: "Light theme", href: "#" },
  { icon: Info, label: "About", description: "Version 1.0.0", href: "#" },
  { icon: HelpCircle, label: "Help & Support", description: "Get help and contact us", href: "#" },
]

export default function SettingsPage() {
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
            <h1 className="font-semibold text-lg">Settings</h1>
          </div>
          <div className="max-w-lg mx-auto">
            <div className="flex items-center gap-2 px-4 py-4">
              <Settings className="h-5 w-5" />
              <h1 className="text-2xl font-bold hidden md:block">Settings</h1>
            </div>
            <div className="divide-y">
              {settingsSections.map((item) => (
                <button
                  key={item.label}
                  onClick={() => item.href !== "#" ? router.push(item.href) : null}
                  className="w-full flex items-center gap-4 px-4 py-4 hover:bg-muted/50 transition-colors text-left"
                >
                  <item.icon className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      <MobileNav />
    </div>
  )
}