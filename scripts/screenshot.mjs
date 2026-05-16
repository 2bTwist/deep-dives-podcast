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
  await page.goto(url, { waitUntil: 'networkidle' });
  // Wait for fonts to settle
  await page.evaluate(() => document.fonts.ready);
  const path = `${outDir}/${width}.png`;
  await page.screenshot({ path, fullPage: true });
  console.log(`  ${width}px → ${path}`);
  await context.close();
}

await browser.close();
console.log('done');
