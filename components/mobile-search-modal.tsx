"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Search, X, ArrowLeft, History, Check, ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { videoData } from "@/lib/video-data";
import { channelData, ChannelItem } from "@/lib/channel-data";
import { scholarData } from "@/lib/scholar-data";

// ── Static options ────────────────────────────────────────────────────────────

const LANGUAGES = [
  { code: "bn", name: "Bangla" },
  { code: "en", name: "English" },
  { code: "ar", name: "Arabic" },
  { code: "ur", name: "Urdu" },
  { code: "hi", name: "Hindi" },
  { code: "tr", name: "Turkish" },
];

const categoryOptions = Array.from(new Set(videoData.map(v => v.category).filter(Boolean)));
const scholarOptions  = scholarData.map(s => s.name);
const channelOptions  = channelData.map((c: ChannelItem) => c.name);

// ── localStorage ──────────────────────────────────────────────────────────────

function loadRecent(): string[] {
  try {
    const raw = localStorage.getItem("recentSearches");
    if (!raw) return [];
    const arr = JSON.parse(raw);
    return Array.isArray(arr) ? arr.filter((s): s is string => typeof s === "string") : [];
  } catch { return []; }
}

function saveRecent(list: string[]) {
  try { localStorage.setItem("recentSearches", JSON.stringify(list)); } catch {}
}

// ── Searchable multi-select dropdown ─────────────────────────────────────────
// Closes immediately after each item tap so user moves on to the Search button

