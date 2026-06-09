"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Flag, Clock, CheckCircle, XCircle } from "lucide-react"
import AppHeader from "@/components/app-header"
import MobileNav from "@/components/mobile-nav"
import DesktopSidebar from "@/components/desktop-sidebar"

const reports = [
  { id: "r1", title: "Inappropriate Content", status: "Reviewed", date: "2 days ago", result: "Removed" },
  { id: "r2", title: "Misleading Information", status: "Pending", date: "5 days ago", result: "Under review" },
  { id: "r3", title: "Copyright Issue", status: "Reviewed", date: "1 week ago", result: "Dismissed" },
]

export default function ReportHistoryPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      <div className="flex">
        <DesktopSidebar className="hidden md:block" />
        <div className="flex-1 md:pl-[240px] pt-[56px] md:pt-[80px] pb-nav-safe md:pb-6">
          <div className="md:hidden flex items-center gap-3 px-4 py-2 border-b">
            <button onClick={() => router.back()} className="flex items-center justify-center h-9 w-9 rounded-full hover:bg-muted transition-colors">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="font-semibold text-lg">Report History</h1>
          </div>
          <div className="max-w-lg mx-auto">
            <div className="flex items-center gap-2 px-4 py-4">
              <Flag className="h-5 w-5" />
              <h1 className="text-2xl font-bold hidden md:block">Report History</h1>
            </div>
            <div className="divide-y">
              {reports.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground text-sm">No reports submitted</div>
              ) : (
                reports.map((report) => (
                  <div key={report.id} className="px-4 py-4 hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      {report.status === "Reviewed" ? (
                        <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                      ) : (
                        <Clock className="h-5 w-5 text-yellow-500 flex-shrink-0" />
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium">{report.title}</p>
                        <p className="text-xs text-muted-foreground">{report.date} • {report.result}</p>
                      </div>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${report.status === "Reviewed" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                        {report.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
      <MobileNav />
    </div>
  )
}