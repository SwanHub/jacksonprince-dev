"use client";

import { useEffect, useState } from "react";

export default function Coin() {
  const [count, setCount] = useState(0);
  const [floats, setFloats] = useState<number[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("coins");
    if (saved) setCount(parseInt(saved, 10));
  }, []);

  const click = () => {
    const newCount = count + 1;
    setCount(newCount);
    localStorage.setItem("coins", String(newCount));

    const id = Date.now();
    setFloats((f) => [...f, id]);
    setTimeout(() => setFloats((f) => f.filter((x) => x !== id)), 600);
  };

  if (!mounted) return null;

  return (
    <div className="fixed top-4 right-4 flex flex-col items-center">
      <button
        onClick={click}
        className="cursor-pointer relative text-2xl text-amber-400 hover:text-amber-300 transition-colors select-none"
      >
        ●
        {floats.map((id) => (
          <span
            key={id}
            className="absolute left-1/2 -translate-x-1/2 text-xs text-amber-400 animate-float pointer-events-none"
          >
            +1
          </span>
        ))}
      </button>
      {floats.length > 0 && (
        <span className="text-xs text-zinc-500 mt-1">{count}</span>
      )}
    </div>
  );
}
