const ease = {
  /** Expo-out — front-loaded, slow settle. The "Framer/editorial" feel. */
  editorial: [0.16, 1, 0.3, 1] as const,
  /** Gentle quart-out — for micro-interactions. */
  gentle: [0.22, 1, 0.36, 1] as const,
  /** Crisp out-cubic — for buttons / chrome. */
  crisp: [0.33, 1, 0.68, 1] as const,
};

/** Scroll-triggered reveal — use on sections / cards. */
export const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.8, ease: ease.editorial },
};

/** Page-load reveal — use on hero stack with staggered children. */
export const reveal = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.9, ease: ease.editorial },
};

/** Stagger orchestration for parent containers with children using `reveal`. */
export const stagger = (delayChildren = 0.1, staggerChildren = 0.08) => ({
  initial: {},
  animate: {
    transition: { delayChildren, staggerChildren },
  },
});

/** Hover micro-interaction — subtle lift, fast snap. */
export const microHover = {
  transition: { duration: 0.2, ease: ease.gentle },
};
