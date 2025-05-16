/*Developed by @jams2blues with love for the Tezos community
  File: tests/e2e/ZeroUnbound.spec.mjs
  Summary: Minimal Playwright smoke-suite that runs on **both nets** by
           reading from src/config/deployTarget.js.  Ensures the most
           business-critical paths stay green after every commit.
*/

import { test, expect } from '@playwright/test';
import path from 'node:path';
import { NET, NETWORK_LABEL, CTA_FIRST } from '../../src/config/deployTarget.js';

/* helper ──────────────────────────────────────────────────────────*/
const baseURL =
  process.env.PLAYWRIGHT_BASE_URL || `http://localhost:${NET.port ?? 3000}`;

/*────────────────────── smoke: homepage loads ────────────────────*/
test.describe(`ZeroUnbound • ${NETWORK_LABEL}`, () => {
  test(`landing page renders header + "${NETWORK_LABEL}" badge`, async ({ page }) => {
    await page.goto(baseURL);
    await expect(page.locator('header nav')).toBeVisible();
    await expect(page.locator(`text=${NETWORK_LABEL}`)).toBeVisible();
  });

  /*──────────────── CTA leads to correct first journey ───────────*/
  test(`primary CTA points to ${CTA_FIRST}`, async ({ page }) => {
    await page.goto(baseURL);
    const cta = page.locator(`a[href="${CTA_FIRST}"]`).first();
    await expect(cta).toBeVisible();
    await cta.click();
    await expect(page).toHaveURL(new RegExp(CTA_FIRST.replace('/', '\\/')));
  });

  /*────────────── wallet connect dialog opens (UI only) ──────────*/
  test('wallet connect button pops Beacon modal', async ({ page }) => {
    await page.goto(baseURL);
    await page.locator('text=Connect Wallet').click();
    // Beacon injects its iframe/modal; verify one appears
    await expect(
      page.frameLocator('iframe[src*="beacon"]')
    ).toBeVisible({ timeout: 10_000 });
  });
});

/* What changed & why
   • Replaced the previous empty stub with a 3-step smoke test that:
       ① hits the landing page,
       ② verifies the net-specific CTA,
       ③ opens the Beacon connect modal.
   • Uses deployTarget.js → ONE file flip runs the suite against mainnet
     (read-only) or ghostnet (interactive).
   • Keeps test time low (<30s) so it can run on every PR push.
*/
