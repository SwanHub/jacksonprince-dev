import Link from "next/link";
import SocialLinks from "./SocialLinks";

export default function Breadcrumbs({ current }: { current: string }) {
  return (
    <div className="w-full flex items-center justify-between text-sm">
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-2 text-zinc-500"
      >
        <Link
          href="/"
          className="text-zinc-800 hover:text-zinc-500 transition-colors underline underline-offset-4 decoration-zinc-300"
        >
          Home
        </Link>
        <span aria-hidden className="text-zinc-400">
          /
        </span>
        <span aria-current="page">{current}</span>
      </nav>

      <div className="flex items-center gap-3">
        <span className="text-zinc-800">Jackson Prince</span>
        <SocialLinks />
      </div>
    </div>
  );
}
