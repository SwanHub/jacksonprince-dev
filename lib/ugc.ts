// UGC lives in a folder inside the shared assets bucket.
export const UGC_BUCKET = process.env.SUPABASE_ASSETS_BUCKET ?? "assets";
export const UGC_FOLDER = "bg-remover-ugc";

export const UGC_TABLE = "jdp_ugc_uploads";

export type UgcUpload = {
  id: string;
  created_at: string;
  prompt: string;
  original_url: string;
  result_url: string;
};

// TODO: query UGC_TABLE via Supabase once the table exists. Stubbed so the
// tools gallery can render its empty state in the meantime.
export async function getRecentUgcUploads(): Promise<UgcUpload[]> {
  return [];
}
