#!/usr/bin/env node
/**
 * Generates images/theme_ntp_background_light.png — a 256×256 vertical gradient
 * from #f8f6fd (light mode bg, top) to #f0edf9 (light mode surface, bottom).
 *
 * Usage:
 *   node scripts/generate-ntp-image-light.mjs
 */

import { writeFileSync, mkdirSync } from 'fs';
import { deflateSync } from 'zlib';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dir = dirname(fileURLToPath(import.meta.url));
const root = join(__dir, '..');

const W = 256, H = 256;
const TOP = [0xf8, 0xf6, 0xfd];
const BOT = [0xf0, 0xed, 0xf9];

const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c;
  }
  return t;
})();

function crc32(buf) {
  let crc = 0xffffffff;
  for (const b of buf) crc = CRC_TABLE[(crc ^ b) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const typeBytes = Buffer.from(type, 'ascii');
  const lenBuf = Buffer.alloc(4);
  lenBuf.writeUInt32BE(data.length);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBytes, data])));
  return Buffer.concat([lenBuf, typeBytes, data, crcBuf]);
}

const ihdr = Buffer.alloc(13);
ihdr.writeUInt32BE(W, 0);
ihdr.writeUInt32BE(H, 4);
ihdr[8] = 8; ihdr[9] = 2;

const raw = Buffer.alloc(H * (1 + W * 3));
for (let y = 0; y < H; y++) {
  const t = y / (H - 1);
  const r = Math.round(TOP[0] + t * (BOT[0] - TOP[0]));
  const g = Math.round(TOP[1] + t * (BOT[1] - TOP[1]));
  const b = Math.round(TOP[2] + t * (BOT[2] - TOP[2]));
  const base = y * (1 + W * 3);
  raw[base] = 0;
  for (let x = 0; x < W; x++) {
    raw[base + 1 + x * 3] = r;
    raw[base + 2 + x * 3] = g;
    raw[base + 3 + x * 3] = b;
  }
}

const png = Buffer.concat([
  Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
  chunk('IHDR', ihdr),
  chunk('IDAT', deflateSync(raw)),
  chunk('IEND', Buffer.alloc(0)),
]);

mkdirSync(join(root, 'images'), { recursive: true });
writeFileSync(join(root, 'images', 'theme_ntp_background_light.png'), png);
console.log(`Generated images/theme_ntp_background_light.png (${png.length} bytes)`);
