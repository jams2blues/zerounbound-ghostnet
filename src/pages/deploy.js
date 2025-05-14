/*Developed by @jams2blues with love for the Tezos community
  File: src/pages/deploy.js
  Summary: Contract Wizard — validator + live confirmation bar (uses ChunkDialog)
*/

/*──────── imports ────────*/
import React, { useState } from 'react';
import { MichelsonMap } from '@taquito/michelson-encoder';
import { char2Bytes } from '@taquito/utils';
import { useWallet } from '../contexts/WalletContext';
import PixelInput from '../ui/PixelInput';
import PixelButton from '../ui/PixelButton';
import PixelHeading from '../ui/PixelHeading';
import CRTFrame from '../ui/CRTFrame';
import SuccessBurst from '../ui/SuccessBurst';
import ChunkDialog from '../ui/ChunkDialog';
import contractCode from '../../contracts/Zero_Contract_V4.tz';
import { clean } from '../core/validator';
import { useOpProgress } from '../hooks/useOpProgress';

/*──────── constants ─────*/
const LS_TERMS = 'ZU_TERMS_ACCEPTED';

/*──────── component ─────*/
export default function DeployPage() {
  const { toolkit, address } = useWallet();

  const [form, setForm] = useState({
    name: '', symbol: '', desc: '', img: '',
  });
  const [agreed, setAgreed] = useState(
    typeof window !== 'undefined' && localStorage.getItem(LS_TERMS) === 'yes',
  );

  /* operation & progress */
  const [opRef, setOpRef] = useState(null);
  const progress = useOpProgress(opRef, 2);            // 0–100 %

  const [kt1, setKt1] = useState(null);
  const [err, setErr] = useState('');

  const valid = form.name && form.symbol && address && agreed && !opRef;

  const update = (k) => (e) => {
    setForm({ ...form, [k]: e.target.value });
    setErr('');
  };

  async function handleDeploy() {
    try {
      /*── validate *************************************************/
      const metaJson = {
        name: clean(form.name, 48),
        symbol: clean(form.symbol, 48),
        description: clean(form.desc, 256),
        authors: [address],
        authoraddress: [address],
        interfaces: ['TZIP-012', 'TZIP-016'],
        type: 'art',
        imageUri: form.img ? clean(form.img, 512) : undefined,
      };

      const mm = new MichelsonMap();
      mm.set('', char2Bytes('tezos-storage:contents'));
      mm.set('contents', char2Bytes(JSON.stringify(metaJson)));

      const storage = {
        admin: address,
        all_tokens: 0, children: [], collaborators: [],
        contract_id: '', extrauri_counters: new MichelsonMap(),
        ledger: new MichelsonMap(), lock: false, metadata: mm,
        next_token_id: 0, operators: new MichelsonMap(), parents: [],
        token_metadata: new MichelsonMap(), total_supply: new MichelsonMap(),
      };

      const op = await toolkit.wallet.originate({ code: contractCode, storage }).send();
      setOpRef(op);
      await op.confirmation(2);

      setKt1(op.contractAddress);
      localStorage.setItem('ZU_LAST_KT1', op.contractAddress);
    } catch (e) {
      setErr(e.message);
      setOpRef(null);
    }
  }

  /*──────── render ─────────*/
  return (
    <main style={{ padding: '4rem 1rem', maxWidth: 640, margin: '0 auto' }}>
      {/* live modal while op pending */}
      <ChunkDialog
        open={!!opRef && !kt1}
        progress={progress}
        chunks={[]}                  /* no chunk list for origination */
        busy
        onClose={() => {}}           /* locked while signing */
        onConfirm={() => {}}
      />

      <CRTFrame className="surface">
        {kt1 ? (
          <>
            <PixelHeading as="h1">Collection Deployed!</PixelHeading>
            <SuccessBurst style={{ margin: '1rem auto' }} />
            <pre style={{ wordBreak: 'break-all' }}>{kt1}</pre>
            <PixelButton onClick={() => navigator.clipboard.writeText(kt1)}>
              Copy&nbsp;KT1
            </PixelButton>
            <PixelButton as="a" href={`/?kt1=${kt1}`} style={{ marginLeft: '1rem' }}>
              Mint&nbsp;→
            </PixelButton>
          </>
        ) : (
          <>
            <PixelHeading as="h1">Deploy Collection</PixelHeading>

            <label>Name<br />
              <PixelInput value={form.name} onChange={update('name')} maxLength={48} />
            </label><br /><br />
            <label>Symbol<br />
              <PixelInput value={form.symbol} onChange={update('symbol')} maxLength={48} />
            </label><br /><br />
            <label>Description<br />
              <PixelInput value={form.desc} onChange={update('desc')} maxLength={256} />
            </label><br /><br />
            <label>
              Image URI (optional)<br />
              <PixelInput value={form.img} onChange={update('img')} maxLength={512} />
            </label><br /><br />

            {!agreed && (
              <label style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
                <input
                  type="checkbox"
                  onChange={(e) => {
                    setAgreed(e.target.checked);
                    if (e.target.checked) localStorage.setItem(LS_TERMS, 'yes');
                  }}
                  style={{ transform: 'scale(1.2)' }}
                />
                <span>I agree to the&nbsp;
                  <a href="/terms" target="_blank" rel="noopener noreferrer">Terms of Service</a>
                </span>
              </label>
            )}
            {err && <p style={{ color: 'var(--zu-accent)' }}>{err}</p>}
            <br />

            <PixelButton onClick={handleDeploy} disabled={!valid}>
              Deploy
            </PixelButton>
          </>
        )}
      </CRTFrame>
    </main>
  );
}

/* What changed & why
   • Integrated universal `clean()` validator on all text fields.
   • Added useOpProgress hook → live percentage; fed to ChunkDialog progress bar.
   • ChunkDialog modal shown while origination confirms (0→100 %).
   • Error string surfaced beneath form; button disabled while invalid/pending.
*/
