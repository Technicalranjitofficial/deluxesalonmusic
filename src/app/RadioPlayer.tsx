"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import type { RainEngineHandle } from "./RainEngine";

const RainEngine = dynamic(() => import("./RainEngine"), { ssr: false });

const SILENT_WAV =
  "data:audio/wav;base64,UklGRrQBAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YZABAACAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA";

/* ── MOODS ─────────────────────────────────────────────────────────── */
interface Mood {
  id:         string;
  label:      string;
  labelHindi: string;
  emoji:      string;
  desc:       string;
  bg:         string;   // primary background
  bg2:        string;   // second background for crossfade (same as bg for single-image moods)
  dot:        string;
  songs:      string[];
  rainOn:     boolean;
}

const MOODS: Mood[] = [
  {
    id: "saloon", label: "Saloon Classics", labelHindi: "सैलून", emoji: "✂️",
    desc: "The mid-tempo melodies that play in every small-town barbershop, all day long",
    bg: "/saloon.webp", bg2: "/saloon2.webp",   // two images — crossfade
    dot: "#d4a96a", rainOn: false,
    songs: "Mcs2xEZ6K8o.htMvfOfixuM.Ki41AKu0iHc.cNV5hLSa9H8.thjRNwjmAdQ.bKZTnnFU9HA._YjSmLlmqLM.Yqj1_V90KJo.Irr3fsN9G9c.axtCauVo24M.RlSRxyxFwXI.yexZf8g_dJw._IcVb6hFhPs.9sthJUHkzgI.QxpPkGSmCqY.E8ytXrzkTNs.WGtqzK0VIRc.rL-TT1uB3zc.do1cu32sWec.ecTeagAk1Dc".split("."),
  },
  {
    id: "highway-raat", label: "Highway Raat", labelHindi: "हाईवे रात", emoji: "🌙",
    desc: "Late-night listening for long empty roads — distance, separation and letters from home",
    bg: "/highway-raat.webp", bg2: "/highway-raat.webp",
    dot: "#7ab3d4", rainOn: false,
    songs: "yexZf8g_dJw.9sthJUHkzgI.wGafZnT75a4.lFdSi01tpYM._IcVb6hFhPs.mNSYPtzpfd4.Kidtrrn4aUM.s_fdQXXDSLw.tUx-PDUKne8.l7iTcZ__Ejg.jBpRItrod-Q.9MX-QejdVaQ.QxpPkGSmCqY.WGtqzK0VIRc.BkLOBuTAtS0.G5sjHPy-SzU.lmZVoOlzbxw.YCuhzjK11iA.bVzIHMskZmQ.euZmH3dMDaE".split("."),
  },
  {
    id: "dard", label: "90s Dard", labelHindi: "नब्बे का दर्द", emoji: "💔",
    desc: "The heartbreak half of the nineties — slow, melodic and completely unembarrassed",
    bg: "/dard.webp", bg2: "/dard.webp",
    dot: "#9b59c8", rainOn: true,
    songs: "tUx-PDUKne8.lFdSi01tpYM.thjRNwjmAdQ.iupGwQqjgOk.Kidtrrn4aUM.s_fdQXXDSLw.Mcs2xEZ6K8o.htMvfOfixuM.RlSRxyxFwXI.l7iTcZ__Ejg.wGafZnT75a4.mNSYPtzpfd4.sWqjZpBtcxc.rL-TT1uB3zc.BkLOBuTAtS0.G5sjHPy-SzU.ecTeagAk1Dc.lmZVoOlzbxw.A4_KJ8t-dbo.YCuhzjK11iA".split("."),
  },
  {
    id: "shaadi", label: "Shaadi & Sunday", labelHindi: "शादी और इतवार", emoji: "🎉",
    desc: "Wedding-procession energy — the loud, happy side of the same decade",
    bg: "/shaadi.webp", bg2: "/shaadi.webp",
    dot: "#f06030", rainOn: false,
    songs: "PufJm6BV8g4.kcRiLuclqzo.s5Iyc5rwUoI.mvlk8dJDuaA.Yqj1_V90KJo.axtCauVo24M.Irr3fsN9G9c._YjSmLlmqLM.jBpRItrod-Q.9MX-QejdVaQ.bKZTnnFU9HA.Ki41AKu0iHc.MS5BLS2sIDM.E8ytXrzkTNs.rCRc0hHWMHQ.do1cu32sWec.lv4N9V5HjRA.eYl9i8mH1lI.bBjVLCAAM1A.bVzIHMskZmQ".split("."),
  },
  {
    id: "papa-ke-gaane", label: "Papa Ke Zamaane", labelHindi: "पापा के गाने", emoji: "📻",
    desc: "Old-school melodies from your father's era — the originals that started it all",
    bg: "/papa-ke-gaane.webp", bg2: "/papa-ke-gaane.webp",
    dot: "#e8894a", rainOn: false,
    songs: "kjUTs76Gnks.ixCnsZswdpU.4_a0ge-TPJs.vkF1PPHS99s.tZqlD8VN9AE.xKb6lP3JxrA.o31C53fu_so.-1J1XqOKnuw.t3ynYlnIKAI.ojCnlV1MA-k.dReDtHKF0-g.S1Jnszqzfl4.VHQ0w-9ITBI.Qw0SM_TU20c.vzlXfZlH5dk".split("."),
  },
  {
    id: "coding", label: "Focus & Coding", labelHindi: "फोकस", emoji: "💻",
    desc: "Steady Bollywood background for your deep work sessions",
    bg: "/coding.webp", bg2: "/coding.webp",
    dot: "#3b9eff", rainOn: false,
    songs: "Q6JH5QMhGUc.RVQsBlI35vw.9J_isuHe8bw.AELvXURBfgw.PjiitGT4fUA.xvevXfFGPFY.5kZ5o-oM0RI.v45d6MlNKIk.PUO7_Gi6ipg.X9MB_25XncQ.3OXiqmUhB70.xnhjxG79Ttc.ieu6xnwJxdA.tfSqvusJiFI.Oj484P4OXD8".split("."),
  },
  {
    id: "rain", label: "Baarish Wali Raat", labelHindi: "बारिश", emoji: "🌧️",
    desc: "Monsoon melodies + real rain sounds — windows fogged, chai hot",
    bg: "/baarish.webp", bg2: "/baarish.webp",
    dot: "#4a8aaa", rainOn: true,
    songs: "azEOf5PuqNA.qaMQNwBhghA.wfAIdZKs6Ok.IuS2d8bobgw.oJcE_QPFAng.p-pQaTOmVrs.OClXVLsI4jM.vzWWTX83C_Q.2hpBJd-YcpI.MCXQXuKpgKE.9jpsuaZlIss.9a6UaCBEV6o.4a25J3p0kVI.69WKhXjWBNE.SqZbGOCuai4".split("."),
  },
];

