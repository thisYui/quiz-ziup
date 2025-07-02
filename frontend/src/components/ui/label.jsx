import React from 'react';

export function Label({ htmlFor, className, style, children, ...props }) {
  return (
    <label
      htmlFor={htmlFor}
      className={`block mb-1 ${className || ''}`}
      style={style}
      {...props}
    >
      {children}
    </label>
  );
}
