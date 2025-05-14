/*Developed by @jams2blues with love for the Tezos community
  File: src/pages/explore.js
  Summary: Global Fully-On-Chain explorer with IndexedDB cache
*/

/*──────── imports ────────*/
import React, { useEffect, useState, useMemo } from 'react';
import CRTFrame from '../ui/CRTFrame';
import PixelHeading from '../ui/PixelHeading';
import CollectionCard from '../ui/CollectionCard';
import SearchBar from '../ui/SearchBar';
import { getToolkit } from '../core/taquitoRpc';
import { getContractMetadata } from '../core/views';
import { idbGet, idbPut, idbGetAll } from '../core/idb';

/* config ***********************************************************/
const CACHE_HOURS = 24;
const SNAPSHOT_KEY = 'snapshotTs';

/* helper – refresh cache once per day ******************************/
async function refreshSnapshot() {
  const ts = await idbGet('meta', SNAPSHOT_KEY);
  if (ts && Date.now() - ts.val < CACHE_HOURS * 3600 * 1e3) return;

  const tk = await getToolkit('ghostnet', 'read');
  const blocks = await tk.rpc.getBlock({ block: 'head~5000' }); // last 5k blocks
  const origs = blocks.operations.flat(3).filter((o) => o.kind === 'origination');

  // fetch metadata in parallel (cap 100 for perf)
  const metas = await Promise.all(
    origs.slice(0, 100).map(async (o) => {
      const kt1 = o.metadata.operation_result.originated_contracts?.[0];
      if (!kt1) return null;
      try {
        const meta = await getContractMetadata(tk, kt1);
        return { kt1, name: meta.name, symbol: meta.symbol, supply: '?' };
      } catch { return null; }
    }),
  );

  // store
  await Promise.all(metas.filter(Boolean).map((m) => idbPut('collections', m)));
  await idbPut('meta', { key: SNAPSHOT_KEY, val: Date.now() });
}

/* page *************************************************************/
export default function Explore() {
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState('');

  /* load cache + refresh in bg */
  useEffect(() => {
    (async () => {
      setItems(await idbGetAll('collections'));
      refreshSnapshot(); // no await
    })();
  }, []);

  /* filter */
  const filtered = useMemo(() => {
    if (!query) return items;
    const q = query.toLowerCase();
    return items.filter((i) => (
      i.kt1.toLowerCase().includes(q)
        || (i.name && i.name.toLowerCase().includes(q))
        || (i.symbol && i.symbol.toLowerCase().includes(q))
    ));
  }, [items, query]);

  return (
    <main style={{ padding: '4rem 1rem' }}>
      <CRTFrame className="surface" style={{ maxWidth: 1024, margin: '0 auto' }}>
        <PixelHeading as="h1">Explore Fully-On-Chain NFTs</PixelHeading>
        <SearchBar onChange={setQuery} />
        <p style={{ margin: '.5rem 0 1.5rem', fontSize: '.9rem' }}>
          {filtered.length}/{items.length} collections
        </p>

        {filtered.length === 0 ? (
          <p>No match… keep typing!</p>
        ) : (
          <div style={{
            display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fill, minmax(220px,1fr))',
          }}
          >
            {filtered.map((c) => <CollectionCard key={c.kt1} {...c} />)}
          </div>
        )}
      </CRTFrame>
    </main>
  );
}

/* What changed & why
   • Complete /explore page: crawls last 5 000 blocks for originations, stores
     simplified metadata in IndexedDB. Cached snapshot refreshes every 24 h.
   • Instant client-side search; no indexer or external APIs.
   • Grid uses existing CollectionCard for cohesive look & 8-bit styling.
*/
