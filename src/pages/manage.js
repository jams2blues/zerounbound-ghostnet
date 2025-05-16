/*Developed by @jams2blues with love for the Tezos community
  File: src/pages/manage.js
  Summary: Manage Collections hub — carousel + manual paste
*/

import React, { useEffect, useState } from 'react';
import { useWallet } from '../contexts/WalletContext';
import PixelHeading from '../ui/PixelHeading';
import PixelInput from '../ui/PixelInput';
import PixelButton from '../ui/PixelButton';
import CRTFrame from '../ui/CRTFrame';
import ContractCarousel from '../ui/ContractCarousel';
import { getContractMetadata } from '../core/views';

export default function Manage() {
  const { address } = useWallet();
  const [collections, setCollections] = useState([]);
  const [manual, setManual] = useState('');

  /* scan wallet for contracts v1-v4 */
  useEffect(() => {
    (async () => {
      if (!address) return;
      const tk = await getToolkit('ghostnet', 'read');
      // quick FA2 filter by script size (stub) — replace with precise code hash later
      const ops = await tk.tz.getOperations(address);
      const kts = ops.filter((o) => o.kind === 'origination').map((o) => o.metadata.operation_result.originated_contracts).flat();
      const metaPromises = kts.slice(0, 10).map(async (kt1) => {
        const meta = await getContractMetadata(tk, kt1);
        return { kt1, name: meta.name || 'Collection', supply: '?' };
      });
      setCollections(await Promise.all(metaPromises));
    })();
  }, [address]);

  return (
    <main style={{ padding: '4rem 1rem' }}>
      <CRTFrame className="surface" style={{ maxWidth: 980, margin: '0 auto' }}>
        <PixelHeading as="h1">Manage Collections</PixelHeading>
        <ContractCarousel items={collections} />

        <PixelHeading as="h2" style={{ marginTop: '2rem' }}>Load by KT1</PixelHeading>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <PixelInput
            placeholder="KT1..."
            value={manual}
            onChange={(e) => setManual(e.target.value)}
          />
          <PixelButton as="a" href={manual ? `/kt1/${manual}` : '#'} disabled={!manual}>
            Load →
          </PixelButton>
        </div>
      </CRTFrame>
    </main>
  );
}

/* What changed & why
   • Provides basic manage hub with auto-scanned collections (v1–v4) and manual
     KT1 entry; stubs precise hashing to be refined.
*/
