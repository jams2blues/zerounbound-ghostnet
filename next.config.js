/*Developed by @jams2blues with love for the Tezos community
  File: next.config.js
  Summary: CommonJS build config – removes ESM warning
*/

/* eslint-disable */
module.exports = {
  reactStrictMode: true,

  images: { domains: [] },                 // zero remote assets

  redirects: async () => [
    { source: '/savetheworldwithart/:path*', destination: '/:path*', permanent: true },
  ],

  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = { ...config.resolve.fallback, fs: false };
    }
    return config;
  },
};
/* What changed & why
   • Switched to CommonJS so Node no longer reparses the config as ESM.
*/
