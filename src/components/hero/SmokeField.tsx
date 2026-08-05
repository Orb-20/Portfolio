"use client";

import { useEffect, useRef } from "react";
import { mapRange } from "@/lib/scroll-progress";

type Layer = "back" | "front";

interface SmokeFieldProps {
  /** Raw 0..1 scroll progress of the pinned hero timeline. */
  progressRef: React.RefObject<{ value: number }>;
  /** "back" billows behind the wordmark, "front" wisps over the portrait. */
  layer?: Layer;
  className?: string;
}

interface Puff {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  growth: number;
  rotation: number;
  spin: number;
  life: number;
  maxLife: number;
  alpha: number;
  sprite: number;
  seed: number;
}

/** Blackish-red palette: soot core through to a dull ember edge. */
const SMOKE_RGB: Array<[number, number, number]> = [
  [16, 4, 7],
  [36, 8, 13],
  [62, 11, 18],
  [94, 17, 26],
];

const LAYER_CONFIG = {
  back: {
    count: 175,
    mobileCount: 78,
    radiusMin: 80,
    radiusMax: 190,
    growthMin: 14,
    growthMax: 30,
    lifeMin: 4.2,
    lifeMax: 7.4,
    alphaMin: 0.19,
    alphaMax: 0.4,
    riseMin: 22,
    riseMax: 52,
    drift: 78,
    blur: 5,
    opacity: 1,
    mask:
      "linear-gradient(to bottom, transparent 0%, #000 13%, #000 70%, transparent 94%)",
  },
  front: {
    count: 48,
    mobileCount: 20,
    radiusMin: 150,
    radiusMax: 320,
    growthMin: 26,
    growthMax: 52,
    lifeMin: 3.4,
    lifeMax: 5.6,
    alphaMin: 0.11,
    alphaMax: 0.22,
    riseMin: 34,
    riseMax: 74,
    drift: 130,
    blur: 8,
    opacity: 0.9,
    mask:
      "linear-gradient(to bottom, transparent 0%, #000 20%, #000 62%, transparent 88%)",
  },
};

const SPRITE_SIZE = 256;
const SPRITE_VARIANTS = 6;

function makeSpriteSheet(): HTMLCanvasElement[] {
  const sprites: HTMLCanvasElement[] = [];

  for (let s = 0; s < SPRITE_VARIANTS; s++) {
    const canvas = document.createElement("canvas");
    canvas.width = SPRITE_SIZE;
    canvas.height = SPRITE_SIZE;
    const ctx = canvas.getContext("2d");
    if (!ctx) continue;

    const [r, g, b] = SMOKE_RGB[s % SMOKE_RGB.length];
    const half = SPRITE_SIZE / 2;

    // A puff is a cluster of soft lobes, so the silhouette reads as billowing
    // vapour rather than a perfect circle.
    for (let i = 0; i < 11; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * half * 0.42;
      const x = half + Math.cos(angle) * dist;
      const y = half + Math.sin(angle) * dist * 0.85;
      const lobe = half * (0.3 + Math.random() * 0.34);

      const grad = ctx.createRadialGradient(x, y, 0, x, y, lobe);
      grad.addColorStop(0, `rgba(${r},${g},${b},0.3)`);
      grad.addColorStop(0.42, `rgba(${r},${g},${b},0.155)`);
      grad.addColorStop(0.74, `rgba(${r},${g},${b},0.05)`);
      grad.addColorStop(1, `rgba(${r},${g},${b},0)`);

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(x, y, lobe, 0, Math.PI * 2);
      ctx.fill();
    }

    // Feather the sprite border so nothing ever clips as a hard square.
    const mask = ctx.createRadialGradient(
      half,
      half,
      half * 0.42,
      half,
      half,
      half
    );
    mask.addColorStop(0, "rgba(0,0,0,1)");
    mask.addColorStop(1, "rgba(0,0,0,0)");
    ctx.globalCompositeOperation = "destination-in";
    ctx.fillStyle = mask;
    ctx.fillRect(0, 0, SPRITE_SIZE, SPRITE_SIZE);
    ctx.globalCompositeOperation = "source-over";

    sprites.push(canvas);
  }

  return sprites;
}

/** Cheap flow field — enough to sell curling vapour without a noise texture. */
function turbulence(
  x: number,
  y: number,
  t: number,
  out: { x: number; y: number }
) {
  out.x =
    Math.sin(y * 0.0072 + t * 0.42) +
    Math.sin(y * 0.019 - x * 0.004 - t * 0.27) * 0.45;
  out.y =
    Math.cos(x * 0.0081 - t * 0.33) * 0.6 +
    Math.cos(x * 0.017 + y * 0.006 + t * 0.19) * 0.28;
}

