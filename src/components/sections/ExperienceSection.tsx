"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { experience } from "@/lib/experience";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function ExperienceSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 0.75", "end 0.4"],
  });
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section
      id="experience"
      ref={sectionRef}
      className="relative w-full bg-background px-6 py-28 sm:px-10 lg:px-16"
    >
      <div className="mx-auto max-w-3xl">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5 }}
          className="font-display text-4xl font-semibold text-text-primary sm:text-5xl"
        >
          Experience
        </motion.h2>

        <div className="relative mt-16 pl-8">
          <div className="absolute left-0 top-0 h-full w-px bg-border" />
          <motion.div
            className="absolute left-0 top-0 w-px origin-top bg-accent"
            style={{ scaleY: lineScale, height: "100%" }}
          />

          <ul className="flex flex-col gap-14">
            {experience.map((entry) => (
              <motion.li
                key={`${entry.role}-${entry.organization}`}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.5, ease: EASE }}
                className="relative"
              >
                <span className="absolute -left-[35px] top-1.5 h-2.5 w-2.5 rounded-full border-2 border-accent bg-background" />
                <p className="text-xs uppercase tracking-widest text-text-secondary">
                  {entry.period}
                </p>
                <h3 className="mt-1 font-display text-xl font-semibold text-text-primary">
                  {entry.role}
                </h3>
                <p className="text-sm text-text-secondary">{entry.organization}</p>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                  {entry.description}
                </p>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
