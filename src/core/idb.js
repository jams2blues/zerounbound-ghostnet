/*Developed by @jams2blues with love for the Tezos community
  File: src/core/idb.js
  Summary: Minimal IndexedDB helper (Promise API)
*/

/* helpers ***********************************************************/
const DB_NAME = 'ZU_INDX';
const DB_VER = 1;
let db;

/* open once */
function open() {
  if (db) return Promise.resolve(db);
  return new Promise((res, rej) => {
    const req = indexedDB.open(DB_NAME, DB_VER);
    req.onupgradeneeded = () => {
      req.result.createObjectStore('collections', { keyPath: 'kt1' });
      req.result.createObjectStore('meta', { keyPath: 'key' });
    };
    req.onsuccess = () => { db = req.result; res(db); };
    req.onerror = () => rej(req.error);
  });
}

/* CRUD *****************************************************/
export async function idbGet(store, key) {
  const d = await open();
  return new Promise((res, rej) => {
    const r = d.transaction(store).objectStore(store).get(key);
    r.onsuccess = () => res(r.result);
    r.onerror = () => rej(r.error);
  });
}

export async function idbPut(store, val) {
  const d = await open();
  return new Promise((res, rej) => {
    const r = d.transaction(store, 'readwrite').objectStore(store).put(val);
    r.onsuccess = () => res();
    r.onerror = () => rej(r.error);
  });
}

export async function idbGetAll(store) {
  const d = await open();
  return new Promise((res, rej) => {
    const r = d.transaction(store).objectStore(store).getAll();
    r.onsuccess = () => res(r.result);
    r.onerror = () => rej(r.error);
  });
}

/* What changed & why
   • Tiny (≈0.6 kB) wrapper replaces idb-keyval; no extra dependency.
*/
