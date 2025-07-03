import React from 'react';
import { cn } from '../../utils/cn';

export function Button({ children, className, style, onClick, disabled, variant = 'default', ...props }) {
  const baseClass = variant === 'gradient' 
    ? 'px-4 py-2 rounded-lg font-medium text-white transition-all duration-200 hover:shadow-lg hover:scale-[1.02]' 
    : 'px-4 py-2 rounded-md font-medium transition-all duration-200';

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(baseClass, className)}
      style={style}
      {...props}
    >
      {children}
    </button>
  );
}
