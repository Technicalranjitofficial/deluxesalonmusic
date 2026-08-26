import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Deluxe Salon Music — Indian Retro Barber Shop Radio",
  description:
    "Deluxe Salon Music is a free ambient radio that recreates the nostalgic sound of a 1990s Indian neighbourhood barber shop. 90s and 2000s Hindi film songs, playing round the clock.",
  alternates: {
    canonical: "https://www.deluxesalonmusic.com/about",
  },
  openGraph: {
    title: "About Deluxe Salon Music",
    description: "The story behind the ambient Indian saloon radio.",
    url: "https://www.deluxesalonmusic.com/about",
  },
};

export default function AboutPage() {
  return (
    <div
      style={{
        minHeight: "100dvh",
        background: "#08131a",
        color: "#f0e8d8",
        fontFamily: "'Familjen Grotesk', sans-serif",
        padding: "3rem 1.5rem",
        maxWidth: "720px",
        margin: "0 auto",
        lineHeight: 1.8,
      }}
    >
      <a
        href="/"
        style={{ color: "#d4a96a", textDecoration: "none", fontSize: "0.85rem", opacity: 0.75 }}
      >
        ← Back to Radio
      </a>

      <h1
        style={{
          fontFamily: "'Anek Devanagari', sans-serif",
          fontSize: "clamp(2rem,8vw,4rem)",
          fontWeight: 800,
          marginTop: "2rem",
          marginBottom: "0.5rem",
          color: "#f0e8d8",
          lineHeight: 1,
        }}
      >
        डीलक्स सैलून
      </h1>
      <p
        style={{
          fontSize: "0.7rem",
          letterSpacing: "0.3em",
          textTransform: "uppercase",
          opacity: 0.5,
          fontFamily: "'JetBrains Mono', monospace",
          marginBottom: "3rem",
        }}
      >
        Deluxe Salon Music · About
      </p>

      <h2 style={{ color: "#d4a96a", fontSize: "1.1rem", marginBottom: "0.75rem" }}>
        What is Deluxe Salon Music?
      </h2>
      <p style={{ opacity: 0.85, marginBottom: "1.5rem" }}>
        Deluxe Salon Music is a free, browser-based ambient radio website that plays 90s and
        2000s Hindi film songs round the clock. It is designed to recreate the specific
        atmosphere of a neighbourhood Indian barber shop — the kind of small red-walled{" "}
        <em>nai ki dukan</em> found in every Indian town and colony, where a transistor radio
        or cassette player was always on in the background.
      </p>

      <h2 style={{ color: "#d4a96a", fontSize: "1.1rem", marginBottom: "0.75rem" }}>
        Why &quot;Deluxe Saloon&quot;?
      </h2>
      <p style={{ opacity: 0.85, marginBottom: "1.5rem" }}>
        The name <strong>Deluxe Saloon</strong> (also written <strong>Deluxe Salon</strong>)
        was one of the most common barber shop names across India in the 1980s, 90s and 2000s.
        Walk through any mohalla and you would find a red sign reading{" "}
        <em>Deluxe Saloon</em>, <em>Star Saloon</em>, or <em>Prince Hair Cutting Saloon</em>.
        The word &quot;saloon&quot; — an older British-influenced spelling of &quot;salon&quot;
        — appeared on thousands of hand-painted boards across the country. This site is a
        tribute to that era.
      </p>

      <h2 style={{ color: "#d4a96a", fontSize: "1.1rem", marginBottom: "0.75rem" }}>
        What music plays on Deluxe Salon Music?
      </h2>
      <p style={{ opacity: 0.85, marginBottom: "1.5rem" }}>
        The radio plays a curated selection of 90s and early 2000s Bollywood and Hindi film
        songs — Kumar Sanu, Alka Yagnik, Udit Narayan, Lata Mangeshkar, Mohammed Aziz — the
        voices that defined an era. Songs that played on every radio, in every barbershop,
        in every Indian home during that decade.
      </p>
      <p style={{ opacity: 0.85, marginBottom: "1.5rem" }}>
        The playlist is organized into moods: <strong>Saloon Classics</strong> (mid-tempo
        all-day melodies), <strong>Highway Raat</strong> (late-night road songs),{" "}
        <strong>90s Dard</strong> (slow heartbreak melodies), <strong>Shaadi &amp; Sunday</strong>{" "}
        (wedding energy), <strong>Papa Ke Zamaane</strong> (older era classics),{" "}
        <strong>Focus &amp; Coding</strong> (steady background music), and{" "}
        <strong>Baarish Wali Raat</strong> (monsoon mood with real rain sounds).
      </p>

      <h2 style={{ color: "#d4a96a", fontSize: "1.1rem", marginBottom: "0.75rem" }}>
        How does it work?
      </h2>
      <p style={{ opacity: 0.85, marginBottom: "1.5rem" }}>
        Audio plays through YouTube&apos;s embedded player. No music is hosted on this site.
        All rights to the songs remain with the original labels, composers and performers.
        The rain and thunder sound effects are generated in real-time using the Web Audio API
        — nothing is downloaded or streamed.
      </p>

      <h2 style={{ color: "#d4a96a", fontSize: "1.1rem", marginBottom: "0.75rem" }}>
        Is it free?
      </h2>
      <p style={{ opacity: 0.85, marginBottom: "1.5rem" }}>
        Yes. Deluxe Salon Music is completely free. No login, no subscription, no ads. Just
        open the site and tap to start. It works on desktop and mobile.
      </p>

      <h2 style={{ color: "#d4a96a", fontSize: "1.1rem", marginBottom: "0.75rem" }}>
        Contact
      </h2>
      <p style={{ opacity: 0.85, marginBottom: "3rem" }}>
        For any queries, rights issues, or to report a song for removal, email:{" "}
        <a href="mailto:hello@deluxesalonmusic.com" style={{ color: "#d4a96a" }}>
          hello@deluxesalonmusic.com
        </a>
        . If you hold rights to any content here and want it taken down, it comes down
        immediately.
      </p>

      <p
        style={{
          fontSize: "0.65rem",
          opacity: 0.35,
          fontFamily: "'JetBrains Mono', monospace",
          letterSpacing: "0.2em",
          textTransform: "uppercase",
        }}
      >
        © 2026 deluxesalonmusic.com
      </p>
    </div>
  );
}
