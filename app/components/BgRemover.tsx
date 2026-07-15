"use client";

import { useEffect, useRef, useState } from "react";
import { extractSam3Predictions, removeBg } from "../../lib/removeBg";

const CHECKERBOARD = {
  backgroundImage:
    "linear-gradient(45deg, #f4f4f5 25%, transparent 25%), linear-gradient(-45deg, #f4f4f5 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f4f4f5 75%), linear-gradient(-45deg, transparent 75%, #f4f4f5 75%)",
  backgroundSize: "16px 16px",
  backgroundPosition: "0 0, 0 8px, 8px -8px, -8px 0",
};

type Stage = "idle" | "pending" | "loading" | "done" | "error";

export default function BgRemover() {
  const [stage, setStage] = useState<Stage>("idle");
  const [file, setFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [prompt, setPrompt] = useState("");
  const [subject, setSubject] = useState("");
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const promptInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (stage === "pending") promptInputRef.current?.focus();
  }, [stage]);

  // Object URL for the selected file's thumbnail, revoked on change.
  useEffect(() => {
    if (!file) {
      setFileUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setFileUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  // Revoke the result object URL when it's replaced or cleared.
  useEffect(() => {
    if (!resultUrl) return;
    return () => URL.revokeObjectURL(resultUrl);
  }, [resultUrl]);

  async function run(f: File, s: string) {
    setStage("loading");
    setSubject(s);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("image", f);
      formData.append("prompts", s);
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
        throw new Error(`No “${s}” found in that image.`);
      }

      const cutout = await removeBg(f, predictions);
      setResultUrl(URL.createObjectURL(cutout));
      setStage("done");

      // Persist to the UGC gallery in the background; fire-and-forget.
      const saveData = new FormData();
      saveData.append("original", f);
      saveData.append(
        "result",
        new File([cutout], "cutout.png", { type: "image/png" }),
      );
      saveData.append("prompt", s);
      void fetch("/api/remove-bg/save", { method: "POST", body: saveData });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setStage("error");
    }
  }

  function handleFile(f: File | undefined | null) {
    if (!f || !f.type.startsWith("image/")) return;
    setFile(f);
    const s = prompt.trim();
    if (s) {
      run(f, s);
    } else {
      setStage("pending");
    }
  }

  function reset() {
    setStage("idle");
    setFile(null);
    setPrompt("");
    setSubject("");
    setResultUrl(null);
    setError(null);
  }

  const canSubmit =
    stage === "pending" && file !== null && prompt.trim().length > 0;

  return (
    <div className="w-full flex flex-col gap-3 font-mono text-sm">
      <div className="flex items-center gap-2 self-start">
        <span className="flex items-center gap-1.5 rounded-full border border-sky-100 bg-white/70 px-2 py-0.5 text-[10px] uppercase tracking-widest text-zinc-500 backdrop-blur">
          <span className="relative flex h-1.5 w-1.5">
            {stage === "loading" ? (
              <span className="inline-flex h-1.5 w-1.5 animate-spin rounded-full border border-amber-500 border-t-transparent" />
            ) : (
              <>
                <span
                  className={`absolute inline-flex h-full w-full rounded-full opacity-60 ${
                    stage === "error" ? "bg-red-400" : "bg-emerald-400"
                  }`}
                />
                <span
                  className={`relative inline-flex h-1.5 w-1.5 rounded-full ${
                    stage === "error" ? "bg-red-500" : "bg-emerald-500"
                  }`}
                />
              </>
            )}
          </span>
          {stage === "loading"
            ? `isolating ${subject}`
            : stage === "done"
              ? "complete"
              : stage === "error"
                ? "error"
                : stage === "pending"
                  ? "almost there - add a prompt"
                  : "ready - select file"}
        </span>
        {(stage === "done" || stage === "error") && (
          <button
            type="button"
            onClick={reset}
            className="rounded-full border border-zinc-200 bg-white px-2 py-0.5 text-[10px] uppercase tracking-widest text-zinc-400 hover:text-zinc-700 hover:border-zinc-300 transition-colors cursor-pointer"
          >
            retry
          </button>
        )}
      </div>

      {(stage === "idle" || stage === "pending") && (
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
          className={`relative w-full aspect-video rounded-md border border-dashed flex items-center justify-center cursor-pointer select-none overflow-hidden transition-all active:bg-sky-100 ${
            dragging
              ? "border-sky-400 bg-sky-100 text-sky-700"
              : "border-sky-200 bg-sky-50 text-sky-500 hover:border-sky-300 hover:bg-sky-100 hover:text-sky-600"
          }`}
        >
          <div
            aria-hidden
            className="absolute inset-0 animate-pulse bg-[radial-gradient(ellipse_at_center,rgba(56,189,248,0.14),transparent_65%)]"
          />
          {fileUrl && (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img
              src={fileUrl}
              alt={file?.name ?? "Selected image"}
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
          {!fileUrl && (
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
      )}

      {stage === "pending" && (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <label
              htmlFor="bg-remover-prompt"
              className="text-zinc-400 shrink-0"
            >
              describe the foreground:
            </label>
            <input
              id="bg-remover-prompt"
              ref={promptInputRef}
              type="text"
              value={prompt}
              placeholder="e.g. horse, car, person"
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && file && prompt.trim()) {
                  run(file, prompt.trim());
                }
              }}
              className="grow min-w-0 bg-transparent border-b border-dashed border-sky-200 py-1 text-zinc-800 caret-sky-500 placeholder:text-zinc-300 focus:outline-none focus:border-sky-400 transition-colors"
            />
            <button
              type="button"
              disabled={!canSubmit}
              onClick={() => {
                if (file && prompt.trim()) run(file, prompt.trim());
              }}
              className="shrink-0 rounded-md px-3 py-1.5 text-xs transition-colors bg-sky-500 text-white hover:bg-sky-600 active:bg-sky-700 cursor-pointer disabled:bg-sky-100 disabled:text-sky-300 disabled:cursor-default"
            >
              submit
            </button>
          </div>
          {canSubmit && (
            <p className="text-[11px] text-zinc-300 text-right select-none">
              Press Enter to run background remover
            </p>
          )}
        </div>
      )}

      {stage === "loading" && (
        <div className="w-full aspect-video animate-pulse rounded-md bg-zinc-100" />
      )}

      {stage === "error" && (
        <div className="w-full aspect-video rounded-md border border-dashed border-zinc-200 flex items-center justify-center">
          <p className="p-6 text-xs text-zinc-500">{error}</p>
        </div>
      )}

      {stage === "done" && resultUrl && (
        <div
          className="relative w-full aspect-video rounded-md border border-dashed border-zinc-200 flex items-center justify-center overflow-hidden"
          style={CHECKERBOARD}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={resultUrl}
            alt={`${subject} with the background removed`}
            className="max-w-full max-h-full object-contain"
          />
          <a
            href={resultUrl}
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
        </div>
      )}
    </div>
  );
}
