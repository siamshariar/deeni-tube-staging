// app/scholars/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Search, X, GraduationCap, SortAsc } from "lucide-react";
import AppHeader from "@/components/app-header";
import MobileNav from "@/components/mobile-nav";
import DesktopSidebar from "@/components/desktop-sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { mockScholars, mockLanguages } from "@/lib/mock-data";

function ScholarSkeleton() {
  return (
    <div className="flex items-center gap-3 px-4 py-3">
      <Skeleton className="h-12 w-12 md:h-14 md:w-14 rounded-full flex-shrink-0" />
      <div className="flex-1 min-w-0 space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-20" />
      </div>
    </div>
  );
}

export default function ScholarsPage() {
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(["en"]);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const toggleLanguage = (code: string) => {
    setSelectedLanguages((prev) =>
      prev.includes(code)
        ? prev.length > 1
          ? prev.filter((l) => l !== code)
          : prev
        : [...prev, code]
    );
  };

  const filteredScholars = mockScholars
    .filter((scholar) =>
      selectedLanguages.some((lang) => scholar.languages.includes(lang))
    )
    .filter(
      (scholar) =>
        !searchQuery ||
        scholar.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        scholar.designation.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) =>
      sortOrder === "asc"
        ? a.name.localeCompare(b.name)
        : b.name.localeCompare(a.name)
    );

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <div className="flex">
        <DesktopSidebar className="hidden md:block" />
        <div className="flex-1 md:pl-[240px] pt-[56px] md:pt-[80px] pb-nav-safe md:pb-6">
          {/* Mobile header */}
          <div className="md:hidden flex items-center gap-3 px-4 py-3 border-b sticky top-[56px] bg-background z-10">
            <button
              onClick={() => router.back()}
              className="flex items-center justify-center h-9 w-9 rounded-full hover:bg-muted flex-shrink-0"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="font-semibold text-lg">Scholars</h1>
          </div>

          <div className="px-4 md:px-6 py-4 md:py-6">
            {/* Page header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <div className="hidden md:block">
                <h1 className="text-2xl font-bold">Scholars</h1>
                <p className="text-sm text-muted-foreground mt-1">
                  {filteredScholars.length} scholar{filteredScholars.length !== 1 ? "s" : ""}
                </p>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <div className="relative flex-1 min-w-0">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search scholars"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-10 py-2 bg-muted/50 rounded-full text-sm outline-none focus:bg-muted transition-colors"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() =>
                    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
                  }
                  className="rounded-full flex-shrink-0 h-9 w-9 mr-4"
                  title={`Sort ${sortOrder === "asc" ? "Z-A" : "A-Z"}`}
                >
                  <SortAsc
                    className={cn(
                      "h-4 w-4 transition-transform",
                      sortOrder === "desc" && "rotate-180"
                    )}
                  />
                </Button>
              </div>
            </div>

            {/* Language filter chips */}
            <div className="flex gap-2 mb-4 overflow-x-auto pb-1 scrollbar-none">
              {mockLanguages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => toggleLanguage(lang.code)}
                  className={cn(
                    "px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
                    selectedLanguages.includes(lang.code)
                      ? "bg-foreground text-background"
                      : "bg-muted hover:bg-muted/80 text-foreground"
                  )}
                >
                  {lang.name}
                </button>
              ))}
            </div>

            {/* Scholars list */}
            {isLoading ? (
              <div className="divide-y">
                {Array.from({ length: 5 }).map((_, i) => (
                  <ScholarSkeleton key={i} />
                ))}
              </div>
            ) : filteredScholars.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <GraduationCap className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium mb-1">No scholars found</h3>
                <p className="text-muted-foreground">
                  Try different language filters or keywords
                </p>
              </div>
            ) : (
              <div className="divide-y">
                {filteredScholars.map((scholar) => (
                  <Link
                    key={scholar.id}
                    href={`/scholars/${scholar.slug}`}
                    className="flex items-center gap-3 px-2 py-3 hover:bg-muted/30 transition-colors group"
                  >
                    <Avatar className="h-12 w-12 md:h-14 md:w-14 ring-2 ring-transparent group-hover:ring-primary/20 transition-all flex-shrink-0">
                      <AvatarImage src={scholar.image || "/placeholder.svg?height=100&width=100"} />
                      <AvatarFallback>{scholar.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-sm md:text-base truncate group-hover:text-primary transition-colors">
                        {scholar.name}
                      </h3>
                      <p className="text-xs md:text-sm text-muted-foreground truncate">
                        {scholar.designation}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <MobileNav />
    </div>
  );
}