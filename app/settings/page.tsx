// app/settings/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  ArrowLeft,
  Settings,
  Globe,
  Bell,
  Shield,
  HelpCircle,
  Info,
  ChevronRight,
  Monitor,
  Moon,
  Sun,
  Check,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useMediaQuery } from "@/hooks/use-media-query";
import { toast } from "sonner";

const mockLanguages = [
  { code: "en", label: "English" },
  { code: "ar", label: "Arabic" },
  { code: "hi", label: "Hindi" },
  { code: "bn", label: "Bengali" },
  { code: "ur", label: "Urdu" },
];

export default function SettingsPage() {
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { theme, setTheme } = useTheme();

  const [notifications, setNotifications] = useState({
    all: true,
    email: false,
    push: true,
  });

  const [showLanguagePrompt, setShowLanguagePrompt] = useState(false);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(["en"]);

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

  const handleThemeChange = (newTheme: string) => {
    setTheme(newTheme);
    toast.success(`Theme set to ${newTheme === "system" ? "system" : newTheme}`);
  };

  const handleLanguageSave = (langs: string[]) => {
    setSelectedLanguages(langs);
    localStorage.setItem("deeni-lang-prefs", JSON.stringify({ languages: langs, hasSelected: true, isGuest: false }));
    toast.success("Language preferences updated");
    setShowLanguagePrompt(false);
  };

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
    toast.success(`${key} notifications ${!notifications[key] ? "enabled" : "disabled"}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile header */}
      <div className="md:hidden flex items-center gap-2 px-4 py-3 border-b sticky top-[56px] bg-background z-10">
        <button
          onClick={() => router.back()}
          className="flex items-center justify-center h-9 w-9 rounded-full hover:bg-muted flex-shrink-0 -ml-1"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="font-semibold text-lg">Settings</h1>
      </div>

      <div className="px-4 md:px-6 py-4 md:py-6">
        {!isMobile && (
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Settings</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage your app preferences</p>
          </div>
        )}

        <div className="divide-y">
          {/* General */}
          <div className="py-4">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              General
            </h3>

            {/* Appearance */}
            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                {getThemeIcon()}
                <div>
                  <p className="text-sm font-medium">Appearance</p>
                  <p className="text-xs text-muted-foreground">{getThemeLabel()}</p>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="bg-muted/50 hover:bg-muted/80 rounded-full text-sm font-medium px-4 py-1.5 transition-colors"
                  >
                    Change
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48 rounded-xl">
                  <DropdownMenuItem onClick={() => handleThemeChange("system")} className="py-2.5 cursor-pointer">
                    <Monitor className="mr-2 h-4 w-4" /> Device theme
                    {theme === "system" && <Check className="ml-auto h-4 w-4" />}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleThemeChange("light")} className="py-2.5 cursor-pointer">
                    <Sun className="mr-2 h-4 w-4" /> Light theme
                    {theme === "light" && <Check className="ml-auto h-4 w-4" />}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleThemeChange("dark")} className="py-2.5 cursor-pointer">
                    <Moon className="mr-2 h-4 w-4" /> Dark theme
                    {theme === "dark" && <Check className="ml-auto h-4 w-4" />}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Language */}
            <div className="flex items-center justify-between py-3 border-t">
              <div className="flex items-center gap-3">
                <Globe className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Language</p>
                  <p className="text-xs text-muted-foreground">
                    {selectedLanguages.length > 0
                      ? selectedLanguages.map(l => mockLanguages.find(la => la.code === l)?.label).join(", ")
                      : "English"}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="bg-muted/50 hover:bg-muted/80 rounded-full text-sm font-medium px-4 py-1.5 transition-colors"
                onClick={() => setShowLanguagePrompt(true)}
              >
                Change
              </Button>
            </div>
          </div>

          {/* Notifications */}
          <div className="py-4">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Notifications
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">All notifications</p>
                    <p className="text-xs text-muted-foreground">Receive all types of notifications</p>
                  </div>
                </div>
                <Switch checked={notifications.all} onCheckedChange={() => toggleNotification("all")} />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Email notifications</p>
                    <p className="text-xs text-muted-foreground">Get updates via email</p>
                  </div>
                </div>
                <Switch checked={notifications.email} onCheckedChange={() => toggleNotification("email")} />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Bell className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Push notifications</p>
                    <p className="text-xs text-muted-foreground">Receive push notifications on device</p>
                  </div>
                </div>
                <Switch checked={notifications.push} onCheckedChange={() => toggleNotification("push")} />
              </div>
            </div>
          </div>

          {/* Account & Privacy */}
          <div className="py-4">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Account & Privacy
            </h3>
            <button
              onClick={() => router.push("/you-new")}
              className="w-full flex items-center justify-between py-3 hover:bg-muted/30 rounded-lg px-2 -mx-2 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-muted-foreground" />
                <div className="text-left">
                  <p className="text-sm font-medium">Account</p>
                  <p className="text-xs text-muted-foreground">Manage your account details</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>
            <button
              onClick={() => router.push("/you-new")}
              className="w-full flex items-center justify-between py-3 hover:bg-muted/30 rounded-lg px-2 -mx-2 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-muted-foreground" />
                <div className="text-left">
                  <p className="text-sm font-medium">Privacy & Safety</p>
                  <p className="text-xs text-muted-foreground">Control your privacy settings</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>

          {/* Help & About */}
          <div className="py-4">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Help & About
            </h3>
            <button
              onClick={() => router.push("/help")}
              className="w-full flex items-center justify-between py-3 hover:bg-muted/30 rounded-lg px-2 -mx-2 transition-colors"
            >
              <div className="flex items-center gap-3">
                <HelpCircle className="h-5 w-5 text-muted-foreground" />
                <div className="text-left">
                  <p className="text-sm font-medium">Help & Support</p>
                  <p className="text-xs text-muted-foreground">Get help and contact us</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>
            <button
              onClick={() => router.push("/help")}
              className="w-full flex items-center justify-between py-3 hover:bg-muted/30 rounded-lg px-2 -mx-2 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Info className="h-5 w-5 text-muted-foreground" />
                <div className="text-left">
                  <p className="text-sm font-medium">About</p>
                  <p className="text-xs text-muted-foreground">Version 1.0.0</p>
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>
          </div>
        </div>
      </div>

      <Dialog open={showLanguagePrompt} onOpenChange={setShowLanguagePrompt}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" /> Select Language
            </DialogTitle>
            <DialogDescription>
              Choose your preferred languages for content.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-4">
            {mockLanguages.map((lang) => (
              <div
                key={lang.code}
                className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-colors ${
                  selectedLanguages.includes(lang.code)
                    ? "border-primary bg-primary/5"
                    : "border-border hover:bg-muted/50"
                }`}
                onClick={() => {
                  if (selectedLanguages.includes(lang.code)) {
                    if (selectedLanguages.length > 1) {
                      setSelectedLanguages(prev => prev.filter(l => l !== lang.code));
                    }
                  } else {
                    setSelectedLanguages(prev => [...prev, lang.code]);
                  }
                }}
              >
                <span className="text-sm font-medium">{lang.label}</span>
                {selectedLanguages.includes(lang.code) && (
                  <Check className="h-4 w-4 text-primary" />
                )}
              </div>
            ))}
            <div className="flex gap-3 pt-2">
              <Button variant="outline" className="flex-1 rounded-full" onClick={() => setShowLanguagePrompt(false)}>
                Cancel
              </Button>
              <Button className="flex-1 rounded-full" onClick={() => handleLanguageSave(selectedLanguages)}>
                Save
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}