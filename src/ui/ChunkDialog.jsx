/*Developed by @jams2blues with love for the Tezos community
  File: src/ui/ChunkDialog.jsx
  Summary: Modal showing chunk queue & Beacon progress
*/

import React from 'react';
import styled from 'styled-components';
import PixelButton from './PixelButton';
import CRTFrame from './CRTFrame';
import PixelHeading from './PixelHeading';

/* styled ------------------------------------------------------------------- */
const Overlay = styled.div`
  position:fixed;inset:0;background:rgba(0,0,0,0.8);display:flex;
  align-items:center;justify-content:center;z-index:1000;
`;

const List = styled.ul`
  list-style:none;padding:0;margin:1rem 0;max-height:50vh;overflow:auto;
  li{padding:0.25rem 0;font-family:'PixeloidMono'}
`;

/* component ---------------------------------------------------------------- */
export default function ChunkDialog({
  open, onClose, chunks = [], fee, busy, onConfirm,
}) {
  if (!open) return null;
  return (
    <Overlay>
      <CRTFrame style={{ width: 480, maxWidth: '90vw' }}>
        <PixelHeading as="h3">Chunk Queue</PixelHeading>
        <List>
          {chunks.map((c, i) => (
            <li key={i}>
              #{i + 1} • {c.length / 2} B
            </li>
          ))}
        </List>
        {fee != null && (
          <p style={{ margin: '1rem 0' }}>
            Estimated fee&nbsp;
            <strong>{(fee / 1_000_000).toFixed(3)} ꜩ</strong>
          </p>
        )}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <PixelButton onClick={onClose} disabled={busy}>
            Cancel
          </PixelButton>
          <PixelButton onClick={onConfirm} disabled={busy}>
            {busy ? 'Sending…' : 'Sign & Send'}
          </PixelButton>
        </div>
      </CRTFrame>
    </Overlay>
  );
}

/* What changed & why
   • Reusable modal with fee display and basic list; respects busy state.
*/
