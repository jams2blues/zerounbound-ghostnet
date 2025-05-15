/*Developed by @jams2blues with love for the Tezos community
  File: src/pages/index.js
  Summary: Home hero — centred CRT card with logo & three CTAs
*/

/*──────── imports ────────*/
import React from 'react';
import PixelButton  from '../ui/PixelButton';
import CRTFrame     from '../ui/CRTFrame';
import { HDR_HEIGHT } from '../ui/Header';

/*──────── component ─────*/
export default function Home() {
  return (
    <main
      style={{
        minHeight: `calc(100vh - ${HDR_HEIGHT})`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1rem',
      }}
    >
      <CRTFrame
        className="surface"
        style={{ maxWidth: 620, width: '100%', textAlign: 'center' }}
      >
        {/*── Logo ──*/}
        <img
          src="/sprites/logo.svg"
          alt="Zero Unbound — ZeroContract Studio"
          style={{
            display: 'block',
            margin: '0 auto 1.5rem',
            width: 'clamp(160px, 60%, 280px)',
            height: 'auto',
          }}
        />

        {/*── Tag-line : centred & nicely wrapped on all screens ──*/}
        <p
          style={{
            margin: '0 0 2rem',
            maxWidth: '32ch',
            marginInline: 'auto',
            lineHeight: 1.45,
          }}
        >
          Create fully&nbsp;on-chain NFT collections,&nbsp;mint and explore
          pure&nbsp;Tezos bytes.<br />
          <strong>No&nbsp;IPFS. No&nbsp;indexers.</strong>
        </p>

        {/*── CTAs ──*/}
        <PixelButton
          as="a"
          href="/deploy"
          style={{ width: '100%', marginBottom: '0.75rem' }}
        >
          ➕ Create Collection
        </PixelButton>

        <PixelButton
          as="a"
          href="/manage"
          style={{ width: '100%', marginBottom: '0.75rem' }}
        >
          ⚙ Manage Collections
        </PixelButton>

        <PixelButton as="a" href="/explore" style={{ width: '100%' }}>
          🔍 Explore FOC
        </PixelButton>
      </CRTFrame>
    </main>
  );
}

/* What changed & why
   • Added `textAlign:center` to CRTFrame plus max-width 32 ch on paragraph,
     guaranteeing symmetrical ragged edges on desktop while wrapping early on
     phones. `marginInline:auto` keeps it horizontally centred.
   • Bolded “No IPFS. No indexers.” and forced explicit `<br/>` so split reads
     clean across viewports.
*/
