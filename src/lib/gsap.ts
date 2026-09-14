"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(useGSAP, ScrollTrigger);

/** Every animation lives inside this query, so reduced-motion visitors get the static page. */
export const MOTION_OK = "(prefers-reduced-motion: no-preference)";

/** Mirrors the site's editorial ease [0.16, 1, 0.3, 1]. */
export const EASE = "expo.out";

/** Pointer-follow parallax for [data-mouse="<depth px>"] elements. Returns a cleanup. */
export function mouseParallax(scope: HTMLElement) {
  if (!window.matchMedia("(pointer: fine)").matches) return () => {};
  const movers = gsap.utils.toArray<HTMLElement>("[data-mouse]", scope).map((el) => ({
    x: gsap.quickTo(el, "x", { duration: 0.9, ease: "power3" }),
    y: gsap.quickTo(el, "y", { duration: 0.9, ease: "power3" }),
    depth: Number(el.dataset.mouse) || 20,
  }));
  const onMove = (e: PointerEvent) => {
    const nx = e.clientX / window.innerWidth - 0.5;
    const ny = e.clientY / window.innerHeight - 0.5;
    for (const m of movers) {
      m.x(nx * m.depth);
      m.y(ny * m.depth);
    }
  };
  window.addEventListener("pointermove", onMove);
  return () => window.removeEventListener("pointermove", onMove);
}

/** Slow idle bob for [data-float] elements. */
export function floatLoop(scope: HTMLElement) {
  gsap.utils.toArray<HTMLElement>("[data-float]", scope).forEach((el, i) => {
    gsap.to(el, {
      y: i % 2 ? 16 : -20,
      rotate: i % 2 ? -6 : 7,
      duration: 3.4 + i * 0.7,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    });
  });
}

/** Rise-in on scroll for [data-rise] elements. Starts hidden only once motion is confirmed. */
export function riseOnScroll(scope: HTMLElement) {
  const els = gsap.utils.toArray<HTMLElement>("[data-rise]", scope);
  gsap.set(els, { y: 60, autoAlpha: 0 });
  ScrollTrigger.batch(els, {
    start: "top 88%",
    once: true,
    onEnter: (batch) =>
      gsap.to(batch, { y: 0, autoAlpha: 1, duration: 1.1, ease: EASE, stagger: 0.09 }),
  });
}

export { gsap, ScrollTrigger, useGSAP };
