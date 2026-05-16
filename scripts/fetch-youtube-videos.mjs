#!/usr/bin/env node
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
// scroll a bit to load lazy content
await page.evaluate(() => window.scrollBy(0, 1200));
await page.waitForTimeout(2000);

// Strategy 1: extract from ytInitialData JSON embedded in <script>
const fromInitialData = await page.evaluate(() => {
  const scripts = Array.from(document.querySelectorAll('script'));
  for (const s of scripts) {
    const t = s.textContent ?? '';
    const m = t.match(/var ytInitialData = (\{.+?\});/s);
    if (m) {
      try {
        const data = JSON.parse(m[1]);
        const tabs = data?.contents?.twoColumnBrowseResultsRenderer?.tabs ?? [];
        const videosTab = tabs.find((t) => t?.tabRenderer?.title === 'Videos') ?? tabs[1];
        const items =
          videosTab?.tabRenderer?.content?.richGridRenderer?.contents ?? [];
        const out = [];
        for (const it of items) {
          const v = it?.richItemRenderer?.content?.videoRenderer;
          if (!v) continue;
          const id = v.videoId;
          const title = v.title?.runs?.[0]?.text ?? '';
          const duration = v.lengthText?.simpleText ?? '';
          const published = v.publishedTimeText?.simpleText ?? '';
          if (id) out.push({ id, title, duration, published });
          if (out.length >= 20) break;
        }
        if (out.length) return out;
      } catch {}
    }
  }
  return null;
});

let videos = fromInitialData;
if (!videos || !videos.length) {
  // Strategy 2: scrape href + nearby title from DOM
  videos = await page.evaluate(() => {
    const anchors = Array.from(document.querySelectorAll('a[href*="/watch?v="]'));
    const seen = new Set();
    const out = [];
    for (const a of anchors) {
      const url = new URL(a.getAttribute('href'), 'https://www.youtube.com');
      const id = url.searchParams.get('v');
      if (!id || seen.has(id)) continue;
      seen.add(id);
      const title = a.getAttribute('title') || a.getAttribute('aria-label') || a.textContent?.trim() || '';
      out.push({ id, title, duration: '', published: '' });
      if (out.length >= 20) break;
    }
    return out;
  });
}

console.log(`  strategy used: ${fromInitialData ? 'ytInitialData' : 'DOM-scrape'}`);
console.log(`  found ${videos.length} videos`);
await writeFile('./scripts/youtube-videos.json', JSON.stringify(videos, null, 2));
console.log('  wrote scripts/youtube-videos.json');

await browser.close();
