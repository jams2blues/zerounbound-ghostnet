/*Developed by @jams2blues with love for the Tezos community
  File: src/ui/PixelHeading.jsx
  Summary: Heading component using PixeloidSansBold
*/

import styled from 'styled-components';

const sizes = { h1: '2.75rem', h2: '2rem', h3: '1.5rem' };

const PixelHeading = styled.h1.attrs(({ as = 'h1' }) => ({ as }))`
  font-family:'PixeloidSansBold',monospace;
  font-size:${({ as }) => sizes[as] || '1.25rem'};
  font-weight:700;
  text-transform:uppercase;
  margin:0 0 1rem;
`;

export default PixelHeading;

/* What changed & why
   • Switched heading font from Sis to PixeloidSansBold for cohesive single-family
     typographic system.
*/
