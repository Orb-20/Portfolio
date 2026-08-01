"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap, registerGsap } from "@/lib/gsap";
import { mapRange } from "@/lib/scroll-progress";
import HeroBackground from "@/components/hero/HeroBackground";
import DissolveCanvas from "@/components/intro/DissolveCanvas";

const PHOTO_WIDTH = 260;
const PHOTO_HEIGHT = 340;

export default function IntroSequence() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const heroWordWrapRef = useRef<HTMLDivElement>(null);
  const deveRef = useRef<HTMLSpanElement>(null);
  const loperRef = useRef<HTMLSpanElement>(null);
  const photoWrapRef = useRef<HTMLDivElement>(null);
  const photoImgRef = useRef<HTMLImageElement>(null);
  const canvasWrapRef = useRef<HTMLDivElement>(null);
  const introWrapRef = useRef<HTMLDivElement>(null);
  const introLine1Ref = useRef<HTMLParagraphElement>(null);
  const introLine2Ref = useRef<HTMLParagraphElement>(null);
  const introLine3Ref = useRef<HTMLParagraphElement>(null);

  const dissolveProgressRef = useRef({ value: 0 });

  useEffect(() => {
    registerGsap();

    const ctx = gsap.context(() => {
      gsap.set(photoWrapRef.current, { opacity: 0, scale: 0.85 });
      gsap.set(canvasWrapRef.current, { opacity: 0 });
      gsap.set(
        [introLine1Ref.current, introLine2Ref.current, introLine3Ref.current],
        { opacity: 0, y: 24 }
      );

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
          pin: pinRef.current,
          onUpdate: (self) => {
            dissolveProgressRef.current.value = mapRange(
              self.progress,
              0.62,
              1,
              0,
              1
            );
          },
        },
      });

      tl.to(deveRef.current, { xPercent: -70, ease: "none" }, 0)
        .to(loperRef.current, { xPercent: 70, ease: "none" }, 0)
        .to(
          photoWrapRef.current,
          { opacity: 1, scale: 1, ease: "none" },
          0.06
        )
        .to(heroWordWrapRef.current, { opacity: 0, ease: "none" }, 0.2)
        .to(
          introLine1Ref.current,
          { opacity: 1, y: 0, ease: "none" },
          0.32
        )
        .to(
          introLine2Ref.current,
          { opacity: 1, y: 0, ease: "none" },
          0.4
        )
        .to(
          introLine3Ref.current,
          { opacity: 1, y: 0, ease: "none" },
          0.48
        )
        .to(introWrapRef.current, { opacity: 0, ease: "none" }, 0.6)
        .to(photoWrapRef.current, { xPercent: -18, ease: "none" }, 0.62)
        .to(photoImgRef.current, { opacity: 0, ease: "none" }, 0.62)
        .to(canvasWrapRef.current, { opacity: 1, ease: "none" }, 0.62);
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="hero"
      ref={containerRef}
      className="relative h-[400vh] w-full bg-background"
    >
      <div
        ref={pinRef}
        className="relative h-screen w-full overflow-hidden bg-background"
      >
        <HeroBackground />

        <div
          ref={heroWordWrapRef}
          className="absolute inset-0 z-10 flex items-center justify-center"
        >
          <h1
            className="inline-flex select-none whitespace-nowrap font-display font-semibold leading-none tracking-tight text-text-primary"
            style={{ fontSize: "clamp(3.5rem, 13vw, 11rem)" }}
          >
            <span ref={deveRef}>DEVE</span>
            <span ref={loperRef}>LOPER</span>
          </h1>
        </div>

        <div
          ref={photoWrapRef}
          className="absolute left-1/2 z-20 overflow-hidden rounded-2xl border border-border shadow-xl"
          style={{
            top: "40%",
            width: PHOTO_WIDTH,
            height: PHOTO_HEIGHT,
            marginLeft: -PHOTO_WIDTH / 2,
            marginTop: -PHOTO_HEIGHT / 2,
          }}
        >
          <Image
            ref={photoImgRef}
            src="/images/hero-p1.png"
            alt="Portrait of Om"
            fill
            sizes={`${PHOTO_WIDTH}px`}
            priority
            className="object-cover"
          />
          <div ref={canvasWrapRef} className="absolute inset-0">
            <DissolveCanvas
              fromImage="/images/hero-p1.png"
              toImage="/images/hero-p2.png"
              width={PHOTO_WIDTH}
              height={PHOTO_HEIGHT}
              progressRef={dissolveProgressRef}
            />
          </div>
        </div>

        <div
          ref={introWrapRef}
          className="absolute left-1/2 z-30 flex w-full max-w-xl flex-col items-center gap-4 px-6 text-center"
          style={{ top: "78%", transform: "translate(-50%, -50%)" }}
        >
          <p
            ref={introLine1Ref}
            className="font-display text-3xl text-text-primary sm:text-4xl"
          >
            Hi, I&apos;m Om.
          </p>
          <p
            ref={introLine2Ref}
            className="font-display text-2xl text-text-secondary sm:text-3xl"
          >
            Backend Engineer.
          </p>
          <p
            ref={introLine3Ref}
            className="max-w-lg text-base text-text-secondary sm:text-lg"
          >
            I build reliable, scalable backend systems — APIs, distributed
            infrastructure, and the occasional ML pipeline — with an eye for
            clean architecture.
          </p>
        </div>
      </div>
    </section>
  );
}
