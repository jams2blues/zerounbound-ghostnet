/*Developed by @jams2blues with love for the Tezos community
  File: src/ui/PixelInput.jsx
  Summary: 8-bit text input with fat caret & focus border
*/

import styled from 'styled-components';

const PixelInput = styled.input.attrs(({ type })=>({
  type: type || 'text',
}))`
  display:inline-block;
  padding:0.4rem 0.6rem;
  min-width:200px;
  font:400 1rem/1 'PixeloidMono',monospace;
  color:var(--zu-fg);
  background:var(--zu-bg);
  border:2px solid var(--zu-fg);
  box-shadow:0 0 0 2px var(--zu-bg),4px 4px 0 0 var(--zu-bg);
  caret-color:var(--zu-accent);

  &:focus{
    outline:none;
    border-color:var(--zu-accent-hover);
  }

  &::placeholder{opacity:0.6}
`;

export default PixelInput;

/* What changed & why
   • Provides pixel-perfect input control used in upcoming MintWizard steps.
*/
