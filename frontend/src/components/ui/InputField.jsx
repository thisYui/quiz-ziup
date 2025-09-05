import React from 'react';
import { Input } from './input';
import { Label } from './label';

export function InputField({
  id,
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  required = false,
  className = '',
}) {
  return (
    <div>
      <Label htmlFor={id} className="text-lg font-medium mb-3" style={{ color: '#F5F5F5' }}>
        {label}
      </Label>
      <Input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`px-6 py-4 rounded-lg border text-lg transition-colors focus:outline-none focus:ring-2 ${className}`}
        style={{
          backgroundColor: '#2A2A2A',
          borderColor: '#666666',
          color: '#F5F5F5',
          '--tw-ring-color': '#2563EB'
        }}
        required={required}
      />
    </div>
  );
}