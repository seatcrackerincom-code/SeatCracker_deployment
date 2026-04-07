import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SeatCracker - Competitive Exam Practice Platform | Mock Tests & Performance Tracking",
  description: "SeatCracker is a smart practice platform for competitive exams like EAMCET, JEE, NEET and more. Practice topic-wise questions, take mock tests, track performance, and improve speed and accuracy.",
  keywords: "competitive exam practice, mock test platform, exam preparation app, EAMCET practice, JEE mock tests, NEET preparation, online test series, exam performance tracker",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "SeatCracker - Smart Practice for Competitive Exams",
    description: "Multi-exam mock tests, topic-wise practice, and performance tracking.",
    images: ["/logo.png"],
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a0a0f",
};

import { ThemeProvider } from "../components/ThemeProvider";
import GlobalHeader from "../components/GlobalHeader";
import CookieBanner from "../components/CookieBanner";
import GlobalFooter from "../components/GlobalFooter";
import PolicyGuard from "../components/PolicyGuard";
import PresenceTracker from "../components/PresenceTracker";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <PresenceTracker />
          <PolicyGuard />
          <GlobalHeader />
          <main style={{ paddingTop: "75px", minHeight: "100vh" }}>
            {children}
          </main>
          <CookieBanner />
          <GlobalFooter />
        </ThemeProvider>
      </body>
    </html>
  );
}
