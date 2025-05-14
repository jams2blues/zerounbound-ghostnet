/*Developed by @jams2blues with love for the Tezos community
  File: src/ui/ContractCarousel.jsx
  Summary: Horizontal scroll of user collections (v1–v4)
*/

import React from 'react';
import styled from 'styled-components';
import CollectionCard from './CollectionCard';

const Rail = styled.div`
  display:flex;gap:1rem;overflow-x:auto;padding-bottom:1rem;
  &::-webkit-scrollbar{height:8px}
  &::-webkit-scrollbar-thumb{background:var(--zu-accent-dark)}
`;

export default function ContractCarousel({ items = [] }) {
  return (
    <Rail>
      {items.map((it) => (
        <CollectionCard key={it.kt1} {...it} />
      ))}
    </Rail>
  );
}

/* What changed & why
   • Simple flex-rail; browsers fallback without custom scrollbars.
*/
