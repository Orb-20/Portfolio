"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { Project } from "@/lib/projects";
import StudioOakBeat from "./visual-beats/StudioOakBeat";
import RateLimiterBeat from "./visual-beats/RateLimiterBeat";
import CreditRiskBeat from "./visual-beats/CreditRiskBeat";
import PhysioCheckBeat from "./visual-beats/PhysioCheckBeat";
import OrbeBeat from "./visual-beats/OrbeBeat";
import NgoConnectBeat from "./visual-beats/NgoConnectBeat";
import BinaryTreeBeat from "./visual-beats/BinaryTreeBeat";

const BEATS: Record<
  string,
  React.ComponentType<{ side?: "left" | "right" }>
> = {
  "studio-oak": StudioOakBeat,
  "rate-limiter": RateLimiterBeat,
  "credit-risk": CreditRiskBeat,
  physiocheck: PhysioCheckBeat,
  orbe: OrbeBeat,
  "ngo-connect": NgoConnectBeat,
  "binary-tree-visualizer": BinaryTreeBeat,
};

interface ProjectVisualBeatProps {
  project: Project | null;
}

export default function ProjectVisualBeat({ project }: ProjectVisualBeatProps) {
  const Beat = project ? BEATS[project.id] : null;

  return (
    <div className="pointer-events-none absolute inset-0 z-20">
      <AnimatePresence mode="wait">
        {project && Beat && (
          <motion.div
            key={project.id}
            className={`absolute inset-0 ${
              project.imageSide === "left" ? "text-left" : "text-right"
            }`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Beat side={project.imageSide} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
