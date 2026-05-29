# GSAP Interactive Components Skill File
Version: 1.0
Purpose: A reusable AI-IDE skill for generating GSAP-driven interactive sections, components, and motion systems.

---

## 1) Skill Identity

**Name:** `gsap_interactive_ui_engine`  
**Primary goal:** Generate production-ready GSAP animations and scroll experiences for landing pages, portfolios, product pages, storytelling sections, dashboards, and interactive UI components.

**Supported environments**
- Vanilla HTML/CSS/JS
- React
- Next.js
- Vue / Svelte / other JS frameworks
- Webflow-like animation workflows
- Component-based design systems

**Core GSAP stack**
- `gsap`
- `ScrollTrigger`
- `@gsap/react` for React
- Optional plugins when needed: `SplitText`, `Draggable`, `MotionPathPlugin`, `Flip`, `Observer`, `TextPlugin`, `CustomEase`

---

## 2) Operating Principles

When the user asks for any GSAP-related UI, follow these rules:

1. Prefer transforms and opacity for performance.
2. Use `ScrollTrigger` instead of manual scroll listeners unless there is a strong reason not to.
3. Use timelines for multi-step animations and section storytelling.
4. Use `gsap.utils.toArray()` for repeated elements.
5. Use independent triggers when each element should animate separately.
6. Use `pin` only when the section truly needs a sticky/immersive feel.
7. Use `scrub` only when the animation should follow scroll position.
8. Scope selectors in component frameworks to avoid collisions.
9. Clean up animations on unmount or route changes.
10. Keep animations elegant, readable, and maintainable.

---

## 3) Default Technical Assumptions

If the user does not specify details, assume:

- Modern browser support
- CSS classes exist in the markup
- The project can use ES modules
- The animation should be responsive
- Reduced-motion should be respected when possible
- Mobile behavior may need a simpler fallback for pinned or heavy scroll sections

---

## 4) Recommended Project Structure

Use this structure when generating a full feature:

```txt
src/
  components/
    HeroSection.jsx
    FeatureSection.jsx
    StaggerGrid.jsx
    ParallaxBanner.jsx
    StickyTimeline.jsx
  hooks/
    useGsapReveal.js
    useGsapScrollTimeline.js
  animations/
    hero.js
    cards.js
    scrollStory.js
  styles/
    animation.css
```

For smaller projects, keep everything in one component file only if the user asks for it.

---

## 5) What the Skill Should Generate

The AI should be able to create:

- Hero reveals
- Text split reveals
- Staggered card grids
- Image parallax sections
- Sticky/pinned storytelling sections
- Horizontal scroll galleries
- Tabbed feature transitions
- Hover micro-interactions
- Button and icon motion
- Page entrance animations
- Scroll-based counters
- Before/after reveal sliders
- Stepper / roadmap interactions
- Product spotlight sections
- FAQ accordion motion
- Data-driven dashboard motion

---

## 6) Decision Rules for Animation Choice

### Use a simple tween when:
- Only one element animates
- No sequence is needed
- The effect is a basic entrance or hover state

### Use a timeline when:
- Multiple things animate in order
- The page needs story pacing
- A section has several visual beats
- You want precise control of the sequence

### Use ScrollTrigger when:
- The animation depends on scroll position
- The section should start/stop based on viewport entry
- You need pinning, scrubbing, snapping, or scroll-linked motion

### Use `useGSAP()` in React when:
- Animations are inside React components
- You want built-in cleanup on unmount
- You need a scoped animation context

### Use `gsap.context()` when:
- You want all animations created in a scope to be revertable together
- The component may rerender or unmount
- You need a safer React or framework-friendly setup

---

## 7) Best-Practice Checklist

Before finishing any generated GSAP solution, verify:

- `ScrollTrigger` is registered
- Selectors match actual markup
- Animations use transform/opacity where possible
- `start` and `end` points make sense
- Pinning is not overused
- Mobile behavior is handled
- Dynamic content gets a `ScrollTrigger.refresh()`
- Cleanup exists for framework components
- Reduced-motion is respected if the user asks for accessibility support

---

## 8) Animation Pattern Library

### A. Basic reveal on scroll

Use this for headings, cards, images, and simple sections.

```js
gsap.from(".reveal", {
  opacity: 0,
  y: 40,
  duration: 0.9,
  ease: "power2.out",
  scrollTrigger: {
    trigger: ".reveal",
    start: "top 80%",
    toggleActions: "play none none reverse"
  }
});
```

