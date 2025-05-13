/*Developed by @jams2blues with love for the Tezos community
  File: src/contexts/WalletContext.js
  Summary: Beacon WC2 + Taquito toolkit provider with connect / disconnect
*/

/*─────────────  imports  ────────────────────────────────────────────────────*/
import React, {
  createContext, useContext, useState, useCallback, useMemo,
} from 'react';
import { NETWORKS, selectFastestRpc } from '../config/networkConfig';
import { getToolkit, connectWallet } from '../core/taquitoRpc';

/*─────────────  ctx shape  ──────────────────────────────────────────────────*/
const WalletCtx = createContext(null);
export const useWallet = () => useContext(WalletCtx);

/*─────────────  provider  ───────────────────────────────────────────────────*/
export function WalletProvider({ network = NETWORKS.GHOSTNET, children }) {
  const [toolkit, setToolkit] = useState(null);
  const [address,  setAddress] = useState(null);
  const [wallet,   setWallet]  = useState(null);

  /* connect --------------------------------------------------------------- */
  const connect = useCallback(async () => {
    const tk   = await connectWallet(network);
    const acc  = await tk.wallet.pkh();
    setToolkit(tk);
    setAddress(acc);
    setWallet(await tk.wallet.getBeaconWallet());
  }, [network]);

  /* disconnect ------------------------------------------------------------ */
  const disconnect = useCallback(async () => {
    if (!wallet) return;
    await wallet.clearActiveAccount();
    setToolkit(null);
    setAddress(null);
  }, [wallet]);

  /* auto-init read-only toolkit so UI can render prices etc. -------------- */
  React.useEffect(() => {
    (async () => {
      const rpc = await selectFastestRpc(network);
      const tk  = await getToolkit(network, 'read', rpc);
      setToolkit(tk);
    })();
  }, [network]);

  const value = useMemo(() => ({
    toolkit, address, network, connect, disconnect,
  }), [toolkit, address, network, connect, disconnect]);

  return <WalletCtx.Provider value={value}>{children}</WalletCtx.Provider>;
}

/* What changed & why
   • Implements Beacon WC2 connect / disconnect with active-account cache clear.
   • Exposes read-only toolkit on mount so pages can fetch big-map data unauth’d.
*/
