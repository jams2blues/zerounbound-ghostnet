/*Developed by @jams2blues with love for the Tezos community
  File: src/pages/kt1/[addr].js
  Summary: SSR collection viewer (network-agnostic, no taquitoRpc.js).
*/

/*──────── imports ────────*/
import React from 'react';
import { useRouter } from 'next/router';
import { TezosToolkit } from '@taquito/taquito';

import { RPC_URLS } from '../../config/deployTarget.js';
import { getContractMetadata } from '../../core/views.js';

import CollectionCard from '../../ui/CollectionCard.jsx';
import PixelHeading   from '../../ui/PixelHeading.jsx';
import CRTFrame       from '../../ui/CRTFrame.jsx';

/*──────── page ───────────*/
export async function getServerSideProps({ params }) {
  const kt1 = params.addr.toLowerCase();
  const tk  = new TezosToolkit(RPC_URLS[0]);   // fast read-only RPC
  const meta= await getContractMetadata(tk, kt1).catch(() => ({}));

  return { props: { kt1, meta } };
}

export default function CollectionPage({ kt1, meta }) {
  const { isFallback } = useRouter();
  if (isFallback) return null;

  return (
    <main style={{ padding:'2rem 1rem', maxWidth:960, margin:'0 auto' }}>
      <CRTFrame className="surface">
        <PixelHeading as="h1">{meta.name || 'Collection'}</PixelHeading>
        <p style={{ marginBottom:'1rem' }}>{meta.description}</p>
        <CollectionCard name={meta.name} kt1={kt1} supply="…" />
      </CRTFrame>
    </main>
  );
}

/* What changed & why
   • Replaces missing getToolkit() helper with direct TezosToolkit usage.
     Keeps page fully net-agnostic by importing RPC_URLS from deployTarget.
*/
