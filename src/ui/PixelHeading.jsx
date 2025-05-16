/*Developed by @jams2blues with love for the Tezos community
  File: src/ui/PixelHeading.jsx
  Summary: 8-bit heading component — transient `$level` prop to avoid DOM
           leakage, auto-sizes <h1-h6>, supports accent colour override.
*/

import React       from 'react';
import styled, { css } from 'styled-components';

/*────────── styled base ─────────────────────────────*/
const headingStyles = css`
  font-family: 'PixeloidSansBold', monospace;
  color: ${({ $accent }) => (
    $accent ? `var(--zu-${$accent})` : 'var(--zu-heading)'
  )};
  margin: 0;
  text-shadow: 0 0 2px rgba(0,0,0,0.35);
`;

/* size map */
const SIZE = {
  1: '2.25rem',
  2: '1.8rem',
  3: '1.45rem',
  4: '1.2rem',
  5: '1.0rem',
  6: '0.85rem',
};

/* dynamic component */
const StyledHeading = styled.h1.attrs(({ as }) => ({
  /* ensure SC treats as correct tag */
  'data-level': as?.replace('h', '') ?? '1',
}))`
  ${headingStyles};
  font-size: ${({ as }) => SIZE[as?.replace('h', '')] || SIZE[1]};
`;

/*────────── component ───────────────────────────────*/
/**
 * @param   {object} props
 * @param   {1|2|3|4|5|6}  [props.level=1]  heading level
 * @param   {'accent'|'accent-sec'|'warn'|'info'} [props.accent] colour var
 */
export default function PixelHeading({
  level = 1,
  accent = '',
  children,
  ...rest
}) {
  const tag = `h${level}`;
  /* `$accent` & `$level` are transient → not forwarded to DOM */
  return (
    <StyledHeading
      as={tag}
      $level={level}
      $accent={accent}
      {...rest}
    >
      {children}
    </StyledHeading>
  );
}

/* What changed & why
   • Replaced leaking `level` prop with transient `$level`, silencing
     React/SC “unknown prop” warning during hydration.
   • Centralised font sizes via SIZE map for easy tweaks.
   • Added optional `accent` prop to allow colour override (NES-green, warn).
   • Component is tree-shakable, no tool markers, production-ready.
*/
