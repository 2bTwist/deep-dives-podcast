#!/usr/bin/env node
import { chromium } from 'playwright';
import { writeFile } from 'node:fs/promises';

const channel = 'https://www.youtube.com/@DeepDives237';

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 1440, height: 900 },
  userAgent:
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_5) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15',
});
const page = await ctx.newPage();
await page.goto(channel, { waitUntil: 'domcontentloaded', timeout: 30000 });
try { await page.getByRole('button', { name: /reject all/i }).click({ timeout: 4000 }); } catch {}
await page.waitForTimeout(3500);

const urls = await page.evaluate(() => {
  // avatar — try several selectors
  const avatarImg =
    document.querySelector('yt-img-shadow#avatar img') ||
    document.querySelector('#avatar img') ||
    document.querySelector('img[alt*="DeepDives"]') ||
    document.querySelector('img[alt*="Deep Dive"]');
  // banner
  const bannerImg =
    document.querySelector('yt-img-shadow#banner img') ||
    document.querySelector('#banner img') ||
    document.querySelector('img.yt-core-image[fetchpriority="high"]') ||
    document.querySelector('img[src*="banner"]');
  return {
    avatar: avatarImg?.getAttribute('src') ?? null,
    banner: bannerImg?.getAttribute('src') ?? null,
    allImgs: Array.from(document.querySelectorAll('img'))
      .map((i) => i.getAttribute('src'))
      .filter((s) => s && s.startsWith('http'))
      .slice(0, 12),
  };
});

console.log('avatar:', urls.avatar);
console.log('banner:', urls.banner);
console.log('---all imgs---');
urls.allImgs.forEach((u, i) => console.log(i, u));

async function dl(url, file) {
  if (!url) return false;
  // YouTube image URLs often have size constraints — strip them to get larger
  const cleaned = url.replace(/=s\d+-c-k.*$/, '=s1600-c-k-c0x00ffffff-no-rj').replace(/=w\d+-h\d+.*$/, '=w1920-h1080-no-nd-c0xffffffff-rj');
  console.log('→ downloading', cleaned, 'to', file);
  const res = await fetch(cleaned);
  if (!res.ok) {
    console.log('  ✗', res.status);
    return false;
  }
  const buf = Buffer.from(await res.arrayBuffer());
  await writeFile(file, buf);
  console.log('  ✓', buf.length, 'bytes');
  return true;
}

await dl(urls.avatar, './public/brand/raissa-avatar.png');
await dl(urls.banner, './reference/youtube-banner.png');

await browser.close();
