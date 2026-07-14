"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export function Figure({
  src,
  alt,
  width,
  height,
  caption,
  priority,
  expandable = true,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
  priority?: boolean;
  expandable?: boolean;
}) {
  const [open, setOpen] = useState(false);

  // ESC to close + body scroll lock while the lightbox is open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  return (
    <>
      <figure className="w-full flex flex-col gap-2">
        <div className="relative w-full">
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            priority={priority}
            sizes="(max-width: 640px) 100vw, 576px"
            className="w-full h-auto rounded-md border border-zinc-200"
          />
          {expandable && (
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-label="Expand image"
              className="absolute top-2 right-2 rounded-md p-1.5 bg-zinc-900/50 text-white hover:bg-zinc-900/70 transition-colors cursor-pointer"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="15 3 21 3 21 9" />
                <polyline points="9 21 3 21 3 15" />
                <line x1="21" y1="3" x2="14" y2="10" />
                <line x1="3" y1="21" x2="10" y2="14" />
              </svg>
            </button>
          )}
        </div>
        {caption && (
          <figcaption className="text-sm text-zinc-500">{caption}</figcaption>
        )}
      </figure>

      {expandable && open && (
        <div
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-zinc-900/80 flex items-center justify-center p-6 sm:p-12"
        >
          <button
            type="button"
            onClick={() => setOpen(false)}
            aria-label="Close"
            className="absolute top-4 right-4 sm:top-6 sm:right-6 text-zinc-300 hover:text-white text-4xl leading-none cursor-pointer"
          >
            ×
          </button>
          <figure
            onClick={(e) => e.stopPropagation()}
            className="max-w-full max-h-full flex flex-col items-center gap-3"
          >
            <Image
              src={src}
              alt={alt}
              width={width}
              height={height}
              sizes="100vw"
              className="w-auto h-auto max-w-full max-h-[85vh] object-contain rounded-md"
            />
            {caption && (
              <figcaption className="text-sm text-zinc-300 text-center">
                {caption}
              </figcaption>
            )}
          </figure>
        </div>
      )}
    </>
  );
}
