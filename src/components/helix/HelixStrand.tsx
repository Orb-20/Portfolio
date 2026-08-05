"use client";

import { useEffect, useMemo } from "react";
import * as THREE from "three";
import {
  HelixCurve,
  STRAND_A_PHASE,
  STRAND_B_PHASE,
  STRAND_B_SCALE,
  helixPoint,
} from "@/lib/helix";

interface HelixStrandProps {
  count: number;
  /** How far past the first and last project the strands run on. */
  overhang?: number;
}

/**
 * The two strands plus the rung bonding each project to its explanation.
 * These are what make the winding path legible — without them the planes read
 * as unrelated cards drifting past.
 */
export default function HelixStrand({ count, overhang = 0.85 }: HelixStrandProps) {
  const { tubeA, tubeB, rungs } = useMemo(() => {
    const from = -overhang;
    const to = count - 1 + overhang;
    const segments = Math.ceil((to - from) * 34);

    const a = new THREE.TubeGeometry(
      new HelixCurve(from, to, STRAND_A_PHASE, 1),
      segments,
      0.014,
      6,
      false
    );
    const b = new THREE.TubeGeometry(
      new HelixCurve(from, to, STRAND_B_PHASE, STRAND_B_SCALE),
      segments,
      0.009,
      6,
      false
    );

    // One rung per project: artifact node ↔ explanation node.
    const points: number[] = [];
    for (let i = 0; i < count; i++) {
      const pa = helixPoint(i, STRAND_A_PHASE, 1);
      const pb = helixPoint(i, STRAND_B_PHASE, STRAND_B_SCALE);
      points.push(pa.x, pa.y, pa.z, pb.x, pb.y, pb.z);
    }
    const rungGeo = new THREE.BufferGeometry();
    rungGeo.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(points, 3)
    );

    return { tubeA: a, tubeB: b, rungs: rungGeo };
  }, [count, overhang]);

  // Geometry built outside React's tree has to be released by hand.
  useEffect(
    () => () => {
      tubeA.dispose();
      tubeB.dispose();
      rungs.dispose();
    },
    [tubeA, tubeB, rungs]
  );

  return (
    <group>
      <mesh geometry={tubeA}>
        <meshBasicMaterial color="#d62839" transparent opacity={0.32} />
      </mesh>
      <mesh geometry={tubeB}>
        <meshBasicMaterial color="#3a0a10" transparent opacity={0.2} />
      </mesh>
      <lineSegments geometry={rungs}>
        <lineBasicMaterial color="#d62839" transparent opacity={0.22} />
      </lineSegments>
    </group>
  );
}
