/*Developed by @jams2blues with love for the Tezos community
  File: src/ui/CollectionCard.jsx
  Summary: 8-bit collection preview card (name + supply)
*/

import React from 'react';
import styled from 'styled-components';
import PixelHeading from './PixelHeading';
import PixelButton from './PixelButton';

const Card = styled.div`
  border:2px solid var(--zu-fg);
  background:var(--zu-bg-alt);
  padding:1rem;
  max-width:220px;
  box-shadow:4px 4px 0 0 var(--zu-bg);
`;

export default function CollectionCard({
  name, kt1, supply,
}) {
  return (
    <Card>
      <PixelHeading as="h3" style={{ fontSize: '1.25rem' }}>{name}</PixelHeading>
      <p style={{ margin: '.5rem 0' }}>Total tokens: {supply}</p>
      <PixelButton
        as="a"
        href={`/kt1/${kt1}`}
        style={{ fontSize: '.8rem', padding: '.3rem .7rem' }}
      >
        View →
      </PixelButton>
    </Card>
  );
}

/* What changed & why
   • Provides reusable card listing with KT1 link, keeping NES border aesthetic.
*/
