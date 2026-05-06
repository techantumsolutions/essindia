'use client';

import React, { useRef, useState, useCallback, useEffect } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import { cn } from '@/lib/utils';

export const Spotlight = ({
  children,
  className,
  size = 400,
  opacity = 0.15,
  color = 'rgba(124, 58, 237, 1)', // Purple
}: {
  children: React.ReactNode;
  className?: string;
  size?: number;
  opacity?: number;
  color?: string;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const mouseX = useSpring(0, { stiffness: 300, damping: 30 });
  const mouseY = useSpring(0, { stiffness: 300, damping: 30 });

  const handleMouseMove = useCallback(
    ({ currentTarget, clientX, clientY }: React.MouseEvent) => {
      const { left, top } = currentTarget.getBoundingClientRect();
      mouseX.set(clientX - left);
      mouseY.set(clientY - top);
    },
    [mouseX, mouseY]
  );

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn('relative overflow-hidden group', className)}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px transition duration-300 z-30"
        style={{
          background: `radial-gradient(${size}px circle at ${mouseX}px ${mouseY}px, ${color.replace('1)', opacity + ')')}, transparent 80%)`,
          opacity: isHovered ? 1 : 0,
        }}
      />
      {children}
    </div>
  );
};
