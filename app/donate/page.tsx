// app/donate/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Heart,
  Coffee,
  Calendar,
  CreditCard,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const supportOptions = [
  {
    id: "monthly-small",
    title: "Monthly Supporter",
    amount: "$5 / month",
    description: "Support us with a small monthly contribution",
    icon: Calendar,
  },
  {
    id: "monthly-medium",
    title: "Monthly Partner",
    amount: "$10 / month",
    description: "Help us grow and reach more people",
    icon: Calendar,
  },
  {
    id: "one-time-small",
    title: "One‑Time Coffee",
    amount: "$5",
    description: "Buy us a coffee and support our work",
    icon: Coffee,
  },
  {
    id: "one-time-medium",
    title: "One‑Time Supporter",
    amount: "$25",
    description: "Make a one‑time contribution to the platform",
    icon: Heart,
  },
];

// ── Skeleton Component ──
function DonateSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      {/* Mobile back button skeleton */}
      <div className="md:hidden flex items-center gap-2 px-4 py-3 border-b sticky top-[56px] bg-background z-10">
        <Skeleton className="h-9 w-9 rounded-full" />
        <Skeleton className="h-6 w-20" />
      </div>

      <div className="px-4 md:px-6 py-4 md:py-8 mt-14 md:mt-16 max-w-2xl mx-auto">
        {/* Header skeleton */}
        <div className="text-center mb-8">
          <Skeleton className="w-16 h-16 rounded-full mx-auto mb-4" />
          <Skeleton className="h-8 w-48 mx-auto mb-2" />
          <Skeleton className="h-4 w-64 mx-auto" />
          <Skeleton className="h-4 w-48 mx-auto mt-1" />
        </div>

        {/* Why donate skeleton */}
        <div className="mb-8 p-4 border rounded-xl bg-muted/10">
          <Skeleton className="h-6 w-28 mb-3" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>

        {/* Support options skeleton */}
        <div className="mb-6">
          <Skeleton className="h-6 w-40 mb-3" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-start gap-3 p-4 border rounded-xl">
                <Skeleton className="w-10 h-10 rounded-full flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment method skeleton */}
        <div className="mb-6 p-4 border rounded-xl">
          <div className="flex items-center gap-2 mb-3">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-28" />
          </div>
          <div className="flex items-center gap-3 p-3 border rounded-lg bg-muted/20">
            <Skeleton className="w-8 h-5 rounded" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>

        {/* Button skeleton */}
        <Skeleton className="w-full h-12 rounded-full" />
      </div>
    </div>
  );
}

export default function DonatePage() {
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading delay
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const handleDonate = () => {
    if (!selectedOption) {
      toast.error("Please select a support option first");
      return;
    }
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      setSelectedOption(null);
      toast.success("Thank you for your support! (demo)");
    }, 2000);
  };

  // ── Loading state ──
  if (isLoading) {
    return <DonateSkeleton />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile back button */}
      <div className="md:hidden flex items-center gap-2 px-4 py-3 border-b sticky top-[56px] bg-background z-10">
        <button
          onClick={() => router.back()}
          className="flex items-center justify-center h-9 w-9 rounded-full hover:bg-muted flex-shrink-0 -ml-1 min-h-[44px] min-w-[44px]"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="font-semibold text-lg">Donate</h1>
      </div>

      <div className="px-4 md:px-6 py-4 md:py-8 mt-14 md:mt-16 max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Support Deeni.tube</h1>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Your support helps us continue providing authentic Islamic content
            from trusted scholars. Every contribution makes a difference.
          </p>
        </div>

        {/* Why donate */}
        <div className="mb-8 p-4 border rounded-xl bg-muted/10">
          <h2 className="font-semibold text-base mb-2">Why donate?</h2>
          <ul className="text-sm text-muted-foreground space-y-1.5">
            <li>• Keep the platform free and accessible for everyone</li>
            <li>• Support authentic Islamic content creation</li>
            <li>• Help us maintain and improve the app</li>
            <li>• Earn rewards for ongoing charity (Sadaqah Jariyah)</li>
          </ul>
        </div>

        {/* Support options */}
        <div className="mb-6">
          <h2 className="font-semibold text-base mb-3">Choose your support</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {supportOptions.map((option) => {
              const isSelected = selectedOption === option.id;
              return (
                <button
                  key={option.id}
                  onClick={() => setSelectedOption(option.id)}
                  className={cn(
                    "flex items-start gap-3 p-4 border rounded-xl text-left transition-all",
                    isSelected
                      ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                      : "border-border hover:bg-muted/50"
                  )}
                >
                  <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center flex-shrink-0">
                    <option.icon className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{option.title}</p>
                    <p className="text-sm text-primary font-semibold mt-0.5">
                      {option.amount}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {option.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Payment method (dummy) */}
        <div className="mb-6 p-4 border rounded-xl">
          <div className="flex items-center gap-2 mb-3">
            <CreditCard className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Payment method</span>
          </div>
          <div className="flex items-center gap-3 p-3 border rounded-lg bg-muted/20">
            <div className="w-8 h-5 bg-blue-600 rounded" />
            <span className="text-sm">Visa ending in 4242</span>
          </div>
        </div>

        {/* Donate button */}
        {!showSuccess ? (
          <Button
            onClick={handleDonate}
            className="w-full h-12 rounded-full text-base font-semibold"
            disabled={!selectedOption}
          >
            <Heart className="h-5 w-5 mr-2" /> Donate Now
          </Button>
        ) : (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="h-8 w-8 text-green-500" />
            </div>
            <h3 className="text-lg font-semibold mb-1">Thank You!</h3>
            <p className="text-sm text-muted-foreground">
              Your support means the world to us.
            </p>
          </div>
        )}

        {/* Footer note */}
        {/* <p className="text-xs text-center text-muted-foreground mt-6">
          This is a demo donation page. No actual payment will be processed.
        </p> */}
      </div>
    </div>
  );
}