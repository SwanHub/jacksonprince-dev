import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "../components/PageHeader";
import PageShell from "../components/PageShell";

export const metadata: Metadata = {
  title: "Tools by Jackson Prince",
  description: "Interactive tools by Jackson Prince.",
};

type Tool = {
  title: string;
  href: string;
};

const tools: Tool[] = [
  {
    title: "HD image background remover",
    href: "/tools/image-background-remover",
  },
];

export default function ToolsPage() {
  return (
    <PageShell>
      <PageHeader
        breadcrumb="tools"
        title="Tools"
        subtitle="Interactive widgets from my longer articles, usable in isolation."
      />

      <div className="w-full max-w-3xl flex flex-col gap-8 pt-4">
        <ul className="flex flex-col gap-2">
          {tools.map((tool) => (
            <li key={tool.href}>
              <Link
                href={tool.href}
                className="text-lg text-zinc-800 hover:text-zinc-500 transition-colors underline underline-offset-4 decoration-zinc-300"
              >
                {tool.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </PageShell>
  );
}
