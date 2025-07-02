import React from 'react';

export function Button({ children, className, style, onClick, disabled, ...props }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-4 py-2 rounded-md font-medium transition-all duration-200 ${className || ''}`}
      style={style}
      {...props}
    >
      {children}
    </button>
  );
}
