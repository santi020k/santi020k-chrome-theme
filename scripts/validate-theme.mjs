#!/usr/bin/env node
import { existsSync,readFileSync } from 'fs';
import { dirname,resolve } from 'path';
import { fileURLToPath } from 'url';

const __dir = dirname(fileURLToPath(import.meta.url));

/**
 * Calculates relative luminance of an RGB color.
 * Formula: 0.2126 * R + 0.7152 * G + 0.0722 * B
 * where R, G, B are sRGB components after linearizing.
 */
function getLuminance(rgb) {
  const [r, g, b] = rgb.map(v => {
    const s = v / 255;

    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Calculates contrast ratio between two RGB colors.
 * Formula: (L1 + 0.05) / (L2 + 0.05)
 */
function getContrastRatio(rgb1, rgb2) {
  const l1 = getLuminance(rgb1);
  const l2 = getLuminance(rgb2);

  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

const CHECK_PAIRS = [
  { fg: 'tab_text', bg: 'frame', label: 'Active Tab Text' },
  { fg: 'tab_background_text', bg: 'background_tab', label: 'Inactive Tab Text' },
  { fg: 'ntp_text', bg: 'ntp_background', label: 'NTP Text' },
  { fg: 'ntp_link', bg: 'ntp_background', label: 'NTP Link' },
  { fg: 'omnibox_text', bg: 'omnibox_background', label: 'Omnibox Text' },
  { fg: 'toolbar_text', bg: 'toolbar', label: 'Toolbar Text' }
];

function validateTheme(filePath) {
  console.log(`\n🔍 Validating ${filePath}...`);
  
  if (!existsSync(filePath)) {
    console.error(`❌ File not found: ${filePath}`);

    process.exit(1);
  }

  const manifest = JSON.parse(readFileSync(filePath, 'utf8'));
  const colors = manifest.theme?.colors;

  if (!colors) {
    console.error(`❌ No theme colors found in ${filePath}`);

    process.exit(1);
  }

  let errors = 0;

  for (const { fg, bg, label } of CHECK_PAIRS) {
    const fgVal = colors[fg];
    const bgVal = colors[bg];

    if (!fgVal || !bgVal) {
      console.warn(`⚠️  Missing keys for ${label}: ${fg} or ${bg}`);

      continue;
    }

    const ratio = getContrastRatio(fgVal, bgVal);
    const pass = ratio >= 4.5;

    if (pass) {
      console.log(`✅ ${label.padEnd(20)}: ${ratio.toFixed(2)}:1 (Pass)`);
    } else {
      console.error(`❌ ${label.padEnd(20)}: ${ratio.toFixed(2)}:1 (FAIL - Needs 4.5:1)`);

      errors++;
    }
  }

  // Schema checks
  if (!manifest.manifest_version || manifest.manifest_version !== 3) {
    console.error(`❌ manifest_version must be 3`);

    errors++;
  }

  // Version consistency check
  const pkg = JSON.parse(readFileSync(resolve(__dir, '../package.json'), 'utf8'));

  if (manifest.version === pkg.version) {
    console.log(`✅ Version consistency: ${manifest.version}`);
  } else {
    console.error(`❌ Version mismatch: manifest version (${manifest.version}) does not match package.json (${pkg.version})`);

    errors++;
  }
  
  // Image existence check
  if (manifest.theme?.images) {
    for (const [key, path] of Object.entries(manifest.theme.images)) {
      const fullPath = resolve(__dir, '..', path);

      if (existsSync(fullPath)) {
        console.log(`✅ Image exists: ${key} (${path})`);
      } else {
        console.error(`❌ Missing image: ${key} references ${path} which does not exist`);

        errors++;
      }
    }
  } else {
    console.warn(`⚠️  No images defined in theme`);
  }

  return errors;
}

const darkErrors = validateTheme(resolve(__dir, '../manifest.json'));
const lightErrors = validateTheme(resolve(__dir, '../manifest-light.json'));
const totalErrors = darkErrors + lightErrors;

if (totalErrors > 0) {
  console.error(`\n❌ Validation failed with ${totalErrors} errors.`);

  process.exit(1);
} else {
  console.log(`\n✨ All themes passed accessibility and schema validation!`);
}
