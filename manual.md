# Om's Portfolio — Full Build Spec
### A cinematic, scroll-driven portfolio for a backend software engineer

Inspired by the storytelling feel of **laxspace.co**, rebuilt around backend engineering work. This is a build-ready spec — hand it to Claude Code section by section, or use it as the master reference while building.

---

## 1. Tools & Claude Skills needed to build this

This is a heavy, animation-first Next.js build, not something to build in a single chat artifact — it needs **Claude Code** (terminal, VS Code, or JetBrains extension) working across many files over several sessions.

### Built-in / first-party
| Need | What to use |
|---|---|
| Visual direction: palette, type pairing, layout rhythm, avoiding "AI-template" defaults | **`frontend-design` skill** (Anthropic, ships with Claude) — used below to lock this spec's design tokens |
| Quick motion-timing sketches before committing to real GSAP code | Claude's inline **Visualizer** — mock a single beat (e.g. the hero text-split) as a fast HTML/SVG sketch |
| Polished prototypes / mockup exploration before coding | **Claude Design** (Anthropic Labs, research preview) — good for exploring the hero and helix layout visually before writing R3F code |
| A Word/PDF export of this spec for a client or dev handoff | `docx` / `pdf` skills |

### Community skill packs (install into Claude Code, not built-in)
Anthropic's skills format is just a folder + `SKILL.md` that Claude Code can load on demand, and the community has published skill packs specifically for this kind of 3D/scroll site. The most relevant one found:

