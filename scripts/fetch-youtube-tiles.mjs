#!/usr/bin/env node
/**
 * Per-tile metadata scrape of youtube.com/@DeepDives237/videos.
 * Returns: { id, title, duration, views, published }
 *
 * The original fetch-youtube-videos.mjs uses two fragile strategies and
 * the DOM fallback only returns id + a wrong-selector duration. This one
 * walks ytd-rich-item-renderer tiles directly.
 */
import { chromium } from 'playwright';
import { writeFile } from 'node:fs/promises';

const channel = process.argv[2] ?? 'https://www.youtube.com/@DeepDives237/videos';

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 2400 },
  userAgent:
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_5) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15',
  locale: 'en-US',
});
const page = await ctx.newPage();
console.log(`→ ${channel}`);
await page.goto(channel, { waitUntil: 'domcontentloaded', timeout: 30000 });
try { await page.getByRole('button', { name: /reject all/i }).click({ timeout: 4000 }); } catch {}
await page.waitForTimeout(4000);
// scroll to load lazy tiles
for (let i = 0; i < 3; i++) {
  await page.evaluate(() => window.scrollBy(0, 1200));
  await page.waitForTimeout(700);
}
await page.evaluate(() => window.scrollTo(0, 0));
await page.waitForTimeout(500);

const videos = await page.evaluate(() => {
  const tiles = Array.from(document.querySelectorAll('ytd-rich-item-renderer'));
  const out = [];
  for (const tile of tiles) {
    const link = tile.querySelector('a#thumbnail');
    const url = link?.getAttribute('href') || '';
    let id = '';
    try { id = new URL(url, 'https://www.youtube.com').searchParams.get('v') || ''; } catch {}
    const titleEl = tile.querySelector('#video-title-link, a#video-title, #video-title');
    const title = (titleEl?.getAttribute('title') || titleEl?.textContent || '').trim();
    const durEl = tile.querySelector('.badge-shape-wiz__text, ytd-thumbnail-overlay-time-status-renderer span');
    const duration = (durEl?.textContent || '').trim();
    const metaEls = Array.from(tile.querySelectorAll('#metadata-line span'));
    const views = (metaEls[0]?.textContent || '').trim();
    const published = (metaEls[1]?.textContent || '').trim();
    if (id) out.push({ id, title, duration, views, published });
  }
  return out;
});

console.log(`  found ${videos.length} tiles`);
await writeFile('./scripts/youtube-tiles.json', JSON.stringify(videos, null, 2));
console.log('  wrote scripts/youtube-tiles.json');

await browser.close();
