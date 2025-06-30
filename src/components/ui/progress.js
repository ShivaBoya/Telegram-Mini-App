import React from 'react';

export function Progress({ value, className = '', indicatorClassName = '', ...props }) {
  return (
    <div
      {...props}
      className={`relative w-full  bg-gray-300 rounded-full overflow-hidden ${className}`}
    >
      <div
        className={`h-full bg-green-500 transition-all duration-300 ${indicatorClassName}`}
        style={{ width: `${Math.min(value, 100)}%` }}
      />
    </div>
  );
}
