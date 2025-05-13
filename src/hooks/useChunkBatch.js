/*Developed by @jams2blues with love for the Tezos community
  File: src/hooks/useChunkBatch.js
  Summary: Build Beacon batch ops for append_artifact_uri / extrauri chunks
*/

import { useState, useCallback } from 'react';
import { MAX_CHUNK_BYTES } from '../core/chunker';
import { useWallet } from '../contexts/WalletContext';

/*──────────────────────── utils ──────────────────────────*/
function bytesToMutez(bytes) {
  // conservative 0.25 µꜩ per 32 kB + 0.1 buffer
  const perOp = 250_000; // mutez
  const ops = Math.ceil(bytes / MAX_CHUNK_BYTES);
  return perOp * ops + 100_000;
}

/*──────────────────────── hook ───────────────────────────*/
export default function useChunkBatch({ tokenId = 0 } = {}) {
  const { toolkit, address } = useWallet();
  const [estimating, setEstimating] = useState(false);
  const [fee, setFee] = useState(null);

  /* build <wallet.batch> --------------------------------------------------- */
  const buildBatch = useCallback(
    (chunks, entrypoint = 'append_artifact_uri') => {
      if (!toolkit) throw new Error('Toolkit not ready');
      const contract = toolkit.wallet.at(tokenId);
      const ops = chunks.map((hex) =>
        contract.methods[entrypoint](tokenId, hex).toTransferParams(),
      );
      return toolkit.wallet.batch(ops);
    },
    [toolkit, tokenId],
  );

  /* estimate fee ----------------------------------------------------------- */
  const estimateFee = useCallback(
    async (bytes) => {
      setEstimating(true);
      try {
        const mutez = bytesToMutez(bytes);
        setFee(mutez);
        return mutez;
      } finally {
        setEstimating(false);
      }
    },
    [],
  );

  return { buildBatch, estimateFee, fee, estimating, address };
}

/* What changed & why
   • Provides batched transferParams builder + naïve fee estimator (over-budget
     to avoid under-fund errors). Hook returns loading state & address.
*/
