"use client";

import { useRef, useState } from "react";
import useSWR from "swr";
import CopyButton from "../../components/CopyButton";
import type { Asset } from "../../../lib/assets";

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Request failed (${res.status})`);
  return res.json();
};

export default function AssetLibraryClient() {
  const { data, error, isLoading, mutate } = useSWR<{ assets: Asset[] }>(
    "/api/media",
    fetcher,
  );
  const formRef = useRef<HTMLFormElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setUploading(true);
    setUploadError(null);
    try {
      const res = await fetch("/api/media", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(body?.error ?? `Upload failed (${res.status})`);
      }
      formRef.current?.reset();
      await mutate();
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
    }
  }

  const assets = data?.assets ?? [];

  return (
    <div className="w-full max-w-3xl flex flex-col gap-8 pt-4">
      <form
        ref={formRef}
        onSubmit={onSubmit}
        className="flex flex-wrap items-center gap-3"
      >
        <input
          type="file"
          name="files"
          accept="image/*"
          multiple
          required
          className="text-sm text-zinc-500 file:mr-3 file:rounded-md file:border file:border-dashed file:border-zinc-300 file:bg-zinc-50 file:px-3 file:py-1.5 file:text-sm file:text-zinc-700 hover:file:bg-zinc-100 file:transition-colors file:cursor-pointer"
        />
        <button
          type="submit"
          disabled={uploading}
          className="rounded-md border border-dashed border-zinc-300 bg-zinc-50 px-3 py-1.5 text-sm text-zinc-700 hover:bg-zinc-100 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-default"
        >
          {uploading ? "Uploading…" : "Upload"}
        </button>
        {uploadError && (
          <span className="text-sm text-red-500">{uploadError}</span>
        )}
      </form>

      {isLoading ? (
        <p className="text-sm text-zinc-500">Loading assets…</p>
      ) : error ? (
        <p className="text-sm text-red-500">Failed to load assets.</p>
      ) : assets.length === 0 ? (
        <p className="text-sm text-zinc-500">
          No assets yet. Upload an image to get started.
        </p>
      ) : (
        <ul className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {assets.map((asset) => (
            <li key={asset.name} className="flex flex-col gap-1.5">
              <div className="relative">
                {/* Plain <img> on purpose: previews skip the Vercel image optimizer. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={asset.url}
                  alt={asset.name}
                  loading="lazy"
                  className="aspect-square w-full object-cover rounded-md border border-dashed border-zinc-200 bg-zinc-50"
                />
                <CopyButton text={asset.url} />
              </div>
              <span className="truncate text-xs text-zinc-500">
                {asset.name}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
