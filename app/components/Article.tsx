import Image from "next/image";
import Link from "next/link";
import CopyButton from "./CopyButton";

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

export function Figure({
  src,
  alt,
  width,
  height,
  caption,
  priority,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
  priority?: boolean;
}) {
  return (
    <figure className="w-full flex flex-col gap-2">
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        sizes="(max-width: 640px) 100vw, 576px"
        className="w-full h-auto rounded-md border border-zinc-200"
      />
      {caption && (
        <figcaption className="text-sm text-zinc-500">{caption}</figcaption>
      )}
    </figure>
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
  return <hr className="w-full border-t border-dashed border-zinc-200 my-2" />;
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

export function CodeBlock({ code }: { code: string }) {
  return (
    <div className="relative w-full">
      <pre className="w-full overflow-x-auto rounded-md border border-dashed border-zinc-200 bg-zinc-50 p-4 pr-12 font-mono text-sm leading-relaxed">
        <code>{code}</code>
      </pre>
      <CopyButton text={code} />
    </div>
  );
}

export function Cmd({ children }: { children: string }) {
  return (
    <div className="relative w-full">
      <pre className="w-full overflow-x-auto rounded-md border border-dashed border-zinc-200 bg-zinc-50 px-4 py-3 pr-12 font-mono text-sm">
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
