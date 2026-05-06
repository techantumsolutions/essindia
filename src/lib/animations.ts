/**
 * Premium Animation System Configuration
 * Inspired by Stripe, Linear, and Apple
 */

export const transition = {
  duration: 0.8,
  ease: [0.22, 1, 0.36, 1],
};

export const staggerTransition = {
  staggerChildren: 0.12,
  delayChildren: 0.1,
};

export const variants = {
  fadeUp: {
    initial: { opacity: 0, y: 30, filter: 'blur(10px)' },
    animate: { 
      opacity: 1, 
      y: 0, 
      filter: 'blur(0px)',
      transition 
    },
  },
  fadeIn: {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1, 
      transition: { ...transition, duration: 1 } 
    },
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.94, filter: 'blur(8px)' },
    animate: { 
      opacity: 1, 
      scale: 1, 
      filter: 'blur(0px)',
      transition 
    },
  },
  staggerContainer: {
    initial: {},
    animate: {
      transition: staggerTransition,
    },
  },
  textReveal: {
    initial: { y: '100%', opacity: 0 },
    animate: { 
      y: 0, 
      opacity: 1,
      transition: { ...transition, duration: 1 } 
    },
  },
  blurReveal: {
    initial: { filter: 'blur(20px)', opacity: 0 },
    animate: { 
      filter: 'blur(0px)', 
      opacity: 1,
      transition: { ...transition, duration: 1.2 } 
    },
  }
};
