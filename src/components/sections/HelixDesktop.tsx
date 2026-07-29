"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { ScrollTrigger, registerGsap } from "@/lib/gsap";
import { projects } from "@/lib/projects";
import HelixScene from "@/components/helix/HelixScene";
import ProjectInfoPanel from "@/components/helix/ProjectInfoPanel";
import ProjectVisualBeat from "@/components/helix/ProjectVisualBeat";

const RADIUS = 4.4;
const TOTAL_ROTATION =
  ((projects.length - 1) * (Math.PI * 2)) / projects.length;

export default function HelixDesktop() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const rotationRef = useRef({ value: 0 });
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    registerGsap();

    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: "top top",
      end: "bottom bottom",
      scrub: 1,
      pin: pinRef.current,
      onUpdate: (self) => {
        rotationRef.current.value = self.progress * TOTAL_ROTATION;
      },
    });

    return () => trigger.kill();
  }, []);

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
          gl={{ antialias: true, powerPreference: "high-performance" }}
          camera={{ position: [0, 0, RADIUS + 3.2], fov: 42 }}
        >
          <Suspense fallback={null}>
            <HelixScene
              projects={projects}
              rotationRef={rotationRef}
              radius={RADIUS}
              onActiveChange={setActiveIndex}
            />
          </Suspense>
        </Canvas>

        <ProjectVisualBeat project={activeProject} />
        <ProjectInfoPanel project={activeProject} />
      </div>
    </section>
  );
}
