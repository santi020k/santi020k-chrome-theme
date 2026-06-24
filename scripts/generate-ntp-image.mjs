#!/usr/bin/env node
/**
 * Converts images/theme_ntp_background.webp → images/theme_ntp_background.png
 * for the Santi020k Chrome theme.
 *
 * Chrome cannot decode WebP theme images; this script uses the macOS `sips`
 * utility to losslessly re-encode the authoritative WebP (3840×2160) as a PNG
 * that Chrome can load as the New Tab Page background.
 *
 * Source asset: images/theme_ntp_background.webp
 * Output asset: images/theme_ntp_background.png
 *
 * Usage:
 *   pnpm run sync:assets
 */

import { execSync } from 'child_process';
import { mkdirSync, statSync } from 'fs';
import { dirname,join } from 'path';
import { fileURLToPath } from 'url';

const __dir = dirname(fileURLToPath(import.meta.url));
const root = join(__dir, '..');
const src = join(root, 'images', 'theme_ntp_background.webp');
const out = join(root, 'images', 'theme_ntp_background.png');

mkdirSync(join(root, 'images'), { recursive: true });

// Use -Z 1920 to ensure the image is standard 1080p resolution.
// Use --deleteColorManagementProperties to strip ICC profiles that can cause decoding errors in some Chrome versions.
execSync(`sips -s format png -Z 1920 --deleteColorManagementProperties "${src}" --out "${out}"`, { stdio: 'inherit' });

const { size } = statSync(out);

console.log(`Converted theme_ntp_background.webp → theme_ntp_background.png (${size} bytes)`);

