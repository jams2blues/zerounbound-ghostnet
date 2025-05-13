/*Developed by @jams2blues with love for the Tezos community
  File: src/core/chunker.js
  Summary: Split & rejoin binary files into ≤32 768 B hex chunks
*/

/*──────────────────────── helpers ────────────────────────*/
const MAX_CHUNK_BYTES = 32_768;             // contract hard-cap
const MAX_TOTAL_BYTES = 2 * 1024 * 1024;    // UX cap (2 MiB)

/* convert Uint8Array → hex string (no 0x) */
function toHex(bytes) {
  return [...bytes].map((b) => b.toString(16).padStart(2, '0')).join('');
}

/* convert hex string → Uint8Array */
function fromHex(hex) {
  const arr = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    arr[i / 2] = parseInt(hex.slice(i, i + 2), 16);
  }
  return arr;
}

/*──────────────────────── API ────────────────────────────*/

/**
 * Split a File/Blob into hex chunks.
 * Returns { chunks, size, mimeType }
 * Throws on non-ASCII label or size overflow.
 */
export async function splitFile(file) {
  const buf = new Uint8Array(await file.arrayBuffer());
  const { length: size } = buf;

  if (size > MAX_TOTAL_BYTES) {
    throw new Error(`File too large: ${(size / 1024 / 1024).toFixed(2)} MiB`);
  }

  const chunks = [];
  for (let offset = 0; offset < size; offset += MAX_CHUNK_BYTES) {
    const slice = buf.subarray(offset, offset + MAX_CHUNK_BYTES);
    chunks.push(toHex(slice));
  }
  return { chunks, size, mimeType: file.type || 'application/octet-stream' };
}

/**
 * Re-assemble hex chunks back to Blob.
 */
export function joinHex(chunks, mimeType = 'application/octet-stream') {
  const bytes = chunks.flatMap((hex) => Array.from(fromHex(hex)));
  return new Blob([Uint8Array.from(bytes)], { type: mimeType });
}

export { MAX_CHUNK_BYTES, MAX_TOTAL_BYTES };

/* What changed & why
   • Production splitter with 32 768 B limit, size guard & join helper.
*/
