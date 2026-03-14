import type { Transition, Variants } from "framer-motion";

export const PREMIUM_EASE = [0.22, 1, 0.36, 1] as const;

export const REVEAL_VIEWPORT = {
  once: true,
  margin: "-10% 0px -15% 0px",
  amount: 0.22,
} as const;

export const FAST_REVEAL: Transition = {
  duration: 0.45,
  ease: PREMIUM_EASE,
};

export const BASE_REVEAL: Transition = {
  duration: 0.7,
  ease: PREMIUM_EASE,
};

export const SLOW_REVEAL: Transition = {
  duration: 0.95,
  ease: PREMIUM_EASE,
};

export const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: BASE_REVEAL,
  },
};

export const staggerContainer = (delayChildren = 0.12, staggerChildren = 0.08): Variants => ({
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { delayChildren, staggerChildren },
  },
});
