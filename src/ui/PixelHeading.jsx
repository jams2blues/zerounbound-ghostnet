/*Developed by @jams2blues with love for the Tezos community
  File: src/ui/PixelHeading.jsx
  Summary: Reusable heading component (h1–h3) using Sis font
*/

import styled from 'styled-components';

const sizes = {
  h1: '3rem',
  h2: '2.25rem',
  h3: '1.5rem',
};

const PixelHeading = styled.h1.attrs(({ as='h1' })=>({ as }))`
  font-family:'Sis',sans-serif;
  font-size:${({ as })=>sizes[as]||'1.5rem'};
  font-weight:700;
  text-transform:uppercase;
  margin:0 0 1rem;
`;

export default PixelHeading;

/* What changed & why
   • Adds size-mapped heading element so pages can stay semantic without
     repeating font rules.
*/
