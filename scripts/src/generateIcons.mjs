/**
 * Generates simple solid-color PNG icons for the Sweet Dreams PWA manifest.
 * Run from workspace root: node scripts/src/generateIcons.mjs
 */
import { deflateSync } from "zlib";
import { writeFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc ^= buf[i];
    for (let k = 0; k < 8; k++) {
      crc = crc & 1 ? (0xedb88320 ^ (crc >>> 1)) : crc >>> 1;
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function makeChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length);
  const typeBuf = Buffer.from(type);
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])));
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

/**
 * Creates a minimal valid RGB PNG of given size filled with a solid color,
 * with a centred cake emoji drawn as a circle badge.
 */
function createSolidPNG(size, r, g, b) {
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(size, 0);
  ihdrData.writeUInt32BE(size, 4);
  ihdrData[8] = 8;  // bit depth
  ihdrData[9] = 2;  // colour type: RGB
  ihdrData[10] = 0; // compression
  ihdrData[11] = 0; // filter
  ihdrData[12] = 0; // interlace

  // Build raw scanlines (filter byte 0 + RGB per pixel)
  const stride = 1 + size * 3;
  const raw = Buffer.alloc(stride * size, 0);
  const cx = size / 2;
  const cy = size / 2;
  const outerR = size / 2;
  const innerR = size * 0.42;

  for (let y = 0; y < size; y++) {
    const base = y * stride;
    raw[base] = 0; // filter none
    for (let x = 0; x < size; x++) {
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const off = base + 1 + x * 3;

      if (dist <= innerR) {
        // inner circle: slightly darker shade
        raw[off]     = Math.max(0, r - 30);
        raw[off + 1] = Math.max(0, g - 30);
        raw[off + 2] = Math.max(0, b - 30);
      } else if (dist <= outerR) {
        // ring: caramel colour
        raw[off]     = r;
        raw[off + 1] = g;
        raw[off + 2] = b;
      } else {
        // outside circle: dark background
        raw[off]     = 0x1a;
        raw[off + 1] = 0x0a;
        raw[off + 2] = 0x00;
      }
    }
  }

  const compressed = deflateSync(raw, { level: 9 });
  const ihdr = makeChunk("IHDR", ihdrData);
  const idat = makeChunk("IDAT", compressed);
  const iend = makeChunk("IEND", Buffer.alloc(0));

  return Buffer.concat([sig, ihdr, idat, iend]);
}

// caramel #d4a574
const [r, g, b] = [0xd4, 0xa5, 0x74];

const publicDir = join(__dirname, "../../artifacts/sweet-dreams/public");
mkdirSync(publicDir, { recursive: true });

writeFileSync(join(publicDir, "icon-192.png"), createSolidPNG(192, r, g, b));
writeFileSync(join(publicDir, "icon-512.png"), createSolidPNG(512, r, g, b));

console.log("✅  icon-192.png and icon-512.png written to artifacts/sweet-dreams/public/");
