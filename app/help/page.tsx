"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, HelpCircle, MessageCircle, BookOpen, FileText, ChevronRight, Shield, Search, X, ExternalLink, Send, AlertCircle } from "lucide-react"
import AppHeader from "@/components/app-header"
import MobileNav from "@/components/mobile-nav"
import DesktopSidebar from "@/components/desktop-sidebar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Skeleton } from "@/components/ui/skeleton"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { useMediaQuery } from "@/hooks/use-media-query"

const helpCategories = [
  {
    title: "Browse help topics",
    items: [
      { icon: BookOpen, label: "Get started with Deeni.tube", description: "Learn the basics of using the platform", href: "#" },
      { icon: FileText, label: "Terms of Service", description: "Read our terms and conditions", href: "#" },
      { icon: Shield, label: "Privacy Policy", description: "How we handle your personal data", href: "#" },
      { icon: HelpCircle, label: "Community Guidelines", description: "Rules and guidelines for the community", href: "#" },
    ]
  },
  {
    title: "Account & settings",
    items: [
      { icon: BookOpen, label: "Manage your account", description: "Update profile, password, and preferences", href: "/you-new" },
      { icon: HelpCircle, label: "Subscription & notifications", description: "Manage your subscriptions and alerts", href: "/subscriptions-new" },
      { icon: Shield, label: "Privacy & safety settings", description: "Control who can see your content", href: "#" },
    ]
  },
  {
    title: "Video & playback",
    items: [
      { icon: BookOpen, label: "Watch & search videos", description: "How to find and watch content", href: "/search-new" },
      { icon: HelpCircle, label: "Troubleshoot playback issues", description: "Fix common video playback problems", href: "#" },
      { icon: FileText, label: "Download & save videos", description: "Save videos to watch offline", href: "#" },
    ]
  },
]

const faqItems = [
  { question: "How do I create a playlist?", answer: "Go to any video and click the Save button, then select 'Create new playlist' or add to an existing one. You can also create playlists from the Library section.", href: "/playlists" },
  { question: "How do I report inappropriate content?", answer: "Click the three-dot menu on any video and select 'Report'. Choose the reason and submit your report. You can track your reports in Report History.", href: "/report" },
  { question: "How do I change my language preferences?", answer: "Go to Settings > Language or click your profile picture and select Language. You can choose multiple preferred languages for content recommendations.", href: "/you-new" },
  { question: "How do I contact support?", answer: "You can reach our support team by clicking the 'Contact Support' button below. We typically respond within 24-48 hours.", href: "#" },
]

