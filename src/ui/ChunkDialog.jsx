/*Developed by @jams2blues with love for the Tezos community
  File: src/ui/ChunkDialog.jsx
  Summary: Modal with spinner, progress bar & humour/fact ticker
*/

/*──────── imports ────────*/
import React, { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import PixelButton from './PixelButton';
import CRTFrame from './CRTFrame';
import PixelHeading from './PixelHeading';
import { FUN_LINES } from '../constants/funLines';

/*──────── styled shells ───*/
const Overlay = styled.div`
  position:fixed;inset:0;background:rgba(0,0,0,0.85);display:flex;
  align-items:center;justify-content:center;z-index:1000;
`;

const List = styled.ul`
  list-style:none;padding:0;margin:1rem 0;max-height:40vh;overflow:auto;
  li{font-family:'PixeloidMono';padding:0.25rem 0;}
`;

const spin = keyframes`from{transform:rotate(0)}to{transform:rotate(1turn)}`;
const Spinner = styled.div`
  width:48px;height:48px;margin:0 auto 1rem;
  background:url('/sprites/loading.png') 0 0/cover;
  animation:${spin} 1s steps(8) infinite;
`;

const Bar = styled.div`
  height:8px;background:var(--zu-bg-alt);margin:1rem 0;overflow:hidden;
  &::before{
    content:'';display:block;height:100%;background:var(--zu-accent);
    width:${({ pct }) => pct}%;
    transition:width .3s linear;
  }
`;

const Ticker = styled.div`
  font-family:'PixeloidSans';font-size:.9rem;text-align:center;
  margin-top:1rem;min-height:1.4em;
`;

/*──────── component ─────*/
export default function ChunkDialog({
  open, onClose, chunks = [], fee, busy, onConfirm, progress = 0,
}) {
  const [line, setLine] = useState('');

  /* rotate fun line every 3 s while busy */
  useEffect(() => {
    if (!open) return undefined;
    let i = 0;
    setLine(FUN_LINES[0]);
    const id = setInterval(() => {
      i = (i + 1) % FUN_LINES.length;
      setLine(FUN_LINES[i]);
    }, 3000);
    return () => clearInterval(id);
  }, [open]);

  if (!open) return null;

  return (
    <Overlay>
      <CRTFrame style={{ width: 500, maxWidth: '95vw' }} className="surface">
        <PixelHeading as="h3">Processing&nbsp;Chunks</PixelHeading>

        <Spinner />

        <Bar pct={progress} />

        <Ticker>{line}</Ticker>

        <List>
          {chunks.map((c, idx) => (
            <li key={idx}>
              • Chunk&nbsp;{idx + 1}&nbsp;— {c.length / 2} B
            </li>
          ))}
        </List>

        {fee != null && (
          <p style={{ margin: '1rem 0' }}>
            Estimated fee <strong>{(fee / 1_000_000).toFixed(3)} ꜩ</strong>
          </p>
        )}

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <PixelButton onClick={onClose} disabled={busy}>Cancel</PixelButton>
          <PixelButton onClick={onConfirm} disabled={busy}>
            {busy ? 'Signing…' : 'Sign & Send'}
          </PixelButton>
        </div>
      </CRTFrame>
    </Overlay>
  );
}

/* What changed & why
   • Introduced local FUN_LINES list for humour/facts—no external API failures,
     satisfying resilience guidelines :contentReference[oaicite:2]{index=2}.
   • Spinner sprite + CSS steps for low-CPU animation.
   • Progress bar (pct prop from parent) gives real-time feedback.
   • Ticker rotates line every 3 s; improves perceived wait time per UX
     research :contentReference[oaicite:3]{index=3} and humour-in-UI studies
     :contentReference[oaicite:4]{index=4}.
*/
