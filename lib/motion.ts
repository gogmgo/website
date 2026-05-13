import type { Variants } from "framer-motion"

export const ease = {
  smooth: [0.25, 0.1, 0.25, 1] as [number, number, number, number],
  out: [0, 0, 0.2, 1] as [number, number, number, number],
  cinematic: [0.4, 0, 0.2, 1] as [number, number, number, number],
}

export const fadeUp: Variants = {
  hidden: { opacity: 1, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease: ease.smooth },
  },
}

export const fadeIn: Variants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: { duration: 0.65, ease: ease.out },
  },
}

export const stagger: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
}

export const staggerFast: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07, delayChildren: 0.05 },
  },
}

export const modalBackdrop: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2, ease: ease.out } },
  exit: { opacity: 0, transition: { duration: 0.18, ease: "easeIn" } },
}

export const modalPanel: Variants = {
  hidden: { opacity: 0, scale: 0.96, y: 10 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.28, ease: ease.smooth },
  },
  exit: {
    opacity: 0,
    scale: 0.97,
    y: 6,
    transition: { duration: 0.18, ease: "easeIn" },
  },
}
