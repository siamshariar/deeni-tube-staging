// components/ui/autocomplete-multi.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import { Search, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface AutocompleteMultiProps {
  label: string;
  options: string[];
  selected: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
}

export function AutocompleteMulti({
  label,
  options,
  selected,
  onChange,
  placeholder,
}: AutocompleteMultiProps) {
  const [open, setOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
        setSearchText("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = searchText
    ? options.filter(opt =>
        opt.toLowerCase().includes(searchText.toLowerCase())
      )
    : options;

  const addItem = (value: string) => {
    if (!selected.includes(value)) {
      onChange([...selected, value]);
    }
    setSearchText("");
    setOpen(false);
  };

  const removeItem = (value: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(selected.filter(v => v !== value));
  };

  return (
    <div ref={ref} className="relative">
      <label className="text-sm font-medium mb-1.5 block text-foreground">
        {label}
      </label>
      <div
        className={cn(
          "w-full min-h-10 px-3 py-2 flex items-center gap-2 flex-wrap rounded-xl border transition-colors bg-background cursor-text",
          open ? "border-primary ring-2 ring-primary/20" : "border-border hover:border-muted-foreground"
        )}
        onClick={() => setOpen(true)}
      >
        {selected.map(val => (
          <span
            key={val}
            className="flex items-center gap-1 bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full font-medium"
          >
            {val}
            <span
              role="button"
              tabIndex={0}
              onClick={e => removeItem(val, e)}
              className="cursor-pointer hover:opacity-70"
            >
              <X className="h-3 w-3" />
            </span>
          </span>
        ))}
        <input
          type="text"
          value={searchText}
          onChange={e => setSearchText(e.target.value)}
          onFocus={() => setOpen(true)}
          placeholder={selected.length === 0 ? placeholder || `Search ${label.toLowerCase()}...` : ""}
          className="flex-1 min-w-[80px] bg-transparent outline-none text-sm placeholder:text-muted-foreground"
        />
        <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0 ml-auto" />
      </div>

      {open && (
        <div className="absolute z-50 mt-1 w-full bg-popover border rounded-xl shadow-lg overflow-hidden">
          <div className="max-h-48 overflow-y-auto">
            {filteredOptions.length === 0 ? (
              <div className="px-4 py-3 text-sm text-muted-foreground text-center">
                No {label.toLowerCase()} found
              </div>
            ) : (
              filteredOptions.map(option => (
                <button
                  key={option}
                  type="button"
                  onClick={() => addItem(option)}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-colors hover:bg-muted"
                >
                  {option}
                </button>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}