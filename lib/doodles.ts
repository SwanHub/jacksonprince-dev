import { createClient } from "@supabase/supabase-js";

export type Doodle = {
  thumb: string;
  full: string;
  date: string;
};

type GwDayRow = {
  doodle_image_thumb_url: string | null;
  doodle_image_url: string | null;
  date?: string | null;
  created_at?: string | null;
};

// Local images served from /public, used until Supabase is configured
// (or if the query fails / returns nothing).
const FALLBACK_DOODLES: Doodle[] = [
  { thumb: "/doodle_1.JPG", full: "/doodle_1.JPG", date: "May 2026" },
  { thumb: "/doodle_2.JPG", full: "/doodle_2.JPG", date: "April 2026" },
  { thumb: "/doodle_3.JPG", full: "/doodle_3.JPG", date: "March 2026" },
];

function formatDate(iso: string | null | undefined): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

export async function getDoodles(): Promise<Doodle[]> {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;

  if (!url || !key || url.includes("your-project-ref")) {
    return FALLBACK_DOODLES;
  }

  try {
    const supabase = createClient(url, key, {
      auth: { persistSession: false },
    });

    const { data, error } = await supabase
      .from("gw_days")
      .select("*")
      .eq("is_doodle_published", true);
    if (error) throw error;

    const rows = (data ?? []) as GwDayRow[];
    const doodles = rows
      .filter((r) => r.doodle_image_thumb_url && r.doodle_image_url)
      .sort((a, b) =>
        (b.date ?? b.created_at ?? "").localeCompare(
          a.date ?? a.created_at ?? "",
        ),
      )
      .map((r) => ({
        thumb: r.doodle_image_thumb_url as string,
        full: r.doodle_image_url as string,
        date: formatDate(r.date ?? r.created_at),
      }));

    return doodles.length > 0 ? doodles : FALLBACK_DOODLES;
  } catch (err) {
    console.error("Failed to fetch doodles from Supabase:", err);
    return FALLBACK_DOODLES;
  }
}
