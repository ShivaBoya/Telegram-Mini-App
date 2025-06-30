import React from 'react';

export function Card({ children, className = '', ...props }) {
  return (
    <div {...props} className={className}>
      {children}
    </div>
  );
}

export function CardContent({ children, className = '', ...props }) {
  return (
    <div {...props} className={className}>
      {children}
    </div>
  );
}
