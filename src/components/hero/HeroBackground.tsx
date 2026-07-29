"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

const PARTICLES = [
  { top: "18%", left: "12%", size: 6, delay: 0 },
  { top: "70%", left: "9%", size: 4, delay: 1.2 },
  { top: "28%", left: "86%", size: 5, delay: 0.6 },
  { top: "80%", left: "78%", size: 8, delay: 2 },
  { top: "50%", left: "92%", size: 3, delay: 1.6 },
  { top: "12%", left: "55%", size: 4, delay: 0.9 },
  { top: "62%", left: "45%", size: 3, delay: 2.4 },
];

export default function HeroBackground() {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const springX = useSpring(mx, { stiffness: 40, damping: 15 });
  const springY = useSpring(my, { stiffness: 40, damping: 15 });

  const gridX = useTransform(springX, (v) => v * 0.5);
  const gridY = useTransform(springY, (v) => v * 0.5);
  const particleX = useTransform(springX, (v) => v * 1.3);
  const particleY = useTransform(springY, (v) => v * 1.3);

  useEffect(() => {
    function handleMove(e: MouseEvent) {
      const nx = e.clientX / window.innerWidth - 0.5;
      const ny = e.clientY / window.innerHeight - 0.5;
      mx.set(nx * 24);
      my.set(ny * 24);
    }
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, [mx, my]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      <motion.div
        className="absolute -inset-[10%] opacity-40"
        style={{
          x: gridX,
          y: gridY,
          backgroundImage:
            "linear-gradient(to right, rgba(17,17,17,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(17,17,17,0.06) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />
      <motion.div
        className="absolute inset-0"
        style={{ x: particleX, y: particleY }}
      >
        {PARTICLES.map((p, i) => (
          <span
            key={i}
            className="absolute animate-float rounded-full bg-text-secondary/25 blur-[1px]"
            style={{
              top: p.top,
              left: p.left,
              width: p.size,
              height: p.size,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}
      </motion.div>
    </div>
  );
}
