// app/more/rate/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Star, Heart, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useMediaQuery } from "@/hooks/use-media-query";
import { toast } from "sonner";

function RateSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      {/* Mobile header skeleton */}
      <div className="md:hidden flex items-center gap-2 px-4 py-3 border-b sticky top-[56px] bg-background z-10">
        <Skeleton className="h-9 w-9 rounded-full" />
        <Skeleton className="h-6 w-28" />
      </div>

      <div className="px-3 md:px-6 py-6 md:py-8 mt-14 md:mt-16 max-w-3xl mx-auto">
        {/* Header skeleton */}
        <div className="text-center mb-8">
          <Skeleton className="w-16 h-16 rounded-full mx-auto mb-4" />
          <Skeleton className="h-8 w-56 mx-auto mb-2" />
          <Skeleton className="h-4 w-64 mx-auto" />
          <Skeleton className="h-4 w-48 mx-auto mt-1" />
        </div>

        {/* Stars skeleton */}
        <div className="flex justify-center gap-2 mb-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-10 rounded" />
          ))}
        </div>
        <div className="flex justify-center mb-6">
          <Skeleton className="h-4 w-28" />
        </div>

        {/* Button skeleton */}
        <div className="flex justify-center">
          <Skeleton className="h-12 w-44 rounded-full" />
        </div>

        {/* Why rate skeleton */}
        <div className="mt-12 p-4 border rounded-xl">
          <Skeleton className="h-5 w-36 mb-3" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RatePage() {
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [isLoading, setIsLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = () => {
    if (rating === 0) {
      toast.error("Please select a rating first");
      return;
    }
    setSubmitted(true);
    toast.success("Thank you for your rating! (demo)");
  };

  if (isLoading) {
    return <RateSkeleton />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile header */}
      <div className="md:hidden flex items-center gap-2 px-4 py-3 border-b sticky top-[56px] bg-background z-10">
        <button
          onClick={() => router.back()}
          className="flex items-center justify-center h-9 w-9 rounded-full hover:bg-muted flex-shrink-0 -ml-1 min-h-[44px] min-w-[44px]"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="font-semibold text-lg">Rate the App</h1>
      </div>

      <div className="px-3 md:px-6 py-6 md:py-8 mt-14 md:mt-16 max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-yellow-100 dark:bg-yellow-900/30 rounded-full flex items-center justify-center mb-4">
            <Star className="h-8 w-8 text-yellow-500 fill-yellow-500" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Enjoying Deeni.tube?</h1>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Your rating helps others discover authentic Islamic content and
            motivates us to keep improving the platform.
          </p>
        </div>

        {!submitted ? (
          <>
            {/* Star rating */}
            <div className="flex justify-center gap-2 mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoveredRating(star)}
                  onMouseLeave={() => setHoveredRating(0)}
                  className="p-1 transition-transform hover:scale-110"
                >
                  <Star
                    className={`h-10 w-10 transition-colors ${
                      star <= (hoveredRating || rating)
                        ? "text-yellow-500 fill-yellow-500"
                        : "text-muted-foreground"
                    }`}
                  />
                </button>
              ))}
            </div>
            <p className="text-center text-sm text-muted-foreground mb-6">
              {rating === 0
                ? "Tap a star to rate"
                : rating === 1
                ? "Needs improvement"
                : rating === 2
                ? "It's okay"
                : rating === 3
                ? "Good"
                : rating === 4
                ? "Great!"
                : "Excellent!"}
            </p>

            {/* Submit */}
            <div className="flex justify-center">
              <Button
                onClick={handleSubmit}
                className="rounded-full px-8"
                size="lg"
                disabled={rating === 0}
              >
                <ThumbsUp className="h-4 w-4 mr-2" /> Submit Rating
              </Button>
            </div>
          </>
        ) : (
          /* Thank you state */
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="h-8 w-8 text-green-500" />
            </div>
            <h3 className="text-lg font-semibold mb-2">JazakAllahu Khayran!</h3>
            <p className="text-sm text-muted-foreground mb-6">
              May Allah reward you for your support.
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

        {/* Why rate section */}
        <div className="mt-12 p-4 border rounded-xl bg-muted/10">
          <h2 className="font-semibold text-sm mb-2">Why your rating matters</h2>
          <ul className="text-xs text-muted-foreground space-y-1.5">
            <li>• Helps other Muslims discover authentic content</li>
            <li>• Encourages us to keep the app free and ad‑free</li>
            <li>• Supports our mission of spreading beneficial knowledge</li>
            <li>• Takes less than 10 seconds</li>
          </ul>
        </div>

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