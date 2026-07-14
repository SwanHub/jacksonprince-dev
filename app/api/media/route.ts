import { NextResponse } from "next/server";
import {
  ASSETS_BUCKET,
  getStorageClient,
  listAssets,
} from "../../../lib/assets";

export const dynamic = "force-dynamic";

function isDev() {
  return process.env.NODE_ENV === "development";
}

export async function GET() {
  if (!isDev()) return new NextResponse(null, { status: 404 });

  const assets = await listAssets();
  return NextResponse.json({ assets });
}

export async function POST(request: Request) {
  if (!isDev()) return new NextResponse(null, { status: 404 });

  const supabase = getStorageClient();
  if (!supabase) {
    return NextResponse.json(
      { error: "Supabase is not configured." },
      { status: 500 },
    );
  }

  const formData = await request.formData();
  const files = formData
    .getAll("files")
    .filter((f): f is File => f instanceof File && f.size > 0);

  if (files.length === 0) {
    return NextResponse.json({ error: "No files provided." }, { status: 400 });
  }

  const failed: string[] = [];
  for (const file of files) {
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
    const { error } = await supabase.storage
      .from(ASSETS_BUCKET)
      .upload(`${Date.now()}-${safeName}`, file, {
        contentType: file.type,
      });
    if (error) {
      console.error(`Failed to upload ${file.name}:`, error);
      failed.push(file.name);
    }
  }

  if (failed.length > 0) {
    return NextResponse.json(
      { error: `Failed to upload: ${failed.join(", ")}` },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
