// app/layout.tsx
import type React from "react";
import "@/app/globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import AppHeader from "@/components/app-header";
import DesktopSidebar from "@/components/desktop-sidebar";
import MobileNav from "@/components/mobile-nav";
import { HeaderProvider } from "@/app/contexts/header-context";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Deeni.tube - Authentic Islamic Videos",
  description:
    "Watch authentic Islamic videos from trusted scholars. Browse channels, scholars, and categories for the best Islamic content.",
  generator: "v0.app",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="overflow-y-scroll">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <HeaderProvider>
            <AppHeader />
            <DesktopSidebar />
            <main className="flex-1 md:pl-[240px] pb-[calc(56px+env(safe-area-inset-bottom,0px))] min-h-screen">
              {children}
            </main>
            <MobileNav />
          </HeaderProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}