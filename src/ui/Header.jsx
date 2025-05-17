/*Developed by @jams2blues with love for the Tezos community
  File: src/ui/Header.jsx
  Summary: Dual-mode header (centred brand, right-floating controls) +
           exported HDR_HEIGHT constant required by pages/index.js
*/

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import styled, { css, keyframes } from 'styled-components';
import Link                     from 'next/link';
import PixelButton              from './PixelButton.jsx';
import { useWallet }            from '../contexts/WalletContext.js';
import { useTheme, PALETTE_KEYS } from '../contexts/ThemeContext.js';

/*──────── constants ───────*/
export const HDR_HEIGHT = 140;       // <—— used by pages/index.js for top-padding
const BREAK        = 640;
const NET_COLORS   = {
  mainnet:  'var(--zu-mainnet)',
  ghostnet: 'var(--zu-ghostnet)',
  sandbox:  'var(--zu-sandbox)',
};

/*──────── shared select ──*/
const SelectBox = css`
  font: 0.9rem/1 'PixeloidSans', monospace;
  background: var(--zu-bg); color: var(--zu-fg);
  border: 1px solid var(--zu-accent-sec);
  padding: 0.28rem 0.6rem; border-radius: 4px;
  min-width: 150px; max-width: 260px; width: 100%;
  option { color: var(--zu-fg); background: var(--zu-bg); }
`;
const NetworkSelect = styled.select`${SelectBox}`;
const ThemeSelect   = styled.select`${SelectBox}`;
const ThemeIcon     = styled.span`font-size:1rem; line-height:1; user-select:none;`;

/*──────── wrappers ───────*/
const HeaderShell = styled.header`
  position: sticky; top: 0; z-index: 1100;
  background: var(--zu-bg-alt);
  border-bottom: 2px solid var(--zu-net-border);
  height: ${HDR_HEIGHT}px;
`;
const Wrapper = styled.div`
  height: 100%;               /* guarantees constant height */
  padding: 0.9rem 1rem 0.7rem;
  display: flex; flex-direction: column; align-items: center;
  position: relative;
`;

/*──────── brand __________*/
const BrandBlock = styled.div`
  text-align: center; display: flex; flex-direction: column; gap: 0.18rem;
`;
const Brand = styled(Link)`
  font: 700 1.35rem/1 'PixeloidSansBold', monospace;
  color: var(--zu-heading); text-decoration: none;
`;
const Note = styled.span`
  font: 0.75rem/1.25 'PixeloidMono', monospace;
`;

/*──────── controls ________*/
const ControlsCol = styled.div`
  margin-top: 0.75rem;
  display: flex; flex-direction: column; gap: 0.7rem;
  align-items: center;

  @media (min-width:${BREAK}px){
    align-items: flex-end;
    margin-left: auto;
    width: 260px;
  }
  .theme-select,.theme-icon{
    @media (max-width:${BREAK-1}px){ display:none; }
  }
`;
const Ctas = styled.div`
  display: flex; gap: 0.7rem; flex-wrap: wrap; justify-content: center;
  ${PixelButton}{min-width:150px;}
`;

/*──────── links (desktop) */
const LinksRow = styled.nav`
  margin-top: 0.7rem;
  display: flex; gap: 1rem; flex-wrap: wrap; justify-content: center;
  a,span{font:0.9rem/1 'PixeloidSans', monospace; color: var(--zu-fg);}
  @media (max-width:${BREAK-1}px){ display: none; }
`;

/*──────── burger/drawer ___*/
const Burger = styled.button`
  position: absolute; top: 0.9rem; right: 1rem;
  display: none;
  @media (max-width:${BREAK-1}px){
    display:inline-flex;
    border:2px solid var(--zu-fg); background:none; color:var(--zu-fg);
    width:34px; height:28px; font:700 1rem/1 'PixeloidSans', monospace;
    cursor:pointer;
  }
`;
const slideIn = keyframes`from{transform:translateX(100%);}to{transform:translateX(0);}`;
const Drawer = styled.aside`
  position: fixed; top:0; right:0; bottom:0; width:270px; z-index:2000;
  background: var(--zu-bg-alt); border-left:2px solid var(--zu-net-border);
  padding:1.2rem 1rem; display:flex; flex-direction:column; gap:1rem;
  animation: ${slideIn} 220ms ease-out;
`;
const CloseBtn = styled.button`
  align-self:flex-end; font:700 1rem/1 'PixeloidSans', monospace;
  background:none; color:var(--zu-fg);
  border:2px solid var(--zu-fg); width:32px; height:28px; cursor:pointer;
`;
const DrawerLinks = styled.nav`
  display:flex; flex-direction:column; gap:0.5rem;
  a,span{font:0.95rem/1 'PixeloidSans', monospace; color:var(--zu-fg);}
`;

