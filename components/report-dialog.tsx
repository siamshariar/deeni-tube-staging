"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const REPORT_REASONS = [
  "Violent or repulsive content",
  "Hateful or abusive content",
  "Harmful or dangerous acts",
  "Spam or misleading",
  "Child abuse",
];

interface ReportDialogProps {
  videoTitle: string;
  videoId: string;
  children: React.ReactNode;
}

export function ReportDialog({ videoTitle, videoId, children }: ReportDialogProps) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  const handleSubmit = () => {
    if (!selected) return;

    // Save report to history (localStorage)
    const reports = JSON.parse(localStorage.getItem("reportHistory") || "[]");
    const newReport = {
      id: `r${Date.now()}`,
      title: videoTitle,
      status: "Pending",
      date: "Just now",
      result: "Under review",
      type: selected,
    };
    reports.unshift(newReport);
    localStorage.setItem("reportHistory", JSON.stringify(reports));

    toast.success("Report submitted", {
      description: `"${videoTitle}" reported for "${selected}"`,
    });

    setSelected(null);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Report video</DialogTitle>
        </DialogHeader>
        <div className="space-y-2 py-2">
          {REPORT_REASONS.map((reason) => (
            <button
              key={reason}
              onClick={() => setSelected(reason)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-colors text-left",
                selected === reason
                  ? "border-primary bg-primary/5"
                  : "border-border hover:bg-muted"
              )}
            >
              <span
                className={cn(
                  "h-5 w-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all",
                  selected === reason
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-muted-foreground/30"
                )}
              >
                {selected === reason && (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path
                      d="M2 6l3 3 5-5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </span>
              <span className="text-sm">{reason}</span>
            </button>
          ))}
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={!selected}>
            Report
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}