#!/usr/bin/env node
/**
 * Synchronizes Chrome theme manifests with VS Code theme colors.
 * Supports both Dark and Light variants.
 */

import { existsSync,readFileSync, writeFileSync } from 'fs';
import { dirname,resolve } from 'path';
import { fileURLToPath } from 'url';

const __dir = dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const isWrite = args.includes('--write');
const variant = args.find(a => a.startsWith('--variant='))?.split('=')[1] || 'dark';

if (!['dark', 'light'].includes(variant)) {
  console.error('Invalid variant. Use --variant=dark or --variant=light');

  process.exit(1);
}

const SOURCE_MAP = {
  dark: '../../santi020k-theme/themes/santi020k-dark-color-theme.json',
  light: '../../santi020k-theme/themes/santi020k-light-color-theme.json',
};

const TARGET_MAP = {
  dark: '../manifest.json',
  light: '../manifest-light.json',
};

const sourcePath = resolve(__dir, SOURCE_MAP[variant]);
const targetPath = resolve(__dir, TARGET_MAP[variant]);

if (!existsSync(sourcePath)) {
  console.error(`Source theme not found: ${sourcePath}`);

  process.exit(1);
}

// JSONC → JSON
const raw = readFileSync(sourcePath, 'utf8');

const stripped = raw
  .replaceAll(/\/\/.*$/gm, '')
  .replaceAll(/\/\*[\s\S]*?\*\//g, '');

const vsc = JSON.parse(stripped).colors;

function hex(token, fallback) {
  const v = vsc[token] || fallback;

  if (!v) throw new Error(`Missing VS Code token: ${token}`);

  return v.slice(0, 7); // strip alpha
}

function toRgb(h) {
  const n = Number.parseInt(h.replace('#', ''), 16);

  return [n >> 16 & 0xff, n >> 8 & 0xff, n & 0xff];
}

function darken(h, factor) {
  const [r, g, b] = toRgb(h);

  return [Math.round(r * factor), Math.round(g * factor), Math.round(b * factor)];
}

// ── Shared Tokens ────────────────────────────────────────────────────────────
const frame          = hex('titleBar.activeBackground');
const toolbar        = hex('sideBar.background');
const editorBg       = hex('editor.background');
const editorFg       = hex('editor.foreground');
const iconFg         = hex('icon.foreground');
const link           = hex('textLink.foreground');
const linkActive     = hex('textLink.activeForeground');
const tabBorder      = hex('tab.border');
const tabInactiveBg  = hex('tab.inactiveBackground');
const tabActiveFg    = hex('tab.activeForeground');
const tabInactiveFg  = hex('tab.inactiveForeground');
const tabAccent      = hex('tab.activeBorder');
const unfocusedFg    = hex('tab.unfocusedInactiveForeground');
// ── Variant Specific Logic ───────────────────────────────────────────────────
let tabBackgroundText;

if (variant === 'light') {
  // Contrast fix for Light theme: use a darker shade for inactive tab text
  tabBackgroundText = '#604c8a'; 
} else {
  tabBackgroundText = '#a19da8';
}

const colors = {
  bookmark_text:                          toRgb(editorFg),
  button_background:                      darken(toolbar, variant === 'dark' ? 1.25 : 0.95),
  control_background:                     toRgb(tabBorder),

  frame:                                  toRgb(frame),
  frame_inactive:                         darken(frame, 0.85),
  
  // Incognito: Dark theme uses deeper violet, Light theme now ALSO uses dark for privacy context
  frame_incognito:                        variant === 'dark' ? darken(frame, 0.72) : [35, 29, 48],
  frame_incognito_inactive:               variant === 'dark' ? darken(frame, 0.47) : [28, 21, 40],

  background_tab:                         toRgb(tabInactiveBg),

  ntp_background:                         toRgb(editorBg),
  ntp_header:                             toRgb(toolbar),
  ntp_link:                               toRgb(link),
  ntp_link_underline:                     toRgb(link),
  ntp_section:                            toRgb(toolbar),
  ntp_section_link:                       toRgb(linkActive),
  ntp_section_text:                       toRgb(iconFg),
  ntp_text:                               toRgb(editorFg),

  omnibox_background:                     toRgb(editorBg),
  omnibox_text:                           toRgb(editorFg),

  tab_background_separator:               toRgb(tabBorder),
  tab_background_text:                    toRgb(tabBackgroundText),
  tab_background_text_inactive:           toRgb(tabInactiveFg),
  tab_background_text_incognito:          toRgb(tabInactiveFg),
  tab_background_text_incognito_inactive: toRgb(unfocusedFg),
  tab_line:                               toRgb(tabAccent),
  tab_text:                               toRgb(tabActiveFg),

  toolbar:                                toRgb(toolbar),
  toolbar_button_icon:                    toRgb(iconFg),
  toolbar_text:                           toRgb(editorFg),
};

// ── Missing Polish Properties ────────────────────────────────────────────────
const properties = {
  ntp_background_alignment: "center",
  ntp_background_repeat: "no-repeat",
  ntp_logo_alternate: variant === 'dark' ? 1 : 0
};

// Clamp RGB
for (const [key, rgb] of Object.entries(colors)) {
  colors[key] = rgb.map(v => Math.max(0, Math.min(255, v)));
}

if (isWrite) {
  const manifest = JSON.parse(readFileSync(targetPath, 'utf8'));

  manifest.theme.colors = colors;

  manifest.theme.properties = { ...manifest.theme.properties, ...properties };

  writeFileSync(targetPath, JSON.stringify(manifest, null, 2) + '\n');

  console.log(`✓ Updated ${TARGET_MAP[variant]}`);
} else {
  console.log(JSON.stringify({ colors, properties }, null, 2));
}
