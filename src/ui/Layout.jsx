/*Developed by @jams2blues with love for the Tezos community
  File: src/ui/Layout.jsx
  Summary: Global shell — CRT bezel, sticky Header, and floating ThemeToggle
*/

/*────────── imports ──────────────────────────────────────────*/
import React     from 'react';
import PropTypes from 'prop-types';

import CRTFrame     from './CRTFrame.jsx';
import Header       from './Header.jsx';
import ThemeToggle  from './ThemeToggle.jsx';

import { NETWORK_LABEL } from '../config/deployTarget.js';

/*────────── component ───────────────────────────────────────*/
export default function Layout({ network = NETWORK_LABEL, children }) {
  return (
    <>
      {/* floating theme switch */}
      <ThemeToggle />

      {/* bezel + header + content slot */}
      <CRTFrame
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Header network={network} />

        <main
          style={{
            flex: '1 1 auto',
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            maxWidth: '1200px',
            margin: '0 auto',
            padding: 'var(--zu-gap-xl,1.5rem)',
          }}
        >
          {children}
        </main>
      </CRTFrame>
    </>
  );
}

Layout.propTypes = {
  network:  PropTypes.string,
  children: PropTypes.node.isRequired,
};

/* What changed & why
   • Added <ThemeToggle/> so the palette switcher is always rendered.
   • Ensured CRT frame stretches full viewport height to keep header pinned
     and content centred.
*/
