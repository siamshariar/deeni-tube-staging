"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
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
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
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

export default function AccountDropdown() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [userData, setUserData] = useState({
    name: "Tamzid Muhammad",
    email: "muhammad.tamzid@sun-asterisk.com",
    avatar: "",
    initials: "TM",
  })
  const isMounted = useRef(false)

  // Read user data once on mount - no dependency on 'open'
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
            <Link href="#" className="text-sm text-blue-600 hover:underline">
              Manage your Google Account
            </Link>
          </div>
        </div>

        {/* Account Section */}
        <DropdownMenuGroup>
          <DropdownMenuItem className="py-3 cursor-pointer" onClick={() => handleNavigate("/you-new")}>
            <User className="mr-3 h-5 w-5 text-muted-foreground" />
            <span>Your channel</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="py-3 cursor-pointer">
            <RefreshCw className="mr-3 h-5 w-5 text-muted-foreground" />
            <span>Switch account</span>
            <ChevronRight className="ml-auto h-4 w-4" />
          </DropdownMenuItem>
          <DropdownMenuItem className="py-3 cursor-pointer" onClick={handleSignOut}>
            <LogOut className="mr-3 h-5 w-5 text-muted-foreground" />
            <span>Sign out</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {/* YouTube Section */}
        <DropdownMenuGroup>
          <DropdownMenuItem className="py-3 cursor-pointer">
            <Youtube className="mr-3 h-5 w-5 text-muted-foreground" />
            <span>YouTube Studio</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="py-3 cursor-pointer">
            <DollarSign className="mr-3 h-5 w-5 text-muted-foreground" />
            <span>Purchases and memberships</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {/* Preferences Section */}
        <DropdownMenuGroup>
          <DropdownMenuItem className="py-3 cursor-pointer">
            <FileText className="mr-3 h-5 w-5 text-muted-foreground" />
            <span>Your data in YouTube</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="py-3 cursor-pointer">
            <Moon className="mr-3 h-5 w-5 text-muted-foreground" />
            <span>Appearance: Device theme</span>
            <ChevronRight className="ml-auto h-4 w-4" />
          </DropdownMenuItem>
          <DropdownMenuItem className="py-3 cursor-pointer" onClick={() => handleNavigate("/you-new")}>
            <Globe className="mr-3 h-5 w-5 text-muted-foreground" />
            <span>Language: English</span>
            <ChevronRight className="ml-auto h-4 w-4" />
          </DropdownMenuItem>
          <DropdownMenuItem className="py-3 cursor-pointer">
            <ShieldAlert className="mr-3 h-5 w-5 text-muted-foreground" />
            <span>Restricted Mode: Off</span>
            <ChevronRight className="ml-auto h-4 w-4" />
          </DropdownMenuItem>
          <DropdownMenuItem className="py-3 cursor-pointer">
            <Globe className="mr-3 h-5 w-5 text-muted-foreground" />
            <span>Location: Bangladesh</span>
            <ChevronRight className="ml-auto h-4 w-4" />
          </DropdownMenuItem>
          <DropdownMenuItem className="py-3 cursor-pointer">
            <Keyboard className="mr-3 h-5 w-5 text-muted-foreground" />
            <span>Keyboard shortcuts</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        {/* Support Section */}
        <DropdownMenuGroup>
          <DropdownMenuItem className="py-3 cursor-pointer" onClick={() => handleNavigate("/settings")}>
            <Settings className="mr-3 h-5 w-5 text-muted-foreground" />
            <span>Settings</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="py-3 cursor-pointer" onClick={() => handleNavigate("/help")}>
            <HelpCircle className="mr-3 h-5 w-5 text-muted-foreground" />
            <span>Help</span>
          </DropdownMenuItem>
          <DropdownMenuItem className="py-3 cursor-pointer">
            <MessageSquare className="mr-3 h-5 w-5 text-muted-foreground" />
            <span>Send feedback</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}