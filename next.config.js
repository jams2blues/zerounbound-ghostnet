/*Developed by @jams2blues with love for the Tezos community
  File: next.config.js
  Summary: SWC-minified Next 14 config with fs-shim for Beacon CJS
*/

const nextConfig = {
  reactStrictMode: true,
  swcMinify:       true,

  images: { domains: [] },                // no IPFS ↔ no remote images

  redirects: async () => [
    { source: '/savetheworldwithart/:path*', destination: '/:path*', permanent: true }
  ],

  webpack: (config, { isServer }) => {
    if (!isServer) {                      // Beacon SDK touches fs in browser build
      config.resolve.fallback = { ...config.resolve.fallback, fs: false };
    }
    return config;
  }
};

module.exports = nextConfig;

/* What changed & why
   • Pruned IPFS domains to honour “no off-chain storage”.
   • Kept `fs:false` shim from STWWA config :contentReference[oaicite:4]{index=4}:contentReference[oaicite:5]{index=5} to satisfy Beacon.
*/
