"use client";

import { motion } from "framer-motion";

const STEPS = ["Raw Data", "Feature Eng.", "Model", "Prediction", "SHAP"];

export default function CreditRiskBeat() {
  return (
    <div className="pointer-events-none absolute inset-0">
      <div className="absolute left-[10%] top-[22%] flex items-center gap-2">
        {STEPS.map((step, i) => (
          <motion.div
            key={step}
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.15, duration: 0.4 }}
          >
            <span className="whitespace-nowrap rounded-full border border-border bg-surface/70 px-2 py-1 text-[10px] text-text-secondary">
              {step}
            </span>
            {i < STEPS.length - 1 && (
              <span className="text-text-secondary/50">→</span>
            )}
          </motion.div>
        ))}
      </div>

      <div className="absolute left-[12%] top-[42%] flex items-end gap-1.5">
        {[0.4, 0.65, 0.9, 0.5, 0.75].map((h, i) => (
          <motion.div
            key={i}
            className="w-2 rounded-t bg-text-primary/60"
            initial={{ height: 0 }}
            animate={{ height: `${h * 48}px` }}
            transition={{ delay: 0.3 + i * 0.08, duration: 0.5, ease: "easeOut" }}
          />
        ))}
      </div>

      <svg
        className="absolute left-[10%] top-[62%] h-16 w-16 -rotate-90"
        viewBox="0 0 36 36"
      >
        <path
          d="M18 2a16 16 0 1 1 0 32 16 16 0 1 1 0-32"
          fill="none"
          stroke="var(--border)"
          strokeWidth="3"
        />
        <motion.path
          d="M18 2a16 16 0 1 1 0 32 16 16 0 1 1 0-32"
          fill="none"
          stroke="var(--accent)"
          strokeWidth="3"
          strokeDasharray="100"
          initial={{ strokeDashoffset: 100 }}
          animate={{ strokeDashoffset: 28 }}
          transition={{ duration: 1.2, delay: 0.6, ease: "easeOut" }}
        />
      </svg>
    </div>
  );
}
