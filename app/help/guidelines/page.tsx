// app/help/guidelines/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, HelpCircle, Heart, MessageSquare, Shield, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@/hooks/use-media-query";

export default function GuidelinesPage() {
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <div className="min-h-screen bg-background">
      <div className="md:hidden flex items-center gap-2 px-4 py-3 border-b sticky top-[56px] bg-background z-10">
        <button onClick={() => router.back()} className="flex items-center justify-center h-9 w-9 rounded-full hover:bg-muted flex-shrink-0 -ml-1">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="font-semibold text-lg">Community Guidelines</h1>
      </div>

      <div className="px-4 md:px-6 py-6 md:py-8 mt-16 max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="h-12 w-12 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
            <HelpCircle className="h-6 w-6 text-orange-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Community Guidelines</h1>
            <p className="text-sm text-muted-foreground">Rules and expectations for our community</p>
          </div>
        </div>

        <div className="space-y-8">
          <section>
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Heart className="h-5 w-5 text-primary" /> Respect & Kindness
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Deeni.tube is a platform dedicated to authentic Islamic knowledge. We expect all users to
              treat each other with respect, kindness, and good manners (adab). Constructive discussions
              are encouraged, but personal attacks, harassment, or disrespectful behavior will not be tolerated.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" /> Authenticity
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We are committed to providing authentic Islamic content from verified scholars. Users should
              refrain from sharing unverified information, false claims, or content that contradicts
              established Islamic teachings from recognized scholars.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-primary" /> Constructive Feedback
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We welcome feedback and suggestions to improve the platform. When providing feedback,
              please be specific and constructive. Use the Contact Support form in the Help section
              to report issues, suggest features, or seek assistance.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" /> Unity & Brotherhood
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              As a community of learners seeking Islamic knowledge, we emphasize unity and brotherhood
              (ukhuwwah). Content that promotes division, sectarianism, or unnecessary disputes is
              discouraged. Our goal is to bring people closer to authentic Islamic teachings.
            </p>
          </section>

          <div className="hidden md:block">
            <Button variant="outline" className="rounded-full" onClick={() => router.push("/help")}>
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to Help
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}