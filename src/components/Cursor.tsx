"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function Cursor() {
  const dotX = useMotionValue(-100);
  const dotY = useMotionValue(-100);
  const ringX = useMotionValue(-100);
  const ringY = useMotionValue(-100);

  const ringSpringX = useSpring(ringX, { stiffness: 300, damping: 30, mass: 0.5 });
  const ringSpringY = useSpring(ringY, { stiffness: 300, damping: 30, mass: 0.5 });

  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    const isFinePointer = window.matchMedia("(pointer: fine)").matches;
    if (!isFinePointer) return;

    let magneticTarget: HTMLElement | null = null;

    function handleMove(e: MouseEvent) {
      dotX.set(e.clientX);
      dotY.set(e.clientY);

      if (magneticTarget) {
        const rect = magneticTarget.getBoundingClientRect();
        ringX.set(rect.left + rect.width / 2);
        ringY.set(rect.top + rect.height / 2);
      } else {
        ringX.set(e.clientX);
        ringY.set(e.clientY);
      }
    }

    function handleOver(e: MouseEvent) {
      const target = (e.target as HTMLElement).closest?.<HTMLElement>(
        "[data-cursor-hover]"
      );
      if (target) {
        magneticTarget = target;
        setHovering(true);
      }
    }

    function handleOut(e: MouseEvent) {
      const target = (e.target as HTMLElement).closest?.<HTMLElement>(
        "[data-cursor-hover]"
      );
      if (target) {
        magneticTarget = null;
        setHovering(false);
      }
    }

    window.addEventListener("mousemove", handleMove);
    window.addEventListener("mouseover", handleOver);
    window.addEventListener("mouseout", handleOut);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseover", handleOver);
      window.removeEventListener("mouseout", handleOut);
    };
  }, [dotX, dotY, ringX, ringY]);

  return (
    <>
      <motion.div
        className="cursor-fine-only pointer-events-none fixed left-0 top-0 z-[100] h-1.5 w-1.5 rounded-full bg-text-primary"
        style={{ x: dotX, y: dotY, translateX: "-50%", translateY: "-50%" }}
      />
      <motion.div
        className="cursor-fine-only pointer-events-none fixed left-0 top-0 z-[100] rounded-full border"
        style={{
          x: ringSpringX,
          y: ringSpringY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          width: hovering ? 56 : 32,
          height: hovering ? 56 : 32,
          borderColor: hovering ? "#D62839" : "rgba(17,17,17,0.35)",
        }}
        transition={{ duration: 0.25, ease: "easeOut" }}
      />
    </>
  );
}
