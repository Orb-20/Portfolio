"use client";

import { motion } from "framer-motion";

const NODES = [
  { x: 40, y: 15 },
  { x: 15, y: 45 },
  { x: 65, y: 40 },
  { x: 30, y: 80 },
  { x: 60, y: 78 },
];

const EDGES: [number, number][] = [
  [0, 1],
  [0, 2],
  [1, 3],
  [2, 4],
  [1, 2],
  [3, 4],
];

export default function OrbeBeat() {
  return (
    <div className="pointer-events-none absolute inset-0">
      <svg className="absolute left-[10%] top-[16%] h-56 w-56" viewBox="0 0 80 100">
        {EDGES.map(([a, b], i) => (
          <motion.line
            key={i}
            x1={NODES[a].x}
            y1={NODES[a].y}
            x2={NODES[b].x}
            y2={NODES[b].y}
            stroke="var(--text-secondary)"
            strokeWidth={1}
            initial={{ opacity: 0.15 }}
            animate={{ opacity: [0.15, 0.6, 0.15] }}
            transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.3, ease: "easeInOut" }}
          />
        ))}
        {NODES.map((n, i) => (
          <motion.circle
            key={i}
            cx={n.x}
            cy={n.y}
            r={3.5}
            fill="var(--accent)"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
          />
        ))}
      </svg>
    </div>
  );
}
