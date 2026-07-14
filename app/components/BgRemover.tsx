"use client";

import { useEffect, useRef, useState } from "react";
import { extractSam3Predictions, removeBg } from "../../lib/removeBg";

type Run = {
  id: string;
  prompt: string;
  status: "loading" | "done" | "error";
  originalUrl: string;
  resultUrl?: string;
  aspect?: number;
  error?: string;
  savedOriginalUrl?: string;
  savedResultUrl?: string;
};

type StoredRun = {
  id: string;
  prompt: string;
  originalUrl: string;
  resultUrl: string;
  aspect?: number;
};

const STORAGE_KEY = "jdp-bg-remover-runs";

function loadStoredRuns(): Run[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return (JSON.parse(raw) as StoredRun[]).map((r) => ({
      ...r,
      status: "done" as const,
      savedOriginalUrl: r.originalUrl,
      savedResultUrl: r.resultUrl,
    }));
  } catch {
    return [];
  }
}

function storeRuns(runs: Run[]) {
  const done: StoredRun[] = runs
    .filter(
      (r) => r.status === "done" && r.savedOriginalUrl && r.savedResultUrl,
    )
    .map((r) => ({
      id: r.id,
      prompt: r.prompt,
      originalUrl: r.savedOriginalUrl!,
      resultUrl: r.savedResultUrl!,
      aspect: r.aspect,
    }));
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(done));
  } catch {
    // localStorage full or unavailable — the widget still works in-memory
  }
}

function imageAspect(url: string): Promise<number | undefined> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img.naturalWidth / img.naturalHeight);
    img.onerror = () => resolve(undefined);
    img.src = url;
  });
}

const CHECKERBOARD = {
  backgroundImage:
    "linear-gradient(45deg, #f4f4f5 25%, transparent 25%), linear-gradient(-45deg, #f4f4f5 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f4f4f5 75%), linear-gradient(-45deg, transparent 75%, #f4f4f5 75%)",
  backgroundSize: "16px 16px",
  backgroundPosition: "0 0, 0 8px, 8px -8px, -8px 0",
};

