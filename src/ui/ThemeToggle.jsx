/*Developed by @jams2blues with love for the Tezos community
  File: src/ui/ThemeToggle.jsx
  Summary: Client-hydrated theme switch — avoids SSR text mismatch
*/

/*──────── imports ────────*/
import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import PixelButton from './PixelButton';

/*──────── component ──────*/
export default function ThemeToggle() {
  const { theme, next } = useTheme();
  const [hydrated, setHydrated] = useState(false);

  /* flag once client JS has mounted to prevent
     “text content does not match server HTML” */
  useEffect(() => setHydrated(true), []);

  return (
    <PixelButton
      onClick={next}
      style={{
        position: 'fixed',
        bottom: 16,
        right: 16,
        zIndex: 1001,
        fontSize: '0.75rem',
        padding: '0.4rem 0.8rem',
      }}
    >
      {hydrated ? `Theme › ${theme}` : 'Theme'}
    </PixelButton>
  );
}

/* What changed & why
   • Uses `hydrated` flag so server HTML prints static “Theme”, then client
     replaces with dynamic “Theme › {theme}” after hydration — eliminating the
     React “text content does not match server-rendered HTML” warning.
   • Removes `&nbsp;` entities, uses normal space + glyph to ensure identical
     text across SSR/CSR.
*/
