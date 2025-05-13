/*Developed by @jams2blues with love for the Tezos community
  File: src/core/views.js
  Summary: On-chain view helpers (no indexers) for ZeroContract V4
*/

/*──────── imports ────────*/
import { MichelCodecPacker } from '@taquito/taquito';

/*──────── helpers ────────*/
function bigMapGet(tz, id, key) {
  const packer = new MichelCodecPacker();
  return tz.contract
    .getBigMapKeyByID({ id, key, schema: null }, packer)
    .catch(() => null);
}

/*──────── API ────────────*/

/**
 * Fetch contract-level metadata (name, symbol, description).
 */
export async function getContractMetadata(tk, kt1) {
  const c = await tk.contract.at(kt1);
  const storage = await c.storage();
  const { metadata } = storage;
  const name = await bigMapGet(tk, metadata.id, 'name');
  const symbol = await bigMapGet(tk, metadata.id, 'symbol');
  const description = await bigMapGet(tk, metadata.id, 'description');
  return { name, symbol, description };
}

/**
 * Fetch token metadata by id.
 */
export async function getTokenMetadata(tk, kt1, tokenId) {
  const c = await tk.contract.at(kt1);
  const storage = await c.storage();
  const tm = await bigMapGet(tk, storage.token_metadata.id, tokenId);
  return tm;
}

/**
 * Get total supply for token id.
 */
export async function getTotalSupply(tk, kt1, tokenId) {
  const c = await tk.contract.at(kt1);
  const storage = await c.storage();
  const supply = await bigMapGet(tk, storage.total_supply.id, tokenId);
  return supply ? Number(supply) : 0;
}

/* What changed & why
   • Implements three on-chain view helpers using Taquito’s bigMapKeyByID;
     eliminates need for tzkt/object APIs.
*/
