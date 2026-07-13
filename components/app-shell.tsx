"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [desktopSidebarWidth, setDesktopSidebarWidth] = useState(240);

  useEffect(() => {
    const syncSidebarWidth = () => {
      if (typeof window === "undefined") return;
      const isCollapsed =
        typeof (window as any).__sidebarGetState === "function"
          ? (window as any).__sidebarGetState()
          : false;
      setDesktopSidebarWidth(isCollapsed ? 72 : 240);
    };

    syncSidebarWidth();
    window.addEventListener("sidebar-state-change", syncSidebarWidth);
    window.addEventListener("resize", syncSidebarWidth);

    return () => {
      window.removeEventListener("sidebar-state-change", syncSidebarWidth);
      window.removeEventListener("resize", syncSidebarWidth);
    };
  }, []);

  // Video and playlist detail pages use overlay sidebar — content must not shift
  const hasDesktopSidebar = !(
    pathname?.startsWith("/videos/") ||
    pathname?.startsWith("/playlists/") ||
    pathname === "/signin"
  );

  return (
    <main
      className={
        !hasDesktopSidebar
          ? "flex-1 md:pl-0 pb-[calc(56px+env(safe-area-inset-bottom,0px))] min-h-screen transition-none"
          : desktopSidebarWidth === 72
          ? "flex-1 md:pl-[72px] pb-[calc(56px+env(safe-area-inset-bottom,0px))] min-h-screen transition-all duration-300 ease-in-out"
          : "flex-1 md:pl-[240px] pb-[calc(56px+env(safe-area-inset-bottom,0px))] min-h-screen transition-all duration-300 ease-in-out"
      }
    >
      {children}
    </main>
  );
}