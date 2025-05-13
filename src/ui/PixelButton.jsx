/*Developed by @jams2blues with love for the Tezos community
  File: src/ui/PixelButton.jsx
  Summary: NES-style button now using PixeloidSans
*/

import styled, { css } from 'styled-components';

const border = css`
  border:2px solid var(--zu-fg);
  box-shadow:0 0 0 2px var(--zu-bg),4px 4px 0 0 var(--zu-bg);
`;

const PixelButton = styled.button.attrs(({ as })=>({
  tabIndex:0,
  role: as==='a'?'link':undefined,
}))`
  ${border};
  display:inline-block;
  padding:0.5rem 1.25rem;
  font:700 1rem/1 'PixeloidSans',monospace;
  text-transform:uppercase;
  background:var(--zu-accent);
  color:var(--zu-fg);
  cursor:pointer;
  user-select:none;
  transition:transform 80ms;

  &:hover { background:var(--zu-accent-hover); }
  &:active{ transform:translateY(2px); box-shadow:0 0 0 2px var(--zu-bg); }
  &:focus { outline:none; box-shadow:0 0 0 2px var(--zu-bg),0 0 0 4px #ff2d2d; }

  &[disabled]{
    filter:grayscale(1);
    cursor:not-allowed;
    box-shadow:none;
  }
`;

export default PixelButton;

/* What changed & why
   • Re-pointed font to PixeloidSans and replaced hard #fff/#000 colours
     with CSS vars for dark/light consistency.
*/
