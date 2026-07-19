"use client";

import { useState } from "react";

export default function CopyPrompt({
  prompt,
  children,
}: {
  prompt: string;
  children: React.ReactNode;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <>
      <button
        type="button"
        onClick={copy}
        className="cursor-pointer text-zinc-800 hover:text-zinc-500 transition-colors underline underline-offset-4 decoration-zinc-300"
      >
        {children}
      </button>
      <span aria-live="polite" className="text-xs text-emerald-600">
        {copied && "Prompt copied. Give to your agent."}
      </span>
    </>
  );
}
