/*Developed by @jams2blues with love for the Tezos community
  File: src/pages/deploy.js
  Summary: Contract Wizard – originate ZeroContract V4 collections
*/

/*──────── imports ────────*/
import React, { useState } from 'react';
import { getToolkit } from '../core/taquitoRpc';
import { useWallet } from '../contexts/WalletContext';
import PixelInput from '../ui/PixelInput';
import PixelButton from '../ui/PixelButton';
import PixelHeading from '../ui/PixelHeading';
import CRTFrame from '../ui/CRTFrame';

/* import contract code (bundled via next-static) */
import contractCode from '../../contracts/Zero_Contract_V4.tz';

/*──────── component ─────*/
export default function DeployPage() {
  const { toolkit, address } = useWallet();
  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('');
  const [busy, setBusy] = useState(false);
  const [kt1, setKt1] = useState(null);

  async function handleDeploy() {
    if (!toolkit) return;
    setBusy(true);
    try {
      /* minimal storage skeleton */
      const storage = {
        admin: address,
        all_tokens: 0,
        children: [],
        collaborators: [],
        contract_id: '',
        extrauri_counters: {},
        ledger: {},
        lock: false,
        metadata: { name, symbol, description: '' },
        next_token_id: 0,
        operators: {},
        parents: [],
        token_metadata: {},
        total_supply: {},
      };

      const op = await toolkit.wallet.originate({
        code: contractCode,
        storage,
      }).send();

      await op.confirmation();
      const newAddress = op.contractAddress;
      setKt1(newAddress);
      localStorage.setItem('ZU_LAST_KT1', newAddress);
    } catch (err) {
      alert(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main style={{ padding: '4rem 1rem', maxWidth: 600, margin: '0 auto' }}>
      <CRTFrame className="surface">
        <PixelHeading as="h1">Deploy Collection</PixelHeading>

        {kt1 ? (
          <>
            <p>Collection deployed at:</p>
            <pre style={{ whiteSpace: 'break-all' }}>{kt1}</pre>
            <PixelButton as="a" href={`/?kt1=${kt1}`} style={{ marginTop: '1rem' }}>
              Mint to Collection →
            </PixelButton>
          </>
        ) : (
          <>
            <label>
              Name<br />
              <PixelInput value={name} onChange={(e) => setName(e.target.value)} />
            </label>
            <br /><br />
            <label>
              Symbol<br />
              <PixelInput value={symbol} onChange={(e) => setSymbol(e.target.value)} />
            </label>
            <br /><br />
            <PixelButton onClick={handleDeploy} disabled={busy || !name || !symbol}>
              {busy ? 'Deploying…' : 'Deploy'}
            </PixelButton>
          </>
        )}
      </CRTFrame>
    </main>
  );
}

/* What changed & why
   • Full contract origination flow with user-friendly form.
   • Stores KT1 in localStorage for immediate use in MintWizard.
*/
