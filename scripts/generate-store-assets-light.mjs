#!/usr/bin/env node
/**
 * Generates Chrome Web Store assets for the light theme variant.
 *
 * The existing unsuffixed files in store/assets are the dark listing assets.
 * This script writes light-specific files with a "-light" suffix.
 */

import { mkdirSync, rmSync, writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { spawnSync } from 'child_process';
import { tmpdir } from 'os';

const __dir = dirname(fileURLToPath(import.meta.url));
const root = join(__dir, '..');
const outDir = join(root, 'store', 'assets');
const tmpDir = join(tmpdir(), 'santi020k-light-store-assets');
const chromeBin = process.env.CHROME_BIN || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const pages = [
  { name: 'promo-tile-light.png', width: 440, height: 280, body: promoTile() },
  { name: 'marquee-banner-light.png', width: 1400, height: 560, body: marqueeBanner() },
  { name: 'screenshot-main-light.png', width: 1280, height: 800, body: browserScreenshot({ mode: 'main' }) },
  { name: 'screenshot-ntp-light.png', width: 1280, height: 800, body: browserScreenshot({ mode: 'ntp' }) },
  { name: 'screenshot-incognito-light.png', width: 1280, height: 800, body: browserScreenshot({ mode: 'incognito' }) },
];

mkdirSync(outDir, { recursive: true });
rmSync(tmpDir, { recursive: true, force: true });
mkdirSync(tmpDir, { recursive: true });

for (const page of pages) {
  const htmlPath = join(tmpDir, `${page.name}.html`);
  const outPath = join(outDir, page.name);
  writeFileSync(htmlPath, html(page), 'utf8');

  const result = spawnSync(chromeBin, [
    '--headless=new',
    '--disable-gpu',
    '--disable-dev-shm-usage',
    '--hide-scrollbars',
    '--no-first-run',
    `--window-size=${page.width},${page.height}`,
    `--screenshot=${outPath}`,
    pathToFileURL(htmlPath).href,
  ], { stdio: 'pipe' });

  if (result.status !== 0) {
    process.stderr.write(result.stderr.toString());
    process.stderr.write(result.stdout.toString());
    throw new Error(`Failed to render ${page.name}`);
  }

  console.log(`Generated store/assets/${page.name}`);
}

function html({ width, height, body }) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=${width},height=${height},initial-scale=1">
  <style>
    :root {
      --ink: #302e36;
      --muted: #5f526f;
      --soft: #f8f6fd;
      --panel: #f0edf9;
      --panel-2: #e3dff0;
      --line: #d3cde6;
      --accent: #6319be;
      --accent-2: #7744b8;
      --accent-3: #9c72db;
      --dark: #231d30;
      --dark-2: #1c1528;
      --dark-3: #110c1d;
      color: var(--ink);
      font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    }
    * { box-sizing: border-box; }
    html, body { width: ${width}px; height: ${height}px; margin: 0; overflow: hidden; background: var(--soft); }
    body { letter-spacing: 0; }
    .asset { width: ${width}px; height: ${height}px; position: relative; overflow: hidden; background: linear-gradient(135deg, #f8f6fd 0%, #eee9fa 56%, #e3dff0 100%); }
    .subtle-grid {
      position: absolute;
      inset: 0;
      background-image:
        linear-gradient(rgba(99, 25, 190, .06) 1px, transparent 1px),
        linear-gradient(90deg, rgba(99, 25, 190, .06) 1px, transparent 1px);
      background-size: 48px 48px;
      mask-image: linear-gradient(135deg, transparent 0%, #000 18%, #000 72%, transparent 100%);
    }
    .brand { font-weight: 760; line-height: .94; letter-spacing: 0; }
    .kicker { color: var(--accent); font-weight: 720; letter-spacing: 0; text-transform: uppercase; }
    .copy { color: var(--muted); font-weight: 540; line-height: 1.35; }
    .swatches { display: flex; gap: 10px; }
    .swatch { width: 38px; height: 38px; border-radius: 8px; border: 1px solid rgba(48, 46, 54, .12); }
    .chrome { position: absolute; overflow: hidden; border: 1px solid rgba(48, 46, 54, .14); box-shadow: 0 28px 90px rgba(56, 43, 85, .2); background: var(--soft); }
    .chrome-bar { height: 88px; background: var(--panel); border-bottom: 1px solid var(--line); }
    .tabs { height: 38px; display: flex; align-items: end; gap: 4px; padding: 8px 14px 0; background: #e3dff0; }
    .tab { width: 184px; height: 30px; border-radius: 9px 9px 0 0; padding: 8px 14px; font-size: 12px; color: #604c8a; background: #e3dff0; border: 1px solid transparent; position: relative; }
    .tab.active { color: var(--ink); background: var(--panel); border-color: var(--line); border-bottom-color: var(--panel); }
    .tab.active:before { content: ""; position: absolute; left: 18px; right: 18px; top: 0; height: 3px; border-radius: 3px; background: var(--accent); }
    .toolbar { height: 50px; display: flex; align-items: center; gap: 12px; padding: 9px 16px; }
    .dot { width: 13px; height: 13px; border-radius: 50%; background: var(--line); }
    .omnibox { flex: 1; height: 32px; display: flex; align-items: center; padding: 0 16px; border-radius: 999px; background: #f8f6fd; border: 1px solid var(--line); color: var(--muted); font-size: 13px; }
    .star { width: 18px; height: 18px; border-radius: 50%; border: 3px solid var(--accent-2); }
    .bookmark-row { height: 30px; display: flex; align-items: center; gap: 18px; padding: 0 20px; font-size: 12px; color: var(--muted); border-bottom: 1px solid rgba(211, 205, 230, .75); }
    .bookmark:before { content: ""; display: inline-block; width: 8px; height: 8px; border-radius: 2px; background: var(--accent-3); margin-right: 7px; }
    .page { position: absolute; left: 0; right: 0; top: 118px; bottom: 0; overflow: hidden; background: #f8f6fd; }
    .search { width: 560px; height: 48px; margin: 82px auto 34px; border-radius: 999px; border: 1px solid var(--line); background: white; box-shadow: 0 10px 28px rgba(56, 43, 85, .08); color: var(--muted); display: flex; align-items: center; padding: 0 22px; font-size: 15px; }
    .ntp-mark { position: absolute; right: 132px; top: 176px; width: 360px; height: 360px; border: 3px dashed var(--line); display: grid; place-items: center; color: var(--accent-2); font-size: 104px; font-weight: 800; line-height: 1; }
    .tiles { display: grid; grid-template-columns: repeat(4, 104px); gap: 18px; justify-content: center; }
    .tile { height: 92px; border: 1px solid var(--line); background: white; border-radius: 8px; padding: 14px; box-shadow: 0 10px 22px rgba(56, 43, 85, .06); }
    .tile-icon { width: 28px; height: 28px; border-radius: 7px; background: var(--panel-2); margin-bottom: 14px; }
    .tile-line { height: 8px; border-radius: 4px; background: var(--line); }
    .side-panel { position: absolute; left: 72px; top: 176px; width: 310px; }
    .side-title { font-size: 42px; line-height: 1; margin: 0 0 14px; color: var(--ink); font-weight: 780; }
    .side-copy { margin: 0; color: var(--muted); font-size: 16px; line-height: 1.45; }
    .incognito .chrome-bar { background: var(--dark-2); border-bottom-color: #30273f; }
    .incognito .tabs { background: #231d30; }
    .incognito .tab { background: #231d30; color: #b0a8c8; }
    .incognito .tab.active { background: var(--dark-2); color: #dfdde3; border-color: #30273f; border-bottom-color: var(--dark-2); }
    .incognito .toolbar .dot { background: #5f526f; }
    .incognito .omnibox { background: var(--dark-3); border-color: #30273f; color: #dfdde3; }
    .incognito .bookmark-row { background: var(--dark-2); color: #b6b2bd; border-bottom-color: #30273f; }
  </style>
</head>
<body>${body}</body>
</html>`;
}

function promoTile() {
  return `<main class="asset">
  <div class="subtle-grid"></div>
  <section style="position:absolute;left:34px;top:34px;width:250px">
    <div class="kicker" style="font-size:12px;margin-bottom:18px">Light Chrome Theme</div>
    <div class="brand" style="font-size:46px;color:var(--ink)">Santi020k</div>
    <p class="copy" style="font-size:15px;margin:16px 0 24px">Soft lavender chrome with deep violet accents.</p>
    <div class="swatches">
      ${swatches(['#f8f6fd', '#f0edf9', '#d3cde6', '#6319be', '#302e36'])}
    </div>
  </section>
  <div class="ntp-mark" style="right:24px;top:58px;width:112px;height:112px;font-size:36px;border-width:2px">&gt;_</div>
</main>`;
}

function marqueeBanner() {
  return `<main class="asset">
  <div class="subtle-grid"></div>
  <section style="position:absolute;left:82px;top:82px;width:470px">
    <div class="kicker" style="font-size:16px;margin-bottom:24px">Light Chrome Theme</div>
    <div class="brand" style="font-size:94px;color:var(--ink)">Santi020k</div>
    <p class="copy" style="font-size:24px;margin:28px 0 38px">A brighter browser frame tuned to the Santi020k palette.</p>
    <div class="swatches" style="gap:14px">
      ${swatches(['#f8f6fd', '#f0edf9', '#e3dff0', '#d3cde6', '#6319be', '#7744b8', '#302e36'], 54)}
    </div>
  </section>
  <div class="chrome" style="right:72px;top:92px;width:650px;height:376px;border-radius:10px">
    ${chromeTop()}
    <div class="page">
      <div class="side-panel" style="left:48px;top:62px;width:220px">
        <h1 class="side-title" style="font-size:31px">Light mode, same signal.</h1>
        <p class="side-copy" style="font-size:14px">Lavender surfaces, readable text, and violet focus.</p>
      </div>
      <div class="ntp-mark" style="right:56px;top:56px;width:190px;height:190px;font-size:56px">&gt;_</div>
    </div>
  </div>
</main>`;
}

function browserScreenshot({ mode }) {
  const isIncognito = mode === 'incognito';
  const pageTop = mode === 'ntp' ? '0' : '58px';
  return `<main class="asset ${isIncognito ? 'incognito' : ''}">
  <div class="chrome" style="inset:0;border:0;box-shadow:none;border-radius:0">
    ${chromeTop(isIncognito)}
    ${mode === 'ntp' ? '' : '<div class="bookmark-row"><span class="bookmark">Docs</span><span class="bookmark">Marketplace</span><span class="bookmark">Santi020k</span><span class="bookmark">Design</span></div>'}
    <div class="page" style="top:${mode === 'ntp' ? '88px' : '118px'}">
      <div class="subtle-grid"></div>
      <div class="side-panel">
        <h1 class="side-title">${isIncognito ? 'Private, polished.' : 'Santi020k Light'}</h1>
        <p class="side-copy">${isIncognito ? 'Incognito keeps a deeper frame while the page remains calm and readable.' : 'Soft lavender surfaces with deep violet accents for tabs, links, and focus states.'}</p>
      </div>
      <div class="search">theme.santi020k.com</div>
      <div class="ntp-mark">&gt;_</div>
      <div class="tiles" style="grid-template-columns:repeat(3, 104px);margin-top:320px;transform:translateX(-72px)">${Array.from({ length: 3 }, (_, i) => tile(i)).join('')}</div>
    </div>
  </div>
</main>`;
}

function chromeTop(isIncognito = false) {
  return `<div class="chrome-bar">
    <div class="tabs">
      <div class="tab active">${isIncognito ? 'New Incognito Tab' : 'Santi020k Theme'}</div>
      <div class="tab">VS Code Marketplace</div>
      <div class="tab">GitHub</div>
    </div>
    <div class="toolbar">
      <span class="dot"></span><span class="dot"></span><span class="dot"></span>
      <div class="omnibox">theme.santi020k.com</div>
      <span class="star"></span>
    </div>
  </div>`;
}

function tile(index) {
  const colors = ['#6319be', '#7744b8', '#9c72db', '#d3cde6'];
  return `<div class="tile"><div class="tile-icon" style="background:${colors[index % colors.length]}"></div><div class="tile-line"></div></div>`;
}

function swatches(colors, size = 38) {
  return colors.map((color) => `<span class="swatch" style="width:${size}px;height:${size}px;background:${color}"></span>`).join('');
}
