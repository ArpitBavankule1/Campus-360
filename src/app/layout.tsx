import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "CampusLens AI — Smart College Connect & Campus Assistant",
    template: "%s | CampusLens AI",
  },
  description:
    "One smart platform connecting students, faculty and college administration with everything you need for a better campus experience.",
  keywords: [
    "campus",
    "college",
    "student portal",
    "AI assistant",
    "timetable",
    "campus explorer",
  ],
};

import { AuthProvider } from "@/components/layout/auth-provider";
import { RealtimeProvider } from "@/lib/realtime/realtime-provider";
import { RealtimeToastContainer } from "@/components/realtime/realtime-toast";

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <RealtimeProvider>
            {children}
            <RealtimeToastContainer />
          </RealtimeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
