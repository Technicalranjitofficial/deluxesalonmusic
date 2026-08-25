import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Deluxe Salon Music — Ambient Street-Corner Radio",
  description:
    "90s Hindi film songs, playing round the clock — the kind of tape that never stops at a neighbourhood barber shop.",
  metadataBase: new URL("https://deluxesalonmusic.com"),
  openGraph: {
    title: "Deluxe Salon Music",
    description: "Ambient street-corner radio. 90s Hindi film songs, round the clock.",
    url: "https://deluxesalonmusic.com",
    siteName: "Deluxe Salon Music",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Anek+Devanagari:wght@500;700;800&family=Familjen+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
