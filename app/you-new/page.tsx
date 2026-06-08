"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, ChevronRight, Globe, Tv, LogOut, Check } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import AppHeader from "@/components/app-header"
import MobileNav from "@/components/mobile-nav"
import DesktopSidebar from "@/components/desktop-sidebar"

const languageOptions = [
  { code: "en", name: "English", short: "En" },
  { code: "ar", name: "Arabic", short: "Ar" },
  { code: "hi", name: "Hindi", short: "Hi" },
  { code: "bn", name: "Bengali", short: "Bn" },
  { code: "ur", name: "Urdu", short: "Ur" },
  { code: "tr", name: "Turkish", short: "Tr" },
  { code: "es", name: "Spanish", short: "Es" },
  { code: "fr", name: "French", short: "Fr" },
]

const preferredLanguageOptions = [
  { code: "ar", name: "Arabic" },
  { code: "hi", name: "Hindi" },
  { code: "bn", name: "Bengali" },
  { code: "ur", name: "Urdu" },
  { code: "tr", name: "Turkish" },
]

export default function YouPage() {
  const router = useRouter()
  const [defaultLanguage, setDefaultLanguage] = useState("en")
  const [preferredLanguages, setPreferredLanguages] = useState<string[]>(["ar", "hi", "bn"])
  const [showFirstTimePopup, setShowFirstTimePopup] = useState(true)

  const handlePreferredLanguageToggle = (code: string) => {
    setPreferredLanguages((prev) =>
      prev.includes(code) ? prev.filter((l) => l !== code) : [...prev, code]
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* First Time Sign In Language Popup */}
      <Dialog open={showFirstTimePopup} onOpenChange={setShowFirstTimePopup}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              Language Preference
            </DialogTitle>
            <DialogDescription>
              Select your preferred languages to personalize your content feed
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="border rounded-lg divide-y">
              {preferredLanguageOptions.map((lang) => {
                const isSelected = preferredLanguages.includes(lang.code)
                return (
                  <button
                    key={lang.code}
                    onClick={() => handlePreferredLanguageToggle(lang.code)}
                    className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted/50 transition-colors"
                  >
                    <span className="text-sm">{lang.name}</span>
                    <span
                      className={`h-5 w-5 rounded border flex items-center justify-center flex-shrink-0 ${
                        isSelected
                          ? "bg-primary border-primary text-primary-foreground"
                          : "border-border"
                      }`}
                    >
                      {isSelected && <Check className="h-3.5 w-3.5" />}
                    </span>
                  </button>
                )
              })}
            </div>
            <Button
              className="w-full"
              onClick={() => setShowFirstTimePopup(false)}
            >
              Continue
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AppHeader />

      <div className="flex">
        <DesktopSidebar className="hidden md:block" />

        <main className="flex-1 md:pl-[240px] pt-[56px] md:pt-[80px] pb-nav-safe md:pb-6">
          {/* Mobile Back + Title */}
          <div className="md:hidden flex items-center gap-3 px-4 py-2 border-b">
            <button
              onClick={() => router.back()}
              className="flex items-center justify-center h-9 w-9 rounded-full hover:bg-muted transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="font-semibold text-lg">Settings</h1>
          </div>

          <div className="max-w-lg mx-auto">
            {/* User Profile Section */}
            <div className="px-4 pt-6 pb-4">
              <div className="flex items-center gap-4 p-4 rounded-xl bg-muted/40 border">
                <Avatar className="h-16 w-16">
                  <AvatarImage src="/placeholder.svg?height=64&width=64" />
                  <AvatarFallback className="text-lg font-semibold bg-primary text-primary-foreground">
                    UN
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-base">User Name</p>
                  <p className="text-sm text-muted-foreground">email@gmail.com</p>
                  <button className="mt-1 flex items-center gap-1 text-sm text-destructive hover:opacity-80 transition-opacity">
                    <LogOut className="h-3.5 w-3.5" />
                    Sign out
                  </button>
                </div>
              </div>
            </div>

            {/* Language Preference Section */}
            <div className="mx-4 mb-3 rounded-xl border overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 bg-muted/30 border-b">
                <Globe className="h-4 w-4 text-primary" />
                <h2 className="font-semibold text-sm">Language preference</h2>
              </div>

              <div className="p-4 space-y-4">
                {/* Default Language */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Default language</p>
                    <p className="text-xs text-muted-foreground">Used across the app</p>
                  </div>
                  <Select value={defaultLanguage} onValueChange={setDefaultLanguage}>
                    <SelectTrigger className="w-32 h-9 text-sm">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="w-44">
                      {languageOptions.map((lang) => (
                        <SelectItem key={lang.code} value={lang.code}>
                          {lang.short} - {lang.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Preferred Languages */}
                <div>
                  <p className="text-sm font-medium mb-2">Preferred languages</p>
                  <div className="border rounded-lg divide-y">
                    {preferredLanguageOptions.map((lang) => {
                      const isSelected = preferredLanguages.includes(lang.code)
                      return (
                        <button
                          key={lang.code}
                          onClick={() => handlePreferredLanguageToggle(lang.code)}
                          className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted/50 transition-colors"
                        >
                          <span className="text-sm">{lang.name}</span>
                          <span
                            className={`h-5 w-5 rounded border flex items-center justify-center flex-shrink-0 ${
                              isSelected
                                ? "bg-primary border-primary text-primary-foreground"
                                : "border-border"
                            }`}
                          >
                            {isSelected && <Check className="h-3.5 w-3.5" />}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                  <p className="text-xs text-muted-foreground italic mt-2">
                    Shown as a prompt after first sign-in
                  </p>
                </div>
              </div>
            </div>

            {/* Channel Preference Section */}
            <div className="mx-4 mb-3 rounded-xl border overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 bg-muted/30 border-b">
                <Tv className="h-4 w-4 text-primary" />
                <h2 className="font-semibold text-sm">Channel preference</h2>
              </div>
              <Link
                href="/channels"
                className="flex items-center justify-between px-4 py-3.5 hover:bg-muted/50 transition-colors group"
              >
                <div>
                  <p className="text-sm font-medium">Manage channels</p>
                  <p className="text-xs text-muted-foreground">Customize your channel feed</p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
              </Link>
            </div>
          </div>
        </main>
      </div>

      <MobileNav />
    </div>
  )
}