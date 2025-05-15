/*Developed by @jams2blues with love for the Tezos community
  File: src/contexts/WalletContext.js
  Summary: Beacon-based wallet provider with SSR-safe
           network detection, CORS-probe RPC selection,
           and clean connect / disconnect / reveal helpers.
*/

/* ───────────── imports ───────────── */
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
  useCallback
} from 'react';
import { TezosToolkit }   from '@taquito/taquito';
import { BeaconWallet }   from '@taquito/beacon-wallet';
import { BeaconEvent }    from '@airgap/beacon-sdk';
import {
  NETWORKS,
  DEFAULT_NETWORK,
  detectNetworkFromHost
} from '../config/networkConfig';

/* ───────────── constants ───────────── */
const BALANCE_FLOOR_MUTEZ = 500_000;   // 0.5 ꜩ
const RPC_TIMEOUT_MS      = 3_000;     // 3 s probe
const WalletCtx           = createContext(null);
export const useWallet    = () => useContext(WalletCtx);

/* ───────────── helpers ───────────── */
async function pickFastRpc(rpcs, net) {
  const key   = `ZERO_RPC_${net}`;
  const saved = typeof localStorage !== 'undefined' ? localStorage.getItem(key) : null;
  const order = saved ? [saved, ...rpcs.filter(u => u !== saved)] : [...rpcs];

  for (const url of order) {
    try {
      const ctrl  = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), RPC_TIMEOUT_MS);
      const res   = await fetch(`${url}/chains/main/chain_id`, { signal: ctrl.signal });
      clearTimeout(timer);
      if (res.ok) {
        if (url !== saved && typeof localStorage !== 'undefined') {
          localStorage.setItem(key, url);
        }
        return url;
      }
    } catch { /* ignore & try next */ }
  }
  throw new Error('No reachable RPC');
}

/* ───────────── provider ───────────── */
export function WalletProvider({ children }) {
  /* ---- network & toolkit bootstrap ---- */
  const host          = typeof window !== 'undefined' ? window.location.hostname : '';
  const netKey        = detectNetworkFromHost(host) || DEFAULT_NETWORK;
  const netCfg        = NETWORKS[netKey];

  const tezosRef      = useRef();
  const walletRef     = useRef();

  const [address,  setAddress]  = useState('');
  const [connected,setConnected]= useState(false);
  const [netMismatch,setMismatch]= useState(false);
  const [needsReveal,setReveal] = useState(false);
  const [needsFunds, setFunds]  = useState(false);
  const [rpcUrl,    setRpc]     = useState(netCfg.rpcUrls[0]);

  /* ---- initialise on mount ---- */
  useEffect(() => {
    (async () => {
      try {
        /* 1️⃣  best RPC */
        const rpc = await pickFastRpc(netCfg.rpcUrls, netKey);
        setRpc(rpc);

        /* 2️⃣  Taquito + BeaconWallet */
        tezosRef.current  = new TezosToolkit(rpc);
        walletRef.current = new BeaconWallet({
          name:              'ZeroUnbound.art',
          preferredNetwork:  netCfg.type,
          // DO NOT set disableDefaultEvents – we want Beacon’s UI
          enableMetrics:     false
        });
        tezosRef.current.setWalletProvider(walletRef.current);

        /* 3️⃣  account sync helper */
        const hydrate = async (acc) => {
          const active = acc ?? await walletRef.current.client.getActiveAccount();
          if (!active) {
            setAddress(''); setConnected(false); setMismatch(false);
            setReveal(false); setFunds(false);
            return;
          }

          setAddress(active.address);
          setConnected(true);
          setMismatch(active.network?.type !== netCfg.type);

          const bal = await tezosRef.current.tz.getBalance(active.address).catch(() => 0);
          setFunds(bal.toNumber() < BALANCE_FLOOR_MUTEZ);

          const mgr = await tezosRef.current.rpc.getManagerKey(active.address).catch(() => null);
          setReveal(!mgr);
        };

        /* 4️⃣  Beacon event subscription */
        walletRef.current.client.subscribeToEvent(BeaconEvent.ACTIVE_ACCOUNT_SET, hydrate);

        /* 5️⃣  initial hydration */
        await hydrate();
      } catch (err) {
        console.error('[WalletContext] bootstrap failed →', err);
      }
    })();
  }, [netCfg, netKey]);

  /* ---- actions ---- */
  const connect = useCallback(async () => {
    if (!walletRef.current) return;
    const existing = await walletRef.current.client.getActiveAccount();
    if (existing) return;                               // already connected

    await walletRef.current.requestPermissions({
      network: { type: netCfg.type, rpcUrl }
    }).catch(console.error);
  }, [netCfg, rpcUrl]);

  const disconnect = useCallback(async () => {
    await walletRef.current?.clearActiveAccount();
    setAddress(''); setConnected(false); setMismatch(false);
    setReveal(false); setFunds(false);
  }, []);

  const revealAccount = useCallback(async () => {
    if (!address) throw new Error('No address');
    const op = await tezosRef.current.wallet.transfer({ to: address, amount: 0 }).send();
    await op.confirmation();
    setReveal(false);
    return op.opHash;
  }, [address]);

  /* ---- context value ---- */
  return (
    <WalletCtx.Provider value={{
      tezos: tezosRef.current,
      wallet: walletRef.current,
      network: netKey,
      rpcUrl,
      address,
      connected,
      netMismatch,
      needsReveal,
      needsFunds,
      connect,
      disconnect,
      revealAccount
    }}>
      {children}
    </WalletCtx.Provider>
  );
}

export default WalletCtx;

/* What changed & why
   • **Removed `disableDefaultEvents:true`** so Beacon’s built-in pairing modal
     (and Temple/Kukai pop-outs) appear when the user clicks **Connect Wallet**,
     instead of silently doing nothing.
   • Added a guard inside `connect()` that short-circuits if a session is
     already active, preventing duplicate “active account” warnings.
   • Minor log improvement to trace bootstrap failure reasons.
*/
