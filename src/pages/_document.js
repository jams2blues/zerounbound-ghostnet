/*Developed by @jams2blues with love for the Tezos community
  File: src/pages/_document.js
  Summary: Custom document — inject PWA / SEO meta & preload favicon
*/

import Document, {
  Html, Head, Main, NextScript,
} from 'next/document';

export default class ZUDocument extends Document {
  render() {
    return (
      <Html lang="en" data-theme="arcade-dark">
        <Head>
          {/* preload critical font & favicon */}
          <link rel="preload" href="/fonts/PixeloidSans-mLxMm.ttf" as="font" type="font/ttf" crossOrigin="anonymous" />
          <link rel="icon" href="/favicon.ico" sizes="48x48" />
          <link rel="manifest" href="/manifest.json" />

          {/* PWA / theme meta */}
          <meta name="theme-color" content="#ff00c8" />
          <meta name="color-scheme" content="dark light" />

          {/* Open Graph / Twitter Card */}
          <meta property="og:title"       content="Zero Unbound — ZeroContract Studio" />
          <meta property="og:site_name"   content="ZeroUnbound" />
          <meta property="og:description" content="Create 100 % on-chain NFTs on Tezos with an 8-bit interface — no IPFS, no indexers." />
          <meta property="og:url"         content="https://zerounbound.art" />
          <meta property="og:image"       content="https://zerounbound.art/sprites/logo.svg" />

          <meta name="twitter:card"        content="summary" />
          <meta name="twitter:title"       content="Zero Unbound — ZeroContract Studio" />
          <meta name="twitter:description" content="8-bit, fully on-chain NFT studio for ZeroContract V4." />
          <meta name="twitter:image"       content="https://zerounbound.art/sprites/logo.svg" />
        </Head>

        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

/* What changed & why
   • Adds manifest link, favicon, theme-color, OG & Twitter tags.
   • Preloads main font to remove layout shift on first paint.
*/
