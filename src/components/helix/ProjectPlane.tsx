"use client";

import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef } from "react";
import * as THREE from "three";
import { useTexture } from "@react-three/drei";
import type { Project } from "@/lib/projects";
import { STRAND_A_PHASE, helixPoint } from "@/lib/helix";
import { createDefocusMaterial } from "@/lib/plane-blur";

export interface ProjectPlaneHandle {
  /** `u` is signed distance from focus, in project units. */
  updateVisual: (u: number, time: number, bob: number) => void;
}

interface ProjectPlaneProps {
  project: Project;
  index: number;
}

const PLANE_WIDTH = 3.5;
const PLANE_HEIGHT = 2.2;
const FRAME_INSET = 0.035;

/** Defocus radius in UV units once a card is a full step off focus. */
const MAX_BLUR = 0.03;
/** Cards stay sharp inside this window so the focused one is never soft. */
const SHARP_WINDOW = 0.14;

const { clamp, lerp, smoothstep } = THREE.MathUtils;

const ProjectPlane = forwardRef<ProjectPlaneHandle, ProjectPlaneProps>(
  ({ project, index }, ref) => {
    const groupRef = useRef<THREE.Group>(null);
    const frameMatRef = useRef<THREE.MeshBasicMaterial>(null);

    const texture = useTexture(project.image);

    const { material, uniforms } = useMemo(
      () => createDefocusMaterial(PLANE_WIDTH / PLANE_HEIGHT),
      []
    );

    useEffect(() => {
      // Without this the map is treated as linear and re-encoded on output,
      // which washes the screenshots out.
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.needsUpdate = true;
      material.map = texture;
      material.needsUpdate = true;
    }, [material, texture]);

    useEffect(() => () => material.dispose(), [material]);

    // Sits marginally in front of the strand so the card reads as threaded
    // onto it rather than z-fighting with it.
    const base = useMemo(() => helixPoint(index, STRAND_A_PHASE, 1), [index]);
    const sideSign = base.x < 0 ? -1 : 1;

    useImperativeHandle(ref, () => ({
      updateVisual(u, time, bob) {
        const au = Math.abs(u);
        const behind = clamp(u / 2.4, 0, 1);
        const passed = clamp(-u, 0, 1);

        const scale = lerp(1, 0.78, behind) * lerp(1, 1.12, passed);
        const opacity = lerp(1, 0.42, behind) * (1 - passed);

        // Everything but the project in focus falls out of focus optically,
        // which is what keeps the explanation readable over it.
        uniforms.uBlur.value = smoothstep(SHARP_WINDOW, 1, au) * MAX_BLUR;

        material.opacity = opacity;

        if (groupRef.current) {
          groupRef.current.scale.setScalar(scale);
          // Turns its inner edge toward the viewer while approaching, then
          // settles flat on at focus.
          groupRef.current.rotation.y = clamp(u, -1.5, 1.5) * 0.3 * -sideSign;
          groupRef.current.position.y =
            base.y + Math.sin(time * 0.6 + index) * 0.035 * bob;
          groupRef.current.visible = opacity > 0.01;
        }
        if (frameMatRef.current) {
          frameMatRef.current.opacity = lerp(0.85, 0, clamp(au * 1.5, 0, 1));
        }
      },
    }));

    return (
      <group ref={groupRef} position={[base.x, base.y, base.z + 0.09]}>
        {/* Hairline crimson frame, drawn as a slightly larger plate behind.
            It sharpens up only on the focused card. */}
        <mesh position={[0, 0, -0.008]}>
          <planeGeometry
            args={[PLANE_WIDTH + FRAME_INSET, PLANE_HEIGHT + FRAME_INSET]}
          />
          <meshBasicMaterial
            ref={frameMatRef}
            color="#d62839"
            transparent
            opacity={0.85}
          />
        </mesh>

        <mesh material={material}>
          <planeGeometry args={[PLANE_WIDTH, PLANE_HEIGHT]} />
        </mesh>
      </group>
    );
  }
);

ProjectPlane.displayName = "ProjectPlane";
export default ProjectPlane;