export default function BgRemover() {
  const [runs, setRuns] = useState<Run[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [pendingUrl, setPendingUrl] = useState<string | null>(null);
  const [hint, setHint] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const promptInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const stored = loadStoredRuns();
    if (stored.length > 0) {
      setRuns(stored);
      setSelectedId(stored[0].id);
    }
  }, []);

  useEffect(() => storeRuns(runs), [runs]);

  useEffect(() => {
    if (pendingFile) promptInputRef.current?.focus();
  }, [pendingFile]);

  // Object URL for the pending file's thumbnail, revoked on change.
  useEffect(() => {
    if (!pendingFile) {
      setPendingUrl(null);
      return;
    }
    const url = URL.createObjectURL(pendingFile);
    setPendingUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [pendingFile]);

  function patchRun(id: string, patch: Partial<Run>) {
    setRuns((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }

  async function run(file: File, subject: string) {
    const id = crypto.randomUUID();
    const originalUrl = URL.createObjectURL(file);
    setRuns((prev) => [
      { id, prompt: subject, status: "loading", originalUrl },
      ...prev,
    ]);
    setSelectedId(id);
    setPendingFile(null);
    setHint(null);
    imageAspect(originalUrl).then((aspect) => patchRun(id, { aspect }));

    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("prompts", subject);
      const response = await fetch("/api/remove-bg", {
        method: "POST",
        body: formData,
      });
      const json = await response.json();
      if (!response.ok) {
        throw new Error(json?.error ?? "Inference failed.");
      }

      const predictions = extractSam3Predictions(json);
      if (!predictions) throw new Error("Unexpected response from the model.");
      if (predictions.predictions.length === 0) {
        throw new Error(`No “${subject}” found in that image.`);
      }

      const cutout = await removeBg(file, predictions);
      patchRun(id, { status: "done", resultUrl: URL.createObjectURL(cutout) });

      // Persist to Supabase in the background; localStorage picks up the
      // hosted URLs once the save lands.
      const saveData = new FormData();
      saveData.append("original", file);
      saveData.append(
        "result",
        new File([cutout], "cutout.png", { type: "image/png" }),
      );
      saveData.append("prompt", subject);
      const saveResponse = await fetch("/api/remove-bg/save", {
        method: "POST",
        body: saveData,
      });
      if (saveResponse.ok) {
        const saved = await saveResponse.json();
        patchRun(id, {
          savedOriginalUrl: saved.originalUrl,
          savedResultUrl: saved.resultUrl,
        });
      }
    } catch (err) {
      patchRun(id, {
        status: "error",
        error: err instanceof Error ? err.message : "Something went wrong.",
      });
    }
  }

  function handleFile(file: File | undefined | null) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setHint("That doesn’t look like an image.");
      return;
    }
    const subject = prompt.trim();
    if (!subject) {
      setPendingFile(file);
      return;
    }
    run(file, subject);
  }

  const attempted = pendingFile !== null || runs.length > 0;
  const busy = runs.some((r) => r.status === "loading");
  const selected = runs.find((r) => r.id === selectedId) ?? runs[0];
  const downloadHref = selected?.resultUrl?.startsWith("blob:")
    ? selected.resultUrl
    : selected?.savedResultUrl
      ? `${selected.savedResultUrl}?download=bg-removed.png`
      : undefined;

  return (
    <div className="w-full flex flex-col gap-3 font-mono text-sm">
      <span className="flex items-center self-start gap-1.5 rounded-full border border-sky-100 bg-white/70 px-2 py-0.5 text-[10px] uppercase tracking-widest text-zinc-500 backdrop-blur">
        <span className="relative flex h-1.5 w-1.5">
          <span
            className={`absolute inline-flex h-full w-full rounded-full opacity-60 ${
              busy ? "bg-amber-400" : "bg-emerald-400"
            }`}
          />
          <span
            className={`relative inline-flex h-1.5 w-1.5 rounded-full ${
              busy ? "bg-amber-500" : "bg-emerald-500"
            }`}
          />
        </span>
        {busy
          ? "working"
          : pendingFile
            ? "ready - input prompt"
            : "ready - select file"}
      </span>
      <div
        role="button"
        tabIndex={0}
        aria-label="Upload an image to remove its background"
        onClick={() => fileInputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            fileInputRef.current?.click();
          }
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          handleFile(e.dataTransfer.files?.[0]);
        }}
        className={`relative w-full rounded-md border border-dashed flex items-center justify-center cursor-pointer select-none overflow-hidden transition-all active:bg-sky-100 ${
          attempted && !pendingFile ? "py-10" : "aspect-video"
        } ${
          dragging
            ? "border-sky-400 bg-sky-100 text-sky-700"
            : "border-sky-200 bg-sky-50 text-sky-500 hover:border-sky-300 hover:bg-sky-100 hover:text-sky-600"
        }`}
      >
        <div
          aria-hidden
          className="absolute inset-0 animate-pulse bg-[radial-gradient(ellipse_at_center,rgba(56,189,248,0.14),transparent_65%)]"
        />
        {pendingUrl && (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={pendingUrl}
            alt={pendingFile?.name ?? "Selected image"}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        {!pendingFile && (
          <span className="relative">
            {dragging ? "drop it" : "drop an image here, or click to browse"}
          </span>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            handleFile(e.target.files?.[0]);
            e.target.value = "";
          }}
        />
      </div>

      {attempted && (
        <div className="flex items-baseline gap-2">
          <label htmlFor="bg-remover-prompt" className="text-zinc-400 shrink-0">
            describe the foreground:
          </label>
          <input
            id="bg-remover-prompt"
            ref={promptInputRef}
            type="text"
            value={prompt}
            placeholder="e.g. horse, car, person"
            onChange={(e) => {
              setPrompt(e.target.value);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && pendingFile && prompt.trim()) {
                run(pendingFile, prompt.trim());
              }
            }}
            className="grow min-w-0 bg-transparent border-b border-dashed border-sky-200 py-1 text-zinc-800 caret-sky-500 placeholder:text-zinc-300 focus:outline-none focus:border-sky-400 transition-colors"
          />
        </div>
      )}
      {hint && <p className="text-xs text-zinc-400">{hint}</p>}

      {runs.length > 0 && (
        <div className="flex items-stretch gap-3">
          <div className="flex flex-col gap-2 w-14 shrink-0 max-h-96 overflow-y-auto">
            {runs.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setSelectedId(r.id)}
                aria-label={`Show result for ${r.prompt}`}
                className={`relative w-14 h-14 shrink-0 rounded-md border overflow-hidden transition-all ${
                  r.id === selected?.id
                    ? "border-zinc-400 ring-1 ring-zinc-400"
                    : "border-zinc-200 opacity-70 hover:opacity-100"
                }`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={r.savedOriginalUrl ?? r.originalUrl}
                  alt={r.prompt}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>

          <div
            className="relative grow min-w-0 rounded-md border border-dashed border-zinc-200 flex items-center justify-center overflow-hidden min-h-40"
            style={selected?.status === "done" ? CHECKERBOARD : undefined}
          >
            {selected?.status === "loading" && (
              <div
                className="w-full max-h-96 animate-pulse rounded-md bg-zinc-100"
                style={{ aspectRatio: selected.aspect ?? 4 / 3 }}
              />
            )}
            {selected?.status === "error" && (
              <p className="p-6 text-xs text-zinc-500">{selected.error}</p>
            )}
            {selected?.status === "done" && (
              <>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selected.resultUrl ?? selected.savedResultUrl}
                  alt={`${selected.prompt} with the background removed`}
                  className="max-w-full max-h-96 h-auto"
                />
                {downloadHref && (
                  <a
                    href={downloadHref}
                    download="bg-removed.png"
                    aria-label="Download PNG"
                    className="absolute bottom-2 right-2 flex items-center gap-1.5 rounded-md bg-white/80 backdrop-blur px-2 py-1.5 text-xs text-zinc-400 hover:text-zinc-700 transition-colors"
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
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <path d="m7 10 5 5 5-5" />
                      <path d="M12 15V3" />
                    </svg>
                    png
                  </a>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
