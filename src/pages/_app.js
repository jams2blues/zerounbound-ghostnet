/*Developed by @jams2blues with love for the Tezos community
  File: src/pages/_app.js
  Summary: App root – injects global CSS & wraps with WalletProvider
*/

/*─────────────  imports  ────────────────────────────────────────────────────*/
import React from 'react';
import { WalletProvider } from '../contexts/WalletContext';
import GlobalStyle from '../styles/globalStyles';        // next block

/*─────────────  component  ─────────────────────────────────────────────────*/
export default function ZeroUnboundApp({ Component, pageProps }) {
  return (
    <WalletProvider>
      <GlobalStyle />
      <Component {...pageProps} />
    </WalletProvider>
  );
}

/* What changed & why
   • Gives Next a valid default export → fixes “not a React Component” error.
   • Adds one-shot GlobalStyle for CRT font-face & reset.
*/
