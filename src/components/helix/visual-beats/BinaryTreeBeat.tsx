"use client";

import { motion } from "framer-motion";

const NODES = [
  { x: 40, y: 10 },
  { x: 20, y: 35 },
  { x: 60, y: 35 },
  { x: 10, y: 60 },
  { x: 30, y: 60 },
  { x: 50, y: 60 },
  { x: 70, y: 60 },
];

const EDGES: [number, number][] = [
  [0, 1],
  [0, 2],
  [1, 3],
  [1, 4],
  [2, 5],
  [2, 6],
];

export default function BinaryTreeBeat() {
  return (
    <div className="pointer-events-none absolute inset-0">
      <svg className="absolute left-[8%] top-[16%] h-56 w-56" viewBox="0 0 80 70">
        {EDGES.map(([a, b], i) => (
          <motion.line
            key={i}
            x1={NODES[a].x}
            y1={NODES[a].y}
            x2={NODES[b].x}
            y2={NODES[b].y}
            stroke="var(--text-secondary)"
            strokeWidth={1.5}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: 0.15 + i * 0.12 }}
          />
        ))}
        {NODES.map((n, i) => (
          <motion.circle
            key={i}
            cx={n.x}
            cy={n.y}
            r={4}
            fill="var(--surface)"
            stroke="var(--accent)"
            strokeWidth={1.5}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.35, delay: i * 0.12, type: "spring" }}
          />
        ))}
        <motion.circle
          r={2}
          fill="var(--accent)"
          initial={{ opacity: 0 }}
          animate={{
            cx: [40, 20, 10],
            cy: [10, 35, 60],
            opacity: [0, 1, 1, 0],
          }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 0.6, ease: "easeInOut" }}
        />
      </svg>
    </div>
  );
}
