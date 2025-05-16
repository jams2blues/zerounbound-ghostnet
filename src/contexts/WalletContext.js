/*Developed by @jams2blues with love for the Tezos community
  File: src/contexts/WalletContext.js
  Summary: Wallet provider — now requests Beacon permissions with the
           **current site network** (ghostnet | mainnet) instead of the
           hard-wired constant; fixes wallet defaulting to mainnet.
*/

import React, {
  createContext, useContext, useEffect, useState, useRef, useCallback, useMemo,
} from 'react';
import { TezosToolkit } from '@taquito/taquito';
import { BeaconWallet } from '@taquito/beacon-wallet';
import { BeaconEvent }  from '@airgap/beacon-sdk';
import {
  NETWORK_KEY,        // 'ghostnet' | 'mainnet'
  RPC_URLS,
} from '../config/deployTarget.js';

/*──────── context setup ───────*/
const WalletCtx = createContext(null);
export const useWallet = () => useContext(WalletCtx);

/* balance floor */
const BALANCE_FLOOR = 500_000; // mutez

/* helper: fastest RPC */
async function probeRpc(list) {
  for (const url of list) {
    try {
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), 2500);
      const res = await fetch(`${url}/chains/main/chain_id`, { signal: ctrl.signal });
      clearTimeout(t);
      if (res.ok) return url;
    } catch {/* ignore */ }
  }
  throw new Error('No RPC reachable');
}

/*──────── provider ───────*/
export function WalletProvider({ children, initialNetwork = NETWORK_KEY }) {
  /* refs */
  const tezosRef  = useRef(null);
  const walletRef = useRef(null);

  /* state */
  const [network,  setNetwork]  = useState(initialNetwork);
  const [rpcUrl,   setRpcUrl]   = useState('');
  const [address,  setAddress]  = useState('');

  const [mismatch, setMismatch] = useState(false);
  const [needsReveal, setReveal] = useState(false);
  const [needsFunds,  setFunds]  = useState(false);

  /** Beacon network type mirror */
  const beaconNet = useMemo(() => network, [network]);

  /*──────── initialise on mount ─────────*/
  useEffect(() => {
    (async () => {
      const rpc = await probeRpc(RPC_URLS);
      setRpcUrl(rpc);

      tezosRef.current  = new TezosToolkit(rpc);
      walletRef.current = new BeaconWallet({
        name:             'ZeroUnbound.art',
        preferredNetwork: beaconNet,
      });
      tezosRef.current.setWalletProvider(walletRef.current);

      const sync = async () => {
        const acc = await walletRef.current.client.getActiveAccount();
        if (!acc) { setAddress(''); return; }

        setAddress(acc.address);
        setMismatch(acc.network?.type !== beaconNet);

        const bal = await tezosRef.current.tz
          .getBalance(acc.address)
          .catch(() => 0);
        setFunds(bal.toNumber() < BALANCE_FLOOR);

        const mgr = await tezosRef.current.rpc
          .getManagerKey(acc.address)
          .catch(() => null);
        setReveal(!mgr);
      };

      walletRef.current.client.subscribeToEvent(
        BeaconEvent.ACTIVE_ACCOUNT_SET,
        sync,
      );
      await sync();
    })().catch(console.error);
  }, [beaconNet]);

  /*──────── actions ───────*/
  const connect = useCallback(async () => {
    if (!walletRef.current) return;
    await walletRef.current.requestPermissions({
      network: { type: beaconNet, rpcUrl },
    }).catch(console.error);
  }, [beaconNet, rpcUrl]);

  const disconnect = useCallback(async () => {
    await walletRef.current?.clearActiveAccount();
    setAddress(''); setMismatch(false); setReveal(false); setFunds(false);
  }, []);

  const revealAccount = useCallback(async () => {
    if (!address) return;
    const op = await tezosRef.current.wallet
      .transfer({ to: address, amount: 0 })
      .send();
    await op.confirmation();
    setReveal(false);
    return op.opHash;
  }, [address]);

  /*──────── value ───────*/
  return (
    <WalletCtx.Provider value={{
      tezos: tezosRef.current,
      wallet: walletRef.current,
      /* net */
      network, rpcUrl,
      /* account */
      address, mismatch, needsReveal, needsFunds,
      /* actions */
      connect, disconnect, revealAccount,
    }}>
      {children}
    </WalletCtx.Provider>
  );
}

export default WalletCtx;

/* What changed & why
   • `connect()` now feeds Beacon the **dynamic `beaconNet`** vs previously
     frozen constant — fixes wallet connecting to mainnet while UI shows
     ghostnet.  
   • Added fast-RPC probe util & memoised `beaconNet`.  
   • Cleaned unused constants, ensured prop names align with Header.
*/
