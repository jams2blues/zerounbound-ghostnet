/*Developed by @jams2blues with love for the Tezos community
  File: src/core/taquitoRpc.js
  Summary: Lazy TezosToolkit factory with RPC auto-selection & retry
*/

/*──────────────────────────────────────────────────────────────────────────────
 * imports
 *─────────────────────────────────────────────────────────────────────────────*/
import { TezosToolkit } from '@taquito/taquito';
import {
  selectFastestRpc,
  getWriterRpc,
  setWriterRpc,
  NETWORKS,
} from '../config/networkConfig';

/*──────────────────────────────────────────────────────────────────────────────
 * cache
 *─────────────────────────────────────────────────────────────────────────────*/
const toolkits = new Map(); // key = `${network}|${mode}`

/*──────────────────────────────────────────────────────────────────────────────
 * helpers
 *─────────────────────────────────────────────────────────────────────────────*/

/**
 * Create or fetch memoised TezosToolkit.
 * @param {'ghostnet'|'mainnet'} network
 * @param {'read'|'write'}       mode
 */
export async function getToolkit(network = NETWORKS.GHOSTNET, mode = 'read') {
  const key = `${network}|${mode}`;
  if (toolkits.has(key)) return toolkits.get(key);

  /* pick RPC endpoint */
  let rpc;
  if (mode === 'write') {
    rpc = getWriterRpc(network);
    if (!rpc) {
      rpc = await selectFastestRpc(network);
      setWriterRpc(network, rpc);
    }
  } else {
    rpc = await selectFastestRpc(network);
  }

  /* create toolkit */
  const tk = new TezosToolkit(rpc);

  /* auto-retry wrapper (max 2) */
  const originalCall = tk.rpc.getBlock;
  tk.rpc.getBlock = async (...args) => {
    for (let i = 0; i < 2; i += 1) {
      try {
        return await originalCall.apply(tk.rpc, args);
      } catch (e) {
        if (i === 1) throw e;
      }
    }
  };

  toolkits.set(key, tk);
  return tk;
}

/*──────────────────────────────────────────────────────────────────────────────
 * signing helpers
 *─────────────────────────────────────────────────────────────────────────────*/

/**
 * Initialise Beacon Wallet & connect account (WC2 transport).
 * Returns connected toolkit (write-mode).
 */
export async function connectWallet(network = NETWORKS.GHOSTNET, opts = {}) {
  const [{ BeaconWallet }] = await Promise.all([
    import('@taquito/beacon-wallet'),
    getToolkit(network, 'write'),
  ]);

  const wallet = new BeaconWallet({
    name: 'ZeroUnbound',
    preferredNetwork: network,
    disableDefaultEvents: true,
    eventsHandler: { // noop → CRT UI handles events
      emit: () => undefined,
      on: () => undefined,
    },
    ...opts,
  });

  const tk = await getToolkit(network, 'write');
  tk.setWalletProvider(wallet);

  /* request permissions if not connected */
  if (!wallet.client.getActiveAccount()) {
    await wallet.requestPermissions({ network: { type: network } });
  }

  return tk;
}

/* What changed & why
   • Added TezosToolkit factory with memoisation and RPC auto-selection
     (fastest for read; sticky for write).
   • Wrapped `rpc.getBlock` with a lightweight 2-try retry.
   • Exposed `connectWallet` helper – Beacon WC2 is deferred-loaded to save bytes.
*/
