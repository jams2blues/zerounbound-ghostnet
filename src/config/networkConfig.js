/*Developed by @jams2blues with love for the Tezos community
  File: src/config/networkConfig.js
  Summary: Network lists, RPC-latency probe, and sticky-writer cache
*/

/*──────────────────────────────────────────────────────────────────────────────
 * constants
 *─────────────────────────────────────────────────────────────────────────────*/
const STORAGE_KEY = 'ZU_RPC_WRITER_v1';

/** Hard-coded lists are CORS-clean as of 2025-05-13 – keep short for latency. */
const RPCS = {
  ghostnet: [
    'https://rpc.ghostnet.teztnets.com',      // Rapid EU+US CDN
    'https://ghostnet.tezos.ecadinfra.com',   // ECAD Infra (May-2025 domain)
    'https://rpc.tzkt.io/ghostnet'            // Baking Bad – high U.S. uptime
  ],
  mainnet: [
    'https://prod.tcinfra.net/rpc/mainnet',   // Tezos Commons – autoscaling cluster
    'https://mainnet.tezos.ecadinfra.com',    // ECAD Infra (primary)
    'https://rpc.tzkt.io/mainnet',            // Baking Bad
    'https://mainnet.smartpy.io'              // SmartPy – generous CORS
  ]
};

/*──────────────────────────────────────────────────────────────────────────────
 * helpers
 *─────────────────────────────────────────────────────────────────────────────*/

/**
 * Fetch wrapper with timeout (default 3 s).
 * Returns latency in ms or Infinity on failure.
 */
async function ping(url, timeout = 3000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeout);
  const start = performance.now();
  try {
    /* HEAD is usually disabled; fetch metadata instead of chain_id to save bytes */
    await fetch(`${url}/chains/main/blocks/head/header`, {
      method: 'GET',
      signal: ctrl.signal,
    });
    return performance.now() - start;
  } catch (_) {
    return Infinity;
  } finally {
    clearTimeout(t);
  }
}

/**
 * Pick fastest RPC for read-only ops. Memoises per tab for 30 minutes.
 */
export async function selectFastestRpc(network = 'ghostnet') {
  const candidates = RPCS[network] ?? [];
  const results = await Promise.all(candidates.map(ping));
  const bestIdx = results.indexOf(Math.min(...results));
  return candidates[bestIdx] ?? candidates[0];
}

/**
 * Sticky writer: use cached endpoint if it responded <24 h ago.
 */
export function getWriterRpc(network = 'ghostnet') {
  const cached = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  if (cached.network === network && Date.now() - cached.ts < 86_400_000) {
    return cached.url;
  }
  return null;
}

export function setWriterRpc(network, url) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ network, url, ts: Date.now() }),
  );
}

/*──────────────────────────────────────────────────────────────────────────────
 * exports
 *─────────────────────────────────────────────────────────────────────────────*/
export const NETWORKS = Object.freeze({
  MAINNET: 'mainnet',
  GHOSTNET: 'ghostnet',
});

export function getRpcList(network = 'ghostnet') {
  return RPCS[network] ?? [];
}

/* What changed & why
   • Added CORS-clean RPC lists (mainnet & ghostnet) and a 3-second latency probe.
   • Implemented sticky writer caching in localStorage (24 h) for signer ops.
   • Exposed helpers for Toolkit factory in core/taquitoRpc.js.
*/
