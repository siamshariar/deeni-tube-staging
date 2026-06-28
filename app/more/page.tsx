// app/more/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Star,
  MessageSquare,
  Info,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { useMediaQuery } from "@/hooks/use-media-query";

// Only truly orphan items — everything else has a proper home
const menuItems = [
  {
    icon: Star,
    label: "Rate the App",
    description: "If you find this beneficial, please rate us",
    href: "/more/rate",
  },
  {
    icon: MessageSquare,
    label: "Suggest a Feature",
    description: "Help us improve with your ideas",
    href: "/more/suggest",
  },
  {
    icon: Info,
    label: "About Deeni.tube",
    description: "Version 1.0.0 · Deeni Info Tech",
    href: "/more/about",
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
      <div className="px-4 md:px-6 py-2 md:py-6 mt-16 max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold">More</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Additional features and information
          </p>
        </div>

        {isLoading ? (
          <div className="divide-y">
            {Array.from({ length: 3 }).map((_, i) => (
              <MenuSkeleton key={i} />
            ))}
          </div>
        ) : (
          <div className="divide-y">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center gap-4 px-4 py-4 hover:bg-muted/30 transition-colors group -mx-2 rounded-lg"
              >
                <div className="h-10 w-10 bg-muted rounded-full flex items-center justify-center flex-shrink-0 ring-2 ring-transparent group-hover:ring-primary/20 transition-all">
                  <item.icon className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium group-hover:text-primary transition-colors">
                    {item.label}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">
                    {item.description}
                  </p>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="py-8 text-center">
          <p className="text-xs text-muted-foreground">
            Powered By · Deeni Info Tech
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Version 1.0.0
          </p>
        </div>
      </div>
    </div>
  );
}