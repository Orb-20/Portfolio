"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { FiGithub, FiLinkedin, FiMail, FiFileText } from "react-icons/fi";
import { CONTACT } from "@/lib/contact";

export default function ContactSection() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  function handleSubmit() {
    if (!name.trim() || !email.trim() || !message.trim()) {
      setError("Please fill in all fields.");
      return;
    }
    setError(null);
    const subject = encodeURIComponent(`Portfolio inquiry from ${name}`);
    const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
    window.location.href = `mailto:${CONTACT.email}?subject=${subject}&body=${body}`;
    setSent(true);
  }

  return (
    <section
      id="contact"
      className="relative w-full bg-background px-6 py-32 sm:px-10 lg:px-16"
    >
      <div className="mx-auto flex max-w-3xl flex-col items-center text-center">
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5 }}
          className="font-display text-4xl font-semibold text-text-primary sm:text-6xl"
        >
          Let&apos;s talk.
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-4 max-w-md text-text-secondary"
        >
          Have a project in mind or just want to say hi? My inbox is open.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-6"
        >
          <a
            href={`mailto:${CONTACT.email}`}
            data-cursor-hover
            className="flex items-center gap-2 text-sm text-text-secondary hover:text-accent"
          >
            <FiMail /> {CONTACT.email}
          </a>
          <a
            href={CONTACT.linkedin}
            data-cursor-hover
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-text-secondary hover:text-accent"
          >
            <FiLinkedin /> LinkedIn
          </a>
          <a
            href={CONTACT.github}
            data-cursor-hover
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-text-secondary hover:text-accent"
          >
            <FiGithub /> GitHub
          </a>
          <a
            href={CONTACT.resume}
            data-cursor-hover
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-text-secondary hover:text-accent"
          >
            <FiFileText /> Resume
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-14 flex w-full flex-col gap-4 text-left"
        >
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="rounded-xl border border-border bg-surface px-4 py-3 text-sm text-text-primary outline-none focus:border-accent"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email"
            className="rounded-xl border border-border bg-surface px-4 py-3 text-sm text-text-primary outline-none focus:border-accent"
          />
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="What's on your mind?"
            rows={4}
            className="resize-none rounded-xl border border-border bg-surface px-4 py-3 text-sm text-text-primary outline-none focus:border-accent"
          />

          {error && <p className="text-xs text-accent">{error}</p>}

          <button
            type="button"
            data-cursor-hover
            onClick={handleSubmit}
            className="mt-2 self-start rounded-full bg-text-primary px-6 py-3 text-sm font-medium text-background transition-colors hover:bg-accent"
          >
            {sent ? "Opening your email client…" : "Send message"}
          </button>
        </motion.div>
      </div>
    </section>
  );
}
