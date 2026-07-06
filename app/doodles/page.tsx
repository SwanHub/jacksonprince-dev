import type { Metadata } from "next";
import DoodleGallery from "../components/DoodleGallery";
import PageHeader from "../components/PageHeader";
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
      <PageHeader
        breadcrumb="doodles"
        title="Daily Doodles"
        subtitle="I send the first 20 minutes of every day into a sketchbook. You, too?"
      />

      <DoodleGallery doodles={doodles} />
    </PageShell>
  );
}
