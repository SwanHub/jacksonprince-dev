// Inscrutable — game logic, no UI.
// Faithful port of https://github.com/SwanHub/Inscrutable, with one fix:
// the jump-move modulo edge case from the Ruby version is corrected here,
// so all valid insertion positions are reachable uniformly.

export const SOLVED: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];
export const TOTAL_MOVES = 4;

export type Board = readonly number[];

export type Move =
  | { type: "reverse" }
  | { type: "shift"; amount: number }
  | { type: "swap"; a: number; b: number } // by VALUE, not index
  | { type: "jump"; startValue: number; count: 1 | 2 | 3; amount: number };

const mod = (n: number, m: number) => ((n % m) + m) % m;

export const isSolved = (b: Board): boolean =>
  b.length === 9 && b.every((v, i) => v === i + 1);

export const boardsEqual = (a: Board, b: Board): boolean =>
  a.length === b.length && a.every((v, i) => v === b[i]);

export const applyReverse = (b: Board): number[] => [...b].reverse();

// Positive amount = right shift.
export const applyShift = (b: Board, amount: number): number[] =>
  b.map((_, i) => b[mod(i - amount, b.length)]);

export const applySwap = (b: Board, a: number, c: number): number[] => {
  const ia = b.indexOf(a);
  const ic = b.indexOf(c);
  if (ia === -1 || ic === -1 || ia === ic) return [...b];
  const out = [...b];
  [out[ia], out[ic]] = [out[ic], out[ia]];
  return out;
};

// Lift `count` consecutive tiles starting at the tile whose value is
// `startValue`, then reinsert them shifted by `amount` positions (mod
// the number of valid insertion slots). amount=0 is a no-op.
export const applyJump = (
  b: Board,
  startValue: number,
  count: number,
  amount: number
): number[] => {
  const startIndex = b.indexOf(startValue);
  if (startIndex === -1) return [...b];
  const clampedCount = Math.max(
    1,
    Math.min(count, b.length - startIndex, 3)
  );
  const out = [...b];
  const slice = out.splice(startIndex, clampedCount);
  // Valid insertion positions: 0..out.length inclusive ⇒ out.length+1 slots.
  const slots = out.length + 1;
  const newIndex = mod(startIndex + amount, slots);
  out.splice(newIndex, 0, ...slice);
  return out;
};

export const applyMove = (b: Board, m: Move): number[] => {
  switch (m.type) {
    case "reverse":
      return applyReverse(b);
    case "shift":
      return applyShift(b, m.amount);
    case "swap":
      return applySwap(b, m.a, m.b);
    case "jump":
      return applyJump(b, m.startValue, m.count, m.amount);
  }
};

const randInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const randNonzero = (absMax: number) => {
  let n = 0;
  while (n === 0) n = randInt(-absMax, absMax);
  return n;
};

const randomMove = (board: Board): Move => {
  const types = ["reverse", "shift", "swap", "jump"] as const;
  const type = types[randInt(0, 3)];
  switch (type) {
    case "reverse":
      return { type };
    case "shift":
      return { type, amount: randNonzero(4) };
    case "swap": {
      const a = randInt(1, 9);
      let b = a;
      while (b === a) b = randInt(1, 9);
      return { type, a, b };
    }
    case "jump": {
      const startValue = randInt(1, 9);
      const startIndex = board.indexOf(startValue);
      const maxCount = Math.min(3, 9 - startIndex);
      const count = randInt(1, maxCount) as 1 | 2 | 3;
      return { type, startValue, count, amount: randNonzero(4) };
    }
  }
};

// Apply N random moves to the solved board, rejecting any transformation
// whose result is already in history or equal to the solved state.
export const scramble = (
  steps = TOTAL_MOVES
): { board: number[]; moves: Move[] } => {
  const seen = new Set<string>();
  let current: number[] = [...SOLVED];
  seen.add(current.join(","));
  const moves: Move[] = [];
  let attempts = 0;
  while (moves.length < steps && attempts < 500) {
    attempts++;
    const m = randomMove(current);
    const next = applyMove(current, m);
    const key = next.join(",");
    if (seen.has(key)) continue;
    if (isSolved(next)) continue;
    seen.add(key);
    current = next;
    moves.push(m);
  }
  if (isSolved(current) || moves.length < steps) return scramble(steps);
  return { board: current, moves };
};
