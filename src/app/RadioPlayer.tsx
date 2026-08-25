"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import type { RainEngineHandle } from "./RainEngine";

const RainEngine = dynamic(() => import("./RainEngine"), { ssr: false });

const SONGS = "N0jnLZxYwYc.3NWMK2MRqIk.bga_0ziOOfQ.oFxbBeYhLqM.nNhv8A_rJTg.d3lZvNexPL0.CTuvMubzXpU.i1IsLVz6T9Q.5y_TCKNzAMI.fBylcT-TWZw.CTNgz5gb3D8.lFdSi01tpYM.dDR4oiyjUBA.otQmzlm-s7Q.tPNwGuu_rQ4.p1jhKCIoVjI.2OsyNo53MzU.-N-k56i7M2k.rXHY4Cv9cA8.qGOTe3KmCdY.cGKBs7rokos.BtdiNnrftYM.nRJ8vHpi6_g.xKx_80QM2LU.zuPoUsdXrqM.wYdXuNtJkPk.wuLJtA0uJro.RjJxWRFfG3s.wV8njoRVefQ.4ImdbyqnH8w.htMvfOfixuM.5dWbn_qER3s.6Na7GSV9bVY.oEg_iXEWlt4.QjqKXFGM3eI.Dz1Ad3cdtQA.G7AdjVDBLO8.TgHYW8ubFko.uIOrAkrjwp4.HoMSu1iw0Zw.WAgJ8KM5AVQ.OgocnLh9P1M.Zi9UBJQMz3I._dUAVM5ERXA.lRBIcaSV-Ns.9v2bq2JHt4I.Gg9ZUppafLo.w89fWEelFns.fg9G1dacXjk.Y-o8NQ8Y36A.526hvVlBP1U.iCZfjggJg3M.BaAoZA0fup0.cBGDDBHN22U.nG85YFR3o6U.TRUuSFW80Rk.-pIMyf5dOnA.GxaTSDnI71w.XWKazQwFFdY.9f6GhUb-WdM.rMbQufI9xQw.Mfeg92XPXik".split(".");

const SILENT_WAV =
  "data:audio/wav;base64,UklGRrQBAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YZABAACAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA";

const ROTATIONS = [
  { id: "highway-raat",    label: "Highway Raat",    emoji: "🌙" },
  { id: "saloon-classics", label: "Saloon Classics",  emoji: "✂️" },
  { id: "dard-90s",        label: "90s Dard",         emoji: "💔" },
  { id: "shaadi-sunday",   label: "Shaadi & Sunday",  emoji: "🎉" },
  { id: "all-songs",       label: "All Songs",        emoji: "🎵" },
];

const SPOTIFY_URL  = "https://open.spotify.com/playlist/2AVjI8Z57bqMJVtU3V9X1Q";
const YT_MUSIC_URL = "https://music.youtube.com/playlist?list=PLTJ1PnzCWyFw";

