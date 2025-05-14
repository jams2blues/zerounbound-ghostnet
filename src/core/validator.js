/*Developed by @jams2blues with love for the Tezos community
  File: src/core/validator.js
  Summary: Shared sanitiser for all form inputs
*/

/* printable ASCII range */
const RE_ASCII = /^[\u0020-\u007E]+$/;
/* Extended safe UTF-8: letters, numbers, space, basic punct */
const RE_UTF8  = /^[\p{L}\p{N}\p{P}\p{Zs}]+$/u;
const RE_CTRL  = /[\u0000-\u001F\u007F]/;

/**
 * Clean & validate user input.
 * @param {string} s    raw input
 * @param {number} max  max length
 * @returns {string}    cleaned string
 * @throws on illegal chars / too long
 */
export function clean(s, max) {
  let out = (s ?? '').normalize('NFC').trim();
  if (RE_CTRL.test(out)) throw new Error('Control characters not allowed');
  if (!(RE_ASCII.test(out) || RE_UTF8.test(out))) {
    throw new Error('Illegal characters detected');
  }
  if (out.length > max) throw new Error(`Max ${max} characters`);
  return out;
}
