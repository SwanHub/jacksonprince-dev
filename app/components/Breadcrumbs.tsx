import Link from "next/link";
import SocialLinks from "./SocialLinks";

export default function Breadcrumbs({ current }: { current?: string }) {
  return (
    <div className="w-full flex items-center justify-between text-sm">
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-2 text-zinc-500"
      >
        {current && (
          <>
            <Link
              href="/"
              className="text-zinc-800 hover:text-zinc-500 transition-colors underline underline-offset-4 decoration-zinc-300"
            >
              Jackson Prince
            </Link>
            <span aria-hidden className="text-zinc-400">
              /
            </span>
            <span aria-current="page">{current}</span>
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
