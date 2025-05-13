/*Developed by @jams2blues with love for the Tezos community
  File: src/ui/TokenCard.jsx
  Summary: Token preview (image sprite, title, id, copy button)
*/

import React from 'react';
import styled from 'styled-components';
import PixelButton from './PixelButton';

const Frame = styled.div`
  border:2px solid var(--zu-fg);
  background:var(--zu-bg-alt);
  padding:.75rem;
  width:160px;
  display:flex;flex-direction:column;align-items:center;
  box-shadow:4px 4px 0 0 var(--zu-bg);
`;

const Img = styled.img`
  width:128px;height:128px;object-fit:cover;margin-bottom:.5rem;
`;

export default function TokenCard({
  src = '/sprites/cover_default.png',
  title,
  tokenId,
  kt1,
}) {
  return (
    <Frame>
      <Img src={src} alt={title} />
      <strong style={{ fontSize: '.9rem', textAlign: 'center' }}>{title}</strong>
      <small>ID #{tokenId}</small>
      <PixelButton
        onClick={() => navigator.clipboard.writeText(`${kt1}:${tokenId}`)}
        style={{ fontSize: '.7rem', marginTop: '.5rem', padding: '.25rem .6rem' }}
      >
        Copy ID
      </PixelButton>
    </Frame>
  );
}

/* What changed & why
   • NES-style token card with fallback image and clipboard button—no links to
     external explorers.
*/
