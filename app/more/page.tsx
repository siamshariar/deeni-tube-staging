// app/more/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Globe,
  Info,
  Star,
  Heart,
  AppWindow,
  BookOpen,
  HelpCircle,
  Shield,
  MessageSquare,
  ChevronRight,
  FileText,
  Languages,
  Settings,
  Send,
} from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { useMediaQuery } from "@/hooks/use-media-query";
import { toast } from "sonner";

const menuItems = [
  {
    icon: Languages,
    label: "Language Preferences",
    description: "Change your preferred language",
    href: "/settings",
  },
  {
    icon: Shield,
    label: "Privacy Policy",
    description: "How we handle your data",
    href: "/help",
  },
  {
    icon: FileText,
    label: "Terms of Service",
    description: "Read our terms",
    href: "/help",
  },
  {
    icon: Star,
    label: "Rate & Review",
    description: "Share your feedback on the app",
    href: "#",
    action: () => toast.info("Opening app store..."),
  },
  {
    icon: Heart,
    label: "Donate",
    description: "Support our mission",
    href: "#",
    action: () => toast.info("Donation page coming soon"),
  },
  {
    icon: AppWindow,
    label: "More Apps",
    description: "Explore our other apps",
    href: "#",
  },
  {
    icon: HelpCircle,
    label: "Help Center",
    description: "Get support and FAQs",
    href: "/help",
  },
  {
    icon: MessageSquare,
    label: "Send Feedback",
    description: "We'd love to hear from you",
    href: "#",
    action: () => toast.info("Feedback form opened"),
  },
  {
    icon: Settings,
    label: "Settings",
    description: "App preferences and account",
    href: "/settings",
  },
  {
    icon: Info,
    label: "About",
    description: "Version 1.0.0 • Deeni Info Tech",
    href: "/help",
  },
];

function MenuSkeleton() {
  return (
    <div className="flex items-center gap-4 px-4 py-4">
      <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
      <div className="flex-1 min-w-0 space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-48" />
      </div>
      <Skeleton className="h-4 w-4 flex-shrink-0" />
    </div>
  );
}

export default function MorePage() {
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile header – sticky below global header */}
      <div className="md:hidden flex items-center gap-2 px-4 py-3 border-b sticky top-[56px] bg-background z-10">
        <button
          onClick={() => router.back()}
          className="flex items-center justify-center h-9 w-9 rounded-full hover:bg-muted flex-shrink-0 -ml-1"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="font-semibold text-lg">More</h1>
      </div>

      {/* Content – mt-16 clears the sticky back button */}
      <div className="px-4 md:px-6 py-4 md:py-6 mt-16">
        {!isMobile && (
          <div className="mb-4">
            <h1 className="text-2xl font-bold">More</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Additional features and information
            </p>
          </div>
        )}

        {isLoading ? (
          <div className="divide-y">
            {Array.from({ length: 6 }).map((_, i) => (
              <MenuSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="divide-y">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={(e) => {
                  if (item.action) {
                    e.preventDefault();
                    item.action();
                  }
                }}
                className="flex items-center gap-4 px-4 py-4 hover:bg-muted/30 transition-colors group -mx-2 rounded-lg"
              >
                <div className="h-10 w-10 bg-muted rounded-full flex items-center justify-center flex-shrink-0 ring-2 ring-transparent group-hover:ring-primary/20 transition-all">
                  <item.icon className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium group-hover:text-primary transition-colors">
                    {item.label}
                  </p>
                  {item.description && (
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">
                      {item.description}
                    </p>
                  )}
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            ))}
          </div>
        )}

        <div className="py-8 text-center">
          <p className="text-xs text-muted-foreground">
            Powered By - Deeni Info Tech
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Version 1.0.0
          </p>
        </div>
      </div>
    </div>
  );
}