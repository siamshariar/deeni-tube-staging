"use client"

import { useState } from "react"
import Link from "next/link"
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

export default function AccountDropdown() {
  const [open, setOpen] = useState(false)

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Avatar className="h-8 w-8 cursor-pointer">
          <AvatarImage src="/placeholder.svg?height=32&width=32" />
          <AvatarFallback>T</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 p-0 mr-4" align="end">
        <div className="flex items-center gap-3 p-4 border-b">
          <Avatar className="h-10 w-10">
            <AvatarImage src="/placeholder.svg?height=40&width=40" />
            <AvatarFallback>T</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-medium">Tamzid Muhammad</p>
            <p className="text-xs text-muted-foreground truncate">muhammad.tamzid@sun-asterisk.com</p>
            <Link href="#" className="text-sm text-blue-600 hover:underline">
              Create a channel
            </Link>
          </div>
        </div>

        <DropdownMenuGroup>
          <DropdownMenuItem>
            <div className="mr-2">
              <svg viewBox="0 0 24 24" width="24" height="24" className="text-muted-foreground">
                <path
                  fill="currentColor"
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm6.36 14.83c-1.43-1.74-4.9-2.33-6.36-2.33s-4.93.59-6.36 2.33C4.62 15.49 4 13.82 4 12c0-4.41 3.59-8 8-8s8 3.59 8 8c0 1.82-.62 3.49-1.64 4.83zM12 6c-1.94 0-3.5 1.56-3.5 3.5S10.06 13 12 13s3.5-1.56 3.5-3.5S13.94 6 12 6z"
                ></path>
              </svg>
            </div>
            <span>Google Account</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <RefreshCw className="mr-2 h-4 w-4" />
            <span>Switch account</span>
            <ChevronRight className="ml-auto h-4 w-4" />
          </DropdownMenuItem>
          <DropdownMenuItem>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Sign out</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Youtube className="mr-2 h-4 w-4" />
            <span>YouTube Studio</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <DollarSign className="mr-2 h-4 w-4" />
            <span>Purchases and memberships</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem>
            <FileText className="mr-2 h-4 w-4" />
            <span>Your data in YouTube</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Moon className="mr-2 h-4 w-4" />
            <span>Appearance: Device theme</span>
            <ChevronRight className="ml-auto h-4 w-4" />
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Globe className="mr-2 h-4 w-4" />
            <span>Language: English</span>
            <ChevronRight className="ml-auto h-4 w-4" />
          </DropdownMenuItem>
          <DropdownMenuItem>
            <ShieldAlert className="mr-2 h-4 w-4" />
            <span>Restricted Mode: Off</span>
            <ChevronRight className="ml-auto h-4 w-4" />
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Globe className="mr-2 h-4 w-4" />
            <span>Location: Bangladesh</span>
            <ChevronRight className="ml-auto h-4 w-4" />
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Keyboard className="mr-2 h-4 w-4" />
            <span>Keyboard shortcuts</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />

        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <HelpCircle className="mr-2 h-4 w-4" />
            <span>Help</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <MessageSquare className="mr-2 h-4 w-4" />
            <span>Send feedback</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
