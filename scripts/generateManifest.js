/*Developed by @jams2blues with love for the Tezos community
File: scripts/generateManifest.js
Summary: Builds final public/manifest.json from manifest.base.json
using deployTarget.js values (no env-vars, fully transparent)
*/

js
Copy
Edit
/*───────────── imports ─────────────*/
import { readFileSync, writeFileSync }  from 'node:fs';
import { dirname, resolve }            from 'node:path';
import { fileURLToPath }               from 'node:url';
import {
  MANIFEST_NAME,
  START_URL,
  THEME_COLOR
} from '../src/config/deployTarget.js';

/*───────────── paths ───────────────*/
const __dirname = dirname(fileURLToPath(import.meta.url));
const basePath  = resolve(__dirname, '../public/manifest.base.json');
const outPath   = resolve(__dirname, '../public/manifest.json');

/*─────────── transform ─────────────*/
const base = readFileSync(basePath, 'utf8');

const final = base
  .replace('__MANIFEST_NAME__', MANIFEST_NAME)
  .replace('__START_URL__',    START_URL)
  .replace('__THEME_COLOR__',  THEME_COLOR);

/*────────────── write ─────────────*/
writeFileSync(outPath, final, 'utf8');
console.log('✓ Generated public/manifest.json for', MANIFEST_NAME);
/*What changed & why:
• Creates the real manifest.json on each install/build, guaranteeing it always matches the current deploy target without duplicating files.
*/