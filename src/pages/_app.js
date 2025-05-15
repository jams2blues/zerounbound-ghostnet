/*Developed by @jams2blues with love for the Tezos community
  File: src/pages/_app.js
  Summary: Global providers + SSR-deterministic network hand-off (fix hydration)
*/

/*────────────────────────── imports ─────────────────────────*/
import React            from 'react';
import PropTypes        from 'prop-types';
import Head             from 'next/head';
import App              from 'next/app';
import { ThemeProvider }       from '../contexts/ThemeContext';
import { WalletProvider }      from '../contexts/WalletContext';
import GlobalStyle             from '../styles/globalStyles';
import Header, { HDR_HEIGHT }  from '../ui/Header';
import { detectNetworkFromHost } from '../config/networkConfig';

/*────────────────────────── layout ──────────────────────────*/
function Layout({ children }) {
  return (
    <>
      <Header />
      {/* subtract header height so pages can be 100 vh without scrolling */}
      <main style={{ minHeight: `calc(100vh - ${HDR_HEIGHT}px)` }}>
        {children}
      </main>
    </>
  );
}

Layout.propTypes = { children: PropTypes.node.isRequired };

/*────────────────────────── app shell ───────────────────────*/
function ZeroUnboundApp({ Component, pageProps, initialNetwork }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>Zero Unbound — ZeroContract Studio</title>
      </Head>

      <ThemeProvider>
        <WalletProvider initialNetwork={initialNetwork}>
          <GlobalStyle />
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </WalletProvider>
      </ThemeProvider>
    </>
  );
}

ZeroUnboundApp.propTypes = {
  Component:      PropTypes.elementType.isRequired,
  pageProps:      PropTypes.object.isRequired,
  initialNetwork: PropTypes.string.isRequired,
};

/*────────────────────────── SSR hand-off ────────────────────*/
/**
 * Ensures the same `network` prop is used on the server-rendered HTML and
 * the very first client render, eliminating “Text content does not match
 * server-rendered HTML” hydration errors that occurred when the hostname-based
 * detection returned different results between server (no `window`) and client.
 */
ZeroUnboundApp.getInitialProps = async (appCtx) => {
  const { ctx } = appCtx;
  /* call the default implementation to get `pageProps` */
  const appProps = await App.getInitialProps(appCtx);

  /* determine host on server ('' on client) */
  const host =
    typeof window === 'undefined'
      ? ctx.req?.headers?.host ?? ''
      : window.location.hostname;

  return {
    ...appProps,
    initialNetwork: detectNetworkFromHost(host),
  };
};

export default ZeroUnboundApp;

/* What changed & why
   • Added static `getInitialProps` to compute `initialNetwork` from `host`
     on the **server**, then pass it to <WalletProvider/> so both server
     and client renders have identical `network` → Header text, colour
     classes, etc. This removes the last hydration mismatch warning.
   • Wrapped children in <main> with height offset by exported `HDR_HEIGHT`.
   • Kept ThemeProvider → WalletProvider → GlobalStyle → Layout ordering
     so Header receives wallet context immediately after hydration.
*/
