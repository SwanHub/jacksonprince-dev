import type { Metadata } from "next";
import PageHeader from "../components/PageHeader";
import PageShell from "../components/PageShell";

export const metadata: Metadata = {
  title: "About — Jackson Prince",
  description: "About Jackson Prince.",
};

export default function AboutPage() {
  return (
    <PageShell>
      <PageHeader breadcrumb="about" title="About" />

      <div className="w-full max-w-xl pt-4">
        {/* About content coming soon. */}
      </div>
    </PageShell>
  );
}
