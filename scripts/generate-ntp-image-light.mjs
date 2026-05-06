#!/usr/bin/env node
/**
 * Copies images/light.png → images/theme_ntp_background_light.png
 * for the Santi020k Chrome Theme (Light variant).
 *
 * Chrome cannot load the source asset directly from an arbitrary path;
 * this script ensures the authoritative light background (1920×1080 PNG)
 * is always in place at the path referenced by manifest-light.json.
 *
 * Source asset: images/light.png
 * Output asset: images/theme_ntp_background_light.png
 *
 * Usage:
 *   pnpm run sync:assets
 */

import { copyFileSync, mkdirSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dir = dirname(fileURLToPath(import.meta.url));
const root = join(__dir, '..');

const src = join(root, 'images', 'light.png');
const out = join(root, 'images', 'theme_ntp_background_light.png');

mkdirSync(join(root, 'images'), { recursive: true });

copyFileSync(src, out);

const { size } = statSync(out);
console.log(`Copied light.png → theme_ntp_background_light.png (${size} bytes)`);
