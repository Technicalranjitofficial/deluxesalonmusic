import type { Metadata, Viewport } from "next";
import "./globals.css";

const BASE_URL = "https://deluxesalonmusic.com";

export const viewport: Viewport = {
  themeColor: "#08131a",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),

  /* ── Primary ──────────────────────────────────────────────────────── */
  title: {
    default: "Deluxe Salon Music — Free 90s Hindi Retro Saloon Radio Online",
    template: "%s | Deluxe Salon Music",
  },
  description:
    "Deluxe Salon Music is a free ambient 90s and 2000s Hindi film songs radio — the kind of tape that never stops at a neighbourhood Indian barber shop. Play retro Bollywood saloon music online, round the clock. Also known as Deluxe Saloon, Delux Salon.",
  keywords: [
    "deluxe salon music",
    "deluxesalonmusic",
    "deluxe saloon music",
    "delux salon music",
    "deluxe salon songs",
    "deluxe saloon songs",
    "deluxe salon playlist",
    "deluxe saloon playlist",
    "deluxe salon website",
    "deluxe saloon website",
    "deluxe salon radio",
    "indian saloon radio",
    "indian barber shop music",
    "90s hindi songs online",
    "2000s bollywood songs",
    "retro hindi songs",
    "old hindi film songs",
    "purane gaane",
    "90s hindi radio",
    "saloon music india",
    "neighbourhood barber music",
    "ambient hindi radio",
    "free bollywood radio",
    "hindi retro radio online",
    "deluxe salon org",
    "deluxe salon in",
    "deluxe salon site",
  ].join(", "),
  authors: [{ name: "Deluxe Salon Music", url: BASE_URL }],
  creator: "Deluxe Salon Music",
  publisher: "Deluxe Salon Music",
  category: "Music",
  classification: "Entertainment / Music / Radio",

  /* ── Canonical & Alternates ─────────────────────────────────────── */
  alternates: {
    canonical: BASE_URL,
    languages: {
      "en-IN": BASE_URL,
      "hi-IN": BASE_URL,
    },
  },

  /* ── Open Graph ─────────────────────────────────────────────────── */
  openGraph: {
    type: "website",
    url: BASE_URL,
    siteName: "Deluxe Salon Music",
    title: "Deluxe Salon Music — Free 90s Hindi Retro Saloon Radio Online",
    description:
      "Free ambient 90s & 2000s Hindi film songs radio. The kind of tape that never stops at a neighbourhood Indian barber shop. Play now — round the clock.",
    locale: "en_IN",
    images: [
      {
        url: `${BASE_URL}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Deluxe Salon Music — Indian retro barbershop ambient radio",
        type: "image/png",
      },
    ],
  },

  /* ── Twitter ────────────────────────────────────────────────────── */
  twitter: {
    card: "summary_large_image",
    site: "@deluxesalonmusic",
    creator: "@deluxesalonmusic",
    title: "Deluxe Salon Music — Free 90s Hindi Retro Saloon Radio",
    description:
      "Free ambient 90s & 2000s Hindi film songs radio — the kind of tape that never stops at a neighbourhood Indian barber shop.",
    images: [`${BASE_URL}/og-image.png`],
  },

  /* ── Robots ─────────────────────────────────────────────────────── */
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  /* ── Verification ────────────────────────────────────────────────── */
  // Add your Google Search Console verification token here after deploying
  // verification: { google: "YOUR_GOOGLE_VERIFICATION_TOKEN" },

  /* ── App / PWA ───────────────────────────────────────────────────── */
  applicationName: "Deluxe Salon Music",
  appleWebApp: {
    capable: true,
    title: "Deluxe Salon Music",
    statusBarStyle: "black-translucent",
  },
  formatDetection: { telephone: false },

  /* ── Icons ───────────────────────────────────────────────────────── */
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Anek+Devanagari:wght@500;700;800&family=Familjen+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
        {/* JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              /* WebSite */
              {
                "@context": "https://schema.org",
                "@type": "WebSite",
                name: "Deluxe Salon Music",
                alternateName: ["Deluxe Saloon Music", "Delux Salon Music", "deluxesalonmusic.com"],
                url: BASE_URL,
                description:
                  "Free ambient 90s & 2000s Hindi film songs radio — the kind of tape that never stops at a neighbourhood Indian barber shop.",
                inLanguage: ["en-IN", "hi-IN"],
                potentialAction: {
                  "@type": "ListenAction",
                  target: BASE_URL,
                  expectsAcceptanceOf: {
                    "@type": "Offer",
                    price: "0",
                    priceCurrency: "INR",
                    eligibleRegion: { "@type": "Place", name: "India" },
                  },
                },
              },
              /* RadioStation */
              {
                "@context": "https://schema.org",
                "@type": "RadioStation",
                name: "Deluxe Salon Music",
                alternateName: "Deluxe Saloon Music Radio",
                url: BASE_URL,
                description:
                  "An always-on ambient radio station playing 90s and 2000s Hindi film songs, evoking the nostalgic atmosphere of an Indian neighbourhood barber shop.",
                broadcastFrequency: "Online",
                genre: ["Bollywood", "Hindi Film Songs", "90s Hindi", "Retro Indian Music"],
                areaServed: {
                  "@type": "Country",
                  name: "India",
                },
                logo: {
                  "@type": "ImageObject",
                  url: `${BASE_URL}/og-image.png`,
                },
              },
              /* MusicGroup / Playlist context */
              {
                "@context": "https://schema.org",
                "@type": "MusicPlaylist",
                name: "Deluxe Salon Music — 90s Hindi Saloon Radio",
                description:
                  "A curated playlist of 90s and 2000s Hindi film songs — Kumar Sanu, Alka Yagnik, Udit Narayan, Mohammed Rafi — the sounds of the neighbourhood Indian barbershop.",
                url: BASE_URL,
                genre: "Bollywood",
                numTracks: 60,
              },
              /* FAQPage */
              {
                "@context": "https://schema.org",
                "@type": "FAQPage",
                mainEntity: [
                  {
                    "@type": "Question",
                    name: "What is Deluxe Salon Music?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "Deluxe Salon Music (deluxesalonmusic.com) is a free ambient radio website that plays 90s and 2000s Hindi film songs round the clock, recreating the nostalgic atmosphere of an Indian neighbourhood barber shop (nai ki dukan).",
                    },
                  },
                  {
                    "@type": "Question",
                    name: "Is Deluxe Salon Music free to use?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "Yes, Deluxe Salon Music is completely free. Audio plays through YouTube's embedded player. Nothing is hosted on this site.",
                    },
                  },
                  {
                    "@type": "Question",
                    name: "What songs does Deluxe Salon Music play?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "Deluxe Salon Music plays 90s and early 2000s Bollywood and Hindi film songs — Kumar Sanu, Alka Yagnik, Udit Narayan, Mohammed Rafi, Lata Mangeshkar — the kind of songs that played on a transistor radio at the neighbourhood barber shop.",
                    },
                  },
                  {
                    "@type": "Question",
                    name: "What is the difference between Deluxe Salon and Deluxe Saloon?",
                    acceptedAnswer: {
                      "@type": "Answer",
                      text: "'Salon' is the standard term for a grooming shop, while 'Saloon' is an older spelling that appeared on many Indian barber shop sign boards. Both refer to the same place — the neighbourhood haircutting shop.",
                    },
                  },
                ],
              },
            ]),
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
