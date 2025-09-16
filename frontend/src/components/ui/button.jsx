import React from 'react';
import { cn } from '../../utils/cn';

export const Button = React.forwardRef(function Button({ children, className, style, onClick, disabled, variant = 'default', size = 'md', ...props }, ref) {
  const baseClass = variant === 'gradient'
    ? 'inline-flex items-center justify-center px-4 py-2 rounded-lg font-medium text-white transition-all duration-200 hover:shadow-lg hover:scale-[1.02]'
    : variant === 'outline'
      ? 'inline-flex items-center justify-center px-4 py-2 rounded-md font-medium transition-all duration-200 border bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800'
      : 'inline-flex items-center justify-center px-4 py-2 rounded-md font-medium transition-all duration-200 bg-primary text-white hover:bg-primary/90';

  const sizeClass = size === 'sm'
    ? 'text-sm px-3 py-1.5'
    : size === 'lg'
      ? 'text-lg px-5 py-3'
      : '';

  return (
    <button
      ref={ref}
      onClick={onClick}
      disabled={disabled}
      className={cn(baseClass, sizeClass, 'cursor-pointer', className)}
      style={style}
      {...props}
    >
      {children}
    </button>
  );
});
