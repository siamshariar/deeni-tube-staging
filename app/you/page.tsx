"use client"

import { useState } from "react"
import Link from "next/link"
import { ChevronDown, ChevronRight, Globe, Tv, LogOut } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import MobileNav from "@/components/mobile-nav"

const languageOptions = [
  { code: "en", name: "English", short: "En" },
  { code: "ar", name: "Arabic", short: "Ar" },
  { code: "hi", name: "Hindi", short: "Hi" },
  { code: "bn", name: "Bengali", short: "Bn" },
  { code: "es", name: "Spanish", short: "Es" },
  { code: "fr", name: "French", short: "Fr" },
  { code: "ur", name: "Urdu", short: "Ur" },
  { code: "tr", name: "Turkish", short: "Tr" },
]

const preferredLanguageOptions = [
  { code: "ar", name: "Arabic" },
  { code: "hi", name: "Hindi" },
  { code: "bn", name: "Bengali" },
  { code: "ur", name: "Urdu" },
  { code: "tr", name: "Turkish" },
]

export default function YouPage() {
  const [defaultLanguage, setDefaultLanguage] = useState("en")
  const [preferredLanguages, setPreferredLanguages] = useState<string[]>(["ar", "hi", "bn"])

  const handlePreferredLanguageToggle = (code: string) => {
    setPreferredLanguages((prev) =>
      prev.includes(code) ? prev.filter((l) => l !== code) : [...prev, code]
    )
  }

  return (
    <div className="min-h-screen bg-background pb-nav-safe md:pb-0">
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
                <SelectTrigger className="w-28 h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languageOptions.map((lang) => (
                    <SelectItem key={lang.code} value={lang.code}>
                      {lang.short} — {lang.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Preferred Languages */}
            <div>
              <p className="text-sm font-medium mb-2">Preferred languages</p>
              <div className="border rounded-lg divide-y">
                {preferredLanguageOptions.map((lang) => (
                  <label
                    key={lang.code}
                    htmlFor={`lang-${lang.code}`}
                    className="flex items-center gap-3 px-3 py-2.5 cursor-pointer hover:bg-muted/50 transition-colors"
                  >
                    <Checkbox
                      id={`lang-${lang.code}`}
                      checked={preferredLanguages.includes(lang.code)}
                      onCheckedChange={() => handlePreferredLanguageToggle(lang.code)}
                    />
                    <span className="text-sm">{lang.name}</span>
                  </label>
                ))}
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
            href="/subscriptions"
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

      <MobileNav />
    </div>
  )
}
