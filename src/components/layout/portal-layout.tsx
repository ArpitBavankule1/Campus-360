"use client";

import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import { EmergencyBroadcastBanner } from "@/components/realtime/emergency-broadcast-banner";

interface PortalLayoutProps {
  children: React.ReactNode;
}

export function PortalLayout({ children }: PortalLayoutProps) {
  return (
    <div className="flex min-h-screen bg-muted/20">
      {/* Desktop Fixed/Sticky Sidebar */}
      <div className="hidden md:flex md:w-64 lg:w-72 md:flex-col fixed inset-y-0 z-40">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 md:pl-64 lg:pl-72 min-h-screen">
        <Header />
        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto animate-in fade-in-50 duration-200">
          <EmergencyBroadcastBanner />
          {children}
        </main>
      </div>
    </div>
  );
}
