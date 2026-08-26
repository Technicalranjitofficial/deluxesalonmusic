// Server component — renders static HTML that Googlebot reads immediately
// Visually subtle but keyword-rich for search indexing
export default function SeoContent() {
  return (
    <footer
      aria-label="About Deluxe Salon Music"
      style={{
        position: "relative",
        zIndex: 50,
        background: "rgba(4, 8, 14, 0.92)",
        borderTop: "1px solid rgba(255,255,255,0.07)",
        padding: "2.5rem 1.5rem 5rem",
        fontFamily: "'Familjen Grotesk', sans-serif",
        color: "rgba(201, 184, 154, 0.65)",
        fontSize: "0.78rem",
        lineHeight: 1.75,
      }}
    >
      <div style={{ maxWidth: "720px", margin: "0 auto" }}>

        {/* Site description — primary keyword target */}
        <p style={{ marginBottom: "1rem", color: "rgba(240,232,216,0.7)", fontSize: "0.82rem" }}>
          <strong style={{ color: "rgba(240,232,216,0.9)" }}>Deluxe Salon Music</strong> is a
          free ambient radio website that plays 90s and 2000s Hindi film songs round the
          clock — the kind of tape that never stops at a neighbourhood Indian barber shop.
          Also written <em>Deluxe Saloon Music</em> and <em>Delux Salon Music</em>.
        </p>

        {/* Mood descriptions — long-tail keyword content */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: "0.75rem 1.5rem",
            marginBottom: "1.25rem",
          }}
        >
          <div>
            <strong style={{ color: "rgba(212,169,106,0.85)" }}>✂️ Saloon Classics</strong>
            <p style={{ margin: "0.2rem 0 0" }}>
              Mid-tempo melodies from the 90s that played all day in every Indian
              barbershop — Dheere Dheere, Pehla Nasha, Kuch Kuch Hota Hai.
            </p>
          </div>
          <div>
            <strong style={{ color: "rgba(212,169,106,0.85)" }}>🌙 Highway Raat</strong>
            <p style={{ margin: "0.2rem 0 0" }}>
              Late-night Bollywood songs for long empty roads — Chitthi Aayi Hai,
              Sandese Aate Hain, Chaiyya Chaiyya.
            </p>
          </div>
          <div>
            <strong style={{ color: "rgba(212,169,106,0.85)" }}>💔 90s Dard</strong>
            <p style={{ margin: "0.2rem 0 0" }}>
              Heartbreak melodies by Kumar Sanu, Alka Yagnik, Udit Narayan —
              the slow, emotional side of 90s Hindi film music.
            </p>
          </div>
          <div>
            <strong style={{ color: "rgba(212,169,106,0.85)" }}>🎉 Shaadi & Sunday</strong>
            <p style={{ margin: "0.2rem 0 0" }}>
              Wedding energy and dance floor hits — Tu Cheez Badi Hai Mast,
              Jumma Chumma, Ek Do Teen, Dhak Dhak.
            </p>
          </div>
          <div>
            <strong style={{ color: "rgba(212,169,106,0.85)" }}>📻 Papa Ke Zamaane</strong>
            <p style={{ margin: "0.2rem 0 0" }}>
              Old-school Hindi melodies from the 70s and 80s — the originals
              your father grew up listening to.
            </p>
          </div>
          <div>
            <strong style={{ color: "rgba(212,169,106,0.85)" }}>🌧️ Baarish Wali Raat</strong>
            <p style={{ margin: "0.2rem 0 0" }}>
              Monsoon mood with real rain and thunder sounds — the perfect
              combination of Bollywood music and Indian rainfall.
            </p>
          </div>
        </div>

        {/* FAQ content — targets question-based searches */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "1rem" }}>
          <p style={{ marginBottom: "0.6rem" }}>
            <strong style={{ color: "rgba(240,232,216,0.75)" }}>
              What is Deluxe Salon Music?
            </strong>{" "}
            Deluxe Salon Music (deluxesalonmusic.com) is a free browser radio playing 90s
            Hindi songs. It recreates the nostalgic atmosphere of a Deluxe Saloon — the
            neighbourhood hair-cutting shop found across India in the 1990s and 2000s.
          </p>
          <p style={{ marginBottom: "0.6rem" }}>
            <strong style={{ color: "rgba(240,232,216,0.75)" }}>
              What songs play on Deluxe Salon Music?
            </strong>{" "}
            The radio plays classic Bollywood songs by Kumar Sanu, Alka Yagnik, Udit
            Narayan, Lata Mangeshkar, Mohammed Aziz, Kavita Krishnamurthy and other
            legends of 90s Hindi film music.
          </p>
          <p style={{ marginBottom: "0.6rem" }}>
            <strong style={{ color: "rgba(240,232,216,0.75)" }}>
              Is Deluxe Salon Music free?
            </strong>{" "}
            Yes, completely free. Audio plays through YouTube. No login, no app, no
            subscription required. Works on mobile and desktop.
          </p>
          <p style={{ marginBottom: "0" }}>
            <strong style={{ color: "rgba(240,232,216,0.75)" }}>
              Deluxe Salon vs Deluxe Saloon?
            </strong>{" "}
            Both refer to the same thing — the Indian neighbourhood barber shop. "Saloon"
            was the common spelling on hand-painted shop boards across India. This site
            is also known as Deluxe Saloon Music, Delux Salon Music, and Indian Retro
            Saloon Radio.
          </p>
        </div>

        {/* Navigation links + copyright */}
        <div
          style={{
            marginTop: "1.25rem",
            paddingTop: "1rem",
            borderTop: "1px solid rgba(255,255,255,0.06)",
            display: "flex",
            flexWrap: "wrap",
            gap: "0.5rem 1.5rem",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", gap: "1rem" }}>
            <a href="/about"
              style={{ color: "rgba(212,169,106,0.7)", textDecoration: "none", fontSize: "0.75rem" }}>
              About
            </a>
            <a href="mailto:hello@deluxesalonmusic.com"
              style={{ color: "rgba(212,169,106,0.7)", textDecoration: "none", fontSize: "0.75rem" }}>
              Contact
            </a>
            <a href="https://open.spotify.com/playlist/2AVjI8Z57bqMJVtU3V9X1Q"
              target="_blank" rel="noopener noreferrer"
              style={{ color: "rgba(212,169,106,0.7)", textDecoration: "none", fontSize: "0.75rem" }}>
              Spotify Playlist
            </a>
          </div>
          <p style={{ margin: 0, fontSize: "0.7rem", opacity: 0.4,
            fontFamily: "'JetBrains Mono', monospace", letterSpacing: "0.15em" }}>
            © 2026 deluxesalonmusic.com
          </p>
        </div>

      </div>
    </footer>
  );
}