export default function HelpPage() {
  const router = useRouter()
  const isMobile = useMediaQuery("(max-width: 768px)")
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)
  const [showSupportDialog, setShowSupportDialog] = useState(false)
  const [supportForm, setSupportForm] = useState({ name: "", email: "", subject: "", message: "" })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitted, setIsSubmitted] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600)
    return () => clearTimeout(timer)
  }, [])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!supportForm.name.trim()) {
      newErrors.name = "Name is required"
    }
    if (!supportForm.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(supportForm.email)) {
      newErrors.email = "Please enter a valid email"
    }
    if (!supportForm.subject.trim()) {
      newErrors.subject = "Subject is required"
    }
    if (!supportForm.message.trim()) {
      newErrors.message = "Message is required"
    } else if (supportForm.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters"
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmitSupport = () => {
    if (validateForm()) {
      // Store support request in localStorage
      const requests = JSON.parse(localStorage.getItem('supportRequests') || '[]')
      requests.push({
        ...supportForm,
        id: Date.now(),
        date: new Date().toISOString(),
        status: 'open'
      })
      localStorage.setItem('supportRequests', JSON.stringify(requests))
      setIsSubmitted(true)
      setTimeout(() => {
        setShowSupportDialog(false)
        setIsSubmitted(false)
        setSupportForm({ name: "", email: "", subject: "", message: "" })
        setErrors({})
      }, 2000)
    }
  }

  const clearError = (field: string) => {
    setErrors(prev => {
      const newErrors = { ...prev }
      delete newErrors[field]
      return newErrors
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <div className="flex">
        <DesktopSidebar className="hidden md:block" />
        <div className="flex-1 md:pl-[240px] pt-[56px] md:pt-[80px] pb-nav-safe md:pb-6">
          {/* Mobile Header */}
          <div className="md:hidden flex items-center gap-3 px-4 py-3 border-b sticky top-[56px] bg-background z-10">
            <button onClick={() => router.back()} className="flex items-center justify-center h-9 w-9 rounded-full hover:bg-muted transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="font-semibold text-lg">Help & Support</h1>
          </div>

          <div className="max-w-[800px] mx-auto px-4 md:px-6">
            {/* Desktop Header */}
            {!isMobile && (
              <div className="py-6 md:py-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                    <HelpCircle className="h-6 w-6 text-blue-500" />
                  </div>
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold">Help & Support</h1>
                    <p className="text-sm text-muted-foreground mt-1">Find answers, learn how to use the platform, and get support</p>
                  </div>
                </div>
              </div>
            )}

            {/* Search */}
            <div className="relative mb-6">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search help topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-10 h-12 text-sm rounded-full bg-muted/50 text-base"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>

            {isLoading ? (
              <div className="space-y-6">
                <Skeleton className="h-6 w-48" />
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full rounded-xl" />
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-8 pb-8">
                {/* Help Categories */}
                {helpCategories.map((category) => (
                  <div key={category.title}>
                    <h2 className="text-lg font-semibold mb-3">{category.title}</h2>
                    <div className="space-y-2">
                      {category.items.map((item) => (
                        <button
                          key={item.label}
                          onClick={() => item.href !== "#" ? router.push(item.href) : null}
                          className="w-full flex items-center gap-4 p-4 bg-card hover:bg-muted/50 rounded-xl border transition-colors text-left group"
                        >
                          <div className="h-10 w-10 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                            <item.icon className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium">{item.label}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
                          </div>
                          <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                        </button>
                      ))}
                    </div>
                  </div>
                ))}

                {/* FAQ Section */}
                <div>
                  <h2 className="text-lg font-semibold mb-3">Frequently Asked Questions</h2>
                  <div className="space-y-2">
                    {faqItems.map((faq, index) => (
                      <div key={index} className="bg-card border rounded-xl overflow-hidden">
                        <button
                          onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                          className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/50 transition-colors"
                        >
                          <span className="text-sm font-medium pr-4">{faq.question}</span>
                          <ChevronRight className={`h-5 w-5 text-muted-foreground flex-shrink-0 transition-transform ${expandedFaq === index ? 'rotate-90' : ''}`} />
                        </button>
                        {expandedFaq === index && (
                          <div className="px-4 pb-4 border-t">
                            <p className="text-sm text-muted-foreground mt-3">{faq.answer}</p>
                            {faq.href !== "#" && (
                              <Button
                                variant="link"
                                className="text-sm text-blue-600 hover:text-blue-700 p-0 h-auto mt-2 font-medium"
                                onClick={() => router.push(faq.href)}
                              >
                                Learn more <ExternalLink className="h-3 w-3 ml-1 inline" />
                              </Button>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Contact Support */}
                <div className="bg-blue-50 dark:bg-blue-950/30 rounded-2xl p-6 md:p-8 text-center border border-blue-100 dark:border-blue-900">
                  <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center mx-auto mb-3">
                    <MessageCircle className="h-7 w-7 text-blue-500" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Still need help?</h3>
                  <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">
                    Can't find what you're looking for? Contact our support team and we'll get back to you as soon as possible.
                  </p>
                  <Button className="rounded-full px-6" size="lg" onClick={() => setShowSupportDialog(true)}>
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Contact Support
                  </Button>
                </div>

                {/* Version Info */}
                <div className="text-center py-4">
                  <p className="text-xs text-muted-foreground">
                    Deeni.tube v1.0.0 • Last updated June 2024
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Contact Support Dialog */}
      <Dialog open={showSupportDialog} onOpenChange={setShowSupportDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-blue-500" />
              Contact Support
            </DialogTitle>
            <DialogDescription>
              Fill out the form below and our team will get back to you within 24-48 hours.
            </DialogDescription>
          </DialogHeader>

          {isSubmitted ? (
            <div className="py-8 text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-1">Message Sent!</h3>
              <p className="text-sm text-muted-foreground">We'll get back to you soon.</p>
            </div>
          ) : (
            <div className="space-y-4 py-4">
              {/* Name Field */}
              <div>
                <Input
                  type="text"
                  placeholder="Your name *"
                  value={supportForm.name}
                  onChange={(e) => {
                    setSupportForm(prev => ({ ...prev, name: e.target.value }))
                    clearError('name')
                  }}
                  className={`h-10 ${errors.name ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                />
                {errors.name && (
                  <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> {errors.name}
                  </p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <Input
                  type="email"
                  placeholder="Your email *"
                  value={supportForm.email}
                  onChange={(e) => {
                    setSupportForm(prev => ({ ...prev, email: e.target.value }))
                    clearError('email')
                  }}
                  className={`h-10 ${errors.email ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                />
                {errors.email && (
                  <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> {errors.email}
                  </p>
                )}
              </div>

              {/* Subject Field */}
              <div>
                <Input
                  type="text"
                  placeholder="Subject *"
                  value={supportForm.subject}
                  onChange={(e) => {
                    setSupportForm(prev => ({ ...prev, subject: e.target.value }))
                    clearError('subject')
                  }}
                  className={`h-10 ${errors.subject ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                />
                {errors.subject && (
                  <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> {errors.subject}
                  </p>
                )}
              </div>

              {/* Message Field */}
              <div>
                <Textarea
                  placeholder="Describe your issue... *"
                  value={supportForm.message}
                  onChange={(e) => {
                    setSupportForm(prev => ({ ...prev, message: e.target.value }))
                    clearError('message')
                  }}
                  className={`min-h-[120px] resize-none ${errors.message ? 'border-red-500 focus-visible:ring-red-500' : ''}`}
                />
                {errors.message && (
                  <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> {errors.message}
                  </p>
                )}
              </div>

              {/* Required fields note */}
              <p className="text-xs text-muted-foreground">* Required fields</p>

              <Button
                className="w-full rounded-full"
                onClick={handleSubmitSupport}
              >
                <Send className="h-4 w-4 mr-2" />
                Send Message
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <MobileNav />
    </div>
  )
}