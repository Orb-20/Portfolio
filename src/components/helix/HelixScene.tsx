"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { Project } from "@/lib/projects";
import { DEPTH } from "@/lib/helix";
import ProjectPlane, { type ProjectPlaneHandle } from "./ProjectPlane";
import HelixStrand from "./HelixStrand";

/** How close to an integer position a project must be to claim the panel. */
const FOCUS_THRESHOLD = 0.42;

interface HelixSceneProps {
  projects: Project[];
  /** Position along the strand, in project units. */
  positionRef: React.RefObject<{ value: number }>;
  onActiveChange: (index: number | null) => void;
  reduceMotionRef: React.RefObject<boolean>;
}

export default function HelixScene({
  projects,
  positionRef,
  onActiveChange,
  reduceMotionRef,
}: HelixSceneProps) {
  const groupRef = useRef<THREE.Group>(null);
  const planeRefs = useRef<(ProjectPlaneHandle | null)[]>([]);
  const lastActiveRef = useRef<number | null>(-1 as number | null);

  useFrame((state) => {
    if (!groupRef.current) return;

    const t = positionRef.current.value;
    // Nothing rotates — the viewer travels along the axis, which is what
    // carries each project forward onto its own side of the frame.
    groupRef.current.position.z = t * DEPTH;

    const time = state.clock.elapsedTime;
    const bob = reduceMotionRef.current ? 0 : 1;
    for (let i = 0; i < projects.length; i++) {
      planeRefs.current[i]?.updateVisual(i - t, time, bob);
    }

    const nearest = Math.round(t);
    const nextActive =
      nearest >= 0 &&
      nearest < projects.length &&
      Math.abs(t - nearest) < FOCUS_THRESHOLD
        ? nearest
        : null;

    if (nextActive !== lastActiveRef.current) {
      lastActiveRef.current = nextActive;
      onActiveChange(nextActive);
    }
  });

  return (
    <group ref={groupRef}>
      <HelixStrand count={projects.length} />
      {projects.map((project, i) => (
        <ProjectPlane
          key={project.id}
          ref={(el) => {
            planeRefs.current[i] = el;
          }}
          project={project}
          index={i}
        />
      ))}
    </group>
  );
}
