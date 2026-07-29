"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import type { Project } from "@/lib/projects";
import ProjectPlane, { type ProjectPlaneHandle } from "./ProjectPlane";

const TWO_PI = Math.PI * 2;
const VISIBLE_THRESHOLD = 0.4;

function normalizeAngle(a: number) {
  let r = a % TWO_PI;
  if (r > Math.PI) r -= TWO_PI;
  if (r < -Math.PI) r += TWO_PI;
  return r;
}

interface HelixSceneProps {
  projects: Project[];
  rotationRef: React.RefObject<{ value: number }>;
  radius: number;
  onActiveChange: (index: number | null) => void;
}

export default function HelixScene({
  projects,
  rotationRef,
  radius,
  onActiveChange,
}: HelixSceneProps) {
  const groupRef = useRef<THREE.Group>(null);
  const planeRefs = useRef<(ProjectPlaneHandle | null)[]>([]);
  const lastActiveRef = useRef<number | null>(-1 as number | null);
  const angleStep = TWO_PI / projects.length;

  useFrame(() => {
    if (!groupRef.current) return;
    const rotY = rotationRef.current.value;
    groupRef.current.rotation.y = rotY;

    let minDist = Infinity;
    let minIndex = 0;

    for (let i = 0; i < projects.length; i++) {
      const worldAngle = normalizeAngle(projects[i].index * angleStep + rotY);
      const dist = Math.abs(worldAngle);
      if (dist < minDist) {
        minDist = dist;
        minIndex = i;
      }
      planeRefs.current[i]?.updateVisual(dist, angleStep);
    }

    const t = minDist / angleStep;
    const nextActive = t < VISIBLE_THRESHOLD ? minIndex : null;

    if (nextActive !== lastActiveRef.current) {
      lastActiveRef.current = nextActive;
      onActiveChange(nextActive);
    }
  });

  return (
    <group ref={groupRef}>
      {projects.map((project, i) => (
        <ProjectPlane
          key={project.id}
          ref={(el) => {
            planeRefs.current[i] = el;
          }}
          project={project}
          angle={project.index * angleStep}
          radius={radius}
        />
      ))}
    </group>
  );
}
