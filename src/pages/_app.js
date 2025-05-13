/*Developed by @jams2blues with love for the Tezos community
  File: src/pages/_app.js
  Summary: App shell — theme provider, wallet provider, global styles
*/

/*──────────────────────── imports ───────────────────────*/
import React from 'react';
import { ThemeProvider } from '../contexts/ThemeContext';
import { WalletProvider } from '../contexts/WalletContext';
import GlobalStyle from '../styles/globalStyles';
import ThemeToggle from '../ui/ThemeToggle';

/*──────────────────────── component ────────────────────*/
export default function ZeroUnboundApp({ Component, pageProps }) {
  return (
    <ThemeProvider>
      <WalletProvider>
        <GlobalStyle />
        <Component {...pageProps} />
        <ThemeToggle /> {/* floating button bottom-right */}
      </WalletProvider>
    </ThemeProvider>
  );
}

/* What changed & why
   • Wrapped entire app with ThemeProvider so CSS vars respond to theme cycles.
   • Injected ThemeToggle — always visible, no extra configuration needed.
*/
