/*Developed by @jams2blues with love for the Tezos community
  File: src/styles/globalStyles.js
  Summary: Single Pixeloid font stack, five retro themes
*/

import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  /*────────── font-faces (Pixeloid only) ──────────*/
  @font-face { font-family:'PixeloidSans';      src:url('/fonts/PixeloidSans-mLxMm.ttf')      format('truetype'); font-display:swap; }
  @font-face { font-family:'PixeloidSansBold';  src:url('/fonts/PixeloidSansBold-PKnYd.ttf')  format('truetype'); font-display:swap; }
  @font-face { font-family:'PixeloidMono';      src:url('/fonts/PixeloidMono-d94EV.ttf')      format('truetype'); font-display:swap; }

  /*────────── base palette (arcade-dark) ─────────*/
  :root{
    --zu-bg:#0d0d0d; --zu-bg-alt:#141414;
    --zu-fg:#d0d0d0; --zu-heading:#ffffff;
    --zu-accent:#2d2dff; --zu-accent-hover:#5353ff; --zu-accent-dark:#1b1bb8;
  }

  /*────────── theme variants (see ThemeContext) ──*/
  [data-theme='arcade-light']  { --zu-bg:#fafafa; --zu-bg-alt:#e7e7e7; --zu-fg:#222; --zu-heading:#111; }
  [data-theme='neon-dark']     { --zu-bg:#050013; --zu-bg-alt:#120038; --zu-fg:#e5e5ff; --zu-heading:#ff5cf4; --zu-accent:#00e5ff; --zu-accent-hover:#24ffff; --zu-accent-dark:#00b2d1; }
  [data-theme='pastel-light']  { --zu-bg:#f0f8f0; --zu-bg-alt:#e0efe0; --zu-fg:#2c3e30; --zu-heading:#1b2b20; --zu-accent:#9cdaff; --zu-accent-hover:#b8e6ff; --zu-accent-dark:#7bbbe0; }
  [data-theme='ocean-dark']    { --zu-bg:#00161e; --zu-bg-alt:#002530; --zu-fg:#c9e7f1; --zu-heading:#e8ffff; --zu-accent:#00a4ff; --zu-accent-hover:#33b7ff; --zu-accent-dark:#0076c4; }
  [data-theme='terminal-dark'] { --zu-bg:#000;    --zu-bg-alt:#050505; --zu-fg:#33ff33; --zu-heading:#ffcc00; --zu-accent:#33ff33; --zu-accent-hover:#66ff66; --zu-accent-dark:#00b300; }
  [data-theme='sunset-dark']   { --zu-bg:#1a0000; --zu-bg-alt:#330303; --zu-fg:#ffd9b3; --zu-heading:#ffeedd; --zu-accent:#ff5e00; --zu-accent-hover:#ff8524; --zu-accent-dark:#c43f00; }

  /*────────── reset & typography ────────────────*/
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  html,body{height:100%;width:100%;}
  body{
    font:400 16px/1.6 'PixeloidSans',monospace;
    background:var(--zu-bg); color:var(--zu-fg);
    -webkit-font-smoothing:antialiased; transition:background .25s,color .25s;
  }

  h1,h2,h3,h4,h5,h6{
    font-family:'PixeloidSansBold',monospace;
    font-weight:700; color:var(--zu-heading); letter-spacing:1px;
  }
  strong,b{font-family:'PixeloidSansBold',monospace;}

  input,button,textarea,select{
    font-family:'PixeloidSans',monospace;
    font-size:1rem;
  }

  a{color:inherit;text-decoration:none}

  .surface{background:var(--zu-bg-alt);transition:background .25s;}
`;

export default GlobalStyle;

/* What changed & why
   • Removed Sis & Pixeboy fonts per user request; entire UI now relies on the
     three Pixeloid faces (Sans, SansBold, Mono) for consistency & legibility.
   • Updated heading/bold text to PixeloidSansBold; body remains PixeloidSans.
   • Theme tokens unchanged, ensuring five‐palette system still functions.
*/
