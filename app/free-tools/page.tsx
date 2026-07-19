import type { Metadata } from "next";
import Link from "next/link";
import { WandSparkles } from "lucide-react";
import PageHeader from "../components/PageHeader";
import PageShell from "../components/PageShell";

export const metadata: Metadata = {
  title: "Free Tools by Jackson Prince",
  description: "Free interactive tools by Jackson Prince.",
};

type Tool = {
  title: string;
  href: string;
  articleTitle: string;
  articleHref: string;
};

const tools: Tool[] = [
  {
    title: "HD image background remover",
    href: "/free-tools/image-background-remover",
    articleTitle:
      "How to Build a Free HD Image Background Remover in 5 Minutes",
    articleHref:
      "/writing/how-to-build-a-free-hd-image-background-remover-in-5-minutes",
  },
];

export default function ToolsPage() {
  return (
    <PageShell>
      <PageHeader
        breadcrumb="free-tools"
        title="Free Tools"
        subtitle="Tools pulled from articles."
      />

      <div className="w-full max-w-3xl flex flex-col gap-8 pt-4">
        <ul className="flex flex-col gap-2">
          {tools.map((tool) => (
            <li key={tool.href} className="flex flex-col gap-1">
              <Link
                href={tool.href}
                className="flex items-center gap-4 text-lg text-zinc-800 hover:text-zinc-500 transition-colors underline underline-offset-4 decoration-zinc-300"
              >
                <WandSparkles
                  className="w-4 h-4 shrink-0 text-sky-600
                  "
                  strokeWidth={1}
                />
                {tool.title}
              </Link>
              <p className="text-xs text-zinc-400 pl-8 pt-2 italic">
                From{" "}
                <Link
                  href={tool.articleHref}
                  className="underline underline-offset-2 hover:text-zinc-600 transition-colors"
                >
                  {tool.articleTitle}
                </Link>
              </p>
            </li>
          ))}
        </ul>
      </div>
    </PageShell>
  );
}
