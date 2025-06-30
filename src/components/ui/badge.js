import React from 'react';

export function Badge({ children, className = '', ...props }) {
  return (
    <span {...props} className={className}>
      {children}
    </span>
  );
}
