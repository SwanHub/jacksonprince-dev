import type { Metadata } from "next";
import Breadcrumbs from "../components/Breadcrumbs";
import PageShell from "../components/PageShell";

export const metadata: Metadata = {
  title: "About — Jackson Prince",
  description: "About Jackson Prince.",
};

export default function AboutPage() {
  return (
    <PageShell>
      <div className="flex flex-col items-center gap-4 w-full border-b border-dashed max-w-3xl pb-12 border-b-zinc-200">
        <Breadcrumbs current="about" />
        <h1 className="mt-8 text-2xl sm:text-3xl text-center leading-tight">
          About
        </h1>
      </div>

      <div className="w-full max-w-xl pt-4">
        {/* About content coming soon. */}
      </div>
    </PageShell>
  );
}
