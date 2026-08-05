import * as THREE from "three";
import type { ProjectSide } from "@/lib/projects";

/**
 * The gallery is an elliptical double helix whose axis runs away from the
 * camera. One half-turn per project means every project lands exactly on an
 * ±x extreme, so consecutive projects alternate sides — the left/right rhythm
 * is a property of the curve rather than a layout rule applied on top of it.
 */
export const RX = 2.78;
export const RY = 1.22;
export const DEPTH = 4.6;

/**
 * Inverts the coil. With -1 the strand leaves the first project over the top
 * and drops under for the next; +1 is the mirror of that. Only the vertical
 * arc changes — the left/right landing of each project is unaffected.
 */
export const Y_FLIP = -1;

/** Strand A carries the artifact; strand B carries the explanation. */
export const STRAND_A_PHASE = Math.PI;
export const STRAND_B_PHASE = 0;
export const STRAND_B_SCALE = 0.8;

export function helixPoint(
  u: number,
  phase = STRAND_A_PHASE,
  scale = 1,
  target = new THREE.Vector3()
) {
  const a = Math.PI * u + phase;
  return target.set(
    RX * scale * Math.cos(a),
    Y_FLIP * RY * scale * Math.sin(a),
    -u * DEPTH
  );
}

/**
 * Which side of the frame a project's artifact lands on. Read off the curve
 * rather than stored on the project, so the copy and the geometry can never
 * disagree about where a card is.
 */
export function artifactSide(index: number): ProjectSide {
  return Math.cos(Math.PI * index + STRAND_A_PHASE) < 0 ? "left" : "right";
}

/** A sampled span of one strand, for building tube geometry. */
export class HelixCurve extends THREE.Curve<THREE.Vector3> {
  constructor(
    private readonly from: number,
    private readonly to: number,
    private readonly phase: number,
    private readonly scale: number
  ) {
    super();
  }

  getPoint(s: number, target = new THREE.Vector3()) {
    return helixPoint(
      this.from + s * (this.to - this.from),
      this.phase,
      this.scale,
      target
    );
  }
}
