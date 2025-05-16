/*Developed by @jams2blues with love for the Tezos community
  File: next.config.js
  Summary: ESM-style Next config — styled-components SSR, .tz raw import,
           **browser fallbacks for Node built-ins** (fs/crypto/path) used by
           Beacon-UI so the header can render.
*/

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  /* styled-components handled by SWC */
  compiler: { styledComponents: { ssr: true } },

  /* Next 15 → webpack 5 customisation */
  webpack(config) {
    /* ─── Michelson .tz files as raw string ───────────── */
    config.module.rules.push({
      test: /\.tz$/,
      type: 'asset/source',
    });

    /* ─── Beacon-UI (browser) expects “fs”, “path”, etc. ─*/
    config.resolve.fallback = {
      ...(config.resolve.fallback || {}),
      fs:    false,
      path:  false,
      crypto:false,
      stream:false,
    };

    return config;
  },

  images: { domains: [] },
};

export default nextConfig;

/* What changed & why
   • Added `resolve.fallback` entries so webpack replaces Node built-ins
     (`fs`, `path`, `crypto`, `stream`) with empty mocks in the browser.
     @airgap/beacon-ui (pulled by BeaconWallet) references them, which was
     breaking the bundle and preventing Header (wallet) from loading.
   • Rest of config unchanged (ESM export, .tz loader, SC SSR).
*/
