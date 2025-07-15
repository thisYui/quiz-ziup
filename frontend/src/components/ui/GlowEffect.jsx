import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

export function GlowEffect({
  className,
  style,
  colors = ['#9333EA', '#DB2777', '#2563EB', '#14B8A6'],
  mode = 'rotate',
  blur = 'medium',
  scale = 1,
  duration = 5,
}) {
  const BASE_TRANSITION = {
    repeat: Infinity,
    duration: duration,
    ease: 'linear',
  };

  const animations = {
    rotate: {
      background: [
        `conic-gradient(from 0deg at 50% 50%, ${colors.join(', ')})`,
        `conic-gradient(from 360deg at 50% 50%, ${colors.join(', ')})`,
      ],
      transition: BASE_TRANSITION,
    },
    pulse: {
      background: colors.map(
        (color) =>
          `radial-gradient(circle at 50% 50%, ${color} 0%, transparent 100%)`
      ),
      scale: [1 * scale, 1.1 * scale, 1 * scale],
      opacity: [0.5, 0.8, 0.5],
      transition: {
        ...BASE_TRANSITION,
        repeatType: 'mirror',
      },
    },
    static: {
      background: `linear-gradient(to right, ${colors.join(', ')})`,
    },
    breathe: {
      background: colors.map(
        (color) =>
          `radial-gradient(circle at 50% 50%, ${color} 0%, transparent 100%)`
      ),
      scale: [1 * scale, 1.05 * scale, 1 * scale],
      transition: {
        ...BASE_TRANSITION,
        repeatType: 'mirror',
      },
    },
    colorShift: {
      background: colors.map((color, index) => {
        const nextColor = colors[(index + 1) % colors.length];
        return `conic-gradient(from 0deg at 50% 50%, ${color} 0%, ${nextColor} 50%, ${color} 100%)`;
      }),
      transition: {
        ...BASE_TRANSITION,
        repeatType: 'mirror',
      },
    },
    flowHorizontal: {
      background: colors.map((color) => {
        const nextColor = colors[(colors.indexOf(color) + 1) % colors.length];
        return `linear-gradient(to right, ${color}, ${nextColor})`;
      }),
      transition: {
        ...BASE_TRANSITION,
        repeatType: 'mirror',
      },
    },
  };

  const getBlurClass = (blur) => {
    if (typeof blur === 'number') {
      return `blur-[${blur}px]`;
    }

    const presets = {
      softest: 'blur-sm',
      soft: 'blur',
      medium: 'blur-md',
      strong: 'blur-lg',
      stronger: 'blur-xl',
      strongest: 'blur-xl',
      none: 'blur-none',
    };

    return presets[blur];
  };

  return (
    <motion.div
      style={{
        ...style,
        '--scale': scale,
        willChange: 'transform',
        backfaceVisibility: 'hidden',
      }}
      animate={animations[mode]}
      className={cn(
        'pointer-events-none absolute inset-0 h-full w-full',
        'scale-[var(--scale)] transform-gpu',
        getBlurClass(blur),
        className
      )}
    />
  );
}
