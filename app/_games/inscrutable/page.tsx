"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  applyJump,
  applyMove,
  applyShift,
  isSolved,
  Move,
  scramble,
  SOLVED,
  TOTAL_MOVES,
} from "./logic";

type Phase =
  | { kind: "idle" }
  | { kind: "shift"; amount: number }
  | { kind: "swap"; first: number | null }
  | { kind: "jump-start" }
  | { kind: "jump-count"; startValue: number }
  | {
      kind: "jump-amount";
      startValue: number;
      count: 1 | 2 | 3;
      amount: number;
    };

type Outcome = "playing" | "won";

const PAR = 4;

const scoreLabel = (movesUsed: number) => {
  const d = movesUsed - PAR;
  if (d < 0) return `${d} UNDER PAR`;
  if (d === 0) return "AT PAR";
  return `+${d} OVER PAR`;
};

const stepNonzero = (cur: number, dir: 1 | -1, absMax: number) => {
  let next = cur + dir;
  if (next === 0) next += dir;
  if (next > absMax) next = -absMax;
  if (next < -absMax) next = absMax;
  return next;
};

const fmtTime = (ms: number) => {
  const totalSec = Math.floor(ms / 100) / 10;
  const m = Math.floor(totalSec / 60);
  const s = totalSec - m * 60;
  return `${String(m).padStart(2, "0")}:${s.toFixed(1).padStart(4, "0")}`;
};

const MOVE_ICONS: Record<Move["type"], string> = {
  reverse: "↺",
  shift: "⇉",
  swap: "⇄",
  jump: "↷",
};

