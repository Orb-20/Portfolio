"use client";

import { Canvas } from "@react-three/fiber";
import DissolveField from "./DissolveField";

interface DissolveCanvasProps {
  fromImage: string;
  toImage: string;
  width: number;
  height: number;
  progressRef: React.RefObject<{ value: number }>;
}

export default function DissolveCanvas(props: DissolveCanvasProps) {
  const { width, height } = props;

  return (
    <Canvas
      orthographic
      dpr={[1, 1.5]}
      gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
      camera={{
        left: -width / 2,
        right: width / 2,
        top: height / 2,
        bottom: -height / 2,
        near: 0.1,
        far: 1000,
        position: [0, 0, 100],
      }}
    >
      <DissolveField {...props} />
    </Canvas>
  );
}
