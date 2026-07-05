"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import type { Doodle } from "@/lib/doodles";

export default function DoodleGallery({
  doodles,
  onOpenChange,
}: {
  doodles: Doodle[];
  onOpenChange?: (open: boolean) => void;
}) {
  const [active, setActive] = useState<number | null>(null);

  const close = useCallback(() => setActive(null), []);
  const prev = useCallback(
    () =>
      setActive((a) =>
        a == null ? null : (a - 1 + doodles.length) % doodles.length,
      ),
    [doodles.length],
  );
  const next = useCallback(
    () => setActive((a) => (a == null ? null : (a + 1) % doodles.length)),
    [doodles.length],
  );

  useEffect(() => {
    onOpenChange?.(active !== null);
  }, [active, onOpenChange]);

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
    <>
      <div className="w-full max-w-3xl grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
        {doodles.map((d, i) => (
          <button
            key={d.thumb}
            onClick={() => setActive(i)}
            aria-label={`open doodle from ${d.date}`}
            className="bg-white p-2 pb-3 shadow-md hover:shadow-lg transition-shadow cursor-pointer block text-left"
          >
            <div className="relative w-full aspect-square">
              <Image
                src={d.thumb}
                alt=""
                fill
                sizes="(min-width: 640px) 33vw, 50vw"
                className="object-cover"
              />
            </div>
          </button>
        ))}
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
            <Image
              src={activeDoodle.full}
              alt=""
              width={1600}
              height={1600}
              sizes="90vw"
              className="block w-auto h-auto max-w-full max-h-[78vh] object-contain"
            />
            <figcaption className="text-stone-600 text-sm mt-3 text-center font-(family-name:--font-instrument-sans)">
              {activeDoodle.date}
            </figcaption>
          </figure>
        </div>
      )}
    </>
  );
}
