import type { Metadata, Viewport } from "next";
import "./globals.css";
import AppLayoutShell from "@/components/AppLayoutShell";

export const metadata: Metadata = {
  title: "Oasis (棲所)",
  description:
    "零壓力、抗焦慮的情緒與微習慣陪伴 — 你的文字不會離開這台裝置",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Oasis",
  },
  other: {
    "mobile-web-app-capable": "yes",
  },
};

export const viewport: Viewport = {
  themeColor: "#12161A",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-TW">
      <head>
        {/* 預載字體 */}
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@300;400;500;700&family=Inter:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <AppLayoutShell>{children}</AppLayoutShell>
      </body>
    </html>
  );
}
