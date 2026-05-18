#!/usr/bin/env node
// Verify the new raissa-portrait.jpg frames correctly in all 4 places.
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';

const outDir = resolve('./screenshots/portrait-swap');
const widths = [
  { w: 1440, h: 900,  label: 'desktop' },
  { w: 390,  h: 844,  label: 'mobile' },
];

await mkdir(outDir, { recursive: true });
const browser = await chromium.launch();

for (const { w, h, label } of widths) {
  const ctx = await browser.newContext({
    viewport: { width: w, height: h },
    deviceScaleFactor: 2,
  });
  const page = await ctx.newPage();

  // HOME — Hero (center column) and WhyIStarted block
  await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(800);
  await page.evaluate(() => document.fonts.ready);
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

  // Hero (top of page)
  await page.screenshot({
    path: `${outDir}/${label}-1-hero.png`,
    clip: { x: 0, y: 0, width: w, height: Math.min(h * 1.2, 1100) },
  });

  // WhyIStarted block
  const why = page.locator('section:has-text("in her own words")').first();
  if (await why.count()) {
    await why.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    await why.screenshot({ path: `${outDir}/${label}-2-why-i-started.png` });
  }

  // ABOUT page
  await page.goto('http://localhost:3000/about', { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForTimeout(800);
  await page.evaluate(() => document.fonts.ready);
  const aboutPortrait = page.locator('section').filter({ has: page.locator('img[src*="raissa-portrait"]') }).first();
  if (await aboutPortrait.count()) {
    await aboutPortrait.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    await aboutPortrait.screenshot({ path: `${outDir}/${label}-3-about.png` });
  }

  console.log(`${label} captured`);
  await ctx.close();
}

await browser.close();
console.log('done');
