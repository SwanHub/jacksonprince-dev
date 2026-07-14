export type RLEMask = {
  size: [number, number];
  counts: string;
};

function decodeRLECounts(encoded: string): number[] {
  const counts: number[] = [];
  let p = 0;
  while (p < encoded.length) {
    let x = 0;
    let k = 0;
    let more = true;
    while (more) {
      const c = encoded.charCodeAt(p++) - 48;
      x |= (c & 0x1f) << (5 * k);
      more = (c & 0x20) !== 0;
      k++;
      if (!more && c & 0x10) x |= -1 << (5 * k);
    }
    if (counts.length > 2) x += counts[counts.length - 2];
    counts.push(x);
  }
  return counts;
}

export function decodeRLEMask({
  size: [height, width],
  counts,
}: RLEMask): ImageData {
  const mask = new ImageData(width, height);
  let pixel = 0;
  let inside = false;
  for (const run of decodeRLECounts(counts)) {
    if (inside) {
      for (let i = pixel; i < pixel + run; i++) {
        const row = i % height;
        const col = (i - row) / height;
        mask.data[(row * width + col) * 4 + 3] = 255;
      }
    }
    pixel += run;
    inside = !inside;
  }
  return mask;
}
