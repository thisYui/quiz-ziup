import React from 'react';

export function ErrorMessage({ message }) {
  return (
    <div className="text-red-500 text-sm">
      {message}
    </div>
  );
}