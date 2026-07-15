"use client";

import { useEffect, useRef, useState } from "react";

// A real rle_mask, encoded with pycocotools. Decodes to a 16x16 heart.
const SIZE: [number, number] = [16, 16];
const COUNTS = "S13<2O1O10000O0O0001O1O2Nn0";

type Run = {
  index: number;
  chars: string; // characters of the counts string that encode this run
  value: number; // run length in pixels
  start: number; // first pixel (column-major index) this run covers
  inside: boolean; // paint run or skip run — runs alternate, skip first
};

// Same algorithm as app/lib/decodeRLEMask.ts, instrumented to remember
// which characters produced which run so all three rows can highlight it.
function decodeRuns(encoded: string): Run[] {
  const runs: Run[] = [];
  let p = 0;
  let pixel = 0;
  while (p < encoded.length) {
    const charStart = p;
    let x = 0;
    let k = 0;
    let more = true;
    while (more) {
      const c = encoded.charCodeAt(p++) - 48;
      x |= (c & 0x1f) << (5 * k);
      more = (c & 0x20) !== 0;
      k++;
      if (!more && c & 0x10) x |= -1 << (5 * k);
    }
    if (runs.length > 2) x += runs[runs.length - 2].value;
    runs.push({
      index: runs.length,
      chars: encoded.slice(charStart, p),
      value: x,
      start: pixel,
      inside: runs.length % 2 === 1,
    });
    pixel += x;
  }
  return runs;
}

const RUNS = decodeRuns(COUNTS);
const [HEIGHT, WIDTH] = SIZE;

// Which run covers each cell (pixels are counted down columns, left to right).
const CELL_RUN: number[][] = Array.from({ length: HEIGHT }, () =>
  Array(WIDTH).fill(0),
);
for (const run of RUNS) {
  for (let i = run.start; i < run.start + run.value; i++) {
    const row = i % HEIGHT;
    const col = (i - row) / HEIGHT;
    CELL_RUN[row][col] = run.index;
  }
}

export default function RleVisualizer() {
  const [step, setStep] = useState(0); // how many runs have been applied
  const [playing, setPlaying] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const autoplayed = useRef(false);

  // Autoplay once when the widget scrolls into view.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !autoplayed.current) {
          autoplayed.current = true;
          setPlaying(true);
        }
      },
      { threshold: 0.6 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!playing) return;
    if (step >= RUNS.length) {
      setPlaying(false);
      return;
    }
    const timer = setTimeout(() => setStep((s) => s + 1), 450);
    return () => clearTimeout(timer);
  }, [playing, step]);

  const current = step > 0 ? RUNS[step - 1] : null;

  return (
    <div
      ref={containerRef}
      className="w-full flex flex-col gap-4 rounded-md border border-dashed border-zinc-200 bg-zinc-50 p-4 font-mono text-sm"
    >
      {/* 1. The counts string, as returned in rle_mask */}
      <div className="flex flex-col gap-1">
        <span className="text-xs text-zinc-400">rle_mask</span>
        <code className="break-all leading-relaxed">
          {"{ size: [16, 16], counts: \""}
          {RUNS.map((run) => (
            <span
              key={run.index}
              className={
                run.index === step - 1
                  ? "rounded bg-amber-200 px-0.5 text-zinc-800"
                  : run.index < step
                    ? run.inside
                      ? "text-sky-600"
                      : "text-zinc-500"
                    : "text-zinc-300"
              }
            >
              {run.chars}
            </span>
          ))}
          {"\" }"}
        </code>
      </div>

      {/* 2. The decoded run lengths */}
      <div className="flex flex-col gap-1">
        <span className="text-xs text-zinc-400">
          decodeRLECounts(counts) — skip, paint, skip, paint…
        </span>
        <div className="flex flex-wrap gap-1">
          {RUNS.map((run) => (
            <button
              key={run.index}
              onClick={() => {
                setPlaying(false);
                setStep(run.index + 1);
              }}
              className={`rounded border px-1.5 py-0.5 tabular-nums transition-colors ${
                run.index === step - 1
                  ? "border-amber-400 bg-amber-200 text-zinc-800"
                  : run.index < step
                    ? run.inside
                      ? "border-sky-200 text-sky-600"
                      : "border-zinc-200 text-zinc-500"
                    : "border-zinc-200 text-zinc-300"
              }`}
            >
              {run.value}
            </button>
          ))}
        </div>
      </div>

      {/* 3. The mask */}
      <div className="flex flex-col gap-1">
        <span className="text-xs text-zinc-400">
          mask — pixels run down each column, left to right
        </span>
        <div
          className="grid w-full max-w-80 gap-px"
          style={{ gridTemplateColumns: `repeat(${WIDTH}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: HEIGHT * WIDTH }, (_, cell) => {
            const runIndex = CELL_RUN[Math.floor(cell / WIDTH)][cell % WIDTH];
            return (
              <div
                key={cell}
                className={`aspect-square rounded-[2px] ${
                  runIndex < step
                    ? RUNS[runIndex].inside
                      ? "bg-sky-600"
                      : "bg-white"
                    : "bg-zinc-200"
                } ${
                  runIndex === step - 1 ? "ring-2 ring-inset ring-amber-400" : ""
                }`}
              />
            );
          })}
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-2 border-t border-dashed border-zinc-200 pt-3">
        <button
          onClick={() => {
            if (step >= RUNS.length) setStep(0);
            setPlaying((p) => !p);
          }}
          className="w-16 rounded border border-zinc-300 px-2 py-1 text-zinc-700 transition-colors hover:bg-zinc-100"
        >
          {playing ? "pause" : "play"}
        </button>
        <button
          onClick={() => {
            setPlaying(false);
            setStep((s) => Math.max(0, s - 1));
          }}
          disabled={step === 0}
          className="rounded border border-zinc-300 px-2 py-1 text-zinc-700 transition-colors hover:bg-zinc-100 disabled:opacity-30"
        >
          ‹
        </button>
        <button
          onClick={() => {
            setPlaying(false);
            setStep((s) => Math.min(RUNS.length, s + 1));
          }}
          disabled={step === RUNS.length}
          className="rounded border border-zinc-300 px-2 py-1 text-zinc-700 transition-colors hover:bg-zinc-100 disabled:opacity-30"
        >
          ›
        </button>
        <span className="ml-auto text-xs tabular-nums text-zinc-500">
          {current
            ? `"${current.chars}" → ${current.inside ? "paint" : "skip"} ${current.value}`
            : `${RUNS.length} runs, ${HEIGHT * WIDTH} pixels`}
        </span>
      </div>
    </div>
  );
}
