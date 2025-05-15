/*Developed by @jams2blues with love for the Tezos community
  File: src/ui/ThemeToggle.jsx
  Summary: Hydration-safe floating theme switch with id hook
*/

import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import PixelButton from './PixelButton';

export default function ThemeToggle() {
  const { theme, next } = useTheme();
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  return (
    <PixelButton
      id="zu-theme-toggle"
      suppressHydrationWarning
      onClick={next}
      style={{
        position: 'fixed', bottom: 20, right: 20,
        zIndex: 1001, fontSize: '0.8rem', padding: '0.4rem 0.9rem',
      }}
    >
      {hydrated ? `Theme › ${theme}` : 'Theme'}
    </PixelButton>
  );
}
