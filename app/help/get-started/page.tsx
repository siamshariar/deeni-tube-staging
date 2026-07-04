// app/help/get-started/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, BookOpen, Play, Search, Heart, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@/hooks/use-media-query";

export default function GetStartedPage() {
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile header */}
      <div className="md:hidden flex items-center gap-2 px-4 py-3 border-b sticky top-[56px] bg-background z-10">
        <button onClick={() => router.back()} className="flex items-center justify-center h-9 w-9 rounded-full hover:bg-muted flex-shrink-0 -ml-1 min-h-[44px] min-w-[44px]">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="font-semibold text-lg">Get Started</h1>
      </div>

      <div className="px-3 md:px-6 py-6 md:py-8 mt-14 md:mt-16 max-w-3xl mx-auto">
        <div className="hidden md:flex items-center gap-3 mb-8">
          <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0">
            <BookOpen className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Get Started with Deeni.tube</h1>
            <p className="text-sm text-muted-foreground mt-0.5">Learn the basics of using the platform</p>
          </div>
        </div>

        <div className="space-y-4">
          <section className="p-4 border rounded-xl bg-card">
            <h2 className="text-base font-semibold mb-2 flex items-center gap-2">
              <Play className="h-5 w-5 text-primary flex-shrink-0" /> Watching Videos
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Browse through the home feed to discover authentic Islamic lectures from trusted scholars.
              Click any video to open the watch page where you can play, pause, and control playback.
              Related videos appear on the right side so you can continue exploring similar content.
            </p>
          </section>

          <section className="p-4 border rounded-xl bg-card">
            <h2 className="text-base font-semibold mb-2 flex items-center gap-2">
              <Search className="h-5 w-5 text-primary flex-shrink-0" /> Searching Content
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Use the search bar at the top of the page to find specific lectures, scholars, or topics.
              You can filter results by language (English, Bengali, Arabic, Urdu) and by specific scholars
              or channels to narrow down your search.
            </p>
          </section>

          <section className="p-4 border rounded-xl bg-card">
            <h2 className="text-base font-semibold mb-2 flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary flex-shrink-0" /> Saving & Playlists
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Click the three‑dot menu on any video card to save it to your Watch Later list or create
              custom playlists. The Playlists page lets you organize lectures by topic, scholar, or
              personal preference. Watch Later is always pinned at the top for quick access.
            </p>
          </section>

          <section className="p-4 border rounded-xl bg-card">
            <h2 className="text-base font-semibold mb-2 flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary flex-shrink-0" /> History & Preferences
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your watch history is automatically saved so you can resume lectures where you left off.
              You can customize your language preferences and manage which channels appear in your feed
              from the Settings and Channels pages.
            </p>
          </section>

          <div className="hidden md:block pt-2">
            <Button variant="outline" className="rounded-full" onClick={() => router.push("/help")}>
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Help
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}