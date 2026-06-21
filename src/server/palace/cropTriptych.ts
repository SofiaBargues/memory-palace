import { deflateSync, inflateSync } from "zlib";

const PNG_SIGNATURE = Buffer.from([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
]);

type PngChunk = {
  type: string;
  data: Buffer;
};

type DecodedPng = {
  width: number;
  height: number;
  bitDepth: number;
  colorType: number;
  bytesPerPixel: number;
  pixels: Buffer;
};

const CRC_TABLE = new Uint32Array(256).map((_, index) => {
  let crc = index;
  for (let bit = 0; bit < 8; bit++) {
    crc = crc & 1 ? 0xedb88320 ^ (crc >>> 1) : crc >>> 1;
  }
  return crc >>> 0;
});

function crc32(buffer: Buffer) {
  let crc = 0xffffffff;
  for (const byte of buffer) {
    crc = CRC_TABLE[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function readChunks(buffer: Buffer): PngChunk[] {
  if (!buffer.subarray(0, PNG_SIGNATURE.length).equals(PNG_SIGNATURE)) {
    throw new Error("Generated triptych is not a PNG image");
  }

  const chunks: PngChunk[] = [];
  let offset = PNG_SIGNATURE.length;

  while (offset < buffer.length) {
    const length = buffer.readUInt32BE(offset);
    const type = buffer.subarray(offset + 4, offset + 8).toString("ascii");
    const data = buffer.subarray(offset + 8, offset + 8 + length);
    chunks.push({ type, data });
    offset += 12 + length;

    if (type === "IEND") {
      break;
    }
  }

  return chunks;
}

function getBytesPerPixel(colorType: number, bitDepth: number) {
  if (bitDepth !== 8) {
    throw new Error("Only 8-bit PNG images are supported for triptych cropping");
  }

  if (colorType === 2) return 3;
  if (colorType === 6) return 4;

  throw new Error("Only RGB and RGBA PNG images are supported");
}

function paethPredictor(left: number, up: number, upperLeft: number) {
  const estimate = left + up - upperLeft;
  const leftDistance = Math.abs(estimate - left);
  const upDistance = Math.abs(estimate - up);
  const upperLeftDistance = Math.abs(estimate - upperLeft);

  if (leftDistance <= upDistance && leftDistance <= upperLeftDistance) {
    return left;
  }

  if (upDistance <= upperLeftDistance) {
    return up;
  }

  return upperLeft;
}

function unfilterScanline(
  filter: number,
  scanline: Buffer,
  previousScanline: Buffer,
  bytesPerPixel: number
) {
  const result = Buffer.alloc(scanline.length);

  for (let index = 0; index < scanline.length; index++) {
    const raw = scanline[index];
    const left = index >= bytesPerPixel ? result[index - bytesPerPixel] : 0;
    const up = previousScanline[index] ?? 0;
    const upperLeft =
      index >= bytesPerPixel ? previousScanline[index - bytesPerPixel] : 0;

    if (filter === 0) {
      result[index] = raw;
    } else if (filter === 1) {
      result[index] = (raw + left) & 0xff;
    } else if (filter === 2) {
      result[index] = (raw + up) & 0xff;
    } else if (filter === 3) {
      result[index] = (raw + Math.floor((left + up) / 2)) & 0xff;
    } else if (filter === 4) {
      result[index] = (raw + paethPredictor(left, up, upperLeft)) & 0xff;
    } else {
      throw new Error(`Unsupported PNG filter: ${filter}`);
    }
  }

  return result;
}

function decodePng(buffer: Buffer): DecodedPng {
  const chunks = readChunks(buffer);
  const ihdr = chunks.find((chunk) => chunk.type === "IHDR");

  if (!ihdr) {
    throw new Error("PNG image is missing an IHDR chunk");
  }

  const width = ihdr.data.readUInt32BE(0);
  const height = ihdr.data.readUInt32BE(4);
  const bitDepth = ihdr.data[8];
  const colorType = ihdr.data[9];
  const compressionMethod = ihdr.data[10];
  const filterMethod = ihdr.data[11];
  const interlaceMethod = ihdr.data[12];

  if (compressionMethod !== 0 || filterMethod !== 0 || interlaceMethod !== 0) {
    throw new Error("Unsupported PNG encoding for triptych cropping");
  }

  const bytesPerPixel = getBytesPerPixel(colorType, bitDepth);
  const rowLength = width * bytesPerPixel;
  const compressedData = Buffer.concat(
    chunks
      .filter((chunk) => chunk.type === "IDAT")
      .map((chunk) => chunk.data)
  );
  const inflatedData = inflateSync(compressedData);
  const pixels = Buffer.alloc(rowLength * height);
  let previousScanline = Buffer.alloc(rowLength);

  for (let row = 0; row < height; row++) {
    const sourceOffset = row * (rowLength + 1);
    const filter = inflatedData[sourceOffset];
    const scanline = inflatedData.subarray(
      sourceOffset + 1,
      sourceOffset + 1 + rowLength
    );
    const unfiltered = unfilterScanline(
      filter,
      scanline,
      previousScanline,
      bytesPerPixel
    );
    unfiltered.copy(pixels, row * rowLength);
    previousScanline = unfiltered;
  }

  return { width, height, bitDepth, colorType, bytesPerPixel, pixels };
}

function createChunk(type: string, data: Buffer) {
  const typeBuffer = Buffer.from(type, "ascii");
  const chunk = Buffer.alloc(12 + data.length);
  chunk.writeUInt32BE(data.length, 0);
  typeBuffer.copy(chunk, 4);
  data.copy(chunk, 8);
  chunk.writeUInt32BE(crc32(Buffer.concat([typeBuffer, data])), 8 + data.length);
  return chunk;
}

function encodePng(image: DecodedPng) {
  const rowLength = image.width * image.bytesPerPixel;
  const rawData = Buffer.alloc((rowLength + 1) * image.height);

  for (let row = 0; row < image.height; row++) {
    const targetOffset = row * (rowLength + 1);
    rawData[targetOffset] = 0;
    image.pixels.copy(
      rawData,
      targetOffset + 1,
      row * rowLength,
      row * rowLength + rowLength
    );
  }

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(image.width, 0);
  ihdr.writeUInt32BE(image.height, 4);
  ihdr[8] = image.bitDepth;
  ihdr[9] = image.colorType;
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  return Buffer.concat([
    PNG_SIGNATURE,
    createChunk("IHDR", ihdr),
    createChunk("IDAT", deflateSync(rawData)),
    createChunk("IEND", Buffer.alloc(0)),
  ]);
}

function cropSquare(image: DecodedPng, x: number, y: number, size: number) {
  const sourceRowLength = image.width * image.bytesPerPixel;
  const targetRowLength = size * image.bytesPerPixel;
  const pixels = Buffer.alloc(targetRowLength * size);

  for (let row = 0; row < size; row++) {
    const sourceOffset =
      (y + row) * sourceRowLength + x * image.bytesPerPixel;
    const targetOffset = row * targetRowLength;
    image.pixels.copy(
      pixels,
      targetOffset,
      sourceOffset,
      sourceOffset + targetRowLength
    );
  }

  return encodePng({
    ...image,
    width: size,
    height: size,
    pixels,
  });
}

export function cropTriptychBase64(base64Image: string): string[] {
  const decoded = decodePng(Buffer.from(base64Image, "base64"));
  const panelWidth = Math.floor(decoded.width / 3);
  const squareSize = Math.min(panelWidth, decoded.height);

  if (panelWidth < 1 || squareSize < 1) {
    throw new Error("Triptych image is too small to crop");
  }

  return [0, 1, 2].map((panelIndex) => {
    const panelStartX = panelIndex * panelWidth;
    const x = panelStartX + Math.floor((panelWidth - squareSize) / 2);
    const y = Math.floor((decoded.height - squareSize) / 2);
    return cropSquare(decoded, x, y, squareSize).toString("base64");
  });
}
