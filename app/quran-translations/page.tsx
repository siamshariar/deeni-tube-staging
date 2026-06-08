"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Play } from "lucide-react"
import AppHeader from "@/components/app-header"
import MobileNav from "@/components/mobile-nav"
import DesktopSidebar from "@/components/desktop-sidebar"
import { Button } from "@/components/ui/button"

const surahs = [
  { id: 1, name: "Al-Fatiha", nameArabic: "الفاتحة", translation: "The Opening", verses: 7 },
  { id: 2, name: "Al-Baqarah", nameArabic: "البقرة", translation: "The Cow", verses: 286 },
  { id: 3, name: "Aal-E-Imran", nameArabic: "آل عمران", translation: "Family of Imran", verses: 200 },
  { id: 36, name: "Ya-Sin", nameArabic: "يس", translation: "Ya Sin", verses: 83 },
  { id: 67, name: "Al-Mulk", nameArabic: "الملك", translation: "The Sovereignty", verses: 30 },
  { id: 112, name: "Al-Ikhlas", nameArabic: "الإخلاص", translation: "Sincerity", verses: 4 },
  { id: 113, name: "Al-Falaq", nameArabic: "الفلق", translation: "The Dawn", verses: 5 },
  { id: 114, name: "An-Nas", nameArabic: "الناس", translation: "Mankind", verses: 6 },
]

const languages = [
  { code: "bn", label: "Bengali" },
  { code: "ar", label: "Arabic" },
  { code: "en", label: "English" },
]

export default function QuranTranslationsPage() {
  const router = useRouter()
  const [selectedLang, setSelectedLang] = useState("en")

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
            <h1 className="font-semibold text-lg">Quran Translations</h1>
          </div>

          <div className="max-w-2xl mx-auto px-4">
            <h1 className="hidden md:block text-2xl font-bold py-4">Quran Translations</h1>

            {/* Language Selector */}
            <div className="flex gap-2 py-3 border-b">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setSelectedLang(lang.code)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border ${
                    selectedLang === lang.code ? "bg-primary text-primary-foreground border-primary" : "border-border hover:bg-muted"
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>

            {/* Surah List */}
            <div className="divide-y">
              {surahs.map((surah) => (
                <div
                  key={surah.id}
                  onClick={() => router.push(`/quran-translations/${surah.id}`)}
                  className="flex items-center gap-4 px-2 py-3 hover:bg-muted/50 transition-colors cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-medium">{surah.id}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-medium">{surah.name}</h3>
                      <span className="text-xs text-muted-foreground">({surah.translation})</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                      <span className="font-arabic">{surah.nameArabic}</span>
                      <span>•</span>
                      <span>{surah.verses} verses</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <Play className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <MobileNav />
    </div>
  )
}