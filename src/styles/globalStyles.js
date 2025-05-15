/*Developed by @jams2blues with love for the Tezos community
  File: src/styles/globalStyles.js
  Summary: Seven palettes + mobile tweaks (≤640 px)
*/

import { createGlobalStyle, css } from 'styled-components';
import { THEMES } from '../contexts/ThemeContext';
import PALETTES from './palettes.json';   // spelling fixed

/*──────── helper to inject palette blocks ─────*/
const paletteCss = THEMES.map(
  (t) => css`
    html[data-theme='${t}']{
      ${Object.entries(PALETTES[t])
        .map(([k, v]) => `${k}:${v};`)
        .join('')}
    }
  `,
);

const GlobalStyle = createGlobalStyle`
  /*────────── font-faces ──────────*/
  @font-face{
    font-family:'PixeloidSans';
    src:url('/fonts/PixeloidSans-mLxMm.ttf') format('truetype');
    font-display:swap;
  }
  @font-face{
    font-family:'PixeloidSansBold';
    src:url('/fonts/PixeloidSansBold-PKnYd.ttf') format('truetype');
    font-display:swap;
  }
  @font-face{
    font-family:'PixeloidMono';
    src:url('/fonts/PixeloidMono-d94EV.ttf') format('truetype');
    font-display:swap;
  }

  :root{ --zu-font:'PixeloidSans',monospace; }

  /*────────── palettes injected ───*/
  ${paletteCss}

  /*────────── reset & base ────────*/
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  html,body{height:100%;width:100%}

  body{
    font:400 16px/1.6 'PixeloidSans',monospace;
    background:var(--zu-bg);color:var(--zu-fg);
    -webkit-font-smoothing:antialiased;
    transition:background .25s,color .25s;
  }

  h1,h2,h3,h4,h5,h6{
    font-family:'PixeloidSansBold',monospace;
    font-weight:700;color:var(--zu-heading);letter-spacing:1px;
  }
  strong,b{font-family:'PixeloidSansBold',monospace}

  input,button,textarea,select{
    font-family:'PixeloidSans',monospace;font-size:1rem;
  }
  a{color:inherit;text-decoration:none}

  .surface{background:var(--zu-bg-alt);transition:background .25s}

  /*────────── mobile tweaks ───────*/
  @media(max-width:640px){
    body{font-size:15px}
    h1,h2{line-height:1.15}
    .surface{padding:1.25rem!important}
    #zu-theme-toggle{
      left:50%!important;right:auto!important;
      transform:translateX(-50%)
    }
  }
`;

export default GlobalStyle;

/* What changed & why
   • Injects palette blocks via `css`` for better type-safety.
   • Adds id fix for theme-toggle centring; no duplicate constants.
*/
