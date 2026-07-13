import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "../components/PageHeader";
import PageShell from "../components/PageShell";

export const metadata: Metadata = {
  title: "Writing by Jackson Prince",
  description: "Writing by Jackson Prince.",
};

type Post = {
  title: string;
  href: string;
};

const postsByMonth: { month: string; posts: Post[] }[] = [
  {
    month: "July 2026",
    posts: [
      {
        title: "How to Build a Free HD Image Background Remover in 5 Minutes",
        href: "/writing/how-to-build-a-free-hd-image-background-remover-in-5-minutes",
      },
    ],
  },
];

export default function WritingPage() {
  return (
    <PageShell>
      <PageHeader
        breadcrumb="writing"
        title="Writing"
        subtitle="my writing, order by timestamp desc"
      />

      <div className="w-full max-w-3xl flex flex-col gap-8 pt-4">
        {postsByMonth.map(({ month, posts }) => (
          <section key={month} className="flex flex-col gap-3">
            <h2 className="uppercase text-xs font-light tracking-widest text-zinc-500">
              {month}
            </h2>
            <ul className="flex flex-col gap-2">
              {posts.map((post) => (
                <li key={post.href}>
                  <Link
                    href={post.href}
                    className="text-lg text-zinc-800 hover:text-zinc-500 transition-colors underline underline-offset-4 decoration-zinc-300"
                  >
                    {post.title}
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
