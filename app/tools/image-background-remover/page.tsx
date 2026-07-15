import type { Metadata } from "next";
import Link from "next/link";
import BgRemover from "../../components/BgRemover";
import PageHeader from "../../components/PageHeader";
import PageShell from "../../components/PageShell";
import { getRecentUgcUploads } from "@/lib/ugc";

export const metadata: Metadata = {
  title: "HD Image Background Remover",
  description:
    "A free HD image background remover. Drop an image, type what to keep, and download a lossless cutout.",
};

const ARTICLE_HREF =
  "/writing/how-to-build-a-free-hd-image-background-remover-in-5-minutes";

const CHECKERBOARD = {
  backgroundImage:
    "linear-gradient(45deg, #f4f4f5 25%, transparent 25%), linear-gradient(-45deg, #f4f4f5 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f4f4f5 75%), linear-gradient(-45deg, transparent 75%, #f4f4f5 75%)",
  backgroundSize: "16px 16px",
  backgroundPosition: "0 0, 0 8px, 8px -8px, -8px 0",
};

export default async function ImageBackgroundRemoverPage() {
  const uploads = await getRecentUgcUploads();

  return (
    <PageShell>
      <PageHeader
        breadcrumbTrail={[{ label: "tools", href: "/tools" }]}
        breadcrumb="image background remover"
        title="HD Image Background Remover"
        subtitle="Drop an image, type what to keep, get a lossless cutout."
      />

      <div className="w-full max-w-3xl flex flex-col gap-12 pt-4">
        <BgRemover />

        <p className="text-sm text-zinc-500">
          Tool featured in{" "}
          <Link
            href={ARTICLE_HREF}
            className="text-zinc-800 hover:text-zinc-500 transition-colors underline underline-offset-4 decoration-zinc-300"
          >
            How to Build a Free HD Image Background Remover in 5 Minutes
          </Link>
          .
        </p>

        <section className="flex flex-col gap-3">
          <h2 className="uppercase text-xs font-light tracking-widest text-zinc-500">
            Recent
          </h2>
          {uploads.length === 0 ? (
            <p className="text-sm text-zinc-400">
              Nothing here yet — run an image through the tool above and it will
              show up here.
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
              {uploads.map((upload) => (
                <figure key={upload.id} className="flex flex-col gap-1.5">
                  <div
                    className="w-full aspect-square rounded-md border border-zinc-200 flex items-center justify-center overflow-hidden"
                    style={CHECKERBOARD}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={upload.result_url}
                      alt={`${upload.prompt} with the background removed`}
                      loading="lazy"
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                  <figcaption className="text-xs text-zinc-400 truncate">
                    {upload.prompt}
                  </figcaption>
                </figure>
              ))}
            </div>
          )}
        </section>
      </div>
    </PageShell>
  );
}
