/*Developed by @jams2blues with love for the Tezos community
  File: next.config.js
  Summary: Next 15 config with fs-shim for Beacon & React-strict enabled
*/

const nextConfig = {
  reactStrictMode: true,

  images: { domains: [] },               /* no off-chain assets */

  redirects: async () => [
    { source: '/savetheworldwithart/:path*', destination: '/:path*', permanent: true },
  ],

  webpack: (config, { isServer }) => {
    if (!isServer) config.resolve.fallback = { ...config.resolve.fallback, fs: false };
    return config;
  },
};

export default nextConfig;

/* What changed & why
   • Removed obsolete `swcMinify` (Next 15 bakes SWC on by default).
   • Kept `fs:false` fallback so Beacon SDK tree-shakes in browser bundle.
*/
