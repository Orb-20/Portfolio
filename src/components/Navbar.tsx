"use client";

import { useEffect, useState } from "react";
import { useLenis } from "@/lib/lenis-context";
import { ScrollTrigger, registerGsap } from "@/lib/gsap";

const LINKS = [
  { href: "#work", label: "Work" },
  { href: "#skills", label: "Skills" },
  { href: "#experience", label: "Experience" },
  { href: "#github", label: "GitHub" },
  { href: "#contact", label: "Contact" },
];

export default function Navbar() {
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const lenis = useLenis();

  useEffect(() => {
    registerGsap();
    const trigger = ScrollTrigger.create({
      trigger: "#hero",
      start: "bottom top",
      onEnter: () => setVisible(true),
      onLeaveBack: () => setVisible(false),
    });
    return () => trigger.kill();
  }, []);

  useEffect(() => {
    registerGsap();
    let triggers: ReturnType<typeof ScrollTrigger.create>[] = [];

    // Deferred one frame: sections like #work mount async (mobile/desktop
    // helix variant is decided client-side after its own effect runs).
    const raf = requestAnimationFrame(() => {
      const sections = LINKS.map((l) =>
        document.querySelector(l.href)
      ).filter((el): el is Element => !!el);

      triggers = sections.map((el) =>
        ScrollTrigger.create({
          trigger: el,
          start: "top center",
          end: "bottom center",
          onEnter: () => setActive(`#${el.id}`),
          onEnterBack: () => setActive(`#${el.id}`),
        })
      );
    });

    return () => {
      cancelAnimationFrame(raf);
      triggers.forEach((t) => t.kill());
    };
  }, []);

  function handleClick(e: React.MouseEvent, href: string) {
    e.preventDefault();
    const el = document.querySelector(href);
    if (!el) return;
    if (lenis) {
      lenis.scrollTo(el as HTMLElement, { duration: 1.2 });
    } else {
      el.scrollIntoView({ behavior: "smooth" });
    }
  }

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-50 flex justify-center transition-opacity duration-500 ${
        visible ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <div className="mt-4 flex max-w-[92vw] items-center gap-4 overflow-x-auto rounded-full border border-border bg-surface/70 px-4 py-3 backdrop-blur-md sm:gap-8 sm:px-6">
        {LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            data-cursor-hover
            onClick={(e) => handleClick(e, link.href)}
            className={`whitespace-nowrap text-xs font-medium transition-colors sm:text-sm ${
              active === link.href
                ? "text-accent"
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            {link.label}
          </a>
        ))}
      </div>
    </nav>
  );
}
