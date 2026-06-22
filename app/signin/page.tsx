// app/signin/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Globe, ChevronLeft, Eye, EyeOff, Mail, Check, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import LanguagePrompt from "@/components/language-prompt";
import { mockLanguages, mockAccounts } from "@/lib/mock-data";
import { toast } from "sonner";

export default function SignInPage() {
  const router = useRouter();
  const [showLanguagePopup, setShowLanguagePopup] = useState(false);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(["en"]);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("deeni-lang-prefs");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.languages) setSelectedLanguages(parsed.languages);
      } catch {}
    }
  }, []);

  const saveLanguagePrefs = (langs: string[]) => {
    setSelectedLanguages(langs);
    localStorage.setItem("deeni-lang-prefs", JSON.stringify({ languages: langs, hasSelected: true, isGuest: true }));
    setShowLanguagePopup(false);
  };

  const notifyAuthChange = () => {
    // Dispatch a custom event so the header updates instantly
    window.dispatchEvent(new Event("auth-changed"));
  };

  const handleGoogleSignIn = () => {
    setIsLoading(true);
    setTimeout(() => {
      const mockUser = mockAccounts[0];
      localStorage.setItem("deeni-user-data", JSON.stringify({
        name: mockUser.name,
        email: mockUser.email,
        initials: mockUser.initials,
        avatar: mockUser.avatar || "",
      }));
      localStorage.setItem("deeni-lang-prefs", JSON.stringify({
        languages: selectedLanguages,
        hasSelected: true,
        isGuest: false,
      }));
      setIsLoading(false);
      toast.success(`Signed in as ${mockUser.name}`);
      notifyAuthChange();
      router.push("/");
    }, 1200);
  };

  const handleEmailSignIn = () => {
    if (!email.trim()) return;
    setIsLoading(true);
    setTimeout(() => {
      const mockUser = mockAccounts.find(a => a.email === email) || mockAccounts[0];
      localStorage.setItem("deeni-user-data", JSON.stringify({
        name: mockUser.name,
        email: mockUser.email,
        initials: mockUser.initials,
        avatar: mockUser.avatar || "",
      }));
      localStorage.setItem("deeni-lang-prefs", JSON.stringify({
        languages: selectedLanguages,
        hasSelected: true,
        isGuest: false,
      }));
      setIsLoading(false);
      toast.success(`Signed in as ${mockUser.name}`);
      notifyAuthChange();
      router.push("/");
    }, 1200);
  };

  const handleSkip = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="flex items-center justify-between px-4 py-3 border-b sticky top-0 bg-background/95 backdrop-blur-sm z-10">
        <button onClick={() => router.back()} className="flex items-center justify-center h-9 w-9 rounded-full hover:bg-muted"><ChevronLeft className="h-5 w-5" /></button>
        <Image src="/DeeniTubeLogo.png" alt="Deeni.tube" width={120} height={32} className="h-7 w-auto object-contain" />
        <button onClick={() => setShowLanguagePopup(true)} className="flex items-center gap-1.5 text-sm text-primary hover:underline font-medium"><Globe className="h-4 w-4" /><span className="hidden sm:inline">Language</span></button>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        <div className="w-full max-w-[400px] space-y-6">
          <div className="text-center space-y-3">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">Welcome to Deeni.tube</h1>
            <p className="text-sm text-muted-foreground leading-relaxed">Authentic Islamic videos from trusted scholars. Watch, learn, and grow your knowledge.</p>
          </div>

          <div className="bg-gradient-to-br from-muted/20 to-muted/5 rounded-xl p-4 text-center border border-muted/20">
            <p className="text-xs text-muted-foreground mb-3 flex items-center justify-center gap-1"><Globe className="h-3 w-3" /> Content will be shown in</p>
            <div className="flex flex-wrap justify-center gap-2">
              {selectedLanguages.map((code) => {
                const lang = mockLanguages.find((l) => l.code === code);
                return <span key={code} className="px-3 py-1.5 rounded-full bg-background border text-sm font-medium shadow-sm">{lang?.name || code}</span>;
              })}
            </div>
            <button onClick={() => setShowLanguagePopup(true)} className="text-xs text-primary hover:underline mt-3 font-medium">Change languages</button>
          </div>

          {!showEmailForm ? (
            <div className="space-y-3">
              <Button onClick={handleGoogleSignIn} variant="outline" className="w-full h-12 rounded-full flex items-center justify-center gap-3 text-sm font-medium bg-background hover:bg-muted border-border shadow-sm" disabled={isLoading}>
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> :
                  <svg viewBox="0 0 24 24" width="20" height="20"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                }
                {isLoading ? "Signing in..." : "Continue with Google"}
              </Button>
              <Button onClick={() => setShowEmailForm(true)} variant="outline" className="w-full h-12 rounded-full flex items-center justify-center gap-3 text-sm font-medium bg-background hover:bg-muted border-border shadow-sm"><Mail className="h-4 w-4" /> Continue with Email</Button>
              <div className="relative py-2"><div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div><div className="relative flex justify-center"><span className="bg-background px-4 text-xs text-muted-foreground font-medium">or</span></div></div>
              <Button onClick={handleSkip} variant="ghost" className="w-full h-11 rounded-full text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted">Browse as Guest</Button>
            </div>
          ) : (
            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleEmailSignIn(); }}>
              <button type="button" onClick={() => setShowEmailForm(false)} className="flex items-center gap-1 text-sm text-primary hover:underline font-medium"><ChevronLeft className="h-4 w-4" /> Back</button>
              <Input type="email" placeholder="Email address *" value={email} onChange={(e) => setEmail(e.target.value)} className="h-12 rounded-full" required />
              <div className="relative">
                <Input type={showPassword ? "text" : "password"} placeholder="Password (optional)" value={password} onChange={(e) => setPassword(e.target.value)} className="h-12 rounded-full pr-12" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">{showPassword ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}</button>
              </div>
              <Button type="submit" className="w-full h-12 rounded-full font-medium" disabled={isLoading}>{isLoading ? <Loader2 className="h-5 w-5 animate-spin mr-2" /> : null}{isLoading ? "Signing in..." : "Sign In"}</Button>
            </form>
          )}

          <p className="text-[11px] text-center text-muted-foreground leading-relaxed">By continuing, you agree to our <button className="text-primary hover:underline">Terms of Service</button> and <button className="text-primary hover:underline">Privacy Policy</button></p>
        </div>
      </main>

      <LanguagePrompt open={showLanguagePopup} onSave={saveLanguagePrefs} onSkip={() => setShowLanguagePopup(false)} initialSelected={selectedLanguages} />
    </div>
  );
}