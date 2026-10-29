import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { fileURLToPath } from "node:url";

const PNG_SIGNATURE = Buffer.from([137,80,78,71,13,10,26,10]);

function crc32(buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) {
    crc ^= byte;
    for (let i = 0; i < 8; i += 1) crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function pngChunk(type, data = Buffer.alloc(0)) {
  const name = Buffer.from(type, "ascii");
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([name, data])), 0);
  return Buffer.concat([length, name, data, crc]);
}

function paeth(a, b, c) {
  const p = a + b - c;
  const pa = Math.abs(p - a);
  const pb = Math.abs(p - b);
  const pc = Math.abs(p - c);
  return pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
}

function decodeRgbaPng(buffer) {
  if (!buffer.subarray(0, 8).equals(PNG_SIGNATURE)) throw new Error("Ugyldig PNG-signatur");
  let offset = 8;
  let width = 0;
  let height = 0;
  let bitDepth = 0;
  let colorType = 0;
  let interlace = 0;
  const idat = [];

  while (offset < buffer.length) {
    const length = buffer.readUInt32BE(offset);
    const type = buffer.toString("ascii", offset + 4, offset + 8);
    const data = buffer.subarray(offset + 8, offset + 8 + length);
    offset += 12 + length;

    if (type === "IHDR") {
      width = data.readUInt32BE(0);
      height = data.readUInt32BE(4);
      bitDepth = data[8];
      colorType = data[9];
      interlace = data[12];
    } else if (type === "IDAT") {
      idat.push(data);
    } else if (type === "IEND") {
      break;
    }
  }

  if (bitDepth !== 8 || colorType !== 6 || interlace !== 0) {
    throw new Error(`Logo-PNG må være RGBA 8-bit uten interlace (fant bitDepth=${bitDepth}, colorType=${colorType}, interlace=${interlace})`);
  }

  const compressed = Buffer.concat(idat);
  const raw = zlib.inflateSync(compressed);
  const stride = width * 4;
  const pixels = Buffer.alloc(width * height * 4);
  let src = 0;

  for (let y = 0; y < height; y += 1) {
    const filter = raw[src++];
    const rowStart = y * stride;
    for (let x = 0; x < stride; x += 1) {
      const value = raw[src++];
      const left = x >= 4 ? pixels[rowStart + x - 4] : 0;
      const up = y > 0 ? pixels[rowStart - stride + x] : 0;
      const upLeft = y > 0 && x >= 4 ? pixels[rowStart - stride + x - 4] : 0;
      let decoded;
      if (filter === 0) decoded = value;
      else if (filter === 1) decoded = (value + left) & 255;
      else if (filter === 2) decoded = (value + up) & 255;
      else if (filter === 3) decoded = (value + Math.floor((left + up) / 2)) & 255;
      else if (filter === 4) decoded = (value + paeth(left, up, upLeft)) & 255;
      else throw new Error(`Ukjent PNG-filter: ${filter}`);
      pixels[rowStart + x] = decoded;
    }
  }

  return { width, height, pixels };
}

function encodeRgbaPng(width, height, pixels) {
  const stride = width * 4;
  const raw = Buffer.alloc((stride + 1) * height);
  for (let y = 0; y < height; y += 1) {
    const rowOffset = y * (stride + 1);
    raw[rowOffset] = 0;
    pixels.copy(raw, rowOffset + 1, y * stride, (y + 1) * stride);
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = 6;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  return Buffer.concat([
    PNG_SIGNATURE,
    pngChunk("IHDR", ihdr),
    pngChunk("IDAT", zlib.deflateSync(raw, { level: 9 })),
    pngChunk("IEND")
  ]);
}

function sampleBilinear(image, x, y) {
  const x0 = Math.max(0, Math.min(image.width - 1, Math.floor(x)));
  const y0 = Math.max(0, Math.min(image.height - 1, Math.floor(y)));
  const x1 = Math.min(image.width - 1, x0 + 1);
  const y1 = Math.min(image.height - 1, y0 + 1);
  const tx = x - x0;
  const ty = y - y0;
  const out = [0,0,0,0];

  for (let c = 0; c < 4; c += 1) {
    const p00 = image.pixels[(y0 * image.width + x0) * 4 + c];
    const p10 = image.pixels[(y0 * image.width + x1) * 4 + c];
    const p01 = image.pixels[(y1 * image.width + x0) * 4 + c];
    const p11 = image.pixels[(y1 * image.width + x1) * 4 + c];
    const top = p00 + (p10 - p00) * tx;
    const bottom = p01 + (p11 - p01) * tx;
    out[c] = Math.round(top + (bottom - top) * ty);
  }
  return out;
}

function createSquareIcon(source, size, contentWidthRatio) {
  const bg = [228, 241, 244, 255];
  const canvas = Buffer.alloc(size * size * 4);
  for (let i = 0; i < canvas.length; i += 4) {
    canvas[i] = bg[0];
    canvas[i + 1] = bg[1];
    canvas[i + 2] = bg[2];
    canvas[i + 3] = 255;
  }

  const targetWidth = Math.round(size * contentWidthRatio);
  const targetHeight = Math.round(targetWidth * source.height / source.width);
  const offsetX = Math.round((size - targetWidth) / 2);
  const offsetY = Math.round((size - targetHeight) / 2);

  for (let dy = 0; dy < targetHeight; dy += 1) {
    const sy = ((dy + 0.5) / targetHeight) * source.height - 0.5;
    for (let dx = 0; dx < targetWidth; dx += 1) {
      const sx = ((dx + 0.5) / targetWidth) * source.width - 0.5;
      const [r,g,b,a] = sampleBilinear(source, sx, sy);
      const alpha = a / 255;
      const index = ((offsetY + dy) * size + offsetX + dx) * 4;
      canvas[index] = Math.round(r * alpha + canvas[index] * (1 - alpha));
      canvas[index + 1] = Math.round(g * alpha + canvas[index + 1] * (1 - alpha));
      canvas[index + 2] = Math.round(b * alpha + canvas[index + 2] * (1 - alpha));
      canvas[index + 3] = 255;
    }
  }

  return encodeRgbaPng(size, size, canvas);
}

export function ensurePwaIcons(rootDir) {
  const sourcePath = path.join(rootDir, "assets", "images", "logo-symbol.png");
  const outputDir = path.join(rootDir, "assets", "icons");
  fs.mkdirSync(outputDir, { recursive: true });

  const source = decodeRgbaPng(fs.readFileSync(sourcePath));
  const outputs = [
    ["app-icon-192.png", 192, 0.82],
    ["app-icon-512.png", 512, 0.82],
    ["app-icon-maskable-512.png", 512, 0.70]
  ];

  for (const [name, size, ratio] of outputs) {
    fs.writeFileSync(path.join(outputDir, name), createSquareIcon(source, size, ratio));
  }
}

const invokedPath = process.argv[1] ? path.resolve(process.argv[1]) : "";
if (invokedPath && invokedPath === fileURLToPath(import.meta.url)) {
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
  ensurePwaIcons(root);
  console.log("PWA-ikoner generert.");
}
