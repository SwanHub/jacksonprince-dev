"use client";

import { useEffect, useRef, useState } from "react";
import {
  extractSam3Predictions,
  removeBg,
  type Sam3Predictions,
} from "../../lib/removeBg";

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
  const [predictions, setPredictions] = useState<Sam3Predictions | null>(null);
  const [feathered, setFeathered] = useState(false);
  const [featheredUrl, setFeatheredUrl] = useState<string | null>(null);
  const [feathering, setFeathering] = useState(false);
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

  // Revoke the result object URLs when they're replaced or cleared.
  useEffect(() => {
    if (!resultUrl) return;
    return () => URL.revokeObjectURL(resultUrl);
  }, [resultUrl]);

  useEffect(() => {
    if (!featheredUrl) return;
    return () => URL.revokeObjectURL(featheredUrl);
  }, [featheredUrl]);

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

      const preds = extractSam3Predictions(json);
      if (!preds) throw new Error("Unexpected response from the model.");
      if (preds.predictions.length === 0) {
        throw new Error(`No “${s}” found in that image.`);
      }

      const cutout = await removeBg(f, preds);
      setPredictions(preds);
      setFeathered(false);
      setFeatheredUrl(null);
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

  // Re-composites locally from the stored predictions — no new inference.
  async function toggleFeather() {
    if (feathered) {
      setFeathered(false);
      return;
    }
    if (featheredUrl) {
      setFeathered(true);
      return;
    }
    if (!file || !predictions) return;
    setFeathering(true);
    try {
      const blob = await removeBg(file, predictions, { featherEdges: true });
      setFeatheredUrl(URL.createObjectURL(blob));
      setFeathered(true);
    } catch {
      // Keep the sharp-edged result if feathering fails.
    } finally {
      setFeathering(false);
    }
  }

  function reset() {
    setStage("idle");
    setFile(null);
    setPrompt("");
    setSubject("");
    setResultUrl(null);
    setPredictions(null);
    setFeathered(false);
    setFeatheredUrl(null);
    setError(null);
  }

  const canSubmit =
    stage === "pending" && file !== null && prompt.trim().length > 0;
  const displayedUrl = feathered && featheredUrl ? featheredUrl : resultUrl;

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
          className={
            stage === "pending"
              ? "w-full rounded-md border border-solid border-sky-300 overflow-hidden p-3 flex flex-col gap-2"
              : "w-full"
          }
        >
          <div
            role="button"
            tabIndex={0}
            aria-label={
              stage === "pending"
                ? "Change the selected image"
                : "Upload an image to remove its background"
            }
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
            className={`relative w-full aspect-video flex items-center justify-center cursor-pointer select-none overflow-hidden transition-all active:bg-sky-100 rounded-md ${
              stage === "idle" ? "border border-dashed hover:border-solid" : ""
            } ${
              dragging
                ? "border-solid border-sky-400 bg-sky-100 text-sky-700"
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
              <span className="relative flex flex-col items-center gap-2 text-xs">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                  <circle cx="9" cy="9" r="2" />
                  <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
                </svg>
                {dragging ? "drop it" : "drop or select an image"}
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

          {stage === "pending" && (
            <div className="flex items-center gap-2">
              <label
                htmlFor="bg-remover-prompt"
                className="text-zinc-400 shrink-0 text-xs"
              >
                describe foreground object(s):
              </label>
              <input
                id="bg-remover-prompt"
                ref={promptInputRef}
                type="text"
                value={prompt}
                placeholder="red horse, car..."
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && file && prompt.trim()) {
                    run(file, prompt.trim());
                  }
                }}
                className="grow min-w-0 h-8 rounded-md bg-zinc-100 px-2.5 text-zinc-800 placeholder:text-zinc-400 focus:outline-none focus:bg-zinc-200 transition-colors"
              />
              <button
                type="button"
                disabled={!canSubmit}
                onClick={() => {
                  if (file && prompt.trim()) run(file, prompt.trim());
                }}
                className="shrink-0 h-8 inline-flex items-center rounded-md px-3 text-xs transition-opacity bg-black text-white hover:opacity-80 active:opacity-70 cursor-pointer disabled:cursor-not-allowed disabled:hover:opacity-100 disabled:active:opacity-100"
              >
                submit
              </button>
            </div>
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

      {stage === "done" && displayedUrl && (
        <div
          className="relative w-full aspect-video rounded-md border border-dashed border-zinc-200 flex items-center justify-center overflow-hidden"
          style={CHECKERBOARD}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={displayedUrl}
            alt={`${subject} with the background removed`}
            className="max-w-full max-h-full object-contain"
          />
          <a
            href={displayedUrl}
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

      {stage === "done" && (
        <button
          type="button"
          onClick={toggleFeather}
          disabled={feathering}
          aria-pressed={feathered}
          className={`self-start rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-widest transition-colors cursor-pointer disabled:cursor-default disabled:opacity-60 ${
            feathered
              ? "border-sky-200 bg-sky-50 text-sky-600"
              : "border-zinc-200 bg-white text-zinc-400 hover:text-zinc-700 hover:border-zinc-300"
          }`}
        >
          {feathering ? "blurring…" : "blur edges"}
        </button>
      )}
    </div>
  );
}
