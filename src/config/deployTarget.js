/*Developed by @jams2blues with love for the Tezos community
  File: src/config/deployTarget.js
  Summary: **Authoritative single-source switch-board** – every diverging bit
           between Ghostnet & Mainnet now lives here and is exported so that
           scripts/Next/PWA/UI never break again.
*/

/*──────────────────────── flip me ────────────────────────*/
export const TARGET = 'ghostnet';        // ghostnet ⬅ | mainnet
/*─────────────────────────────────────────────────────────*/

/* ---------- per-network dictionaries ---------- */
const nets = {
  ghostnet: {
    /* branding */
    label:        'GHOSTNET',
    themeColor:   '#6f79ff',
    borderVar:    '--zu-ghostnet',
    manifestName: 'ZeroUnbound.art • Ghostnet',
    /* ux / copy */
    ctaFirst:     '/deploy',
    description:  'Test your fully-on-chain art collection risk-free on Ghostnet.',
    /* urls */
    siteUrl:      'https://ghostnet.zerounbound.art',
    ogImage:      'https://ghostnet.zerounbound.art/sprites/logo.svg',
    startUrl:     '/?source=pwa-ghostnet',
    /* RPC priority list */
    rpc: [
      'https://rpc.ghostnet.teztnets.com',
      'https://ghostnet.tezos.ecadinfra.com',
      'https://rpc.tzkt.io/ghostnet'
    ],
    /* Next.js redirects (pretty kt1 addresses on preview) */
    redirects: [
      {
        source: '/:addr(kt1[0-9A-Za-z]{33})',
        destination: '/kt1/:addr',
        statusCode: 307            // temp so 404 isn’t cached
      }
    ],
    /* misc */
    pkgName:      'zerounbound-ghostnet',
    devPort:      3000
  },

  mainnet: {
    label:        'MAINNET',
    themeColor:   '#00c48c',
    borderVar:    '--zu-mainnet',
    manifestName: 'ZeroUnbound.art',
    ctaFirst:     '/explore',
    description:  'Create 100 % on-chain art collections on Tezos mainnet.',
    siteUrl:      'https://zerounbound.art',
    ogImage:      'https://zerounbound.art/sprites/logo.svg',
    startUrl:     '/?source=pwa-mainnet',
    rpc: [
      'https://prod.tcinfra.net/rpc/mainnet',
      'https://mainnet.tezos.ecadinfra.com',
      'https://rpc.tzkt.io/mainnet',
      'https://mainnet.smartpy.io'
    ],
    redirects: [],                 // none in prod
    pkgName:    'zerounbound-mainnet',
    devPort:    4000
  }
};

/* ---------- derived exports ---------- */
export const NET            = nets[TARGET];
export const NETWORK_KEY    = TARGET;
export const NETWORK_LABEL  = NET.label;
export const THEME_COLOR    = NET.themeColor;
export const BORDER_VAR     = NET.borderVar;

export const MANIFEST_NAME  = NET.manifestName;
export const DESCRIPTION    = NET.description;
export const CTA_FIRST      = NET.ctaFirst;

export const SITE_URL       = NET.siteUrl;
export const OG_TITLE       = 'Zero Unbound — ZeroContract Studio';
export const OG_IMAGE       = NET.ogImage;

export const START_URL      = NET.startUrl;
export const RPC_URLS       = NET.rpc;

export const REDIRECTS      = NET.redirects;     // same shape Next expects
export const PACKAGE_NAME   = NET.pkgName;
export const DEV_PORT       = NET.devPort;

/* What changed & why
   • ✨ **Added the missing named exports** (MANIFEST_NAME, DEV_PORT, REDIRECTS)
     so the three failing scripts can resolve them.
   • `redirects` objects now use `statusCode` (15.x) instead of `permanent`.
   • Provided DESCRIPTION / OG values so the new functional _document.js
     fills all social meta.
*/
