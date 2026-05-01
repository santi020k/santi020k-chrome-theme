#!/usr/bin/env node
/**
 * Reads ../santi020k-theme/themes/santi020k-dark-color-theme.json (JSONC) and
 * emits a theme.colors JSON snippet that can be diffed against manifest.json.
 *
 * Usage:
 *   node scripts/sync-from-vscode-theme.mjs
 *   SOURCE_THEME=../santi020k-theme/themes/santi020k-dark-color-theme.json node scripts/sync-from-vscode-theme.mjs
 *
 * Assumes both repos live side-by-side under the same parent directory.
 */

import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dir = dirname(fileURLToPath(import.meta.url));
const DEFAULT_SOURCE = resolve(__dir, '../../santi020k-theme/themes/santi020k-dark-color-theme.json');
const sourcePath = process.env.SOURCE_THEME
  ? resolve(process.env.SOURCE_THEME)
  : DEFAULT_SOURCE;

if (!existsSync(sourcePath)) {
  console.error(`Source theme not found: ${sourcePath}`);
  console.error('Clone santi020k-theme next to santi020k-chrome-theme, or set SOURCE_THEME env.');
  process.exit(1);
}

// JSONC → JSON: strip line comments and block comments
const raw = readFileSync(sourcePath, 'utf8');
const stripped = raw
  .replace(/\/\/.*$/gm, '')
  .replace(/\/\*[\s\S]*?\*\//g, '');
const vsc = JSON.parse(stripped).colors;

function hex(token) {
  const v = vsc[token];
  if (!v) throw new Error(`Missing VS Code token: ${token}`);
  return v.slice(0, 7); // strip alpha if present
}

function toRgb(h) {
  const n = parseInt(h.replace('#', ''), 16);
  return [n >> 16 & 0xff, n >> 8 & 0xff, n & 0xff];
}

function darken(h, factor) {
  const [r, g, b] = toRgb(h);
  return [Math.round(r * factor), Math.round(g * factor), Math.round(b * factor)];
}

const frame          = hex('titleBar.activeBackground');   // #0b0712
const frameInactive  = hex('titleBar.inactiveBackground'); // #0b0712 — darken for distinction
const toolbar        = hex('sideBar.background');          // #1c1528
const editorBg       = hex('editor.background');           // #110c1d
const editorFg       = hex('editor.foreground');           // #dfdde3
const iconFg         = hex('icon.foreground');             // #b6b2bd
const link           = hex('textLink.foreground');         // #945df4
const linkActive     = hex('textLink.activeForeground');   // #b48df7
const tabBorder      = hex('tab.border');                  // #231d30
const tabInactiveBg  = hex('tab.inactiveBackground');      // #0b0712
const tabActiveFg    = hex('tab.activeForeground');        // #dfdde3
const tabInactiveFg  = hex('tab.inactiveForeground');      // #8d8896
const tabAccent      = hex('tab.activeBorder');            // #752df0
const unfocusedFg    = hex('tab.unfocusedInactiveForeground'); // #5e576b

const colors = {
  bookmark_text:                          toRgb(editorFg),
  button_background:                      darken(toolbar, 1.25), // slightly brighter than toolbar
  control_background:                     toRgb(tabBorder),

  frame:                                  toRgb(frame),
  frame_inactive:                         darken(frame, 0.65),
  frame_incognito:                        darken(frame, 0.72),
  frame_incognito_inactive:               darken(frame, 0.47),

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
  tab_background_text:                    toRgb('#a19da8'),
  tab_background_text_inactive:           toRgb(tabInactiveFg),
  tab_background_text_incognito:          toRgb(tabInactiveFg),
  tab_background_text_incognito_inactive: toRgb(unfocusedFg),
  tab_line:                               toRgb(tabAccent),
  tab_text:                               toRgb(tabActiveFg),

  toolbar:                                toRgb(toolbar),
  toolbar_button_icon:                    toRgb(iconFg),
  toolbar_text:                           toRgb(editorFg),
};

// Clamp RGB values to valid range
for (const [key, rgb] of Object.entries(colors)) {
  colors[key] = rgb.map(v => Math.max(0, Math.min(255, v)));
}

console.log(JSON.stringify({ colors }, null, 2));
