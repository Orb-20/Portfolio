"use client";

import { motion } from "framer-motion";
import { skillCategories } from "@/lib/skills";

const EASE = [0.22, 1, 0.36, 1] as const;

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

export default function SkillsSection() {
  return (
    <section
      id="skills"
      className="relative w-full bg-background px-6 py-28 sm:px-10 lg:px-16"
    >
      <div className="mx-auto max-w-6xl">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5 }}
          className="font-display text-4xl font-semibold text-text-primary sm:text-5xl"
        >
          Skills
        </motion.h2>

        <div className="mt-14 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5">
          {skillCategories.map((category) => (
            <motion.div
              key={category.name}
              variants={containerVariants}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.3 }}
            >
              <h3 className="text-sm font-medium uppercase tracking-widest text-text-secondary">
                {category.name}
              </h3>
              <ul className="mt-4 flex flex-col gap-2">
                {category.skills.map((skill) => (
                  <motion.li
                    key={skill}
                    variants={cardVariants}
                    className="rounded-xl border border-border bg-surface px-4 py-3 text-sm text-text-primary transition-colors hover:border-accent/40"
                  >
                    {skill}
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
