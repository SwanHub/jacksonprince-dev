import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "../components/PageHeader";
import PageShell from "../components/PageShell";

export const metadata: Metadata = {
  title: "Technical Guides by Jackson Prince",
  description: "Technical Guides by Jackson Prince.",
};

type Guide = {
  title: string;
  href: string;
};

const guidesByMonth: { month: string; guides: Guide[] }[] = [
  {
    month: "July 2026",
    guides: [
      {
        title: "How to Build a Free HD Image Background Remover Using SAM3",
        href: "/guides/how-to-build-a-free-hd-image-background-remover-using-sam3",
      },
    ],
  },
];

export default function GuidesPage() {
  return (
    <PageShell>
      <PageHeader
        breadcrumb="guides"
        title="Technical Guides"
        subtitle="Here lies a list of learnings, signed from me to you."
      />

      <div className="w-full max-w-3xl flex flex-col gap-8 pt-4">
        {guidesByMonth.map(({ month, guides }) => (
          <section key={month} className="flex flex-col gap-3">
            <h2 className="uppercase text-xs font-light tracking-widest text-zinc-500">
              {month}
            </h2>
            <ul className="flex flex-col gap-2">
              {guides.map((guide) => (
                <li key={guide.href}>
                  <Link
                    href={guide.href}
                    className="text-lg text-zinc-800 hover:text-zinc-500 transition-colors underline underline-offset-4 decoration-zinc-300"
                  >
                    {guide.title}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </PageShell>
  );
}
