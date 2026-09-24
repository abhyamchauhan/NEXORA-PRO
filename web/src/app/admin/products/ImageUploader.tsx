"use client";

import { useRef, useState } from "react";

type Props = {
  mode: "static" | "rotation360";
  images: string[];
  labels: string[];
  onChange: (images: string[], labels: string[]) => void;
};

const STATIC_SUGGESTIONS = ["Front", "Back", "Side", "Close-up", "Detail", "Fit"];

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

export function ImageUploader({ mode, images, labels, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const maxSlots = mode === "rotation360" ? 16 : 6;
  const remaining = maxSlots - images.length;

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setError(null);
    setBusy(true);
    const nextImages = [...images];
    const nextLabels = [...labels];
    try {
      for (const file of Array.from(files).slice(0, remaining)) {
        const url = await uploadToCloudinary(file);
        nextImages.push(url);
        nextLabels.push(
          mode === "static"
            ? STATIC_SUGGESTIONS[nextImages.length - 1] ?? ""
            : "",
        );
        onChange([...nextImages], [...nextLabels]);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Upload failed.");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function removeAt(i: number) {
    onChange(
      images.filter((_, idx) => idx !== i),
      labels.filter((_, idx) => idx !== i),
    );
  }

  function setLabel(i: number, value: string) {
    const next = [...labels];
    next[i] = value;
    onChange(images, next);
  }

  function move(i: number, dir: -1 | 1) {
    const j = i + dir;
    if (j < 0 || j >= images.length) return;
    const ni = [...images];
    const nl = [...labels];
    [ni[i], ni[j]] = [ni[j], ni[i]];
    [nl[i], nl[j]] = [nl[j], nl[i]];
    onChange(ni, nl);
  }

  const target =
    mode === "rotation360"
      ? "12–16 photos, garment rotated in even increments (turntable recommended). Order = rotation order."
      : "4–6 photos. Add a short caption for each (Front, Back, Side, Close-up).";

  return (
    <div>
      <p className="text-xs text-grey-500 mb-3">{target}</p>

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
        {images.map((url, i) => (
          <div key={url + i} className="border border-grey-200 bg-white">
            <div className="relative aspect-square bg-grey-50">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt={labels[i] || `Image ${i + 1}`}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-1 left-1 bg-ink text-white text-[10px] px-1.5 py-0.5 font-display tracking-button">
                {mode === "rotation360"
                  ? `Photo ${i + 1} of ${maxSlots}`
                  : `${i + 1}`}
              </span>
            </div>
            <div className="p-1.5 space-y-1">
              {mode === "static" && (
                <input
                  value={labels[i] ?? ""}
                  onChange={(e) => setLabel(i, e.target.value)}
                  placeholder="Caption"
                  className="w-full border border-grey-200 px-1.5 py-1 text-xs outline-none focus:border-ink"
                />
              )}
              <div className="flex items-center justify-between text-[11px]">
                <div className="flex gap-1">
                  <button type="button" onClick={() => move(i, -1)} className="px-1 hover:text-ink text-grey-400">←</button>
                  <button type="button" onClick={() => move(i, 1)} className="px-1 hover:text-ink text-grey-400">→</button>
                </div>
                <button
                  type="button"
                  onClick={() => removeAt(i)}
                  className="text-sale hover:underline"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}

        {remaining > 0 && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={busy}
            className="aspect-square border border-dashed border-grey-300 flex flex-col items-center justify-center text-grey-500 hover:border-ink hover:text-ink transition-colors disabled:opacity-50"
          >
            <span className="text-2xl leading-none">+</span>
            <span className="text-[11px] mt-1">
              {busy ? "Uploading…" : "Add photo"}
            </span>
          </button>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => handleFiles(e.target.files)}
      />

      <p className="text-xs text-grey-400 mt-2">
        {images.length}/{maxSlots} photos
      </p>
      {error && <p className="text-xs text-sale mt-1">{error}</p>}
    </div>
  );
}
