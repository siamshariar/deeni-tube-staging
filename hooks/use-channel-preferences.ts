"use client"

import { useState, useEffect, useCallback } from "react"

type PreferenceType = "all" | "personalized" | "none"

interface ChannelPreferences {
  [channelId: string]: PreferenceType
}

const STORAGE_KEY = "deeni-channel-prefs"

export function useChannelPreferences() {
  const [preferences, setPreferences] = useState<ChannelPreferences>({})
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        setPreferences(JSON.parse(stored))
      } catch {}
    }
  }, [])

  const setPreference = useCallback((channelId: string, type: PreferenceType) => {
    setPreferences(prev => {
      const updated = { ...prev, [channelId]: type }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      return updated
    })
  }, [])

  const getPreference = useCallback((channelId: string): PreferenceType => {
    return preferences[channelId] || "personalized"
  }, [preferences])

  const getIgnoredChannels = useCallback((): string[] => {
    return Object.entries(preferences)
      .filter(([_, type]) => type === "none")
      .map(([id]) => id)
  }, [preferences])

  const getFollowedChannels = useCallback((): string[] => {
    return Object.entries(preferences)
      .filter(([_, type]) => type !== "none")
      .map(([id]) => id)
  }, [preferences])

  return {
    preferences,
    setPreference,
    getPreference,
    getIgnoredChannels,
    getFollowedChannels,
    isLoggedIn,
    setIsLoggedIn,
  }
}