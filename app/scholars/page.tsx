// app/scholars/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Search, X, GraduationCap } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { scholarData, ScholarItem } from "@/lib/scholar-data";
import { SortDropdown, SortOption } from "@/components/sort-dropdown";

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

const sortOptions: SortOption[] = [
  { label: "Default", value: "default" },
  { label: "Name (A-Z)", value: "name-asc" },
  { label: "Name (Z-A)", value: "name-desc" },
];

export default function ScholarsPage() {
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [sortValue, setSortValue] = useState("default");

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const sortScholars = (scholars: ScholarItem[]) => {
    switch (sortValue) {
      case "name-asc":
        return [...scholars].sort((a, b) => a.name.localeCompare(b.name));
      case "name-desc":
        return [...scholars].sort((a, b) => b.name.localeCompare(a.name));
      default:
        return scholars;
    }
  };

  const filteredScholars: ScholarItem[] = sortScholars(
    scholarData.filter(
      (scholar: ScholarItem) =>
        !searchQuery ||
        scholar.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        scholar.designation.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile back button (sticky below global header) */}
      <div className="md:hidden flex items-center gap-3 px-4 py-3 border-b sticky top-[56px] bg-background z-10">
        <button
          onClick={() => router.back()}
          className="flex items-center justify-center h-9 w-9 rounded-full hover:bg-muted flex-shrink-0"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="font-semibold text-lg">Scholars</h1>
      </div>

      {/* Content area – same spacing as Channels page */}
      <div className="px-4 md:px-6 py-4 md:py-6">
        {/* Title + search – mt-12 provides top clearance after sticky back button */}
        <div className="flex flex-col mt-16 sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
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

            <SortDropdown
              options={sortOptions}
              currentValue={sortValue}
              onSelect={setSortValue}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="divide-y">
            {Array.from({ length: 2 }).map((_, i) => (
              <ScholarSkeleton key={i} />
            ))}
          </div>
        ) : filteredScholars.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <GraduationCap className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-1">No scholars found</h3>
            <p className="text-muted-foreground">Try different keywords</p>
          </div>
        ) : (
          <div className="divide-y">
            {filteredScholars.map((scholar: ScholarItem) => (
              <Link
                key={scholar.id}
                href={`/scholars/${scholar.slug}`}
                className="flex items-center gap-3 px-2 py-3 hover:bg-muted/30 transition-colors group"
              >
                <Avatar className="h-12 w-12 md:h-14 md:w-14 ring-2 ring-transparent group-hover:ring-primary/20 transition-all flex-shrink-0">
                  <AvatarImage src={scholar.avatar} />
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
  );
}