export default function InscrutablePage() {
  const [board, setBoard] = useState<number[]>([...SOLVED]);
  const [movesUsed, setMovesUsed] = useState(0);
  const [phase, setPhase] = useState<Phase>({ kind: "idle" });
  const [outcome, setOutcome] = useState<Outcome>("playing");
  const [started, setStarted] = useState(false);
  const [elapsedMs, setElapsedMs] = useState(0);
  const startTimeRef = useRef<number | null>(null);

  const reset = () => {
    setStarted(false);
    setBoard([...SOLVED]);
    setMovesUsed(0);
    setPhase({ kind: "idle" });
    setOutcome("playing");
    setElapsedMs(0);
    startTimeRef.current = null;
  };

  const handleStart = () => {
    setBoard(scramble(TOTAL_MOVES).board);
    setMovesUsed(0);
    setPhase({ kind: "idle" });
    setOutcome("playing");
    setElapsedMs(0);
    startTimeRef.current = Date.now();
    setStarted(true);
  };

  // Tick the timer while playing.
  useEffect(() => {
    if (!started || outcome !== "playing") return;
    let raf = 0;
    const tick = () => {
      if (startTimeRef.current != null) {
        setElapsedMs(Date.now() - startTimeRef.current);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [started, outcome]);

  const commitMove = (m: Move) => {
    const next = applyMove(board, m);
    setBoard(next);
    setMovesUsed((n) => n + 1);
    setPhase({ kind: "idle" });
    if (isSolved(next)) setOutcome("won");
  };

  // Preview board reflects the currently in-progress move.
  const previewBoard = useMemo<number[]>(() => {
    if (phase.kind === "shift" && phase.amount !== 0)
      return applyShift(board, phase.amount);
    if (phase.kind === "jump-amount" && phase.amount !== 0)
      return applyJump(board, phase.startValue, phase.count, phase.amount);
    return board;
  }, [board, phase]);

  const isPreviewing = previewBoard !== board;

  // Which tile VALUES should be highlighted (selected / part of slice).
  const highlightedValues = useMemo<Set<number>>(() => {
    const s = new Set<number>();
    if (phase.kind === "swap" && phase.first != null) s.add(phase.first);
    if (phase.kind === "jump-count" || phase.kind === "jump-amount") {
      const startIndex = board.indexOf(phase.startValue);
      const count = phase.kind === "jump-amount" ? phase.count : 1;
      for (let i = 0; i < count; i++) {
        const v = board[startIndex + i];
        if (v !== undefined) s.add(v);
      }
    }
    return s;
  }, [board, phase]);

  const tilesClickable =
    outcome === "playing" &&
    (phase.kind === "swap" || phase.kind === "jump-start");

  const onTileClick = (value: number) => {
    if (!tilesClickable) return;
    if (phase.kind === "swap") {
      if (phase.first == null) {
        setPhase({ kind: "swap", first: value });
      } else if (phase.first === value) {
        setPhase({ kind: "swap", first: null });
      } else {
        commitMove({ type: "swap", a: phase.first, b: value });
      }
    } else if (phase.kind === "jump-start") {
      setPhase({ kind: "jump-count", startValue: value });
    }
  };

  const startMove = (type: Move["type"]) => {
    if (outcome !== "playing" || phase.kind !== "idle") return;
    if (type === "reverse") commitMove({ type: "reverse" });
    else if (type === "shift") setPhase({ kind: "shift", amount: 1 });
    else if (type === "swap") setPhase({ kind: "swap", first: null });
    else if (type === "jump") setPhase({ kind: "jump-start" });
  };

  const cancel = () => setPhase({ kind: "idle" });

  return (
    <main className="min-h-screen bg-black text-green-400 font-mono">
      <div className="max-w-3xl mx-auto px-6 sm:px-10 pt-6 sm:pt-10">
        <nav
          aria-label="Breadcrumb"
          className="text-xs tracking-widest flex gap-2 flex-wrap"
        >
          <Link href="/" className="text-green-400 hover:text-green-200">
            {"<< HOME"}
          </Link>
          <span className="text-green-700">/</span>
          <Link href="/games" className="text-green-400 hover:text-green-200">
            GAMES
          </Link>
          <span className="text-green-700">/</span>
          <span className="text-green-600">INSCRUTABLE</span>
        </nav>
      </div>

      {/* Full-width header band */}
      <header className="bg-green-400 text-black w-full mt-6">
        <div className="max-w-3xl mx-auto px-6 sm:px-10 py-10">
          <h1 className="text-4xl sm:text-6xl tracking-widest">INSCRUTABLE</h1>
          <p className="text-green-900 text-base sm:text-lg mt-3 tracking-widest">
            UNSCRAMBLE THE NUMBERS. MOVE THEM BACK TO 1 THROUGH 9.
          </p>
          <Hints />
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-6 sm:px-10 py-10">
        {/* Start / Timer */}
        <div className="mb-6">
          {!started ? (
            <button
              onClick={handleStart}
              className="border-2 border-green-400 px-8 py-3 tracking-[0.3em] text-base hover:bg-green-400 hover:text-black transition-colors shadow-[0_0_20px_rgba(74,222,128,0.4)] cursor-pointer"
            >
              BEGIN
            </button>
          ) : (
            <div className="border-2 border-green-400 px-8 py-3 tracking-[0.3em] text-base inline-block shadow-[0_0_20px_rgba(74,222,128,0.4)]">
              {fmtTime(elapsedMs)}
            </div>
          )}
        </div>

        {/* Status */}
        {started && (
          <div className="text-xs tracking-widest mb-3 flex justify-between items-center">
            <span>
              MOVES USED <span className="text-green-200">{movesUsed}</span>
            </span>
            <span className="text-green-700">PAR {PAR}</span>
          </div>
        )}

        {/* Tiles */}
        <div className="flex gap-1 sm:gap-2 mb-6">
          {previewBoard.map((value, i) => {
            const highlighted = highlightedValues.has(value);
            return (
              <button
                key={value}
                onClick={() => onTileClick(value)}
                disabled={!tilesClickable}
                aria-label={`tile ${value}`}
                className={[
                  "flex-1 aspect-square border-2 text-2xl sm:text-4xl flex items-center justify-center transition-all",
                  highlighted
                    ? "border-yellow-400 text-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.6)]"
                    : "border-green-400 text-green-400 shadow-[0_0_10px_rgba(74,222,128,0.25)]",
                  tilesClickable
                    ? "cursor-pointer hover:bg-green-400 hover:text-black"
                    : "cursor-default",
                  !started ? "opacity-25" : isPreviewing ? "opacity-80" : "",
                ].join(" ")}
              >
                {value}
              </button>
            );
          })}
        </div>

        {/* Index markers — helps reason about positions */}
        <div className="flex gap-1 sm:gap-2 mb-8 text-[10px] tracking-widest text-green-800">
          {previewBoard.map((_, i) => (
            <span key={i} className="flex-1 text-center">
              {i + 1}
            </span>
          ))}
        </div>

        {/* Move-type buttons */}
        {started && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-6">
            {(["reverse", "shift", "swap", "jump"] as const).map((t) => {
              const active = phase.kind.startsWith(t);
              const disabled =
                outcome !== "playing" || (phase.kind !== "idle" && !active);
              return (
                <button
                  key={t}
                  onClick={() => startMove(t)}
                  disabled={disabled}
                  className={[
                    "border-2 py-4 tracking-widest text-sm transition-colors flex flex-col items-center gap-1",
                    active
                      ? "border-yellow-400 text-yellow-400"
                      : "border-green-400",
                    disabled
                      ? "opacity-30 cursor-not-allowed"
                      : "hover:bg-green-400 hover:text-black cursor-pointer",
                  ].join(" ")}
                >
                  <span className="text-2xl sm:text-3xl leading-none">
                    {MOVE_ICONS[t]}
                  </span>
                  <span>{t.toUpperCase()}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Phase-specific controls */}
        {started && (
          <div className="min-h-[64px] text-xs tracking-widest">
            {phase.kind === "shift" && (
              <ShiftControls
                amount={phase.amount}
                onChange={(amount) => setPhase({ kind: "shift", amount })}
                onConfirm={() =>
                  commitMove({ type: "shift", amount: phase.amount })
                }
                onCancel={cancel}
              />
            )}

            {phase.kind === "swap" && (
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-green-300">
                  ▸ TAP TWO TILES TO SWAP
                  {phase.first != null && ` · FIRST: ${phase.first}`}
                </span>
                <button
                  onClick={cancel}
                  className="underline hover:text-green-100"
                >
                  CANCEL
                </button>
              </div>
            )}

            {phase.kind === "jump-start" && (
              <div className="flex items-center gap-3 flex-wrap">
                <span className="text-green-300">▸ TAP YOUR STARTING TILE</span>
                <button
                  onClick={cancel}
                  className="underline hover:text-green-100"
                >
                  CANCEL
                </button>
              </div>
            )}

            {phase.kind === "jump-count" && (
              <JumpCount
                startValue={phase.startValue}
                maxCount={
                  Math.min(3, 9 - board.indexOf(phase.startValue)) as 1 | 2 | 3
                }
                onSelect={(count) =>
                  setPhase({
                    kind: "jump-amount",
                    startValue: phase.startValue,
                    count,
                    amount: 1,
                  })
                }
                onBack={() => setPhase({ kind: "jump-start" })}
                onCancel={cancel}
              />
            )}

            {phase.kind === "jump-amount" && (
              <JumpAmount
                amount={phase.amount}
                onChange={(amount) => setPhase({ ...phase, amount })}
                onConfirm={() =>
                  commitMove({
                    type: "jump",
                    startValue: phase.startValue,
                    count: phase.count,
                    amount: phase.amount,
                  })
                }
                onBack={() =>
                  setPhase({
                    kind: "jump-count",
                    startValue: phase.startValue,
                  })
                }
                onCancel={cancel}
              />
            )}
          </div>
        )}
      </div>

      {outcome !== "playing" && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-10 p-6">
          <div className="border-2 border-green-400 p-8 sm:p-12 text-center shadow-[0_0_30px_rgba(74,222,128,0.4)] max-w-md w-full">
            <div className="text-3xl sm:text-4xl tracking-widest mb-2">
              ★ SOLVED ★
            </div>
            <div className="text-base sm:text-lg text-green-300 tracking-widest mb-6">
              {scoreLabel(movesUsed)}
            </div>
            <div className="text-xs text-green-600 mb-8 tracking-widest space-y-1">
              <div>
                MOVES: {movesUsed} · PAR {PAR}
              </div>
              <div>TIME: {fmtTime(elapsedMs)}</div>
            </div>
            <div className="flex gap-3 justify-center">
              <button
                onClick={handleStart}
                className="border-2 border-green-400 px-6 py-2 tracking-widest text-sm hover:bg-green-400 hover:text-black transition-colors cursor-pointer"
              >
                PLAY AGAIN
              </button>
              <button
                onClick={reset}
                className="border-2 border-green-700 text-green-700 px-6 py-2 tracking-widest text-sm hover:border-green-400 hover:text-green-400 transition-colors cursor-pointer"
              >
                BACK
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function ShiftControls({
  amount,
  onChange,
  onConfirm,
  onCancel,
}: {
  amount: number;
  onChange: (n: number) => void;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      <span className="text-green-300">▸ SHIFT BY</span>
      <button
        onClick={() => onChange(stepNonzero(amount, -1, 4))}
        className="border border-green-400 px-3 py-1 hover:bg-green-400 hover:text-black"
      >
        ◀
      </button>
      <span className="w-10 text-center text-base text-green-400">
        {amount > 0 ? `+${amount}` : amount}
      </span>
      <button
        onClick={() => onChange(stepNonzero(amount, 1, 4))}
        className="border border-green-400 px-3 py-1 hover:bg-green-400 hover:text-black"
      >
        ▶
      </button>
      <button
        onClick={onConfirm}
        className="border border-green-400 px-3 py-1 hover:bg-green-400 hover:text-black ml-2"
      >
        CONFIRM
      </button>
      <button
        onClick={onCancel}
        className="underline hover:text-green-100 ml-1"
      >
        CANCEL
      </button>
    </div>
  );
}

function JumpCount({
  startValue,
  maxCount,
  onSelect,
  onBack,
  onCancel,
}: {
  startValue: number;
  maxCount: 1 | 2 | 3;
  onSelect: (c: 1 | 2 | 3) => void;
  onBack: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      <span className="text-green-300">
        ▸ FROM {startValue}, HOW MANY TILES?
      </span>
      {([1, 2, 3] as const).map((c) => (
        <button
          key={c}
          onClick={() => onSelect(c)}
          disabled={c > maxCount}
          className="border border-green-400 px-3 py-1 hover:bg-green-400 hover:text-black disabled:opacity-30 disabled:cursor-not-allowed"
        >
          {c}
        </button>
      ))}
      <button onClick={onBack} className="underline hover:text-green-100 ml-2">
        BACK
      </button>
      <button onClick={onCancel} className="underline hover:text-green-100">
        CANCEL
      </button>
    </div>
  );
}

function JumpAmount({
  amount,
  onChange,
  onConfirm,
  onBack,
  onCancel,
}: {
  amount: number;
  onChange: (n: number) => void;
  onConfirm: () => void;
  onBack: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="flex items-center gap-3 flex-wrap">
      <span className="text-green-300">▸ MOVE BY</span>
      <button
        onClick={() => onChange(stepNonzero(amount, -1, 4))}
        className="border border-green-400 px-3 py-1 hover:bg-green-400 hover:text-black"
      >
        ◀
      </button>
      <span className="w-10 text-center text-base text-green-400">
        {amount > 0 ? `+${amount}` : amount}
      </span>
      <button
        onClick={() => onChange(stepNonzero(amount, 1, 4))}
        className="border border-green-400 px-3 py-1 hover:bg-green-400 hover:text-black"
      >
        ▶
      </button>
      <button
        onClick={onConfirm}
        className="border border-green-400 px-3 py-1 hover:bg-green-400 hover:text-black ml-2"
      >
        CONFIRM
      </button>
      <button onClick={onBack} className="underline hover:text-green-100 ml-1">
        BACK
      </button>
      <button onClick={onCancel} className="underline hover:text-green-100">
        CANCEL
      </button>
    </div>
  );
}

function Hints() {
  return (
    <details className="mt-6 text-xs tracking-widest text-green-200 border-2 border-green-900 bg-black p-4 cursor-pointer">
      <summary className="text-green-400 hover:text-green-200 cursor-pointer">
        HOW TO PLAY
      </summary>
      <div className="mt-3 leading-relaxed">
        <p className="pb-3">
          When you press "begin", the numbers will be scrambled. Your goal is to
          unscramble them back to the original ascending numerical order, one
          through nine. Do it in as few moves as possible. These are your
          available moves:
        </p>
        <ul className="space-y-1.5 list-disc list-inside marker:text-green-500">
          <li>
            <span className="text-green-400">↺ REVERSE</span> — reverse the
            order of the whole row.
          </li>
          <li>
            <span className="text-green-400">⇉ SHIFT</span> — move every tile
            left or right by up to 5 places.
          </li>
          <li>
            <span className="text-green-400">⇄ SWAP</span> — exchange any two
            tiles.
          </li>
          <li>
            <span className="text-green-400">↷ JUMP</span> — lift 1 to 3
            consecutive tiles and reinsert them in a different position in the
            same order.
          </li>
        </ul>
      </div>
    </details>
  );
}
