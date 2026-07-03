import Link from "next/link";

const games: {
  name: string;
  desc: string;
  glyph: string;
  href?: string;
}[] = [
  {
    name: "INSCRUTABLE",
    desc: "UNSCRAMBLE NUMBERS SUPER FAST",
    glyph: "▦",
    href: "/games/inscrutable",
  },
];

export default function Games() {
  return (
    <main className="min-h-screen bg-black text-green-400 font-mono">
      <div className="max-w-3xl mx-auto px-6 sm:px-10 pt-6 sm:pt-10">
        <nav
          aria-label="Breadcrumb"
          className="text-xs tracking-widest flex gap-2"
        >
          <Link href="/" className="text-green-400 hover:text-green-200">
            {"<< HOME"}
          </Link>
          <span className="text-green-700">/</span>
          <span className="text-green-600">GAMES</span>
        </nav>
      </div>

      {/* Full-width header band */}
      <header className="bg-green-400 text-black w-full mt-6">
        <div className="max-w-3xl mx-auto px-6 sm:px-10 py-10">
          <h1 className="text-4xl sm:text-6xl tracking-widest">GAMES</h1>
          <p className="text-green-900 text-base sm:text-lg mt-3 tracking-widest">
            ORIGINAL GAMES STRAIGHT OFF THE DOME
          </p>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 sm:px-10 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {games.map((g) => {
            const inner = (
              <>
                <div className="text-5xl mb-3">{g.glyph}</div>
                <div className="text-xl tracking-widest">{g.name}</div>
                <div className="text-[10px] mt-1 tracking-widest opacity-70">
                  {g.desc}
                </div>
              </>
            );
            const className =
              "block border-2 border-green-400 p-6 transition-colors shadow-[0_0_15px_rgba(74,222,128,0.2)] " +
              (g.href
                ? "hover:bg-green-400 hover:text-black cursor-pointer"
                : "opacity-60 cursor-not-allowed");
            return g.href ? (
              <Link key={g.name} href={g.href} className={className}>
                {inner}
              </Link>
            ) : (
              <div key={g.name} className={className}>
                {inner}
              </div>
            );
          })}
        </div>

        <footer className="mt-16 text-[10px] text-green-700 tracking-widest text-center">
          YES, IT IS MY ONLY GAME RIGHT NOW. GET NOTIFIED OVER EMAIL WHEN I
          CREATE ANOTHER.
        </footer>
      </div>
    </main>
  );
}
