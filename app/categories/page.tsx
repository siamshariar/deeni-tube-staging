// app/categories/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Search, X, FolderOpen } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { videoData, categoryData } from "@/lib/video-data";
import { SortDropdown, SortOption } from "@/components/sort-dropdown";

function CategorySkeleton() {
  return (
    <div className="p-5 border rounded-xl space-y-3">
      <div className="flex items-start gap-3">
        <Skeleton className="h-9 w-9 rounded-full flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
      <Skeleton className="h-3 w-20" />
    </div>
  );
}

const sortOptions: SortOption[] = [
  { label: "Default", value: "default" },
  { label: "Name (A-Z)", value: "name-asc" },
  { label: "Name (Z-A)", value: "name-desc" },
  { label: "Most Videos", value: "most-videos" },
];

const languageOptions = [
  { code: "bn", name: "Bangla" },
  { code: "en", name: "English" },
  { code: "ar", name: "Arabic" },
  { code: "ur", name: "Urdu" },
];

export default function CategoriesPage() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>(["bn"]);
  const [sortValue, setSortValue] = useState("default");

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

  // Filter categories that have videos in selected languages
  const availableCategories = categoryData.filter((cat) =>
    cat.languages.some((lang) => selectedLanguages.includes(lang))
  );

  const sortCategories = (
    categories: typeof categoryData
  ) => {
    switch (sortValue) {
      case "name-asc":
        return [...categories].sort((a, b) => a.name.localeCompare(b.name));
      case "name-desc":
        return [...categories].sort((a, b) => b.name.localeCompare(a.name));
      case "most-videos":
        return [...categories].sort((a, b) => b.videoCount - a.videoCount);
      default:
        return categories;
    }
  };

  const filteredCategories = sortCategories(availableCategories).filter(
    (cat) =>
      !searchQuery ||
      cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <div className="px-4 md:px-6 py-2 md:py-6 mt-16">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div className="">
            <h1 className="text-2xl font-bold">Categories</h1>
            {/* <p className="text-sm text-muted-foreground mt-1">
              {filteredCategories.length} categor{filteredCategories.length !== 1 ? "ies" : "y"}
            </p> */}
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 min-w-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search categories"
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

        {/* Language filter chips */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-1 scrollbar-none">
          {languageOptions.map((lang) => (
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

        {/* Category grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <CategorySkeleton key={i} />
            ))}
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <FolderOpen className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-1">No categories found</h3>
            <p className="text-muted-foreground">
              Try different language or keywords
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCategories.map((category) => (
              <Link
                key={category.slug}
                href={`/categories/${category.slug}`}
                className="p-5 border rounded-xl hover:bg-muted/30 hover:border-primary/30 transition-all group cursor-pointer flex flex-col h-full"
              >
                <div className="flex items-start gap-3 flex-1">
                  <div className="flex-shrink-0 w-10 h-10 bg-muted rounded-full flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    <FolderOpen className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-base group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {category.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3 pt-3 border-t">
                  <p className="text-xs text-muted-foreground font-medium">
                    {category.videoCount} video{category.videoCount !== 1 ? "s" : ""}
                  </p>
                  <div className="flex gap-1">
                    {category.languages.slice(0, 3).map((lang) => (
                      <span
                        key={lang}
                        className="text-[10px] uppercase bg-muted px-1.5 py-0.5 rounded font-medium text-muted-foreground"
                      >
                        {lang}
                      </span>
                    ))}
                    {category.languages.length > 3 && (
                      <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded font-medium text-muted-foreground">
                        +{category.languages.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}