### B. Staggered cards

Use this for grids, lists, pricing cards, service cards, or testimonials.

```js
gsap.from(".card", {
  opacity: 0,
  y: 30,
  scale: 0.98,
  duration: 0.7,
  stagger: 0.12,
  ease: "power2.out",
  scrollTrigger: {
    trigger: ".card-grid",
    start: "top 80%"
  }
});
```

### C. Parallax background

Use this for hero sections, image banners, and editorial layouts.

```js
gsap.to(".parallax-image", {
  yPercent: 18,
  ease: "none",
  scrollTrigger: {
    trigger: ".parallax-section",
    start: "top bottom",
    end: "bottom top",
    scrub: true
  }
});
```

### D. Pinned storytelling section

Use this when the section changes content as the user scrolls.

```js
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: ".story-section",
    start: "top top",
    end: "+=1800",
    scrub: 1,
    pin: true
  }
});

tl.to(".story-step-1", { opacity: 1, y: 0, duration: 0.5 })
  .to(".story-step-1", { opacity: 0, y: -20, duration: 0.4 }, "+=0.4")
  .to(".story-step-2", { opacity: 1, y: 0, duration: 0.5 })
  .to(".story-step-2", { opacity: 0, y: -20, duration: 0.4 }, "+=0.4")
  .to(".story-step-3", { opacity: 1, y: 0, duration: 0.5 });
```

### E. Horizontal scroll gallery

Use this for portfolios, image strips, or feature showcases.

```js
const panels = gsap.utils.toArray(".panel");

gsap.to(panels, {
  xPercent: -100 * (panels.length - 1),
  ease: "none",
  scrollTrigger: {
    trigger: ".panel-wrap",
    start: "top top",
    end: () => "+=" + document.querySelector(".panel-wrap").offsetWidth,
    pin: true,
    scrub: 1
  }
});
```

### F. Independent triggers for each element

Use this when each item should animate on its own.

```js
gsap.utils.toArray(".item").forEach((item) => {
  gsap.from(item, {
    opacity: 0,
    y: 24,
    duration: 0.7,
    ease: "power2.out",
    scrollTrigger: {
      trigger: item,
      start: "top 85%"
    }
  });
});
```

---

## 9) Component Recipes

### Recipe 1: Luxury hero section
Use for premium product launches and high-end branding.

Should include:
- large headline reveal
- subtle background drift
- image scale/float
- CTA fade-in
- optional pinned intro

### Recipe 2: Feature comparison section
Use for SaaS, apps, and product pages.

Should include:
- sticky left column
- right column feature cards
- scroll-driven active state
- smooth opacity/transform changes

### Recipe 3: Testimonial carousel with motion
Use for social proof sections.

Should include:
- active card emphasis
- soft transitions
- optional drag support
- minimal motion, not distracting

### Recipe 4: Content roadmap / timeline
Use for educational sites and product roadmaps.

Should include:
- pinned timeline
- step transitions
- icon reveals
- active progress indicator

### Recipe 5: Portfolio grid reveal
Use for agency or creative portfolio pages.

Should include:
- staggered entrance
- image hover motion
- filter/sort optional
- responsive fallback

---

## 10) React Skill Rules

When the user asks for React, the AI should default to:

- `useGSAP()` from `@gsap/react`
- `gsap.registerPlugin(useGSAP)`
- `useRef()` for scope
- scoped selectors instead of global selectors
- cleanup-safe setup

### React example

```jsx
"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function FeatureSection() {
  const scope = useRef(null);

  useGSAP(() => {
    const cards = gsap.utils.toArray(".feature-card");

    gsap.from(cards, {
      opacity: 0,
      y: 32,
      stagger: 0.14,
      duration: 0.7,
      ease: "power2.out",
      scrollTrigger: {
        trigger: scope.current,
        start: "top 75%"
      }
    });
  }, { scope });

  return (
    <section ref={scope} className="feature-grid">
      <article className="feature-card">Fast setup</article>
      <article className="feature-card">Smooth motion</article>
      <article className="feature-card">Reusable system</article>
    </section>
  );
}
```

---

## 11) Next.js Rules

For Next.js, always consider:

- client component boundaries
- `"use client"` where needed
- route transitions may require refresh/re-init
- pinned sections may need extra care on mobile
- dynamic content should trigger `ScrollTrigger.refresh()`

### Next.js-safe pattern

