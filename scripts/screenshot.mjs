#!/usr/bin/env node
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';

const url = process.argv[2] ?? 'http://localhost:3000/styleguide';
const outDir = resolve(process.argv[3] ?? './screenshots');
const widths = [390, 768, 1440];

await mkdir(outDir, { recursive: true });

const browser = await chromium.launch();
console.log(`→ ${url}`);

for (const width of widths) {
  const context = await browser.newContext({
    viewport: { width, height: 900 },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  // Hydration + a bit of breathing room
  await page.waitForTimeout(1500);
  // Wait for fonts to settle
  await page.evaluate(() => document.fonts.ready);
  // Scroll through the page so scroll-triggered (whileInView) reveals fire.
  // Then scroll back to the top so screenshot starts from the masthead.
  await page.evaluate(async () => {
    const step = 400;
    const total = document.documentElement.scrollHeight;
    for (let y = 0; y < total; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 80));
    }
    window.scrollTo(0, 0);
    await new Promise((r) => setTimeout(r, 400));
  });
  const path = `${outDir}/${width}.png`;
  await page.screenshot({ path, fullPage: true });
  console.log(`  ${width}px → ${path}`);
  await context.close();
}

await browser.close();
console.log('done');
