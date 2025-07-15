import React from 'react';
import { cn } from '../../utils/cn';

export function Card({ children, className, style, variant = 'default', ...props }) {
  const baseClass = 'rounded-lg border shadow-sm transition-all duration-200';
  
  const variantStyle = variant === 'dashed' 
    ? { borderStyle: 'dashed' }
    : {};

  return (
    <div
      className={cn(baseClass, className)}
      style={{ ...variantStyle, ...style }}
      {...props}
    >
      {children}
    </div>
  );
}
