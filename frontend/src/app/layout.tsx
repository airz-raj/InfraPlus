import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { I18nProvider } from "@/components/providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "InfraPulse — Citizen Portal",
  description:
    "Report public infrastructure issues by voice or text for BRICS digital public infrastructure planning.",
  applicationName: "InfraPulse",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    title: "InfraPulse",
    statusBarStyle: "default",
  },
};

export const viewport: Viewport = {
  themeColor: "#4f46e5",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  );
}
