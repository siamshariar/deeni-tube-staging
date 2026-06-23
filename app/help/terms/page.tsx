// app/help/terms/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, FileText, Scale, AlertTriangle, Globe, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@/hooks/use-media-query";

export default function TermsPage() {
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 768px)");

  return (
    <div className="min-h-screen bg-background">
      <div className="md:hidden flex items-center gap-2 px-4 py-3 border-b sticky top-[56px] bg-background z-10">
        <button onClick={() => router.back()} className="flex items-center justify-center h-9 w-9 rounded-full hover:bg-muted flex-shrink-0 -ml-1">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="font-semibold text-lg">Terms of Service</h1>
      </div>

      <div className="px-4 md:px-6 py-6 md:py-8 mt-16 max-w-3xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="h-12 w-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
            <FileText className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Terms of Service</h1>
            <p className="text-sm text-muted-foreground">Please read our terms and conditions carefully</p>
          </div>
        </div>

        <div className="space-y-8">
          <section>
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Scale className="h-5 w-5 text-primary" /> Acceptance of Terms
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              By accessing and using Deeni.tube, you agree to be bound by these Terms of Service.
              If you do not agree with any part of these terms, you may choose not to use our platform.
              These terms may be updated periodically, and continued use constitutes acceptance of changes.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" /> Content & Intellectual Property
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Deeni.tube aggregates publicly available Islamic educational content from trusted scholars.
              All video content remains the property of the respective content creators and is displayed
              through YouTube's embed services. We respect intellectual property rights and comply with
              all applicable laws.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" /> User Conduct
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Users agree to use Deeni.tube for lawful, educational purposes only. Any misuse of the
              platform, including but not limited to harassment, spreading misinformation, or attempting
              to disrupt the service, is strictly prohibited and may result in restricted access.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-primary" /> Disclaimer
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Deeni.tube is provided "as is" without warranties of any kind. We strive to provide
              authentic and beneficial Islamic content, but we do not guarantee the accuracy, completeness,
              or suitability of any content for any particular purpose. Users are encouraged to verify
              information with qualified scholars.
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