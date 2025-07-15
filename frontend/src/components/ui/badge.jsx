import React from 'react';
import { cn } from '../../utils/cn';

export function Badge({ children, className, style, variant = 'default', ...props }) {
  const baseClass = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
  
  const variantClass = variant === 'secondary' 
    ? 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200' 
    : 'bg-primary text-white';

  return (
    <span
      className={cn(baseClass, variantClass, className)}
      style={style}
      {...props}
    >
      {children}
    </span>
  );
}
