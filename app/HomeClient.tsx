"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Doodle } from "@/lib/doodles";
import DoodleGallery from "./components/DoodleGallery";
import PageHeader from "./components/PageHeader";
import PageShell from "./components/PageShell";

export default function HomeClient({ doodles }: { doodles: Doodle[] }) {
  const rowRef = useRef<HTMLDivElement>(null);
  const spriteRef = useRef<HTMLImageElement>(null);
  const keysRef = useRef<Set<string>>(new Set());
  const [spriteX, setSpriteX] = useState(0);
  const [facing, setFacing] = useState<"left" | "right">("right");
  const [jumping, setJumping] = useState(false);
  const [showHints, setShowHints] = useState(true);

  const lightboxOpenRef = useRef(false);
  const onLightboxOpenChange = useCallback((open: boolean) => {
    lightboxOpenRef.current = open;
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target?.tagName === "INPUT" || target?.tagName === "TEXTAREA") return;
      // While the lightbox is open, arrow keys navigate it instead.
      if (lightboxOpenRef.current) {
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

  return (
    <PageShell>
      <PageHeader
        title="Jackson Prince"
        subtitle={
          <nav className="flex items-center gap-3 text-zinc-600">
            <Link
              href="/doodles"
              className="text-zinc-800 hover:text-zinc-500 transition-colors underline underline-offset-4 decoration-zinc-300"
            >
              Doodles
            </Link>
            <span aria-hidden className="text-zinc-400">
              {"&"}
            </span>
            <Link
              href="/guides"
              className="text-zinc-800 hover:text-zinc-500 transition-colors underline underline-offset-4 decoration-zinc-300"
            >
              Technical Guides
            </Link>
          </nav>
        }
      />

      <DoodleGallery doodles={doodles} onOpenChange={onLightboxOpenChange} />

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
    </PageShell>
  );
}
