import type { Metadata } from "next";
import Breadcrumbs from "../components/Breadcrumbs";
import DoodleGallery from "../components/DoodleGallery";
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
    <main className="min-h-screen w-full flex flex-col items-center px-6 pt-16 pb-28 gap-6">
      <div className="flex flex-col items-center gap-4 w-full border-b border-dashed max-w-3xl pb-12 border-b-zinc-200">
        <Breadcrumbs current="Doodles" />
        <h1 className="mt-8 text-2xl sm:text-3xl text-center leading-tight">
          Daily Doodles
        </h1>
        <h2>Your every day sharpie artist</h2>
      </div>

      <DoodleGallery doodles={doodles} />
    </main>
  );
}
