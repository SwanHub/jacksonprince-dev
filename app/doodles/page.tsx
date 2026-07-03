"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

const doodles = [
  { src: "/doodle_1.JPG", date: "May 2026" },
  { src: "/doodle_2.JPG", date: "April 2026" },
  { src: "/doodle_3.JPG", date: "March 2026" },
];

export default function Doodles() {
  const [active, setActive] = useState<number | null>(null);

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

  const activeDoodle = active === null ? null : doodles[active];

  return (
    <main className="min-h-screen bg-amber-50 text-stone-900 p-6 sm:p-10">
      <div className="max-w-3xl mx-auto">
        <nav
          aria-label="Breadcrumb"
          className="text-sm font-(family-name:--font-instrument-sans) flex gap-2"
        >
          <Link
            href="/"
            className="text-stone-700 hover:text-stone-900 underline"
          >
            home
          </Link>
          <span className="text-stone-400">/</span>
          <span className="text-stone-500">doodles</span>
        </nav>

        <header className="mt-12 mb-16">
          <h1 className="text-6xl font-(family-name:--font-instrument-sans) text-stone-900">
            doodles
          </h1>
          <p className="text-stone-600 mt-3 font-(family-name:--font-instrument-sans) text-lg">
            I try to doodle for 15 to 30 minutes a day. Do you?
          </p>
        </header>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6 pb-20">
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
