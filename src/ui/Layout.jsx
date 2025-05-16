/*Developed by @jams2blues with love for the Tezos community
  File: src/ui/Layout.jsx
  Summary: Layout — centres page content vertically & horizontally so
           index (and other small pages) fit without scrollbars on desktop.
*/

import React from 'react';
import PropTypes from 'prop-types';
import CRTFrame  from './CRTFrame.jsx';
import Header    from './Header.jsx';
import { NETWORK_LABEL } from '../config/deployTarget.js';

const WrapperStyle = {
  minHeight: '100vh',
  display:   'flex',
  flexDirection: 'column',
};

const MainStyle = {
  flex:           '1 1 auto',
  /* centring */
  display:        'flex',
  flexDirection:  'column',
  justifyContent: 'center',
  alignItems:     'center',
  width:          '100%',
  maxWidth:       '1200px',
  padding:        'var(--zu-gap-xl,1.5rem)',
  margin:         '0 auto',
};

export default function Layout({ network = NETWORK_LABEL, children }) {
  return (
    <CRTFrame style={WrapperStyle}>
      <Header network={network} />
      <main style={MainStyle}>
        {children}
      </main>
    </CRTFrame>
  );
}
Layout.propTypes={
  network:PropTypes.string,
  children:PropTypes.node.isRequired,
};

/* What changed & why
   • Wrapper (CRTFrame) now full-height flex column.
   • <main> uses flex centring so small pages (index) sit centred vertically
     on any viewport, eliminating desktop scrollbar while allowing natural
     scroll when content grows taller (e.g., /deploy, /manage).
*/
