#!/usr/bin/env node
/**
 * Packages the Chrome theme extension into dist/santi020k-chrome-theme.zip.
 * Only runtime files are included — store/, scripts/, and markdown are excluded.
 *
 * Usage:
 *   node scripts/package-extension.mjs            # build zip
 *   node scripts/package-extension.mjs --dry-run  # validate without writing zip
 */

import { execSync } from 'child_process';
import { existsSync, readFileSync, readdirSync, mkdirSync } from 'fs';
import { resolve, dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dir = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dir, '..');
const dryRun = process.argv.includes('--dry-run');

// Runtime files/globs to include in the zip (relative to root)
const INCLUDE = ['manifest.json', 'icons', 'images', 'LICENSE'];

function validate() {
  const manifestPath = join(root, 'manifest.json');
  if (!existsSync(manifestPath)) {
    throw new Error('manifest.json not found');
  }

  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));

  if (manifest.manifest_version !== 3) {
    throw new Error(`Expected manifest_version 3, got ${manifest.manifest_version}`);
  }
  if (!manifest.version || !/^\d+\.\d+\.\d+/.test(manifest.version)) {
    throw new Error(`Invalid or missing version: ${manifest.version}`);
  }
  if (!manifest.theme?.colors?.frame) {
    throw new Error('manifest.json missing theme.colors.frame');
  }

  const iconDir = join(root, 'icons');
  const requiredIcons = ['icon16.png', 'icon48.png', 'icon128.png'];
  for (const icon of requiredIcons) {
    if (!existsSync(join(iconDir, icon))) {
      throw new Error(`Missing required icon: icons/${icon}`);
    }
  }

  console.log(`manifest.json v${manifest.version} — OK`);
  console.log(`theme.colors keys: ${Object.keys(manifest.theme.colors).join(', ')}`);
  return manifest.version;
}

function build(version) {
  const distDir = join(root, 'dist');
  mkdirSync(distDir, { recursive: true });

  const outFile = join(distDir, 'santi020k-chrome-theme.zip');

  // Build list of existing paths to include
  const paths = INCLUDE.filter(p => existsSync(join(root, p)));
  if (paths.length === 0) {
    throw new Error('No files found to include in zip');
  }

  const cmd = `cd "${root}" && zip -r "dist/santi020k-chrome-theme.zip" ${paths.join(' ')}`;
  execSync(cmd, { stdio: 'inherit' });

  console.log(`\nPacked: dist/santi020k-chrome-theme.zip (v${version})`);
  console.log('Included:', paths.join(', '));
}

try {
  const version = validate();
  if (dryRun) {
    console.log('\n--dry-run: validation passed, zip not written.');
  } else {
    build(version);
  }
} catch (err) {
  console.error('Error:', err.message);
  process.exit(1);
}
