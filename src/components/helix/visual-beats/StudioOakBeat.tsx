"use client";

import { motion } from "framer-motion";

const ICONS = [
  { top: "18%", left: "14%", delay: 0, size: 22 },
  { top: "62%", left: "8%", delay: 0.6, size: 16 },
  { top: "78%", left: "22%", delay: 1.1, size: 20 },
];

export default function StudioOakBeat() {
  return (
    <div className="pointer-events-none absolute inset-0">
      {ICONS.map((icon, i) => (
        <motion.div
          key={i}
          className="absolute rounded-md border border-border bg-surface/70"
          style={{ top: icon.top, left: icon.left, width: icon.size, height: icon.size }}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 0.8, y: [-6, 6, -6] }}
          transition={{
            opacity: { duration: 0.6, delay: icon.delay },
            y: { duration: 5, repeat: Infinity, ease: "easeInOut", delay: icon.delay },
          }}
        />
      ))}

      <motion.div
        className="absolute bottom-[16%] left-[10%] h-2 w-28 overflow-hidden rounded-full border border-border bg-surface/70"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.4 }}
      >
        <motion.div
          className="h-full bg-accent/70"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 2.4, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        />
      </motion.div>
    </div>
  );
}
