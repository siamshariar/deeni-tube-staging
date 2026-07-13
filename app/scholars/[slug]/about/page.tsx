// app/scholars/[slug]/about/page.tsx
"use client";

import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ExternalLink, GraduationCap, Globe, Video } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { scholarData } from "@/lib/scholar-data";
import { videoData } from "@/lib/video-data";

const languageNames: Record<string, string> = {
  bn: "Bangla",
  en: "English",
  ar: "Arabic",
  ur: "Urdu",
  hi: "Hindi",
  tr: "Turkish",
};

export default function ScholarAboutPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;

  const scholar = scholarData.find((s) => s.slug === slug);

  if (!scholar) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Scholar not found</h2>
          <Button onClick={() => router.push("/scholars")} className="rounded-full mt-4">
            Back to Scholars
          </Button>
        </div>
      </div>
    );
  }

  const allVideos = videoData.filter((v) => v.channelId === scholar.channelId);
  const categories = Array.from(new Set(allVideos.map((v) => v.category))).filter(Boolean);

  return (
    <div className="min-h-screen bg-background pt-14">
      {/* Back button — mobile only */}
      <div className="md:hidden sticky top-[56px] z-10 bg-background/95 backdrop-blur-sm border-b">
        <button onClick={() => router.back()} className="flex items-center gap-1.5 px-4 py-2 w-full">
          <ArrowLeft className="h-6 w-6 shrink-0" />
          <span className="text-sm font-medium">About {scholar.name}</span>
        </button>
      </div>

      <div className="max-w-3xl mx-auto px-4 pb-12 pt-6">
        {/* Avatar + name — no banner, clean top spacing */}
        <div className="flex items-center gap-4 mb-6">
          <Avatar className="h-20 w-20 md:h-24 md:w-24 ring-4 ring-background flex-shrink-0">
            <AvatarImage src={scholar.avatar} alt={scholar.name} className="object-cover" />
            <AvatarFallback className="text-2xl">{scholar.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-xl md:text-2xl font-bold leading-tight">{scholar.name}</h1>
            <p className="text-sm text-muted-foreground mt-1">{scholar.designation}</p>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-3 mb-8 p-4 bg-muted/40 rounded-2xl">
          <div className="text-center">
            <p className="text-2xl font-bold">{allVideos.length}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Videos</p>
          </div>
          <div className="text-center border-x border-border">
            <p className="text-2xl font-bold capitalize">{languageNames[scholar.language] || scholar.language}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Primary language</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold">{categories.length}</p>
            <p className="text-xs text-muted-foreground mt-0.5">Topics</p>
          </div>
        </div>

        {/* About section */}
        <section className="mb-8">
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-primary" />
            About
          </h2>
          <p className="text-sm leading-relaxed text-foreground/80 whitespace-pre-wrap">
            {scholar.description || `${scholar.name} is a distinguished Islamic scholar known for ${scholar.designation}.`}
          </p>
        </section>

        {/* Topics covered */}
        {categories.length > 0 && (
          <section className="mb-8">
            <h2 className="text-lg font-semibold mb-3">Topics Covered</h2>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <Link
                  key={cat}
                  href={`/categories/${cat.toLowerCase().replace(/\s+/g, "-")}`}
                  className="px-3 py-1.5 rounded-full bg-muted hover:bg-muted/80 text-sm transition-colors"
                >
                  {cat}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Recent videos preview */}
        {allVideos.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <Video className="h-5 w-5 text-primary" />
                Recent Videos
              </h2>
              <Link href={`/scholars/${slug}`} className="text-sm text-primary hover:underline flex items-center gap-1">
                See all <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="space-y-3">
              {allVideos.slice(0, 3).map((video) => (
                <Link key={video.id} href={`/videos/${video.channel}/${video.videoId}`} className="flex gap-3 group">
                  <div className="relative w-32 aspect-video flex-shrink-0 rounded-lg overflow-hidden bg-muted">
                    <img
                      src={`https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute bottom-1 right-1 bg-black/80 text-white text-[10px] px-1 py-0.5 rounded">{video.duration}</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors">{video.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{video.views} · {video.timeAgo}</p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Back to profile */}
        <Button variant="outline" className="rounded-full w-full" onClick={() => router.push(`/scholars/${slug}`)}>
          View Full Profile
        </Button>
      </div>

      {/* JSON-LD structured data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: scholar.name,
            jobTitle: scholar.designation,
            image: scholar.avatar,
            description: scholar.description,
            knowsAbout: categories,
            inLanguage: scholar.language,
          }),
        }}
      />
    </div>
  );
}
