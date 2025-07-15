import React from 'react';
import { cn } from '../../utils/cn';

export function Input({ id, type, value, onChange, className, style, placeholder, variant = 'default', ...props }) {
  const baseClass = variant === 'quiz' 
    ? 'w-full px-6 py-4 rounded-lg border text-lg transition-colors focus:outline-none focus:ring-2'
    : 'w-full px-3 py-2 rounded-md border transition-all duration-200';
  
  const variantStyle = variant === 'quiz' 
    ? {
        backgroundColor: '#2A2A2A',
        borderColor: '#666666',
        color: '#F5F5F5',
        '--tw-ring-color': '#2563EB'
      }
    : {};

  return (
    <input
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={cn(baseClass, className)}
      style={{ ...variantStyle, ...style }}
      {...props}
    />
  );
}
