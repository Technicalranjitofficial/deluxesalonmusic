"use client";

import { useEffect, useRef, useCallback, useImperativeHandle, forwardRef } from "react";

interface AudioCtxWindow extends Window {
  webkitAudioContext?: typeof AudioContext;
  AudioContext: typeof AudioContext;
}

export interface RainEngineHandle {
  start: () => void;
  stop: () => void;
}

const RainEngine = forwardRef<RainEngineHandle>(function RainEngine(_props, ref) {
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const flashRef     = useRef<HTMLDivElement>(null);
  const animRef      = useRef<number | null>(null);
  const lightningRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const audioCtxRef  = useRef<AudioContext | null>(null);
  const rainGainRef  = useRef<GainNode | null>(null);
  const activeRef    = useRef(false);

  /* ── Audio ────────────────────────────────────────────────────────── */
  const initAudio = useCallback(() => {
    if (audioCtxRef.current) return;
    try {
      const AC =
        (window as AudioCtxWindow).AudioContext ||
        (window as AudioCtxWindow).webkitAudioContext;
      if (!AC) return;
      const ctx = new AC();
      audioCtxRef.current = ctx;

      const sr  = ctx.sampleRate;
      const buf = ctx.createBuffer(1, sr * 2, sr);
      const out = buf.getChannelData(0);
      let last  = 0;
      for (let i = 0; i < sr * 2; i++) {
        const w = Math.random() * 2 - 1;
        out[i]  = (last + 0.02 * w) / 1.02;
        last    = out[i];
        out[i] *= 2.8;
      }
      const src = ctx.createBufferSource();
      src.buffer = buf;
      src.loop   = true;

      const lp = ctx.createBiquadFilter();
      lp.type  = "lowpass";
      lp.frequency.value = 1000;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.001, ctx.currentTime);
      rainGainRef.current = gain;

      src.connect(lp);
      lp.connect(gain);
      gain.connect(ctx.destination);
      src.start(0);
    } catch { /* ignore */ }
  }, []);

  const playThunder = useCallback(() => {
    const ctx = audioCtxRef.current;
    if (!ctx) return;
    try {
      if (ctx.state === "suspended") ctx.resume();
      const now = ctx.currentTime;

      const osc     = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(80, now);
      osc.frequency.exponentialRampToValueAtTime(25, now + 2.5);
      const lp = ctx.createBiquadFilter();
      lp.type  = "lowpass";
      lp.frequency.setValueAtTime(160, now);
      lp.frequency.linearRampToValueAtTime(60, now + 2.5);
      oscGain.gain.setValueAtTime(0.01, now);
      oscGain.gain.linearRampToValueAtTime(0.22, now + 0.1);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 3.0);
      osc.connect(lp); lp.connect(oscGain); oscGain.connect(ctx.destination);
      osc.start(now); osc.stop(now + 3.2);

      const crackBuf = ctx.createBuffer(1, ctx.sampleRate * 2.2, ctx.sampleRate);
      const cd = crackBuf.getChannelData(0);
      for (let i = 0; i < cd.length; i++) {
        cd[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.6));
      }
      const crackSrc = ctx.createBufferSource();
      crackSrc.buffer = crackBuf;
      const bp = ctx.createBiquadFilter();
      bp.type  = "bandpass";
      bp.frequency.setValueAtTime(320, now);
      bp.Q.value = 1.8;
      const cg = ctx.createGain();
      cg.gain.setValueAtTime(0.18, now);
      cg.gain.exponentialRampToValueAtTime(0.001, now + 2.2);
      crackSrc.connect(bp); bp.connect(cg); cg.connect(ctx.destination);
      crackSrc.start(now + 0.05);
    } catch { /* ignore */ }
  }, []);

  /* ── Canvas animation ─────────────────────────────────────────────── */
  const runAnimation = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = (canvas.width  = window.innerWidth);
    let h = (canvas.height = window.innerHeight);
    const onResize = () => {
      w = canvas.width  = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize);

    interface Drop {
      x: number; y: number; z: number;
      speed: number; len: number; wind: number;
      alpha: number; thick: number;
    }
    interface Splash {
      x: number; y: number; vx: number; vy: number;
      gravity: number; life: number; decay: number; radius: number;
    }

    const mkDrop = (randomY: boolean): Drop => {
      const z = Math.random() * 0.8 + 0.2;
      return {
        x:     Math.random() * (w + 200) - 100,
        y:     randomY ? Math.random() * h : -20 - Math.random() * 50,
        z,     speed: (18 + Math.random() * 10) * z,
        len:   (15 + Math.random() * 15) * z,
        wind:  -2.5 * z,
        alpha: 0.2 + z * 0.45,
        thick: 0.8 + z * 1.1,
      };
    };

    const splashes: Splash[] = [];
    const drops: Drop[] = Array.from({ length: Math.min(300, Math.floor(w * 0.25)) }, () => mkDrop(true));

    const drawBolt = (sx: number, sy: number, ex: number, ey: number) => {
      ctx.save();
      ctx.strokeStyle = "rgba(240,248,255,0.95)";
      ctx.lineWidth = 3.5;
      ctx.shadowColor = "rgba(147,197,253,1)";
      ctx.shadowBlur = 18;
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      const steps = 14 + Math.floor(Math.random() * 8);
      for (let i = 0; i < steps; i++) {
        const t  = (i + 1) / steps;
        const tx = sx + (ex - sx) * t + (Math.random() - 0.5) * 70;
        const ty = sy + (ey - sy) * t;
        ctx.lineTo(tx, ty);
        if (Math.random() < 0.4 && i < steps - 2) {
          ctx.moveTo(tx, ty);
          ctx.lineTo(tx + (Math.random() - 0.5) * 90, ty + 30 + Math.random() * 40);
          ctx.moveTo(tx, ty);
        }
      }
      ctx.stroke();
      ctx.restore();
    };

    const triggerLightning = () => {
      if (!activeRef.current) return;
      const flash = flashRef.current;
      if (!flash) return;
      const intensity = 0.65 + Math.random() * 0.35;
      flash.style.opacity = String(intensity);
      const bx = Math.random() * w * 0.8 + w * 0.1;
      drawBolt(bx, 0, bx + (Math.random() - 0.5) * 200, h * 0.7);
      setTimeout(() => {
        flash.style.opacity = "0.15";
        setTimeout(() => {
          flash.style.opacity = String(intensity * 0.8);
          setTimeout(() => { flash.style.opacity = "0"; }, 60);
        }, 45);
      }, 50);
      playThunder();
      lightningRef.current = setTimeout(triggerLightning, 5000 + Math.random() * 9000);
    };

    const animate = () => {
      ctx.clearRect(0, 0, w, h);
      for (const d of drops) {
        d.x += d.wind; d.y += d.speed;
        if (d.y > h - 30) {
          if (Math.random() < 0.35 && splashes.length < 120) {
            splashes.push({
              x: d.x, y: h - 10,
              vx: (Math.random() - 0.5) * 4 * d.z,
              vy: -(1.5 + Math.random() * 3) * d.z,
              gravity: 0.25, life: 1,
              decay: 0.08 + Math.random() * 0.06,
              radius: (1.2 + Math.random() * 1.5) * d.z,
            });
          }
          Object.assign(d, mkDrop(false));
        }
        ctx.beginPath();
        ctx.moveTo(d.x, d.y);
        ctx.lineTo(d.x + d.wind * 1.5, d.y + d.len);
        ctx.strokeStyle = `rgba(180,215,255,${d.alpha})`;
        ctx.lineWidth   = d.thick;
        ctx.stroke();
      }
      for (let i = splashes.length - 1; i >= 0; i--) {
        const s = splashes[i];
        s.x += s.vx; s.y += s.vy; s.vy += s.gravity; s.life -= s.decay;
        if (s.life <= 0) { splashes.splice(i, 1); continue; }
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(195,225,255,${s.life * 0.5})`;
        ctx.fill();
      }
      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);
    lightningRef.current = setTimeout(triggerLightning, 800);

    return () => window.removeEventListener("resize", onResize);
  }, [playThunder]);

  /* ── Public API via ref ───────────────────────────────────────────── */
  const start = useCallback(() => {
    activeRef.current = true;
    initAudio();
    const audioCtx = audioCtxRef.current;
    if (audioCtx?.state === "suspended") audioCtx.resume();
    const gain = rainGainRef.current;
    if (gain && audioCtx) {
      gain.gain.cancelScheduledValues(audioCtx.currentTime);
      gain.gain.setValueAtTime(gain.gain.value, audioCtx.currentTime);
      gain.gain.linearRampToValueAtTime(0.12, audioCtx.currentTime + 1.2);
    }
    canvasRef.current?.classList.add("active");
    runAnimation();
  }, [initAudio, runAnimation]);

  const stop = useCallback(() => {
    activeRef.current = false;
    if (animRef.current !== null) { cancelAnimationFrame(animRef.current); animRef.current = null; }
    if (lightningRef.current)     { clearTimeout(lightningRef.current); lightningRef.current = null; }
    const canvas = canvasRef.current;
    const flash  = flashRef.current;
    if (canvas) {
      canvas.classList.remove("active");
      canvas.getContext("2d")?.clearRect(0, 0, canvas.width, canvas.height);
    }
    if (flash) flash.style.opacity = "0";
    const audioCtx = audioCtxRef.current;
    const gain     = rainGainRef.current;
    if (gain && audioCtx) {
      gain.gain.cancelScheduledValues(audioCtx.currentTime);
      gain.gain.setValueAtTime(gain.gain.value, audioCtx.currentTime);
      gain.gain.linearRampToValueAtTime(0.0001, audioCtx.currentTime + 0.8);
    }
  }, []);

  useImperativeHandle(ref, () => ({ start, stop }), [start, stop]);

  useEffect(() => () => stop(), [stop]);

  return (
    <>
      <canvas ref={canvasRef} id="rainCanvas" />
      <div    ref={flashRef}  id="lightningFlashOverlay" />
    </>
  );
});

export default RainEngine;
