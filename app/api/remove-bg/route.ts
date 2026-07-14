import { NextResponse } from "next/server";

const MAX_IMAGE_BYTES = 15 * 1024 * 1024;

export async function POST(request: Request) {
  const url = process.env.ROBOFLOW_WORKFLOW_URL;
  const apiKey = process.env.ROBOFLOW_API_KEY;
  if (!url || !apiKey) {
    return NextResponse.json(
      { error: "Roboflow is not configured." },
      { status: 500 },
    );
  }

  const formData = await request.formData();
  const image = formData.get("image");
  const prompts = formData.get("prompts");

  if (!(image instanceof File) || image.size === 0) {
    return NextResponse.json({ error: "No image provided." }, { status: 400 });
  }
  if (image.size > MAX_IMAGE_BYTES) {
    return NextResponse.json(
      { error: "Image is too large (15MB max)." },
      { status: 413 },
    );
  }
  if (typeof prompts !== "string" || prompts.trim().length === 0) {
    return NextResponse.json({ error: "No prompt provided." }, { status: 400 });
  }

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      api_key: apiKey,
      inputs: {
        image: {
          type: "base64",
          value: Buffer.from(await image.arrayBuffer()).toString("base64"),
        },
        prompts: prompts
          .split(",")
          .map((p) => p.trim())
          .filter(Boolean),
      },
    }),
  });

  if (!response.ok) {
    console.error("Roboflow inference failed:", await response.text());
    return NextResponse.json(
      { error: "Inference failed. Try again in a moment." },
      { status: 502 },
    );
  }

  return NextResponse.json(await response.json());
}
