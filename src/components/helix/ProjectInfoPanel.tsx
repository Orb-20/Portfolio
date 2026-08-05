"use client";

import { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { animate } from "animejs";
import { FiGithub, FiArrowUpRight } from "react-icons/fi";
import { projects, type Project } from "@/lib/projects";
import { artifactSide } from "@/lib/helix";

interface ProjectInfoPanelProps {
  project: Project | null;
}

const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Rolls from the project you just left to the one now in focus. Lives in its
 * own component so the anime.js call runs on the mount of the incoming panel —
 * AnimatePresence holds that mount back until the outgoing one has left.
 */
function ProjectCounter({
  index,
  previousRef,
}: {
  index: number;
  previousRef: React.RefObject<number | null>;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    const from = previousRef.current;
    previousRef.current = index;
    if (!el || from === null || from === index) return;

    const counter = { value: from + 1 };
    const roll = animate(counter, {
      value: index + 1,
      duration: 560,
      ease: "outExpo",
      onUpdate: () => {
        el.textContent = pad(Math.round(counter.value));
      },
    });

    return () => {
      roll.pause();
    };
  }, [index, previousRef]);

  return <span ref={ref}>{pad(index + 1)}</span>;
}

const EASE = [0.22, 1, 0.36, 1] as const;

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.055, delayChildren: 0.04 } },
};

const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

const linkClass =
  "flex items-center gap-2 border-b border-transparent pb-0.5 font-mono text-xs uppercase tracking-[0.16em] text-text-primary transition-colors hover:border-accent hover:text-accent focus-visible:border-accent focus-visible:text-accent focus-visible:outline-none";

export default function ProjectInfoPanel({ project }: ProjectInfoPanelProps) {
  const previousIndexRef = useRef<number | null>(null);
  const side = project ? artifactSide(project.index) : "left";
  // The rule always faces the artifact — it reads as the bond between the
  // two strands rather than as a decorative border.
  const bond =
    side === "left"
      ? "ml-auto border-l pl-6 sm:pl-8"
      : "mr-auto border-r pr-6 sm:pr-8";

  // Fades from the page ground at the panel's outer edge to nothing at the
  // artifact, so the copy sits on a clean field without a card around it.
  const scrim =
    side === "left" ? "right-0 bg-gradient-to-l" : "left-0 bg-gradient-to-r";

  return (
    <div className="pointer-events-none absolute inset-0 z-30">
      <AnimatePresence mode="wait">
        {project && (
          <motion.div
            key={project.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.32, ease: EASE }}
            className="absolute inset-0 flex items-center px-6 sm:px-10 lg:px-16"
          >
            <div
              aria-hidden
              className={`pointer-events-none absolute inset-y-0 w-[52%] from-background via-background/88 to-transparent ${scrim}`}
            />

            <motion.article
              initial="hidden"
              animate="show"
              variants={container}
              className={`pointer-events-auto relative w-full max-w-md border-accent/35 py-1 ${bond}`}
            >
              <motion.p
                variants={item}
                className="font-mono text-[0.68rem] tracking-[0.24em] text-accent"
              >
                <ProjectCounter
                  index={project.index}
                  previousRef={previousIndexRef}
                />
                <span className="text-text-secondary/50">
                  {" "}
                  / {pad(projects.length)}
                </span>
              </motion.p>

              <motion.h3
                variants={item}
                className="mt-4 font-display text-[2rem] font-semibold leading-[1.05] tracking-[-0.03em] text-text-primary sm:text-[2.5rem]"
              >
                {project.title}
              </motion.h3>

              <motion.p
                variants={item}
                className="mt-2 text-sm text-text-secondary sm:text-base"
              >
                {project.subtitle}
              </motion.p>

              <motion.p
                variants={item}
                className="mt-5 max-w-[42ch] text-sm leading-relaxed text-text-primary/75"
              >
                {project.description}
              </motion.p>

              <motion.div variants={item} className="mt-6">
                <p className="font-mono text-[0.6rem] uppercase tracking-[0.24em] text-text-secondary/70">
                  Stack
                </p>
                <p className="mt-2 font-mono text-xs leading-relaxed text-text-primary/85">
                  {project.techStack.join("  ·  ")}
                </p>
              </motion.div>

              <motion.div variants={item} className="mt-5">
                <p className="font-mono text-[0.6rem] uppercase tracking-[0.24em] text-text-secondary/70">
                  Features
                </p>
                <ul className="mt-2 grid grid-cols-2 gap-x-5 gap-y-1 font-mono text-xs text-text-secondary">
                  {project.features.slice(0, 6).map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
              </motion.div>

              {(project.github || project.liveDemo) && (
                <motion.div variants={item} className="mt-7 flex gap-6">
                  {project.github && (
                    <a
                      href={project.github}
                      data-cursor-hover
                      target="_blank"
                      rel="noopener noreferrer"
                      className={linkClass}
                    >
                      <FiGithub aria-hidden /> Source
                    </a>
                  )}
                  {project.liveDemo && (
                    <a
                      href={project.liveDemo}
                      data-cursor-hover
                      target="_blank"
                      rel="noopener noreferrer"
                      className={linkClass}
                    >
                      <FiArrowUpRight aria-hidden /> Live
                    </a>
                  )}
                </motion.div>
              )}
            </motion.article>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
