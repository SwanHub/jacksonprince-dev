import type { Metadata } from "next";
import DoodleGallery from "../components/DoodleGallery";
import { getDoodles } from "@/lib/doodles";

// Re-fetch the doodle list from Supabase at most once an hour.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Doodles — Jackson Prince",
  description: "Doodles by Jackson Prince.",
};

export default async function DoodlesPage() {
  const doodles = await getDoodles();
  return (
    <main className="min-h-screen w-full flex flex-col items-center px-6 pt-16 pb-28 gap-10">
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-2xl sm:text-3xl text-center leading-tight">
          Doodles
        </h1>
        <h2>Every day</h2>
      </div>

      <DoodleGallery doodles={doodles} />
    </main>
  );
}
