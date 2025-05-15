/*Developed by @jams2blues with love for the Tezos community
  File: src/config/networkConfig.js
  Summary: Canonical network list + RPC helpers (Ghostnet / Mainnet)
*/

/*──────────────── constants ───────────────────────────────*/
export const DEFAULT_NETWORK = 'ghostnet';

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

/** Public metadata consumed by WalletContext / Header */
export const NETWORKS = Object.freeze({
  ghostnet: {
    key:  'ghostnet',
    name: 'Ghostnet',
    type: 'ghostnet',
    rpcUrls: RPCS.ghostnet,
  },
  mainnet: {
    key:  'mainnet',
    name: 'Mainnet',
    type: 'mainnet',
    rpcUrls: RPCS.mainnet,
  },
});

/*────────── hostname → network helper (Master Overview §4/§7) ──────────*/
export function detectNetworkFromHost(host = '') {
  const h = host.toLowerCase();
  if (
    h.startsWith('ghostnet.') ||
    h.startsWith('localhost') ||
    h.startsWith('127.') ||
    h === '::1'
  ) {
    return 'ghostnet';
  }
  return 'mainnet';
}

/*────────── latency probe (unchanged) ──────────*/
async function ping(url, timeout = 3000) {
  const ctrl = new AbortController();
  const t = setTimeout(() => ctrl.abort(), timeout);
  const start = performance.now();
  try {
    await fetch(`${url}/chains/main/blocks/head/header`, { signal: ctrl.signal });
    return performance.now() - start;
  } catch {
    return Infinity;
  } finally { clearTimeout(t); }
}

export async function selectFastestRpc(net = DEFAULT_NETWORK) {
  const urls = NETWORKS[net].rpcUrls;
  const rtts = await Promise.all(urls.map(ping));
  return urls[rtts.indexOf(Math.min(...rtts))] || urls[0];
}

/* What changed & why
   • Restored explicit metadata objects (key/type/rpcUrls) expected by WalletContext.
   • detectNetworkFromHost() keeps SSR & CSR in perfect lock-step. :contentReference[oaicite:0]{index=0}:contentReference[oaicite:1]{index=1}
*/
