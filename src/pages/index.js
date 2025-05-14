/*Developed by @jams2blues with love for the Tezos community
  File: src/pages/index.js
  Summary: Home hub — clear Create / Manage / Explore CTAs
*/

/*──────── imports ────────*/
import React from 'react';
import PixelButton from '../ui/PixelButton';
import PixelHeading from '../ui/PixelHeading';
import CRTFrame from '../ui/CRTFrame';

/*──────── component ─────*/
export default function Home() {
  return (
    <main style={{ padding: '4rem 1rem' }}>
      <CRTFrame className="surface" style={{ maxWidth: 960, margin: '0 auto' }}>
        <PixelHeading as="h1">ZeroUnbound · V4 Studio</PixelHeading>

        <p style={{ marginBottom: '2rem', maxWidth: 720 }}>
          Create fully on-chain NFT collections, mint, and explore—pure Tezos
          bytes. No IPFS. No indexers.
        </p>

        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
          <PixelButton as="a" href="/deploy" style={{ flex: '1 1 180px' }}>
            ➕ Create&nbsp;Collection
          </PixelButton>

          <PixelButton as="a" href="/manage" style={{ flex: '1 1 180px' }}>
            ⚙ Manage&nbsp;Collections
          </PixelButton>

          <PixelButton as="a" href="/explore" style={{ flex: '1 1 180px' }}>
            🔍 Explore&nbsp;FOC
          </PixelButton>
        </div>
      </CRTFrame>
    </main>
  );
}

/* What changed & why
   • Removed “Manage Last” logic; single Manage button routes to /manage
     carousel page for clarity.
*/
