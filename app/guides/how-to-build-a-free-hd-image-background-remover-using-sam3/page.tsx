import type { Metadata } from "next";
import PageHeader from "../../components/PageHeader";
import PageShell from "../../components/PageShell";

export const metadata: Metadata = {
  title: "How to Build a Free HD Image Background Remover by Jackson Prince",
};

export default function HowToBuildAFreeBackgroundRemover() {
  return (
    <PageShell>
      <PageHeader
        breadcrumb="guides"
        title="How to Build a Free HD Image Background Remover Using SAM3"
        subtitle="A straightforward guide to creating your own high-res remove.bg in 5 minutes"
      />
      <article className="w-full max-w-xl">
        {/* Article coming soon. */}
      </article>
    </PageShell>
  );
}
