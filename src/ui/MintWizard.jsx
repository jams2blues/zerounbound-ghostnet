/*Developed by @jams2blues with love for the Tezos community
  File: src/ui/MintWizard.jsx
  Summary: 3-step drag-and-drop mint flow for ZeroContract V4
*/

import React, { useState } from 'react';
import { splitFile } from '../core/chunker';
import useChunkBatch from '../hooks/useChunkBatch';
import PixelButton from './PixelButton';
import PixelInput from './PixelInput';
import PixelHeading from './PixelHeading';
import CRTFrame from './CRTFrame';
import ChunkDialog from './ChunkDialog';

/*──────────────────────── helpers ─────────────────────────*/
function DropZone({ onFile }) {
  const [hover, setHover] = useState(false);

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setHover(true);
      }}
      onDragLeave={() => setHover(false)}
      onDrop={(e) => {
        e.preventDefault();
        setHover(false);
        if (e.dataTransfer.files?.[0]) onFile(e.dataTransfer.files[0]);
      }}
      style={{
        border: '2px dashed var(--zu-fg)',
        padding: '3rem',
        textAlign: 'center',
        background: hover ? 'rgba(255,255,255,0.05)' : 'transparent',
      }}
    >
      Drop your file here
    </div>
  );
}

/*──────────────────────── wizard ─────────────────────────*/
export default function MintWizard() {
  const [fileInfo, setFileInfo] = useState(null);       // { file, chunks, size }
  const [label, setLabel] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [sending, setSending] = useState(false);

  const { buildBatch, estimateFee, fee } = useChunkBatch();

  /* step handlers --------------------------------------------------------- */
  async function handleFile(file) {
    try {
      const { chunks, size } = await splitFile(file);
      const f = Object.freeze({ file, chunks, size });
      setFileInfo(f);
      await estimateFee(size);
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleConfirm() {
    if (!fileInfo) return;
    setSending(true);
    try {
      const batch = await buildBatch(fileInfo.chunks, 'append_artifact_uri');
      await batch.send();
      alert('Minted! (check wallet)');
      setFileInfo(null);
      setLabel('');
    } catch (err) {
      alert(err.message);
    } finally {
      setSending(false);
      setDialogOpen(false);
    }
  }

  /* render ---------------------------------------------------------------- */
  return (
    <CRTFrame>
      <PixelHeading as="h2">Mint Wizard</PixelHeading>

      {!fileInfo ? (
        <>
          <DropZone onFile={handleFile} />
          <p style={{ marginTop: '1rem' }}>Max 2 MiB; will auto-split in 32 kB chunks.</p>
        </>
      ) : (
        <>
          <p>{fileInfo.file.name} • {(fileInfo.size / 1024).toFixed(1)} KB</p>
          <label>
            Token label:&nbsp;
            <PixelInput
              value={label}
              placeholder="My On-Chain Masterpiece"
              onChange={(e) => setLabel(e.target.value)}
            />
          </label>
          <p style={{ marginTop: '1rem' }}>
            {fileInfo.chunks.length} chunks ready — estimated fee&nbsp;
            {fee ? (fee / 1_000_000).toFixed(3) : '…'} ꜩ
          </p>
          <PixelButton onClick={() => setDialogOpen(true)}>Send to Chain</PixelButton>
        </>
      )}

      <ChunkDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        chunks={fileInfo?.chunks}
        fee={fee}
        busy={sending}
        onConfirm={handleConfirm}
      />
    </CRTFrame>
  );
}

/* What changed & why
   • Full three-step wizard: drag-and-drop → preview/fee → Beacon sign.
   • Integrates chunker + batch hook and displays modal progress dialog.
*/
