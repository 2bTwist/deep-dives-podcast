#!/usr/bin/env node
/** Mobile hamburger nav verification: open the menu and screenshot the overlay. */
import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';

const url = process.argv[2] ?? 'http://localhost:3000/';
const outDir = resolve(process.argv[3] ?? './screenshots/mobile-menu');
await mkdir(outDir, { recursive: true });

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
const page = await ctx.newPage();
await page.goto(url, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
await page.getByRole('button', { name: /open menu/i }).click();
await page.waitForTimeout(700); // let fade-in + stagger settle
const path = `${outDir}/open.png`;
await page.screenshot({ path });
console.log(`mobile menu open → ${path}`);
await browser.close();
