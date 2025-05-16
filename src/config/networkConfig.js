/*Developed by @jams2blues with love for the Tezos community
  File: src/config/networkConfig.js
  Summary: Thin compatibility-shim that re-exports the active network
           constants drawn from deployTarget.js.  Older code that consumed
           `NETWORKS`, `getRpcList()` or `selectFastestRpc()` continues to
           work unchanged, while the single source-of-truth now lives in
           src/config/deployTarget.js.
*/

import {
  NETWORK_KEY,
  NETWORK_TYPE,
  NETWORK_LABEL,
  RPC_URLS
} from './deployTarget.js';

/*──────────────────────── constants ─────────────────────────*/
export const DEFAULT_NETWORK = NETWORK_KEY;

/** Minimal NETWORKS map (kept for legacy imports) */
export const NETWORKS = {
  [NETWORK_KEY]: {
    name:     NETWORK_LABEL.toLowerCase(), // 'ghostnet' | 'mainnet'
    type:     NETWORK_TYPE,
    rpcUrls:  RPC_URLS.slice()             // copy to avoid mutation
  }
};

/*──────────────────── helper utilities ─────────────────────*/

/** Return the ordered RPC list for the current net */
export const getRpcList = () => RPC_URLS.slice();

/**
 * Simple fastest-node pick (first that responds to /chains/main/chain_id).
 * Used by WalletContext bootstrap.
 */
export async function selectFastestRpc(timeoutMs = 3000) {
  for (const url of RPC_URLS) {
    try {
      const ctrl  = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), timeoutMs);
      const res   = await fetch(`${url}/chains/main/chain_id`, {
        mode: 'cors',
        signal: ctrl.signal
      });
      clearTimeout(timer);
      if (res.ok) return url;
    } catch { /* silence & try next */ }
  }
  throw new Error('No reachable RPC endpoint');
}

/* What changed & why
   • The file now *pipes through* to deployTarget.js instead of maintaining
     its own duplicated tables.  All legacy imports keep working, but there
     is exactly one place (deployTarget) where the net is selected and the
     RPC list lives.  This eliminates branch drift and copy-paste bugs.
*/
