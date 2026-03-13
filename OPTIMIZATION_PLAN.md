# Optimization Plan

## Goals
- Improve perceived speed (first paint, interactivity, smooth scroll/animation).
- Reduce main-thread work and animation overhead, especially on mobile.
- Keep visual quality while improving responsiveness.

## Baseline Measurements
- Run Lighthouse (mobile + desktop) after changes.
- Track Core Web Vitals: LCP, INP, CLS.
- Check JS bundle size and route-specific client JS.

## Performance Bottlenecks (Current)
- Multiple client components with heavy animation logic (framer-motion + scroll-based transforms).
- Hover images in works grid cause double image loads per card in-viewport.
- Offscreen sections render immediately, increasing main-thread work and style/layout cost.
- Large remote images (unsplash/framer) with full quality and wide sizes.
- No connection prewarming for remote image origins.
- Hover/scroll transforms run on mobile where they provide less value and increase main-thread work.

## Phase 1: Quick Wins (Low Risk)
1. Gate infinite animations behind reduced-motion preferences.
2. Trim non-critical animations during offscreen or mobile contexts.
3. Audit image usage for `priority`, `sizes`, and large assets.
4. Ensure caching and revalidation tags are consistent.

## Phase 2: Rendering and Data Strategy
1. Split below-the-fold sections into dynamic client chunks where safe.
2. Consider server-only rendering for non-interactive sections.
3. Use `loading="lazy"` and avoid eager loads for non-critical images.
4. Evaluate Supabase fetch patterns for fan-out and cache hits.

## Phase 3: Visual Performance Budget
1. Reduce heavy motion on dense sections (works, services, process).
2. Limit high-cost effects (blur, blend, backdrop) on mobile.
3. Defer complex animations until after first input.

## Phase 4: Network and Asset Optimization
1. Compress and standardize images in Supabase storage.
2. Use modern formats (AVIF/WebP) for large imagery where possible.
3. Ensure remote image domains are tightly scoped.

## Implementation Order
- Start with reduced-motion gating and animation throttling.
- Follow with image audits and lazy loading adjustments.
- Then evaluate dynamic imports and client/server split.

## Implemented
- Reduced-motion gating for infinite and scroll animations in key sections.
- Added content-visibility for below-the-fold sections and footer.
- Deferred works hover images until user interaction.
- Lowered quality for non-critical images in services/works.
- Reduced hover animations in works when reduced-motion is preferred.
- Added preconnect hints for remote image hosts.
- Disabled hover and scroll transforms on mobile for works/services/process/reachus/hero/section parallax.

## Validation
- Re-run Lighthouse and compare metrics.
- Spot check on mobile for scroll smoothness.
- Verify no regression in layout or navigation.
