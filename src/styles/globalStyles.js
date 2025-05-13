/*Developed by @jams2blues with love for the Tezos community
  File: src/styles/globalStyles.js
  Summary: CSS reset + 5 pixel fonts + colour vars
*/

import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  /*–––– font-faces ––––*/
  @font-face { font-family:'Sis';             src:url('/fonts/Sis-JpRJm.ttf') format('truetype');             font-display:swap; }
  @font-face { font-family:'PixeloidSans';    src:url('/fonts/PixeloidSans-mLxMm.ttf') format('truetype');    font-display:swap; }
  @font-face { font-family:'PixeloidSansBold';src:url('/fonts/PixeloidSansBold-PKnYd.ttf') format('truetype');font-display:swap; }
  @font-face { font-family:'PixeloidMono';    src:url('/fonts/PixeloidMono-d94EV.ttf') format('truetype');    font-display:swap; }
  @font-face { font-family:'Pixeboy';         src:url('/fonts/Pixeboy-z8XGD.ttf') format('truetype');         font-display:swap; }

  /*–––– colour vars ––––*/
  :root {
    --zu-bg:   #000;
    --zu-fg:   #fff;
    --zu-accent:#2d2dff;
    --zu-accent-hover:#5353ff;
    --zu-accent-dark:#1b1bb8;
  }

  /*–––– reset ––––*/
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  html,body{width:100%;height:100%;}
  body{
    background:var(--zu-bg);
    color:var(--zu-fg);
    font:400 16px/1.5 'Pixeboy',monospace;
  }

  h1,h2,h3,h4,h5,h6{
    font-family:'Sis',sans-serif;
    font-weight:700;
    letter-spacing:1px;
  }

  input,button,textarea,select{
    font-family:'PixeloidSans',monospace;
    font-size:1rem;
  }

  a{color:inherit;text-decoration:none}

  @media (prefers-color-scheme:light){
    :root{--zu-bg:#fafafa;--zu-fg:#111}
    body{background:var(--zu-bg);color:var(--zu-fg)}
  }
`;

export default GlobalStyle;

/* What changed & why
   • Registered Sis / Pixeloid / Pixeboy fonts and mapped them to headings,
     controls, and body copy per user preference.
   • Centralised palette via CSS variables for future theming.
*/