- **`freshtechbro/claudedesignskills`** — a Claude Code plugin marketplace with 22 skills purpose-built for 3D graphics, animation, and scroll-driven web experiences, covering exactly this stack: <cite index="3-1">Three.js, GSAP, React Three Fiber, Framer Motion, and Babylon.js, plus scroll libraries like Locomotive Scroll and Barba.js</cite>. It's organized into bundles:
  - `core-3d-animation` — Three.js, GSAP, R3F, Motion, Babylon.js (this is the bundle that covers the helix + scroll timeline work in this spec)
  - `animation-components` — React Spring, Magic UI, AOS, Anime.js, Lottie (useful for the Skills-section card entrances)
  - `authoring-motion` — Blender, Spline, Rive, Substance 3D (only relevant if you want to author custom 3D assets instead of images for the helix)
  - `extended-3d-scroll` — A-Frame, Vanta, PlayCanvas, PixiJS (not needed for this spec's stack, skip)

  Install in Claude Code with:
  ```
  /plugin marketplace add freshtechbro/claudedesignskills
  /plugin install core-3d-animation
  ```
  This is third-party, not an Anthropic product — vet it before installing, same as any repo you'd pull dependencies from.

- A lighter-weight alternative if you don't want a full marketplace: standalone **"3D Animations Studio"** skills exist that do CSS-transform-based 3D (flip cards, tilt, parallax) <cite index="4-1">without WebGL overhead, using Framer Motion for smooth transitions with a lighter footprint than Three.js</cite> — not a fit for the helix itself (that needs real WebGL/R3F), but worth having for lightweight hover/tilt effects on the Skills and Experience cards.

None of these replace the actual coding work — they just give Claude Code pre-loaded reference patterns for GSAP/R3F so it writes idiomatic code instead of reinventing scroll-sync math from scratch each time.

---

## 2. Tech stack

- **Next.js 14+ (App Router)**
- **TypeScript**
- **Tailwind CSS**
- **Framer Motion** — micro-interactions, section transitions
- **GSAP + ScrollTrigger** — master scroll timeline, pinned sections, the helix rotation
- **React Three Fiber (Three.js)** — the 3D helical project carousel, particle dissolve
- **Lenis** — smooth scrolling substrate everything else hooks into
- **React Icons**
- **Shadcn UI** — only for low-level primitives (form inputs, buttons)

Target: 60 FPS, fully responsive, non-blocking animation on mid-range laptops.

---

## 3. Design tokens (locked — don't drift into generic defaults)

**Palette**
| Token | Hex | Use |
|---|---|---|
| Background | `#F8F7F3` | Off-white/cream base |
| Surface | `#FFFFFF` | Cards |
| Text primary | `#111111` | Headings, body |
| Text secondary | `#666666` | Captions, meta |
| Accent | `#D62839` | Deep red — CTAs, active states, highlights only |
| Border | very light gray (`#EAEAE6`-ish) | Dividers, card outlines |

Glassmorphism is reserved **only** for inactive/blurred project images in the helix. No bright gradients, no neon, no gaming-style glow.

**Typography**
- Display: Clash Display or Cabinet Grotesk — huge, bold, used sparingly (hero + section titles)
- Body: General Sans, Satoshi, or Inter — everything else

**Signature element:** the helical project carousel — the one unmistakable moment of the site. Everything else stays quiet around it.

---

## 4. Site flow (one continuous scroll story)

```
Hero (DEVELOPER)
   ↓
Text splits → photo reveal
   ↓
About Me (intro copy)
   ↓
Photo dissolves into particles
   ↓
Project Helix (7 projects, main attraction)
   ↓
Skills
   ↓
Experience
   ↓
Achievements
   ↓
GitHub
   ↓
Contact
```

---

## 5. Section-by-section spec

### Hero
- Full viewport, single word: **DEVELOPER**, massive scale, no navbar, no buttons.
- Background: subtle moving grid, soft particles, slight mouse-parallax on background elements only.

### Scroll Animation 1 — Split & Reveal
- `DEVELOPER` splits: `DEVE` slides left, `LOPER` slides right, gap widens continuously with scroll (GSAP ScrollTrigger `scrub`, not a fixed-duration tween).
- Photo (`images/p1.png`) fades and scales up from behind the widening gap.

### Scroll Animation 2 — Introduction
- Photo reaches center, text fully gone, photo becomes focal point.
- Intro copy animates in per-sentence, staggered: "Hi, I'm Om." → "Backend Engineer" → the longer description line.

### Scroll Animation 3 — Dissolve Transition
- Photo moves left while dissolving into a genuine particle simulation (R3F/Three.js `Points`), not a CSS fade.
- Particles spiral inward, then reform into the first project image, bridging into the helix.

### Project Helix (main attraction — see Section 6 for full per-project detail)
- True 3D helix in React Three Fiber: images arranged around an invisible vertical cylinder.
- Camera fixed; cylinder rotation is a direct function of scroll progress.
- **Active project** (centered): full scale, zero blur, full opacity, subtle elevation/shadow.
- **Inactive projects**: 15–20px blur, 20–30% opacity, ~0.75 scale, glass overlay, still rotating.
- Info panel appears only when a project is dead-center, animating: Title → Subtitle → Tech stack → Description → Buttons.
- Image/info sides alternate project-to-project.
- Only one project's info visible at a time.

### Skills
- Helix dissolves out; skill cards emerge by category: Backend, Frontend, Cloud, Databases, Tools.
- Independent per-card entrance animation on viewport entry; restrained hover states.

### Experience
- Vertical timeline, line grows in on scroll, nodes animate as they enter viewport.

### GitHub
- Animated contribution graph, repo highlights, language breakdown, commit stats, profile link.

### Contact
- Minimal, large type. Email, LinkedIn, GitHub, Resume link, simple controlled-input contact form.

---

## 6. The Seven Projects — full detail for the helix

**General rule for every project card, when centered:**
1. Image sharpens (blur → 0, opacity → 100%, scale → 1)
2. Domain-specific background elements animate in
3. Title fades in
4. Subtitle slides upward
5. Tech stack tags appear one by one (staggered, not all at once)
6. Description types in smoothly (typewriter or line-reveal, not instant)
7. Feature list animates sequentially
8. GitHub / Live Demo buttons appear last

**When it rotates away:** background animation slows → info fades → image blurs back → glass overlay returns → next project takes focus. Never two projects' info visible at once.

---

### Project 1 — Studio Oak
`images/p2.png`

**Subtitle:** Premium MERN E-Commerce Platform

**Description:** Full-stack e-commerce platform built for scalability and modern UX — browsing, cart management, secure auth, order placement, and checkout through a clean, responsive interface with efficient state management on top of a clean backend architecture.

**Key features:** JWT auth · role-based authorization · product catalog · category filtering · shopping cart · wishlist · checkout workflow · order management · responsive UI · REST APIs · admin dashboard

**Tech stack:** React · Node.js · Express · MongoDB · JWT · Tailwind CSS

**Visual identity (image left / info right):**
- Floating shopping-related elements in the background (bags, boxes, drifting slowly)
- Laptop mockup showing the homepage
- Shopping cart fill/add animation on hover or on-focus
- Product card grid with subtle stagger
- Order confirmation + payment success micro-illustration as a secondary beat once the card is centered

---

### Project 2 — Distributed API Rate Limiter
`images/p3.png`

**Subtitle:** Spring Boot + Redis

**Description:** Production-ready distributed rate limiter protecting backend services from abuse, bot traffic, and DDoS-style bursts. Supports multiple interchangeable strategies via the Strategy pattern, sharing request counters through Redis so limits hold across distributed deployments.

**Key features:** Token Bucket · Sliding Window · Fixed Window · Redis distributed counters · Strategy Design Pattern · low latency · configurable limits · production-grade architecture

**Tech stack:** Java · Spring Boot · Redis · Docker · REST API

**Visual identity (image right / info left):**
- Animated request arrows flowing into a Redis node
- Token bucket filling/draining in sync with a simulated request stream
- A "rate limit exceeded" state that flashes briefly in the accent red
- Live request counter ticking
- Distributed server nodes connected by thin animated lines, echoing the request flow

---

### Project 3 — Alternate Credit Risk Score
`images/p4.png`

**Subtitle:** Machine Learning for Financial Inclusion

**Description:** ML system evaluating creditworthiness for individuals with little or no traditional banking history, using alternative financial indicators. Includes feature engineering, multiple trained models, and SHAP-based explainability so predictions stay transparent for lending decisions.

**Key features:** feature engineering · XGBoost model · explainable AI · SHAP visualization · credit prediction · data preprocessing · model evaluation · financial inclusion focus

**Tech stack:** Python · XGBoost · Scikit-learn · Pandas · NumPy · SHAP · Matplotlib

**Visual identity (image left / info right):**
- A left-to-right flow diagram animating in as the card centers: **Raw Data → Feature Engineering → Model Training → Prediction → SHAP Explanation**
- Feature-importance bars growing in
- A probability gauge sweeping to its final value
- Small financial iconography (coins, ledger lines) kept minimal, not decorative clutter

---

### Project 4 — PhysioCheck
`images/p5.png`

**Subtitle:** AI-Based Physiotherapy Assistant

**Description:** Computer-vision rehab assistant that tracks body posture in real time, compares joint angles against target parameters, flags incorrect movement, and gives immediate corrective feedback during exercises.

**Key features:** pose detection · exercise validation · joint angle measurement · real-time feedback · OpenCV pipeline · progress tracking · rehabilitation assistance

**Tech stack:** Python · OpenCV · MediaPipe · Machine Learning · Computer Vision

**Visual identity (image right / info left):**
- Animated human skeleton / landmark overlay
- Joint-angle readouts appearing at key points
- A rep counter ticking up
- Correct posture highlighted in a controlled green accent, incorrect in the site's deep red — the only two places color deviates from the palette, and only inside this card's visualization, not the surrounding chrome

---

### Project 5 — ORBE
`images/p6.png`

**Subtitle:** Graph-Based Stock Market Intelligence

**Description:** Stock market analysis system modeling financial relationships as a graph rather than isolated data points — companies as interconnected nodes — so users can analyze dependencies, sector influence, and investment paths with graph algorithms.

**Key features:** graph-based market model · network visualization · company relationships · sector analysis · market influence mapping · graph algorithms

**Tech stack:** Python · NetworkX · Graph Theory · React · Data Visualization

**Visual identity (image left / info right):**
- Animated node-edge network, edges glowing faintly as "signal" passes through them
- Simulated stock movement flowing along the links
- Light, interactive-feeling network visualization (even if not literally interactive on the card)
- Financial line charts kept subdued in the background, not competing with the graph

---

### Project 6 — NGO Connect
`images/p7.png`

**Subtitle:** Volunteer & Event Management Platform

**Description:** Platform connecting NGOs with volunteers — organizations publish events and campaigns, volunteers browse and register — through a simple, responsive interface for participating in social initiatives.

**Key features:** volunteer registration · NGO dashboard · event creation · event participation · authentication · responsive design · user management

**Tech stack:** React · Node.js · Express · MongoDB · JWT

**Visual identity (image right / info left):**
- Warm community-style illustration elements (kept in the site's palette, not a color departure)
- People "joining" an event animated as small avatars converging
- Volunteer/event cards with a light stagger-in
- Event calendar sliver, location pins, small donation iconography — used sparingly, one or two elements active at a time rather than all at once

---

### Project 7 — Binary Tree Visualizer
`images/p8.png`

**Subtitle:** Interactive Data Structure Learning Tool

**Description:** Educational app for understanding binary trees through real-time visualization — insert, delete, search, and traverse nodes while watching animated tree transformations that make the underlying algorithms legible.

**Key features:** insert node · delete node · search node · inorder / preorder / postorder traversal · tree balancing visualization · interactive animations

**Tech stack:** JavaScript · React · D3.js · Algorithms

**Visual identity (image left / info right):**
- A tree growing in, node by node, with animated edges connecting parent to child
- A traversal path highlighting in sequence (D3 transition, timed to feel like a "scan")
- Insertion animation as a new node drops into its correct position
- Search path glowing along the tree as it "finds" a target node — this is the last project in the helix, so let this be the most kinetic of the seven cards as a closing beat before the Skills section

---

## 7. Global systems

**Navigation** — hidden on hero, appears after scrolling past it; glassmorphism bar; highlights current section; smooth-scroll on click.

**Cursor** — custom cursor: small dot + outer ring, magnetic pull on hover targets, no exaggerated motion.

**Motion vocabulary** — fade, scale, depth/perspective, blur, parallax, rotation, floating. No abrupt cuts; every transition should feel physically connected to the one before it.

**Performance**
- Lazy-load all images.
- Optimize the Three.js scene: instance the particles, dispose unused geometries/textures, cap device-pixel-ratio on low-end devices.
- Animations must never block scroll input (use `will-change` sparingly and correctly, avoid layout thrash in the GSAP timeline).

**Responsiveness**
- Desktop: full 3D helix, all 7 projects rendered with LOD-appropriate detail.
- Tablet: reduced helix complexity — fewer simultaneously rendered inactive projects, simpler particle counts.
- Mobile: swap the 3D helix for a vertical project carousel that preserves the same story beats (one active project at a time, info reveal on focus) — don't force the desktop 3D effect onto a small screen.

---

## 8. In-depth build guide (step by step)

### Phase 0 — Setup
1. `npx create-next-app@latest` with TypeScript + Tailwind + App Router.
2. Install: `framer-motion gsap @react-three/fiber @react-three/drei three lenis react-icons`.
3. If using the community skill pack: add the `freshtechbro/claudedesignskills` marketplace and install the `core-3d-animation` bundle in Claude Code before starting section work, so GSAP/R3F code Claude writes follows established patterns rather than ad-hoc.
4. Wire Tailwind theme tokens to the palette/type table in Section 3 — do this before building any section so nothing hardcodes stray hex values later.
5. Wrap the app in a Lenis provider (a `useEffect` that instantiates Lenis and syncs its `raf` with GSAP's ticker via `gsap.ticker.add`) — this is the scroll substrate everything else hooks into.

### Phase 1 — Hero + chrome
1. Build the hero word as its own component, two `<span>`s (`DEVE` / `LOPER`) positioned so they read as one word at rest.
2. Build the custom cursor as a fixed-position element tracking `mousemove`, with a spring (Framer Motion `useSpring`) on the outer ring for the lag/magnetic feel.
3. Build the navbar, initially `opacity-0 pointer-events-none`, toggled by a ScrollTrigger once the hero is scrolled past.

### Phase 2 — The GSAP master timeline (Scroll Animations 1–3)
1. Create one `ScrollTrigger`-pinned container spanning Hero → Photo → Intro → Dissolve, with `scrub: true` so every sub-animation is scroll-position-driven, not time-driven.
2. Split the hero text: animate `DEVE`'s `x` negative and `LOPER`'s `x` positive as a function of scroll progress within this pin.
3. Cross-fade/scale the photo in as the gap widens (tie its `opacity`/`scale` to the same scroll progress variable so it's mathematically synced, not a separate timeline guessing at timing).
4. Stagger the three intro sentences in with a `gsap.timeline` triggered once the photo reaches center (a labeled point in the master timeline, not a new ScrollTrigger).
5. For the dissolve: this is the one beat that needs R3F — swap from a DOM `<img>` to a `<Points>` cloud sampled from the image's pixel data (canvas `getImageData` → position buffer), animate positions from "image shape" to "scattered" to "next image shape" driven by the same scroll progress value passed down as a prop.

### Phase 3 — The Helix (the centerpiece — budget the most time here)
1. Set up a fixed R3F `<Canvas>` for this section, camera at a fixed position looking at the cylinder's central axis.
2. Place each of the 7 project image planes (`<mesh>` + `<planeGeometry>` + texture) at even angular intervals around the cylinder (`angle = index * (2π / 7)`), each at `x = radius * cos(angle)`, `z = radius * sin(angle)`.
3. Drive cylinder-group rotation directly from scroll progress within this section's ScrollTrigger — `group.rotation.y = progress * someMultiplier`, no separate tween, so it always tracks scroll 1:1.
4. Each frame (`useFrame`), compute each project's angular distance from "front center" and derive blur/opacity/scale/elevation from that distance — this is what makes "active" state emerge naturally from rotation instead of being manually triggered.
5. Blur: since real blur isn't native to WebGL materials cheaply, either (a) render each inactive project through a post-processing blur pass scoped to that mesh, or (b) fake it with a blurred pre-rendered texture swapped in at a distance threshold, and cross-fade to the sharp texture as it approaches center. Option (b) is far cheaper and usually indistinguishable at these scales.
6. Glass overlay on inactive cards: a semi-transparent plane with `backdrop-filter`-style shader or a simple alpha-blended white/light material in front of the texture.
7. Info panel: keep this in DOM/Framer Motion, not in the Three.js scene — position it with CSS relative to the canvas, driven by "is this project's angular distance under threshold X" (a boolean derived in the same `useFrame` loop, lifted into React state via a ref-based subscription to avoid re-rendering every frame).
8. Wire each project's specific "Visual identity" beats from Section 6 as small per-card components that mount only while that card is active, so idle projects aren't running their domain animation in the background.

### Phase 4 — Skills / Experience / GitHub / Contact
1. Skills: category groups as a CSS grid, each card using Framer Motion `whileInView` for the entrance stagger — this section doesn't need GSAP, it's simpler than the helix and Framer Motion's viewport triggers are the right tool.
2. Experience: an SVG or CSS `::before` line whose `height`/`stroke-dashoffset` ties to scroll progress within the section; nodes pop in via `whileInView`.
3. GitHub: fetch contribution/stat data (GitHub's public API or a service like `github-readme-stats`) at build time or via a server component, animate bars/graph in on viewport entry.
4. Contact: controlled React inputs, no native `<form>` tag if wiring a custom submit handler; keep this section deliberately the calmest in the whole site — it's the resting beat after the helix and skills sections.

### Phase 5 — Responsive + performance pass
1. Build the mobile carousel fallback for the helix as a genuinely separate component (not a CSS-hidden version of the 3D one) — swap in via a media-query check, so mobile never even mounts the R3F canvas.
2. Profile with Chrome DevTools' Performance tab and the Three.js `stats.js` overlay during development; check frame time stays under ~16ms during the helix section specifically, since that's where the budget is tightest.
3. Lighthouse pass for image lazy-loading and layout shift; confirm scroll never stutters when GSAP and Lenis are both active at once (this is the most common source of jank in this kind of build — test early, not at the end).

---

*Use this file as the working spec — paste individual phases into Claude Code as you build, and update the design tokens or project visual-identity notes if the direction shifts.*
