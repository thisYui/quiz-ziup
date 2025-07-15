import React from 'react';
import { cn } from '../../utils/cn';

export function Label({ htmlFor, className, style, children, variant = 'default', ...props }) {
  const baseClass = variant === 'quiz' 
    ? 'block text-lg font-medium mb-3' 
    : 'block mb-1';
  
  const variantStyle = variant === 'quiz' 
    ? { color: '#F5F5F5' }
    : {};

  return (
    <label
      htmlFor={htmlFor}
      className={cn(baseClass, className)}
      style={{ ...variantStyle, ...style }}
      {...props}
    >
      {children}
    </label>
  );
}
