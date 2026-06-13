"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useTheme } from "next-themes"
import {
  ChevronRight,
  LogOut,
  Moon,
  Globe,
  Settings,
  HelpCircle,
  MessageSquare,
  ShieldAlert,
  Keyboard,
  DollarSign,
  Youtube,
  RefreshCw,
  FileText,
  User,
  Monitor,
  Sun,
  Check,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n.charAt(0))
    .join("")
    .toUpperCase()
    .substring(0, 2)
}

type ThemeMode = "system" | "light" | "dark"

export default function AccountDropdown() {
  const router = useRouter()
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [open, setOpen] = useState(false)
  const [userData, setUserData] = useState({
    name: "Tamzid Muhammad",
    email: "muhammad.tamzid@sun-asterisk.com",
    avatar: "",
    initials: "TM",
  })
  const isMounted = useRef(false)

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("deeni-user-data")
      if (storedUser) {
        const parsed = JSON.parse(storedUser)
        setUserData({
          name: parsed.name || "Tamzid Muhammad",
          email: parsed.email || "muhammad.tamzid@sun-asterisk.com",
          avatar: parsed.avatar || "",
          initials: parsed.initials || getInitials(parsed.name || "Tamzid Muhammad"),
        })
      }
    } catch {}
    isMounted.current = true
  }, [])

  const handleThemeChange = (newTheme: ThemeMode) => {
    setTheme(newTheme)
  }

  const handleSignOut = () => {
    localStorage.setItem("deeni-language-prefs", JSON.stringify({
      languages: ["en"],
      hasSelected: false,
      isGuest: true,
    }))
    localStorage.removeItem("deeni-user-data")
    setOpen(false)
    router.push("/signin")
  }

  const handleNavigate = (path: string) => {
    setOpen(false)
    router.push(path)
  }

  const getThemeLabel = () => {
    switch (theme) {
      case "light": return "Light theme"
      case "dark": return "Dark theme"
      default: return "Device theme"
    }
  }

  const getThemeIcon = () => {
    switch (theme) {
      case "light": return <Sun className="h-5 w-5" />
      case "dark": return <Moon className="h-5 w-5" />
      default: return <Monitor className="h-5 w-5" />
    }
  }

  // Avoid hydration mismatch
  if (!isMounted.current) return null

  return (
    <DropdownMenu open={open} onOpenChange={setOpen} modal={false}>
      <DropdownMenuTrigger asChild>
        <Avatar className="h-8 w-8 cursor-pointer ring-2 ring-background hover:ring-primary/20 transition-all">
          {userData.avatar ? (
            <AvatarImage src={userData.avatar} alt={userData.name} />
          ) : (
            <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
              {userData.initials}
            </AvatarFallback>
          )}
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 p-0 mr-4" align="end" sideOffset={8}>
        {/* User Info */}
        <div className="flex items-center gap-3 p-4 border-b">
          <Avatar className="h-10 w-10">
            {userData.avatar ? (
              <AvatarImage src={userData.avatar} alt={userData.name} />
            ) : (
              <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
                {userData.initials}
              </AvatarFallback>
            )}
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{userData.name}</p>
            <p className="text-xs text-muted-foreground truncate">{userData.email}</p>
            <Link href="#" className="text-sm text-primary hover:underline">
              Manage your Google Account
            </Link>
          </div>
        </div>

        {/* Account Section */}
        <DropdownMenuGroup>
          <DropdownMenuItem className="py-3 cursor-pointer" onClick={() => handleNavigate("/you-new")}>
            <User className="mr-3 h-5 w-5" />
            <span>Your channel</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="py-3 cursor-pointer">
            <RefreshCw className="mr-3 h-5 w-5" />
            <span>Switch account</span>
            <ChevronRight className="ml-auto h-4 w-4" />
          </DropdownMenuItem>
          <DropdownMenuItem className="py-3 cursor-pointer" onClick={handleSignOut}>
            <LogOut className="mr-3 h-5 w-5" />
            <span>Sign out</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {/* Studio Section */}
        <DropdownMenuGroup>
          <DropdownMenuItem className="py-3 cursor-pointer">
            <Youtube className="mr-3 h-5 w-5" />
            <span>Deeni.tube Studio</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="py-3 cursor-pointer">
            <DollarSign className="mr-3 h-5 w-5" />
            <span>Purchases and memberships</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {/* Preferences Section */}
        <DropdownMenuGroup>
          <DropdownMenuItem className="py-3 cursor-pointer">
            <FileText className="mr-3 h-5 w-5" />
            <span>Your data in Deeni.tube</span>
          </DropdownMenuItem>
          
          {/* Appearance Submenu */}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger className="py-3 cursor-pointer">
              {getThemeIcon()}
              <span className="ml-3">Appearance: {getThemeLabel()}</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent className="w-48">
              <DropdownMenuItem onClick={() => handleThemeChange("system")} className="py-2.5 cursor-pointer">
                <Monitor className="mr-3 h-5 w-5" />
                <span>Device theme</span>
                {theme === "system" && <Check className="ml-auto h-4 w-4" />}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleThemeChange("light")} className="py-2.5 cursor-pointer">
                <Sun className="mr-3 h-5 w-5" />
                <span>Light theme</span>
                {theme === "light" && <Check className="ml-auto h-4 w-4" />}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleThemeChange("dark")} className="py-2.5 cursor-pointer">
                <Moon className="mr-3 h-5 w-5" />
                <span>Dark theme</span>
                {theme === "dark" && <Check className="ml-auto h-4 w-4" />}
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>

          <DropdownMenuItem className="py-3 cursor-pointer" onClick={() => handleNavigate("/you-new")}>
            <Globe className="mr-3 h-5 w-5" />
            <span>Language: English</span>
            <ChevronRight className="ml-auto h-4 w-4" />
          </DropdownMenuItem>
          <DropdownMenuItem className="py-3 cursor-pointer">
            <ShieldAlert className="mr-3 h-5 w-5" />
            <span>Restricted Mode: Off</span>
            <ChevronRight className="ml-auto h-4 w-4" />
          </DropdownMenuItem>
          <DropdownMenuItem className="py-3 cursor-pointer">
            <Globe className="mr-3 h-5 w-5" />
            <span>Location: Bangladesh</span>
            <ChevronRight className="ml-auto h-4 w-4" />
          </DropdownMenuItem>
          <DropdownMenuItem className="py-3 cursor-pointer">
            <Keyboard className="mr-3 h-5 w-5" />
            <span>Keyboard shortcuts</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {/* Support Section */}
        <DropdownMenuGroup>
          <DropdownMenuItem className="py-3 cursor-pointer" onClick={() => handleNavigate("/settings")}>
            <Settings className="mr-3 h-5 w-5" />
            <span>Settings</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="py-3 cursor-pointer" onClick={() => handleNavigate("/help")}>
            <HelpCircle className="mr-3 h-5 w-5" />
            <span>Help</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="py-3 cursor-pointer">
            <MessageSquare className="mr-3 h-5 w-5" />
            <span>Send feedback</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}