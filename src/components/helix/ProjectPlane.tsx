"use client";

import { forwardRef, useImperativeHandle, useRef } from "react";
import * as THREE from "three";
import { useTexture } from "@react-three/drei";
import type { Project } from "@/lib/projects";

export interface ProjectPlaneHandle {
  updateVisual: (distance: number, angleStep: number) => void;
}

interface ProjectPlaneProps {
  project: Project;
  angle: number;
  radius: number;
}

const PLANE_WIDTH = 3.4;
const PLANE_HEIGHT = 2.15;

const ProjectPlane = forwardRef<ProjectPlaneHandle, ProjectPlaneProps>(
  ({ project, angle, radius }, ref) => {
    const meshRef = useRef<THREE.Mesh>(null);
    const materialRef = useRef<THREE.MeshBasicMaterial>(null);
    const overlayMatRef = useRef<THREE.MeshBasicMaterial>(null);

    const texture = useTexture(project.image);

    const x = radius * Math.sin(angle);
    const z = radius * Math.cos(angle);

    useImperativeHandle(ref, () => ({
      updateVisual(distance: number, angleStep: number) {
        const t = THREE.MathUtils.clamp(distance / angleStep, 0, 1);
        const scale = THREE.MathUtils.lerp(1, 0.75, t);
        const opacity = THREE.MathUtils.lerp(1, 0.28, t);
        const overlayOpacity = THREE.MathUtils.lerp(0, 0.55, t);
        const lift = THREE.MathUtils.lerp(0.3, 0, t);

        if (meshRef.current) {
          meshRef.current.scale.setScalar(scale);
          meshRef.current.position.z = lift;
        }
        if (materialRef.current) {
          materialRef.current.opacity = opacity;
        }
        if (overlayMatRef.current) {
          overlayMatRef.current.opacity = overlayOpacity;
        }
      },
    }));

    return (
      <group position={[x, 0, z]} rotation={[0, angle, 0]}>
        <mesh ref={meshRef}>
          <planeGeometry args={[PLANE_WIDTH, PLANE_HEIGHT]} />
          <meshBasicMaterial
            ref={materialRef}
            map={texture}
            transparent
            toneMapped={false}
          />
        </mesh>
        <mesh position={[0, 0, 0.02]}>
          <planeGeometry args={[PLANE_WIDTH, PLANE_HEIGHT]} />
          <meshBasicMaterial
            ref={overlayMatRef}
            color="#F8F7F3"
            transparent
            opacity={0}
            depthWrite={false}
          />
        </mesh>
      </group>
    );
  }
);

ProjectPlane.displayName = "ProjectPlane";
export default ProjectPlane;
