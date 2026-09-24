"use client";

import { useRef, useState } from "react";

async function uploadToCloudinary(file: File): Promise<string> {
  const sigRes = await fetch("/api/admin/upload-signature", { method: "POST" });
  if (!sigRes.ok) {
    const d = await sigRes.json().catch(() => ({}));
    throw new Error(d.error || "Could not get an upload signature.");
  }
  const sig = await sigRes.json();
  const fd = new FormData();
  fd.append("file", file);
  fd.append("api_key", sig.apiKey);
  fd.append("timestamp", String(sig.timestamp));
  fd.append("signature", sig.signature);
  fd.append("folder", sig.folder);
  const up = await fetch(
    `https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`,
    { method: "POST", body: fd },
  );
  const data = await up.json();
  if (!up.ok || !data.secure_url)
    throw new Error(data?.error?.message || "Upload failed.");
  return data.secure_url as string;
}

export function SingleImageUpload({
  value,
  onChange,
}: {
  value?: string;
  onChange: (url: string | undefined) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handle(file?: File) {
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      onChange(await uploadToCloudinary(file));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div>
      <div className="flex items-start gap-3">
        <div className="relative w-32 h-24 bg-grey-50 border border-grey-200 overflow-hidden shrink-0">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="Section" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full grid place-items-center text-grey-400 text-xs">
              No image
            </div>
          )}
        </div>
        <div className="space-y-2">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={busy}
            className="font-display text-xs tracking-button border border-grey-300 px-3 py-2 rounded-button hover:border-ink disabled:opacity-50"
          >
            {busy ? "Uploading…" : value ? "Replace image" : "Upload image"}
          </button>
          {value && (
            <button
              type="button"
              onClick={() => onChange(undefined)}
              className="block text-xs text-sale underline"
            >
              Remove
            </button>
          )}
        </div>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => handle(e.target.files?.[0])}
      />
      {error && <p className="text-xs text-sale mt-1">{error}</p>}
    </div>
  );
}
