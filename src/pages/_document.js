/*Developed by @jams2blues with love for the Tezos community
  File: src/pages/_document.js
  Summary: Custom Document — adds viewport-fit meta for PWAs,
           preserves fonts + OG/Twitter meta (no functional diff to r47)
*/

import { Html, Head, Main, NextScript } from 'next/document';
import {
  DESCRIPTION, SITE_URL, OG_IMAGE, OG_TITLE, THEME_COLOR,
} from '../config/deployTarget.js';

export default function ZUDocument() {
  return (
    <Html lang="en" data-theme="arcade-dark">
      <Head>
        <meta
          name="viewport"
          content="width=device-width,initial-scale=1,viewport-fit=cover"
        />
        <link rel="icon" href="/favicon.ico" sizes="48x48" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content={THEME_COLOR} />

        {/* preload fonts */}
        <link rel="preload" href="/fonts/PixeloidSans-mLxMm.ttf"
              as="font" type="font/ttf" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/PixeloidSansBold-PKnYd.ttf"
              as="font" type="font/ttf" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/PixeloidMono-d94EV.ttf"
              as="font" type="font/ttf" crossOrigin="anonymous" />

        {/* OG / Twitter */}
        <meta property="og:title"       content={OG_TITLE} />
        <meta property="og:site_name"   content="ZeroUnbound" />
        <meta property="og:description" content={DESCRIPTION} />
        <meta property="og:url"         content={SITE_URL} />
        <meta property="og:image"       content={OG_IMAGE} />
        <meta name="twitter:card"        content="summary" />
        <meta name="twitter:title"       content={OG_TITLE} />
        <meta name="twitter:description" content={DESCRIPTION} />
        <meta name="twitter:image"       content={OG_IMAGE} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
