"use client";

import { useEffect, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { loadImage, sampleImageToPoints, scatterPositions } from "@/lib/particles";

const STEP = 4;

interface DissolveFieldProps {
  fromImage: string;
  toImage: string;
  width: number;
  height: number;
  progressRef: React.RefObject<{ value: number }>;
}

interface DissolveData {
  from: Float32Array;
  to: Float32Array;
  scatter: Float32Array;
  fromColor: Float32Array;
  toColor: Float32Array;
  count: number;
}

export default function DissolveField({
  fromImage,
  toImage,
  width,
  height,
  progressRef,
}: DissolveFieldProps) {
  const pointsRef = useRef<THREE.Points>(null);
  const dataRef = useRef<DissolveData | null>(null);
  const [geometry, setGeometry] = useState<THREE.BufferGeometry | null>(null);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const [fromImg, toImg] = await Promise.all([
        loadImage(fromImage),
        loadImage(toImage),
      ]);
      if (cancelled) return;

      const fromSample = sampleImageToPoints(fromImg, width, height, STEP);
      const toSample = sampleImageToPoints(toImg, width, height, STEP);
      const scatter = scatterPositions(fromSample.count, {
        x: width * 2.2,
        y: height * 2.2,
        z: 420,
      });

      dataRef.current = {
        from: fromSample.positions,
        to: toSample.positions,
        scatter,
        fromColor: fromSample.colors,
        toColor: toSample.colors,
        count: fromSample.count,
      };

      const geo = new THREE.BufferGeometry();
      geo.setAttribute(
        "position",
        new THREE.BufferAttribute(new Float32Array(fromSample.positions), 3)
      );
      geo.setAttribute(
        "color",
        new THREE.BufferAttribute(new Float32Array(fromSample.colors), 3)
      );
      if (!cancelled) setGeometry(geo);
    })();

    return () => {
      cancelled = true;
    };
  }, [fromImage, toImage, width, height]);

  useFrame(() => {
    const data = dataRef.current;
    const geo = pointsRef.current?.geometry;
    if (!data || !geo) return;

    const t = progressRef.current.value;
    const posAttr = geo.getAttribute("position") as THREE.BufferAttribute;
    const colorAttr = geo.getAttribute("color") as THREE.BufferAttribute;
    const { from, to, scatter, fromColor, toColor, count } = data;

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;

      if (t <= 0.5) {
        const local = t / 0.5;
        posAttr.setXYZ(
          i,
          THREE.MathUtils.lerp(from[i3], scatter[i3], local),
          THREE.MathUtils.lerp(from[i3 + 1], scatter[i3 + 1], local),
          THREE.MathUtils.lerp(from[i3 + 2], scatter[i3 + 2], local)
        );
      } else {
        const local = (t - 0.5) / 0.5;
        posAttr.setXYZ(
          i,
          THREE.MathUtils.lerp(scatter[i3], to[i3], local),
          THREE.MathUtils.lerp(scatter[i3 + 1], to[i3 + 1], local),
          THREE.MathUtils.lerp(scatter[i3 + 2], to[i3 + 2], local)
        );
        colorAttr.setXYZ(
          i,
          THREE.MathUtils.lerp(fromColor[i3], toColor[i3], local),
          THREE.MathUtils.lerp(fromColor[i3 + 1], toColor[i3 + 1], local),
          THREE.MathUtils.lerp(fromColor[i3 + 2], toColor[i3 + 2], local)
        );
      }
    }

    posAttr.needsUpdate = true;
    colorAttr.needsUpdate = true;
  });

  if (!geometry) return null;

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        size={2.4}
        vertexColors
        transparent
        opacity={0.92}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}
