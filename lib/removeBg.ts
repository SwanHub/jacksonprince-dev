import { decodeRLEMask, RLEMask } from "./decodeRLEMask";

export type Sam3Predictions = {
  image: { width: number; height: number };
  predictions: { rle_mask: RLEMask }[];
};

export async function removeBg(
  image: File,
  predictions: Sam3Predictions,
  options: { featherEdges?: boolean } = {},
): Promise<Blob> {
  const mask = buildMask(predictions);
  const cutout = await applyMask(image, mask, options.featherEdges ?? false);
  return encodePNG(cutout);
}

function buildMask({ image, predictions }: Sam3Predictions): HTMLCanvasElement {
  const mask = document.createElement("canvas");
  mask.width = image.width;
  mask.height = image.height;
  const ctx = mask.getContext("2d")!;

  for (const { rle_mask } of predictions) {
    if (!rle_mask) continue;
    const layer = document.createElement("canvas");
    layer.width = mask.width;
    layer.height = mask.height;
    layer.getContext("2d")!.putImageData(decodeRLEMask(rle_mask), 0, 0);
    ctx.drawImage(layer, 0, 0);
  }
  return mask;
}

// The decoded mask is binary (alpha 0 or 255), which leaves a hard staircase
// along the cutout edge. Blurring the mask slightly before compositing turns
// that into a soft alpha ramp — cheap anti-aliasing. The radius scales with
// resolution so large and small images feather proportionally.
function featherRadius(mask: HTMLCanvasElement): number {
  return Math.max(1, Math.round(Math.max(mask.width, mask.height) / 2500));
}

async function applyMask(
  image: File,
  mask: HTMLCanvasElement,
  featherEdges: boolean,
): Promise<HTMLCanvasElement> {
  const canvas = document.createElement("canvas");
  canvas.width = mask.width;
  canvas.height = mask.height;
  const ctx = canvas.getContext("2d")!;

  ctx.drawImage(await createImageBitmap(image), 0, 0, mask.width, mask.height);
  ctx.globalCompositeOperation = "destination-in";
  if (featherEdges) ctx.filter = `blur(${featherRadius(mask)}px)`;
  ctx.drawImage(mask, 0, 0);
  ctx.filter = "none";
  return canvas;
}

function encodePNG(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) =>
    canvas.toBlob(
      (blob) =>
        blob ? resolve(blob) : reject(new Error("Failed to encode PNG.")),
      "image/png",
    ),
  );
}

function isSam3Predictions(value: unknown): value is Sam3Predictions {
  const v = value as Sam3Predictions;
  return (
    !!v &&
    typeof v === "object" &&
    typeof v.image?.width === "number" &&
    typeof v.image?.height === "number" &&
    Array.isArray(v.predictions)
  );
}

// Roboflow workflows return { outputs: [{ <output name>: <value> }] } — the
// output name depends on how the workflow was authored, so scan for the value
// shaped like SAM3 predictions.
export function extractSam3Predictions(
  result: unknown,
): Sam3Predictions | null {
  const outputs = (result as { outputs?: unknown[] })?.outputs;
  const first = Array.isArray(outputs) ? outputs[0] : result;
  if (!first || typeof first !== "object") return null;

  if (isSam3Predictions(first)) return first;
  for (const value of Object.values(first)) {
    if (isSam3Predictions(value)) return value;
  }
  return null;
}
