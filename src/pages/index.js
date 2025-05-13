/*Developed by @jams2blues with love for the Tezos community
  File: src/pages/index.js
  Summary: Splash page placeholder until MintWizard is coded
*/

import React from 'react';
import PixelButton from '../ui/PixelButton';

export default function Home() {
  return (
    <main style={{ padding: '4rem', textAlign: 'center' }}>
      <h1>ZeroUnbound – V4 Minting Studio (Ghostnet)</h1>
      <p>Welcome! Connect a wallet and start minting fully-on-chain NFTs.</p>
      <PixelButton as="a" href="/terms">Terms of Service</PixelButton>
    </main>
  );
}

/* What changed & why
   • Supplies a minimal React component so Next.js route / renders 200 OK.
*/
