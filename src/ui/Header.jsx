/*Developed by @jams2blues with love for the Tezos community
  File: src/ui/Header.jsx
  Summary: Pixel header — network select, wallet CTAs, theme-safe colours
*/

/*──────── imports ─────────────────────────────────────────────*/
import React, {
  useEffect, useMemo, useState, useCallback,
} from 'react';
import styled, { css }      from 'styled-components';   // ← css FIXED
import Link                 from 'next/link';
import PixelButton          from './PixelButton.jsx';
import { useWallet }        from '../contexts/WalletContext.js';

/*──────── constants ──────────────────────────────────────────*/
export const HDR_HEIGHT = '86px';

const NET_COLORS = {
  mainnet:  'var(--zu-mainnet)',
  ghostnet: 'var(--zu-ghostnet)',
  sandbox:  'var(--zu-sandbox)',
};

/*──────── styled shells ──────────────────────────────────────*/
const Bar = styled.header`
  position: sticky;
  top: 0;
  z-index: 1000;
  width: 100%;
  min-height: ${HDR_HEIGHT};
  background: var(--zu-bg-alt);
  border-bottom: 2px solid var(--zu-net-border);
  padding: 0.75rem 1rem 0.45rem;
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
`;

const Row = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.65rem 1rem;
`;

const Brand = styled(Link)`
  font: 700 1.3rem/1 'PixeloidSansBold', monospace;
  color: var(--zu-heading);
  text-decoration: none;
`;

const Note = styled.span`
  font: 0.75rem/1.3 'PixeloidMono', monospace;
  display: block;
  margin-top: 0.25rem;
`;

const Nav = styled.nav`
  display: flex;
  gap: 1rem;
  align-items: center;

  a {
    font: 0.9rem/1 'PixeloidSans', monospace;
    color: var(--zu-fg);
    text-decoration: none;
    position: relative;
    padding-bottom: 0.1rem;
    &::after {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      height: 1px;
      background: var(--zu-accent-sec);
      transform: scaleX(0);
      transition: transform 0.2s ease;
    }
    &:hover::after { transform: scaleX(1); }
  }
`;

const NetworkSelect = styled.select`
  font: 0.9rem/1 'PixeloidSans', monospace;
  background: var(--zu-bg);
  color: var(--zu-fg);
  border: 1px solid var(--zu-accent-sec);
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  cursor: pointer;
  option { background: var(--zu-bg); }
`;

const Banner = styled.div`
  font: 0.75rem/1.3 'PixeloidSans', monospace;
  text-align: center;
  padding: 0.25rem 0.5rem;
  background: ${({ color }) => color};
  color: #fff;
`;

const ctaShared = css`
  ${PixelButton}{ min-width: 152px; }
`;
const Ctas = styled.div`
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  ${ctaShared}
`;

/*──────── component ─────────────────────────────────────────*/
export default function Header() {
  const {
    address, network,
    connect, disconnect, revealAccount,
    needsFunds, needsReveal, mismatch,
  } = useWallet();

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  /* sync CSS var colour */
  useEffect(() => {
    if (!mounted) return;
    const clr = NET_COLORS[network] || 'var(--zu-accent-sec)';
    document.documentElement.style.setProperty('--zu-net-border', clr);
  }, [mounted, network]);

  const shortAddr = useMemo(
    () => (address ? `${address.slice(0, 7)}…${address.slice(-4)}` : ''),
    [address],
  );

  /* banners */
  const banners = useMemo(() => {
    if (!mounted) return null;
    const out = [];
    if (mismatch) {
      out.push(
        <Banner key="net" color="var(--zu-warn)">
          ⚠ Wrong network — switch wallet to&nbsp;<b>{network.toUpperCase()}</b>
        </Banner>,
      );
    }
    if (needsReveal) {
      out.push(
        <Banner key="reveal" color="var(--zu-info)">
          🔑 Account not revealed —&nbsp;
          <button
            type="button"
            onClick={revealAccount}
            style={{
              textDecoration: 'underline',
              background: 'none',
              border: 'none',
              color: '#fff',
              cursor: 'pointer',
            }}
          >
            reveal now
          </button>
        </Banner>,
      );
    }
    if (needsFunds) {
      out.push(
        <Banner key="funds" color="var(--zu-accent-sec)">
          💸 Balance &lt; 0.5 ꜩ — top-up recommended
        </Banner>,
      );
    }
    return out;
  }, [mounted, mismatch, needsReveal, needsFunds, network, revealAccount]);

  /* network switch */
  const handleNetChange = useCallback((e) => {
    const target = e.target.value;
    window.location.href = target === 'ghostnet'
      ? 'https://ghostnet.zerounbound.art'
      : 'https://zerounbound.art';
  }, []);

  /*──────── render ──────────────────────────────────────────*/
  return (
    <>
      {banners}
      <Bar suppressHydrationWarning>
        <Row>
          {/* brand */}
          <div>
            <Brand href="/">ZERO UNBOUND</Brand>
            <Note suppressHydrationWarning>
              You are on&nbsp;<b>{mounted ? network.toUpperCase() : '…'}</b>.
            </Note>
          </div>

          {/* nav */}
          <Nav>
            <Link href="/terms">Terms</Link>
            <NetworkSelect
              value={network}
              onChange={handleNetChange}
              suppressHydrationWarning
            >
              <option value="ghostnet">Ghostnet</option>
              <option value="mainnet">Mainnet</option>
            </NetworkSelect>
          </Nav>

          {/* CTAs */}
          <Ctas>
            {mounted && address ? (
              <>
                <PixelButton title={address}>{shortAddr}</PixelButton>
                <PixelButton onClick={disconnect} data-sec>
                  Disconnect
                </PixelButton>
              </>
            ) : (
              <PixelButton onClick={connect}>Connect Wallet</PixelButton>
            )}
          </Ctas>
        </Row>
      </Bar>
    </>
  );
}

/* What changed & why
   • Re-added `css` import from styled-components (was omitted in r34-36),
     which caused ReferenceError at runtime.
*/
