/*Developed by @jams2blues with love for the Tezos community
  File: src/ui/PixelButton.jsx
  Summary: 8-bit button — max-width 100% on small screens to prevent
           overflow, and inline-flex centring for nicer label wrap.
*/

import styled, { css } from 'styled-components';

const base = css`
  border: 2px solid var(--zu-fg);
  box-shadow: 0 0 0 2px var(--zu-bg), 4px 4px 0 0 var(--zu-bg);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 1.25rem;
  font: 700 1rem/1 'PixeloidSans', monospace;
  text-transform: uppercase;
  background: var(--zu-accent);
  color: var(--zu-btn-fg);
  cursor: pointer;
  user-select: none;
  transition: transform 80ms, filter 80ms, background 120ms;
  max-width: 100%;           /* ⬅ prevent horizontal overflow */
  &:hover   { background: var(--zu-accent-hover); }
  &:active  { transform: translateY(2px); box-shadow: 0 0 0 2px var(--zu-bg); }
  &:focus   { outline: none; box-shadow: 0 0 0 2px #fff, 0 0 0 4px #ff2d2d; }
  &[disabled]{filter:grayscale(1);cursor:not-allowed;box-shadow:none;}
`;

const sec = css`
  background: var(--zu-accent-sec);
  &:hover{background:var(--zu-accent-sec-hover);}
`;

const PixelButton = styled.button`
  ${base}
  &[data-sec]{${sec}}
`;
export default PixelButton;

/* What changed & why
   • max-width 100% prevents header CTAs from pushing viewport width on iOS.
   • inline-flex ensures text centres when it wraps on narrow screens.
*/
