"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Flag, Clock, CheckCircle, AlertTriangle } from "lucide-react";
import AppHeader from "@/components/app-header";
import MobileNav from "@/components/mobile-nav";
import DesktopSidebar from "@/components/desktop-sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { useMediaQuery } from "@/hooks/use-media-query";

const reports = [
  { id: "r1", title: "Inappropriate Content in Lecture Video", status: "Reviewed", date: "2 days ago", result: "Removed", type: "Inappropriate Content" },
  { id: "r2", title: "Misleading Information about Islamic Ruling", status: "Pending", date: "5 days ago", result: "Under review", type: "Misleading Information" },
  { id: "r3", title: "Copyright Issue with Background Music", status: "Reviewed", date: "1 week ago", result: "Dismissed", type: "Copyright Issue" },
  { id: "r4", title: "Spam Comments on Video", status: "Reviewed", date: "2 weeks ago", result: "Removed", type: "Spam" },
];

export default function ReportHistoryPage() {
  const router = useRouter();
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Reviewed": return <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />;
      case "Pending": return <Clock className="h-5 w-5 text-yellow-500 flex-shrink-0" />;
      default: return <AlertTriangle className="h-5 w-5 text-orange-500 flex-shrink-0" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <div className="flex">
        <DesktopSidebar className="hidden md:block" />
        <div className="flex-1 md:pl-[240px] pt-[56px] md:pt-[80px] pb-nav-safe md:pb-6">
          <div className="md:hidden flex items-center gap-3 px-4 py-3 border-b sticky top-[56px] bg-background z-10">
            <button onClick={() => router.back()} className="flex items-center justify-center h-9 w-9 rounded-full hover:bg-muted"><ArrowLeft className="h-5 w-5" /></button>
            <h1 className="font-semibold text-lg">Report History</h1>
          </div>

          <div className="max-w-[600px] mx-auto px-4 md:px-6">
            {!isMobile && (
              <div className="flex items-center gap-3 py-4 md:py-6">
                <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center"><Flag className="h-5 w-5 text-red-500" /></div>
                <div><h1 className="text-2xl font-bold">Report History</h1><p className="text-sm text-muted-foreground">Track your submitted reports</p></div>
              </div>
            )}

            {isLoading ? (
              <div className="divide-y">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="flex items-center gap-3 px-1 py-4"><Skeleton className="h-5 w-5 rounded-full" /><div className="flex-1 space-y-2"><Skeleton className="h-4 w-48" /><Skeleton className="h-3 w-32" /></div><Skeleton className="h-6 w-16 rounded-full" /></div>)}</div>
            ) : reports.length === 0 ? (
              <div className="text-center py-16"><div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4"><Flag className="h-8 w-8 text-muted-foreground" /></div><h3 className="text-lg font-medium mb-1">No reports submitted</h3><p className="text-muted-foreground text-sm">Your report history will appear here</p></div>
            ) : (
              <div className="divide-y">
                {reports.map((report) => (
                  <div key={report.id} className="flex items-center gap-3 px-1 py-4 hover:bg-muted/50 transition-colors rounded-lg">
                    {getStatusIcon(report.status)}
                    <div className="flex-1 min-w-0"><p className="text-sm font-medium truncate">{report.title}</p><p className="text-xs text-muted-foreground">{report.date} • {report.result}</p></div>
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium flex-shrink-0 ${report.status === "Reviewed" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"}`}>{report.status}</span>
                  </div>
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