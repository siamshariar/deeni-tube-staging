"use client"

import { useRouter } from "next/navigation"
import { useEffect } from "react"

const userName = "ahmad123"
const userId = "550e8400-e29b-41d4-a716-446655440000"

export default function PlaylistsRedirect() {
  const router = useRouter()

  useEffect(() => {
    router.replace(`/${userId}/${userName}/playlists`)
  }, [router])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <p className="text-muted-foreground text-sm">Loading playlists...</p>
    </div>
  )
}