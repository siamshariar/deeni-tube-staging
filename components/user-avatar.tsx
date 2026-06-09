"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { UserCircle } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import AccountDropdown from "@/components/account-dropdown"

export default function UserAvatar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userData, setUserData] = useState<{ name: string; email: string; avatar?: string } | null>(null)

  useEffect(() => {
    const prefs = localStorage.getItem("deeni-language-prefs")
    if (prefs) {
      try {
        const parsed = JSON.parse(prefs)
        setIsLoggedIn(!parsed.isGuest)
        if (!parsed.isGuest) {
          setUserData({
            name: "User Name",
            email: "email@gmail.com",
            avatar: "/placeholder.svg?height=32&width=32"
          })
        }
      } catch {}
    }
  }, [])

  if (!isLoggedIn || !userData) {
    return (
      <Link href="/signin">
        <UserCircle className="h-5 w-5 text-muted-foreground hover:text-foreground transition-colors" />
      </Link>
    )
  }

  return <AccountDropdown />
}