/* ── YouTube IFrame types ──────────────────────────────────────────── */
declare global {
  interface Window { YT: YTNamespace; onYouTubeIframeAPIReady: () => void; }
}
interface YTNamespace {
  Player: new (el: HTMLElement | string, opts: YTOpts) => YTPlayer;
  PlayerState: { PLAYING: number; PAUSED: number; ENDED: number };
}
interface YTOpts {
  width?: number | string; height?: number | string;
  videoId?: string; playerVars?: Record<string, unknown>;
  events?: {
    onReady?: (e: { target: YTPlayer }) => void;
    onStateChange?: (e: { data: number; target: YTPlayer }) => void;
    onError?: (e: { data: number }) => void;
  };
}
interface YTPlayer {
  playVideo(): void; pauseVideo(): void;
  loadVideoById(id: string): void;
  setVolume(v: number): void; mute(): void; unMute(): void; isMuted(): boolean;
  getDuration(): number; getCurrentTime(): number;
  seekTo(s: number, allowSeekAhead: boolean): void;
  getPlayerState(): number;
  getVideoData(): { title: string; author: string; video_id: string };
  destroy(): void;
}

function fmt(s: number) {
  if (!isFinite(s) || s < 0) return "0:00";
  return `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
}

/* ── Component ─────────────────────────────────────────────────────── */
export default function RadioPlayer() {
  const ytDivRef    = useRef<HTMLDivElement>(null);
  const playerRef   = useRef<YTPlayer | null>(null);
  const pollRef     = useRef<ReturnType<typeof setInterval> | null>(null);
  const silentRef   = useRef<HTMLAudioElement | null>(null);
  const rainRef     = useRef<RainEngineHandle>(null);
  const rainStarted = useRef(false);

  const [moodId,      setMoodId]      = useState("saloon");
  const [dropOpen,    setDropOpen]    = useState(false);
  const dropRef = useRef<HTMLDivElement>(null);
  const mood = MOODS.find(m => m.id === moodId) ?? MOODS[0];

  const [apiReady,    setApiReady]    = useState(false);
  const [playerReady, setPlayerReady] = useState(false);
  const [hasStarted,  setHasStarted]  = useState(false);
  const [isPlaying,   setIsPlaying]   = useState(false);
  const [isMuted,     setIsMuted]     = useState(false);
  const [volume,      setVolume]      = useState(100);
  const [curTime,     setCurTime]     = useState(0);
  const [duration,    setDuration]    = useState(0);
  const [songIdx,     setSongIdx]     = useState(0);
  const [nowPlaying,  setNowPlaying]  = useState("Tuning in…");
  const [thumbUrl,    setThumbUrl]    = useState(`https://i.ytimg.com/vi/Mcs2xEZ6K8o/hqdefault.jpg`);
  const [clockTime,   setClockTime]   = useState("");
  const [showOverlay, setShowOverlay] = useState(true);
  const [bgIdx,       setBgIdx]       = useState(0);  // for saloon crossfade

  const getStartIdx = useCallback((m: Mood) => Math.floor(Math.random() * m.songs.length), []);

  /* Clock */
  useEffect(() => {
    const tick = () => setClockTime(new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true }));
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);

  /* Crossfade timer — only meaningful for saloon (bg !== bg2 for others but harmless) */
  useEffect(() => {
    const t = setInterval(() => setBgIdx(p => (p + 1) % 2), 10000);
    return () => clearInterval(t);
  }, []);

  /* Apply mood theme via data attribute */
  useEffect(() => {
    document.documentElement.setAttribute("data-mood", moodId);
  }, [moodId]);

  /* Close dropdown on outside click */
  useEffect(() => {
    if (!dropOpen) return;
    const h = (e: MouseEvent) => { if (dropRef.current && !dropRef.current.contains(e.target as Node)) setDropOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, [dropOpen]);

  /* Silent audio unlock */
  const unlock = useCallback(() => {
    if (!silentRef.current) {
      const a = new Audio(SILENT_WAV);
      a.loop = true; a.volume = 0.0001; a.setAttribute("playsinline", "true");
      silentRef.current = a;
    }
    silentRef.current.play().catch(() => {});
  }, []);

  /* Auto-start rain on first gesture */
  useEffect(() => {
    const go = () => {
      if (!rainStarted.current) {
        rainStarted.current = true;
        if (mood.rainOn) rainRef.current?.start();
      }
    };
    window.addEventListener("pointerdown", go, { once: true });
    window.addEventListener("keydown",     go, { once: true });
    return () => { window.removeEventListener("pointerdown", go); window.removeEventListener("keydown", go); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* Load YouTube IFrame API */
  useEffect(() => {
    if (window.YT?.Player) { setApiReady(true); return; }
    window.onYouTubeIframeAPIReady = () => setApiReady(true);
    if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
      const s = document.createElement("script"); s.src = "https://www.youtube.com/iframe_api"; document.head.appendChild(s);
    }
  }, []);

  /* Progress polling */
  const startPoll = useCallback(() => {
    if (pollRef.current) clearInterval(pollRef.current);
    pollRef.current = setInterval(() => {
      try {
        const ct  = playerRef.current?.getCurrentTime() ?? 0;
        const dur = playerRef.current?.getDuration()    ?? 0;
        if (isFinite(ct))             setCurTime(ct);
        if (isFinite(dur) && dur > 0) setDuration(dur);
      } catch { /**/ }
    }, 500);
  }, []);
  const stopPoll = useCallback(() => {
    if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null; }
  }, []);

  const loadSong = useCallback((songs: string[], idx: number) => {
    const id = songs[idx];
    setSongIdx(idx);
    setNowPlaying("Loading…");
    setThumbUrl(`https://i.ytimg.com/vi/${id}/hqdefault.jpg`);
    setCurTime(0); setDuration(0);
    playerRef.current?.loadVideoById(id);
  }, []);

  /* Create YT player */
  useEffect(() => {
    if (!apiReady || !ytDivRef.current || playerRef.current) return;
    let destroyed = false;
    const startIdx = getStartIdx(mood);
    setSongIdx(startIdx);
    const id = mood.songs[startIdx];

    playerRef.current = new window.YT.Player(ytDivRef.current, {
      width: "1", height: "1", videoId: id,
      playerVars: { autoplay: 1, controls: 0, playsinline: 1, rel: 0, disablekb: 1, fs: 0, iv_load_policy: 3, modestbranding: 1, origin: window.location.origin },
      events: {
        onReady: (e) => {
          if (destroyed) return;
          setPlayerReady(true); e.target.setVolume(100); e.target.playVideo();
          const d = e.target.getVideoData();
          if (d?.title) setNowPlaying(d.title);
          setThumbUrl(`https://i.ytimg.com/vi/${id}/hqdefault.jpg`);
        },
        onStateChange: (e) => {
          if (destroyed) return;
          const { PLAYING, PAUSED, ENDED } = window.YT.PlayerState;
          setIsPlaying(e.data === PLAYING);
          if (e.data === PLAYING) {
            setHasStarted(true); startPoll();
            const d = e.target.getVideoData();
            if (d?.title?.trim()) { setNowPlaying(d.title); setThumbUrl(`https://i.ytimg.com/vi/${d.video_id}/hqdefault.jpg`); }
          } else if (e.data === PAUSED) {
            stopPoll();
          } else if (e.data === ENDED) {
            stopPoll(); loadSong(mood.songs, (songIdx + 1) % mood.songs.length);
          }
        },
        onError: () => loadSong(mood.songs, (songIdx + 1) % mood.songs.length),
      },
    });
    return () => { destroyed = true; stopPoll(); playerRef.current?.destroy(); playerRef.current = null; };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiReady]);

  /* Mood change */
  const handleMoodChange = useCallback((newId: string) => {
    setDropOpen(false);
    if (newId === moodId) return;
    setMoodId(newId);
    const newMood = MOODS.find(m => m.id === newId)!;
    const idx = getStartIdx(newMood);
    setSongIdx(idx);
    const id = newMood.songs[idx];
    setNowPlaying("Loading…"); setThumbUrl(`https://i.ytimg.com/vi/${id}/hqdefault.jpg`); setCurTime(0); setDuration(0);
    playerRef.current?.loadVideoById(id);
    if (newMood.rainOn) rainRef.current?.start(); else rainRef.current?.stop();
  }, [moodId, getStartIdx]);

  const handleOverlayTap = () => { setShowOverlay(false); unlock(); if (playerReady && playerRef.current) playerRef.current.playVideo(); };
  const handleToggle = () => { unlock(); isPlaying ? playerRef.current?.pauseVideo() : playerRef.current?.playVideo(); };
  const handlePrev   = () => { unlock(); loadSong(mood.songs, (songIdx - 1 + mood.songs.length) % mood.songs.length); };
  const handleNext   = () => { unlock(); loadSong(mood.songs, (songIdx + 1) % mood.songs.length); };
  const handleSeek   = (e: React.ChangeEvent<HTMLInputElement>) => { const v = parseFloat(e.target.value); setCurTime(v); playerRef.current?.seekTo(v, true); };
  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseInt(e.target.value); setVolume(v); playerRef.current?.setVolume(v);
    if (v === 0) { playerRef.current?.mute(); setIsMuted(true); } else { playerRef.current?.unMute(); setIsMuted(false); }
  };
  const handleMute = () => {
    if (isMuted) { playerRef.current?.unMute(); playerRef.current?.setVolume(volume || 80); setIsMuted(false); }
    else { playerRef.current?.mute(); setIsMuted(true); }
  };

  const pct = duration > 0 ? (curTime / duration) * 100 : 0;

  /* ── Render ─────────────────────────────────────────────────────── */
  return (
    <div className="relative w-full" style={{ background: "var(--color-shade)" }}>

      {/* Hidden YT player */}
      <div style={{ position:"fixed", bottom:0, right:0, width:"1px", height:"1px", overflow:"hidden", opacity:0.01, pointerEvents:"none", zIndex:-1 }}>
        <div ref={ytDivRef} />
      </div>

      {/* Rain engine */}
      <RainEngine ref={rainRef} />

      {/* Tap-to-start overlay */}
      {showOverlay && (
        <div onClick={handleOverlayTap} className="fixed inset-0 z-50 flex flex-col items-center justify-center cursor-pointer"
          style={{ background:"rgba(0,0,0,0.78)", backdropFilter:"blur(6px)" }}>
          <div className="flex flex-col items-center gap-5 text-center px-8">
            <div className="w-20 h-20 rounded-full flex items-center justify-center"
              style={{ background:"rgba(255,255,255,0.08)", border:"2px solid rgba(255,255,255,0.25)" }}>
              <svg width={32} height={32} viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold mb-1" style={{ fontFamily:"var(--font-display)", color:"var(--color-cream)", fontSize:"clamp(1.4rem,5vw,2rem)" }}>डीलक्स सैलून</p>
              <p className="text-sm" style={{ color:"rgba(255,255,255,0.5)", fontFamily:"var(--font-sans)" }}>Tap anywhere to start the radio</p>
            </div>
          </div>
        </div>
      )}

      {/* Background — single image for all moods; saloon gets 2-image crossfade */}
      <div className="fixed inset-0">
        {/* Base: always visible */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={mood.bg2} alt="" className="absolute inset-0 w-full h-full object-cover" style={{ zIndex:1 }} width={1920} height={1088} />
        {/* Top: fades for saloon (bg !== bg2), static for others */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={mood.bg} alt="" className="absolute inset-0 w-full h-full object-cover"
          style={{ zIndex:2, opacity: bgIdx === 0 ? 1 : 0, transition:"opacity 2.5s ease-in-out" }}
          width={1920} height={1088} />
        {/* Light vignette — only darkens edges, keeps centre vivid */}
        <div aria-hidden className="pointer-events-none absolute inset-0" style={{ zIndex:3,
          background:"radial-gradient(ellipse at 50% 60%, transparent 40%, rgba(0,0,0,0.5) 100%)" }} />
        {/* Subtle grain */}
        <div aria-hidden className="pointer-events-none absolute inset-0 saloon-grain" style={{ zIndex:4 }} />
      </div>

      {/* Page content */}
      <div className="relative flex min-h-[100dvh] flex-col">

        {/* Header */}
        <header className="relative z-30 flex items-center justify-between gap-2 px-3 pt-3 sm:px-6 sm:pt-5">
          <span className="min-w-[5rem] tabular-nums text-xs tracking-[0.18em] uppercase opacity-70"
            style={{ fontFamily:"var(--font-mono)", color:"var(--color-sand)" }}>{clockTime}</span>
          <span className="flex items-center gap-1.5 text-xs" style={{ fontFamily:"var(--font-sans)", color:"var(--color-sand)" }}>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-70" style={{ background:"var(--color-live)" }} />
              <span className="relative inline-flex h-2 w-2 rounded-full" style={{ background:"var(--color-live)" }} />
            </span>
            <span className="font-semibold" style={{ color:"var(--color-cream)" }}>{isPlaying ? "Live" : "—"}</span>
            <span className="opacity-55">online</span>
          </span>
          <div className="min-w-[5rem]" />
        </header>

        {/* Mood dropdown */}
        <div className="relative z-30 flex justify-center pt-3 sm:pt-4" ref={dropRef}>
          <button type="button" className="mood-dropdown-btn" onClick={() => setDropOpen(p => !p)}
            aria-haspopup="listbox" aria-expanded={dropOpen}>
            <span>{mood.emoji}</span>
            <span>{mood.label}</span>
            <svg width={12} height={12} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth={2}
              style={{ opacity:0.6, transform: dropOpen ? "rotate(180deg)" : "rotate(0deg)", transition:"transform 0.2s" }}>
              <path d="M2 4l4 4 4-4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          {dropOpen && (
            <div className="mood-dropdown-panel" role="listbox">
              {MOODS.map(m => (
                <div key={m.id} role="option" aria-selected={m.id === moodId}
                  className={`mood-option ${m.id === moodId ? "active" : ""}`}
                  onClick={() => handleMoodChange(m.id)}>
                  <span className="mood-option-dot" style={{ background: m.dot }} />
                  <span>{m.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{m.label}</div>
                    <div className="text-[0.7rem] opacity-50 truncate">{m.desc}</div>
                  </div>
                  {m.id === moodId && (
                    <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Hero title — letter-by-letter drop animation */}
        <div className="relative z-10 flex flex-col items-center px-6 pt-6 text-center sm:pt-8">
          <h1
            className="font-extrabold leading-[0.88] title-animate"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(4rem,16vw,9rem)",
              color: "var(--color-cream)",
              textShadow: "0 4px 32px rgba(0,0,0,0.7), 0 2px 8px rgba(0,0,0,0.5)",
            }}
          >
            {/* Line 1: डीलक्स */}
            <span className="block">
              {"डीलक्स".split("").map((ch, i) => (
                <span
                  key={`l1-${i}`}
                  className="title-letter"
                  style={{ animationDelay: `${i * 0.07}s` }}
                >
                  {ch}
                </span>
              ))}
            </span>
            {/* Line 2: सैलून */}
            <span className="block">
              {"सैलून".split("").map((ch, i) => (
                <span
                  key={`l2-${i}`}
                  className="title-letter"
                  style={{ animationDelay: `${0.4 + i * 0.07}s` }}
                >
                  {ch}
                </span>
              ))}
            </span>
          </h1>
          <p
            className="mt-2 tracking-[0.42em] uppercase"
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.58rem",
              color: "rgba(255,255,255,0.6)",
              opacity: 0,
              animation: "letter-drop 0.5s ease forwards",
              animationDelay: "0.9s",
            }}
          >
            {mood.desc}
          </p>
        </div>

        <div className="flex-1" />

        {/* Start prompt */}
        {!hasStarted && (
          <div className="relative z-20 mb-6 flex justify-center px-4">
            <button onClick={handleOverlayTap} disabled={!playerReady}
              className="saloon-glass mx-auto flex w-full max-w-md items-center gap-3 overflow-hidden rounded-2xl px-4 py-3 transition-all hover:border-[rgba(255,255,255,0.28)] disabled:opacity-40"
              style={{ color:"var(--color-cream)" }}>
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl" style={{ background:"rgba(255,255,255,0.1)" }}>
                <PlayIcon size={20} />
              </span>
              <div className="min-w-0 flex-1 text-left">
                <p className="font-semibold text-sm" style={{ fontFamily:"var(--font-sans)" }}>
                  {playerReady ? `Start — ${mood.label}` : "Loading…"}
                </p>
                <p className="text-xs" style={{ color:"rgba(255,255,255,0.5)", fontFamily:"var(--font-sans)" }}>{mood.desc}</p>
              </div>
              <span className="shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold"
                style={{ background:"var(--color-cream)", color:"var(--color-shade)", fontFamily:"var(--font-sans)" }}>
                {playerReady ? "Play" : "…"}
              </span>
            </button>
          </div>
        )}

        <div className="h-[7.5rem] sm:h-[9rem]" />
      </div>

      {/* Fixed bottom player */}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40">
        <div className="pointer-events-auto">
          <div className="mx-auto w-full max-w-2xl px-3" style={{ paddingBottom:"max(0.75rem,env(safe-area-inset-bottom))" }}>
            <div className="saloon-glass mb-2 flex items-center gap-2 rounded-2xl px-3 py-2.5 sm:gap-3 sm:px-4 sm:py-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={thumbUrl} alt="" width={48} height={48}
                className={`h-11 w-11 shrink-0 rounded-full object-cover ${isPlaying ? "spinning" : ""}`}
                style={{ boxShadow:`0 0 0 2px ${mood.dot}55` }}
                onError={e => { (e.target as HTMLImageElement).src = `https://i.ytimg.com/vi/${mood.songs[0]}/hqdefault.jpg`; }} />
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-sm" style={{ color:"var(--color-cream)", fontFamily:"var(--font-sans)" }}>{nowPlaying}</p>
                <p className="truncate text-xs opacity-45" style={{ color:"var(--color-cream)", fontFamily:"var(--font-sans)" }}>
                  {mood.emoji} {mood.label}
                </p>
                <div className="mt-1.5 flex items-center gap-2">
                  <input type="range" min={0} max={duration || 1} step={1} value={curTime}
                    onChange={handleSeek} aria-label="Seek" className="saloon-range h-[3px] w-full"
                    style={{ "--progress":`${pct}%` } as React.CSSProperties} />
                  <span className="shrink-0 tabular-nums"
                    style={{ fontFamily:"var(--font-mono)", fontSize:"0.58rem", color:"rgba(255,255,255,0.4)" }}>
                    {fmt(curTime)}&nbsp;/&nbsp;{fmt(duration)}
                  </span>
                </div>
              </div>
              <div className="flex shrink-0 items-center gap-0.5">
                <button type="button" onClick={handlePrev} aria-label="Previous" className="saloon-icon-btn"><SkipBackIcon /></button>
                <button type="button" onClick={hasStarted ? handleToggle : handleOverlayTap} disabled={!playerReady}
                  aria-label={isPlaying ? "Pause" : "Play"} className="saloon-play-btn">
                  {isPlaying ? <PauseIcon /> : <PlayIcon size={20} />}
                </button>
                <button type="button" onClick={handleNext} aria-label="Next" className="saloon-icon-btn"><SkipFwdIcon /></button>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <button type="button" onClick={handleMute} aria-label={isMuted ? "Unmute" : "Mute"} className="saloon-icon-btn">
                  {isMuted ? <VolumeOffIcon /> : <VolumeIcon />}
                </button>
                <input type="range" min={0} max={100} step={1} value={isMuted ? 0 : volume}
                  onChange={handleVolume} aria-label="Volume" className="saloon-range hidden h-[3px] w-14 sm:block"
                  style={{ "--progress":`${isMuted ? 0 : volume}%` } as React.CSSProperties} />
              </div>
            </div>
            <div className="flex justify-center pb-0.5">
              <span className="text-[0.65rem] opacity-40 tracking-widest uppercase"
                style={{ fontFamily:"var(--font-mono)", color:"var(--color-sand)" }}>
                {mood.labelHindi} &nbsp;·&nbsp; Deluxe Salon Music
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Icons ─────────────────────────────────────────────────────────── */
function PlayIcon({ size = 16 }: { size?: number }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z" /></svg>;
}
function PauseIcon() {
  return <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="4" width="4" height="16" rx="1" /><rect x="14" y="4" width="4" height="16" rx="1" /></svg>;
}
function SkipBackIcon() {
  return <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M17.971 4.285A2 2 0 0 1 21 6v12a2 2 0 0 1-3.029 1.715l-9.997-5.998a2 2 0 0 1-.003-3.432z" /><path d="M3 20V4" /></svg>;
}
function SkipFwdIcon() {
  return <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M21 4v16" /><path d="M6.029 4.285A2 2 0 0 0 3 6v12a2 2 0 0 0 3.029 1.715l9.997-5.998a2 2 0 0 0 .003-3.432z" /></svg>;
}
function VolumeIcon() {
  return <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z" /><path d="M16 9a5 5 0 0 1 0 6" /><path d="M19.364 18.364a9 9 0 0 0 0-12.728" /></svg>;
}
function VolumeOffIcon() {
  return <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z" /><line x1="22" y1="2" x2="2" y2="22" /></svg>;
}
