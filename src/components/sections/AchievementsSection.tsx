"use client";

import { motion } from "framer-motion";
import { achievements } from "@/lib/achievements";

const EASE = [0.22, 1, 0.36, 1] as const;

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
};

export default function AchievementsSection() {
  return (
    <section
      id="achievements"
      className="relative w-full bg-background px-6 py-28 sm:px-10 lg:px-16"
    >
      <div className="mx-auto max-w-5xl">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5 }}
          className="font-display text-4xl font-semibold text-text-primary sm:text-5xl"
        >
          Achievements
        </motion.h2>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-3"
        >
          {achievements.map((achievement) => (
            <motion.div
              key={achievement.title}
              variants={cardVariants}
              className="rounded-2xl border border-border bg-surface p-6 transition-colors hover:border-accent/40"
            >
              <h3 className="font-display text-lg font-semibold text-text-primary">
                {achievement.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                {achievement.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