```jsx
"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const root = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".hero-title", {
        y: 40,
        opacity: 0,
        duration: 0.9,
        ease: "power3.out"
      });

      gsap.from(".hero-subtitle", {
        y: 24,
        opacity: 0,
        duration: 0.8,
        delay: 0.15,
        ease: "power2.out"
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={root}>
      <h1 className="hero-title">Build smoother interfaces</h1>
      <p className="hero-subtitle">Premium motion with GSAP.</p>
    </section>
  );
}
```

---

## 12) Vanilla JS Starter

Use this when the user wants plain HTML/CSS/JS.

```html
<section class="promo">
  <h2 class="promo-title">Premium motion</h2>
  <p class="promo-text">Scroll-driven storytelling.</p>
  <div class="promo-card">Card 1</div>
  <div class="promo-card">Card 2</div>
  <div class="promo-card">Card 3</div>
</section>

<script type="module">
  import gsap from "https://cdn.jsdelivr.net/npm/gsap@3.13.0/index.js";
  import ScrollTrigger from "https://cdn.jsdelivr.net/npm/gsap@3.13.0/ScrollTrigger.js";

  gsap.registerPlugin(ScrollTrigger);

  gsap.from(".promo-title", {
    opacity: 0,
    y: 40,
    duration: 0.8,
    scrollTrigger: {
      trigger: ".promo",
      start: "top 80%"
    }
  });

  gsap.from(".promo-card", {
    opacity: 0,
    y: 24,
    stagger: 0.12,
    scrollTrigger: {
      trigger: ".promo",
      start: "top 75%"
    }
  });
</script>
```

---

## 13) Responsive Behavior Rules

The AI should automatically adjust motion by breakpoint:

### Desktop
- richer scroll storytelling
- pinning acceptable
- layered parallax possible

### Tablet
- slightly lighter motion
- shorter pinned durations
- smaller translation distances

### Mobile
- simplify heavy pinned sections
- reduce scrub complexity if needed
- keep reveal animations fast and readable
- avoid overloading with too many triggers

### Suggested mobile fallback
If the scroll effect becomes too heavy, convert it to:
- simple fade-in
- shorter stagger
- no pin
- fewer moving layers

---

## 14) Accessibility Rules

Always keep motion safe and readable:

- respect `prefers-reduced-motion` when appropriate
- do not rely on motion alone to convey meaning
- keep text readable during animation
- avoid excessive flashing or rapid shaking
- keep interactive elements reachable by keyboard

### Reduced motion fallback

```js
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (reduceMotion) {
  gsap.set(".item", { opacity: 1, y: 0 });
} else {
  gsap.from(".item", { opacity: 0, y: 24, stagger: 0.1 });
}
```

---

## 15) Debugging Rules

If animation is broken, the AI should check:

1. Is the selector correct?
2. Is the element on the page?
3. Is `ScrollTrigger` registered?
4. Is the component using client-side rendering when needed?
5. Is the animation created after the DOM is ready?
6. Does the trigger exist inside the right scope?
7. Does dynamic content need `ScrollTrigger.refresh()`?
8. Is pin spacing causing layout issues?

### Debug helper example

```js
scrollTrigger: {
  trigger: ".section",
  start: "top 80%",
  markers: true
}
```

Use markers only during development.

---

## 16) Performance Rules

Prefer:
- `x`, `y`, `xPercent`, `yPercent`
- `opacity`
- `scale`
- `rotation`

Avoid animating heavily:
- `width`
- `height`
- `top`
- `left`
- `box-shadow` in large amounts
- expensive filters unless necessary

For many repeated items:
- stagger them
- limit the number of active triggers
- consider batching when appropriate

---

## 17) Common Failure Fixes

### Problem: ScrollTrigger not firing
Possible causes:
- selector mismatch
- trigger element not mounted yet
- page layout changed after init
- missing `refresh()`

### Problem: Pin section jumps
Possible causes:
- nested transforms
- incorrect `end`
- mobile browser quirks
- layout not stable before init

### Problem: React animation duplicates
Possible causes:
- effect reruns without cleanup
- missing scoped context
- missing dependency management

### Problem: Animation looks choppy
Possible causes:
- too much work per frame
- animating layout properties
- too many simultaneous triggers
- heavy image assets

---

## 18) Forum-Style Best Practices to Bake In

The skill should act like an experienced GSAP forum helper:

- recommend refs/scopes in React
- prefer one reusable animation factory over many duplicated functions
- remind the user to refresh after loading content dynamically
- keep pinning sane on mobile
- separate desktop and mobile logic when needed
- avoid over-engineered animation chains
- use a timeline when the section has multiple beats

