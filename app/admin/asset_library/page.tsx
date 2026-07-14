import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageHeader from "../../components/PageHeader";
import PageShell from "../../components/PageShell";
import AssetLibraryClient from "./AssetLibraryClient";

export const metadata: Metadata = {
  title: "Asset Library",
  robots: { index: false, follow: false },
};

export default function AssetLibraryPage() {
  if (process.env.NODE_ENV !== "development") notFound();

  return (
    <PageShell>
      <PageHeader
        breadcrumb="asset library"
        title="Asset Library"
        subtitle="Upload images, copy URLs."
      />
      <AssetLibraryClient />
    </PageShell>
  );
}
