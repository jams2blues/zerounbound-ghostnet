/*Developed by @jams2blues with love for the Tezos community
  File: src/styles/globalStyles.js
  Summary: Global resets + responsive tweaks — hides horizontal scroll bars
           on small screens, improves scrollbar styling, and adds safe area
           padding for iOS PWAs.
*/

import { createGlobalStyle } from 'styled-components';
import palettes from './palettes.json' assert { type: 'json' };

const [fallbackKey]   = Object.keys(palettes);
const fallbackPalette = palettes[fallbackKey];
const v = (k, d) => fallbackPalette?.[`--zu-${k}`] ?? d;

const GlobalStyles = createGlobalStyle`
  /* Webfonts (unchanged) */
  @font-face{font-family:'PixeloidSans';src:url('/fonts/PixeloidSans-mLxMm.ttf') format('truetype');font-display:swap;}
  @font-face{font-family:'PixeloidSansBold';src:url('/fonts/PixeloidSansBold-PKnYd.ttf') format('truetype');font-weight:700;font-display:swap;}
  @font-face{font-family:'PixeloidMono';src:url('/fonts/PixeloidMono-d94EV.ttf') format('truetype');font-display:swap;}

  :root{
    --zu-bg:${v('bg','#000')};
    --zu-bg-alt:${v('bg-alt','#101010')};
    --zu-fg:${v('fg','#eee')};
    --zu-heading:${v('heading','#fff')};
    --zu-accent:${v('accent','#1976d2')};
    --zu-accent-hover:${v('accent-hover','#4791e1')};
    --zu-accent-sec:${v('accent-sec','#d81b60')};
    --zu-accent-sec-hover:${v('accent-sec-hover','#ec407a')};
    --zu-btn-fg:${v('btn-fg','#ffffff')};
    --zu-link:var(--zu-accent-sec);
    --zu-focus:var(--zu-accent);
    --zu-mainnet:#00e16e;--zu-ghostnet:#6f79ff;--zu-sandbox:#ff8c00;
    --zu-net-border:var(--zu-accent-sec);
  }

  *,*::before,*::after{box-sizing:border-box;}

  html,body{
    margin:0;
    min-height:100%;
    background:var(--zu-bg);
    color:var(--zu-fg);
    font-family:'PixeloidSans',monospace;
    -webkit-font-smoothing:antialiased;
    overflow-x:hidden;               /* ⬅ kill mobile horiz scroll bar */
  }

  body{
    padding-bottom:env(safe-area-inset-bottom); /* iOS PWA safe area */
  }

  a{color:var(--zu-link);}
  :focus-visible{outline:3px dashed var(--zu-focus);outline-offset:2px;}

  /* prettier scrollbars */
  ::-webkit-scrollbar{width:8px;height:8px;}
  ::-webkit-scrollbar-thumb{background:var(--zu-accent-sec);border-radius:4px;}
  ::-webkit-scrollbar-track{background:transparent;}
`;

export default GlobalStyles;

/* What changed & why
   • overflow-x:hidden on html/body kills phantom horizontal scroll bars.
   • Added safe-area padding for iOS notch devices.
   • Stylish thin scrollbars for desktop.
*/
