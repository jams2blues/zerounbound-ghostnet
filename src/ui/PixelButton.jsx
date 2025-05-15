/*Developed by @jams2blues with love for the Tezos community
  File: src/ui/PixelButton.jsx
  Summary: Accent-secondary styling via [data-sec] flag
*/

/*──────── imports ────────*/
import styled, { css } from 'styled-components';

/*──────── shared style ──*/
const base = css`
  border:2px solid var(--zu-fg);
  box-shadow:0 0 0 2px var(--zu-bg),4px 4px 0 0 var(--zu-bg);
  display:inline-block;
  padding:0.5rem 1.25rem;
  font:700 1rem/1 'PixeloidSans',monospace;
  text-transform:uppercase;
  background:var(--zu-accent);
  color:#000;
  cursor:pointer;
  user-select:none;
  transition:transform 80ms,filter 80ms,background 120ms;
  &:hover{background:var(--zu-accent-hover);}
  &:active{transform:translateY(2px);box-shadow:0 0 0 2px var(--zu-bg);}
  &:focus{outline:none;box-shadow:0 0 0 2px #fff,0 0 0 4px #ff2d2d;}
  &[disabled]{filter:grayscale(1);cursor:not-allowed;box-shadow:none;}
`;

/* secondary palette for Header CTAs */
const sec = css`
  background:var(--zu-accent-sec);
  &:hover{background:var(--zu-accent-sec-hover);}
`;

const PixelButton = styled.button.attrs(({ as }) => ({
  tabIndex:0, role:as==='a'?'link':undefined,
}))`
  ${base}
  &[data-sec]{${sec}}
`;

export default PixelButton;

/* What changed & why
   • Supports `data-sec` attribute → header CTAs use secondary magenta accent.
*/
