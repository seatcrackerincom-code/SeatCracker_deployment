import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SeatCracker — Crack Your Entrance Exam",
  description: "Your personalised EAMCET/EAPCET syllabus companion. Track chapters, prioritise topics, and crack your seat.",
  keywords: "EAMCET, EAPCET, AP, TS, engineering, agriculture, pharmacy, syllabus, entrance exam",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "SeatCracker",
    description: "Your seat is waiting. Start now.",
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
          {children}
          <CookieBanner />
          <GlobalFooter />
        </ThemeProvider>
      </body>
    </html>
  );
}
