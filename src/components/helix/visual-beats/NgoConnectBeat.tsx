"use client";

import { motion } from "framer-motion";

interface NgoConnectBeatProps {
  side?: "left" | "right";
}

const AVATAR_OFFSETS = [
  { top: "8%", inline: "6%" },
  { top: "70%", inline: "8%" },
  { top: "20%", inline: "70%" },
  { top: "78%", inline: "60%" },
];

const CENTER_INLINE = "38%";

export default function NgoConnectBeat({ side = "left" }: NgoConnectBeatProps) {
  const inlineKey = side === "left" ? "left" : "right";

  return (
    <div className="pointer-events-none absolute inset-0">
      <div
        className="absolute top-[45%] h-3 w-3 rounded-full border border-accent"
        style={{ [inlineKey]: CENTER_INLINE }}
      />
      {AVATAR_OFFSETS.map((a, i) => (
        <motion.div
          key={i}
          className="absolute h-6 w-6 rounded-full border border-border bg-surface/80"
          style={{ top: a.top, [inlineKey]: a.inline }}
          animate={{ top: "45%", [inlineKey]: CENTER_INLINE, opacity: [1, 1, 0] }}
          transition={{
            duration: 2.8,
            repeat: Infinity,
            delay: i * 0.7,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
