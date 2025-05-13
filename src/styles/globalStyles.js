/*Developed by @jams2blues with love for the Tezos community
  File: src/styles/globalStyles.js
  Summary: CSS reset + Retro fonts + optional dark mode
*/

import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  /*–––– font-face ––––*/
  @font-face {
    font-family: 'RetroMonoWide';
    src: url('/fonts/Retro Mono Wide.ttf') format('truetype');
    font-display: swap;
  }

  /*–––– reset ––––*/
  *, *::before, *::after { box-sizing: border-box; }
  html, body {
    margin: 0; padding: 0;
    font-family: 'RetroMonoWide', monospace;
    background: #000;
    color: #fff;
  }

  /*–––– prefers-color-scheme ––––*/
  @media (prefers-color-scheme: light) {
    body { background: #fafafa; color: #111; }
  }

  /*–––– link ––––*/
  a { color: inherit; text-decoration: none; }
`;

export default GlobalStyle;

/* What changed & why
   • Adds global CRT font & dark-first palette; zero external CSS files needed.
*/
