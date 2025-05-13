/*Developed by @jams2blues with love for the Tezos community
  File: src/pages/index.js
  Summary: Home hub — deploy / manage / explore CTA (placeholder hidden)
*/

/*──────── imports ────────*/
import React, { useEffect, useState } from 'react';
import PixelButton from '../ui/PixelButton';
import PixelHeading from '../ui/PixelHeading';
import CRTFrame from '../ui/CRTFrame';

/*──────── component ─────*/
export default function Home() {
  const [lastKt1, setLastKt1] = useState(null);

  /* restore last deployed KT1 from localStorage */
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const kt = localStorage.getItem('ZU_LAST_KT1');
    if (kt) setLastKt1(kt);
  }, []);

  return (
    <main style={{ padding: '4rem 1rem' }}>
      <CRTFrame className="surface" style={{ maxWidth: 980, margin: '0 auto' }}>
        <PixelHeading as="h1">ZeroUnbound · V4 Studio</PixelHeading>

        <p style={{ marginBottom: '2rem', maxWidth: 720 }}>
          Deploy your own fully on-chain NFT collection—or manage an existing
          one—using ZeroContract&nbsp;V4. No IPFS, no indexers: pure Tezos bytes.
        </p>

        {/* primary actions */}
        <div style={{
          display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginBottom: '2rem',
        }}
        >
          <PixelButton as="a" href="/deploy" style={{ flex: '1 1 180px' }}>
            ➕ Create&nbsp;Collection
          </PixelButton>

          <PixelButton
            as="a"
            href={lastKt1 ? `/kt1/${lastKt1}` : '#'}
            style={{ flex: '1 1 180px' }}
            disabled={!lastKt1}
            title={lastKt1 ? 'Manage last deployed' : 'Deploy a collection first'}
          >
            ⚙ Manage&nbsp;Last
          </PixelButton>

          <PixelButton as="a" href="/explore" style={{ flex: '1 1 180px' }}>
            🔍 Explore&nbsp;FOC
          </PixelButton>
        </div>

        {/* future multi-manage carousel — hidden for now */}
        {/*
        <CRTFrame className="surface" style={{ marginTop: '2rem' }}>
          <PixelHeading as="h2">Your Collections (v1–v4)</PixelHeading>
          <!-- carousel component goes here once implemented -->
        </CRTFrame>
        */}
      </CRTFrame>
    </main>
  );
}

/* What changed & why
   • Added “Explore” button (will route to upcoming on-chain search page).
   • Hidden future carousel in commented block per instruction.
   • Manage-last button disabled until user deploys/opens a collection.
*/
