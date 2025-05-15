/*Developed by @jams2blues with love for the Tezos community
  File: src/contexts/ThemeContext.js
  Summary: Seven-theme provider (SSR-safe) — no undefined states
*/

import React, {
  createContext, useContext, useState, useEffect,
} from 'react';

/*──────── constants ─────*/
const LS_KEY = 'ZU_THEME_v1';
export const THEMES = [
  'arcade-dark',
  'arcade-light',
  'neon-dark',
  'pastel-light',
  'ocean-dark',
  'terminal-dark',
  'sunset-dark',
];

/*──────── context & hook ─*/
const ThemeCtx = createContext({ theme: THEMES[0], next: () => {} });
export const useTheme = () => useContext(ThemeCtx);

/*──────── provider ──────*/
export function ThemeProvider({ children }) {
  const isBrowser = typeof window !== 'undefined';

  /* pick initial theme deterministically (never undefined) */
  const [theme, setTheme] = useState(() => {
    if (!isBrowser) return THEMES[0];                  // SSR: arcade-dark
    const saved = localStorage.getItem(LS_KEY);
    if (saved && THEMES.includes(saved)) return saved;
    return window.matchMedia('(prefers-color-scheme: light)').matches
      ? 'arcade-light'
      : 'arcade-dark';
  });

  /* push token to <html> and persist */
  useEffect(() => {
    if (!isBrowser) return;
    document.documentElement.dataset.theme = theme;
    localStorage.setItem(LS_KEY, theme);
  }, [theme, isBrowser]);

  const next = () => setTheme(
    (prev) => THEMES[(THEMES.indexOf(prev) + 1) % THEMES.length],
  );

  return (
    <ThemeCtx.Provider value={{ theme, next }}>
      {children}
    </ThemeCtx.Provider>
  );
}

/* What changed & why
   • Guarantees `theme` is *never undefined* — fixes “Theme › undefined”
     text mismatch and the React hydration warning.
   • No import cycles; THEMES constant lives only here and is re-used in
     globalStyles via named import.
*/
