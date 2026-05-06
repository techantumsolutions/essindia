'use client';

import { motion, HTMLMotionProps, Variant } from 'framer-motion';
import { variants } from '@/lib/animations';
import { ReactNode } from 'react';

interface MotionSectionProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  variant?: keyof typeof variants;
  delay?: number;
}

export function MotionSection({ 
  children, 
  variant = 'fadeUp', 
  delay = 0,
  ...props 
}: MotionSectionProps) {
  const selectedVariant = variants[variant];
  
  return (
    <motion.div
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, margin: '-10% 0px' }}
      variants={{
        initial: selectedVariant.initial,
        animate: {
          ...selectedVariant.animate,
          transition: {
            ...(selectedVariant.animate as any).transition,
            delay,
          }
        }
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function StaggerContainer({ children, delay = 0, ...props }: MotionSectionProps) {
  return (
    <motion.div
      initial="initial"
      whileInView="animate"
      viewport={{ once: true, margin: '-10% 0px' }}
      variants={{
        initial: {},
        animate: {
          transition: {
            staggerChildren: 0.1,
            delayChildren: delay,
          }
        }
      }}
      {...props}
    >
      {children}
    </motion.div>
  );
}
