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
  ShieldAlert,
  Keyboard,
  User,
  Monitor,
  Sun,
  Check,
  Plus,
  Users,
  Send,
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import LanguagePrompt from "@/components/language-prompt";
import { mockAccounts } from "@/lib/mock-data";
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
  const [open, setOpen] = useState(false);
  const [userData, setUserData] = useState({
    name: "Guest",
    email: "",
    avatar: "",
    initials: "G",
  });
  const [showSwitchAccount, setShowSwitchAccount] = useState(false);
  const [showAddAccount, setShowAddAccount] = useState(false);
  const [newAccountName, setNewAccountName] = useState("");
  const [newAccountEmail, setNewAccountEmail] = useState("");
  const [accounts, setAccounts] = useState(mockAccounts);
  const [currentAccountId, setCurrentAccountId] = useState("acc1");
  const [showLanguagePrompt, setShowLanguagePrompt] = useState(false);
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackSent, setFeedbackSent] = useState(false);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("deeni-user-data");
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        setUserData({
          name: parsed.name || "Tamzid Muhammad",
          email: parsed.email || "muhammad.tamzid@sun-asterisk.com",
          avatar: parsed.avatar || "",
          initials: parsed.initials || getInitials(parsed.name || "Tamzid Muhammad"),
        });
      }
    } catch {}
  }, []);

  const handleThemeChange = (newTheme: ThemeMode) => {
    setTheme(newTheme);
  };

  const handleSignOut = () => {
    localStorage.setItem("deeni-language-prefs", JSON.stringify({
      languages: ["en"],
      hasSelected: false,
      isGuest: true,
    }));
    localStorage.removeItem("deeni-user-data");
    setOpen(false);
    router.push("/signin");
  };

  const handleNavigate = (path: string) => {
    setOpen(false);
    router.push(path);
  };

  const handleSwitchAccount = (accountId: string) => {
    const account = accounts.find((a) => a.id === accountId);
    if (account) {
      setUserData({
        name: account.name,
        email: account.email,
        avatar: account.avatar || "",
        initials: account.initials,
      });
      setCurrentAccountId(accountId);
      toast.success(`Switched to ${account.name}`);
    }
    setShowSwitchAccount(false);
    setOpen(false);
  };

  const handleAddAccount = () => {
    if (!newAccountName.trim() || !newAccountEmail.trim()) return;
    const newAccount = {
      id: `acc${Date.now()}`,
      name: newAccountName.trim(),
      email: newAccountEmail.trim(),
      avatar: "",
      initials: getInitials(newAccountName.trim()),
    };
    setAccounts((prev) => [...prev, newAccount]);
    setNewAccountName("");
    setNewAccountEmail("");
    setShowAddAccount(false);
    handleSwitchAccount(newAccount.id);
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
              <p className="text-xs text-muted-foreground">Switch account ↓</p>
            </div>
          </div>

          <DropdownMenuGroup>
            <DropdownMenuItem className="py-3 cursor-pointer" onClick={() => setShowSwitchAccount(true)}>
              <Users className="mr-3 h-5 w-5" />
              <span>Switch account</span>
              <ChevronRight className="ml-auto h-4 w-4" />
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            <DropdownMenuItem className="py-3 cursor-pointer" onClick={() => handleNavigate("/you-new")}>
              <User className="mr-3 h-5 w-5" />
              <span>Your channel</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="py-3 cursor-pointer" onClick={handleSignOut}>
              <LogOut className="mr-3 h-5 w-5" />
              <span>Sign out</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <DropdownMenuGroup>
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
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Switch Account Dialog */}
      <Dialog open={showSwitchAccount} onOpenChange={setShowSwitchAccount}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><Users className="h-5 w-5 text-primary" /> Switch Account</DialogTitle>
            <DialogDescription>Choose an account to continue using Deeni.tube.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-4">
            {accounts.map((acc) => (
              <button
                key={acc.id}
                onClick={() => handleSwitchAccount(acc.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${
                  currentAccountId === acc.id ? "border-primary bg-primary/5" : "border-border hover:bg-muted/50"
                }`}
              >
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-muted text-foreground font-medium">{acc.initials}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm">{acc.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{acc.email}</p>
                </div>
                {currentAccountId === acc.id && <Check className="h-5 w-5 text-primary flex-shrink-0" />}
              </button>
            ))}
            <Button variant="outline" className="w-full rounded-xl border-dashed flex items-center gap-2" onClick={() => { setShowSwitchAccount(false); setShowAddAccount(true); }}>
              <Plus className="h-4 w-4" /><span>Add account</span>
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Account Dialog */}
      <Dialog open={showAddAccount} onOpenChange={setShowAddAccount}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle className="flex items-center gap-2"><Plus className="h-5 w-5 text-primary" /> Add Account</DialogTitle><DialogDescription>Enter the details of the account you want to add.</DialogDescription></DialogHeader>
          <div className="space-y-4 py-4">
            <Input placeholder="Full name" value={newAccountName} onChange={(e) => setNewAccountName(e.target.value)} className="h-10" />
            <Input type="email" placeholder="Email address" value={newAccountEmail} onChange={(e) => setNewAccountEmail(e.target.value)} className="h-10" />
            <div className="flex gap-3"><Button variant="outline" className="flex-1" onClick={() => setShowAddAccount(false)}>Cancel</Button><Button className="flex-1" onClick={handleAddAccount} disabled={!newAccountName.trim() || !newAccountEmail.trim()}>Add & Switch</Button></div>
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