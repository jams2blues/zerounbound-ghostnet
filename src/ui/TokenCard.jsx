/*Developed by @jams2blues with love for the Tezos community
  File: src/ui/TokenCard.jsx
  Summary: Token preview with SVG fallback and copy-ID burst
*/

import React, { useState } from 'react';
import styled from 'styled-components';
import PixelButton from './PixelButton';
import SuccessBurst from './SuccessBurst';
import coverSvg from '../../public/sprites/cover_default.svg';

const Frame = styled.div`
  border:2px solid var(--zu-fg);
  background:var(--zu-bg-alt);
  padding:.75rem;
  width:160px;position:relative;
  display:flex;flex-direction:column;align-items:center;
  box-shadow:4px 4px 0 0 var(--zu-bg);
`;

const Img = styled.img`
  width:128px;height:128px;object-fit:cover;margin-bottom:.5rem;
`;

export default function TokenCard({
  src = coverSvg.src, title, tokenId, kt1,
}) {
  const [burst, setBurst] = useState(false);

  function copy() {
    navigator.clipboard.writeText(`${kt1}:${tokenId}`);
    setBurst(true);
    setTimeout(() => setBurst(false), 900);
  }

  return (
    <Frame>
      <Img src={src} alt={title} />
      <strong style={{ fontSize: '.9rem', textAlign: 'center' }}>{title}</strong>
      <small>ID #{tokenId}</small>
      <PixelButton
        onClick={copy}
        style={{ fontSize: '.7rem', marginTop: '.5rem', padding: '.25rem .6rem' }}
      >
        Copy&nbsp;ID
      </PixelButton>
      {burst && <SuccessBurst style={{ position: 'absolute', top: -12, right: -12 }} />}
    </Frame>
  );
}

/* What changed & why
   • Uses SVG default cover, clipboard copy now triggers SuccessBurst for
     satisfying feedback.
*/
