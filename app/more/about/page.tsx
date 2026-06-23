// app/more/about/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Info,
  Globe,
  Users,
  Shield,
  Heart,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useMediaQuery } from "@/hooks/use-media-query";

function AboutSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      {/* Mobile header skeleton */}
      <div className="md:hidden flex items-center gap-2 px-4 py-3 border-b sticky top-[56px] bg-background z-10">
        <Skeleton className="h-9 w-9 rounded-full" />
        <Skeleton className="h-6 w-20" />
      </div>

      <div className="px-4 md:px-6 py-6 md:py-8 mt-16 max-w-3xl mx-auto">
        {/* Header skeleton */}
        <div className="flex items-center gap-3 mb-8">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
        </div>

        {/* Content sections skeleton */}
        <div className="space-y-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-5 rounded" />
                <Skeleton className="h-6 w-36" />
              </div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ))}
        </div>

        {/* Version info skeleton */}
        <div className="mt-8 p-4 border rounded-xl">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between mb-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-28" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function AboutPage() {
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <AboutSkeleton />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile header */}
      <div className="md:hidden flex items-center gap-2 px-4 py-3 border-b sticky top-[56px] bg-background z-10">
        <button
          onClick={() => router.back()}
          className="flex items-center justify-center h-9 w-9 rounded-full hover:bg-muted flex-shrink-0 -ml-1"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="font-semibold text-lg">About</h1>
      </div>

      <div className="px-4 md:px-6 py-6 md:py-8 mt-16 max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
            <Info className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">About Deeni.tube</h1>
            <p className="text-sm text-muted-foreground">
              Your trusted platform for authentic Islamic content
            </p>
          </div>
        </div>

        {/* Content sections */}
        <div className="space-y-8">
          <section>
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" /> Our Mission
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Deeni.tube is dedicated to making authentic Islamic knowledge
              accessible to everyone, everywhere. We aggregate lectures from
              trusted scholars across multiple languages — English, Bengali,
              Arabic, and Urdu — so you can learn from the best, all in one
              place. Our goal is to connect people with reliable Islamic
              teachings without distractions, ads, or algorithmic noise.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" /> Who We Serve
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Whether you're a student of knowledge, a busy professional
              seeking spiritual reminders, or someone exploring Islam for the
              first time — Deeni.tube is built for you. Our platform serves a
              global audience with content carefully selected from verified
              scholars known for their authenticity and adherence to the Qur'an
              and Sunnah.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" /> Our Commitment
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We are committed to providing a clean, distraction‑free
              experience. No accounts required. No data sold. No ads. Just
              authentic Islamic content, carefully organized by scholar,
              category, and language — available whenever you need it. All
              content is sourced from publicly available channels and remains
              the property of the respective scholars.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary" /> Built With Care
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Deeni.tube is developed and maintained by Deeni Info Tech, a
              small team passionate about using technology to serve the Ummah.
              Every feature — from the multilingual search to the curated
              scholar pages — is designed with the user's spiritual growth in
              mind. We rely on community support to keep the platform running
              and improving.
            </p>
          </section>
        </div>

        {/* Version info */}
        <div className="mt-8 p-4 border rounded-xl bg-muted/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Version</span>
            <span className="text-sm text-muted-foreground">1.0.0</span>
          </div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Released</span>
            <span className="text-sm text-muted-foreground">June 2025</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Developer</span>
            <a
              href="https://www.deeniinfotech.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary hover:underline flex items-center gap-1"
            >
              Deeni Info Tech
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>


        {/* Back button — hidden on mobile */}
        <div className="hidden md:block mt-8">
          <Button
            variant="outline"
            className="rounded-full"
            onClick={() => router.push("/more")}
          >
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to More
          </Button>
        </div>
      </div>
    </div>
  );
}