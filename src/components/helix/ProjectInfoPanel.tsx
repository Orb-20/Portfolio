"use client";

import { AnimatePresence, motion } from "framer-motion";
import { FiGithub, FiExternalLink } from "react-icons/fi";
import { projects, type Project } from "@/lib/projects";

interface ProjectInfoPanelProps {
  project: Project | null;
}

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.09, delayChildren: 0.05 },
  },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export default function ProjectInfoPanel({ project }: ProjectInfoPanelProps) {
  return (
    <div className="pointer-events-none absolute inset-0 z-30 flex items-center px-6 sm:px-10 lg:px-16">
      <AnimatePresence mode="wait">
        {project && (
          <motion.div
            key={project.id}
            initial="hidden"
            animate="show"
            exit="hidden"
            variants={container}
            className={`pointer-events-auto w-full max-w-md rounded-2xl border border-border bg-surface/90 p-6 backdrop-blur-md sm:p-8 ${
              project.imageSide === "left" ? "ml-auto" : "mr-auto"
            }`}
          >
            <motion.p
              variants={item}
              className="text-xs font-medium uppercase tracking-widest text-accent"
            >
              {String(project.index + 1).padStart(2, "0")} /{" "}
              {String(projects.length).padStart(2, "0")}
            </motion.p>
            <motion.h3
              variants={item}
              className="mt-3 font-display text-3xl font-semibold text-text-primary sm:text-4xl"
            >
              {project.title}
            </motion.h3>
            <motion.p
              variants={item}
              className="mt-2 text-sm text-text-secondary sm:text-base"
            >
              {project.subtitle}
            </motion.p>

            <motion.div variants={item} className="mt-4 flex flex-wrap gap-2">
              {project.techStack.map((tech) => (
                <span
                  key={tech}
                  className="rounded-full border border-border bg-background px-3 py-1 text-xs text-text-secondary"
                >
                  {tech}
                </span>
              ))}
            </motion.div>

            <motion.p
              variants={item}
              className="mt-4 text-sm leading-relaxed text-text-secondary"
            >
              {project.description}
            </motion.p>

            <motion.ul
              variants={item}
              className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-text-secondary"
            >
              {project.features.slice(0, 6).map((feature) => (
                <li key={feature} className="before:mr-1 before:content-['·']">
                  {feature}
                </li>
              ))}
            </motion.ul>

            {(project.github || project.liveDemo) && (
              <motion.div variants={item} className="mt-6 flex gap-4">
                {project.github && (
                  <a
                    href={project.github}
                    data-cursor-hover
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm font-medium text-text-primary hover:text-accent"
                  >
                    <FiGithub /> GitHub
                  </a>
                )}
                {project.liveDemo && (
                  <a
                    href={project.liveDemo}
                    data-cursor-hover
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm font-medium text-text-primary hover:text-accent"
                  >
                    <FiExternalLink /> Live Demo
                  </a>
                )}
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