declare global {
  interface Window {
    YT: YTNamespace;
    onYouTubeIframeAPIReady: () => void;
  }
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

export default function RadioPlayer() {
  const ytDivRef    = useRef<HTMLDivElement>(null);
  const playerRef   = useRef<YTPlayer | null>(null);
  const pollRef     = useRef<ReturnType<typeof setInterval> | null>(null);
  const silentRef   = useRef<HTMLAudioElement | null>(null);
  const rainRef     = useRef<RainEngineHandle>(null);
  const startIdx    = useRef(Math.floor(Math.random() * SONGS.length));

  const [apiReady,    setApiReady]    = useState(false);
  const [playerReady, setPlayerReady] = useState(false);
  const [hasStarted,  setHasStarted]  = useState(false);
  const [isPlaying,   setIsPlaying]   = useState(false);
  const [isMuted,     setIsMuted]     = useState(false);
  const [volume,      setVolume]      = useState(100);
  const [curTime,     setCurTime]     = useState(0);
  const [duration,    setDuration]    = useState(0);
  const [idx,         setIdx]         = useState(startIdx.current);
  const [nowPlaying,  setNowPlaying]  = useState("Tuning in…");
  const [thumbUrl,    setThumbUrl]    = useState(
    `https://i.ytimg.com/vi/${SONGS[startIdx.current]}/hqdefault.jpg`
  );
  const [clockTime,   setClockTime]   = useState("");
  const [activeRot,   setActiveRot]   = useState(0);
  const [rainOn,      setRainOn]      = useState(false);
  // Rain starts automatically on first user interaction (can't autostart before gesture)
  const rainStarted = useRef(false);
  const [bgIdx,       setBgIdx]       = useState(0); // 0 = image.png, 1 = image2.png

  // Crossfade background slideshow — every 8 seconds
  useEffect(() => {
    const t = setInterval(() => setBgIdx((prev) => (prev + 1) % 2), 8000);
    return () => clearInterval(t);
  }, []);
  useEffect(() => {
    const tick = () =>
      setClockTime(new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true }));
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);

  // silent audio unlock
  const unlock = useCallback(() => {
    if (!silentRef.current) {
      const a = new Audio(SILENT_WAV);
      a.loop = true; a.volume = 0.0001;
      a.setAttribute("playsinline", "true");
      silentRef.current = a;
    }
    silentRef.current.play().catch(() => {});
  }, []);

  // load YouTube IFrame API
  useEffect(() => {
    if (window.YT?.Player) { setApiReady(true); return; }
    window.onYouTubeIframeAPIReady = () => setApiReady(true);
    if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
      const s = document.createElement("script");
      s.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(s);
    }
  }, []);

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

  const loadSong = useCallback((newIdx: number) => {
    const id = SONGS[newIdx];
    setIdx(newIdx);
    setNowPlaying("Loading…");
    setThumbUrl(`https://i.ytimg.com/vi/${id}/hqdefault.jpg`);
    setCurTime(0); setDuration(0);
    playerRef.current?.loadVideoById(id);
  }, []);

  // create YT player once API ready
  useEffect(() => {
    if (!apiReady || !ytDivRef.current || playerRef.current) return;
    let destroyed = false;
    const i = startIdx.current;

    playerRef.current = new window.YT.Player(ytDivRef.current, {
      width: "1", height: "1",
      videoId: SONGS[i],
      playerVars: {
        autoplay: 1, controls: 0, playsinline: 1,
        rel: 0, disablekb: 1, fs: 0,
        iv_load_policy: 3, modestbranding: 1,
        origin: window.location.origin,
      },
      events: {
        onReady: (e) => {
          if (destroyed) return;
          setPlayerReady(true);
          e.target.setVolume(100);
          e.target.playVideo();
          const d = e.target.getVideoData();
          if (d?.title) setNowPlaying(d.title);
        },
        onStateChange: (e) => {
          if (destroyed) return;
          const { PLAYING, PAUSED, ENDED } = window.YT.PlayerState;
          setIsPlaying(e.data === PLAYING);
          if (e.data === PLAYING) {
            setHasStarted(true);
            startPoll();
            const d = e.target.getVideoData();
            if (d?.title?.trim()) {
              setNowPlaying(d.title);
              setThumbUrl(`https://i.ytimg.com/vi/${d.video_id}/hqdefault.jpg`);
            }
          } else if (e.data === PAUSED) {
            stopPoll();
          } else if (e.data === ENDED) {
            stopPoll();
            loadSong((idx + 1) % SONGS.length);
          }
        },
        onError: () => loadSong((idx + 1) % SONGS.length),
      },
    });

    return () => {
      destroyed = true;
      stopPoll();
      playerRef.current?.destroy();
      playerRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiReady]);

  const handleStart  = () => { unlock(); playerRef.current?.playVideo(); };
  const handleToggle = () => {
    unlock();
    isPlaying ? playerRef.current?.pauseVideo() : playerRef.current?.playVideo();
  };
  const handlePrev   = () => { unlock(); loadSong((idx - 1 + SONGS.length) % SONGS.length); };
  const handleNext   = () => { unlock(); loadSong((idx + 1) % SONGS.length); };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    setCurTime(v);
    playerRef.current?.seekTo(v, true);
  };
  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseInt(e.target.value);
    setVolume(v);
    playerRef.current?.setVolume(v);
    if (v === 0) { playerRef.current?.mute(); setIsMuted(true); }
    else         { playerRef.current?.unMute(); setIsMuted(false); }
  };
  const handleMute = () => {
    if (isMuted) {
      playerRef.current?.unMute(); playerRef.current?.setVolume(volume || 80); setIsMuted(false);
    } else {
      playerRef.current?.mute(); setIsMuted(true);
    }
  };

  // Auto-start rain on first user gesture
  useEffect(() => {
    const startRainOnce = () => {
      if (!rainStarted.current) {
        rainStarted.current = true;
        setRainOn(true);
        rainRef.current?.start();
      }
    };
    window.addEventListener("pointerdown", startRainOnce, { once: true });
    window.addEventListener("keydown", startRainOnce, { once: true });
    return () => {
      window.removeEventListener("pointerdown", startRainOnce);
      window.removeEventListener("keydown", startRainOnce);
    };
  }, []);

  const pct = duration > 0 ? (curTime / duration) * 100 : 0;

  return (
    <div className="relative w-full" style={{ background: "var(--color-shade)" }}>

      {/* Hidden YT player */}
      <div style={{ position:"fixed", bottom:0, right:0, width:"1px", height:"1px",
                    overflow:"hidden", opacity:0.01, pointerEvents:"none", zIndex:-1 }}>
        <div ref={ytDivRef} />
      </div>

      {/* Rain engine — canvas + flash only, no pill */}
      <RainEngine ref={rainRef} />

      {/* Full-screen background — crossfade slideshow */}
      {/* image2 is always the base layer; image1 fades on top of it */}
      <div className="fixed inset-0">
        {/* Base layer — image2 always visible underneath */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/image2.png"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          style={{ zIndex: 1 }}
          width={1920} height={1088}
        />
        {/* Top layer — image1 fades in/out */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/image.png"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            zIndex: 2,
            opacity: bgIdx === 0 ? 1 : 0,
            transition: "opacity 2.5s ease-in-out",
          }}
          width={1920} height={1088}
        />
        <div aria-hidden className="pointer-events-none absolute inset-0 saloon-night-tint" style={{ zIndex: 3 }} />
        <div aria-hidden className="pointer-events-none absolute inset-0 saloon-vignette" style={{ zIndex: 4 }} />
        <div aria-hidden className="pointer-events-none absolute inset-0 saloon-grain" style={{ zIndex: 5 }} />
      </div>

      {/* Page content */}
      <div className="relative flex min-h-[100dvh] flex-col">

        {/* ── HEADER ────────────────────────────────────────────────── */}
        <header className="relative z-30 flex items-center justify-between gap-2 px-3 pt-3 sm:px-6 sm:pt-5">

          {/* Clock */}
          <span className="min-w-[5rem] tabular-nums text-xs tracking-[0.18em] uppercase opacity-75"
            style={{ fontFamily: "var(--font-mono)", color: "var(--color-sand)" }}>
            {clockTime}
          </span>

          {/* Live dot */}
          <span className="flex items-center gap-1.5 text-xs"
            style={{ fontFamily: "var(--font-sans)", color: "var(--color-sand)" }}>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-70"
                style={{ background: "var(--color-live)" }} />
              <span className="relative inline-flex h-2 w-2 rounded-full"
                style={{ background: "var(--color-live)" }} />
            </span>
            <span className="font-semibold" style={{ color: "var(--color-cream)" }}>Live</span>
            <span className="opacity-55">online</span>
          </span>

          {/* Right nav */}
          <nav className="flex flex-col items-end gap-1.5">
            <div className="flex items-center gap-1.5">
              <a href={SPOTIFY_URL}  target="_blank" rel="noopener noreferrer" className="saloon-chip">
                <SpotifyIcon /><span className="hidden sm:inline">Spotify</span>
              </a>
              <a href={YT_MUSIC_URL} target="_blank" rel="noopener noreferrer" className="saloon-chip">
                <YTMusicIcon /><span className="hidden sm:inline">YT Music</span>
              </a>
            </div>
          </nav>
        </header>

        {/* ── HERO TITLE ────────────────────────────────────────────── */}
        <div className="relative z-10 flex flex-col items-center px-6 pt-6 text-center sm:pt-10">
          <h1
            className="font-extrabold leading-[0.88]"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(4rem,16vw,9rem)",
              color: "var(--color-cream)",
              textShadow: "0 4px 32px rgba(4,10,22,0.85), 0 2px 8px rgba(0,0,0,0.6)",
            }}
          >
            <span className="block">डीलक्स</span>
            <span className="block">सैलून</span>
          </h1>
          <p className="mt-3 tracking-[0.42em] uppercase opacity-60"
            style={{ fontFamily: "var(--font-mono)", fontSize: "0.58rem", color: "var(--color-cream)" }}>
            Deluxe Salon Music&nbsp;·&nbsp;open all hours
          </p>
        </div>

        <div className="flex-1" />

        {/* Start prompt */}
        {!hasStarted && (
          <div className="relative z-20 mb-6 flex justify-center px-4">
            <button
              onClick={handleStart}
              disabled={!playerReady}
              className="saloon-glass mx-auto flex w-full max-w-md items-center gap-3 overflow-hidden rounded-2xl px-4 py-3 transition-all hover:border-[rgba(240,232,216,0.3)] disabled:opacity-40"
              style={{ color: "var(--color-cream)" }}
            >
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                style={{ background: "rgba(240,232,216,0.12)" }}>
                <PlayIcon size={20} />
              </span>
              <div className="min-w-0 flex-1 text-left">
                <p className="font-semibold text-sm" style={{ fontFamily: "var(--font-sans)" }}>
                  {playerReady ? "Start the Radio" : "Loading…"}
                </p>
                <p className="text-xs" style={{ color: "rgba(240,232,216,0.55)", fontFamily: "var(--font-sans)" }}>
                  90s Hindi film songs · round the clock
                </p>
              </div>
              <span className="shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold"
                style={{ background: "var(--color-cream)", color: "var(--color-shade)", fontFamily: "var(--font-sans)" }}>
                {playerReady ? "Play" : "…"}
              </span>
            </button>
          </div>
        )}

        <div className="h-[9rem] sm:h-[10rem]" />
      </div>

      {/* ── FIXED BOTTOM PLAYER + ROTATION BAR ─────────────────────────── */}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40">
        <div className="pointer-events-auto">
          <div className="mx-auto w-full max-w-2xl px-3"
            style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}>

            {/* Player card */}
            <div className="saloon-glass mb-2 flex items-center gap-2 rounded-2xl px-3 py-2.5 sm:gap-3 sm:px-4 sm:py-3">

              {/* Disc */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={thumbUrl} alt="" width={48} height={48}
                className={`h-11 w-11 shrink-0 rounded-full object-cover ${isPlaying ? "spinning" : ""}`}
                style={{ boxShadow: "0 0 0 2px rgba(240,232,216,0.15)" }}
                onError={(e) => { (e.target as HTMLImageElement).src = `https://i.ytimg.com/vi/${SONGS[0]}/hqdefault.jpg`; }}
              />

              {/* Track info */}
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-sm"
                  style={{ color: "var(--color-cream)", fontFamily: "var(--font-sans)" }}>
                  {nowPlaying}
                </p>
                <p className="truncate text-xs opacity-50"
                  style={{ color: "var(--color-cream)", fontFamily: "var(--font-sans)" }}>
                  Deluxe Salon Music radio
                </p>
                <div className="mt-1.5 flex items-center gap-2">
                  <input type="range" min={0} max={duration || 1} step={1} value={curTime}
                    onChange={handleSeek} aria-label="Seek"
                    className="saloon-range h-[3px] w-full"
                    style={{ "--progress": `${pct}%` } as React.CSSProperties} />
                  <span className="shrink-0 tabular-nums"
                    style={{ fontFamily: "var(--font-mono)", fontSize: "0.58rem", color: "rgba(240,232,216,0.45)" }}>
                    {fmt(curTime)}&nbsp;/&nbsp;{fmt(duration)}
                  </span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex shrink-0 items-center gap-0.5">
                <button type="button" onClick={handlePrev} aria-label="Previous" className="saloon-icon-btn">
                  <SkipBackIcon />
                </button>
                <button type="button"
                  onClick={hasStarted ? handleToggle : handleStart}
                  disabled={!playerReady}
                  aria-label={isPlaying ? "Pause" : "Play"}
                  className="saloon-play-btn">
                  {isPlaying ? <PauseIcon /> : <PlayIcon size={20} />}
                </button>
                <button type="button" onClick={handleNext} aria-label="Next" className="saloon-icon-btn">
                  <SkipFwdIcon />
                </button>
              </div>

              {/* Volume */}
              <div className="flex shrink-0 items-center gap-1">
                <button type="button" onClick={handleMute}
                  aria-label={isMuted ? "Unmute" : "Mute"} className="saloon-icon-btn">
                  {isMuted ? <VolumeOffIcon /> : <VolumeIcon />}
                </button>
                <input type="range" min={0} max={100} step={1} value={isMuted ? 0 : volume}
                  onChange={handleVolume} aria-label="Volume"
                  className="saloon-range hidden h-[3px] w-14 sm:block"
                  style={{ "--progress": `${isMuted ? 0 : volume}%` } as React.CSSProperties} />
              </div>
            </div>

            {/* Rotation bar */}
            <div className="flex items-center justify-center gap-1 pb-0.5 flex-wrap">
              {ROTATIONS.map((r, i) => (
                <button key={r.id} onClick={() => setActiveRot(i)}
                  className={`saloon-chip gap-1 py-1 ${activeRot === i ? "active" : ""}`}>
                  <span aria-hidden className="text-[11px]">{r.emoji}</span>
                  <span>{r.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

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
function SpotifyIcon() {
  return <svg width={14} height={14} viewBox="0 0 24 24" fill="currentColor" aria-hidden style={{ color:"#1ED760" }}><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.12-.899-.48-.12-.421.12-.78.479-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.362 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" /></svg>;
}
function YTMusicIcon() {
  return <svg width={14} height={14} viewBox="0 0 24 24" fill="currentColor" aria-hidden style={{ color:"#FF0033" }}><path d="M12 0C5.376 0 0 5.376 0 12s5.376 12 12 12 12-5.376 12-12S18.624 0 12 0zm0 19.104c-3.924 0-7.104-3.18-7.104-7.104S8.076 4.896 12 4.896s7.104 3.18 7.104 7.104-3.18 7.104-7.104 7.104zm0-13.332c-3.432 0-6.228 2.796-6.228 6.228S8.568 18.228 12 18.228s6.228-2.796 6.228-6.228S15.432 5.772 12 5.772zM9.684 15.54V8.46L15.816 12l-6.132 3.54z" /></svg>;
}