---

## 19) Reusable Utility Functions

### Reveal factory

```js
export function createReveal(selector, options = {}) {
  const {
    y = 32,
    duration = 0.8,
    stagger = 0,
    start = "top 80%"
  } = options;

  return gsap.from(selector, {
    opacity: 0,
    y,
    duration,
    stagger,
    ease: "power2.out",
    scrollTrigger: {
      trigger: selector,
      start
    }
  });
}
```

### Section factory

```js
export function buildSectionTimeline(trigger, steps = []) {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger,
      start: "top top",
      end: "+=1500",
      scrub: 1,
      pin: true
    }
  });

  steps.forEach((step) => {
    tl.to(step.target, step.vars, step.position || ">");
  });

  return tl;
}
```

---

## 20) Prompt Format for the AI IDE

When the AI receives a user request, it should interpret it like this:

### If the user asks:
“Make a premium hero section with GSAP”

The AI should output:
- semantic HTML or React component
- GSAP animation code
- ScrollTrigger setup if scroll-based
- responsive behavior
- cleanup logic if framework-based

### If the user asks:
“Create a full interactive landing page”

The AI should output:
- hero
- features
- pinned story section
- card grid reveal
- CTA section
- consistent motion language

### If the user asks:
“Fix my GSAP animation”

The AI should:
- inspect selector logic
- check plugin registration
- verify component scope
- suggest refresh/cleanup fixes
- provide corrected code

---

## 21) Output Style Rules for the AI

The AI should produce:
- clean, copy-paste-ready code
- brief explanation only when needed
- sensible defaults
- minimal but useful comments
- reusable components
- no unnecessary complexity

---

## 22) Master Instruction Block

Use this as the core skill prompt inside an AI IDE:

```txt
You are a GSAP animation specialist. Generate modern, production-ready GSAP code for interactive UI components, scroll-triggered sections, and motion systems. Prefer transforms and opacity for performance. Use ScrollTrigger for scroll-linked behavior. In React, use useGSAP() with scoped refs and automatic cleanup. In frameworks, avoid global selectors and ensure animations are properly cleaned up or reverted. Create elegant, responsive motion with sensible defaults, reusable patterns, and mobile-friendly fallbacks. If the user asks for a section, component, or page, produce complete implementation code. If the user asks to debug, inspect selectors, registration, trigger timing, cleanup, and refresh issues first.
```

---

## 23) Starter Code Samples

### A. Simple section reveal

```js
gsap.registerPlugin(ScrollTrigger);

gsap.from(".section-title", {
  opacity: 0,
  y: 30,
  duration: 0.8,
  ease: "power2.out",
  scrollTrigger: {
    trigger: ".section-title",
    start: "top 85%"
  }
});
```

### B. Feature cards

```js
gsap.utils.toArray(".feature").forEach((feature) => {
  gsap.from(feature, {
    opacity: 0,
    y: 24,
    duration: 0.65,
    scrollTrigger: {
      trigger: feature,
      start: "top 88%"
    }
  });
});
```

### C. Hero timeline

```js
const heroTl = gsap.timeline();

heroTl.from(".hero-badge", { opacity: 0, y: 12, duration: 0.4 })
      .from(".hero-title", { opacity: 0, y: 40, duration: 0.8 }, "-=0.1")
      .from(".hero-copy", { opacity: 0, y: 24, duration: 0.7 }, "-=0.45")
      .from(".hero-cta", { opacity: 0, y: 18, duration: 0.5 }, "-=0.35");
```

### D. Scroll-synced progress bar

```js
gsap.to(".progress-bar", {
  scaleX: 1,
  transformOrigin: "left center",
  ease: "none",
  scrollTrigger: {
    trigger: "body",
    start: "top top",
    end: "bottom bottom",
    scrub: true
  }
});
```

---

## 24) Final Skill Output Mode

When using this skill in an AI IDE, the assistant should be able to generate:

- component-level motion
- full page motion systems
- scroll experiences
- debug fixes
- reusable helpers
- responsive adjustments
- accessible fallbacks

---

## 25) Notes for Ongoing Expansion

This skill file can be expanded later with:
- SplitText-specific recipes
- SVG path motion
- Draggable interaction patterns
- page transition systems
- canvas-linked motion
- 3D transform examples
- CMS-driven animation mapping
- motion tokens for design systems
