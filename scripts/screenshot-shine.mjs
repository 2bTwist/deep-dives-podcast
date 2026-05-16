#!/usr/bin/env node
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';

const url = process.argv[2] ?? 'http://localhost:3000/';
const outDir = resolve('./screenshots/shine');
await mkdir(outDir, { recursive: true });

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 3,
});
const page = await ctx.newPage();
await page.goto(url, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);

// Screenshot just the gold-shine spans, three times, ~700ms apart
const els = await page.locator('.text-gold-shine').all();
for (let i = 0; i < els.length; i++) {
  for (const tag of ['a', 'b', 'c']) {
    await els[i].screenshot({ path: `${outDir}/shine-${i}-${tag}.png` });
    await page.waitForTimeout(700);
  }
}
await browser.close();
console.log(`captured ${els.length * 3} shine frames`);
