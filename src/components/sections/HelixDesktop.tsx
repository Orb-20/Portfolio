"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { animate, stagger } from "animejs";
import { ScrollTrigger, registerGsap } from "@/lib/gsap";
import { projects } from "@/lib/projects";
import HelixScene from "@/components/helix/HelixScene";
import ProjectInfoPanel from "@/components/helix/ProjectInfoPanel";
import ProjectVisualBeat from "@/components/helix/ProjectVisualBeat";

const LEAD_IN = 0.35;
const LEAD_OUT = 0.35;
const SPAN = projects.length - 1 + LEAD_IN + LEAD_OUT;

export default function HelixDesktop() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const railFillRef = useRef<HTMLSpanElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const positionRef = useRef({ value: -LEAD_IN });
  const reduceMotionRef = useRef(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    registerGsap();
    reduceMotionRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: "bottom bottom",
      scrub: 1,
      pin: pinRef.current,
      onUpdate: (self) => {
        positionRef.current.value = -LEAD_IN + self.progress * SPAN;
        // Written straight to the DOM — a per-frame React update here would
        // re-render the whole gallery.
        if (railFillRef.current) {
          railFillRef.current.style.transform = `scaleX(${self.progress})`;
        }
      },
    });

    return () => trigger.kill();
  }, []);

  // anime.js owns the discrete, event-driven flourishes here — GSAP stays on
  // scroll-scrubbed timelines and Framer on mount/unmount transitions, so the
  // three never animate the same property.
  useEffect(() => {
    if (activeIndex === null || reduceMotionRef.current) return;
    const ticks =
      railRef.current?.querySelectorAll<HTMLElement>("[data-tick]");
    if (!ticks?.length) return;

    const ripple = animate(ticks, {
      scaleY: [
        { to: 2.8, duration: 190, ease: "outQuad" },
        { to: 1, duration: 620, ease: "outElastic(1, .5)" },
      ],
      delay: stagger(40, { from: activeIndex }),
    });

    return () => {
      ripple.pause();
    };
  }, [activeIndex]);

  const activeProject = activeIndex !== null ? projects[activeIndex] : null;

  return (
    <section
      id="work"
      ref={containerRef}
      className="relative w-full bg-background"
      style={{ height: `${projects.length * 100}vh` }}
    >
      <div
        ref={pinRef}
        className="relative h-screen w-full overflow-hidden bg-background"
      >
        <Canvas
          dpr={[1, 1.75]}
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
          camera={{ position: [0, 0, 6.8], fov: 42 }}
        >
          {/* Fog does the depth falloff, so distant cards and strands dissolve
              into the page ground instead of stacking up as clutter. */}
          <fog attach="fog" args={["#f8f7f3", 7, 30]} />
          <Suspense fallback={null}>
            <HelixScene
              projects={projects}
              positionRef={positionRef}
              onActiveChange={setActiveIndex}
              reduceMotionRef={reduceMotionRef}
            />
          </Suspense>
        </Canvas>

        <ProjectVisualBeat project={activeProject} />
        <ProjectInfoPanel project={activeProject} />

        {/* Position along the strand. The section runs 700vh, so this is
            orientation, not ornament. */}
        <div className="pointer-events-none absolute bottom-10 left-1/2 z-30 w-[min(34rem,62vw)] -translate-x-1/2">
          <div ref={railRef} className="relative h-px w-full bg-border">
            <span
              ref={railFillRef}
              className="absolute inset-0 origin-left bg-accent"
              style={{ transform: "scaleX(0)" }}
            />
            {projects.map((project, i) => (
              <span
                key={project.id}
                data-tick
                className={`absolute h-1.5 w-px transition-colors duration-300 ${
                  activeIndex === i ? "bg-accent" : "bg-border"
                }`}
                // Centred without a transform, so anime.js has sole ownership
                // of this element's `transform` for the ripple.
                style={{
                  left: `${(i / (projects.length - 1)) * 100}%`,
                  top: "calc(50% - 3px)",
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
