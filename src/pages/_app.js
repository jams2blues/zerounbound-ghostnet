/*Developed by @jams2blues with love for the Tezos community
  File: src/pages/_app.js
  Summary: Custom App — wraps every route with <Layout>, restoring Header,
           theme toggle, and wallet controls.
*/

import React from 'react';
import Head  from 'next/head';
import Layout          from '../ui/Layout.jsx';
import { ThemeProvider }  from '../contexts/ThemeContext.js';
import { WalletProvider } from '../contexts/WalletContext.js';
import GlobalStyles       from '../styles/globalStyles.js';

export default function ZeroUnboundApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Zero Unbound — Fully-On-Chain NFT Studio</title>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
      </Head>

      <ThemeProvider>
        <WalletProvider>
          <GlobalStyles />

          {/*── restored Header & theme toggle via Layout wrapper ──*/}
          <Layout>
            <Component {...pageProps} />
          </Layout>

        </WalletProvider>
      </ThemeProvider>
    </>
  );
}

/* What changed & why
   • Imported `Layout` and wrapped all route components so Header, Theme
     toggle, and wallet CTAs render on every page (fixes “header missing”).
   • Kept single-node <title> to avoid hydration warning.
*/
