/*Developed by @jams2blues with love for the Tezos community
  File: src/ui/CRTFrame.jsx
  Summary: 9-slice container adding CRT bezel + scanlines
*/

/*─────────────  imports  ────────────────────────────────────────────────────*/
import styled from 'styled-components';

/*─────────────  styled wrapper  ─────────────────────────────────────────────*/
const CRTFrame = styled.div`
  position: relative;
  padding: 1.5rem;
  background: #111;
  border: 4px solid #444;
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
   • Encapsulates CRT bezel effect; optional scanlines respect
     prefers-reduced-motion for a11y.
*/
