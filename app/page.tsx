"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const doodles = [
  { src: "/doodle_1.JPG", date: "May 2026" },
  { src: "/doodle_2.JPG", date: "April 2026" },
  { src: "/doodle_3.JPG", date: "March 2026" },
];

export default function Home() {
  const rowRef = useRef<HTMLDivElement>(null);
  const spriteRef = useRef<HTMLImageElement>(null);
  const keysRef = useRef<Set<string>>(new Set());
  const [spriteX, setSpriteX] = useState(0);
  const [facing, setFacing] = useState<"left" | "right">("right");
  const [jumping, setJumping] = useState(false);
  const [showHints, setShowHints] = useState(true);

  const [active, setActive] = useState<number | null>(null);
  const activeRef = useRef<number | null>(null);
  activeRef.current = active;

  const close = useCallback(() => setActive(null), []);
  const prev = useCallback(
    () =>
      setActive((a) =>
        a == null ? null : (a - 1 + doodles.length) % doodles.length,
      ),
    [],
  );
  const next = useCallback(
    () => setActive((a) => (a == null ? null : (a + 1) % doodles.length)),
    [],
  );

  // ESC + arrow-key handling, plus body scroll lock while overlay is open.
  useEffect(() => {
    if (active === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [active, close, prev, next]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target?.tagName === "INPUT" || target?.tagName === "TEXTAREA") return;
      // While the lightbox is open, arrow keys navigate it instead.
      if (activeRef.current !== null) {
        keysRef.current.clear();
        return;
      }

      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        e.preventDefault();
        setShowHints(false);
        keysRef.current.add(e.key);
      } else if (e.key === " " || e.code === "Space") {
        e.preventDefault();
        setJumping((j) => {
          if (j) return j;
          setTimeout(() => setJumping(false), 500);
          return true;
        });
      }
    };
    const onKeyUp = (e: KeyboardEvent) => {
      keysRef.current.delete(e.key);
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  useEffect(() => {
    let raf = 0;
    const speed = 4;
    const tick = () => {
      const row = rowRef.current;
      const sprite = spriteRef.current;
      if (row && sprite) {
        const max = row.offsetWidth - sprite.offsetWidth;
        let dx = 0;
        if (keysRef.current.has("ArrowLeft")) {
          dx -= speed;
          setFacing("left");
        }
        if (keysRef.current.has("ArrowRight")) {
          dx += speed;
          setFacing("right");
        }
        if (dx !== 0) {
          setSpriteX((prev) => Math.max(0, Math.min(max, prev + dx)));
        }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const activeDoodle = active === null ? null : doodles[active];

  return (
    <main className="min-h-screen w-full flex flex-col items-center px-6 pt-16 pb-28 gap-10">
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-2xl sm:text-3xl text-center font-(family-name:--font-baskerville) leading-tight">
          Jackson Prince&apos;s Website
        </h1>
        <p className="text-lg text-zinc-600 italic font-(family-name:--font-baskerville) text-center">
          Art and Engineering
        </p>
        <div className="flex items-center gap-4">
          <a
            href="https://github.com/SwanHub"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="text-zinc-600 hover:text-zinc-900 transition-colors"
          >
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-6 w-6"
              aria-hidden
            >
              <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.55 0-.27-.01-1.17-.02-2.12-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.03 1.76 2.69 1.25 3.35.96.1-.75.4-1.25.72-1.54-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.17 1.18a11.04 11.04 0 0 1 5.78 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.41-2.69 5.38-5.25 5.67.41.35.77 1.05.77 2.12 0 1.53-.01 2.76-.01 3.14 0 .31.21.67.8.55A11.51 11.51 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
            </svg>
          </a>
          <a
            href="https://www.linkedin.com/in/jackson-prince"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="text-zinc-600 hover:text-zinc-900 transition-colors"
          >
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-6 w-6"
              aria-hidden
            >
              <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.72v20.55C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.72C24 .77 23.2 0 22.22 0Z" />
            </svg>
          </a>
        </div>
      </div>

      <div className="w-full max-w-3xl grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
        {doodles.map((d, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            aria-label={`open doodle from ${d.date}`}
            className="bg-white p-2 pb-3 shadow-md hover:shadow-lg transition-shadow cursor-pointer block text-left"
          >
            <img
              src={d.src}
              alt=""
              className="w-full block aspect-square object-cover"
            />
            <div className="text-stone-500 text-xs mt-2 text-center font-(family-name:--font-instrument-sans)">
              {d.date}
            </div>
          </button>
        ))}
      </div>

      <div
        ref={rowRef}
        className="fixed bottom-0 left-0 right-0 pointer-events-none"
      >
        <div className="sm:hidden">
          <img
            src="/icon.png"
            alt=""
            aria-hidden
            className="h-16 w-auto block"
          />
        </div>
        <div
          className="hidden sm:block relative"
          style={{ left: `${spriteX}px`, width: "fit-content" }}
        >
          {showHints && (
            <button
              onClick={() => setShowHints(false)}
              aria-label="move right with the arrow keys"
              className="pointer-events-auto absolute left-full top-1/2 -translate-y-1/2 ml-4 p-2 border border-black text-black cursor-pointer"
            >
              <svg
                width="18"
                height="4"
                viewBox="0 0 32 12"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                aria-hidden
              >
                <path d="M1 6h29M24.5 1 30 6l-5.5 5" />
              </svg>
            </button>
          )}
          <div className={jumping ? "animate-sprite-jump" : ""}>
            <img
              ref={spriteRef}
              src="/icon.png"
              alt=""
              aria-hidden
              className="h-16 w-auto block"
              style={{
                transform: facing === "left" ? "scaleX(-1)" : undefined,
              }}
            />
          </div>
        </div>
      </div>

      {activeDoodle && (
        <div
          className="fixed inset-0 bg-stone-900/90 z-50 flex items-center justify-center p-6 sm:p-12"
          onClick={close}
          role="dialog"
          aria-modal="true"
        >
          {/* Close */}
          <button
            onClick={close}
            aria-label="close"
            className="absolute top-4 right-4 sm:top-6 sm:right-6 text-amber-50 text-4xl leading-none hover:text-white cursor-pointer"
          >
            ×
          </button>

          {/* Prev / Next */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            aria-label="previous"
            className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 text-amber-50 text-5xl leading-none hover:text-white cursor-pointer px-2"
          >
            ‹
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            aria-label="next"
            className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 text-amber-50 text-5xl leading-none hover:text-white cursor-pointer px-2"
          >
            ›
          </button>

          <figure
            onClick={(e) => e.stopPropagation()}
            className="bg-white p-3 sm:p-4 shadow-2xl flex flex-col items-center max-w-full max-h-full"
          >
            <img
              src={activeDoodle.src}
              alt=""
              className="block max-w-full max-h-[78vh] object-contain"
            />
            <figcaption className="text-stone-600 text-sm mt-3 text-center font-(family-name:--font-instrument-sans)">
              {activeDoodle.date}
            </figcaption>
          </figure>
        </div>
      )}
    </main>
  );
}
