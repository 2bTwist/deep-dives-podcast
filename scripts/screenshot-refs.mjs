#!/usr/bin/env node
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';

const refs = [
  { name: 'masterclass',    url: 'https://www.masterclass.com/' },
  { name: 'a24',            url: 'https://a24films.com/' },
  { name: 'nowness',        url: 'https://www.nowness.com/' },
  { name: 'kinfolk',        url: 'https://www.kinfolk.com/' },
  { name: 'monocle',        url: 'https://monocle.com/' },
  { name: 'diaryofaceo',    url: 'https://stevenbartlett.com/the-diary-of-a-ceo/' },
  { name: 'ted',            url: 'https://www.ted.com/' },
  { name: 'appletv',        url: 'https://tv.apple.com/' },
];

const outDir = resolve('./screenshots/refs');
await mkdir(outDir, { recursive: true });

const browser = await chromium.launch();
const context = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 2,
  userAgent:
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_5) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15',
});

for (const r of refs) {
  try {
    const page = await context.newPage();
    console.log(`→ ${r.name}`);
    await page.goto(r.url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    // Wait for fonts + give JS a moment to hydrate hero content
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(2500);
    // Above-the-fold only — that's where the visual language lives
    await page.screenshot({ path: `${outDir}/${r.name}.png`, fullPage: false });
    console.log(`  ✓ ${outDir}/${r.name}.png`);
    await page.close();
  } catch (e) {
    console.log(`  ✗ ${r.name}: ${e.message.split('\n')[0]}`);
  }
}

await browser.close();
console.log('done');