export default function SmokeField({
  progressRef,
  layer = "back",
  className = "",
}: SmokeFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const parent = canvas?.parentElement;
    if (!canvas || !parent) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    const config = LAYER_CONFIG[layer];
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const isMobile = window.matchMedia("(max-width: 767px)").matches;

    const sprites = makeSpriteSheet();
    const maxPuffs = isMobile ? config.mobileCount : config.count;
    const puffs: Puff[] = [];
    const flow = { x: 0, y: 0 };

    let width = 0;
    let height = 0;

    const resize = () => {
      const rect = parent.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1 : 1.35);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(parent);

    const rand = (min: number, max: number) => min + Math.random() * (max - min);

    /**
     * Puffs are born along the seam the wordmark tears open, so the plume
     * widens in step with DEVE / LOPER sliding apart.
     */
    const spawn = (spread: number, initialLife = 0) => {
      const lowHaze = Math.random() < 0.3;
      const side = Math.random() < 0.5 ? -1 : 1;
      const seamX =
        width / 2 + side * spread * width * 0.3 + rand(-0.1, 0.1) * width;

      const maxLife = rand(config.lifeMin, config.lifeMax);

      puffs.push({
        x: lowHaze ? rand(0, width) : seamX,
        y: lowHaze ? height * rand(0.66, 0.8) : height * rand(0.4, 0.56),
        vx: lowHaze
          ? rand(-0.25, 0.25) * config.drift
          : side * rand(0.35, 1) * config.drift,
        vy: -rand(config.riseMin, config.riseMax) * (lowHaze ? 0.7 : 1),
        radius: rand(config.radiusMin, config.radiusMax),
        growth: rand(config.growthMin, config.growthMax),
        rotation: Math.random() * Math.PI * 2,
        spin: rand(-0.16, 0.16),
        life: initialLife * maxLife,
        maxLife,
        alpha: rand(config.alphaMin, config.alphaMax),
        sprite: Math.floor(Math.random() * sprites.length),
        seed: Math.random() * 100,
      });
    };

    if (reduceMotion) {
      // Still frame: the plume exists, it simply never animates.
      for (let i = 0; i < Math.round(maxPuffs * 0.5); i++) {
        spawn(0.7, 0.2 + Math.random() * 0.4);
      }
    }

    const draw = (intensity: number) => {
      ctx.clearRect(0, 0, width, height);
      if (intensity <= 0.002) return;

      for (const p of puffs) {
        const t = p.life / p.maxLife;
        // Fade in fast, linger, then dissipate across the back half of life.
        const envelope =
          t < 0.14 ? t / 0.14 : 1 - mapRange(t, 0.42, 1, 0, 1) ** 1.6;
        const a = p.alpha * envelope * intensity;
        if (a <= 0.004) continue;

        ctx.save();
        ctx.globalAlpha = Math.min(1, a);
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.drawImage(
          sprites[p.sprite],
          -p.radius,
          -p.radius,
          p.radius * 2,
          p.radius * 2
        );
        ctx.restore();
      }
    };

    let raf = 0;
    let last = performance.now();

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);

      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      const progress = progressRef.current?.value ?? 0;
      // Smoke ignites as the wordmark starts to part, holds through the
      // introduction, then surges as the portrait blows apart.
      const intensity =
        mapRange(progress, 0.03, 0.3, 0, 1) *
        (1 + mapRange(progress, 0.72, 0.86, 0, 0.28));

      if (reduceMotion) {
        draw(intensity * 0.7);
        return;
      }

      if (intensity > 0.002) {
        const spread = mapRange(progress, 0.02, 0.55, 0, 1);
        const target = Math.round(maxPuffs * (0.35 + intensity * 0.65));
        const budget = Math.min(3, target - puffs.length);
        for (let i = 0; i < budget; i++) spawn(spread);
      }

      const time = now / 1000;
      for (let i = puffs.length - 1; i >= 0; i--) {
        const p = puffs[i];
        p.life += dt;
        if (p.life >= p.maxLife || p.y < -p.radius * 1.4) {
          puffs.splice(i, 1);
          continue;
        }

        turbulence(p.x, p.y, time + p.seed, flow);
        p.x += (p.vx + flow.x * config.drift * 0.32) * dt;
        p.y += (p.vy + flow.y * config.drift * 0.14) * dt;
        p.vx *= 1 - 0.35 * dt;
        p.vy *= 1 - 0.22 * dt;
        p.radius += p.growth * dt;
        p.rotation += p.spin * dt;
      }

      draw(intensity);
    };

    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, [layer, progressRef]);

  const config = LAYER_CONFIG[layer];

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
      style={{
        mixBlendMode: "multiply",
        filter: `blur(${config.blur}px)`,
        opacity: config.opacity,
        maskImage: config.mask,
        WebkitMaskImage: config.mask,
      }}
    />
  );
}
