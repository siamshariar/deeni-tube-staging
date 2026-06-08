"use client"

import { useState, useEffect } from "react"

export const LANGUAGES = ["en", "ar", "bn", "hi", "ur", "tr", "es", "fr"] as const
export type Language = (typeof LANGUAGES)[number]

const STORAGE_KEY = "deeni-language-prefs"

export function useLanguage() {
  const [preferredLanguages, setPreferredLanguages] = useState<Language[]>([])
  const [hasSelected, setHasSelected] = useState(false)
  const [isGuest, setIsGuest] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setPreferredLanguages(parsed.languages || [])
        setHasSelected(parsed.hasSelected || false)
        setIsGuest(parsed.isGuest !== false)
      } catch {}
    }
  }, [])

  const savePreferences = (languages: string[], guest = true) => {
    const validLanguages = languages.filter((l): l is Language => LANGUAGES.includes(l as Language))
    setPreferredLanguages(validLanguages)
    setHasSelected(true)
    setIsGuest(guest)
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ languages: validLanguages, hasSelected: true, isGuest: guest }))
  }

  const skipForNow = () => {
    setHasSelected(true)
    setIsGuest(true)
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ languages: [], hasSelected: true, isGuest: true }))
  }

  const resetPreferences = () => {
    setPreferredLanguages([])
    setHasSelected(false)
    setIsGuest(true)
    localStorage.removeItem(STORAGE_KEY)
  }

  return {
    preferredLanguages,
    hasSelected,
    isGuest,
    savePreferences,
    skipForNow,
    resetPreferences,
    LANGUAGES,
  }
}