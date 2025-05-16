/*Developed by @jams2blues with love for the Tezos community
  File: src/pages/_document.js
  Summary: **Single** functional Document for Zero-Unbound V4 — PWA/SEO meta,
           preload fonts/favicon, no class-inheritance (ES modules-safe)
*/

import { Html, Head, Main, NextScript } from 'next/document';
import {
  THEME_COLOR,
  BORDER_VAR,
  SITE_URL,
  OG_TITLE,
  DESCRIPTION,
  OG_IMAGE
} from '../config/deployTarget.js';

/*───────────────────────────────
  Functional-Document ⇢ no `class
  inheritance`, therefore immune to
  “extends value … is not a constructor”
  when Next is bundled as ESM.
────────────────────────────────*/
export default function ZUDocument() {
  return (
    <Html lang="en" data-theme="arcade-dark">
      <Head>
        {/*—— favicon + manifest ——*/}
        <link rel="icon"     href="/favicon.ico" sizes="48x48" />
        <link rel="manifest" href="/manifest.json" />

        {/*—— preload critical pixel font ——*/}
        <link
          rel="preload"
          href="/fonts/PixeloidSans-mLxMm.ttf"
          as="font"
          type="font/ttf"
          crossOrigin="anonymous"
        />

        {/*—— theme / colour-scheme ——*/}
        <meta name="theme-color"  content={THEME_COLOR} />
        <meta name="color-scheme" content="dark light" />

        {/*—— Open Graph ——*/}
        <meta property="og:title"       content={OG_TITLE} />
        <meta property="og:site_name"   content="ZeroUnbound" />
        <meta property="og:description" content={DESCRIPTION} />
        <meta property="og:url"         content={SITE_URL} />
        <meta property="og:image"       content={OG_IMAGE} />

        {/*—— Twitter Card ——*/}
        <meta name="twitter:card"        content="summary" />
        <meta name="twitter:title"       content={OG_TITLE} />
        <meta name="twitter:description" content={DESCRIPTION} />
        <meta name="twitter:image"       content={OG_IMAGE} />

        {/*—— header border tint (injected via CSS var) ——*/}
        <style>{`header{border-bottom-color:var(${BORDER_VAR});}`}</style>
      </Head>

      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}

/* What changed & why
   • Replaced class-based extension with **pure function component** —
     resolves “Class extends value #<Object> is not a constructor / Document
     constructor not found” that arose when Next 15’s ESM output wrapped the
     default export inside a module object.
   • Imports THEME_COLOR/BORDER_VAR & other constants from deployTarget.js so
     Ghostnet/Mainnet builds stay in sync.
   • Ensures this is the **only** _document.js in `src/pages/`; delete any
     leftover Emotion-based or experimental variants to avoid duplicate
     compilation.
*/
