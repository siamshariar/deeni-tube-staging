// app/more/suggest/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  MessageSquare,
  Lightbulb,
  Send,
  AlertCircle,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { useMediaQuery } from "@/hooks/use-media-query";
import { toast } from "sonner";

function SuggestSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      {/* Mobile header skeleton */}
      <div className="md:hidden flex items-center gap-2 px-4 py-3 border-b sticky top-[56px] bg-background z-10">
        <Skeleton className="h-9 w-9 rounded-full" />
        <Skeleton className="h-6 w-36" />
      </div>

      <div className="px-4 md:px-6 py-6 md:py-8 mt-16 max-w-3xl mx-auto">
        {/* Header skeleton */}
        <div className="flex items-center gap-3 mb-8">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-4 w-56" />
          </div>
        </div>

        {/* Intro text skeleton */}
        <div className="space-y-2 mb-6">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>

        {/* Form skeleton */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full rounded-lg" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-[120px] w-full rounded-lg" />
          </div>
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-12 w-full rounded-full" />
        </div>

        {/* Examples skeleton */}
        <div className="mt-12 p-4 border rounded-xl">
          <Skeleton className="h-5 w-36 mb-3" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-4/5" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SuggestPage() {
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [isLoading, setIsLoading] = useState(true);
  const [form, setForm] = useState({
    feature: "",
    description: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.feature.trim()) newErrors.feature = "Please describe your idea";
    if (!form.description.trim())
      newErrors.description = "Please add some details";
    else if (form.description.trim().length < 10)
      newErrors.description = "Please add at least 10 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      setSubmitted(true);
      toast.success("Thank you for your suggestion! (demo)");
    }
  };

  const clearError = (field: string) => {
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[field];
      return newErrors;
    });
  };

  if (isLoading) {
    return <SuggestSkeleton />;
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
        <h1 className="font-semibold text-lg">Suggest a Feature</h1>
      </div>

      <div className="px-4 md:px-6 py-6 md:py-8 mt-16 max-w-3xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="h-12 w-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center">
            <Lightbulb className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Suggest a Feature</h1>
            <p className="text-sm text-muted-foreground">
              Help us improve Deeni.tube with your ideas
            </p>
          </div>
        </div>

        {!submitted ? (
          <>
            {/* Intro */}
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              We're always looking for ways to make Deeni.tube better. Whether
              it's a new feature, a scholar you'd like to see, or a language
              you'd like us to support — we want to hear from you. Every
              suggestion is read and considered by our team.
            </p>

            {/* Form */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  Your Idea *
                </label>
                <Input
                  placeholder="E.g., Add dark mode, support Urdu lectures..."
                  value={form.feature}
                  onChange={(e) => {
                    setForm((prev) => ({ ...prev, feature: e.target.value }));
                    clearError("feature");
                  }}
                  className={`h-10 ${errors.feature ? "border-red-500" : ""}`}
                />
                {errors.feature && (
                  <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> {errors.feature}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium mb-1.5 block">
                  Tell us more *
                </label>
                <Textarea
                  placeholder="Describe how this feature would work and why it would be helpful..."
                  value={form.description}
                  onChange={(e) => {
                    setForm((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }));
                    clearError("description");
                  }}
                  className={`min-h-[120px] resize-none ${
                    errors.description ? "border-red-500" : ""
                  }`}
                />
                {errors.description && (
                  <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> {errors.description}
                  </p>
                )}
              </div>

              <p className="text-xs text-muted-foreground">* Required fields</p>

              <Button
                onClick={handleSubmit}
                className="w-full rounded-full"
                size="lg"
              >
                <Send className="h-4 w-4 mr-2" /> Submit Suggestion
              </Button>
            </div>
          </>
        ) : (
          /* Thank you state */
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="h-8 w-8 text-green-500" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Suggestion Received!</h3>
            <p className="text-sm text-muted-foreground mb-6">
              JazakAllahu Khayran for helping us improve. We review every
              suggestion carefully.
            </p>
            <Button
              variant="outline"
              className="rounded-full"
              onClick={() => router.push("/more")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to More
            </Button>
          </div>
        )}

        {/* Examples section */}
        {!submitted && (
          <div className="mt-12 p-4 border rounded-xl bg-muted/10">
            <h2 className="font-semibold text-sm mb-2">
              Ideas we'd love to hear
            </h2>
            <ul className="text-xs text-muted-foreground space-y-1.5">
              <li>• New scholars or channels to add</li>
              <li>• Additional language support</li>
              <li>• Features that would help you learn better</li>
              <li>• Ways to improve the browsing experience</li>
              <li>• Any bugs or issues you've encountered</li>
            </ul>
          </div>
        )}

        {/* Back button — hidden on mobile */}
        {!submitted && (
          <div className="hidden md:block mt-8">
            <Button
              variant="outline"
              className="rounded-full"
              onClick={() => router.push("/more")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" /> Back to More
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}