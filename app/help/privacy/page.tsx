// app/help/privacy/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Shield, Lock, Eye, UserCheck, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@/hooks/use-media-query";

export default function PrivacyPage() {
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <div className="min-h-screen bg-background">
      <div className="md:hidden flex items-center gap-2 px-4 py-3 border-b sticky top-[56px] bg-background z-10">
        <button onClick={() => router.back()} className="flex items-center justify-center h-9 w-9 rounded-full hover:bg-muted flex-shrink-0 -ml-1 min-h-[44px] min-w-[44px]">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="font-semibold text-lg">Privacy & Safety</h1>
      </div>

      <div className="px-4 md:px-6 py-6 md:py-8 mt-14 md:mt-16 max-w-3xl mx-auto">
        <div className="hidden md:flex items-center gap-3 mb-8">
          <div className="h-12 w-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0">
            <Shield className="h-6 w-6 text-green-600" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Privacy & Safety</h1>
            <p className="text-sm text-muted-foreground mt-0.5">How we handle your data and keep you safe</p>
          </div>
        </div>

        <div className="space-y-4">
          <section className="p-4 border rounded-xl bg-card">
            <h2 className="text-base font-semibold mb-2 flex items-center gap-2">
              <Database className="h-5 w-5 text-primary flex-shrink-0" /> Data We Collect
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Deeni.tube collects minimal data to provide a personalized experience. This includes your
              language preferences, watch history, and saved playlists. All data is stored locally on your
              device. We do not collect any personally identifiable information without your consent.
            </p>
          </section>

          <section className="p-4 border rounded-xl bg-card">
            <h2 className="text-base font-semibold mb-2 flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary flex-shrink-0" /> Data Security
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your preferences and watch history are stored securely in your browser's local storage.
              No data is transmitted to external servers without your explicit permission. You can clear
              your data at any time from the Settings page or by clearing your browser data.
            </p>
          </section>

          <section className="p-4 border rounded-xl bg-card">
            <h2 className="text-base font-semibold mb-2 flex items-center gap-2">
              <Eye className="h-5 w-5 text-primary flex-shrink-0" /> Content Visibility
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Deeni.tube aggregates publicly available Islamic lectures from trusted scholars. All content
              displayed on the platform is sourced from publicly accessible channels. We do not host or
              store video content on our servers.
            </p>
          </section>

          <section className="p-4 border rounded-xl bg-card">
            <h2 className="text-base font-semibold mb-2 flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-primary flex-shrink-0" /> Your Rights
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              You have full control over your data. You can delete your watch history, clear preferences,
              and reset all settings at any time. No account is required to use the platform – you can
              browse as a guest with full access to all features.
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