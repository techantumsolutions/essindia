'use client';

import { motion } from 'framer-motion';
import { variants } from '@/lib/animations';

interface TextRevealProps {
  text: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span';
  delay?: number;
}

export function TextReveal({ 
  text, 
  className = '', 
  as: Component = 'h2',
  delay = 0 
}: TextRevealProps) {
  const words = text.split(' ');

  return (
    <Component className={`${className} flex flex-wrap gap-x-[0.2em] gap-y-[0.1em]`}>
      {words.map((word, i) => (
        <span key={i} className="relative inline-flex overflow-hidden">
          <motion.span
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{
              duration: 0.8,
              ease: [0.22, 1, 0.36, 1],
              delay: delay + (i * 0.05),
            }}
            className="inline-block whitespace-nowrap"
          >
            {word}
          </motion.span>
        </span>
      ))}
    </Component>
  );
}

export function BlurReveal({ text, className = '', delay = 0 }: TextRevealProps) {
  return (
    <motion.span
      initial={{ filter: 'blur(20px)', opacity: 0, y: 20 }}
      whileInView={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 1.2,
        ease: [0.22, 1, 0.36, 1],
        delay,
      }}
      className={`${className} inline-block`}
    >
      {text}
    </motion.span>
  );
}
