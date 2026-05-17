#!/usr/bin/env node
/**
 * Run Lighthouse against a URL and print the perf summary.
 * Usage: node scripts/lh.mjs <url> [--desktop] [--out=lh.json]
 */
import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';
import { writeFile } from 'node:fs/promises';

const url = process.argv[2];
if (!url) {
  console.error('Usage: node scripts/lh.mjs <url> [--desktop] [--out=path]');
  process.exit(1);
}

const desktop = process.argv.includes('--desktop');
const outArg = process.argv.find((a) => a.startsWith('--out='));
const outPath = outArg ? outArg.slice('--out='.length) : null;

const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] });

const flags = {
  port: chrome.port,
  output: 'json',
  logLevel: 'error',
  onlyCategories: ['performance'],
};

const config = desktop
  ? {
      extends: 'lighthouse:default',
      settings: {
        formFactor: 'desktop',
        throttling: { rttMs: 40, throughputKbps: 10240, cpuSlowdownMultiplier: 1 },
        screenEmulation: { mobile: false, width: 1350, height: 940, deviceScaleFactor: 1, disabled: false },
      },
    }
  : undefined; // default = mobile 4G + 4x CPU slowdown

const runner = await lighthouse(url, flags, config);
await chrome.kill();

const lhr = runner.lhr;
const audits = lhr.audits;
const cat = lhr.categories.performance;
const score = Math.round(cat.score * 100);
const fmt = (key) => audits[key]?.displayValue ?? '—';

console.log(`\n=== ${desktop ? 'DESKTOP' : 'MOBILE'} — ${url} ===`);
console.log(`Perf score:           ${score}`);
console.log(`First Contentful Paint: ${fmt('first-contentful-paint')}`);
console.log(`Largest Contentful Paint: ${fmt('largest-contentful-paint')}`);
console.log(`Speed Index:          ${fmt('speed-index')}`);
console.log(`Total Blocking Time:  ${fmt('total-blocking-time')}`);
console.log(`Cumulative Layout Shift: ${fmt('cumulative-layout-shift')}`);
console.log(`Time to Interactive:  ${fmt('interactive')}`);
console.log(`Server response time: ${fmt('server-response-time')}`);

console.log(`\n=== Top opportunities ===`);
const opps = Object.values(audits)
  .filter(
    (a) =>
      a.details?.type === 'opportunity' &&
      (a.numericValue ?? 0) > 0 &&
      (a.score ?? 1) < 1,
  )
  .sort((a, b) => (b.numericValue ?? 0) - (a.numericValue ?? 0))
  .slice(0, 8);
for (const a of opps) {
  console.log(`  ${a.title}: ${a.displayValue ?? ''}`);
}

console.log(`\n=== Top diagnostics with issues ===`);
const diags = Object.values(audits)
  .filter((a) => a.scoreDisplayMode === 'binary' && a.score === 0)
  .slice(0, 8);
for (const a of diags) {
  console.log(`  ✗ ${a.title}`);
}

if (outPath) {
  await writeFile(outPath, JSON.stringify(lhr, null, 2));
  console.log(`\nFull report → ${outPath}`);
}
