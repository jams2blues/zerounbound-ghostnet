/*Developed by @jams2blues with love for the Tezos community
  File: src/ui/CRTFrame.jsx
  Summary: 9-slice CRT bezel — now palette-aware (var-based colours) so
           background + border update when the user switches theme.
*/

/*──────── imports ───────────────────────────────────────────*/
import styled from 'styled-components';

/*──────── styled wrapper ────────────────────────────────────*/
const CRTFrame = styled.div`
  position: relative;
  padding: 1.5rem;
  background: var(--zu-bg-alt);          /* ← was hard-coded #111 */
  border: 4px solid var(--zu-fg);        /* ← was #444 — follows theme */
  border-radius: 12px;
  box-shadow:
    inset 0 0 8px #000,
    0 4px 0 #000,
    0 4px 8px rgba(0,0,0,0.6);

  /*–– optional scanlines ––*/
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
    background: repeating-linear-gradient(
      to bottom,
      rgba(255,255,255,0.05) 0,
      rgba(255,255,255,0.05) 1px,
      transparent 1px,
      transparent 3px
    );
    mix-blend-mode: overlay;
  }

  @media (prefers-reduced-motion: reduce) {
    &::before { display: none; }
  }
`;

export default CRTFrame;

/* What changed & why
   • Replaced fixed #111 background with `var(--zu-bg-alt)` and #444 border
     with `var(--zu-fg)`, so CRT bezel colours follow the active theme
     palettes defined in globalStyles.js. This makes the whole site visually
     update when the user cycles themes (issue reported in screenshot).
*/