function MultiSelect({
  label, options, selected, onChange, searchable = false,
}: {
  label: string; options: string[]; selected: string[];
  onChange: (v: string[]) => void; searchable?: boolean;
}) {
  const [open, setOpen]       = useState(false);
  const [text, setText]       = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false); setText("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const toggle = (v: string) => {
    onChange(selected.includes(v) ? selected.filter(s => s !== v) : [...selected, v]);
    setOpen(false); setText(""); // auto-close
  };

  const remove = (v: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(selected.filter(s => s !== v));
  };

  const filtered = text
    ? options.filter(o => o.toLowerCase().includes(text.toLowerCase()))
    : options;

  return (
    <div ref={ref} className="relative">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">{label}</p>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className={cn(
          "w-full min-h-[42px] px-3 py-2 flex items-center gap-2 flex-wrap rounded-xl border text-left transition-colors bg-background",
          open ? "border-primary ring-2 ring-primary/20" : "border-border"
        )}
      >
        <div className="flex flex-wrap gap-1.5 flex-1 min-w-0">
          {selected.length === 0 ? (
            <span className="text-sm text-muted-foreground">Any {label.toLowerCase()}…</span>
          ) : selected.map(val => (
            <span key={val} className="flex items-center gap-1 bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full font-medium">
              {val}
              <span
                role="button" tabIndex={0}
                onClick={e => remove(val, e as unknown as React.MouseEvent)}
                className="cursor-pointer hover:opacity-70"
              >
                <X className="h-3 w-3" />
              </span>
            </span>
          ))}
        </div>
        <ChevronDown className={cn("h-4 w-4 text-muted-foreground flex-shrink-0 transition-transform duration-200", open && "rotate-180")} />
      </button>

      {open && (
        <div className="absolute z-[70] mt-1 w-full bg-popover border rounded-xl shadow-xl overflow-hidden">
          {searchable && (
            <div className="p-2 border-b">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <input
                  autoFocus type="text" value={text}
                  onChange={e => setText(e.target.value)}
                  onClick={e => e.stopPropagation()}
                  placeholder={`Search ${label.toLowerCase()}…`}
                  className="w-full h-8 pl-8 pr-2 text-sm rounded-lg border bg-muted/40 focus:outline-none"
                />
              </div>
            </div>
          )}
          <div className="max-h-52 overflow-y-auto">
            {filtered.length === 0
              ? <p className="px-4 py-3 text-sm text-muted-foreground text-center">No results</p>
              : filtered.map(opt => {
                  const sel = selected.includes(opt);
                  return (
                    <button key={opt} type="button" onClick={() => toggle(opt)}
                      className={cn("w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left hover:bg-muted transition-colors", sel && "bg-muted/50 font-medium")}
                    >
                      <span className={cn("h-4 w-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors", sel ? "bg-primary border-primary" : "border-muted-foreground/30")}>
                        {sel && <Check className="h-3 w-3 text-primary-foreground" />}
                      </span>
                      {opt}
                    </button>
                  );
                })}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Global mobile search modal ────────────────────────────────────────────────
// Always mounted in the layout. Opens via: window.dispatchEvent(new CustomEvent("open-search-modal"))
// After Search is pressed: navigates to /search?q=...&filters...

export default function MobileSearchModal() {
  const router = useRouter();

  const [isOpen, setIsOpen]                     = useState(false);
  const [query, setQuery]                       = useState("");
  const [activeLangs, setActiveLangs]           = useState<string[]>(["bn"]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedScholars, setSelectedScholars] = useState<string[]>([]);
  const [selectedChannels, setSelectedChannels] = useState<string[]>([]);
  const [recentList, setRecentList]             = useState<string[]>([]);

  const inputRef = useRef<HTMLInputElement>(null);

  // Listen for the open event dispatched by the header search icon
  useEffect(() => {
    const handleOpen = () => {
      // Pre-populate query from URL when reopening on /search page
      const params = new URLSearchParams(window.location.search);
      const urlQ   = params.get("q") || "";
      if (urlQ) setQuery(urlQ);

      setRecentList(loadRecent());
      setIsOpen(true);
      setTimeout(() => inputRef.current?.focus(), 80);
    };

    window.addEventListener("open-search-modal", handleOpen);
    return () => window.removeEventListener("open-search-modal", handleOpen);
  }, []);

  const close = () => setIsOpen(false);

  const hasActiveFilters = selectedCategories.length > 0 || selectedScholars.length > 0 || selectedChannels.length > 0;

  const resetFilters = () => {
    setActiveLangs(["bn"]);
    setSelectedCategories([]);
    setSelectedScholars([]);
    setSelectedChannels([]);
  };

  const toggleLang = (code: string) =>
    setActiveLangs(prev =>
      prev.includes(code)
        ? prev.length > 1 ? prev.filter(l => l !== code) : prev
        : [...prev, code]
    );

  const addToRecent = (term: string) => {
    if (!term) return;
    setRecentList(prev => {
      const updated = [term, ...prev.filter(s => s !== term)].slice(0, 8);
      saveRecent(updated);
      return updated;
    });
  };

  const removeFromRecent = (s: string) =>
    setRecentList(prev => { const u = prev.filter(x => x !== s); saveRecent(u); return u; });

  const handleSearch = () => {
    const term = query.trim();
    if (!term && !hasActiveFilters) return;

    if (term) addToRecent(term);

    // Build URL with all active filters so /search page can apply them on mount
    const params = new URLSearchParams();
    if (term) params.set("q", term);
    // Only include lang if it differs from the default single "bn"
    if (!(activeLangs.length === 1 && activeLangs[0] === "bn"))
      params.set("lang", activeLangs.join(","));
    if (selectedCategories.length > 0) params.set("cat", selectedCategories.join(","));
    if (selectedScholars.length > 0)   params.set("scholar", selectedScholars.join(","));
    if (selectedChannels.length > 0)   params.set("ch", selectedChannels.join(","));

    router.push(`/search?${params.toString()}`);
    close();
  };

  const handleRecentTap = (s: string) => {
    setQuery(s);
    addToRecent(s);
    // Navigate immediately on recent tap (no extra filters assumed)
    const params = new URLSearchParams();
    params.set("q", s);
    if (!(activeLangs.length === 1 && activeLangs[0] === "bn"))
      params.set("lang", activeLangs.join(","));
    router.push(`/search?${params.toString()}`);
    close();
  };

  if (!isOpen) return null;

  return (
    <div className="md:hidden fixed inset-0 z-[60] bg-background flex flex-col">

      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 px-4 h-14 border-b flex-shrink-0">
        <button
          onClick={close}
          className="h-9 w-9 rounded-full flex items-center justify-center hover:bg-muted transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <span className="font-semibold flex-1">Search</span>
        {(hasActiveFilters || activeLangs.length > 1) && (
          <button onClick={resetFilters} className="text-sm text-primary hover:underline">
            Clear filters
          </button>
        )}
      </div>

      {/* ── Search input ────────────────────────────────────────────── */}
      <div className="px-4 pt-3 pb-2 flex-shrink-0">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && (query.trim() || hasActiveFilters)) handleSearch(); }}
            placeholder="Search videos, scholars, channels…"
            className="w-full h-11 pl-10 pr-10 rounded-full bg-muted/60 text-sm focus:outline-none focus:bg-muted transition-colors"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* ── Scrollable filter body ───────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto min-h-0">

        {/* Recent searches — only when query is empty */}
        {!query && recentList.length > 0 && (
          <div className="border-b">
            <div className="flex items-center justify-between px-4 py-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Recent</span>
              <button
                onClick={() => { setRecentList([]); saveRecent([]); }}
                className="text-xs text-primary hover:underline"
              >
                Clear all
              </button>
            </div>
            {recentList.map(s => (
              <button
                key={s}
                onClick={() => handleRecentTap(s)}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-muted transition-colors text-left"
              >
                <History className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <span className="flex-1 text-sm truncate">{s}</span>
                <button
                  onClick={e => { e.stopPropagation(); removeFromRecent(s); }}
                  className="p-1 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </button>
            ))}
          </div>
        )}

        {/* ── Filter sections ────────────────────────────────────────── */}
        <div className="px-4 py-5 space-y-6">

          {/* Language */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2.5">Language</p>
            <div className="flex flex-wrap gap-2">
              {LANGUAGES.map(lang => (
                <button
                  key={lang.code}
                  onClick={() => toggleLang(lang.code)}
                  className={cn(
                    "px-3.5 py-1.5 rounded-full text-sm font-medium border transition-colors",
                    activeLangs.includes(lang.code)
                      ? "bg-foreground text-background border-foreground"
                      : "bg-background text-foreground border-border hover:bg-muted"
                  )}
                >
                  {lang.name}
                </button>
              ))}
            </div>
          </div>

          {/* Category — same dropdown style as Scholars & Channels */}
          <MultiSelect
            label="Category"
            options={categoryOptions}
            selected={selectedCategories}
            onChange={setSelectedCategories}
            searchable
          />

          {/* Scholars */}
          <MultiSelect
            label="Scholars"
            options={scholarOptions}
            selected={selectedScholars}
            onChange={setSelectedScholars}
            searchable
          />

          {/* Channels */}
          <MultiSelect
            label="Channels"
            options={channelOptions}
            selected={selectedChannels}
            onChange={setSelectedChannels}
            searchable
          />
        </div>
      </div>

      {/* ── Sticky Search button ─────────────────────────────────────── */}
      <div
        className="px-4 py-2 border-t flex-shrink-0"
        style={{ paddingBottom: "calc(0.5rem + env(safe-area-inset-bottom, 0px))" }}
      >
        <Button
          onClick={handleSearch}
          disabled={!query.trim() && !hasActiveFilters}
          className="w-full rounded-full h-10 font-semibold"
        >
          <Search className="h-4 w-4 mr-2" />
          Search
        </Button>
      </div>
    </div>
  );
}
