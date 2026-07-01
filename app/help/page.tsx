// app/help/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  HelpCircle,
  BookOpen,
  Shield,
  FileText,
  ChevronRight,
  MessageCircle,
  Send,
  AlertCircle,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useMediaQuery } from "@/hooks/use-media-query";
import { toast } from "sonner";

const helpTopics = [
  {
    icon: BookOpen,
    label: "Get Started with Deeni.tube",
    description: "Learn the basics of using the platform",
    href: "/help/get-started",
  },
  {
    icon: Shield,
    label: "Privacy & Safety",
    description: "How we handle your data and keep you safe",
    href: "/help/privacy",
  },
  {
    icon: FileText,
    label: "Terms of Service",
    description: "Read our terms and conditions",
    href: "/help/terms",
  },
  {
    icon: HelpCircle,
    label: "Community Guidelines",
    description: "Rules and expectations for our community",
    href: "/help/guidelines",
  },
];

export default function HelpPage() {
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [isLoading, setIsLoading] = useState(true);
  const [showSupportDialog, setShowSupportDialog] = useState(false);
  const [supportForm, setSupportForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!supportForm.name.trim()) newErrors.name = "Name is required";
    if (!supportForm.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(supportForm.email))
      newErrors.email = "Please enter a valid email";
    if (!supportForm.subject.trim()) newErrors.subject = "Subject is required";
    if (!supportForm.message.trim())
      newErrors.message = "Message is required";
    else if (supportForm.message.trim().length < 10)
      newErrors.message = "Message must be at least 10 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitSupport = () => {
    if (validateForm()) {
      setIsSubmitted(true);
      setTimeout(() => {
        setShowSupportDialog(false);
        setIsSubmitted(false);
        setSupportForm({ name: "", email: "", subject: "", message: "" });
        setErrors({});
        toast.success("Your message has been sent! We'll get back to you soon.");
      }, 1500);
    }
  };

  const clearError = (field: string) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="px-4 md:px-6 py-4 md:py-6 mt-14 md:mt-16 max-w-3xl mx-auto">
        {/* Desktop title */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold">Help & Support</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Find answers or contact our support team.
          </p>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-4 border rounded-xl">
                <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-64" />
                </div>
                <Skeleton className="h-5 w-5 flex-shrink-0" />
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Help topic cards – links to real pages */}
            <div className="space-y-2">
              {helpTopics.map((topic) => (
                <button
                  key={topic.label}
                  onClick={() => router.push(topic.href)}
                  className="w-full flex items-center gap-4 p-4 bg-card hover:bg-muted/50 rounded-xl border transition-colors text-left group"
                >
                  <div className="h-10 w-10 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                    <topic.icon className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium group-hover:text-primary transition-colors">
                      {topic.label}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {topic.description}
                    </p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0 group-hover:translate-x-0.5 transition-transform" />
                </button>
              ))}
            </div>

            {/* Contact support card */}
            <div className="bg-blue-50 dark:bg-blue-950/30 rounded-2xl p-6 md:p-8 text-center border border-blue-100 dark:border-blue-900">
              <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/50 rounded-full flex items-center justify-center mx-auto mb-3">
                <MessageCircle className="h-7 w-7 text-blue-500" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Still need help?</h3>
              <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">
                Our support team is here to assist you.
              </p>
              <Button
                className="rounded-full px-6"
                size="lg"
                onClick={() => setShowSupportDialog(true)}
              >
                <MessageCircle className="h-4 w-4 mr-2" /> Contact Support
              </Button>
            </div>

            {/* Footer */}
            <div className="text-center py-4">
              <p className="text-xs text-muted-foreground">
                Deeni.tube v1.0.0
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Support Dialog */}
      <Dialog open={showSupportDialog} onOpenChange={setShowSupportDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5 text-blue-500" /> Contact Support
            </DialogTitle>
            <DialogDescription>
              Fill out the form and we'll get back to you within 24-48 hours.
            </DialogDescription>
          </DialogHeader>
          {isSubmitted ? (
            <div className="py-8 text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Check className="h-8 w-8 text-green-500" />
              </div>
              <h3 className="text-lg font-semibold mb-1">Message Sent!</h3>
              <p className="text-sm text-muted-foreground">We'll get back to you soon.</p>
            </div>
          ) : (
            <div className="space-y-4 py-4">
              <div>
                <Input
                  type="text"
                  placeholder="Your name *"
                  value={supportForm.name}
                  onChange={(e) => {
                    setSupportForm((prev) => ({ ...prev, name: e.target.value }));
                    clearError("name");
                  }}
                  className={`h-10 ${errors.name ? "border-red-500" : ""}`}
                />
                {errors.name && (
                  <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> {errors.name}
                  </p>
                )}
              </div>

              <div>
                <Input
                  type="email"
                  placeholder="Your email *"
                  value={supportForm.email}
                  onChange={(e) => {
                    setSupportForm((prev) => ({ ...prev, email: e.target.value }));
                    clearError("email");
                  }}
                  className={`h-10 ${errors.email ? "border-red-500" : ""}`}
                />
                {errors.email && (
                  <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> {errors.email}
                  </p>
                )}
              </div>

              <div>
                <Input
                  type="text"
                  placeholder="Subject *"
                  value={supportForm.subject}
                  onChange={(e) => {
                    setSupportForm((prev) => ({ ...prev, subject: e.target.value }));
                    clearError("subject");
                  }}
                  className={`h-10 ${errors.subject ? "border-red-500" : ""}`}
                />
                {errors.subject && (
                  <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> {errors.subject}
                  </p>
                )}
              </div>

              <div>
                <Textarea
                  placeholder="Describe your issue... *"
                  value={supportForm.message}
                  onChange={(e) => {
                    setSupportForm((prev) => ({ ...prev, message: e.target.value }));
                    clearError("message");
                  }}
                  className={`min-h-[120px] resize-none ${
                    errors.message ? "border-red-500" : ""
                  }`}
                />
                {errors.message && (
                  <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> {errors.message}
                  </p>
                )}
              </div>

              <p className="text-xs text-muted-foreground">* Required fields</p>

              <Button className="w-full rounded-full" onClick={handleSubmitSupport}>
                <Send className="h-4 w-4 mr-2" /> Send Message
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}