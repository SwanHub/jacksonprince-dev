import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Guides — Jackson Prince",
  description: "Guides and articles by Jackson Prince.",
};

type Guide = {
  title: string;
  href: string;
};

// Guides grouped by month, newest first.
const guidesByMonth: { month: string; guides: Guide[] }[] = [
  {
    month: "July 2026",
    guides: [
      {
        title: "How to Build a Free Background Remover",
        href: "/guides/how-to-build-a-free-background-remover",
      },
    ],
  },
];

export default function GuidesPage() {
  return (
    <main className="min-h-screen w-full flex flex-col items-center px-6 pt-16 pb-28 gap-10">
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-2xl sm:text-3xl text-center leading-tight">
          Technical Guides
        </h1>
        <h2>Following my curiosity</h2>
      </div>

      <div className="w-full max-w-xl flex flex-col gap-8">
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
    </main>
  );
}
