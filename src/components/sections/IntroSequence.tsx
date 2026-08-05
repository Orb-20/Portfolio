"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger, SplitText, registerGsap } from "@/lib/gsap";
import { mapRange } from "@/lib/scroll-progress";
import HeroBackground from "@/components/hero/HeroBackground";
import SmokeField from "@/components/hero/SmokeField";
import DissolveCanvas from "@/components/intro/DissolveCanvas";

const PHOTO_WIDTH = 260;
const PHOTO_HEIGHT = 340;

// The debris field needs far more room than the portrait itself.
const BLAST_WIDTH = 720;
const BLAST_HEIGHT = 820;

/** Scroll progress at which the intro is fully settled and the blast begins. */
const BLAST_START = 0.74;

export default function IntroSequence() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const heroWordWrapRef = useRef<HTMLDivElement>(null);
  const deveRef = useRef<HTMLSpanElement>(null);
  const loperRef = useRef<HTMLSpanElement>(null);
  const photoWrapRef = useRef<HTMLDivElement>(null);
  const blastWrapRef = useRef<HTMLDivElement>(null);
  const introWrapRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const roleRef = useRef<HTMLParagraphElement>(null);
  const roleRuleRef = useRef<HTMLSpanElement>(null);
  const bodyMaskRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLParagraphElement>(null);

  const dissolveProgressRef = useRef({ value: 0 });
  const scrollProgressRef = useRef({ value: 0 });

  useEffect(() => {
    registerGsap();

    let ctx: gsap.Context | null = null;
    let cancelled = false;

    const build = () => {
      if (cancelled) return;

      ctx = gsap.context(() => {
        gsap.set(photoWrapRef.current, { opacity: 0, scale: 0.85 });
        gsap.set(blastWrapRef.current, { opacity: 0 });

        // Split so the introduction can assemble character-by-character and
        // then come apart the same way.
        const nameSplit = SplitText.create(nameRef.current, {
          type: "chars,words",
          mask: "words",
        });
        const roleSplit = SplitText.create(roleRef.current, { type: "chars" });
        const bodySplit = SplitText.create(bodyRef.current, { type: "words" });

        gsap.set(eyebrowRef.current, { opacity: 0, y: 14 });
        gsap.set(nameSplit.chars, { yPercent: 115, rotate: 6 });
        gsap.set(roleRef.current, { opacity: 0, y: 18, letterSpacing: "0.6em" });
        gsap.set(roleRuleRef.current, {
          scaleX: 0,
          transformOrigin: "left center",
        });
        gsap.set(bodyRef.current, { yPercent: 100, opacity: 0 });

        /**
         * Fragments are thrown outward from the middle of their own line, so a
         * centred block bursts symmetrically rather than drifting one way.
         */
        const shard = (spread: number, lift: number) => ({
          x: (i: number, _t: Element, arr: Element[]) => {
            const mid = (arr.length - 1) / 2;
            const dir = mid === 0 ? 0 : (i - mid) / mid;
            return dir * gsap.utils.random(spread * 0.45, spread) +
              gsap.utils.random(-40, 40);
          },
          y: () => gsap.utils.random(-lift, lift * 0.35),
          rotate: () => gsap.utils.random(-75, 75),
          scale: 0.55,
          opacity: 0,
          ease: "power2.in",
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top top",
            end: "bottom bottom",
            scrub: 1,
            pin: pinRef.current,
            onUpdate: (self) => {
              scrollProgressRef.current.value = self.progress;
              dissolveProgressRef.current.value = mapRange(
                self.progress,
                BLAST_START,
                1,
                0,
                1
              );
            },
          },
        });

        // A full-length spacer fixes the timeline duration at exactly 1, so
        // every position below reads directly as scroll progress.
        tl.to({}, { duration: 1 }, 0);

        // --- Act 1: the wordmark tears open and the portrait arrives ---
        tl.to(deveRef.current, { xPercent: -70, duration: 0.3, ease: "none" }, 0)
          .to(loperRef.current, { xPercent: 70, duration: 0.3, ease: "none" }, 0)
          .to(
            photoWrapRef.current,
            { opacity: 1, scale: 1, duration: 0.18, ease: "none" },
            0.06
          )
          .to(
            heroWordWrapRef.current,
            { opacity: 0, duration: 0.12, ease: "none" },
            0.2
          );

        // --- Act 2: the introduction assembles. The portrait stays intact. ---
        tl.to(
          eyebrowRef.current,
          { opacity: 1, y: 0, duration: 0.07, ease: "none" },
          0.3
        )
          .to(
            nameSplit.chars,
            {
              yPercent: 0,
              rotate: 0,
              duration: 0.1,
              ease: "none",
              stagger: { amount: 0.06, from: "start" },
            },
            0.34
          )
          .to(
            roleRef.current,
            {
              opacity: 1,
              y: 0,
              letterSpacing: "0.28em",
              duration: 0.09,
              ease: "none",
            },
            0.46
          )
          .to(
            roleRuleRef.current,
            { scaleX: 1, duration: 0.08, ease: "none" },
            0.52
          )
          .to(
            bodyRef.current,
            { yPercent: 0, opacity: 1, duration: 0.1, ease: "none" },
            0.54
          );

        // --- Act 3 (0.64 → 0.74): held. Everything is settled and readable. ---

        // --- Act 4: the blast ---
        // Reveal masks have to stop clipping before anything can fly out.
        tl.set(nameSplit.masks, { overflow: "visible" }, BLAST_START - 0.01)
          .set(bodyMaskRef.current, { overflow: "visible" }, BLAST_START - 0.01)
          .to(
            photoWrapRef.current,
            { opacity: 0, duration: 0.06, ease: "none" },
            BLAST_START
          )
          .to(
            blastWrapRef.current,
            { opacity: 1, duration: 0.05, ease: "none" },
            BLAST_START
          )
          .to(
            blastWrapRef.current,
            { x: -46, duration: 0.26, ease: "none" },
            BLAST_START
          )
          .to(
            eyebrowRef.current,
            { opacity: 0, y: -30, scale: 0.8, duration: 0.1, ease: "power2.in" },
            BLAST_START
          )
          .to(
            roleRuleRef.current,
            { opacity: 0, scaleX: 0.2, duration: 0.1, ease: "power2.in" },
            BLAST_START
          )
          .to(
            nameSplit.chars,
            {
              ...shard(460, 260),
              duration: 0.14,
              stagger: { amount: 0.06, from: "center" },
            },
            BLAST_START
          )
          .to(
            roleSplit.chars,
            {
              ...shard(380, 200),
              duration: 0.14,
              stagger: { amount: 0.05, from: "center" },
            },
            BLAST_START + 0.02
          )
          .to(
            bodySplit.words,
            {
              ...shard(520, 240),
              duration: 0.14,
              stagger: { amount: 0.07, from: "center" },
            },
            BLAST_START + 0.03
          );

        return () => {
          nameSplit.revert();
          roleSplit.revert();
          bodySplit.revert();
        };
      }, containerRef);

      ScrollTrigger.refresh();
    };

    // Splitting before the display webfont lands would measure fallback glyphs
    // and leave the characters mis-positioned.
    if (document.fonts?.status === "loaded") build();
    else void document.fonts.ready.then(build);

    return () => {
      cancelled = true;
      ctx?.revert();
    };
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

        <SmokeField progressRef={scrollProgressRef} layer="back" />

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
            top: "38%",
            width: PHOTO_WIDTH,
            height: PHOTO_HEIGHT,
            marginLeft: -PHOTO_WIDTH / 2,
            marginTop: -PHOTO_HEIGHT / 2,
          }}
        >
          <Image
            src="/images/p1.png"
            alt="Portrait of Om"
            fill
            sizes={`${PHOTO_WIDTH}px`}
            priority
            className="object-cover"
          />
        </div>

        {/* Unclipped sibling of the framed portrait — this is what shatters. */}
        <div
          ref={blastWrapRef}
          aria-hidden
          className="pointer-events-none absolute left-1/2 z-20"
          style={{
            top: "38%",
            width: BLAST_WIDTH,
            height: BLAST_HEIGHT,
            marginLeft: -BLAST_WIDTH / 2,
            marginTop: -BLAST_HEIGHT / 2,
          }}
        >
          <DissolveCanvas
            fromImage="/images/p1.png"
            toImage="/images/p2.png"
            width={PHOTO_WIDTH}
            height={PHOTO_HEIGHT}
            viewWidth={BLAST_WIDTH}
            viewHeight={BLAST_HEIGHT}
            progressRef={dissolveProgressRef}
          />
        </div>

        <SmokeField
          progressRef={scrollProgressRef}
          layer="front"
          className="z-[25]"
        />

        <div
          ref={introWrapRef}
          className="absolute bottom-[7%] left-1/2 z-30 flex w-full max-w-2xl -translate-x-1/2 flex-col items-center px-6 text-center"
        >
          <div
            ref={eyebrowRef}
            className="mb-5 flex items-center gap-3 text-[0.68rem] font-medium uppercase tracking-[0.42em] text-accent"
          >
            <span className="h-px w-8 bg-accent/40" />
            Introduction
            <span className="h-px w-8 bg-accent/40" />
          </div>

          <h2
            ref={nameRef}
            className="font-display font-semibold leading-[1.02] tracking-[-0.035em] text-text-primary"
            style={{ fontSize: "clamp(2.4rem, 6.5vw, 4.25rem)" }}
          >
            Hi, I&apos;m Om
            <span className="text-accent">.</span>
          </h2>

          <p
            ref={roleRef}
            className="mt-5 font-display text-xs font-medium uppercase text-text-secondary sm:text-sm"
          >
            Backend Engineer
          </p>

          <span
            ref={roleRuleRef}
            className="mt-5 block h-px w-24 bg-gradient-to-r from-transparent via-accent to-transparent"
          />

          <div ref={bodyMaskRef} className="mt-5 overflow-hidden">
            <p
              ref={bodyRef}
              className="max-w-[46ch] text-pretty text-base leading-relaxed text-text-secondary sm:text-lg"
            >
              I build reliable, scalable backend systems — APIs, distributed
              infrastructure, and the occasional ML pipeline — with an eye for
              clean architecture.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
