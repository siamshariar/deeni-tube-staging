"use client"

import { useState, useCallback, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Globe, ChevronLeft, Eye, EyeOff, Loader2, Mail, Check, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

// ============= TYPES =============
interface Language {
  code: string
  name: string
  nativeName?: string
}

interface UserPreferences {
  languages: string[]
  hasSelected: boolean
  isGuest: boolean
}

interface AuthResult {
  success: boolean
  error?: string
}

// ============= CONSTANTS =============
const LANGUAGE_LIST: Language[] = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "ar", name: "Arabic", nativeName: "العربية" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी" },
  { code: "ur", name: "Urdu", nativeName: "اردو" },
  { code: "tr", name: "Turkish", nativeName: "Türkçe" },
]

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// ============= CUSTOM HOOKS =============
const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const signInWithGoogle = useCallback(async (): Promise<AuthResult> => {
    setIsLoading(true)
    setError(null)
    try {
      // TODO: Implement actual Google OAuth
      await new Promise(resolve => setTimeout(resolve, 1000))
      return { success: true }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Google sign in failed"
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }, [])

  const signInWithEmail = useCallback(async (email: string, password: string): Promise<AuthResult> => {
    setIsLoading(true)
    setError(null)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      if (!password) {
        console.log("Sending magic link to:", email)
      }
      return { success: true }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Email sign in failed"
      setError(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setIsLoading(false)
    }
  }, [])

  return { signInWithGoogle, signInWithEmail, isLoading, error }
}

// ============= COMPONENTS =============
const LanguageSelector = ({ 
  selected, 
  onChange, 
  onClose 
}: { 
  selected: string[]
  onChange: (codes: string[]) => void
  onClose: () => void
}) => {
  const [tempSelected, setTempSelected] = useState(selected)

  const toggleLanguage = (code: string) => {
    setTempSelected(prev => 
      prev.includes(code)
        ? prev.length > 1 ? prev.filter(l => l !== code) : prev
        : [...prev, code]
    )
  }

  const handleSave = () => {
    onChange(tempSelected)
    onClose()
  }

  return (
    <Dialog open onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <Globe className="h-5 w-5 text-primary" />
            Choose Your Languages
          </DialogTitle>
          <DialogDescription>
            Select languages to personalize your feed. You can change this in Settings.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="border rounded-xl divide-y overflow-hidden max-h-[400px] overflow-y-auto">
            {LANGUAGE_LIST.map((lang) => {
              const isSelected = tempSelected.includes(lang.code)
              return (
                <button
                  key={lang.code}
                  onClick={() => toggleLanguage(lang.code)}
                  className="w-full flex items-center justify-between px-5 py-3.5 hover:bg-muted/50 transition-colors text-left group focus:outline-none focus:bg-muted/50"
                  aria-pressed={isSelected}
                  aria-label={`Select ${lang.name}`}
                >
                  <div>
                    <span className="text-sm font-medium">{lang.name}</span>
                    {lang.nativeName && (
                      <span className="text-xs text-muted-foreground ml-2">
                        {lang.nativeName}
                      </span>
                    )}
                  </div>
                  <span
                    className={`h-5 w-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                      isSelected
                        ? "bg-primary border-primary text-primary-foreground scale-100"
                        : "border-border group-hover:border-primary/50"
                    }`}
                  >
                    {isSelected && <Check className="h-3 w-3" />}
                  </span>
                </button>
              )
            })}
          </div>
          <p className="text-xs text-muted-foreground text-center">
            {tempSelected.length} language{tempSelected.length !== 1 ? "s" : ""} selected
          </p>
          <Button 
            className="w-full rounded-full" 
            onClick={handleSave}
            aria-label="Save language preferences"
          >
            Done
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

const EmailSignInForm = ({ 
  onBack, 
  onSignIn, 
  isLoading 
}: { 
  onBack: () => void
  onSignIn: (email: string, password: string) => Promise<void>
  isLoading: boolean
}) => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [touched, setTouched] = useState({ email: false, password: false })
  
  const emailError = touched.email && !email.trim() ? "Email is required" 
    : touched.email && !EMAIL_REGEX.test(email) ? "Please enter a valid email" 
    : null

  const isFormValid = email.trim() && EMAIL_REGEX.test(email)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isFormValid) {
      setTouched({ email: true, password: true })
      return
    }
    await onSignIn(email, password)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-1 text-sm text-primary hover:underline font-medium"
        aria-label="Back to sign in options"
      >
        <ChevronLeft className="h-4 w-4" />
        Back
      </button>

      <div>
        <Input
          type="email"
          placeholder="Email address *"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onBlur={() => setTouched(prev => ({ ...prev, email: true }))}
          aria-invalid={!!emailError}
          aria-describedby={emailError ? "email-error" : undefined}
          className={`h-12 rounded-full ${emailError ? 'border-destructive focus-visible:ring-destructive' : ''}`}
          disabled={isLoading}
          autoComplete="email"
        />
        {emailError && (
          <p id="email-error" className="text-xs text-destructive mt-1 flex items-center gap-1 animate-in slide-in-from-top-1">
            <AlertCircle className="h-3 w-3" /> {emailError}
          </p>
        )}
      </div>

      <div className="relative">
        <Input
          type={showPassword ? "text" : "password"}
          placeholder="Password (optional for magic link)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="h-12 rounded-full pr-12"
          disabled={isLoading}
          autoComplete="current-password"
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary rounded-full p-1"
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
        </button>
      </div>

      <Button 
        type="submit" 
        className="w-full h-12 rounded-full font-medium"
        disabled={!isFormValid || isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Signing in...
          </>
        ) : (
          "Sign In"
        )}
      </Button>
    </form>
  )
}

