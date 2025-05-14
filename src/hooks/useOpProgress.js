/*Developed by @jams2blues with love for the Tezos community
  File: src/hooks/useOpProgress.js
  Summary: Hook → % progress based on Taquito confirmations
*/

import { useEffect, useState } from 'react';

/**
 * @param {import('@taquito/taquito').WalletOperation} op
 * @param {number} target  confirmations required (default 2)
 */
export function useOpProgress(op, target = 2) {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    if (!op) return undefined;
    let done = false;

    async function poll() {
      for (let i = 0; i <= target; i += 1) {
        if (done) return;
        if (i) await op.confirmation(i);
        setPct(Math.round((i / target) * 100));
      }
    }
    poll();

    return () => { done = true; };
  }, [op, target]);

  return pct;
}
