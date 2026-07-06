import type { Metadata } from "next";
import Breadcrumbs from "../components/Breadcrumbs";
import DoodleGallery from "../components/DoodleGallery";
import PageShell from "../components/PageShell";
import { getDoodles } from "@/lib/doodles";

// Re-fetch the doodle list from Supabase at most once an hour.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Daily Doodles by Jackson Prince",
  description: "Daily Doodles by Jackson Prince.",
};

export default async function DoodlesPage() {
  const doodles = await getDoodles();
  return (
    <PageShell>
      <div className="flex flex-col items-start gap-4 w-full border-b border-dashed max-w-3xl pb-12 border-b-zinc-200">
        <Breadcrumbs current="doodles" />
        <h1 className="mt-8 text-2xl sm:text-3xl leading-tight">
          Daily Doodles
        </h1>
        <h2>
          I send the first 20 minutes of every day into a sketchbook. You, too?
        </h2>
      </div>

      <DoodleGallery doodles={doodles} />
    </PageShell>
  );
}
