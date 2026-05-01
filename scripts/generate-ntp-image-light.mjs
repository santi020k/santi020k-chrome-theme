#!/usr/bin/env node
/**
 * Generates a high-quality Light Theme NTP background image (PNG).
 * Design: Light lavender background with a terminal prompt and dashed box.
 * Pure Node.js, no external dependencies.
 */

import { writeFileSync, mkdirSync } from 'fs';
import { deflateSync } from 'zlib';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dir = dirname(fileURLToPath(import.meta.url));
const root = join(__dir, '..');

const W = 1920, H = 1080;
const BG = [248, 246, 253];      // #f8f6fd
const ICON = [96, 76, 138];    // #604c8a
const DASH = [211, 205, 230];    // #d3cde6

// CRC32
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

function setPixel(x, y, color) {
  if (x < 0 || x >= W || y < 0 || y >= H) return;
  const base = y * (1 + W * 3) + 1 + x * 3;
  raw[base] = color[0];
  raw[base + 1] = color[1];
  raw[base + 2] = color[2];
}

function drawLine(x1, y1, x2, y2, color, thickness = 1) {
  const dx = Math.abs(x2 - x1);
  const dy = Math.abs(y2 - y1);
  const sx = x1 < x2 ? 1 : -1;
  const sy = y1 < y2 ? 1 : -1;
  let err = dx - dy;

  while (true) {
    for (let i = -Math.floor(thickness/2); i <= Math.floor(thickness/2); i++) {
      for (let j = -Math.floor(thickness/2); j <= Math.floor(thickness/2); j++) {
        setPixel(x1 + i, y1 + j, color);
      }
    }
    if (x1 === x2 && y1 === y2) break;
    const e2 = 2 * err;
    if (e2 > -dy) { err -= dy; x1 += sx; }
    if (e2 < dx) { err += dx; y1 += sy; }
  }
}

// 1. Fill background
for (let y = 0; y < H; y++) {
  const base = y * (1 + W * 3);
  raw[base] = 0;
  for (let x = 0; x < W; x++) {
    const px = base + 1 + x * 3;
    raw[px] = BG[0];
    raw[px + 1] = BG[1];
    raw[px + 2] = BG[2];
  }
}

// 2. Draw Dashed Box (Right Aligned)
const boxSize = 600;
const boxX = W - 720;
const boxY = (H - boxSize) / 2;
const dashLen = 20;

function drawDashedLine(x1, y1, x2, y2, color, thickness) {
  const dist = Math.hypot(x2 - x1, y2 - y1);
  const steps = dist;
  for (let s = 0; s < steps; s++) {
    if (Math.floor(s / dashLen) % 2 === 0) {
      const x = Math.round(x1 + (x2 - x1) * (s / dist));
      const y = Math.round(y1 + (y2 - y1) * (s / dist));
      for (let i = -Math.floor(thickness/2); i <= Math.floor(thickness/2); i++) {
        for (let j = -Math.floor(thickness/2); j <= Math.floor(thickness/2); j++) {
          setPixel(x + i, y + j, color);
        }
      }
    }
  }
}

drawDashedLine(boxX, boxY, boxX + boxSize, boxY, DASH, 3); // Top
drawDashedLine(boxX + boxSize, boxY, boxX + boxSize, boxY + boxSize, DASH, 3); // Right
drawDashedLine(boxX + boxSize, boxY + boxSize, boxX, boxY + boxSize, DASH, 3); // Bottom
drawDashedLine(boxX, boxY + boxSize, boxX, boxY, DASH, 3); // Left

// 3. Draw Terminal Prompt "> _"
const iconCenterX = boxX + boxSize / 2;
const iconCenterY = boxY + boxSize / 2;

// ">"
drawLine(iconCenterX - 80, iconCenterY - 80, iconCenterX + 20, iconCenterY, ICON, 16);
drawLine(iconCenterX + 20, iconCenterY, iconCenterX - 80, iconCenterY + 80, ICON, 16);

// "_"
drawLine(iconCenterX + 60, iconCenterY + 80, iconCenterX + 160, iconCenterY + 80, ICON, 16);

// Finalize PNG
const png = Buffer.concat([
  Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
  chunk('IHDR', ihdr),
  chunk('IDAT', deflateSync(raw)),
  chunk('IEND', Buffer.alloc(0)),
]);

mkdirSync(join(root, 'images'), { recursive: true });
writeFileSync(join(root, 'images', 'theme_ntp_background_light.png'), png);
console.log(`Generated images/theme_ntp_background_light.png (${png.length} bytes)`);
