"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Globe, ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Check } from "lucide-react"

const languageList = [
  { code: "en", name: "English" },
  { code: "ar", name: "Arabic" },
  { code: "bn", name: "Bengali" },
  { code: "hi", name: "Hindi" },
  { code: "ur", name: "Urdu" },
  { code: "tr", name: "Turkish" },
]

export default function SignInPage() {
  const router = useRouter()
  const [showLanguagePopup, setShowLanguagePopup] = useState(false)
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(["en"])

  const toggleLanguage = (code: string) => {
    setSelectedLanguages(prev =>
      prev.includes(code)
        ? prev.length > 1 ? prev.filter(l => l !== code) : prev
        : [...prev, code]
    )
  }

  const handleSkipSignIn = () => {
    localStorage.setItem("deeni-language-prefs", JSON.stringify({
      languages: selectedLanguages,
      hasSelected: true,
      isGuest: true,
    }))
    router.push("/")
  }

  const handleGoogleSignIn = () => {
    localStorage.setItem("deeni-language-prefs", JSON.stringify({
      languages: selectedLanguages,
      hasSelected: true,
      isGuest: false,
    }))
    router.push("/")
  }

  const handleEmailSignIn = () => {
    localStorage.setItem("deeni-language-prefs", JSON.stringify({
      languages: selectedLanguages,
      hasSelected: true,
      isGuest: false,
    }))
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b">
        <button onClick={() => router.back()} className="flex items-center justify-center h-9 w-9 rounded-full hover:bg-muted transition-colors">
          <ChevronLeft className="h-5 w-5" />
        </button>
        <Image src="/youtube-logo.svg" alt="Deeni.tube" width={100} height={24} className="h-5 w-auto" />
        <button
          onClick={() => setShowLanguagePopup(true)}
          className="flex items-center gap-1.5 text-sm text-blue-600 hover:underline font-medium"
        >
          <Globe className="h-4 w-4" />
          Language
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pt-8 pb-20">
        <div className="w-full max-w-[360px] space-y-6">
          {/* Logo + Title */}
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-primary rounded-full mx-auto flex items-center justify-center mb-4">
              <svg viewBox="0 0 24 24" width="32" height="32" fill="white">
                <path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/>
              </svg>
            </div>
            <h1 className="text-2xl font-bold">Welcome to Deeni.tube</h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Authentic Islamic videos from trusted scholars. Watch, learn, and grow your knowledge.
            </p>
          </div>

          {/* Selected Languages */}
          <div className="bg-muted/30 rounded-xl p-4 text-center">
            <p className="text-xs text-muted-foreground mb-3">Content will be shown in</p>
            <div className="flex flex-wrap justify-center gap-2">
              {selectedLanguages.map(code => (
                <span key={code} className="px-3 py-1.5 rounded-full bg-background border text-sm font-medium shadow-sm">
                  {languageList.find(l => l.code === code)?.name || code}
                </span>
              ))}
            </div>
            <button
              onClick={() => setShowLanguagePopup(true)}
              className="text-xs text-blue-600 hover:underline mt-3 font-medium"
            >
              Change languages
            </button>
          </div>

          {/* Sign In Buttons */}
          <div className="space-y-3">
            <Button
              onClick={handleGoogleSignIn}
              variant="outline"
              className="w-full h-12 rounded-lg flex items-center justify-center gap-3 text-sm font-medium bg-white hover:bg-gray-50 border-gray-200 shadow-sm"
            >
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Continue with Google
            </Button>

            <Button
              onClick={handleEmailSignIn}
              variant="outline"
              className="w-full h-12 rounded-lg flex items-center justify-center gap-3 text-sm font-medium bg-white hover:bg-gray-50 border-gray-200 shadow-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="16" x="2" y="4" rx="3"/>
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
              </svg>
              Continue with Email
            </Button>

            <div className="relative py-2">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-background px-4 text-xs text-muted-foreground font-medium">or</span>
              </div>
            </div>

            <Button
              onClick={handleSkipSignIn}
              variant="ghost"
              className="w-full h-11 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted"
            >
              Skip Sign In - Browse as Guest
            </Button>
          </div>

          <p className="text-[11px] text-center text-muted-foreground leading-relaxed">
            By continuing, you agree to our <span className="text-blue-600 cursor-pointer hover:underline">Terms of Service</span> and <span className="text-blue-600 cursor-pointer hover:underline">Privacy Policy</span>
          </p>
        </div>
      </div>

      {/* Language Selection Popup */}
      <Dialog open={showLanguagePopup} onOpenChange={setShowLanguagePopup}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-lg">
              <Globe className="h-5 w-5 text-primary" />
              Choose Your Languages
            </DialogTitle>
            <DialogDescription>
              Select one or more languages to personalize your content feed. You can change this later in Settings.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="border rounded-xl divide-y overflow-hidden">
              {languageList.map((lang) => {
                const isSelected = selectedLanguages.includes(lang.code)
                return (
                  <button
                    key={lang.code}
                    onClick={() => toggleLanguage(lang.code)}
                    className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-muted/50 transition-colors text-left"
                  >
                    <div>
                      <span className="text-sm font-medium">{lang.name}</span>
                    </div>
                    <span
                      className={`h-5 w-5 rounded-full border flex items-center justify-center flex-shrink-0 transition-colors ${
                        isSelected
                          ? "bg-primary border-primary text-primary-foreground"
                          : "border-gray-300"
                      }`}
                    >
                      {isSelected && <Check className="h-3 w-3" />}
                    </span>
                  </button>
                )
              })}
            </div>
            <p className="text-xs text-muted-foreground text-center">
              {selectedLanguages.length} language{selectedLanguages.length > 1 ? "s" : ""} selected
            </p>
            <Button className="w-full rounded-lg" onClick={() => setShowLanguagePopup(false)}>
              Done
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}