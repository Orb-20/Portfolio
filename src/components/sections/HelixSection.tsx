"use client";

import { useIsMobile } from "@/lib/use-is-mobile";
import HelixDesktop from "@/components/sections/HelixDesktop";
import HelixMobileCarousel from "@/components/sections/HelixMobileCarousel";

export default function HelixSection() {
  const isMobile = useIsMobile();

  if (isMobile === null) return null;
  return isMobile ? <HelixMobileCarousel /> : <HelixDesktop />;
}
