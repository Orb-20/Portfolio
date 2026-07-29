"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface RateLimiterBeatProps {
  side?: "left" | "right";
}

export default function RateLimiterBeat({ side = "left" }: RateLimiterBeatProps) {
  const [count, setCount] = useState(0);
  const [exceeded, setExceeded] = useState(false);
  const anchor = side === "left" ? { left: "12%" } : { right: "12%" };
  const anchorBar = side === "left" ? { left: "14%" } : { right: "14%" };

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((c) => {
        const next = c + Math.floor(Math.random() * 9) + 1;
        if (next > 480) {
          setExceeded(true);
          setTimeout(() => setExceeded(false), 350);
          return 0;
        }
        return next;
      });
    }, 220);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0">
      <div className="absolute top-[20%] flex flex-col gap-1" style={anchor}>
        <span className="text-xs uppercase tracking-widest text-text-secondary">
          requests/s
        </span>
        <span className="font-display text-2xl text-text-primary">{count}</span>
      </div>

      <motion.div
        className="absolute top-[42%] h-24 w-10 overflow-hidden rounded-full border border-border bg-surface/70"
        style={anchorBar}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        <motion.div
          className="absolute bottom-0 w-full bg-text-primary/70"
          animate={{ height: [`${count % 100}%`, `${(count + 40) % 100}%`] }}
          transition={{ duration: 1.2, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        />
      </motion.div>

      {exceeded && (
        <motion.span
          className="absolute top-[72%] rounded-md bg-accent px-2 py-1 text-xs font-medium text-surface"
          style={anchor}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
        >
          rate limit exceeded
        </motion.span>
      )}
    </div>
  );
}
