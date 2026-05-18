#!/usr/bin/env node
// Screenshot the MomentsSection at three viewports, plus a reduced-motion variant.
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';

const outDir = resolve(process.argv[2] ?? './screenshots/moments');
const url = 'http://localhost:3000/';
const widths = [
  { w: 390,  h: 844, label: 'mobile' },
  { w: 768,  h: 1024, label: 'tablet' },
  { w: 1440, h: 900,  label: 'desktop' },
];

await mkdir(outDir, { recursive: true });
const browser = await chromium.launch();

for (const { w, h, label } of widths) {
  for (const reduced of [false, true]) {
    const context = await browser.newContext({
      viewport: { width: w, height: h },
      deviceScaleFactor: 2,
      reducedMotion: reduced ? 'reduce' : 'no-preference',
    });
    const page = await context.newPage();
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
    await page.waitForTimeout(800);
    await page.evaluate(() => document.fonts.ready);
    // Walk down to fire scroll reveals
    await page.evaluate(async () => {
      const step = 500;
      const total = document.documentElement.scrollHeight;
      for (let y = 0; y < total; y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 80));
      }
    });
    // Target the moments section directly
    const section = page.locator('section:has-text("Off")').filter({ hasText: 'the mic.' }).first();
    await section.scrollIntoViewIfNeeded();
    await page.waitForTimeout(900);
    const path = `${outDir}/${label}-${w}${reduced ? '-reduced' : ''}.png`;
    await section.screenshot({ path });
    console.log(`${label} ${w}px${reduced ? ' (reduced-motion)' : ''} → ${path}`);
    await context.close();
  }
}

await browser.close();
console.log('done');
