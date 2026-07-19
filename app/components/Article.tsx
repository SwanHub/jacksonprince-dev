import Link from "next/link";
import CopyButton from "./CopyButton";

export { Figure } from "./Figure";

export default function Article({
  id,
  children,
}: {
  id?: string;
  children: React.ReactNode;
}) {
  return (
    <article
      id={id}
      className="w-full max-w-xl flex flex-col gap-6 pt-4 text-zinc-800 leading-relaxed scroll-mt-6"
    >
      {children}
    </article>
  );
}

export function H2({
  id,
  children,
}: {
  id?: string;
  children: React.ReactNode;
}) {
  return (
    <h2 id={id} className="pt-4 text-xl sm:text-2xl leading-tight scroll-mt-6">
      {children}
    </h2>
  );
}

export function H3({
  id,
  children,
}: {
  id?: string;
  children: React.ReactNode;
}) {
  return (
    <h3 id={id} className="pt-2 text-lg sm:text-xl leading-tight scroll-mt-6">
      {children}
    </h3>
  );
}

export function P({ children }: { children: React.ReactNode }) {
  return <p>{children}</p>;
}

export function Divider() {
  return <hr className="w-full border-t border-zinc-200 my-2" />;
}

const ornamentSerif =
  'Baskerville, "Baskerville Old Face", "Libre Baskerville", Georgia, serif';

export type DividerSerifVariant =
  | "asterism"
  | "dinkus"
  | "fleuron"
  | "hedera"
  | "diamond"
  | "dots"
  | "tag"
  | "braces"
  | "comment"
  | "arrow"
  | "tilde"
  | "rule";

export function DividerSerif({
  variant = "asterism",
  flanked = false,
}: {
  variant?: DividerSerifVariant;
  flanked?: boolean;
}) {
  if (variant === "rule") {
    return <hr className="w-16 mx-auto border-t border-zinc-200 my-2" />;
  }

  const ornaments: Record<
    Exclude<DividerSerifVariant, "rule">,
    { char: string; className: string; mono?: boolean }
  > = {
    asterism: { char: "⁂", className: "text-xl" },
    dinkus: {
      char: "*_*",
      className: "text-xl tracking-[0.4em] -mr-[0.4em] translate-y-[0.25em]",
    },
    fleuron: { char: "❦", className: "text-lg" },
    hedera: { char: "❧", className: "text-lg" },
    diamond: { char: "* *", className: "text-xl" },
    dots: {
      char: "*",
      className: "text-2xl tracking-[0.4em] text-blue-400 -mr-[0.4em]",
    },
    tag: { char: "</>", className: "font-mono text-sm", mono: true },
    braces: { char: "{}", className: "font-mono text-sm", mono: true },
    comment: {
      char: "/ /",
      className: "text-xs",
      // mono: true,
    },
    arrow: { char: "=>", className: "font-mono text-sm", mono: true },
    tilde: { char: "~", className: "font-mono text-base", mono: true },
  };
  const { char, className, mono } = ornaments[variant];

  return (
    <div
      role="separator"
      className="flex w-full items-center justify-center gap-3 my-2 select-none text-zinc-400"
    >
      {flanked && (
        <span
          aria-hidden
          className="flex-1 h-px bg-linear-to-r from-transparent to-zinc-200"
        />
      )}
      <span
        aria-hidden
        className={className}
        style={mono ? undefined : { fontFamily: ornamentSerif }}
      >
        {char}
      </span>
      {flanked && (
        <span
          aria-hidden
          className="flex-1 h-px bg-linear-to-l from-transparent to-zinc-200"
        />
      )}
    </div>
  );
}

export function UL({ children }: { children: React.ReactNode }) {
  return <ul className="list-disc pl-5 flex flex-col gap-2">{children}</ul>;
}

export function OL({ children }: { children: React.ReactNode }) {
  return <ol className="list-decimal pl-5 flex flex-col gap-2">{children}</ol>;
}

export function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="bg-zinc-100 rounded px-1.5 py-0.5 font-mono text-[0.9em]">
      {children}
    </code>
  );
}

export function CodeBlock({ code, file }: { code: string; file?: string }) {
  return (
    <div className="relative w-full">
      <div className="w-full overflow-hidden rounded-md border border-zinc-100 bg-zinc-50">
        {file && (
          <div className="border-b border-zinc-100 px-4 py-2 font-mono text-xs text-zinc-500">
            {file}
          </div>
        )}
        <pre className="w-full overflow-x-auto p-4 pr-12 font-mono text-sm leading-relaxed text-sky-800">
          <code>{code}</code>
        </pre>
      </div>
      <CopyButton
        text={code}
        className={file ? "top-1 right-2" : "top-2 right-2"}
      />
    </div>
  );
}

export function Cmd({ children }: { children: string }) {
  return (
    <div className="relative w-full">
      <pre className="w-full overflow-x-auto rounded-md border border-zinc-100 bg-zinc-50 px-4 py-3 pr-12 font-mono text-sm text-sky-800">
        <code>
          <span aria-hidden className="text-zinc-400 select-none">
            ~{" "}
          </span>
          {children}
        </code>
      </pre>
      <CopyButton text={children} />
    </div>
  );
}

export function TableOfContents({
  items,
}: {
  items: { id: string; label: string }[];
}) {
  return (
    <aside className="hidden md:flex w-48 shrink-0 flex-col gap-3 pt-4 sticky top-12 self-start font-mono">
      {/* <span className="uppercase text-xs font-light tracking-widest text-zinc-500">
        Contents
      </span> */}
      <nav
        aria-label="Table of contents"
        className="flex flex-col gap-2 text-sm"
      >
        {items.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className="text-zinc-500 hover:text-zinc-800 transition-colors"
          >
            {item.label}
          </a>
        ))}
      </nav>
    </aside>
  );
}

export function A({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const isExternal = href.startsWith("http");
  const className =
    "text-zinc-800 hover:text-zinc-500 transition-colors underline underline-offset-4 decoration-zinc-300";

  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}
