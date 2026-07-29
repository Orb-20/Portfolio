"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { FiGithub, FiExternalLink } from "react-icons/fi";
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

            <div className="p-6">
              <p className="text-xs font-medium uppercase tracking-widest text-accent">
                {String(project.index + 1).padStart(2, "0")} /{" "}
                {String(projects.length).padStart(2, "0")}
              </p>
              <h3 className="mt-2 font-display text-2xl font-semibold text-text-primary">
                {project.title}
              </h3>
              <p className="mt-1 text-sm text-text-secondary">
                {project.subtitle}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {project.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-full border border-border bg-background px-3 py-1 text-xs text-text-secondary"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <p className="mt-4 text-sm leading-relaxed text-text-secondary">
                {project.description}
              </p>

              <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-text-secondary">
                {project.features.slice(0, 6).map((feature) => (
                  <li key={feature} className="before:mr-1 before:content-['·']">
                    {feature}
                  </li>
                ))}
              </ul>

              {(project.github || project.liveDemo) && (
                <div className="mt-6 flex gap-4">
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm font-medium text-text-primary"
                    >
                      <FiGithub /> GitHub
                    </a>
                  )}
                  {project.liveDemo && (
                    <a
                      href={project.liveDemo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm font-medium text-text-primary"
                    >
                      <FiExternalLink /> Live Demo
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
