#!/usr/bin/env node
/**
 * Copies images/light.png → images/theme_ntp_background_light.png
 * for the Santi020k Chrome Theme (Light variant).
 *
 * Chrome cannot load the source asset directly from an arbitrary path;
 * this script ensures the authoritative light background (1920×1080 PNG)
 * is always in place at the path referenced by manifest-light.json.
 *
 * Source asset: images/theme_ntp_background_light.webp
 * Output asset: images/theme_ntp_background_light.png
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
const src = join(root, 'images', 'theme_ntp_background_light.webp');
const out = join(root, 'images', 'theme_ntp_background_light.png');

mkdirSync(join(root, 'images'), { recursive: true });

// Use sips to convert the high-quality WebP source to a compatible PNG.
// Use -Z 1920 to ensure the image is standard 1080p resolution.
// Use --deleteColorManagementProperties to strip ICC profiles that can cause decoding errors in some Chrome versions.
execSync(`sips -s format png -Z 1920 --deleteColorManagementProperties "${src}" --out "${out}"`, { stdio: 'inherit' });

const { size } = statSync(out);

console.log(`Converted theme_ntp_background_light.webp → theme_ntp_background_light.png (${size} bytes)`);
