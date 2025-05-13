/*Developed by @jams2blues with love for the Tezos community
  File: src/pages/kt1/[addr].js
  Summary: SSR collection viewer that consumes on-chain views only
*/

/*──────── imports ────────*/
import React from 'react';
import { useRouter } from 'next/router';
import { getToolkit } from '../../core/taquitoRpc';
import { getContractMetadata } from '../../core/views';
import CollectionCard from '../../ui/CollectionCard';
import PixelHeading from '../../ui/PixelHeading';
import CRTFrame from '../../ui/CRTFrame';

/*──────── page ───────────*/
export async function getServerSideProps({ params }) {
  const kt1 = params.addr;
  const tk = await getToolkit('ghostnet', 'read');
  const meta = await getContractMetadata(tk, kt1);
  return { props: { kt1, meta } };
}

export default function CollectionPage({ kt1, meta }) {
  const router = useRouter();

  if (router.isFallback) return null;

  return (
    <main style={{ padding: '2rem 1rem', maxWidth: 960, margin: '0 auto' }}>
      <CRTFrame className="surface">
        <PixelHeading as="h1">{meta.name || 'Collection'}</PixelHeading>
        <p style={{ marginBottom: '1rem' }}>{meta.description}</p>
        <CollectionCard name={meta.name} kt1={kt1} supply="…" />
      </CRTFrame>
    </main>
  );
}

/* What changed & why
   • Implements collection SSR using on-chain views; no indexer calls.
   • Page shows name/description & embeds CollectionCard for navigation.
*/
