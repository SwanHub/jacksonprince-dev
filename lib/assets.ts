import { createClient, SupabaseClient } from "@supabase/supabase-js";

export type Asset = {
  name: string;
  url: string;
};

export const ASSETS_BUCKET = process.env.SUPABASE_ASSETS_BUCKET ?? "assets";

export function getStorageClient(): SupabaseClient | null {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key || url.includes("your-project-ref")) return null;
  return createClient(url, key, { auth: { persistSession: false } });
}

export async function listAssets(): Promise<Asset[]> {
  const supabase = getStorageClient();
  if (!supabase) return [];

  try {
    const { data, error } = await supabase.storage.from(ASSETS_BUCKET).list("", {
      limit: 200,
      sortBy: { column: "created_at", order: "desc" },
    });
    if (error) throw error;

    return (data ?? [])
      // `id` is null for folder entries (e.g. the UGC folder) — skip those.
      .filter((file) => file.id && file.name && !file.name.startsWith("."))
      .map((file) => ({
        name: file.name,
        url: supabase.storage.from(ASSETS_BUCKET).getPublicUrl(file.name).data
          .publicUrl,
      }));
  } catch (err) {
    console.error("Failed to list assets from Supabase:", err);
    return [];
  }
}
