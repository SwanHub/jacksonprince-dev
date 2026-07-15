import { NextResponse } from "next/server";
import { getStorageClient } from "../../../../lib/assets";
import { UGC_BUCKET, UGC_FOLDER, UGC_TABLE } from "../../../../lib/ugc";

const MAX_IMAGE_BYTES = 30 * 1024 * 1024;

export async function POST(request: Request) {
  const supabase = getStorageClient();
  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase is not configured." },
      { status: 500 },
    );
  }

  const formData = await request.formData();
  const original = formData.get("original");
  const result = formData.get("result");
  const prompt = formData.get("prompt");

  if (
    !(original instanceof File) ||
    !(result instanceof File) ||
    original.size === 0 ||
    result.size === 0 ||
    original.size > MAX_IMAGE_BYTES ||
    result.size > MAX_IMAGE_BYTES ||
    typeof prompt !== "string"
  ) {
    return NextResponse.json({ error: "Invalid upload." }, { status: 400 });
  }

  const base = `${Date.now()}-${crypto.randomUUID().slice(0, 8)}`;
  const originalExt = original.type.split("/")[1]?.split("+")[0] || "png";
  const originalPath = `${UGC_FOLDER}/${base}-original.${originalExt}`;
  const resultPath = `${UGC_FOLDER}/${base}-cutout.png`;

  const bucket = supabase.storage.from(UGC_BUCKET);
  const uploads = await Promise.all([
    bucket.upload(originalPath, original, { contentType: original.type }),
    bucket.upload(resultPath, result, { contentType: "image/png" }),
  ]);
  const uploadError = uploads.find((u) => u.error)?.error;
  if (uploadError) {
    console.error("Failed to upload UGC images:", uploadError);
    return NextResponse.json({ error: "Upload failed." }, { status: 500 });
  }

  const originalUrl = bucket.getPublicUrl(originalPath).data.publicUrl;
  const resultUrl = bucket.getPublicUrl(resultPath).data.publicUrl;

  const { error: insertError } = await supabase.from(UGC_TABLE).insert({
    prompt: prompt.slice(0, 200),
    original_url: originalUrl,
    result_url: resultUrl,
  });
  if (insertError) {
    console.error("Failed to record UGC upload:", insertError);
    return NextResponse.json({ error: "Save failed." }, { status: 500 });
  }

  return NextResponse.json({ originalUrl, resultUrl });
}
