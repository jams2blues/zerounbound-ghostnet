/*Developed by @jams2blues with love for the Tezos community
  File: src/ui/SuccessBurst.jsx
  Summary: Animated SVG burst for positive feedback
*/

import React from 'react';
import styled, { keyframes } from 'styled-components';
import burstSvg from '../../public/sprites/Burst.svg';

const pop = keyframes`
  0%   { opacity:0; transform:scale(.4) rotate(0); }
  80%  { opacity:1; transform:scale(1.05) rotate(10deg); }
  100% { opacity:0; transform:scale(1.2) rotate(0); }
`;

const Burst = styled.img.attrs({ src: burstSvg.src, alt: '' })`
  width:64px;height:64px;pointer-events:none;
  animation:${pop} .9s ease-out forwards;
`;

export default function SuccessBurst(props) {
  return <Burst {...props} />;
}

/* What changed & why
   • Self-contained component that plays once then fades; uses SVG asset.
*/
