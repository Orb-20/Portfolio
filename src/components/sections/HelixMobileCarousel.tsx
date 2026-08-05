"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { FiGithub, FiArrowUpRight } from "react-icons/fi";
import { projects } from "@/lib/projects";
import ProjectVisualBeat from "@/components/helix/ProjectVisualBeat";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function HelixMobileCarousel() {
  return (
    <section id="work" className="relative w-full bg-background px-5 py-20">
      <motion.h2
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.5 }}
        className="font-display text-3xl font-semibold text-text-primary"
      >
        Work
      </motion.h2>

      <div className="mt-10 flex flex-col gap-16">
        {projects.map((project) => (
          <motion.article
            key={project.id}
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="overflow-hidden rounded-2xl border border-border bg-surface"
          >
            <div className="relative aspect-[4/3] w-full">
              <Image
                src={project.image}
                alt={project.title}
                fill
                sizes="100vw"
                className="object-cover"
              />
              <ProjectVisualBeat project={project} />
            </div>

            <div className="border-l border-accent/35 p-6 pl-5">
              <p className="font-mono text-[0.68rem] tracking-[0.24em] text-accent">
                {String(project.index + 1).padStart(2, "0")}
                <span className="text-text-secondary/50">
                  {" "}
                  / {String(projects.length).padStart(2, "0")}
                </span>
              </p>
              <h3 className="mt-3 font-display text-2xl font-semibold leading-[1.05] tracking-[-0.03em] text-text-primary">
                {project.title}
              </h3>
              <p className="mt-1 text-sm text-text-secondary">
                {project.subtitle}
              </p>

              <p className="mt-4 text-sm leading-relaxed text-text-secondary">
                {project.description}
              </p>

              <p className="mt-5 font-mono text-[0.6rem] uppercase tracking-[0.24em] text-text-secondary/60">
                Stack
              </p>
              <p className="mt-2 font-mono text-xs leading-relaxed text-text-primary/80">
                {project.techStack.join("  ·  ")}
              </p>

              <p className="mt-4 font-mono text-[0.6rem] uppercase tracking-[0.24em] text-text-secondary/60">
                Features
              </p>
              <ul className="mt-2 grid grid-cols-2 gap-x-5 gap-y-1 font-mono text-xs text-text-secondary">
                {project.features.slice(0, 6).map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>

              {(project.github || project.liveDemo) && (
                <div className="mt-6 flex gap-6">
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-text-primary"
                    >
                      <FiGithub aria-hidden /> Source
                    </a>
                  )}
                  {project.liveDemo && (
                    <a
                      href={project.liveDemo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.16em] text-text-primary"
                    >
                      <FiArrowUpRight aria-hidden /> Live
                    </a>
                  )}
                </div>
              )}
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
