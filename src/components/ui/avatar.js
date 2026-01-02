import React from 'react';

export function Avatar({ children, className = '', ...props }) {
  return (
    <div {...props} className={className}>
      {children}
    </div>
  );
}

export function AvatarImage({ src, alt, className = '', ...props }) {
  if (!src) return null;
  return (
    <img src={src} alt={alt} className={className} {...props} />
  );
}

export function AvatarFallback({ children, className = '', ...props }) {
  return (
    <div {...props} className={className}>
      {children}
    </div>
  );
}
