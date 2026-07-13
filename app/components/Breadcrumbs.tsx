import Link from "next/link";
import SocialLinks from "./SocialLinks";

export default function Breadcrumbs({
  current,
  trail = [],
}: {
  current?: string;
  trail?: { label: string; href: string }[];
}) {
  return (
    <div className="w-full flex items-center justify-between text-sm">
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-2 text-zinc-500 min-w-0"
      >
        {current && (
          <>
            <Link
              href="/"
              className="shrink-0 text-zinc-800 hover:text-zinc-500 transition-colors underline underline-offset-4 decoration-zinc-300"
            >
              Jackson Prince
            </Link>
            {trail.map((item) => (
              <span key={item.href} className="flex items-center gap-2 shrink-0">
                <span aria-hidden className="text-zinc-400">
                  /
                </span>
                <Link
                  href={item.href}
                  className="text-zinc-800 hover:text-zinc-500 transition-colors underline underline-offset-4 decoration-zinc-300"
                >
                  {item.label}
                </Link>
              </span>
            ))}
            <span aria-hidden className="text-zinc-400">
              /
            </span>
            <span aria-current="page" className="whitespace-nowrap">
              {current.length > 20 ? `${current.slice(0, 20).trimEnd()}...` : current}
            </span>
          </>
        )}
      </nav>

      <div className="flex items-center gap-4">
        <Link
          href="/about"
          className="text-sm text-zinc-800 hover:text-zinc-500 transition-colors underline underline-offset-4 decoration-zinc-300"
        >
          about
        </Link>
        <SocialLinks />
      </div>
    </div>
  );
}