// ============= MAIN COMPONENT =============
export default function SignInPage() {
  const router = useRouter()
  const { signInWithGoogle, signInWithEmail, isLoading, error: authError } = useAuth()
  
  const [showLanguagePopup, setShowLanguagePopup] = useState(false)
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(["en"])
  const [showEmailForm, setShowEmailForm] = useState(false)
  const [globalError, setGlobalError] = useState<string | null>(null)

  // Load saved preferences
  useEffect(() => {
    const savedPrefs = localStorage.getItem("deeni-language-prefs")
    if (savedPrefs) {
      try {
        const prefs = JSON.parse(savedPrefs)
        if (prefs.languages?.length) {
          setSelectedLanguages(prefs.languages)
        }
      } catch (e) {
        console.error("Failed to load preferences", e)
      }
    }
  }, [])

  const saveUserPreferences = useCallback((isGuest: boolean, userData?: any) => {
    localStorage.setItem("deeni-language-prefs", JSON.stringify({
      languages: selectedLanguages,
      hasSelected: true,
      isGuest,
    }))
    if (userData) {
      localStorage.setItem("deeni-user-data", JSON.stringify(userData))
    }
  }, [selectedLanguages])

  const handleAuth = useCallback(async (
    authFn: () => Promise<AuthResult>,
    userData: any,
    isGuest: boolean = false
  ) => {
    setGlobalError(null)
    const result = await authFn()
    
    if (result.success) {
      saveUserPreferences(isGuest, userData)
      router.push("/")
    } else if (result.error) {
      setGlobalError(result.error)
    }
  }, [router, saveUserPreferences])

  const handleGoogleSignIn = () => {
    const userData = {
      name: "Tamzid Muhammad",
      email: "muhammad.tamzid@sun-asterisk.com",
      avatar: "",
      initials: "TM",
    }
    handleAuth(signInWithGoogle, userData)
  }

  const handleEmailSignIn = async (email: string, password: string) => {
    const userData = {
      name: email.split('@')[0] || "User",
      email: email,
      avatar: "",
      initials: email.slice(0, 2).toUpperCase(),
    }
    await handleAuth(() => signInWithEmail(email, password), userData)
  }

  const handleSkipSignIn = () => {
    saveUserPreferences(true)
    router.push("/")
  }

  const displayError = globalError || authError

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b sticky top-0 bg-background/95 backdrop-blur-sm z-10">
        <button 
          onClick={() => router.back()} 
          className="flex items-center justify-center h-9 w-9 rounded-full hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
          aria-label="Go back"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="flex items-center">
          <Image 
            src="/DeeniTubeLogo.png" 
            alt="Deeni.tube" 
            width={120} 
            height={32} 
            className="h-7 w-auto object-contain" 
            priority
          />
        </div>
        <button
          onClick={() => setShowLanguagePopup(true)}
          className="flex items-center gap-1.5 text-sm text-primary hover:underline font-medium focus:outline-none focus:ring-2 focus:ring-primary rounded-full px-2 py-1"
          aria-label="Change language preferences"
        >
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">Language</span>
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-8">
        <div className="w-full max-w-[400px] space-y-6">
          {/* Error Display */}
          {displayError && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-3 flex items-center gap-2 text-destructive text-sm animate-in slide-in-from-top-2">
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{displayError}</span>
              <button
                onClick={() => setGlobalError(null)}
                className="ml-auto text-destructive hover:text-destructive/80"
                aria-label="Dismiss error"
              >
                ×
              </button>
            </div>
          )}

          {/* Hero Section */}
          <div className="text-center space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Welcome to Deeni.tube
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Authentic Islamic videos from trusted scholars. Watch, learn, and grow your knowledge.
            </p>
          </div>

          {/* Selected Languages Display */}
          <div className="bg-gradient-to-br from-muted/20 to-muted/5 rounded-xl p-4 text-center border border-muted/20 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-100">
            <p className="text-xs text-muted-foreground mb-3 flex items-center justify-center gap-1">
              <Globe className="h-3 w-3" />
              Content will be shown in
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {selectedLanguages.map(code => {
                const lang = LANGUAGE_LIST.find(l => l.code === code)
                return (
                  <span key={code} className="px-3 py-1.5 rounded-full bg-background border text-sm font-medium shadow-sm">
                    {lang?.name || code}
                  </span>
                )
              })}
            </div>
            <button
              onClick={() => setShowLanguagePopup(true)}
              className="text-xs text-primary hover:underline mt-3 font-medium focus:outline-none focus:ring-2 focus:ring-primary rounded-full px-2 py-1"
            >
              Change languages
            </button>
          </div>

          {/* Sign In Options */}
          {!showEmailForm ? (
            <div className="space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-200">
              <Button
                onClick={handleGoogleSignIn}
                variant="outline"
                className="w-full h-12 rounded-full flex items-center justify-center gap-3 text-sm font-medium bg-background hover:bg-muted border-border shadow-sm transition-all hover:shadow-md disabled:opacity-50"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                  </svg>
                )}
                {isLoading ? "Signing in..." : "Continue with Google"}
              </Button>

              <Button
                onClick={() => setShowEmailForm(true)}
                variant="outline"
                className="w-full h-12 rounded-full flex items-center justify-center gap-3 text-sm font-medium bg-background hover:bg-muted border-border shadow-sm transition-all hover:shadow-md"
              >
                <Mail className="h-4 w-4" />
                Continue with Email
              </Button>

              <div className="relative py-2">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-background px-4 text-xs text-muted-foreground font-medium">or</span>
                </div>
              </div>

              <Button
                onClick={handleSkipSignIn}
                variant="ghost"
                className="w-full h-11 rounded-full text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-all"
              >
                Browse as Guest
              </Button>
            </div>
          ) : (
            <EmailSignInForm 
              onBack={() => setShowEmailForm(false)}
              onSignIn={handleEmailSignIn}
              isLoading={isLoading}
            />
          )}

          {/* Legal Notice */}
          <p className="text-[11px] text-center text-muted-foreground leading-relaxed">
            By continuing, you agree to our{" "}
            <button 
              className="text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary rounded"
              onClick={() => router.push("/terms")}
            >
              Terms of Service
            </button>{" "}
            and{" "}
            <button 
              className="text-primary hover:underline focus:outline-none focus:ring-2 focus:ring-primary rounded"
              onClick={() => router.push("/privacy")}
            >
              Privacy Policy
            </button>
          </p>
        </div>
      </main>

      {/* Language Popup */}
      {showLanguagePopup && (
        <LanguageSelector 
          selected={selectedLanguages}
          onChange={setSelectedLanguages}
          onClose={() => setShowLanguagePopup(false)}
        />
      )}
    </div>
  )
}