/*──────── component ───────*/
export default function Header(){
  const {address, network, connect, disconnect} = useWallet();
  const {theme, set:setTheme}   = useTheme();
  const [mounted,setMounted]    = useState(false);
  const [open,setOpen]          = useState(false);
  useEffect(()=>setMounted(true),[]);
  const shortAddr = useMemo(()=>address?`${address.slice(0,7)}…${address.slice(-4)}`:'',[address]);

  /* dynamic border colour */
  useEffect(()=>{
    if(mounted) document.documentElement
      .style.setProperty('--zu-net-border', NET_COLORS[network]||'var(--zu-accent-sec)');
  },[mounted,network]);

  /* network change */
  const navNet = useCallback(e=>{
    window.location.href = e.target.value==='ghostnet'
      ?'https://ghostnet.zerounbound.art':'https://zerounbound.art';
  },[]);

  return (
    <>
      <HeaderShell>
        <Wrapper>
          <BrandBlock>
            <Brand href="/">ZERO UNBOUND</Brand>
            <Note>You are on <b>{mounted?network.toUpperCase():'…'}</b>.</Note>
          </BrandBlock>

          <Burger onClick={()=>setOpen(true)} aria-label="menu">≡</Burger>

          <ControlsCol>
            <NetworkSelect value={network} onChange={navNet}>
              <option value="ghostnet">Ghostnet</option>
              <option value="mainnet">Mainnet</option>
            </NetworkSelect>

            <ThemeIcon className="theme-icon" aria-hidden>🌗</ThemeIcon>
            <ThemeSelect
              className="theme-select"
              value={theme}
              onChange={e=>setTheme(e.target.value)}
            >
              {PALETTE_KEYS.map(k=>(
                <option key={k} value={k}>{k.replace(/-/g,' ')}</option>
              ))}
            </ThemeSelect>

            <Ctas>
              {mounted && address ? (
                <>
                  <PixelButton title={address}>{shortAddr}</PixelButton>
                  <PixelButton onClick={disconnect} data-sec>Disconnect</PixelButton>
                </>
              ) : (
                <PixelButton onClick={connect}>Connect Wallet</PixelButton>
              )}
            </Ctas>
          </ControlsCol>

          <LinksRow>
            <Link href="/terms">Terms</Link>
            <span style={{opacity:0.65}}>more links</span>
            <span style={{opacity:0.65}}>more links</span>
          </LinksRow>
        </Wrapper>
      </HeaderShell>

      {open && (
        <Drawer>
          <CloseBtn onClick={()=>setOpen(false)} aria-label="close">×</CloseBtn>

          <DrawerLinks>
            <Link href="/terms" onClick={()=>setOpen(false)}>Terms</Link>
            <span style={{opacity:0.65}}>more links</span>
            <span style={{opacity:0.65}}>more links</span>
          </DrawerLinks>

          <ThemeIcon aria-hidden>🌗</ThemeIcon>
          <ThemeSelect value={theme} onChange={e=>setTheme(e.target.value)}>
            {PALETTE_KEYS.map(k=>(
              <option key={k} value={k}>{k.replace(/-/g,' ')}</option>
            ))}
          </ThemeSelect>
        </Drawer>
      )}
    </>
  );
}

/* What changed & why (r62)
   • Exported HDR_HEIGHT = constant header height (140 px).
     pages/index.js relied on this export; missing export broke Vercel build.
   • HeaderShell height set to HDR_HEIGHT for absolute consistency.
*/

/*─────────────────────────────────────────────────────────────*/
