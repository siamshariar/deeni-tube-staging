// components/account-dropdown.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  ChevronRight,
  LogOut,
  Moon,
  Globe,
  Settings,
  HelpCircle,
  MessageSquare,
  User,
  Monitor,
  Sun,
  Check,
  Send,
  Heart,
  X,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
} from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useMediaQuery } from "@/hooks/use-media-query";
import LanguagePrompt from "@/components/language-prompt";
import { toast } from "sonner";

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n.charAt(0))
    .join("")
    .toUpperCase()
    .substring(0, 2);
}

type ThemeMode = "system" | "light" | "dark";

export default function AccountDropdown() {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [open, setOpen] = useState(false);
  const [userData, setUserData] = useState({
    name: "Guest",
    email: "",
    avatar: "",
    initials: "G",
  });
  const [showLanguagePrompt, setShowLanguagePrompt] = useState(false);
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
  const [showAppearanceDialog, setShowAppearanceDialog] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackSent, setFeedbackSent] = useState(false);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("deeni-user-data");
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        setUserData({
          name: parsed.name || "Guest",
          email: parsed.email || "",
          avatar: parsed.avatar || "",
          initials: parsed.initials || getInitials(parsed.name || "Guest"),
        });
      }
    } catch {}
  }, []);

  const handleThemeChange = (newTheme: ThemeMode) => {
    setTheme(newTheme);
    if (isMobile) {
      setShowAppearanceDialog(false);
    }
  };

  const handleSignOut = () => {
    localStorage.setItem("deeni-lang-prefs", JSON.stringify({
      languages: ["en"],
      hasSelected: false,
      isGuest: true,
    }));
    localStorage.removeItem("deeni-user-data");
    setOpen(false);
    window.dispatchEvent(new Event("auth-changed"));
    router.push("/signin");
  };

  const handleNavigate = (path: string) => {
    setOpen(false);
    router.push(path);
  };

  const handleSendFeedback = () => {
    if (!feedbackText.trim()) return;
    setFeedbackSent(true);
    setTimeout(() => {
      setFeedbackSent(false);
      setFeedbackText("");
      setShowFeedbackDialog(false);
      toast.success("Feedback sent! Thank you.");
    }, 1500);
  };

  const getThemeLabel = () => {
    switch (theme) {
      case "light": return "Light theme";
      case "dark": return "Dark theme";
      default: return "Device theme";
    }
  };

  const getThemeIcon = () => {
    switch (theme) {
      case "light": return <Sun className="h-5 w-5" />;
      case "dark": return <Moon className="h-5 w-5" />;
      default: return <Monitor className="h-5 w-5" />;
    }
  };

  const handleAppearanceClick = () => {
    if (isMobile) {
      setOpen(false);
      setTimeout(() => setShowAppearanceDialog(true), 100);
    }
  };

  return (
    <>
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
          {/* User info header */}
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
            </div>
          </div>

          <DropdownMenuGroup>
            <DropdownMenuItem className="py-3 cursor-pointer" onClick={() => handleNavigate("/you")}>
              <User className="mr-3 h-5 w-5" />
              <span>Preferences</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="py-3 cursor-pointer" onClick={() => handleNavigate("/donate")}>
              <Heart className="mr-3 h-5 w-5 text-red-500" />
              <span>Donate</span>
              <ChevronRight className="ml-auto h-4 w-4" />
            </DropdownMenuItem>
            <DropdownMenuItem className="py-3 cursor-pointer" onClick={() => handleNavigate("/channels")}>
              <Settings className="mr-3 h-5 w-5" />
              <span>Channel Preferences</span>
              <ChevronRight className="ml-auto h-4 w-4" />
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            {/* Appearance — submenu on desktop, dialog on mobile */}
            {isMobile ? (
              <DropdownMenuItem className="py-3 cursor-pointer" onClick={handleAppearanceClick}>
                {getThemeIcon()}
                <span className="ml-3">Appearance: {getThemeLabel()}</span>
                <ChevronRight className="ml-auto h-4 w-4" />
              </DropdownMenuItem>
            ) : (
              <DropdownMenuSub>
                <DropdownMenuSubTrigger className="py-3 cursor-pointer">
                  {getThemeIcon()}
                  <span className="ml-3">Appearance: {getThemeLabel()}</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent className="w-48">
                  <DropdownMenuItem onClick={() => handleThemeChange("system")} className="py-2.5 cursor-pointer">
                    <Monitor className="mr-2 h-4 w-4" />
                    <span>Device theme</span>
                    {theme === "system" && <Check className="ml-auto h-4 w-4" />}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleThemeChange("light")} className="py-2.5 cursor-pointer">
                    <Sun className="mr-2 h-4 w-4" />
                    <span>Light theme</span>
                    {theme === "light" && <Check className="ml-auto h-4 w-4" />}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleThemeChange("dark")} className="py-2.5 cursor-pointer">
                    <Moon className="mr-2 h-4 w-4" />
                    <span>Dark theme</span>
                    {theme === "dark" && <Check className="ml-auto h-4 w-4" />}
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            )}

            {/* Language */}
            <DropdownMenuItem className="py-3 cursor-pointer" onClick={() => { setOpen(false); setShowLanguagePrompt(true); }}>
              <Globe className="mr-3 h-5 w-5" />
              <span>Language</span>
              <ChevronRight className="ml-auto h-4 w-4" />
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            <DropdownMenuItem className="py-3 cursor-pointer" onClick={() => handleNavigate("/settings")}>
              <Settings className="mr-3 h-5 w-5" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="py-3 cursor-pointer" onClick={() => handleNavigate("/help")}>
              <HelpCircle className="mr-3 h-5 w-5" />
              <span>Help</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="py-3 cursor-pointer" onClick={() => { setOpen(false); setShowFeedbackDialog(true); }}>
              <MessageSquare className="mr-3 h-5 w-5" />
              <span>Send feedback</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            <DropdownMenuItem className="py-3 cursor-pointer" onClick={handleSignOut}>
              <LogOut className="mr-3 h-5 w-5" />
              <span>Sign out</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Appearance Dialog — Mobile only */}
      <Dialog open={showAppearanceDialog} onOpenChange={setShowAppearanceDialog}>
        <DialogContent className="sm:max-w-md [&>button.absolute]:hidden">
          <button
            onClick={() => setShowAppearanceDialog(false)}
            className="rounded-full p-1 hover:bg-muted transition-colors z-10"
            style={{ position: "absolute", top: "12px", right: "12px" }}
            aria-label="Close"
          >
            <X className="h-7 w-7" />
          </button>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Monitor className="h-5 w-5" /> Appearance
            </DialogTitle>
            <DialogDescription>
              Choose how Deeni.tube looks to you
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-4">
            <button
              onClick={() => handleThemeChange("system")}
              className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all text-left ${
                theme === "system" ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50"
              }`}
            >
              <div className="h-10 w-10 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                <Monitor className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">Device theme</p>
                <p className="text-xs text-muted-foreground">Follow your device settings</p>
              </div>
              {theme === "system" && <Check className="h-5 w-5 text-primary flex-shrink-0" />}
            </button>

            <button
              onClick={() => handleThemeChange("light")}
              className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all text-left ${
                theme === "light" ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50"
              }`}
            >
              <div className="h-10 w-10 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                <Sun className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">Light theme</p>
                <p className="text-xs text-muted-foreground">Always use light mode</p>
              </div>
              {theme === "light" && <Check className="h-5 w-5 text-primary flex-shrink-0" />}
            </button>

            <button
              onClick={() => handleThemeChange("dark")}
              className={`w-full flex items-center gap-4 p-4 rounded-xl border transition-all text-left ${
                theme === "dark" ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50"
              }`}
            >
              <div className="h-10 w-10 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                <Moon className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">Dark theme</p>
                <p className="text-xs text-muted-foreground">Always use dark mode</p>
              </div>
              {theme === "dark" && <Check className="h-5 w-5 text-primary flex-shrink-0" />}
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Language Prompt */}
      <LanguagePrompt
        open={showLanguagePrompt}
        onSave={(langs) => {
          localStorage.setItem("deeni-lang-prefs", JSON.stringify({ languages: langs, hasSelected: true, isGuest: false }));
          toast.success("Language preferences updated");
          setShowLanguagePrompt(false);
        }}
        onSkip={() => setShowLanguagePrompt(false)}
        initialSelected={["en"]}
      />

      {/* Send Feedback Dialog */}
      <Dialog open={showFeedbackDialog} onOpenChange={setShowFeedbackDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Send className="h-5 w-5 text-primary" /> Send Feedback</DialogTitle>
            <DialogDescription>Help us improve Deeni.tube. Share your thoughts, suggestions, or report issues.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {feedbackSent ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="h-8 w-8 text-green-500" />
                </div>
                <h3 className="text-lg font-semibold mb-1">Thank You!</h3>
                <p className="text-sm text-muted-foreground">Your feedback has been sent successfully.</p>
              </div>
            ) : (
              <>
                <Textarea
                  placeholder="Write your feedback here..."
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  className="min-h-[120px] resize-none"
                />
                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1" onClick={() => setShowFeedbackDialog(false)}>Cancel</Button>
                  <Button className="flex-1" onClick={handleSendFeedback} disabled={!feedbackText.trim()}>
                    <Send className="h-4 w-4 mr-2" /> Send
                  </Button>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}