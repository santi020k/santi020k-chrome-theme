#!/usr/bin/env node
/**
 * Packages the Chrome theme extension into dist/santi020k-chrome-theme.zip.
 * Only runtime files are included — store/, scripts/, and markdown are excluded.
 *
 * Usage:
 *   npm run package          # build zip
 *   npm run package:dry      # validate without writing zip
 */

import { existsSync, readFileSync, mkdirSync, createWriteStream } from 'fs';
import { resolve, dirname, join } from 'path';
import { fileURLToPath } from 'url';
import archiver from 'archiver';

const __dir = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dir, '..');
const dryRun = process.argv.includes('--dry-run');

// Runtime entries to include in the zip (relative to root).
// Directories are added recursively; files are added as-is.
const INCLUDE = [
  { type: 'dir',  name: 'icons' },
  { type: 'dir',  name: 'images' },
  { type: 'file', name: 'manifest.json' },
  { type: 'file', name: 'LICENSE' },
];

function validate() {
  const manifestPath = join(root, 'manifest.json');
  if (!existsSync(manifestPath)) throw new Error('manifest.json not found');

  const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'));

  if (manifest.manifest_version !== 3)
    throw new Error(`Expected manifest_version 3, got ${manifest.manifest_version}`);
  if (!manifest.version || !/^\d+\.\d+\.\d+/.test(manifest.version))
    throw new Error(`Invalid or missing version: ${manifest.version}`);
  if (!manifest.theme?.colors?.frame)
    throw new Error('manifest.json missing theme.colors.frame');

  for (const icon of ['icon16.png', 'icon48.png', 'icon128.png']) {
    if (!existsSync(join(root, 'icons', icon)))
      throw new Error(`Missing required icon: icons/${icon}`);
  }

  console.log(`manifest.json v${manifest.version} — OK`);
  console.log(`theme.colors keys: ${Object.keys(manifest.theme.colors).join(', ')}`);
  return manifest.version;
}

function build(version) {
  return new Promise((res, rej) => {
    mkdirSync(join(root, 'dist'), { recursive: true });

    const outPath = join(root, 'dist', 'santi020k-chrome-theme.zip');
    const output = createWriteStream(outPath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', () => {
      console.log(`\nPacked: dist/santi020k-chrome-theme.zip (v${version}, ${archive.pointer()} bytes)`);
      res();
    });
    archive.on('error', rej);
    archive.pipe(output);

    for (const entry of INCLUDE) {
      const abs = join(root, entry.name);
      if (!existsSync(abs)) continue;
      if (entry.type === 'dir') {
        archive.directory(abs, entry.name);
      } else {
        archive.file(abs, { name: entry.name });
      }
      console.log(`  + ${entry.name}`);
    }

    archive.finalize();
  });
}

try {
  const version = validate();
  if (dryRun) {
    console.log('\n--dry-run: validation passed, zip not written.');
  } else {
    await build(version);
  }
} catch (err) {
  console.error('Error:', err.message);
  process.exit(1);
}
