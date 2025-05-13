/*Developed by @jams2blues with love for the Tezos community
  File: next.config.js
  Summary: SWC compiler opts + styled-components SSR support
*/

/* eslint-disable */
module.exports = {
  reactStrictMode: true,

  compiler: {
    /* Ensure deterministic class-names on server + client */
    styledComponents: {
      ssr: true,
      displayName: false,
      minify: true,
      topLevelImportPaths: [],
    },
  },

  images: { domains: [] },

  redirects: async () => [
    {
      source: '/savetheworldwithart/:path*',
      destination: '/:path*',
      permanent: true,
    },
  ],

  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = { ...config.resolve.fallback, fs: false };
    }
    return config;
  },
};
