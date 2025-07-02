import React from 'react';

export function Input({ id, type, value, onChange, className, style, placeholder, ...props }) {
  return (
    <input
      id={id}
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`w-full px-3 py-2 rounded-md border transition-all duration-200 ${className || ''}`}
      style={style}
      {...props}
    />
  );
}
