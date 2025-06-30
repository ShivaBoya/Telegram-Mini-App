import React from 'react';

export function Button({ children, className = '', variant, size, ...props }) {
  // We strip variant and size so they don't end up on the native button element.
  return (
    <button {...props} className={className}>
      {children}
    </button>
  );
}
