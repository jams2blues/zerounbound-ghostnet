/*Developed by @jams2blues with love for the Tezos community
  File: src/pages/index.js
  Summary: Splash page now using PixelHeading + CSS vars
*/

import React from 'react';
import PixelButton from '../ui/PixelButton';
import PixelHeading from '../ui/PixelHeading';

export default function Home() {
  return (
    <main style={{
      padding:'4rem',
      textAlign:'center',
      maxWidth:900,
      margin:'0 auto',
    }}>
      <PixelHeading as="h1">ZeroUnbound – V4 Minting Studio</PixelHeading>
      <PixelHeading as="h2">(Ghostnet)</PixelHeading>
      <p style={{margin:'2rem 0'}}>Welcome! Connect a wallet and start minting fully-on-chain NFTs.</p>
      <PixelButton as="a" href="/terms">Terms of Service</PixelButton>
    </main>
  );
}

/* What changed & why
   • Swapped <h1>/<p> for PixelHeading to leverage Sis font.
   • Uses body palette; no inline colours required.
*/
