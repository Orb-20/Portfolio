"use client";

import { Canvas } from "@react-three/fiber";
import DissolveField from "./DissolveField";

interface DissolveCanvasProps {
  fromImage: string;
  toImage: string;
  /** Sampling grid — the size the portrait is reconstructed at. */
  width: number;
  height: number;
  /** Visible canvas box. Larger than the portrait so debris can fly clear of it. */
  viewWidth?: number;
  viewHeight?: number;
  progressRef: React.RefObject<{ value: number }>;
}

export default function DissolveCanvas({
  viewWidth,
  viewHeight,
  ...props
}: DissolveCanvasProps) {
  const vw = viewWidth ?? props.width;
  const vh = viewHeight ?? props.height;

  return (
    <Canvas
      orthographic
      dpr={[1, 1.5]}
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
      camera={{
        left: -vw / 2,
        right: vw / 2,
        top: vh / 2,
        bottom: -vh / 2,
        near: 0.1,
        far: 2000,
        // Pulled well back so particles scattered toward the viewer stay
        // inside the frustum instead of popping out of existence.
        position: [0, 0, 600],
      }}
    >
      <DissolveField {...props} />
    </Canvas>
  );
}
