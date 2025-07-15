import React from 'react';
import { cn } from '../../utils/cn';

export function Progress({ value, className, style, max = 100, ...props }) {
  const baseClass = 'w-full bg-gray-200 rounded-full dark:bg-gray-700 overflow-hidden';
  
  const fillerStyle = {
    width: `${(value / max) * 100}%`,
    backgroundColor: '#2563EB', // Default color, can be overridden via style prop
    height: '100%',
    transition: 'width 0.2s ease-in-out'
  };

  return (
    <div
      className={cn(baseClass, className)}
      style={style}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin="0"
      aria-valuemax={max}
      {...props}
    >
      <div style={fillerStyle} />
    </div>
  );
}
