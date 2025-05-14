/*Developed by @jams2blues with love for the Tezos community
  File: next.config.js
  Summary: Next-JS config — adds `.tz` raw-loader + keeps styled-components SSR
*/

/* eslint-disable */
module.exports = {
  reactStrictMode: true,

  /* SWC options *****************************************************/
  compiler: {
    styledComponents: {
      ssr: true,
      displayName: false,
      minify: true,
    },
  },

  /* Images (none for now) *******************************************/
  images: { domains: [] },

  /* Redirects (legacy STWWA path) ***********************************/
  redirects: async () => [
    { source: '/savetheworldwithart/:path*', destination: '/:path*', permanent: true },
  ],

  /* Custom webpack **************************************************/
  webpack: (config, { isServer }) => {
    /* 1 ▸ allow importing .tz (Michelson) as raw string
          e.g.  import contractCode from '../../contracts/Zero_Contract_V4.tz';
          Works both client & server, avoids Vercel build crash. */
    config.module.rules.push({
      test: /\.tz$/i,
      type: 'asset/source',      // built-in Webpack 5 raw string
    });

    /* 2 ▸ polyfill “fs” on client — avoid Taquito dynamic import errors */
    if (!isServer) {
      config.resolve.fallback = { ...config.resolve.fallback, fs: false };
    }
    return config;
  },
};

/* What changed & why
   • Added webpack rule `{ test:/\.tz$/, type:'asset/source' }` so Vercel
     treats Michelson contract files as plain text. Fixes parse error:
     “Module parse failed: Unexpected token (…)”.
   • No extra dependency; uses Webpack 5 core ‘asset/source’.
   • Retains styled-components SSR and previous redirects.
*/
