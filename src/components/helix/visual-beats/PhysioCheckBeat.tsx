"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const JOINTS = [
  { x: 40, y: 10 },
  { x: 40, y: 30 },
  { x: 20, y: 45 },
  { x: 60, y: 45 },
  { x: 40, y: 60 },
  { x: 22, y: 85 },
  { x: 58, y: 85 },
];

const BONES: [number, number][] = [
  [0, 1],
  [1, 2],
  [1, 3],
  [1, 4],
  [4, 5],
  [4, 6],
];

interface PhysioCheckBeatProps {
  side?: "left" | "right";
}

export default function PhysioCheckBeat({ side = "left" }: PhysioCheckBeatProps) {
  const [reps, setReps] = useState(0);
  const [correct, setCorrect] = useState(true);
  const anchor = side === "left" ? { left: "10%" } : { right: "10%" };

  useEffect(() => {
    const interval = setInterval(() => {
      setReps((r) => r + 1);
      setCorrect((c) => !c || Math.random() > 0.3);
    }, 1400);
    return () => clearInterval(interval);
  }, []);

  const jointColor = correct ? "var(--accent-green)" : "var(--accent)";

  return (
    <div className="pointer-events-none absolute inset-0">
      <svg
        className="absolute top-[14%] h-40 w-20"
        style={anchor}
        viewBox="0 0 80 100"
      >
        {BONES.map(([a, b], i) => (
          <motion.line
            key={i}
            x1={JOINTS[a].x}
            y1={JOINTS[a].y}
            x2={JOINTS[b].x}
            y2={JOINTS[b].y}
            stroke="var(--text-secondary)"
            strokeWidth={2}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.6 }}
            transition={{ duration: 0.5, delay: i * 0.08 }}
          />
        ))}
        {JOINTS.map((j, i) => (
          <motion.circle
            key={i}
            cx={j.x}
            cy={j.y}
            r={3}
            fill={jointColor}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.3, delay: 0.4 + i * 0.05 }}
          />
        ))}
      </svg>

      <div className="absolute top-[62%] flex flex-col gap-1" style={anchor}>
        <span className="text-xs uppercase tracking-widest text-text-secondary">reps</span>
        <span className="font-display text-2xl text-text-primary">{reps}</span>
      </div>
    </div>
  );
}
