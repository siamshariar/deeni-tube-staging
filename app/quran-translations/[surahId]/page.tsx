"use client"

import { useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, Play, Pause } from "lucide-react"
import AppHeader from "@/components/app-header"
import MobileNav from "@/components/mobile-nav"
import DesktopSidebar from "@/components/desktop-sidebar"
import { Button } from "@/components/ui/button"

const verses = [
  { id: 1, arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ", translation: "In the name of Allah, the Most Gracious, the Most Merciful.", transliteration: "Bismillahir Rahmanir Rahim" },
  { id: 2, arabic: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ", translation: "All praise is due to Allah, Lord of the worlds.", transliteration: "Alhamdu lillahi Rabbil 'alamin" },
  { id: 3, arabic: "الرَّحْمَٰنِ الرَّحِيمِ", translation: "The Most Gracious, the Most Merciful.", transliteration: "Ar-Rahmanir Rahim" },
  { id: 4, arabic: "مَالِكِ يَوْمِ الدِّينِ", translation: "Master of the Day of Judgment.", transliteration: "Maliki yawmid din" },
  { id: 5, arabic: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ", translation: "You alone we worship, and You alone we ask for help.", transliteration: "Iyyaka na'budu wa iyyaka nasta'in" },
  { id: 6, arabic: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ", translation: "Guide us to the straight path.", transliteration: "Ihdinas siratal mustaqim" },
  { id: 7, arabic: "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ", translation: "The path of those upon whom You have bestowed favor, not of those who have evoked [Your] anger or of those who are astray.", transliteration: "Siratal ladhina an'amta 'alayhim ghayril maghdubi 'alayhim wa lad dallin" },
]

export default function SurahDetailPage() {
  const router = useRouter()
  const params = useParams()
  const [isPlaying, setIsPlaying] = useState(false)

  const surahName = "Al-Fatiha"
  const surahNameArabic = "الفاتحة"

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
            <h1 className="font-semibold text-lg">{surahName}</h1>
          </div>

          <div className="max-w-2xl mx-auto px-4">
            {/* Surah Header */}
            <div className="text-center py-6 border-b">
              <h1 className="text-2xl font-bold mb-2">{surahName}</h1>
              <p className="text-3xl font-arabic mb-3">{surahNameArabic}</p>
              <p className="text-sm text-muted-foreground">The Opening • 7 verses • Meccan</p>
              <Button variant="outline" className="rounded-full mt-3" onClick={() => setIsPlaying(!isPlaying)}>
                {isPlaying ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                {isPlaying ? "Pause" : "Play Recitation"}
              </Button>
            </div>

            {/* Verses */}
            <div className="py-4 space-y-6">
              {verses.map((verse) => (
                <div key={verse.id} className="border-b pb-4">
                  <div className="flex items-start gap-3">
                    <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium flex-shrink-0 mt-1">
                      {verse.id}
                    </span>
                    <div className="flex-1">
                      <p className="text-2xl font-arabic text-right leading-loose mb-2">{verse.arabic}</p>
                      <p className="text-sm text-muted-foreground italic mb-1">{verse.transliteration}</p>
                      <p className="text-sm">{verse.translation}</p>
                    </div>
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